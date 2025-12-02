---
created: 2025-11-23
tags: [knowledge/technical/workspace, macos, ios, productivity, ai]
---

# macOS & iOS 语音输入配置：Willow Voice

## 为什么要用语音输入

手腕打字打久了会疼，尤其是长时间写代码的时候。所以搞了个语音输入的方案，可以直接用说的来跟 AI 编程助手交流，减少打字，手腕轻松多了。

> **说明**：本文使用上述语音输入配合 Claude Code 完成。

## 配置方法

### 应用程序
- **[Willow Voice](https://willowvoice.com/?ref=JC5OO6)** - 首选方案。速度快，内置转录功能，无需配置 API。（$12-15/月）
- *备选*：**[Spokenly](https://spokenly.app/)** - 更便宜的选择，可以使用自己的 API（需要配置）。

### 转录 API（仅 Spokenly 需要）
- **[ElevenLabs](https://elevenlabs.io/app/developers/api-keys)** - 提供语音转文字的转录服务，识别质量不错
- 转录模型：**[scribe_v2](https://elevenlabs.io/docs/models#scribe-v2-realtime)**（目前用的是普通版本，Spokenly 还不支持这个模型的实时版本，截至 2025-11-23）
- **价格**：使用最新的转录模型至少需要订阅 Starter 套餐（每月 $5）
- **免费选项**：Spokenly 也支持本地模型，在本地机器上运行（完全免费）

### 硬件（可选）
- **外置麦克风** - 仅在 macOS 合盖模式下需要
- macOS 隐私功能会在合盖时禁用内置麦克风
- 如果开盖使用 Mac 或使用 iOS 设备，内置麦克风就够用了
- 有线耳机就挺好 - 麦克风很小，随便放桌上哪都行

## 怎么用

1. 随时按快捷键（我设的是右 Command 键）就能语音输入
2. 任何文本输入框都能用 - 我主要用在 Claude Code 的输入框
3. 录音和转录结果都会自动保存到本地，还带时间戳
   - 可以写个小脚本分析自己的说话习惯，挺好玩的

### 使用场景（按频率排序）

**1. 最常用 - 日常默认**
- 有线耳机的麦克风放在桌面顺手的位置
- 小巧方便
- 平时主要就这么用

**2. 次常用 - 晚上**
- 手持麦克风
- 可以小声说话同时保持清晰度
- 需要降低噪音时使用

**3. 最少用 - 手累时的备选**
- 用瓶子或其他物品当麦克风支架
- 仅在手持麦克风不舒服时使用
- 很少出现

![语音输入设置](https://cdn.luohy15.com/voice-input-setup.png)
