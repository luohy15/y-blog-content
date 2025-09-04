---
created: 2025-07-12
updated: 2025-07-12
tags: [work/personal/y, claude-code, open-router]
---

# Building y-router: A Bridge Between Claude Code and OpenRouter

As a long-time Cline user, I was naturally curious when Claude Code suddenly gained popularity. However, I couldn't get started due to access limitations until I discovered the [claude-code-router](https://egoist.dev/claude-code-free) project, which finally let me experience it—and it was indeed impressive.

The only issue was that claude-code-router required running locally, but I had previous experience migrating MCP servers from local to Cloudflare, so I quickly decided to move this router to the cloud as well.

Before diving in, I did two things to familiarize myself with the project:

**First, I added prompt caching support to claude-code-router.** It didn't support this feature at the time, so I implemented it myself, which helped me understand the project structure. I wrote a [detailed walkthrough](https://luohy15.com/claude-code-prompt-caching/) of this process.

**Second, I analyzed the API differences between Cline and Claude Code in detail.** I carefully examined how the two tools differ in their request parameters and wrote a [comparison article](https://luohy15.com/compare-cline-and-claude-code/), which gave me clarity on what needed to be done.

## From Idea to Implementation

With that foundation, the actual development was straightforward. I shared the relevant claude-code-router code with Claude Code and had it help me rewrite it for Cloudflare Workers. Honestly, the process went much smoother than expected—everything was working within a single evening.

To make it easy for others to use, I added a simple [documentation page](https://cc.yovy.app/).

The project code is also available on [GitHub](https://github.com/luohy15/y-router).

## Technical Overview

y-router is essentially an API translation layer with a simple workflow: it accepts Anthropic-format requests, converts them to OpenAI format for OpenRouter, then converts the results back to Anthropic format. It supports both streaming and non-streaming response modes.

This way, Claude Code thinks it's talking to Anthropic while actually using OpenRouter's services. A simple proxy solves the API compatibility issue, making Claude Code accessible to more users.