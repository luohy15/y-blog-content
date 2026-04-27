# y-agent：基于 coding agent 的个人 AI Agent 系统

> [y-agent](https://github.com/luohy15/y-agent) 由之前的 [y-cli](https://luohy15.com/zhs/y-cli-introduction) 项目重命名而来。
> y-cli 是对 model API 的封装，y-agent 是对 coding agent 的封装。

## 效果示例

![y-agent TraceView](https://cdn.luohy15.com/y-agent-demo-3.png)

https://yovy.app/t/0de510

## 目前的需求

1. 高效的 Context 管理
2. 远程运行 coding agent (主要是 Claude Code)
3. 会话持久化和可视化
4. Telegram 支持
5. 多 agent 协同
6. 长时间运行

## 架构

所有 session 是一棵树，每个节点都是同质的运行时：加载 skill、做事、按需通过 `y chat` 派发子任务。协调（coordinate）是每个 session 都有的能力，不是分配给特定角色的职责。Skill 按任务动态加载；topic 只是长期命名地址的语法糖。

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

一条 `trace_id`（任务被追踪时即 `todo_id`）贯穿整棵树，TraceView 把整条链渲染成 waterfall。

## 思路

### Context 管理

我把所有东西都放在一个目录和一个数据库里：代码、笔记、日历、账本（beancount）、浏览记录、RSS 文章、邮件，以及 AGENTS.md 和 skill 树。不需要远程挂载、不需要同步、不需要组装 context，agent 直接读就行。

尽量保持人机同视角。每个实体都有三种界面：给人看的面板、给 agent 用的 CLI、以及最底层的文件或 DB 数据。问一句"上周做了什么"，Agent 直接 grep `journals/` 加查 todo 表，和看板渲染用的是同一份数据。Dev skill 写计划时存成一条 `note`，`content_key` 指向 `pages/` 下的 markdown，文件查看器打开的就是这同一个文件。所有工具和视图都基于同一份数据。

### 薄抽象层

从 y-cli 到 y-agent，核心数据模型（session/message）没变，只是加了 `work_dir`/`status`/`task_id`。底层从 model API 换成 coding agent，上层几乎不用重写。

能套壳现成的 Claude Code / Codex 就不自己重写一个 agent loop，能用现成的工具（比如 stream-json）就不自己写一个 parser。y-agent 的核心就是一层 thin wrapper，提供一些 glue code，把这些东西连起来。

### 执行与监控解耦

Agent loop 的执行完全在 EC2 上，监控层（Lambda）只负责 tail stdout、写数据库、续接进度。这样 agent 可以跑数小时不受 Lambda 15 分钟超时限制，监控层随时可以断开重连，互不影响。

## 实现

### 远程运行 coding agent (主要是 Claude Code)

我是直接把它放到我的 AWS EC2 上运行的。然后我有一个 Lambda，可以 SSH 到 EC2 执行命令。EC2 是配置成自动 Hibernate，这样没有东西在跑的时候是 scaled down to zero 的，不会有费用。

### 会话持久化和可视化

使用 stream-json 输出 Claude Code 的消息，然后有个 Lambda 监听这个输出，并写到数据库，最后有个 Web 界面进行展示。

### Telegram 支持

Telegram bot 监听消息，触发 Lambda，Lambda 通过 SSH 调用 Claude Code

### 多 agent 协同

所有 session 都是同质的——每个都是加载若干 skill、执行任务、按需 spawn 子节点的运行时。是否派发子任务由当前工作决定，不是预先指定的角色。简单任务一个 session 闭环；复杂任务自然长成一棵子树。

一个 CLI 命令（`y chat`）作为统一入口——`y chat -m "..."` 异步 fire-and-forget 派发，`y chat -i` 进入交互式 REPL。会话通过 topic 寻址（长期命名地址，比如 `manager` topic 对应我的 Telegram 私聊，作为根入口），或直接用 chat ID。Skill 按任务动态加载，不绑定 topic，所以同一个地址可以根据进来的任务跑 dev、blog 或 finance。甚至单个领域内部也会拆到不同 skill——dev 的工作流本身就会按阶段加载不同 skill 处理 plan、impl、review。每次派发携带 trace ID，CLAUDE.md 里定义协议。

Dev 使用两阶段工作流：Phase 1（research/plan）在主目录只读代码、理解需求、拆分子任务；Phase 2（implement）为每个子任务创建独立 worktree 并行实现。Dev 自己协调整个流程——完成后自行 commit 和清理。

### 长时间运行

Agent 实际运行在 EC2 的 tmux detached session 里，监控层（Lambda）只负责 tail stdout、写数据库、续接进度。这样 agent 可以跑数小时不受 Lambda 15 分钟超时限制，监控层随时可以断开重连，互不影响。

## 对比

Agent 编排领域已经有不少项目，这里从三个关键维度做对比：

### 定位和目标用户

| 项目 | 定位 | 目标用户 |
|------|------|----------|
| y-agent | 个人 AI 工具集 | 个人开发者 |
| [Slock](https://slock.ai/) | Slack for AI agents | 多人 & agent 协作团队 |
| [Multica](https://github.com/multica-io/multica) | 团队看板 + AI agents | 2-10 人小团队 |
| [Paperclip](https://github.com/paperclip-ai/paperclip) | AI 公司控制平面 | 想运行 AI 公司的创始人 |
| [Hermes Agent](https://github.com/hermes-ai/hermes-agent) | 通用开源 agent 框架 | Self-host 开发者 |
| [Managed Agents](https://docs.anthropic.com/en/docs/agents/managed-agents) | Enterprise PaaS | 企业客户 |

y-agent 处于这个光谱最轻的一端。它只为一个人设计，不是为团队或企业。代价很明显——没有多租户、没有审批流程、没有成本治理——但换来的是近零 infra 成本和对每一层的完全掌控。

### 多 Agent 通信

这是设计哲学分歧最大的地方：

| 项目 | 通信方式 | 拓扑结构 |
|------|----------|----------|
| y-agent | `y chat` 异步 fire-and-forget | 递归 session 树 |
| Slock | Channel/Thread 广播 | Flat（群聊） |
| Multica | WebSocket + DB 同步 | Flat（看板） |
| Paperclip | Issue + Comments + Approval 审批链 | Org 树（管理层级） |
| Hermes Agent | 同步 `delegate_task` | Parent-child（最多 2 层） |
| Managed Agents | Sub-agent spawning（preview） | Sub-agent 树 |

y-agent 用异步 fire-and-forget 消息（`y chat -m`）配合递归 session 树——所有 session 同质，任何一个都能在任务需要时 spawn 子节点。Telegram 私聊只是树根入口（长期的 `manager` topic），不是固定的调度器。Skill 按任务动态加载，不绑定 topic，所以同一个地址可以承担不同类型的工作。每个会话通过 trace ID 关联，可以在 [TraceView](https://yovy.app/t/0de510) 里看到完整链路。Dev 自己也按阶段拆成四个 skill——`plan` 读代码写 plan note，`impl` 在独立 worktree 里并行跑实现，`review` 对照 plan 检查 diff，外面套一层薄的 `dev` 壳串联三者。设计上刻意简单：没有同步阻塞，没有审批门禁，就是"发出去就不管，完成了回调"。

Paperclip 走了相反的方向——把多 agent 协调建模为组织架构图，有管理链、审批流程和预算控制。对于自治 AI 公司来说是对的设计，但对个人使用来说太重了。

Slock 用 Slack 式群聊模型——agent 加入 channel，广播消息，像同事在聊天室里协作。

Multica 居中，用看板隐喻，agent 是团队成员，从共享看板上领取 issue。

## 展望

去年写 y-cli 介绍时我说过：AI 生态将继续快速演进，新的模型、能力和范式将会出现，y-cli 的目标是为这个变化的世界提供一个稳定的、用户可控的界面。

一年过去了，这个判断完全验证了。底层能力从 model API 升级到了 coding agent，y-cli 也演进成了 y-agent。但核心思路没有变：在最新能力之上做一层薄抽象，提供稳定的、自己掌控的界面。

每一层基础能力的提升，上面的应用就能离日常生活更近一步。model API → coding agent → general agent，这个方向不会停。y-agent 的角色始终是那个稳定的中间层——让我的交互和数据不变，同时能快速接入这些进展。

虽然不提供给别人用，但作为 "personal infra for builders" y-agent 证明了一个人 + coding agent 可以维护一套完整的、daily-use 的 agent 系统，infra 成本几乎为零。

如果你也想重新掌控自己的 AI 工作流，可以查看 [GitHub 上的 y-agent](https://github.com/luohy15/y-agent)。
