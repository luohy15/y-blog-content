---
created: 2025-07-06
updated: 2025-07-06
tags: [knowledge/technical/ai-coding, claude-code]
---

# Adding Prompt Caching Support to Claude Code with OpenRouter

> **Note**: As of Claude Code version 1.0.15+, prompt caching is now natively supported. This post documents the work done to add prompt caching via OpenRouter before native support was available and serves primarily as a development log.

## Background

Claude Code is Anthropic's official CLI tool that allows developers to interact with Claude AI models directly from the terminal. However, there are scenarios where developers might want to use Claude Code with OpenRouter instead of Anthropic's official API - whether for cost optimization, accessing different model providers, leveraging regional availability, or taking advantage of specific routing features.

[claude-code-router](https://github.com/musistudio/claude-code-router) by musistudio provides a bridge between Claude Code and OpenRouter, allowing users to leverage alternative models and routing capabilities. While this opens up new possibilities, it can still be expensive when processing large codebases repeatedly due to token costs. Building on this foundation, I added prompt caching support to reduce token costs when working with large contexts.

## What is Prompt Caching?

Prompt caching allows models to cache portions of the input prompt that remain consistent across requests. Instead of re-processing the same context (like file contents or system prompts) every time, the model can reuse the cached computation, resulting in:

- **Significant cost savings** - Cached tokens typically cost much less than fresh tokens

## Implementation

The key to enabling prompt caching was adding the `cache_control` field to message content. This field tells the model which parts of the prompt should be cached for future requests.

Here's how the implementation works:

1. **Identify cacheable content** - System prompts, file contents, and other static context
2. **Add cache_control markers** - Mark appropriate content blocks for caching

```javascript
// Example of adding cache_control to message content
{
  "role": "user", 
  "content": [
    {
      "type": "text",
      "text": "Here is the codebase context...",
      "cache_control": {"type": "ephemeral"}
    },
    {
      "type": "text", 
      "text": "Now help me with this specific task..."
    }
  ]
}
```

## Benefits

With prompt caching enabled through the router:

- **Cost reduction** - Large codebase contexts can be cached, reducing repeat token costs
- **Seamless workflow** - Works transparently with existing Claude Code workflows

## Usage

To use Claude Code with prompt caching via OpenRouter:

1. Set up [claude-code-router](https://github.com/musistudio/claude-code-router) with prompt caching support
   - For prompt caching functionality, use my fork: [luohy15/claude-code-router/commits/prompt_cache](https://github.com/luohy15/claude-code-router/commits/prompt_cache/)
2. Use Claude Code normally - caching happens automatically

## Conclusion

Adding prompt caching support to Claude Code through the router provided a practical way to reduce costs when working with large codebases before native support was available. While the performance impact was minimal, the cost savings could be substantial for developers who frequently iterated on the same projects.

This work demonstrated how community tools could extend official applications in valuable ways. With native prompt caching support now available in Claude Code 1.0.15+, users can directly benefit from these optimizations without requiring additional routing tools.