# 我的命令行效率工具

## 3. solarized

严格来说，这是一个配色方案，不是一个命令行工具

那么问题来了，为什么它提升了效率呢？

因为它是如此普遍，所以现在我所有的开发交互页面都是 solarized dark 配色

再也不用花时间折腾配色了 (~~变相提升效率~~)

## 2. ohmyzsh

> 当仁不让的 alias 狂魔

装上 ohmyzsh , 配置若干插件

```bash
plugins=(git golang docker docker-compose kubectl)
```

然后你就可以愉快地使用

```bash
gst, gd, ggpush, gob, gor, k, kaf, kgp
```

这些奇奇怪怪的命令了

这是一些我感兴趣的 alias

```bash
gst
gcam
gco
gd
glgg
ggpull
ggpush
ggpush -f
```

## 1. atuin

把你用的所有终端的所有历史命令存在同一个 sqlite 数据库里，是不是很酷？

再也不用担心忘记 n 年前执行过的某个命令了
