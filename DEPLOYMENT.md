# 部署指南

## 前置要求

1. Cloudflare 账户
2. 域名 antech.store 已配置到 Cloudflare
3. DeepSeek API 密钥

## 后端部署 (Worker)

### 1. 安装依赖

```bash
cd worker
npm install
```

### 2. 设置环境变量

```bash
wrangler secret put DEEPSEEK_API_KEY
# 输入你的 DeepSeek API 密钥（格式：sk-xxx）
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

```bash
wrangler deploy
```

## 前端部署 (Pages)

### 方式1: 使用 Cloudflare Pages Dashboard

1. 登录 Cloudflare Dashboard
2. 进入 Pages
3. 创建新项目，连接 GitHub 仓库
4. 设置构建配置：
   - 构建命令：`cd frontend && npm run build`
   - 输出目录：`frontend/dist`
   - 根目录：`frontend`

### 方式2: 使用 Wrangler CLI

```bash
cd frontend
npm install
npm run build
wrangler pages deploy dist --project-name=antech-frontend
```

### 方式3: 使用 GitHub Actions (自动部署)

1. 在 GitHub Secrets 中设置：
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API Token
   - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID

2. 推送代码到 main 分支，GitHub Actions 会自动部署

## 环境变量配置

### Worker 环境变量

通过 Wrangler Secrets 设置：
```bash
wrangler secret put DEEPSEEK_API_KEY
```

### Frontend 环境变量

在 Cloudflare Pages 设置中添加环境变量：
- `VITE_API_URL`: `https://api.antech.store/graphql`

或在 `frontend/.env` 文件中设置（仅开发环境）：
```
VITE_API_URL=https://api.antech.store/graphql
```

## 验证部署

### 测试 Worker API

```bash
curl -X POST https://api.antech.store/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { sendMessage(input: { content: \"测试\" }) { id aiResponse } }"
  }'
```

### 测试前端

访问 https://antech.store，点击"开始对话"按钮，测试聊天功能。

## 故障排查

### Worker 部署失败

1. 检查 `wrangler.toml` 配置
2. 确认 API 密钥已设置：`wrangler secret list`
3. 查看日志：`wrangler tail`

### Pages 部署失败

1. 检查构建日志
2. 确认构建命令和输出目录正确
3. 检查环境变量配置

### API 连接失败

1. 确认 Worker 已部署并运行
2. 检查 CORS 配置
3. 确认前端环境变量 `VITE_API_URL` 正确

