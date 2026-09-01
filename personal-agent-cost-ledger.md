# From 6,081 Requests in a Quarter to 81,000 in a Month

In July 2025 I wrote [a record of the AI coding tools I was using](https://luohy15.com/2025/07/12/ai-coding-tools-experience). The screenshot was OpenRouter's Activity page: 12 Apr to 12 Jul 2025, **6,081 requests** in three months, $294.82 spent, about $100 a month. Prompt tokens 92.3M, completion 2.86M, call it 95M tokens, almost all Claude Sonnet 4.

I ended with: after switching to Claude Code, usage was already up, so if model prices did not fall, the monthly bill would likely rise.

A year later, frequency is up two orders of magnitude. The cash bill did not follow.

## Two tables

Different counters. Last year is OpenRouter requests. This year is model requests from my own relay ([claude-relay-service](https://github.com/Wei-Shaw/claude-relay-service)). Not one continuous series. The direction still holds.

| | Apr–Jul 2025 (91 days, OpenRouter) | Aug 2026 (31 days, CRS) |
| --- | --- | --- |
| Requests | 6,081 | 80,995 |
| Tokens | ~95M | 7.56B |
| Money | $295 (what I paid) | $6,915 (API list price, not what I paid) |

Monthly requests are about 40x (roughly 2,000 → 81,000). Monthly tokens are about 240x.

The cleaner sentence: **on 14 Aug 2026 I sent 9,234 requests in one day, more than that entire quarter last year.** That day was 1.04B tokens, $763 at list price.

The request count climbed; it was not a one-day spike: 14k in May, 31k in June, 56k in July, 81k in August. CRS daily rows only start on 24 May 2026, so earlier Max usage is not in this table.

The OpenRouter screenshot from last year:

![](https://cdn.luohy15.com/ai-coding-tools-using-experience-3.png)

## Why the bill did not explode

In July 2025 OpenRouter went past $200. In August I moved to Claude Max plus a self-hosted relay. Cash now is mostly subscription windows (Claude / Codex / Grok), plus a little API. While writing this, the Claude weekly window was about one third used.

So the $6,915 for August is notional API list price, not a credit-card statement. That is the actual sequel: three months last year bought 6,081 requests for three hundred dollars cash; one month now produces seven thousand dollars of list-price work, still billed as subscriptions.

Three things let volume rise without the cash line tracking it.

**Subscriptions.** If a Max / monthly plan covers it, do not pay API. I made that call in Aug 2025. I did not yet know the volume would look like this.

**Cache.** Of 7.56B tokens in August, 6.83B were cache reads: 90%. Fresh input was 0.42B, output only 0.045B. If the session prefix is stable, most tokens are rereading context already paid for, not a full-price rebuild every turn.

**Model mix.** Same month:

| Model | Tokens | List price | Requests | $ / billion tokens |
| --- | --- | --- | --- | --- |
| claude-opus-5 | 2.99B | $3,015 | 29,241 | ~$1,009 |
| claude-sonnet-5 | 1.58B | $501 | 12,174 | ~$318 |
| gpt-5.6-sol | 1.28B | $1,734 | 16,390 | ~$1,359 |
| claude-fable-5 | 0.23B | $505 | 2,595 | ~$2,180 |

Volume on Sonnet, judgment on Opus / Fable. Fable used about one seventh of Sonnet's tokens and almost the same list dollars. Put all 7.56B on Fable and the notional number gets ugly.

I already wrote the orchestration: [the y-agent intro](https://luohy15.com/y-agent-introduction) is how one task becomes a session tree; [trace + tag](https://luohy15.com/trace-and-tag) is how I find it later. This post does not repeat that. The ledger effect is that a single session does not have to hold the whole job in one window, which is why cache can sit at 90%.

## Limits

- An OpenRouter request and a CRS model request are not the same counter. The comparison is order of magnitude, not an exact multiple.
- $6,915 is summed API list price, not August cash. Cash is subscriptions plus a little API. I am not reconciling card statements in public.
- Tokens include cache reads. The 90% figure is the point; it also means "7.56B tokens" is not 7.56B tokens of new text.
- One user, one harness. Not company-scale usage.

Last year's line about the monthly bill rising was half right. Frequency did rise. At API list price, it rose by more than 2x. In cash, it did not ride along with a 40x request count.
