# Y-Blog Content

This repository contains the content for [Roy's Blog](https://github.com/luohy15/y-blog), a multilingual technical blog built with Vite + React.

## About

This is the content repository for a personal technical blog covering topics in software development, DevOps, productivity tools, and technology experiences. The blog is authored by Roy ([@luohy15](https://github.com/luohy15)), a full stack developer and open source contributor.

## Repository Structure

The content is organized by language with each language having its own directory:

```
├── README.md
├── index.jsonl          # English articles metadata
├── about.md             # English about page
├── [article].md         # English articles
├── ja/                  # Japanese content
│   ├── index.jsonl
│   └── about.md
├── zhs/                 # Simplified Chinese content
│   ├── index.jsonl
│   ├── about.md
│   └── [article].md
└── zht/                 # Traditional Chinese content
    ├── index.jsonl
    └── about.md
```

### Language Codes
- **Root level**: English (en)
- **`ja/`**: Japanese (日本語)
- **`zhs/`**: Simplified Chinese (简体中文)
- **`zht/`**: Traditional Chinese (繁體中文)

## Content Types

### Articles
The blog covers various technical topics including:

- **Development Tools**: y-cli, Cline, Git, CLI tools
- **Programming**: Go, ES6, Reactive Programming, Math in Programming
- **DevOps**: Docker, Ansible, Drone CI
- **Productivity**: Desktop tools, Command line utilities
- **Personal**: Travel experiences, Accounting methods

### Metadata Format
Each language directory contains an `index.jsonl` file with article metadata:

```json
{
  "title": "Article Title",
  "create_time": "2025-01-01",
  "update_time": "2025-01-01",
  "url": "https://cdn.luohy15.com/blog/article-name.md"
}
```

## Integration with Blog

This content repository is consumed by the [Y-Blog application](https://github.com/luohy15/y-blog) (Vite + React, deployed as a static site to S3 + CloudFront), which:

- Fetches each language's `index.jsonl` from `https://cdn.luohy15.com/blog/` (root for English, `<lang>/` subpath for others)
- Loads each article's markdown from the `url` field at runtime
- Renders markdown via `react-markdown` with `rehype-highlight` for syntax highlighting and `remark-gfm` for GitHub-flavored markdown
- Provides multilingual navigation and routing via React Router

## Content Guidelines

### File Naming
- Use kebab-case for markdown files (e.g., `my-article.md`)
- Maintain consistent naming across language directories
- Include appropriate file extensions (`.md` for markdown)

### Metadata
- Keep `index.jsonl` files updated when adding/modifying articles
- Use ISO date format (YYYY-MM-DD) for timestamps
- Ensure URL paths match the CDN structure

### Markdown
- Follow standard markdown syntax
- Use appropriate heading hierarchy (H1 for title, H2+ for sections)
- Include code blocks with language specifications for syntax highlighting

## Author

**Roy** ([@luohy15](https://github.com/luohy15))
- Full Stack Developer / Open Source Amateur
- [Twitter](https://twitter.com/myroy15)
- [Telegram](https://t.me/luohy15)
- [Keybase](https://keybase.io/luohy15)

## License

Content in this repository is authored by Roy. Please respect intellectual property rights when using or referencing this content.
