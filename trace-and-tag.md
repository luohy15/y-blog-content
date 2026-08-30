# Trace + Tag: How I Find My Way Back to Old Agent Sessions

A few days ago I saw this tweet from [@ant_sz](https://x.com/ant_sz/status/2093329629604176065):

> 现在有什么好的agent session管理工具么？感觉现在的harness问题已经不是单个对话框的问题了，而是session开多了，找不到之前的上下文。。。

Roughly: "Is there any good agent session management tool? The problem with today's harnesses is no longer inside a single chat box. It's that once you've opened enough sessions, you can't find your earlier context anymore..."

My [y-agent](https://luohy15.com/y-agent-introduction) setup happens to solve exactly this, so this post shares the scheme. It's two layers: **trace** links the sessions of one task, **tag** groups tasks by topic. Coming back later, tag then trace gets me to the exact session in two hops.

Some background first. In y-agent, every session's messages land in my own database, and a task usually fans out to multiple sessions: a coordinator dispatches plan / impl / review sub-sessions.

## Layer 1: trace, the sessions of one task

Every task starts as a todo, and the todo id doubles as the trace id. Whenever a session dispatches a sub-session, the dispatch carries that id:

```bash
y chat --skill plan -m "look at todo 1290" --trace-id 1290
```

The sub-session inherits the id and passes it along when it dispatches further. So every session that touched one task shares one id, no matter how deep the tree goes. Finding them is one query:

```bash
$ y chat list --trace-id 1290
ID      Topic    Skill    Created
------  -------  -------  ----------------
a917f0  dev      dev      2026-08-25 11:51
3b82cd           plan     2026-08-25 11:52
9d41e6           impl     2026-08-25 12:01
c25a8f           review   2026-08-25 12:15
5e73b9           impl     2026-08-25 12:27
e0c614           review   2026-08-25 12:32
```

That's one shipped feature: a coordinator, a plan session, then two rounds of impl and review. Without the trace id, these would be six unrelated chats buried in history. With it, one piece of work is one spine.

The same id links the non-session artifacts too: the plan note, the review verdict, and the progress log all hang off todo 1290. A session is just one more thing attached to the task.

## Layer 2: tag, the tasks of one topic

Traces are per-task. But when I come back after two weeks, I usually don't remember a todo number. I remember a topic: "the Boston trip", "the tag system work". That's what tags are for.

There is one shared tag namespace across every data type: todos, notes, emails, calendar events. A tag is just a lowercase string like `boston-trip`, and one query pulls everything that carries it:

```bash
$ y tag get boston-trip
note:
  - 4b8e12: pages/boston-places.md
  - d92c47: pages/boston-hotel-shortlist.md
  ...(9 notes)
todo:
  - 1174: Create a Boston trip itinerary HTML
  - 1214: Sync email and evaluate the hotel cancel-and-rebooks
  ...(9 todos)
email:
  - 1841...: eTicket Itinerary and Receipt for Confirmation XXXXXX
  ...(5 emails)
calendar_event:
  - 81f3a6: Outbound flight
  ...(6 events)
```

One trip, 29 items, four data types, one tag. And each of those todos is a trace id, which fans out to the sessions that did the work.

## The retrieval path

So coming back cold, it's always the same two hops:

1. **tag → task**: `y tag get boston-trip`, spot the todo I care about, say 1214, the hotel cancel-and-rebook evaluation.
2. **task → session**: `y chat list --trace-id 1214`, open the session, and there's the full context of what was done and why.

The two layers do different jobs, and it matters that they don't collapse into one pile of metadata. A trace is a strong link: exact membership, this session worked on this task. A tag is a weak link: thematic, cross-task, cross-type. With tags alone, a hot project tag (`y-agent` carries 800+ items here) is far too coarse to locate a session. With traces alone, I'd have to remember todo numbers. Tag narrows to the task, trace nails the session.

Session retrieval is a data problem, not a harness feature. Sessions first have to land somewhere queryable, as your own data. After that, two cheap fields are enough to always find the way back: a task id on every session, and one or a few topic tags on every task.
