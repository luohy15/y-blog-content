# y-agent：基于 coding agent 的个人 AI Agent 系统

> [y-agent](https://github.com/luohy15/y-agent) 从之前的 [y-cli](https://luohy15.com/zhs/y-cli-introduction) 项目重命名而来。
> y-cli 是对 model API 的封装
> y-agent 是对 coding agent 的封装

## 效果示例

![y-agent TraceView](https://cdn.luohy15.com/y-agent-demo-4.png)

https://yovy.app/t/6fc5c4

---

像 Claude Code / Codex 这样的 coding agent，写代码确实好用，但代码只是我日常信息的一部分。我还有账本、日程、任务、笔记、邮件这些。我希望 agent 也能帮我处理它们，不光是代码。

这篇博客记录 coding agent 拓展成个人 agent 系统时遇到的三个点，按遇到的顺序：
1. 怎么把 context 提供给 agent
2. 怎么让 agent 常驻
3. agent 编排

## Context 管理

基本思路是：人能看到的数据，agent 也应该看得到。

原始文件这一层，人和 agent 走的是一条路。人用编辑器、浏览器之类的工具看和改，agent 就用 read、write、edit。

再往上一层——直接编辑文件搞不定、或者效率太低的事，人会用 GUI，agent 这边对应的就是 CLI。它其实挺喜欢 CLI 的，毕竟习惯用 Bash。规则就一条：人在 GUI 里能干的，agent 在 CLI 里也得能干。

底层落到的文件或者 DB 数据，人和 agent 操作的是同一份。

举个现成的例子：我现在就在跟 agent 共用一个编辑器写这篇文章，自己手动改也行，跟它说改什么、它来改也行。


## Agent 常驻

我当然希望 agent 是随时能用的，不用背电脑、不用开 Terminal。有想法时掏出手机对着说就行。

所以 coding agent 得跑在远程服务器上（比如 EC2），用 tmux 后台挂住。再加一个 tail 进程，把它的输出解析出来塞进我自己的数据库，这样网页端就能直接跟它聊了。

后来出了 OpenClaw，但我其实不喜欢，认知负担太大。不过它给了我一个启发：可以接 Telegram。事实证明，Telegram 在手机上输入比 Web 聊天顺手多了。

于是 Web + Telegram 两条路，想用就喊一声。EC2 开了 auto hibernate（自动休眠），不用的时候成本很低。

## Agent 编排

很多时候一个 session 搞不定整件事，得有点编排，得把请求路由到合适的 session 上。Claude Code 自带了 sub-agents 工具，但我不想用它的——我想把这层放外置。

这样 sub-agent 的聊天也归我管，agent 跑到一半我也能直接插进去 steer 一下。现在的结构大概长这样：

```
   用户         ┌──────────────────┐
   输入  ─────► │  skill: manager  │   只分发，不执行
        │      └────────┬─────────┘
        │               │   y chat --skill dev -m "..."
        │               ▼
        │      ┌──────────────────┐
        ├────► │  skill: dev      │   coordinator，
        │      │                  │   协调下层 skill 会话运行
        │      └──┬──────┬──────┬─┘
        │         ▲      ▲      ▲   子会话可 callback
        │         ▼      ▼      ▼   y chat --skill {plan,impl,review}
        │      ┌──────┐ ┌──────┐ ┌────────┐
        └────► │ plan │ │ impl │ │ review │   匿名、短暂；
               └──────┘ └──────┘ └────────┘   每次派发动态加载 skill
```

一个真实 trace：https://yovy.app/t/6fc5c4

对于比较大或者复杂的需求，这套多 skill 协作可以连续高效地跑超过 1h——不空转，单 session 的 context 也不会堆得过多。一个跑了超过 1h 的任务示例：https://yovy.app/t/e404c2 ，plan 完之后 impl 和 review 是自动接力的，不需要我介入。

## 展望

去年写 y-cli 介绍时我说的是：AI 栈会持续快速演进，长久的玩法是在它之上做一层薄而稳定的接口。一年过去这个判断验证了：底层能力从 model API 升级到 coding agent，同样的薄壳思路从 y-cli 延续到了 y-agent。

我觉得这条线还会继续。今天是 coding agent，明天可能是更通用的 agent。每往上一层，agent 就更靠近日常生活——而 y-agent 的角色就是那个稳定的中间层：跟着新能力走，但我不用每半年重新学一遍自己的工具。

如果你手上有 coding agent 和一点空闲时间，照着类似的思路，你能搭出来的东西会比市面上任何产品都更懂你的生活。

参考代码：[GitHub 上的 y-agent](https://github.com/luohy15/y-agent)。
