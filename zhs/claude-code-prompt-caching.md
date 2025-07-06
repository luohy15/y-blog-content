# 为 Claude Code 使用 OpenRouter 添加提示缓存支持

## 背景

Claude Code 是 Anthropic 的官方 CLI 工具，允许开发者直接从终端与 Claude AI 模型交互。虽然功能强大，但在重复处理大型代码库时，由于 token 成本，它可能会很昂贵。这就是提示缓存发挥作用的地方——不是为了性能改进，而是为了显著降低成本。

musistudio 开发的 [claude-code-router](https://github.com/musistudio/claude-code-router) 在 Claude Code 和 OpenRouter 之间提供了桥梁，允许用户利用替代模型和路由功能。在此基础上，我添加了提示缓存支持，以减少处理大型上下文时的 token 成本。

## 什么是提示缓存？

提示缓存允许模型缓存在请求之间保持一致的输入提示部分。不必每次都重新处理相同的上下文（如文件内容或系统提示），模型可以重用缓存的计算，从而带来：

- **显著的成本节省** - 缓存的 token 通常比新鲜 token 成本低得多
- **减少计费** - 只有提示的新/更改部分按全价收费

## 实现

启用提示缓存的关键是在消息内容中添加 `cache_control` 字段。此字段告诉模型提示的哪些部分应该被缓存以供将来请求使用。

实现的工作原理如下：

1. **识别可缓存内容** - 系统提示、文件内容和其他静态上下文
2. **添加 cache_control 标记** - 为适当的内容块标记缓存
3. **处理缓存未命中** - 当缓存不可用时优雅地回退

```javascript
// 向消息内容添加 cache_control 的示例
{
  "role": "user", 
  "content": [
    {
      "type": "text",
      "text": "这是代码库上下文...",
      "cache_control": {"type": "ephemeral"}
    },
    {
      "type": "text", 
      "text": "现在帮我处理这个特定任务..."
    }
  ]
}
```

## 优势

通过路由器启用提示缓存后：

- **成本降低** - 大型代码库上下文可以被缓存，减少重复 token 成本
- **无缝集成** - 与现有 Claude Code 工作流程透明配合  
- **灵活性** - 可以根据需要开启/关闭

## 使用方法

通过 OpenRouter 使用带有提示缓存的 Claude Code：

1. 设置支持提示缓存的 [claude-code-router](https://github.com/musistudio/claude-code-router)
   - 对于提示缓存功能，使用我的分支：[luohy15/claude-code-router/commits/prompt_cache](https://github.com/luohy15/claude-code-router/commits/prompt_cache/)
2. 正常使用 Claude Code - 缓存会自动生效

## 结论

通过路由器为 Claude Code 添加提示缓存支持，为处理大型代码库时降低成本提供了实用的方法。虽然性能影响很小，但对于经常在同一项目上迭代的开发者来说，成本节省可能是巨大的。

这项增强展示了社区工具如何以有价值的方式扩展官方应用程序，使强大的 AI 开发工具更加易用且经济实惠。