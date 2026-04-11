# y-agent：基于 coding agent 的个人 AI Agent 系统

> [y-agent](https://github.com/luohy15/y-agent) 由之前的 [y-cli](https://luohy15.com/zhs/y-cli-introduction) 项目重命名而来。
> y-cli 是对 model API 的封装，y-agent 是对 coding agent 的封装。

## 效果示例

![y-agent TraceView](https://cdn.luohy15.com/y-agent-demo.png)

https://yovy.app/t/856542

## 目前的需求

1. 任务列表
2. 远程运行 coding agent (主要是 Claude Code)
3. 会话持久化和可视化
4. Telegram 支持
5. 多 agent 协同
6. 长时间运行

## 思路

### Context 处理

所有东西都在 EC2 的一个目录下——代码、配置、数据、CLAUDE.md。如果 skill 指定了 work_dir，就在对应子目录下工作。不需要远程挂载、不需要同步、不需要组装 context，agent 直接读就行。

这也意味着人机同视角。我们给 agent 提供 CLI 工具和 skill，让它能访问和人在 GUI 上看到的同一份数据——任务、会话、日历、财务。不需要单独的 "agent API" 层，就是同一份数据、不同的界面。

### 薄抽象层

y-cli -> y-agent，核心数据模型（session/message）没变，只是加了 work_dir/status/task_id。底层从 model API 换成 coding agent，上层几乎不用重写。

### Delegate, don't rebuild

能套壳 Claude Code 就不自己重写一个 agent loop，能用现成的工具（比如 stream-json）就不自己写一个 parser。y-agent 的核心就是一层 thin wrapper，提供一些 glue code，把这些东西连起来。

### 执行与监控解耦

Agent loop 的执行完全在 EC2 上，监控层（Lambda）只负责 tail stdout、写数据库、续接进度。这样 agent 可以跑数小时不受 Lambda 15 分钟超时限制，监控层随时可以断开重连，互不影响。

## 实现

### 任务列表

一个 CLI 命令（`y todo`），用来创建、更新和追踪任务。人用 GUI 操作，agent 用 CLI，但面对的是同一份数据。

### 远程运行 coding agent (主要是 Claude Code)

我是直接把它放到我的 AWS EC2 上运行的。然后我有一个 Lambda，可以 SSH 到 EC2 执行命令。EC2 是配置成自动 Hibernate，这样没有东西在跑的时候是 scaled down to zero 的，不会有费用。

### 会话持久化和可视化

使用 stream-json 输出 Claude Code 的消息，然后有个 Lambda 监听这个输出，并写到数据库，最后有个 Web 界面进行展示。

### Telegram 支持

Telegram bot 监听消息，触发 Lambda，Lambda 通过 SSH 调用 Claude Code

### 多 agent 协同

首先定义一系列的 Skills，专门定义各个角色和他们的职责，然后 Agent 或者对话启动的时候，可以指定特定的 skill，也就是特定的角色。

各角色会话启动的时候指定 task ID，这样实现多个会话关联到同一个 task

实现一个命令行命令（y chat），执行该命令可以启动一个新的会话，并指定参数，然后在 CLAUDE.md 上写 y chat 的用法

### 长时间运行

Agent 实际运行在 EC2 的 tmux detached session 里，监控层（Lambda）只负责 tail stdout、写数据库、续接进度。这样 agent 可以跑数小时不受 Lambda 15 分钟超时限制，监控层随时可以断开重连，互不影响。

## 对比

Agent 编排领域已经有不少项目（[调研 trace](https://yovy.app/t/e10a7a)），这里从三个关键维度做对比：

### 定位和目标用户

| 项目 | 定位 | 目标用户 |
|------|------|----------|
| y-agent | 个人 AI 工具集 | 个人开发者 |
| [Multica](https://github.com/multica-io/multica) | 团队看板 + AI agents | 2-10 人小团队 |
| [Paperclip](https://github.com/paperclip-ai/paperclip) | AI 公司控制平面 | 想运行 AI 公司的创始人 |
| [Hermes Agent](https://github.com/hermes-ai/hermes-agent) | 通用开源 agent 框架 | Self-host 开发者 |
| [Managed Agents](https://docs.anthropic.com/en/docs/agents/managed-agents) | Enterprise PaaS | 企业客户 |

y-agent 处于这个光谱最轻的一端。它只为一个人设计，不是为团队或企业。代价很明显——没有多租户、没有审批流程、没有成本治理——但换来的是近零 infra 成本和对每一层的完全掌控。

### 多 Agent 通信

这是设计哲学分歧最大的地方：

| 项目 | 通信方式 | 拓扑结构 |
|------|----------|----------|
| y-agent | `y chat` 异步 fire-and-forget | Hub-and-spoke（DM 中心调度） |
| Multica | WebSocket + DB 同步 | Flat（看板） |
| Paperclip | Issue + Comments + Approval 审批链 | Org 树（管理层级） |
| Hermes Agent | 同步 `delegate_task` | Parent-child（最多 2 层） |
| Managed Agents | Sub-agent spawning（preview） | Sub-agent 树 |

y-agent 用异步 fire-and-forget 消息（`y chat`）配合 hub-and-spoke 拓扑——DM 作为中心调度器，把任务路由给专门的 skill（dev、blog、finance 等）。每个会话通过 trace ID 关联，可以在 [TraceView](https://yovy.app/t/856542) 里看到完整链路。设计上刻意简单：没有同步阻塞，没有审批门禁，就是"发出去就不管，完成了回调"。

Paperclip 走了相反的方向——把多 agent 协调建模为组织架构图，有管理链、审批流程和预算控制。对于自治 AI 公司来说是对的设计，但对个人使用来说太重了。

Multica 居中，用看板隐喻，agent 是团队成员，从共享看板上领取 issue。

## 展望

去年写 y-cli 介绍时我说过：AI 生态将继续快速演进，新的模型、能力和范式将会出现，y-cli 的目标是为这个变化的世界提供一个稳定的、用户可控的界面。

一年过去了，这个判断完全验证了。底层能力从 model API 升级到了 coding agent，y-cli 也演进成了 y-agent。但核心思路没有变：在最新能力之上做一层薄抽象，提供稳定的、自己掌控的界面。

每一层基础能力的提升，上面的应用就能离日常生活更近一步。model API → coding agent → general agent，这个方向不会停。y-agent 的角色始终是那个稳定的中间层——让我的交互和数据不变，同时能快速接入这些进展。

虽然不提供给别人用，但作为 "personal infra for builders" y-agent 证明了一个人 + coding agent 可以维护一套完整的、daily-use 的 agent 系统，infra 成本几乎为零。

如果你也想重新掌控自己的 AI 工作流，可以查看 [GitHub 上的 y-agent](https://github.com/luohy15/y-agent)。
