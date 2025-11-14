# 部署指南

## 前置要求

1. Cloudflare 账户
2. 域名 antech.store 已配置到 Cloudflare
3. DeepSeek API 密钥

### 申请 DeepSeek API 密钥

1. **访问 DeepSeek 开放平台**
   - 官网：https://www.deepseek.com/
   - API 平台：https://platform.deepseek.com/
   - API 文档：https://platform.deepseek.com/api-docs/

2. **注册/登录账户**
   - 使用邮箱或手机号注册
   - 登录后进入控制台

3. **创建 API 密钥**
   - 在控制台的"API 管理"页面创建密钥
   - 密钥格式：`sk-xxx`（以 `sk-` 开头）
   - **重要**：密钥仅显示一次，请立即复制保存

4. **API 信息**
   - API 端点：`https://api.deepseek.com/v1/chat/completions`
   - 模型：`deepseek-chat`
   - 新用户通常有免费额度（如 50 万 Tokens）

## Worker 部署

### 1. 安装依赖

```bash
cd worker
npm install
```

### 2. 设置环境变量

**方式1：交互式设置（推荐）**
```bash
cd worker
wrangler secret put DEEPSEEK_API_KEY
# 按提示输入你的 DeepSeek API 密钥（格式：sk-xxx）
```

**方式2：使用环境变量（非交互式）**
```bash
# 先设置 Cloudflare API Token（如果未登录）
export CLOUDFLARE_API_TOKEN=your_cloudflare_api_token

# 然后设置 DeepSeek API 密钥
echo "sk-xxx" | wrangler secret put DEEPSEEK_API_KEY
```

**方式3：先登录 Cloudflare**
```bash
wrangler login
wrangler secret put DEEPSEEK_API_KEY
```

**验证密钥是否设置成功：**
```bash
wrangler secret list
```

### 3. 配置域名路由

编辑 `worker/wrangler.toml`，确保路由配置正确：

```toml
[env.production]
routes = [
  { pattern = "api.antech.store", zone_name = "antech.store" }
]
```

### 4. 部署

**重要：必须使用 --env production 参数，否则路由配置不会被应用！**

```bash
wrangler deploy --env production
```

或者使用 npm 脚本：
```bash
npm run deploy
```

## 环境变量配置

### Worker 环境变量

**DEEPSEEK_API_KEY** - DeepSeek API 密钥

通过 Wrangler Secrets 设置：
```bash
wrangler secret put DEEPSEEK_API_KEY
```

**DeepSeek API 相关信息：**
- 申请地址：https://platform.deepseek.com/
- API 文档：https://platform.deepseek.com/api-docs/
- API 端点：https://api.deepseek.com/v1/chat/completions
- 模型名称：deepseek-chat

## 验证部署

### 测试 Worker API

```bash
curl -X POST https://api.antech.store/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { sendMessage(input: { content: \"测试\" }) { id aiResponse } }"
  }'
```

## 故障排查

### Worker 部署失败

1. 检查 `wrangler.toml` 配置
2. 确认 API 密钥已设置：`wrangler secret list`
3. 查看日志：`wrangler tail`

### API 连接失败

1. 确认 Worker 已部署并运行
2. 检查 CORS 配置
3. 确认部署时使用了 `--env production` 参数
4. 检查 Cloudflare Dashboard 中的路由配置

