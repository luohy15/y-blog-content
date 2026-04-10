# y-agent: A Personal AI Agent System Built on Coding Agents

> [y-agent](https://github.com/luohy15/y-agent) was renamed from [y-cli](https://luohy15.com/y-cli-introduction).
> y-cli was a wrapper around model APIs; y-agent is a wrapper around coding agents.

## What I Need

1. Run coding agents remotely (primarily Claude Code)
2. Session persistence and visualization
3. Telegram support
4. Multi-agent collaboration
5. Long-running tasks

## Design Principles

1. Delegate, don't rebuild
If I can wrap Claude Code, I don't rewrite an agent loop. If there's an existing tool (like stream-json), I don't build my own parser. y-agent is a thin wrapper at its core — just glue code that connects these pieces together.

2. Decouple execution from monitoring
The agent loop runs entirely on EC2. The monitoring layer (Lambda) only tails stdout, writes to the database, and resumes progress. This way the agent can run for hours without hitting Lambda's 15-minute timeout, and the monitoring layer can disconnect and reconnect at any time without affecting execution.

3. Thin abstraction layer
From y-cli to y-agent, the core data model (session/message) stayed the same — just added work_dir/status/task_id. The underlying engine switched from model APIs to coding agents, but the upper layer barely needed rewriting.

4. Same view for humans and agents
GUI, CLI, and LUI all access the same data. What the human sees is exactly what the agent sees.

## Implementation

1. Running coding agents remotely (primarily Claude Code)
I run it directly on my AWS EC2 instance. A Lambda function SSHs into the EC2 to execute commands. The EC2 is configured to auto-hibernate, so it scales down to zero when nothing is running — no cost when idle.

2. Session persistence and visualization
Claude Code output is streamed via stream-json. A Lambda monitors this output, writes it to the database, and a web interface displays everything.

3. Telegram support
A Telegram bot listens for messages, triggers Lambda, and Lambda invokes Claude Code via SSH.

4. Multi-agent collaboration
First, I define a set of Skills that specify each agent's role and responsibilities. When starting an agent or conversation, you can assign a specific skill — effectively a specific role.
Each agent session is tagged with a task ID, linking multiple sessions to the same task.
A CLI command (`y notify`) starts a new session with specified parameters, and CLAUDE.md documents how to use it.

5. Long-running tasks
Agents run inside tmux detached sessions on EC2. The monitoring layer (Lambda) only tails stdout, writes to the database, and resumes progress. This lets agents run for hours without hitting Lambda's 15-minute timeout, and the monitoring layer can disconnect and reconnect freely.

## Demo

https://yovy.app/t/856542
Remote execution, session persistence and visualization, Telegram support, multi-agent collaboration, long-running tasks — all requirements met.

## Comparisons

vs Anthropic Managed Agents:
| Dimension | Managed Agents | y-agent |
|-----------|---------------|---------|
| Positioning | Enterprise PaaS — managed infra/compliance/multi-tenant | Personal infra — self-hosted, self-controlled |
| Agent definition | Natural language + tools/security rules | SKILL.md + CLAUDE.md, code-as-config |
| Execution model | Isolated container per agent, platform manages state | Lambda + SQS + Celery, agent loop on EC2 |
| Multi-agent | Sub-agent spawning (research preview) | `y notify` + trace context, dev-manager dispatches parallel worktree devs (production) |
| Tool system | MCP servers connecting third-party services | Claude Code + Codex |
| Backend | Claude only | Claude Code + Codex, choose engine per task |
| Long tasks | Agents can run for hours | Supports long-running tasks |
| Session/State | Platform auto-manages state and credentials | PostgreSQL stores chat/message, SSE real-time streaming |
| Tracing | Console session trace | TraceView timeline/waterfall, already implemented |
| Cost | $0.08/hr platform fee + model usage | Lambda/RDS + model usage, infra cost near zero, mainly model usage |
| Deployment | Console / Claude Code / CLI | AWS SAM serverless |
| Early users | Notion, Rakuten, Asana, Vibecode, Sentry | Myself |

vs Hermes Agent:

| Dimension | Hermes Agent | y-agent |
|-----------|-------------|---------|
| Positioning | General-purpose open-source agent framework | Personal AI toolkit, built for myself |
| Architecture | Single-process monolith (agent + CLI + gateway) | Microservice layers: Frontend → API → Worker → Agent |
| Execution | Long-running process, CLI or gateway stays alive | Event-driven: notify → enqueue → execute → callback |
| Deployment | VPS/Docker/Modal/local | AWS Lambda + SQS + RDS + EC2 |
| LLM integration | Built-in LLM calls, manages API client directly | Delegates to Claude Code / Codex CLI subprocesses |
| Frontend | Rich TUI (CLI) + multi-platform gateway | React SPA + Telegram bot |

## Looking Forward

When I wrote the y-cli introduction last year, I said: the AI landscape will continue to evolve rapidly, with new models, capabilities, and paradigms emerging. y-cli's goal was to provide a stable, user-controlled interface to this changing world.

A year later, that prediction fully played out. The underlying capability upgraded from model APIs to coding agents, and y-cli evolved into y-agent. But the core approach hasn't changed: build a thin abstraction on top of the latest capabilities, providing a stable interface that you control.

Each step up in foundational capability brings applications closer to daily life. Model API → coding agent → general agent — this trajectory won't stop. y-agent's role is always that stable middle layer — keeping my interactions and data consistent while quickly integrating new advances.

While it's not designed for others to use, as "personal infra for builders" y-agent proves that one person + a coding agent can maintain a complete, daily-use agent system with near-zero infra cost.

If you want to take control of your own AI workflow, check out [y-agent on GitHub](https://github.com/luohy15/y-agent).
