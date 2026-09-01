# 从三个月 6,081 次到单月 8 万：一份个人 agent 成本账

去年 7 月我写过一篇 [AI 编程工具使用记录](https://luohy15.com/zhs/2025/07/12/ai-coding-tools-experience)。配图是 OpenRouter 的 Activity 页：2025-04-12 到 2025-07-12，三个月 **6,081 次请求**，花了 $294.82，大约每月一百刀。Prompt 9230 万、Completion 286 万，合计大约 9500 万 token，几乎全是 Claude Sonnet 4。

文末我写：「切换到 Claude Code 后使用频率增加了，所以如果模型未来不降价的话，月费用预计会更高。」

一年后，频率高了两个数量级。账单没有按比例涨。

## 两张表

口径先说清楚。去年是 OpenRouter 的 request；现在是我这边 relay（[claude-relay-service](https://github.com/Wei-Shaw/claude-relay-service)）记的 model request。不是同一张表接起来的，方向对得上。

| | 2025-04 ~ 2025-07（91 天，OpenRouter） | 2026-08（31 天，CRS） |
| --- | --- | --- |
| 请求 | 6,081 | 80,995 |
| Token | ~0.95 亿 | 75.6 亿 |
| 钱 | $295（实付） | $6,915（API 标价，不是实付） |

按月均请求算，大约 40 倍（每月约 2,000 → 81,000）。按月均 token 算，大约 240 倍。

更清楚的一句：**2026-08-14 一天 9,234 次请求，已经超过去年那整个季度。** 那天 token 10.4 亿，标价 $763。

中间几个月的请求量是爬上来的，不是某天突然爆：5 月 1.4 万，6 月 3.1 万，7 月 5.6 万，8 月 8.1 万。CRS 从 2026-05-24 才有日数据，更早的 Max 用量不在这张表里。

去年那张 OpenRouter 图还在：

![](https://cdn.luohy15.com/ai-coding-tools-using-experience-3.png)

## 钱为什么没爆

去年 7 月 OpenRouter 花超了 $200，8 月我改成 Claude Max + 自建 relay。现在的现金流主要是订阅窗口（Claude / Codex / Grok），外加一点 API。写这篇的时候 Claude 周窗口用了大约三分之一。

所以 8 月那 $6,915 是按 API 标价折出来的 notional，不是信用卡账单。这才是续篇真正要说的事：去年三个月实付三百刀买了 6,081 次；现在单月能跑出标价七千刀的活，付的还是订阅。

用量能涨上去、标价没变成实付，靠三件事。

**订阅。** 能走 Max / 包月的就不要走 API。这是 2025-08 就做的决定，只是当时还看不出后面会涨到这个量。

**Cache。** 8 月 75.6 亿 token 里，68.3 亿是 cache read，占 90%。真正新写入的 input 4.2 亿，output 只有 0.45 亿。Session 前缀稳的话，大部分 token 是在重复读已经付过一次的 context，不是每 turn 全价重跑。

**模型分工。** 同样是 8 月：

| 模型 | Token | 标价 | 请求 | 每十亿 token |
| --- | --- | --- | --- | --- |
| claude-opus-5 | 29.9 亿 | $3,015 | 29,241 | ~$1,009 |
| claude-sonnet-5 | 15.8 亿 | $501 | 12,174 | ~$318 |
| gpt-5.6-sol | 12.8 亿 | $1,734 | 16,390 | ~$1,359 |
| claude-fable-5 | 2.3 亿 | $505 | 2,595 | ~$2,180 |

量走 Sonnet，判断走 Opus / Fable。Fable 的 token 只有 Sonnet 的七分之一，标价几乎一样。如果 75 亿全跑在 Fable 上，标价会很难看。

编排本身我也写过：[y-agent 介绍](https://luohy15.com/zhs/y-agent-introduction) 是怎么把一个任务拆成一棵 session 树，[trace + tag](https://luohy15.com/zhs/trace-and-tag) 是事后怎么找回来。这篇不重复。树的好处落在账上，就是单 session 不必把整件事塞进一个窗口里空转，cache 才撑得住 90%。

## 局限

- OpenRouter 的 request 和 CRS 的 model request 不是同一个计数器。对比的是数量级，不是精确倍数。
- $6,915 是 API 标价加总，不是 8 月实付。实付是订阅加少量 API，我没有把每张卡的账单公开对上。
- Token 含 cache read。90% 这个比例是优点，也意味着「75 亿 token」不能理解成 75 亿字的新内容。
- 单用户、一个 harness。不是公司用量。

去年那句「月费用预计会更高」说对了一半。频率确实高了。按 API 标价看，高了不止一倍。按现金看，没有跟着 40 倍请求一起走。
