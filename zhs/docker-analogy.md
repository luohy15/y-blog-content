
# [转载] Docker -- 概念类比的入门

原文链接：[Docker -- 概念类比的入门](https://hoblovski.github.io/2018/08/03/Docker-%E5%AE%9E%E7%94%A8%E7%B1%BB%E6%AF%94%E5%85%A5%E9%97%A8.html)

## Docker 用途

- 将应用程序以及其需要的环境打包进独立的 image 中，使得依赖版本控制变得简单，简化部署
- 提供轻量级的容器，提高服务的 scalability

## container 和 image

- image 是 container 的模板。container 是运行的 image 实例。
- 一个 image 可以同时有多个运行的 container
- 可以有如下的类比：image 和 container 的关系类似 program 和 process 的关系

## 容器和程序的类比

类似

```plaintext
               build              run
Dockerfile  ----------> image   --------> container
                  # analogous to #
               make               run
Makefile    ----------> program -------> process
```

## 命令

```bash
$ docker image pull IMAGE_NAME
```

获取远程 image 到本地。类似 `wget REMOTE_PROGRAM`. `IMAGE_NAME` 格式是 `NAME[:TAG]`. `TAG` 指代版本，忽略则自动使用 `NAME:latest`.

```bash
$ docker image ls
```

列出本地有的 image. 类似 `ls`.

```bash
$ docker image rm IMAGE_NAME
```

移除本地某 image. 类似 `rm LOCAL_PROGRAM`

```bash
$ docker container run [OPTS] IMAGE_NAME [COMMAND] [ARGS]
```
创建一个 container 运行指定的 image. 如果本地没有这个 image, docker 将下载它。
类似 `./PROGRAM`.
常用参数有：
- `-p HOST_PORT:CONTAINER_PORT`: 映射网络端口
- `-v HOST_PATH:CONTAINER_PATH`: 映射目录
- `-it`: 通常配合 `COMMAND` 为 `bin/bash` 运行，表示打开 container 中的一个 shell.

```bash
$ docker container ls
```

列出正在运行的所有 container. 类似 `ps aux`, 但是不列出 “僵尸进程” （参见后文）.

```bash
$ docker container stop CONTAINER_ID
```

给 container 发送 SIGTERM, 过默认 10 秒之后 SIGKILL 掉。类似 `kill -15 PID`.

```bash
$ docker container kill CONTAINER_ID
```

给 container 发送 SIGKILL. 类似 `kill -9 PID`.

```bash
$ docker container logs CONTAINER_ID
```

观察 container 的输出。因为默认 container 输出不显示到主机。

container 运行结束之后不会被立即删除，它的退出码，以及生成的数据文件都被保留。可以使用　`docker container import/export`　导出数据．

```bash
$ docker container ls -a
```

列出所有 container, 包括运行完成还未被删除的 container. 类似 `ps aux`, 包含僵尸进程 (<defunct>). 另有参数 - `-s`: 列出 container 大小。通常是修改 / 写入文件的大小。执行命令也会增加大小，因为会修改 `.xx_history`.

```bash
$ docker container run --rm IMAGE_NAME
```

同上，但是运行完成后自动删除。类似 detached fork.

```bash
$ docker container exec -it CONTAINER_ID /bin/bash
```

针对正在运行的 container, 打开一个 shell.

```bash
$ docker start CONTAINER_ID
```

开始运行已经完成还未被删除的 container. 其中数据被保留。开销比新建 container 小。

```bash
$ docker attach CONTAINER_ID
```

链接输入输出到 container. 如容器运行了一个 `sh`, 通过 `attach` 来连接这个 `sh`.

## Dockerfile

Dockerfile 用来描述一个 image 的构建过程，其有那些组分 etc. 使用命令

```bash
$ docker image build -t name:tag PATH
```

来构建一个 image.

由一系列指令组成。

- `FROM IMAGE_NAME` : 该 image 构建在那个 image 之上。通常有
- `FROM scratch`: 从一个空的 image 开始运行应用。连 libc 都没有所以需要静态编译应用。
- `FROM alpine:latest`: 从发行版开始运行应用。
- `CMD COMMAND`: 容器启动后运行什么命令
- `ENTRYPOINT`: 容器启动之后运行的命令
- `COPY HOST_PATH CONTAINER_PATH`: 将主机上 `HOST_PORT` （相对于 `docker image build` 的参数 `PATH`) 中的内容复制到 image 中的 `CONTAINER_PATH`.

## 分层的看法

一个 docker image 由多层组成，每层代表某项功能。这样的分层功能通过 docker 内部的一种文件系统来实现。image 的每层是只读的，因此多个 image 可以复用同一层。

Dockerfile 中每条指令就是声明声明 image 中的一层，因此要注意

- 不能像写 shell 脚本一样，多条命令拆到多个 `RUN` 里面。应当尽量在一个 `RUN` 中，用 `&&` 连接。
- 每层最后要清理自己的垃圾 （一系列 `rm`), 因为以后的层无法清理该层的垃圾了

否则 image 会不必要地臃肿。

container 也由多层组成。事实上，它是在自己的 image 最顶上加了一层可写层。并且写也是通过 COW 完成的，因为底层是只读的。

## attach 和 detach

有时，我们希望使用某 container 的 interactive 服务。那么可以采用如下的工作流。

- 首先 run, 使用 detach 模式，让 container 变成常驻的。如果需要使用 shell （这是大多数情况） 那么还要加入 interactive 和 tty.
- 需要使用的时候，docker attach 上去
- 用完再 detach.
- 特别小心不要删除了 container – 那样所有数据都会丢失。

以 klee 为一个例子。klee 的安装提供了两种方式，docker 和源代码。源代码安装的 guide 是古老的 LLVM 3.4, 在 16.04 的 LLVM apt 中已经被 deprecate 了。而手动编译 LLVM 3.4, 根据 KLEE 的说法，需要使用 autoconf 而不能用 cmake. 但是 autoconf 其实已经被 LLVM 抛弃很久了。

手动安装遇到这么多问题，我还是决定使用 docker. 首先需要 docker pull 等，这部分就不说了。

1. 运行常驻 container. 可能为了通信，还需要加 volumn mapping 等。

    ```bash
    $ docker container run -itd --ulimit='stack=-1:-1' --name="klee" klee/klee /bin/bash
    ```

    有时候你会手贱在 bash 里面打出一个 EOF 或者 exit, 为了防止这种情况的出现，可以改成

    ```bash
    $ docker container run -itd --ulimit='stack=-1:-1' --name="klee" klee/klee /bin/bash -c 'while true; do bash; done'
    ```

2. 需要跑 klee 的时候，attach 上去。attach 完之后可能需要多按几次回车让 bash prompt 刷出来。

    ```bash
    $ docker container attach klee
    ```

3. 需要 detach klee 的时候，使用默认键组合 `<C-P> <C-Q>`.

## 实例

### 部署 nginx

Dockerhub 上有官方的 nginx. 我们选择 nginx:1.15-alpine 因为 alpine 版本更小，并且功能上没有损失。

```bash
$ docker pull nginx:1.15-alpine
$ docker container run -p 80:80 -d nginx:1.15-alpine
```

其中 `-d | --detach=true` 是必需的。因为不带命令地运行是 `nginx -g 'daemon:off'`, 导致 container 不会运行在后台。

原文链接：[Docker -- 概念类比的入门](https://hoblovski.github.io/2018/08/03/Docker-%E5%AE%9E%E7%94%A8%E7%B1%BB%E6%AF%94%E5%85%A5%E9%97%A8.html)