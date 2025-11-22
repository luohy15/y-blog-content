---
created: 2025-11-23
tags: [knowledge/technical/workspace, macos, productivity, ai]
---

# macOS 语音输入配置：Spokenly + Eleven Labs

## 为什么要用语音输入

手腕打字打久了会疼，尤其是长时间写代码的时候。所以搞了个语音输入的方案，可以直接用说的来跟 AI 编程助手交流，减少打字，手腕轻松多了。

> **说明**：本文使用上述语音输入配合 Claude Code 完成。

![语音输入设置](https://cdn.luohy15.com/voice-input-setup.png)

## 配置方法

### 应用程序
- **[Spokenly](https://spokenly.app/)** - 轻量的 macOS/iOS 应用，用来对接转录 API

### 转录 API
- **[Eleven Labs](https://elevenlabs.io/app/developers/api-keys)** - 提供语音转文字的转录服务，识别质量不错
- 转录模型：**[scribe_v2](https://elevenlabs.io/docs/models#scribe-v2-realtime)**（目前用的是普通版本，Spokenly 还不支持实时模型，截至 2025-11-23）

## 怎么用

1. 随时按快捷键（我设的是右 Command 键）就能语音输入
2. 任何文本输入框都能用 - 我主要用在 Claude Code 的输入框
3. 录音和转录结果都会自动保存到本地，还带时间戳
   - 可以写个小脚本分析自己的说话习惯，挺好玩的
