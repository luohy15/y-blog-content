# y-agent: A Personal AI Agent System Built on Coding Agents

> [y-agent](https://github.com/luohy15/y-agent) was renamed from [y-cli](https://luohy15.com/y-cli-introduction).
> y-cli was a wrapper around model APIs; y-agent is a wrapper around coding agents.

## Demo

![y-agent TraceView](https://cdn.luohy15.com/y-agent-demo-4.png)

https://yovy.app/t/6fc5c4

---

Coding agents like Claude Code are genuinely useful — for code. But code is only a sliver of what I actually need help with day to day. Notes pile up. Bills come in. Tasks slip. Links sit unread. I wanted the same kind of agent help across all of that, not just inside a repository.

This post walks through three things I ran into while extending a coding agent into a personal agent, in the order I ran into them: organizing context so an agent can actually use it, getting the agent to live somewhere other than a terminal session, and letting one agent grow into many when one isn't enough.

## Context — organizing it, sharing it

Coding agents are good at code partly because the codebase is already a single, well-defined directory tree. They walk in, grep what they need, and go. The personal-life equivalent is much messier — notes in Obsidian, calendar in Google, money in a spreadsheet, todos in some app, reading list in a browser tab. An agent staring at any one of those sees almost nothing.

So I pulled everything into one directory on EC2. Code, journals, notes, calendar, the beancount ledger, saved links, RSS items, emails. Plus AGENTS.md and the skills tree. Each "domain" gets a subdirectory; the agent reads what's there. No remote mounts, no syncing layer, no context-assembly step before each query.

The other half of "shared context" is making sure humans and agents look at the same thing. Every entity in the system has three interfaces: a panel for me, a CLI for the agent, the raw file or DB row underneath. Ask "what did I do last week" and the agent greps `journals/` and queries the todo table — the exact source the kanban renders from. A plan written by the dev skill is just a markdown file under `pages/`; the file viewer opens it directly, no separate "agent API" to drift out of sync.

What ties these domains together is the todo. Todo is the spine the rest of the system hangs off — a note (markdown plan) attaches via `note_todo_relation`, a deadline becomes a reminder fired through the Telegram bot, a coding task spins up a worktree whose commits link back, and every cross-skill dispatch carries the `todo_id` as `trace_id`. One ID stitches the kanban card, the markdown plan, the reminder, the worktree, and the trace into a single thread.

## The agent should live somewhere, for a long time

Once context is organized, the next thing you notice is that a coding agent is *ephemeral*. You open a terminal, it works on something, you close the terminal, it dies. That's fine for an afternoon of coding. It's a poor fit for everything else — calendar prompts, evening journal nudges, "remind me about X when I get home" — all of which need an agent that's standby, not summoned.

So I moved the agent off my laptop and onto EC2. A small Lambda SSHs in and runs Claude Code on demand; the EC2 itself is configured to auto-hibernate, scaling to zero when idle. From the user's perspective the agent is now always reachable, but no infra cost when nobody's talking to it.

The "talking to it" part is Telegram. A bot listens on my DM, the message hits a Lambda, the Lambda triggers Claude Code via SSH on EC2. From any device, anywhere, I can poke the agent and get a response — no app to open, no terminal to attach to.

For long-running tasks, the agent runs inside a tmux detached session on EC2. The Lambda layer only tails its stdout, writes messages to the database, and resumes from where it left off. That separation of execution from monitoring lets tasks run for hours without bumping into Lambda's 15-minute timeout, and lets the monitoring layer disconnect or reconnect freely without disturbing the agent. Everything is also rendered in a web UI — chat history, trace tree, raw stream — so I can replay what any session did, when.

## From one agent to many

A single long-running agent handles single-step requests fine. But the moment a request gets harder — "research this person and write a profile", "plan, implement, and review this feature", "draft a blog post" — one session isn't enough. The work splits naturally: someone reads the code, someone writes it, someone checks it. So one session has to hand work to another, and a few questions immediately follow.

**How does one session address another?** Some sessions you want to talk to once and throw away — an ad-hoc implementation run, a one-off research task. A chat ID is enough for those. But others you talk to repeatedly: my Telegram DM is the inbox for everything; whatever runs the code work is the standing recipient for any code task. For those I want a stable name I can hard-code into scripts, not a hex chat ID I have to look up. So addresses come in two flavors. `--chat-id` for one-offs. `--topic` for long-lived names. The `manager` topic happens to be bound to my Telegram DM and serves as the root inbox; the `dev` topic handles code work; everything else stays anonymous unless I bother to name it.

**Which session is allowed to dispatch?** My first instinct was to pre-classify — a "manager" session that dispatches and "worker" sessions that execute. That turned out to buy nothing. Every session is just a runtime: loads some skills, runs a task, and may dispatch sub-tasks if the task calls for it. Simple tasks close inside one session; complex ones grow a subtree. "root", "trunk", "leaves" become positions in the current run, not session types.

```
        Telegram DM  /  Web UI                     ← user input edge
                  │
                  ▼
       ┌─────────────────────┐
root   │  topic: manager     │   long-lived named address,
       │  skills: per task   │   bound to Telegram DM (singleton)
       └──────────┬──────────┘
                  │   y chat --topic dev -m "..."
                  ▼
       ┌─────────────────────┐
trunk  │  topic: dev         │   received a task,
       │  (coordinator)      │   may dispatch further
       └──┬───────┬───────┬──┘
          │       │       │   y chat --skill {plan,impl,review}
          ▼       ▼       ▼
       ┌──────┐ ┌──────┐ ┌────────┐
leaves │ plan │ │ impl │ │ review │   anonymous, ephemeral;
       └──────┘ └──────┘ └────────┘   skill loaded per dispatch
```

**How do I follow a run that spans multiple sessions?** Reading any one session log only shows you that slice; the interesting story is the whole tree. So every dispatch carries a `trace_id`, and when the task is tracked it's just the `todo_id` — same identifier as the kanban card. A full run — root dispatched → dev planned → impl sessions ran in parallel → dev committed — replays as one waterfall in [TraceView](https://yovy.app/t/6fc5c4). The kanban card, the plan note, the worktree commits, and the trace are all the same thread seen from different angles.

**Are skills tied to topics?** I assumed yes at first — the `dev` topic runs the dev skill, the `blog` topic runs the blog skill. Then I noticed I was conflating two things. A topic is just a stable address; what work the session does depends on what message came in. So skills load per-task and aren't bound to topic. The same `dev` address can run a review skill one minute and an implementation skill the next, depending on what arrived.

All of this — addressing, dispatching, replying, callback — stays under one CLI. `y chat -m "..."` is async fire-and-forget; `--topic`, `--skill`, `--chat-id` are addressing flags on the same command. The protocol — when to set `--trace-id`, when to add `--new`, when to call back — lives in CLAUDE.md so every session can read it.

This is the only multi-agent design I've found that I can actually keep in my head. No central scheduler, no approval gates, no synchronous blocking — just messages, traces, and the same primitives recursing.

## Looking forward

When I wrote the y-cli introduction last year, I bet that the AI stack would keep moving fast and that the useful play was to build a thin, stable interface on top of it. A year later that played out: the underlying capability went from model APIs to coding agents, and the same thin-wrapper bet carried over to y-agent.

I think the line continues. Coding agent today; something more general tomorrow. Each layer of capability brings the agent closer to ordinary life — and y-agent's job is just to be the stable middle layer that tracks it without forcing me to relearn my own setup every six months.

The other half of this post, less argued: a small invitation. y-agent isn't a product — it's tools I built for myself. The satisfying part isn't the system, it's the position: one person, a coding agent, and a willingness to wire things together. If you have a coding agent and a few hours, you can build a setup that fits your life better than anything you'd buy off the shelf. That's worth more than what's in this post.

If you want to look at the code: [y-agent on GitHub](https://github.com/luohy15/y-agent).
