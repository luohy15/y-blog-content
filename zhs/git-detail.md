# Git 细节

## 一些感兴趣的问题

1. init/clone/add/commit/push 的时候发生的事情
2. amend + push -f 真的把敏感历史记录删除了吗

## 核心概念

Git 是什么：Git 是一个**内容寻址文件系统**, 并在此基础上提供了一个**版本控制系统**的用户界面

Git 直接记录快照而非进行差异比较

![](https://git-scm.com/book/en/v2/images/snapshots.png)

如果文件没有修改，那么 Git 不会重新存储该文件，但是会重新存储该文件的指针

如果文件进行了修改，那么 Git 会重新存储新文件，但是会通过打包压缩整体大小（最新版本保存完整内容，历史版本仅保存差异）

## 目录说明

```bash
.git
├── COMMIT_EDITMSG
├── HEAD # 当前指向
├── config
├── description
├── hooks
├── index # 暂存区信息
├── info
├── logs
├── objects # 所有数据
├── packed-refs
└── refs # 存储引用文件
```

## 数据类型

top-down: ref, commit, tree, blob

{{< rawhtml >}}

<img src="https://git-scm.com/book/en/v2/images/data-model-4.png"  />{{< /rawhtml >}}

## 底层命令

### 存储文件

```bash
git hash-object -w 文件名
```

输出 40 个 16 进制数的校验和：前 2 个作为目录名，后 38 个作为文件名

实现细节：将待存储的数据 (content) 外加头部信息 (header) 一起做 SHA-1 digest 运算得到此校验和，然后使用 zlib 压缩文件后存储

### 查看文件

```bash
git cat-file -p 校验和
```

输出文件内容

```bash
git cat-file -t 校验和
```

输出数据的类型：blob, tree, commit

### 暂存区

```bash
git update-index --add --cacheinfo 100644 校验和 文件名
```

将文件加入暂存区

```bash
git write-tree
```

将暂存区内容写入树对象

### 提交

```bash
git commit-tree 树的校验和
```

得到一个 commit

### 引用

```bash
git update-ref 引用文件名 校验和
```

得到一个引用（分支/tag)

## 问题回答

Q: init/clone/add/commit/push 的时候发生的事情？

A: init 的时候，git 会创建 .git 目录，其中包含 HEAD 文件，objects 目录和 refs 目录等

​	clone 的时候（智能协议）, git 会调用服务端的 upload-pack 进程，然后使用 fetch-pack 程序获取数据

​	add 的时候，会把文件加入暂存区 (index 文件）

​	commit 的时候会把暂存区内容写入树对象并提交树对象，同时会更新 refs 及 HEAD

​	push 的时候（智能协议）, git 会调用服务端的 receive-pack 进程，获取数据使用 send-pack 程序进行对比，传输服务端没有的数据

Q: amend + push -f 真的把敏感记录删除了吗

A: 经测试，amend 后本地 objects 目录中还有数据，但 push -f 后远程重新拉取的话就没有这些 objects 了，可以认为是把敏感记录记录删除了？