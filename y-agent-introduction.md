# y-agent: A Personal AI Agent System Built on Coding Agents

> [y-agent](https://github.com/luohy15/y-agent) was renamed from [y-cli](https://luohy15.com/y-cli-introduction).
> y-cli was a wrapper around model APIs.
> y-agent is a wrapper around coding agents.

## Demo

![y-agent TraceView](https://cdn.luohy15.com/y-agent-demo-4.png)

https://yovy.app/t/6fc5c4

---

Coding agents like Claude Code / Codex are genuinely useful for code, but code is only a sliver of what I deal with day to day. There are also bills, calendar, todos, notes, emails. I want the agent to handle those too, not just code.

This post walks through three things I ran into while extending a coding agent into a personal agent system, in the order I ran into them:
1. how to give context to the agent
2. how to keep the agent always around
3. agent orchestration

## Context

Basic idea: whatever data a human can see, the agent should be able to see too.

For raw files, humans and agents take the same path. Humans use editors, browsers, and the like to view and edit; agents use read, write, edit.

One layer up — for things direct file editing can't handle, or where it's too slow — humans use a GUI; the agent equivalent is a CLI. It actually likes CLIs, since it's used to Bash. The rule is one line: anything a human can do in a GUI, the agent should be able to do in a CLI.

The underlying file or DB data is one and the same for both.

A live example: I'm writing this post in an editor I share with the agent — I can edit by hand, or tell it what to change and let it do it.

## Always-on agent

I want the agent reachable any time, without lugging my laptop around or opening a terminal. When an idea hits, I just want to pull out my phone and say it.

So the coding agent runs on a remote server (e.g. EC2), held in a tmux session in the background. A tail process parses its output into my own database, so I can chat with it directly from a web UI.

OpenClaw came out later, but I didn't really like it — too much cognitive overhead. It did give me one idea though: hook in Telegram. Turns out Telegram beats Web chat for input on mobile, by a lot.

So now there are two routes — Web and Telegram — and I just call when I want it. The EC2 has auto-hibernate on, so when nobody's using it, the cost is very low.

## Orchestration

A single session often can't get the whole thing done. You need some orchestration — routing requests to the right session. Claude Code ships sub-agents as a built-in, but I don't want to use the built-in — I want this layer external.

That way the sub-agent chats are mine to manage too, and I can jump in mid-run to steer. The structure looks roughly like this:

```
   user        ┌──────────────────┐
   input  ───► │  skill: manager  │   only dispatches, doesn't execute
        │     └────────┬─────────┘
        │              │   y chat --skill dev -m "..."
        │              ▼
        │     ┌──────────────────┐
        ├───► │  skill: dev      │   coordinator;
        │     │                  │   coordinates downstream skill sessions
        │     └──┬──────┬──────┬─┘
        │        │      │      │   y chat --skill {plan,impl,review}
        │        ▼      ▼      ▼
        │     ┌──────┐ ┌──────┐ ┌────────┐
        └───► │ plan │ │ impl │ │ review │   anonymous, ephemeral;
              └──────┘ └──────┘ └────────┘   skill loaded per dispatch
```

A real trace: https://yovy.app/t/6fc5c4

## Looking forward

When I wrote the y-cli intro last year, I said that the AI stack would keep moving fast, and that the lasting play was to build a thin, stable interface on top of it. A year on, that held up: the underlying capability went from model APIs to coding agents, and the same thin-wrapper approach carried over from y-cli to y-agent.

I think the line continues. Coding agent today, a more general agent tomorrow. Each layer up, the agent gets closer to ordinary life — and y-agent's job is to be the stable middle layer that tracks the new capabilities, without making me relearn my own setup every six months.

If you have a coding agent and a few free hours, follow a similar approach — what you'll end up with will fit your life better than anything off the shelf.

Reference code: [y-agent on GitHub](https://github.com/luohy15/y-agent).
