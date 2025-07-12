# 我的 AI 编程工具使用记录
## 我的背景

我是一名普通的工作了 6 年的后端程序员，也写过简单的前端项目，之前在大厂小公司都待过，感兴趣的朋友可以看我的 [简历](https://cdn.luohy15.com/cv_cn.pdf)。

因为对技术比较感兴趣，各个语言的项目基本上都接触过，之前的工作中主要用 Java 写 CRUD，Github 上有两个 100+ 星的 AI 聊天练手项目（都是用 AI 编程工具写的），分别是 Python ([y-cli](https://github.com/luohy15/y-cli)) 和 Typescript ([y-gui](https://github.com/luohy15/y-gui)) 项目。

除了开发，也接触过一些 DevOps/CI/CD 的项目，在之前的工作的小公司也完整维护过公司所有的云服务基础设施。

## 编程工具上手记录

![](https://cdn.luohy15.com/ai-coding-tools-using-experience-1.png)

从GitHub 热力图可以很明显看到编程工具对我的助力，我变得更爱写代码了（因为反馈更快了）。

- 24年11月 开始接触到 OpenRouter，在榜一看到 Cline 和 Claude 3.5 Sonnet（Cline 一直都是 OpenRouter 应用榜一），开始尝试使用，逐渐成为深度用户
- 24年12月 也尝试使用了 Cursor，开了会员，但是当时在一个 FastAPI 项目中 Cursor 竟然给我生成 Flask 的代码，我感觉很蠢直接卸载了；后续还尝试装过一次，也没有使用起来，主要有两个原因
	- 更喜欢 Cline 这种可以手动管理上下文的工具
	- VS Code 使用习惯了（我甚至一直用 VS Code 写 Java 项目）
- 25年1月 直连 OpenRouter 开始报错（区域限制），所以 [找到了 Cloudflare AI Gateway](https://luohy15.com/zhs/cline-openrouter-fix/)  来代理，可以继续稳定使用了，尝试给 Cline 项目提交过支持自定义 OpenRouter Base Url 的代码，没有被合并，所以我一直都在用自定义的版本（另一个方面来看，这避免了这个方案大范围使用，使得这个方案没有被封禁保持可用）
- 25年1月 开始使用 Cline 构建 y-cli 的代码
- 25年2月 Claude Sonnet 从 3.5 升级到 3.7
- 25年3月 开始使用 Cline 构建 y-gui 的代码
- 25年5月 因为在 y-gui 的 README 中提到了 DeepWiki, Devin 送了我 $500 的 open source grant credit，尝试使用了几次，不习惯每个 session 都 commit 的模式（更习惯根据自己想法决定什么时候 commit），就没有继续使用
- 25年6月 Claude Sonnet 从 3.7 升级到 4
- 25年7月 [开始使用 Claude Code](https://luohy15.com/zhs/compare-cline-and-claude-code/)，用不到一晚上就跑通了 [y-router](https://luohy15.com/zhs/building-y-router/) 的逻辑，最近开销已经超过 Cline

## 主要用来做什么

编程工具主要肯定用来编程，写 Java CRUD 代码、y-gui 和 y-cli 聊天应用代码，其实一个模型能编程的话，那其余事情是更简单的，所以除此以外我也用来写项目文档，个人笔记和 Blog，也结合脚本命令做一些文件批量管理操作。
 
Cline 和 Claude Code 的任务历史理论上都是可以拿到的，也可以写一个工具分析使用的目的。

## 喜欢用什么模型

![](https://cdn.luohy15.com/ai-coding-tools-using-experience-2.png)

编程基本只用 Claude Sonnet 。Gemini 主要是 y-gui 消耗的，闲聊使用。

## 成本花销

每个月在 100 刀左右，切换到 Claude Code 后使用频率更高了，如果模型后续没有降价预计每月成本会更高。

![](https://cdn.luohy15.com/ai-coding-tools-using-experience-3.png)

## 个人体感
### Claude 3.5 Sonnet

Claude 3.5 Sonnet 是一款跨时代的模型，从这个模型开始 AI 编程开始达到可用的状态。编程场景用且只用 Claude。

### Cline

Cline 是我的 AI 编程启蒙工具，教会了我很多 AI 编程相关的知识。

Cline 体感比较明显的升级：

- write_file 升级到 replace_in_file，大幅减少 token 输出，1000 行以内的 java 项目也可以用了
- 增加 plan mode，这样就可以先 review 方案再执行，可以很轻松地把思路理清

### Claude Code

Claude Code 相比 Cline 的优势：

- 是标准的 tools 参数调用（Cline 为了支持更多模型，把 tools 参数说明放到 system prompt ），理论上效果会更好一些
- 比 Cline 少了很多鼠标点击操作，对于键盘党来说使用更加便捷，使用频率更高
- 可以出现在更多地方，比如 CI/CD 流水线中

### 区域限制

区域限制可以是中国程序员的劣势，也可以是优势。在研究如何绕过限制的过程中，不可避免需要接触很多细节，了解使用原理。
