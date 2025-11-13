# Antech Learning Assistant

AI学习辅导聊天助手 - 帮助厌学孩子重新发现学习的意义

## 项目结构

```
cloudflare/
├── worker/          # Cloudflare Workers 后端
│   ├── src/
│   │   ├── graphql/ # GraphQL Schema 和 Resolvers
│   │   ├── ai/      # DeepSeek API 集成
│   │   └── utils/   # 工具函数
│   └── wrangler.toml
│
└── frontend/        # React 前端应用
    ├── src/
    │   ├── components/  # React 组件
    │   ├── graphql/     # GraphQL 客户端
    │   └── types/       # TypeScript 类型
    └── vite.config.ts
```

## 快速开始

### 1. 申请 DeepSeek API 密钥

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册/登录账户
3. 在控制台创建 API 密钥（格式：`sk-xxx`）
4. 查看 [API 文档](https://platform.deepseek.com/api-docs/)

### 后端 (Worker)

```bash
cd worker
npm install
npx wrangler login  # 登录 Cloudflare（会打开浏览器授权）
npx wrangler secret put DEEPSEEK_API_KEY  # 设置API密钥（会提示输入密钥）
npm run dev
```

**注意**：
- 使用 `npx wrangler` 而不是直接使用 `wrangler` 命令
- 设置密钥前需要先登录 Cloudflare（`npx wrangler login`）
- 或设置 `CLOUDFLARE_API_TOKEN` 环境变量

### 前端

```bash
cd frontend
npm install
npm run dev
```

## 部署

### Worker 部署

```bash
cd worker
wrangler deploy
```

### Frontend 部署

使用 Cloudflare Pages 或 GitHub Actions 自动部署。

## 环境变量

### Worker

- `DEEPSEEK_API_KEY`: DeepSeek API 密钥
  - 申请地址：https://platform.deepseek.com/
  - API 文档：https://platform.deepseek.com/api-docs/
  - API 端点：https://api.deepseek.com/v1/chat/completions
  - 使用 `wrangler secret put DEEPSEEK_API_KEY` 设置密钥

### Frontend

- `VITE_API_URL`: GraphQL API 地址（默认: https://api.antech.store/graphql）

