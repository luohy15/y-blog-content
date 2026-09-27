---
tags: [ai-agent]
---
# My AI Dev Setup: One Entry Point, a Cloud Workspace

![Architecture: desktop, tablet, and phone use Web or Telegram to reach one y-agent system; Claude Code runs tasks with side-connected EC2 files and RDS data; a self-hosted relay connects model access conceptually to Claude, GPT, and Grok, with provider-specific routes and terms.](https://cdn.luohy15.com/blog/images/my-ai-dev-setup.svg)

I recently read ["My Agent Setup"](https://knowledge.you-find.me/articles/9c37a536-d589-4508-8f14-870f19b24735), which breaks the author's tools down into Client, Memory, Runtime, Gateway, and model sources. I liked that angle, so here's a look at my own setup through the same lens.

First, the problem I want to solve: **when I have a task in mind, I don't want to open my laptop, find the project, and launch a terminal before I can start talking to an agent.** If I can explain what I need from my phone, it should be able to get started. Call me back when there's a decision to make or work to check.

So I keep the workspace on EC2 and use y-agent as one entry point, whether I'm on desktop or mobile. Telegram plugs into it as a better chat input interface. Code, notes, and task records stay in my own system, rather than belonging to a particular chat window.

## Trying It in Boston: Could I Work with Just a Tablet?

On my [trip to Boston](https://luohy15.com/2026/09/08/boston-2026), I left the laptop behind and took only an iPad and iPhone. As I wrote in the travelogue:

> Partly as an experiment, to see whether a tablet alone is enough to get work done.

The answer was yes. This setup actually supported my work during the trip, not just sending a message from my phone and checking progress.

Of course, it wasn't as efficient as working on a laptop or a large screen. But the difference was mainly in the display and interaction on my end. Nothing changed about how the agent did its work. It still read code, edited files, and ran commands in the same cloud environment. Switching to an iPad didn't take any tools away from it.

My friend L jokingly called the system **waywork**, combining work and on the way. With just Telegram and Safari, I can get work done on the road.

The name fits. It's not that a tablet can replace a computer for everything. It's that when I need to do some work away from my desk, I don't first have to get back to the laptop with the dev environment installed.

## The Setup at a Glance

| What the layer handles | What I use |
| --- | --- |
| Sending requests and reading results | y-agent as one entry point on desktop and mobile, with Telegram integrated as a chat input interface |
| Storing project context and task state | Files on EC2 + a database on RDS |
| Reading code, editing files, running commands | Claude Code |
| Connecting to models | A self-hosted relay service, maintained as my own fork |
| Model sources | Claude / GPT / Grok subscriptions |

These aren't five services in a linear pipeline. Files and the database hold material that's read and written as needed during work; they aren't a stop every model request has to pass through. And the model source isn't the runtime: using Claude Code to execute a task and choosing which model to use are two separate questions.

Here's how a task moves through the setup.

## Entry Point: y-agent Is the Universal Entry Point, Telegram Is the Input Interface

[y-agent](https://github.com/luohy15/y-agent) is my universal entry point. Whether I'm on desktop or mobile, conversations with agents, task management, context, and results all live around the same system.

Telegram has a simpler role: a better chat input interface. It already makes conversation easy, so I plug it in rather than spend too much time polishing my own input UI.

This isn't y-agent on desktop and a separate Telegram system on mobile. Telegram is just one way into y-agent. Tasks and context remain the same, and switching devices doesn't mean introducing the project all over again.

Say I want to change a feature. I start by explaining what I want. Work that needs ongoing tracking becomes a todo, and the discussion, plan, and changes stay attached to that task. I don't have to dig them out of chat history afterward.

Remote chat alone isn't the point. If I just move a terminal onto my phone, I'm still watching it work. What I want is: **I send out a task, and what comes back is something that needs my attention.**

## Memory: Files on EC2, Structured Data on RDS

When a new session takes over, the hard part isn't getting it to write code. It's getting it to understand what's already been decided.

My approach is fairly plain. Code, project conventions, plans, and review conclusions go in files. Task state, chat records, and the links between them go in the database. The files live on EC2; the database runs on RDS.

Files are good for keeping the full story. Why a design was chosen, which alternatives were rejected, where to pick up next: a note is easier to find than fragments scattered across dozens of chat turns.

The database is good for specific questions: which sessions worked on this task? Whose turn is it? Which task was that earlier plan linked to? The agent queries this data through the `y` CLI, without me copying it over manually.

If a different session takes over halfway through a task, it reads the todo first, then follows the links to the plan and progress. It doesn't need every conversation from the previous session, but it does need to find the facts required to continue.

So by memory, I don't mean "put every chat back into the prompt." **Saving something and finding it when you need it are two different things.** I use task IDs to connect records from the same piece of work, then tags to find related topics. I covered this in [an earlier post](https://luohy15.com/trace-and-tag).

## Execution: Claude Code Does the Work, Orchestration Lives Outside

Claude Code is what actually reads code, edits files, and runs commands. I haven't written another coding agent execution loop myself.

But deciding how to split a task, which session to assign it to, and how to hand results over lives in y-agent.

For something simple, one session can finish the job. A more involved development task usually goes through planning, implementation, and review. Each step can use a fresh session that reads the material attached to the same task, rather than squeezing every stage into an ever-longer conversation.

These sessions aren't a fixed set of "employees" sitting around, either. Each loads the skill it needs for the work at hand, and splits off more work if the task calls for it. A skill holds the instructions for how that step should be done.

One practical reason I keep orchestration outside is that **I want to manage the sub-task chat records too.** I can see their inputs and outputs, and step in to correct course when needed, instead of only getting the main session's account of what happened.

Splitting things up doesn't automatically make them better. If the requirements are unclear, several sessions can get them wrong together. A review doesn't replace my own acceptance check, either. Orchestration organizes the work; it doesn't decide what I actually want to build.

## Model Access: A Self-Hosted Relay, Separate from the Workspace

For model access, I self-host [claude-relay-service](https://github.com/luohy15/claude-relay-service) and maintain my own fork. My model subscriptions are Claude, GPT, and Grok.

I deliberately keep a few things separate:

- y-agent handles how I hand over tasks and find context again.
- Claude Code handles how a session uses tools to carry out the work.
- The relay handles model request access and forwarding.
- Subscriptions provide model capabilities; they aren't where project state lives.

I don't want switching models to mean switching my work interface and task records too. At the very least, where the code lives, where the plan is, and what's still unfinished shouldn't depend on which model provider I chose this time.

But separating the layers doesn't make every combination compatible. Interfaces, tool calling, and each provider's subscription restrictions still need to be checked individually. This is a description of my own setup, not a tutorial claiming that buying a subscription lets you use it as a general-purpose API.

Self-hosting has limits too. Keeping my own work records doesn't mean model inference happens locally; context sent to a model still leaves this machine. Adding a relay also means another service to maintain.

## Putting It Together: I Handle the Ends, Let It Run in Between

For an ordinary feature request, this is how I want things to go:

1. I explain what I need through Telegram or the web and leave a trackable task.
2. The agent reads the project and existing material, making a plan first if needed.
3. An execution session edits code and runs checks in the working directory, then a review session examines the changes.
4. The plan, review conclusions, and progress are attached to the task, not left only in separate chats.
5. When a decision, publication approval, or acceptance check needs me, the task comes back.

Publication is a separate boundary. Passing review doesn't mean something can go straight to production. Which version is being shipped and which changes it includes need to be clear, and I approve it first.

When a task needs me, it goes into `awaiting`, my inbox. If it's still running or just waiting for another sub-task, it shouldn't call me back to click "continue."

I've [written about this separately](https://luohy15.com/async-collaboration-awaiting). For daily use, it matters more to me than adding another model: I no longer have to keep switching chats to guess whether it's my turn.

## The Costs Are Straightforward Too

This isn't something I install and forget. EC2, the database, the relay, the client, and keeping state consistent between them all become my maintenance work. When something breaks, I can't just blame the model.

Keeping my own task records also means being responsible for backups, permissions, and data boundaries. Being able to switch models doesn't make the whole system free of migration costs.

If I only wanted AI to help change a few lines of code now and then, an off-the-shelf tool would be much simpler. I'm willing to maintain this setup because I don't just want a better chat box. I want it to fit into how I handle things every day.

Looking back at the table, the models are the part most likely to change. Project context, task records, and the way work gets handed over are the parts worth keeping.

**That's the working habit I want to preserve: hand over a task whenever I need to, have somewhere to check what happened, and come back when it's my turn.**
