---
created: 2024-11-01
updated: 2025-09-04
tags: [knowledge/technical/ai-coding, cline, cursor, claude-code]
---

# 我的 AI 编程工具使用记录

## 我的背景

我是一个普通的后端程序员，有 6 年经验，也写过一些简单的前端项目。大厂小厂都待过。感兴趣的话可以看看我的[简历](https://cdn.luohy15.com/cv.pdf)。

因为对技术比较感兴趣，基本上各种语言的项目都接触过。之前工作主要用 Java 写 CRUD 代码。GitHub 上有两个各 100 star 的 AI 聊天练习项目（都是用 AI 编程工具写的），分别是 Python（[y-cli](https://github.com/luohy15/y-cli)）和 TypeScript（[y-gui](https://github.com/luohy15/y-gui)）项目。

除了开发，我也参与过一些 DevOps/CI/CD 项目，在之前的小公司完整维护过所有云服务基础设施。

## 编程工具历程

![](https://cdn.luohy15.com/ai-coding-tools-using-experience-1.png)

从 GitHub 热力图可以明显看到编程工具带给我的提升——我变得更热衷于写代码了（因为反馈快了很多）。

- 2025年8月 因为7月用了超过 $200，决定开始用 Claude Max Plan 配合 AWS 上的 relay service。用的是这个项目：[claude-relay-service](https://github.com/Wei-Shaw/claude-relay-service)
- 2025年7月 [开始用 Claude Code](https://luohy15.com/compare-cline-and-claude-code/)，不到一个晚上就把 [y-router](https://luohy15.com/building-y-router/) 的逻辑跑通了，最近的花费已经超过 Cline
- 2025年6月 Claude Sonnet 从 3.7 升级到 4
- 2025年5月 因为在 y-gui 的 README 里提到了 DeepWiki，Devin 给了我 $500 的开源赞助额度。试用了几次，但不太习惯每次 session 都提交的模式（我更喜欢按自己的想法决定何时提交），就没继续用了
- 2025年3月 开始用 Cline 构建 y-gui 代码
- 2025年2月 Claude Sonnet 从 3.5 升级到 3.7
- 2025年1月 开始用 Cline 构建 y-cli 代码
- 2025年1月 直连 OpenRouter 开始报错（地区限制），于是[找到 Cloudflare AI Gateway](https://luohy15.com/cline-openrouter-fix/) 做代理，得以继续稳定使用。我试过给 Cline 项目提交代码支持自定义 OpenRouter Base URL，但没被合并，所以一直在用自定义版本（换个角度看，这反而阻止了方案被广泛使用，使其不会被封禁）
- 2024年12月 也试过 Cursor，开了会员，但当时 Cursor 居然在 FastAPI 项目里给我生成 Flask 代码，觉得太蠢就直接卸载了；后来又装过一次但也没怎么用，主要两个原因：
	- 我更喜欢 Cline 这种可以手动管理上下文的工具
	- 我习惯了 VS Code（连 Java 项目我都用 VS Code）
- 2024年11月 开始接触 OpenRouter，看到 Cline 和 Claude 3.5 Sonnet 在排行榜榜首（Cline 一直是 OpenRouter 上排名第一的应用），开始尝试使用并逐渐成为重度用户

## 主要用途

编程工具当然主要用来写代码——写 Java CRUD 代码、y-gui 和 y-cli 聊天应用代码。其实模型能写代码的话，其他事情就更简单了，所以除此之外，我还用来写项目文档、个人笔记和博客文章，以及配合脚本命令做批量文件管理操作。

Cline 和 Claude Code 的任务历史理论上都可以访问，所以可以写个工具来分析使用用途。

## 偏好的模型

![](https://cdn.luohy15.com/ai-coding-tools-using-experience-2.png)

编程方面，我基本只用 Claude Sonnet。Gemini 主要是 y-gui 日常聊天消耗的。

## 费用支出

大约每月 $100。切换到 Claude Code 后使用频率增加了，所以如果模型未来不降价的话，月费用预计会更高。

![](https://cdn.luohy15.com/ai-coding-tools-using-experience-3.png)

## 个人感受

### Claude 3.5 Sonnet

Claude 3.5 Sonnet 是一个划时代的模型。从这个模型开始，AI 编程才真正达到可用的状态。编程场景下，我用的而且只用 Claude。

### Cline

Cline 是我 AI 编程的启蒙工具，教会了我很多 AI 编程相关的知识。

Cline 值得一提的升级：

- 从 write_file 升级到 replace_in_file，大幅减少了 token 输出，使得即使是 1000 行以内的 Java 项目也能用
- 加入了 plan mode，可以在执行前先审查方案，方便理清思路

### Claude Code

Claude Code 相比 Cline 的优势：

- 使用标准的 tools parameter 调用（Cline 为了支持更多模型把 tools parameter 描述放在 system prompt 里），理论上效果更好
- 相比 Cline 鼠标点击操作少很多，对键盘用户更方便，使用频率更高
- 可以出现在更多地方，比如 CI/CD 流水线

### 地区限制

地区限制对中国程序员来说既是劣势也是优势。在研究如何应对限制的过程中，你不可避免地需要接触很多细节、理解底层原理。
