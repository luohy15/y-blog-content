# Drone CI 使用

Drone 是一个原生支持 Docker 的 CI 工具，和 Jenkins 比起来更加轻量，同时流水线和插件（YAML, Python, Go, Bash) 的开发和调试也比 Jenkins 的流水线语法及 Groovy 要舒服得多~~得多~~。

## 部署

### Server

1. 在代码托管平台创建 OAuth 应用，获取 ID 和 Secret
2. 使用 16 位随机字符串作为 RPC Secret
3. 给 Server 配置以上信息以及域名协议

### Runner

1. 配置 RPC Serect, 以及 Server 的域名协议
2. 配置 K8s 操作权限（如果使用 K8s Runner)

具体细节参考 [部署操作文档](https://docs.drone.io/server/overview/)

## 镜像使用及编写

一个典型的镜像是 [plugins/docker](plugins/docker): 支持 docker-in-docker 构建，然后上传至镜像仓库

```yaml
kind: pipeline
name: default

steps:
- name: docker
  image: plugins/docker
  settings:
    username: xxx
    password: yyy
    registry: example.com
    repo: example.com/foo/bar
    tags: latest
```

Drone 会把 settings 字段中的 key 大写并加上 `PLUGIN_` 前缀作为环境变量传递给容器，所以上面的流水线实际等效于：

```yaml
kind: pipeline
name: default

steps:
- name: docker
  image: plugins/docker
  environment:
    PLUGIN_USERNAME: xxx
    PLUGIN_PASSWORD: yyy
    PLUGIN_REGISTRY: example.com
    PLUGIN_REPO: example.com/foo/bar
    PLUGIN_TAGS: latest
```

我们使用 Go/Bash 接收这些环境变量并实现目标逻辑，调试完成后再集成到流水线中（比 Jenkins 的开发调试体验好很多）。

## 流水线集中管理及复用

如果同时维护多个项目的流水线，会发现维护成本过高，同时流水线间存在冗余，为了实践 DRY / KISS 思想可以考虑添加流水线集中管理及复用支持。

Drone 的 [Configuration Extension](https://docs.drone.io/extensions/conversion/) 支持：

1. 向指定服务发送 HTTP 请求，获取流水线定义 (YAML 字符串）
2. 请求成功（返回 200) 则解析运行
3. 请求失败（返回 204) 则使用默认的 .drone.yml

所以我 [实现](https://github.com/luohy15/drone-pipelines) 了一个简单的 HTTP 服务进行集中管理，同时支持模板替换以实现模块复用。

## 参考文档

jia.je 的实验记录：https://jia.je/devops/2020/04/21/k8s-drone-ci/

Drone 插件说明：https://docs.drone.io/plugins/overview/

Drone 流水线集中管理说明：https://zhuanlan.zhihu.com/p/77215200

示例仓库：https://github.com/spainer/drone-configuration-repository