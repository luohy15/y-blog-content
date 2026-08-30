# Trace + Tag：我怎么找回之前的 agent session

前几天看到 [@ant_sz](https://x.com/ant_sz/status/2093329629604176065) 的一条推：

> 现在有什么好的agent session管理工具么？感觉现在的harness问题已经不是单个对话框的问题了，而是session开多了，找不到之前的上下文。。。

我感觉我的 [y-agent](https://luohy15.com/zhs/y-agent-introduction) 正好解决了这个问题，所以写篇博客分享一下方案。核心是两层：**trace** 把同一个任务的相关 session 串起来，**tag** 把任务按主题归拢。之后回来找的时候，先 tag 后 trace，两跳就能定位到具体的 session。

先交代下背景。在 y-agent 里，每个 session 的消息都落在我自己的数据库里，而且一个任务通常会展开成多个 session：一个 coordinator 派发 plan / impl / review 子 session。

## 第一层：trace，一个任务的所有 session

每个任务都从一个 todo 开始，todo id 直接兼作 trace id。session 派发子 session 的时候，把这个 id 带上：

```bash
y chat --skill plan -m "look at todo 1290" --trace-id 1290
```

子 session 继承这个 id，再往下派发时继续传。这样不管任务树多深，碰过同一个任务的所有 session 都共享一个 id。找它们只要一条查询：

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

这是一个上线了的 feature：一个 coordinator、一个 plan session、两轮 impl 和 review。没有 trace id 的话，这就是埋在历史里的六个互不相干的 chat；有了它，一件事就是一条主线。

同一个 id 还串起非 session 的产物：plan note、review 结论、进度记录，全挂在 todo 1290 下面。session 只是挂在任务上的又一样东西。

## 第二层：tag，一个主题的所有任务

trace 是按任务算的。但两周之后回来，我通常记不住 todo 编号，我记得的是主题："Boston 那趟旅行"、"tag 系统那摊事"。这就是 tag 干的活。

所有数据类型共用一个 tag 命名空间：todo、note、email、日程。tag 就是一个小写字符串，比如 `boston-trip`，一条查询把带着它的东西全拉出来：

```bash
$ y tag get boston-trip
note:
  - 4b8e12: pages/boston-places.md
  - d92c47: pages/boston-hotel-shortlist.md
  ...（9 篇 note）
todo:
  - 1174: Create a Boston trip itinerary HTML
  - 1214: Sync email and evaluate the hotel cancel-and-rebooks
  ...（9 个 todo）
email:
  - 1841...: eTicket Itinerary and Receipt for Confirmation XXXXXX
  ...（5 封邮件）
calendar_event:
  - 81f3a6: Outbound flight
  ...（6 个日程）
```

一趟旅行，29 条数据，四种类型，一个 tag。而其中每个 todo 都是一个 trace id，往下就是干活的那些 session。

## 检索路径

所以冷启动回来找东西，永远是同样的两跳：

1. **tag → 任务**：`y tag get boston-trip`，扫一眼找到关心的 todo，比如 1214，酒店退订重订的那次评估。
2. **任务 → session**：`y chat list --trace-id 1214`，打开 session，做了什么、为什么这么做，上下文全在。

这两层各干各的事，关键是别把它们混成一堆笼统的 metadata。trace 是强关联：精确的成员关系，这个 session 就是为这个任务干活的。tag 是弱关联：按主题、跨任务、跨类型。只有 tag 的话，热门项目的 tag（我这里 `y-agent` 挂了 800 多条）粗到根本定位不了 session；只有 trace 的话，我得背 todo 编号。tag 收窄到任务，trace 钉死到 session。

session 检索是个数据问题，不是 harness 的功能问题。session 先得作为你自己的数据落到一个可查询的地方，之后只要两个便宜的字段，就永远找得回来：每个 session 挂一个任务 id，每个任务挂一个或几个主题 tag。
