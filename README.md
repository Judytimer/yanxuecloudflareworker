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

### 后端 (Worker)

```bash
cd worker
npm install
wrangler secret put DEEPSEEK_API_KEY  # 设置API密钥
npm run dev
```

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

### Frontend

- `VITE_API_URL`: GraphQL API 地址（默认: https://api.antech.store/graphql）

