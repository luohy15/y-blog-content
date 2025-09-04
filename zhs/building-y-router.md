---
created: 2025-07-12
updated: 2025-07-12
tags: [work/personal/y, claude-code, open-router]
---

# 构建 y-router：连接 Claude Code 和 OpenRouter

作为一个长期的 Cline 用户，最近看到 Claude Code 突然火了起来，自然想要尝试一下。但是受到访问限制，一直没能用上，直到发现了 [claude-code-router](https://egoist.dev/claude-code-free) 这个项目才终于体验了一把，确实感觉很不错。

不过 claude-code-router 需要在本地运行，我想着能不能部署到云端，正好之前有过把 MCP server 迁移到 Cloudflare 的经验。

在实际动手之前，我先做了两件事来熟悉项目：

**第一件事是给 claude-code-router 添加 prompt caching 支持。** 当时它还不支持这个功能，我就自己动手加了一下，顺便摸清楚了整个项目的结构。这个过程我写了[详细记录](https://luohy15.com/zhs/claude-code-prompt-caching/)。

**第二件事是深入对比 Cline 和 Claude Code 的 API 调用差异。** 我仔细分析了两者在请求参数层面的不同，写成了[对比文章](https://luohy15.com/zhs/compare-cline-and-claude-code/)，基本搞清楚了需要做什么改动。

## 从想法到实现

有了前面的基础，实际开发就水到渠成了。我把 claude-code-router 的相关代码发给 Claude Code，让它帮我重写成部署到 Cloudflare Workers 的版本。说实话，整个过程比想象中顺利得多，一个晚上就跑通了。

为了方便使用，我加了个简单的[说明页面](https://cc.yovy.app/)。

项目代码也放到了 [GitHub](https://github.com/luohy15/y-router) 上。

## 技术原理

y-router 本质上就是一个 API 翻译层，工作原理很简单：接受 Anthropic 格式的请求，转换成 OpenAI 格式发给 OpenRouter，然后把结果再转换回 Anthropic 格式返回。支持流式和非流式两种响应模式。

这样 Claude Code 就以为自己在和 Anthropic 对话，实际上用的是 OpenRouter 的服务。一个简单的代理就解决了 API 兼容性问题，让更多人能用上 Claude Code。