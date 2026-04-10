# y-agent：基于 coding agent 的个人 AI Agent 系统

> [y-agent](https://github.com/luohy15/y-agent) 由之前的 [y-cli](https://luohy15.com/zhs/y-cli-introduction) 项目重命名而来。
> y-cli 是对 model API 的封装，y-agent 是对 coding agent 的封装。

## 目前的需求

1. 远程运行 coding agent (主要是 Claude Code)
2. 会话持久化和可视化
3. Telegram 支持
4. 多 agent 协同
5. 长时间运行

## 思路

### Delegate, don't rebuild

能套壳 Claude Code 就不自己重写一个 agent loop，能用现成的工具（比如 stream-json）就不自己写一个 parser。y-agent 的核心就是一层 thin wrapper，提供一些 glue code，把这些东西连起来。

### 执行与监控解耦

Agent loop 的执行完全在 EC2 上，监控层（Lambda）只负责 tail stdout、写数据库、续接进度。这样 agent 可以跑数小时不受 Lambda 15 分钟超时限制，监控层随时可以断开重连，互不影响。

### 薄抽象层

y-cli -> y-agent，核心数据模型（session/message）没变，只是加了 work_dir/status/task_id。底层从 model API 换成 coding agent，上层几乎不用重写。

### 人机同视角

GUI/CLI/LUI 访问同一份数据，人和 agent 看到的是一样的东西

## 实现

### 远程运行 coding agent (主要是 Claude Code)

我是直接把它放到我的 AWS EC2 上运行的。然后我有一个 Lambda，可以 SSH 到 EC2 执行命令。EC2 是配置成自动 Hibernate，这样没有东西在跑的时候是 scaled down to zero 的，不会有费用。

### 会话持久化和可视化

使用 stream-json 输出 Claude Code 的消息，然后有个 Lambda 监听这个输出，并写到数据库，最后有个 Web 界面进行展示。

### Telegram 支持

Telegram bot 监听消息，触发 Lambda，Lambda 通过 SSH 调用 Claude Code

### 多 agent 协同

首先定义一系列的 Skills，专门定义各个角色和他们的职责，然后 Agent 或者对话启动的时候，可以指定特定的 skill，也就是特定的角色。

各角色会话启动的时候指定 task ID，这样实现多个会话关联到同一个 task

实现一个命令行命令（y notify），执行该命令可以启动一个新的会话，并指定参数，然后在 CLAUDE.md 上写 y notify 的用法

### 长时间运行

Agent 实际运行在 EC2 的 tmux detached session 里，监控层（Lambda）只负责 tail stdout、写数据库、续接进度。这样 agent 可以跑数小时不受 Lambda 15 分钟超时限制，监控层随时可以断开重连，互不影响。

## 效果示例

https://yovy.app/t/856542

远程运行，会话持久化和可视化，Telegram 支持，多 agent 协同，长时间运行，这些需求都满足了。

## 对比

[vs Anthropic Managed Agents](https://yovy.app/t/1d7bfa):
| 维度 | Managed Agents | y-agent |
|------|---------------|---------|
| 定位 | Enterprise PaaS，托管 infra/合规/多租户 | Personal infra，自己用自己控 |
| Agent 定义 | 自然语言描述 + tools/security rules | SKILL.md + CLAUDE.md，code-as-config |
| 执行模型 | 每个 agent 起隔离容器，平台管状态 | Lambda + SQS + Celery，agent loop 在 EC2 上 |
| Multi-agent | Sub-agent spawning（research preview） | `y notify` + trace context，dev-manager 并行派发 worktree dev（production） |
| Tool 体系 | MCP server 连第三方服务 | Claude Code + Codex |
| Backend | 只绑 Claude | Claude Code + Codex，可按任务选引擎 |
| 长任务 | Agent 可跑数小时 | 支持长任务运行 |
| Session/State | 平台自动管状态和 credentials | PostgreSQL 存 chat/message，SSE 实时流 |
| Tracing | Console 里看 session trace | TraceView 时间线/瀑布图，已实现 |
| 成本 | $0.08/hr 平台费 + model usage | 付 Lambda/RDS + model usage，infra 极低，主要是 model usage |
| 部署方式 | Console / Claude Code / CLI | AWS SAM serverless |
| 早期用户 | Notion、Rakuten、Asana、Vibecode、Sentry | 自己 |

[vs Hermes Agent](https://yovy.app/t/13825d):

| 维度 | Hermes Agent | y-agent |
|------|-------------|---------|
| 定位 | 通用开源 agent 框架，面向所有用户 | 个人 AI 工具集，给自己用 |
| 架构 | 单进程 monolith（agent + CLI + gateway） | 微服务分层：Frontend → API → Worker → Agent |
| 运行方式 | 长驻进程，CLI 或 gateway 持续运行 | 触发式：notify → enqueue → execute → callback |
| 部署 | VPS/Docker/Modal/本地 | AWS Lambda + SQS + RDS + EC2 |
| LLM 集成 | 内建 LLM 调用，直接管理 API client | 委托给 Claude Code / Codex CLI 子进程 |
| 前端 | Rich TUI (CLI) + 多平台 gateway | React SPA + Telegram bot |

## 展望

去年写 y-cli 介绍时我说过：AI 生态将继续快速演进，新的模型、能力和范式将会出现，y-cli 的目标是为这个变化的世界提供一个稳定的、用户可控的界面。

一年过去了，这个判断完全验证了。底层能力从 model API 升级到了 coding agent，y-cli 也演进成了 y-agent。但核心思路没有变：在最新能力之上做一层薄抽象，提供稳定的、自己掌控的界面。

每一层基础能力的提升，上面的应用就能离日常生活更近一步。model API → coding agent → general agent，这个方向不会停。y-agent 的角色始终是那个稳定的中间层——让我的交互和数据不变，同时能快速接入这些进展。

虽然不提供给别人用，但作为 "personal infra for builders" y-agent 证明了一个人 + coding agent 可以维护一套完整的、daily-use 的 agent 系统，infra 成本几乎为零。

如果你也想重新掌控自己的 AI 工作流，可以查看 [GitHub 上的 y-agent](https://github.com/luohy15/y-agent)。
