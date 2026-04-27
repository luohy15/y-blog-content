# y-agent：基于 coding agent 的个人 AI Agent 系统

> [y-agent](https://github.com/luohy15/y-agent) 由之前的 [y-cli](https://luohy15.com/zhs/y-cli-introduction) 项目重命名而来。
> y-cli 是对 model API 的封装，y-agent 是对 coding agent 的封装。

## 效果示例

![y-agent TraceView](https://cdn.luohy15.com/y-agent-demo-3.png)

https://yovy.app/t/0de510

---

像 Claude Code 这样的 coding agent，写代码确实好用。但代码只是我日常需要帮手的一小块——笔记越积越多、账单要处理、任务会漏、链接没看完。我希望同样的 agent 也能帮我处理这些事，而不只是仓库里的代码。

这篇博客记录我把 coding agent 拓展成个人 agent 时遇到的三件事，按遇到的顺序：怎么把 context 组织起来让 agent 真的能用、怎么让 agent 不只活在终端会话里、以及一个 agent 不够用时怎么自然变成多个。

## Context — 组织起来，共享出去

Coding agent 处理代码好用，部分原因是 codebase 本身就是一棵清晰的目录树。它走进去 grep 一下要的东西就拿到了。生活里的 context 就乱多了——笔记在 Obsidian、日历在 Google、账目在某张表、todo 在某个 app、阅读列表在浏览器 tab 里。Agent 看任何一个，几乎啥都看不到。

所以我把所有东西塞到 EC2 上的同一个目录里。代码、日记、笔记、日历、beancount 账本、保存的链接、RSS 文章、邮件，加上 AGENTS.md 和 skill 树。每个"领域"占一个子目录，agent 直接读。没有远程挂载、没有同步层、没有 query 前的 context 组装步骤。

"共享 context"另一半是让人和 agent 看的是同一份。系统里每个实体都有三种接口：给我看的面板、给 agent 用的 CLI、底下的文件或 DB 数据。问一句"上周做了什么"，agent 直接 grep `journals/` 加查 todo 表——和看板渲染用的是同一份。Dev skill 写出来的 plan 就是 `pages/` 下的一个 md 文件，文件查看器直接打开它，不存在另一套"给 agent 的 API"在那里漂移。

把这些 domain 串起来的是 todo。Todo 是整个系统的脊梁——一条 note（markdown plan）通过 `note_todo_relation` 关联上来，一个 deadline 变成 reminder 由 Telegram bot 触发，一个编码任务起一个 worktree，commit 反向关联回来，每次跨 skill 派发把 `todo_id` 当作 `trace_id`。一个 ID 把看板卡片、markdown plan、reminder、worktree、trace 串成同一根线。

## Agent 应该常驻在某处

Context 组织好之后，下一件事就显出来了：coding agent 默认是 *ephemeral* 的。你打开终端它活，关掉就死。这对一个下午写代码够用，但生活里其他事不行——日历提醒、晚上的日记 nudge、"我到家时提醒我 X"，这些都需要一个 standby 的 agent，而不是临时唤醒的 agent。

所以我把 agent 从笔记本搬到了 EC2 上。一个小 Lambda 通过 SSH 进去按需跑 Claude Code；EC2 配了自动 Hibernate，没人在用时 scale 到零。在用户视角，agent 一直可达；但没人聊它的时候，infra 成本几乎为零。

"聊它"的入口是 Telegram。Bot 监听我的私聊消息，消息打到 Lambda，Lambda 通过 SSH 触发 EC2 上的 Claude Code。从任何设备、任何地方，我都能戳一下 agent 拿到回复——不用打开 app，不用 attach 终端。

长时间跑的任务，agent 实际跑在 EC2 的 tmux detached session 里。Lambda 层只负责 tail stdout、写数据库、续接进度。这种执行和监控的解耦让任务可以跑数小时不被 Lambda 15 分钟超时打断，监控层也可以随时断开重连而不影响 agent。所有 chat 历史、trace 树、原始 stream 也都在 Web UI 里渲染——任何一个 session 做了什么、什么时候做的，都能回放。

## 从一个 Agent 到多个

一个长期运行的 agent 处理单步请求够用。但请求一变难——"研究这个人写个 profile"、"对这个 feature 先 plan 再 impl 再 review"、"起草一篇博客"——一个 session 就不够了。事情自然会拆：有人读代码、有人写、有人检查。所以一个 session 必须把工作交给另一个，紧接着就有几个问题冒出来。

**一个 session 怎么寻址另一个？** 有些 session 你只想用一次就扔——一次性的 impl 跑、临时的研究任务，用 chat ID 寻址就够了。但有些 session 你会反复用：我的 Telegram 私聊就是所有消息的总入口，跑代码任务的 session 是所有代码工作的固定接收方。这种我希望有一个稳定的名字能直接写进脚本，而不是每次去查一个 hex chat ID。所以地址有两种：`--chat-id` 用于一次性的，`--topic` 用于长期命名地址。`manager` topic 恰好绑到我的 Telegram 私聊作为根入口，`dev` topic 接所有代码工作，其他 session 默认匿名，除非我专门给它起名字。

**哪些 session 有资格派发？** 我最初的本能是分开——一个"manager" session 负责派发，"worker" session 负责执行。但这种分类其实没什么收益。每个 session 就是一个运行时：加载若干 skill、跑任务，任务需要时可以派发子任务。简单任务一个 session 闭环，复杂任务自然长出子树。图里的 "root"、"trunk"、"leaves" 是这次运行的位置，不是 session 类型。

```
        Telegram 私聊 / Web UI                      ← 用户输入入口
                  │
                  ▼
       ┌─────────────────────┐
root   │  topic: manager     │   长期命名地址，
       │  skills: per task   │   绑定 Telegram 私聊（单例）
       └──────────┬──────────┘
                  │   y chat --topic dev -m "..."
                  ▼
       ┌─────────────────────┐
trunk  │  topic: dev         │   收到任务后，
       │  (coordinator)      │   可继续向下派发
       └──┬───────┬───────┬──┘
          │       │       │   y chat --skill {plan,impl,review}
          ▼       ▼       ▼
       ┌──────┐ ┌──────┐ ┌────────┐
leaves │ plan │ │ impl │ │ review │   匿名、短暂；
       └──────┘ └──────┘ └────────┘   每次派发动态加载 skill
```

**怎么追踪一次跨多个 session 的运行？** 看任何一个 session 的日志只能看到一片，整棵树才是完整故事。所以每次派发携带一个 `trace_id`，任务被追踪时即 `todo_id`——和看板卡片用的是同一个 ID。一次完整运行——root 派发 → dev 做 plan → 多个 impl 并行 → dev commit——能在 [TraceView](https://yovy.app/t/0de510) 里渲染成一条 waterfall。看板卡片、plan note、worktree commit、trace 都是同一根线的不同视角。

**Skill 跟 topic 绑吗？** 我一开始假设是绑的——`dev` topic 跑 dev skill，`blog` topic 跑 blog skill。后来发现这是把两件事混了。Topic 只是稳定地址，session 实际做什么取决于进来的是什么消息。所以 skill 按任务动态加载，不绑定 topic。同一个 `dev` 地址这一分钟可以跑 review skill，下一分钟跑 impl skill，看进来的是什么任务。

所有这些——寻址、派发、回复、回调——都收在一条 CLI 下。`y chat -m "..."` 异步 fire-and-forget，`--topic`、`--skill`、`--chat-id` 是同一条命令上的寻址 flag。协议——什么时候设 `--trace-id`、什么时候加 `--new`、什么时候回调——写在 CLAUDE.md 里，每个 session 都能读到。

这是我自己唯一能装进脑子里的多 agent 设计。没有中央调度、没有审批门、没有同步阻塞——就是消息、trace 和同样的原语递归。

## 展望

去年写 y-cli 介绍时我赌的是：AI 栈会持续快速演进，有用的玩法是在它之上做一层薄而稳定的接口。一年过去这个判断验证了：底层能力从 model API 升级到 coding agent，同样的薄壳思路从 y-cli 延续到了 y-agent。

我觉得这条线还会继续。今天是 coding agent，明天可能是更通用的 agent。每往上一层，agent 就更靠近日常生活——而 y-agent 的角色就是那个稳定的中间层：跟着新能力走，但不强迫我每半年重新学一遍自己的工具。

这篇博客没怎么展开论证的另一半：一个小邀请。y-agent 不是产品，是我给自己造的工具。让人满足的不是这套系统，是这个位置——一个人、一个 coding agent，加上把东西连起来的耐心。如果你手上有 coding agent 和一点空闲时间，你能搭出来的东西比市面上任何产品都更贴你的生活。这件事比这篇博客本身更值得拿走。

代码在这：[GitHub 上的 y-agent](https://github.com/luohy15/y-agent)。
