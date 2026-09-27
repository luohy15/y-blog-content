import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';

const site = 'https://luohy15.com';
const source = 'https://cdn.luohy15.com/blog/';
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const root = process.cwd();
if (!process.env.RUNNER_TEMP) fail('RUNNER_TEMP must be set for redirect manifest');
const languages = ['', ...readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(root, entry.name, 'index.jsonl')))
  .map((entry) => entry.name).sort()];
const tracked = new Set(execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0'));
const outputs = new Map();
const indexes = new Map();
const tagIndexes = new Map();
const stubKeys = new Set();
const stubs = [];
const retiredTags = ['y-agent', 'ai-coding'];

function addStub(key, target) {
  if (tracked.has(key) || outputs.has(key) || stubKeys.has(key)) fail(`Redirect collides with content: ${key}`);
  stubKeys.add(key);
  stubs.push({ key, location: link(target) });
}

function fail(message) { throw new Error(message); }
function page(lang, name) { return `${lang ? `${lang}/` : ''}${name}`; }
function link(key) { return `${site}/${key}`; }
function escapeTitle(title) { return title.replace(/[\\[\]]/g, '\\$&').replace(/\s+/g, ' '); }
function postLine(post) { return `- [${escapeTitle(post.title)}](${link(post.key)}) (created ${post.create_time})`; }
function add(key, text) {
  if (tracked.has(key) || outputs.has(key) || stubKeys.has(key)) fail(`Generated path collides with content: ${key}`);
  outputs.set(key, `${text}\n`);
}

for (const lang of languages) {
  const indexPath = page(lang, 'index.jsonl');
  const lines = readFileSync(join(root, indexPath), 'utf8').split(/\r?\n/).filter((line) => line.trim());
  if (!lines.length) fail(`Empty index: ${indexPath}`);
  const posts = [];
  const keys = new Set();
  for (const [number, line] of lines.entries()) {
    let entry;
    try { entry = JSON.parse(line); } catch { fail(`Invalid JSON in ${indexPath}, entry ${number + 1}`); }
    const prefix = page(lang, '');
    if (typeof entry?.title !== 'string' || !entry.title.trim() ||
        !/^\d{4}-\d{2}-\d{2}$/.test(entry.create_time) ||
        typeof entry.url !== 'string' || !entry.url.startsWith(source + prefix)) {
      fail(`Invalid post in ${indexPath}, entry ${number + 1}`);
    }
    const slug = entry.url.slice((source + prefix).length).replace(/\.md$/, '');
    const key = page(lang, `${slug}.md`);
    if (!slugPattern.test(slug) || entry.url !== source + key || !existsSync(join(root, key)) || keys.has(key) ||
        (entry.tags != null && (!Array.isArray(entry.tags) || entry.tags.some((tag) => typeof tag !== 'string' || !slugPattern.test(tag))))) {
      fail(`Invalid post path or tags in ${indexPath}, entry ${number + 1}`);
    }
    keys.add(key);
    posts.push({ title: entry.title, create_time: entry.create_time, key, tags: entry.tags ?? [] });
  }
  if (!keys.has(page(lang, 'about.md'))) fail(`Missing About in ${indexPath}`);
  posts.sort((a, b) => b.create_time.localeCompare(a.create_time));
  indexes.set(lang, posts);
  add(page(lang, 'writing.md'), `# Writing\n\n${posts.map(postLine).join('\n')}`);
  const byTag = new Map();
  for (const post of posts) {
    for (const tag of new Set(post.tags)) {
      if (!byTag.has(tag)) byTag.set(tag, []);
      byTag.get(tag).push(post);
    }
  }
  const tags = [...byTag.keys()].sort();
  tagIndexes.set(lang, tags);
  add(page(lang, 'tags.md'), `# Tags\n\n${tags.map((tag) => `- [${tag}](${link(page(lang, `tags/${tag}.md`))}) (${byTag.get(tag).length})`).join('\n')}`);
  for (const tag of tags) {
    add(page(lang, `tags/${tag}.md`), `# ${tag}\n\n${byTag.get(tag).map(postLine).join('\n')}`);
  }
}

// The site's tag resolver accepts canonical and retired base64url segments.
for (const [lang, tags] of tagIndexes) {
  const aliases = new Map();
  for (const tag of tags) {
    aliases.set(`t.${Buffer.from(tag).toString('base64url')}`, tag);
    if (tag === 'ai-agent') {
      for (const oldTag of retiredTags) {
        aliases.set(`t.${Buffer.from(oldTag).toString('base64url')}`, tag);
      }
    }
  }
  for (const [segment, tag] of aliases) {
    if (tags.includes(segment)) continue;
    addStub(page(lang, `tags/${segment}.md`), page(lang, `tags/${tag}.md`));
  }
}

let redirects;
try { redirects = JSON.parse(readFileSync(join(root, 'redirects.json'), 'utf8')); }
catch { fail('Invalid redirects.json'); }
if (!redirects || Array.isArray(redirects) || typeof redirects !== 'object') fail('Invalid redirects.json');
for (const [oldSlug, newSlug] of Object.entries(redirects)) {
  if (!slugPattern.test(oldSlug) || typeof newSlug !== 'string' || !slugPattern.test(newSlug)) fail('Invalid redirect slug');
  for (const [lang, posts] of indexes) {
    if (!posts.some((post) => post.key === page(lang, `${newSlug}.md`))) continue;
    addStub(page(lang, `${oldSlug}.md`), page(lang, `${newSlug}.md`));
  }
}

const entries = [...indexes.keys()].map((lang) => {
  const label = lang || 'en';
  return `- ${label}: [About](${link(page(lang, 'index.md'))}), [Writing](${link(page(lang, 'writing.md'))}), [Tags](${link(page(lang, 'tags.md'))})`;
});
add('llms.txt', `# Huayi Luo\n\nPersonal writing on software, AI agents, and travel.\n\nAppend .md to a page URL to read its Markdown. The home page is /index.md.\n\n## Languages\n\n${entries.join('\n')}\n\n## English articles and pages\n\n${indexes.get('').map(postLine).join('\n')}`);

for (const [key, text] of outputs) {
  mkdirSync(dirname(join(root, key)), { recursive: true });
  writeFileSync(join(root, key), text);
}
writeFileSync(join(process.env.RUNNER_TEMP, 'redirect-stubs.json'), JSON.stringify(stubs, null, 2) + '\n');
console.log(`Generated ${outputs.size} navigation files and ${stubs.length} redirect stubs`);
