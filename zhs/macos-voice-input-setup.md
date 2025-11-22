---
created: 2025-11-23
tags: [knowledge/technical/workspace, macos, productivity, ai]
---

# macOS 语音输入配置：Spokenly + Eleven Labs

## 为什么要用语音输入

手腕打字打久了会疼，尤其是长时间写代码的时候。所以搞了个语音输入的方案，可以直接用说的来跟 AI 编程助手交流，减少打字，手腕轻松多了。

![语音输入设置](https://cdn.luohy15.com/voice-input-setup.png)

## 配置方法

### 语音识别
- **[Spokenly](https://spokenly.app/)** - 很轻量的 macOS/iOS 应用，配置简单，直接对接 ElevenLabs 这些 API

### 语音转文字
- **[Eleven Labs](https://elevenlabs.io/app/developers/api-keys)** - 识别质量不错，之前做 AI 聊天应用的时候用过他们的 API
- 转录模型：**[scribe_v2](https://elevenlabs.io/docs/models#scribe-v2-realtime)**（目前用的是普通版本，Spokenly 还不支持实时模型，截至 2025-11-23）

## 怎么用

1. 随时按快捷键（我设的是右 Command 键）就能语音输入
2. 任何文本输入框都能用 - 我主要用在 Claude Code 的输入框
3. 录音和转录结果都会自动保存到本地，还带时间戳
   - 可以写个小脚本分析自己的说话习惯，挺好玩的
