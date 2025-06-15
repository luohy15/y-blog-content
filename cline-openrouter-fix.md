# Fixing Cline's OpenRouter 403 Provider Error with Cloudflare AI Gateway

> Note: This article was primarily generated using Cline (an AI coding assistant) + OpenRouter with Claude 3.5 Sonnet.
>
> Related GitHub issue: [OpenRouter 403 Provider Error](https://github.com/cline/cline/issues/1336)

## Problem
Cline users are encountering 403 provider errors when making requests through OpenRouter.

## Quick Fix
Use Cloudflare AI Gateway to route your OpenRouter requests:

1. Sign up for Cloudflare
2. Go to AI Gateway section
3. Update your OpenRouter base URL:

Before:
![](https://cdn.luohy15.com/cline-openrouter-fix-0.png)

After: (Option 1 - Recommended approach, with prompt caching):
![](https://cdn.luohy15.com/cline-openrouter-fix-2.png)
* requires Cline version with PR [#1397](https://github.com/cline/cline/pull/1397) (not merged)

After: (Option 2 - Recommended approach, with prompt caching):
![](https://cdn.luohy15.com/cline-openrouter-fix-3.png)
* requires Cline version with PR [#2040](https://github.com/cline/cline/pull/2040) (not merged)

After: (Option 3 - Temporary use, no prompt caching, very expensive):
![](https://cdn.luohy15.com/cline-openrouter-fix-1.png)

```javascript
const baseURL = "https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openrouter";
```

For detailed setup: https://developers.cloudflare.com/ai-gateway/providers/openrouter/
