# I Knew I Should Work Asynchronously. I Only Managed It After awaiting

"Async collaboration makes you more efficient." I agreed with that a long time ago.

My [y-agent](https://luohy15.com/y-agent-introduction) setup has always been parallel: one todo opens one trace, which dispatches plan / impl / review sub-sessions underneath. Running five or six tasks at once was never the technical problem.

But that wasn't what my day actually looked like. What was I doing after dispatching? Switching between chats. Is this one done? Is that one stuck? Is it my turn yet? A full pass, nothing much changed, and ten minutes later another pass.

**The tasks were async. My attention wasn't.** That's why knowing it never turned into doing it.

## What was missing wasn't concurrency, it was a handoff line

Once I saw it clearly, what I needed was small: the system had to draw one explicit line between two states.

One is **it's working**, where I shouldn't be interrupted and shouldn't be looking. The other is **it's my turn**, where either a decision only I can make is waiting, or the work is finished and waiting for me to verify it.

Without that line I could only guess by polling. The cost of guessing isn't those few minutes, it's attention: as long as some part of me is still tracking "no idea where that task got to", I can't concentrate on anything else. The tasks ran in parallel. I ran serially.

## awaiting: one status, and that's my inbox

What it landed on is far simpler than what I first imagined. **Not an inbox system, just one more status on a task: does this need me right now.**

Because the trace id is the todo id, a task has exactly one such status no matter how many chats it fans out into underneath. **I handle tasks, not chats.** So the inbox isn't a new thing, it's a filter over the todo list:

```bash
$ y todo list --status awaiting
  ID  Name                                                Status    Chat
----  --------------------------------------------------  --------  ------
3502  Build a shared household finance dashboard with Wu  awaiting  eacfbb
3492  Fix social analyst falling back to news             awaiting  -
```

`pending` / `active` / `awaiting` / `completed`, just one more slot. Getting in and out has no dedicated command either, it's the same as changing any other status: `y todo status <id> awaiting` to enter, `y todo status <id> active` to leave. And most of the time I don't even do the leaving part: I reply once in that task's chat and it goes back to active on its own.

When something enters the status, the system sends me a message. So I don't have to poll this list either.

Empty means nothing is waiting on me. That sounds like a small sentence, but it is the actual output of the whole thing: **I can finally stop looking, and trust that.**

## What it freed up was my attention

Looking back, awaiting didn't make a single agent faster. It did exactly one thing: **it decoupled task execution from my attention.**

Concretely, in the shape of my day:

**It used to be question and answer.** One agent and I pushed one thing forward in lockstep, and while it ran I watched it run. Those waits were never long enough to go do something else, but always long enough to break my train of thought, so they just burned.

**Now it's dispatch plus working a queue.** Think through what I want, send a few off at once, then drop them. I don't know where they are, and I don't need to. When a notification interrupts me, I work through a batch at once: this one needs a call, that one needs verifying, this one went the wrong way and goes back.

A few side effects that I think matter more than the mechanism itself:

- **The shape of my input changed.** I used to spend most of my effort watching the process and correcting it as it went. Now it's concentrated at the two ends: state the requirement clearly up front, verify carefully at the end. I'm not in the middle anymore, which also forces me to think the requirement through, because there's no rescuing it halfway.
- **I stopped avoiding slow things.** A task that takes 40 minutes used to trigger an instinctive "too slow, forget it", because those 40 minutes were mine to sit through. Now dispatching it costs me nothing, and the psychological price of a long task is close to zero.
- **An empty inbox became a signal I can trust.** This is the best part. "I think there's nothing left" always carried some doubt, and I'd do one more sweep to feel safe. Now it's the result of a query. When the inbox is empty I actually go rest, instead of holding five half-finished things in my head.
- **The cost is giving up the feeling of control over the process.** Not watching means some things run in the wrong direction for fifteen minutes and can only be sent back when I see them. That cost is real, but compared to my old mode of watching the whole time and still having to redo the work, it's a bargain.

## Closing

None of this is new. Async collaboration, work queues, turning interrupts into a batchable inbox: people have done all of it before.

But "knowing async makes you faster" and "actually rebuilding your own way of working around it" are two different things. I was stuck in between for a long time, and what blocked me wasn't understanding, it was the missing handoff line. Once that existed, the understanding I already had could finally be executed.

**The method doesn't have to be new. What's new is what it means for me.**
