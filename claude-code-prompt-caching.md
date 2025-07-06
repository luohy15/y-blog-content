# Adding Prompt Caching Support to Claude Code with OpenRouter

## Background

Claude Code is Anthropic's official CLI tool that allows developers to interact with Claude AI models directly from the terminal. While powerful, it can be expensive when processing large codebases repeatedly due to token costs. This is where prompt caching becomes valuable - not for performance improvements, but for significant cost reduction.

[claude-code-router](https://github.com/musistudio/claude-code-router) by musistudio provides a bridge between Claude Code and OpenRouter, allowing users to leverage alternative models and routing capabilities. Building on this foundation, I added prompt caching support to reduce token costs when working with large contexts.

## What is Prompt Caching?

Prompt caching allows models to cache portions of the input prompt that remain consistent across requests. Instead of re-processing the same context (like file contents or system prompts) every time, the model can reuse the cached computation, resulting in:

- **Significant cost savings** - Cached tokens typically cost much less than fresh tokens
- **Reduced billing** - Only new/changed portions of the prompt are charged at full rate

## Implementation

The key to enabling prompt caching was adding the `cache_control` field to message content. This field tells the model which parts of the prompt should be cached for future requests.

Here's how the implementation works:

1. **Identify cacheable content** - System prompts, file contents, and other static context
2. **Add cache_control markers** - Mark appropriate content blocks for caching
3. **Handle cache misses** - Gracefully fall back when cache is unavailable

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
- **Flexibility** - Can be toggled on/off as needed

## Usage

To use Claude Code with prompt caching via OpenRouter:

1. Set up [claude-code-router](https://github.com/musistudio/claude-code-router) with prompt caching support
   - For prompt caching functionality, use my fork: [luohy15/claude-code-router/commits/prompt_cache](https://github.com/luohy15/claude-code-router/commits/prompt_cache/)
2. Use Claude Code normally - caching happens automatically

## Conclusion

Adding prompt caching support to Claude Code through the router provides a practical way to reduce costs when working with large codebases. While the performance impact is minimal, the cost savings can be substantial for developers who frequently iterate on the same projects.

This enhancement demonstrates how community tools can extend official applications in valuable ways, making powerful AI development tools more accessible and cost-effective.