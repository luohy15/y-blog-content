# y-agent: A Personal AI Agent System Built on Coding Agents

> [y-agent](https://github.com/luohy15/y-agent) was renamed from [y-cli](https://luohy15.com/y-cli-introduction).
> y-cli was a wrapper around model APIs; y-agent is a wrapper around coding agents.

## Demo

![y-agent TraceView](https://cdn.luohy15.com/y-agent-demo.png)

https://yovy.app/t/341d4a

## What I Need

1. Task list
2. Run coding agents remotely (primarily Claude Code)
3. Session persistence and visualization
4. Telegram support
5. Multi-agent collaboration
6. Long-running tasks

## Design Principles

### Context handling

Everything lives in one directory on EC2 — code, config, data, CLAUDE.md. If a skill specifies a work_dir, it gets its own subdirectory. No remote mounts, no syncing, no context assembly step. The agent just reads what's there.

This also means humans and agents share the same view. We provide agents with CLI tools and skills so they can access the same data humans see through the GUI — tasks, sessions, calendars, finances. No separate "agent API" layer, just the same data accessed through different interfaces.

### Thin abstraction layer

From y-cli to y-agent, the core data model (session/message) stayed the same — just added work_dir/status/task_id. The underlying engine switched from model APIs to coding agents, but the upper layer barely needed rewriting.

### Delegate, don't rebuild

If I can wrap Claude Code, I don't rewrite an agent loop. If there's an existing tool (like stream-json), I don't build my own parser. y-agent is a thin wrapper at its core — just glue code that connects these pieces together.

### Decouple execution from monitoring

The agent loop runs entirely on EC2. The monitoring layer (Lambda) only tails stdout, writes to the database, and resumes progress. This way the agent can run for hours without hitting Lambda's 15-minute timeout, and the monitoring layer can disconnect and reconnect at any time without affecting execution.

## Implementation

### Task list

A CLI command (`y todo`) for creating, updating, and tracking tasks. Humans use the GUI, agents use the CLI, but both operate on the same data.

### Running coding agents remotely (primarily Claude Code)

I run it directly on my AWS EC2 instance. A Lambda function SSHs into the EC2 to execute commands. The EC2 is configured to auto-hibernate, so it scales down to zero when nothing is running — no cost when idle.

### Session persistence and visualization

Claude Code output is streamed via stream-json. A Lambda monitors this output, writes it to the database, and a web interface displays everything.

### Telegram support

A Telegram bot listens for messages, triggers Lambda, and Lambda invokes Claude Code via SSH.

### Multi-agent collaboration

Sessions fall into two categories: **Manager** (dispatches tasks via `y notify`, doesn't execute) and **Worker** (loads any skill — dev, hr, blog, cdn, finance, etc. — and executes tasks received via topic).

A CLI command (`y notify`) sends async fire-and-forget messages between roles. Messages are routed by topic — decoupled from skill names. Each session is linked by a trace ID, and CLAUDE.md documents the communication protocol.

### Long-running tasks

Agents run inside tmux detached sessions on EC2. The monitoring layer (Lambda) only tails stdout, writes to the database, and resumes progress. This lets agents run for hours without hitting Lambda's 15-minute timeout, and the monitoring layer can disconnect and reconnect freely.

## Comparisons

There are several projects in the agent orchestration space ([research trace](https://yovy.app/t/e10a7a)). Here's how y-agent compares on three key dimensions:

### Positioning and target users

| Project | Positioning | Target users |
|---------|------------|--------------|
| y-agent | Personal AI toolkit | Individual builder |
| [Slock](https://slock.ai/) | Slack for AI agents | Teams collaborating with agents |
| [Multica](https://github.com/multica-io/multica) | Team kanban + AI agents | Small teams (2-10 people) |
| [Paperclip](https://github.com/paperclip-ai/paperclip) | AI company control plane | Founders running AI companies |
| [Hermes Agent](https://github.com/hermes-ai/hermes-agent) | General-purpose open-source agent framework | Self-hosting developers |
| [Managed Agents](https://docs.anthropic.com/en/docs/agents/managed-agents) | Enterprise PaaS | Enterprise customers |

y-agent sits at the lightest end of this spectrum. It's built for one person, not a team or an enterprise. The tradeoff is obvious — no multi-tenant, no approval workflows, no cost governance — but in exchange, there's near-zero infra cost and full control over every layer.

### Multi-agent communication

This is where the design philosophies diverge most sharply:

| Project | Communication | Structure |
|---------|--------------|-----------|
| y-agent | `y notify` async fire-and-forget | Hub-and-spoke (Manager dispatches) |
| Slock | Channel/Thread broadcast | Flat (group chat) |
| Multica | WebSocket + DB sync | Flat (kanban board) |
| Paperclip | Issue + Comments + Approval chain | Org tree (management hierarchy) |
| Hermes Agent | Synchronous `delegate_task` | Parent-child (max 2 levels) |
| Managed Agents | Sub-agent spawning (preview) | Sub-agent tree |

y-agent uses async fire-and-forget messaging (`y notify`) with a hub-and-spoke topology — Manager acts as the central dispatcher, routing tasks by topic to notifiable roles. Topics are the routing key, decoupled from skill names, so routing can change without restructuring the system. Dev uses a two-phase workflow: Phase 1 reads code and plans subtasks, then Phase 2 spawns parallel implementation sessions in separate worktrees, with the dev coordinator handling commits and cleanup itself. Each session is linked by a trace ID, so you can follow the full chain in [TraceView](https://yovy.app/t/341d4a). This is intentionally simple: no synchronous blocking, no approval gates, just "send and forget, callback when done."

Paperclip takes the opposite approach — modeling multi-agent coordination as an org chart with managers, approval flows, and budget controls. It's the right design for autonomous AI companies, but overkill for personal use.

Slock uses a Slack-like group chat model — agents join channels, broadcast messages, and collaborate like coworkers in a chat room.

Multica lands in between, using a kanban metaphor where agents are team members picking up issues from a shared board.

## Looking Forward

When I wrote the y-cli introduction last year, I said: the AI landscape will continue to evolve rapidly, with new models, capabilities, and paradigms emerging. y-cli's goal was to provide a stable, user-controlled interface to this changing world.

A year later, that prediction fully played out. The underlying capability upgraded from model APIs to coding agents, and y-cli evolved into y-agent. But the core approach hasn't changed: build a thin abstraction on top of the latest capabilities, providing a stable interface that you control.

Each step up in foundational capability brings applications closer to daily life. Model API → coding agent → general agent — this trajectory won't stop. y-agent's role is always that stable middle layer — keeping my interactions and data consistent while quickly integrating new advances.

While it's not designed for others to use, as "personal infra for builders" y-agent proves that one person + a coding agent can maintain a complete, daily-use agent system with near-zero infra cost.

If you want to take control of your own AI workflow, check out [y-agent on GitHub](https://github.com/luohy15/y-agent).
