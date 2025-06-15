# 响应式编程入门

## 背景：反应式宣言

近年来，应用程序的需求不断变高，对架构设计的要求也随之改变

[反应式宣言](https://www.reactivemanifesto.org/zh-CN) 是综合不同领域软件架构的模式后，对架构设计方案中必要关注点的说明

现代软件系统（反应式宣言追求的反应式系统）希望具备以下特质

1. 即时响应性（Responsive）：快速而一致的响应时间
2. 回弹性（Resilient）：系统出现失败后保持响应
3. 弹性（Elastic）：系统根据吞吐量自动调整资源，要求系统具有可伸缩性（Scale）
4. 消息驱动（Message Driven）：依赖于异步的消息传递

![](https://cdn.luohy15.com/reactive-programming-intro/1.svg)

反应式宣言特质的具体说明参考 [宣言词汇表](https://www.reactivemanifesto.org/zh-CN/glossary)

软件规范相关的宣言还有 [The Twelve-Factor App](https://12factor.net/zh_cn/) ，[语义化版本](https://semver.org/lang/zh-CN/)，[如何维护更新日志](https://keepachangelog.com/zh-CN/1.0.0/) 等

## 概念&原理

![](https://cdn.luohy15.com/reactive-programming-intro/1.png)

上图是常见的服务整体架构图，一个服务除了作为服务端外，也常常作为客户端依赖于其它服务

有几个问题与反应式宣言中提到的特质相关

1. 消息驱动：事件循环是什么？
2. 回弹性：背压是什么？
3. 可伸缩性：服务端如何处理高并发？

### 事件循环：同步模式 vs 异步模式

同步模式：发起I/O请求后等待，返回后执行下一个操作

![](https://cdn.luohy15.com/reactive-programming-intro/2.png)

异步模式：发起I/O请求后交给Event Loop线程，主线程可以继续执行。I/O请求返回后主线程收到通知事件进行相应处理

![](https://cdn.luohy15.com/reactive-programming-intro/3.png)

异步模式利用了等待时间，提高了运行效率

### 流量控制：背压

![](https://cdn.luohy15.com/reactive-programming-intro/1.gif)

当下游系统（如图中B）处理速率跟不上上游系统（如图中A）调用的速率时，为了保护下游系统不被打崩（假设还有其他服务依赖B），则需要有流控策略，有以下三种方案：

1. 控制：降低上游速率，从源头减少流量
2. 缓冲：将多余的流量缓冲起来
3. 丢弃：将无暇处理的流量丢弃

缓冲不是无限的，当缓冲满了，只有控制和丢弃两种策略，若业务不允许丢弃，则需要实现下游系统控制上游系统的策略，即背压

### 并发处理：I/O模型

| 服务器并发方案                                       | 示例                                      | I/O模型   | 模型说明                                                     |
| :--------------------------------------------------- | :---------------------------------------- | :-------- | :----------------------------------------------------------- |
| TPC（Thread Per Connection）：每个连接使用一个线程   | 阻塞socket，Java BIO，Servlet，Spring MVC | 阻塞I/O   | 进程发起I/O系统调用时被阻塞（进程进入等待状态）              |
| 轮询：使用一个线程轮询所有连接，有数据的时候进行处理 | 非阻塞socket                              | 非阻塞I/O | 进程发起I/O系统调用时如果数据未准备好，进程不会被阻塞，而是返回错误 |
| Reactor模式：内核通知某些连接有数据后再进行操作      | Java NIO，Netty，Spring WebFlux           | I/O复用   | 进程阻塞在I/O复用的系统调用（如select）上等待数据准备好      |

## 项目介绍

### RxJava

ReactiveX 是 Reactive Extensions 的缩写，一般简写为 Rx，最初是 LINQ 的一个扩展，由微软的架构师 Erik Meijer 领导的团队开发，在2012年11月开源。

Rx 是一个编程模型，目标是提供一致的编程接口，帮助开发者更方便的处理异步数据流。

Rx 的大部分语言库由 ReactiveX 这个组织负责维护，比较流行的有 RxJava/RxJS/Rx.NET，社区网站是 [reactivex.io](http://reactivex.io/)。

RxJava从3.x 开始实现 Reactive Streams

![](https://cdn.luohy15.com/reactive-programming-intro/4.png)

### Reactive Streams

Reactive Streams 项目制定了 stream 异步处理的标准API（以及相应测试），最大的特点就是支持背压。

它只是一个标准，定义了实现异步背压的必需接口，各大实现在实现了基本功能的同时可以自由扩展。

比较主流的实现是 ReactiveX 项目组中的 RxJava 项目（3.x），以及 Spring WebFlux 依赖的 Project Reactor。

### Project Reactor

Project Reactor 被定义为 [第四代](https://akarnokd.blogspot.com/2016/03/operator-fusion-part-1.html) reactive library（RxJava是第二代），它也实现了Reactive Streams的标准，主要用来构建JVM环境下的非阻塞应用程序。

它提供了两个非常有用的异步序列 API：Flux 和 Mono。

### Spring WebFlux

在Spring 5中，Spring 引入了 WebFlux 的概念，WebFlux 的底层是基于 Reactor Netty ，而 Reactor Netty 就使用了 Reactor 库。

![](https://cdn.luohy15.com/reactive-programming-intro/5.png)

## 代码示例

### Reactive Streams

Reactive Streams：https://github.com/reactive-streams/reactive-streams-jvm

### Project Reactor

1. Flux 和 Mono 初始化及转换及订阅
2. 背压
3. 错误处理
4. 线程隔离

Reactive Programming with Reactor 3：https://tech.io/playgrounds/929/reactive-programming-with-reactor-3/Intro

Reactor limitRate Example：https://www.vinsguru.com/reactor-limitrate-example/

### Spring WebFlux

SpringBoot中的响应式web应用：https://www.cnblogs.com/flydean/p/13983777.html#reactive-in-spring

在Spring data中使用r2dbc：https://www.cnblogs.com/flydean/p/14054290.html

## 参考链接

什么是 Event Loop？http://www.ruanyifeng.com/blog/2013/10/event_loop.html

背压(Back Pressure)与流量控制：https://lotabout.me/2020/Back-Pressure/

Backpressure explained：https://medium.com/@jayphelps/backpressure-explained-the-flow-of-data-through-software-2350b3e77ce7