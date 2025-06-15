# 使用 Cloudflare AI Gateway 修复 Cline 的 OpenRouter 403 Provider Error 报错

> 注意：本文主要使用 Cline（AI 编码助手）+ OpenRouter 与 Claude 3.5 Sonnet 生成。
>
> 相关 GitHub issue：[OpenRouter 403 Provider Error](https://github.com/cline/cline/issues/1336)

## 问题
Cline 用户在通过 OpenRouter 发出请求时遇到 403 Provider Error 报错。

## 快速修复
使用 Cloudflare AI Gateway 来代理发到 OpenRouter 的请求：

1. 注册 Cloudflare 账户
2. 进入 AI Gateway 部分
3. 更新 OpenRouter 基础 URL：

修改前：
![](https://cdn.luohy15.com/cline-openrouter-fix-0.png)

修改后：（选项 1 - 推荐方式，支持提示缓存）：
![](https://cdn.luohy15.com/cline-openrouter-fix-2.png)
* 需要包含 PR [#1397](https://github.com/cline/cline/pull/1397) 的 Cline 版本（尚未合并）

修改后：（选项 2 - 推荐方式，支持提示缓存）：
![](https://cdn.luohy15.com/cline-openrouter-fix-3.png)
* 需要包含 PR [#2040](https://github.com/cline/cline/pull/2040) 的 Cline 版本（尚未合并）

修改后：（选项 3 - 临时使用，无提示缓存，费用昂贵）：
![](https://cdn.luohy15.com/cline-openrouter-fix-1.png)

```javascript
const baseURL = "https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openrouter";
```

详细设置说明：https://developers.cloudflare.com/ai-gateway/providers/openrouter/
