# Antech Learning Assistant - Worker

AI学习辅导聊天助手后端 - Cloudflare Workers 实现

## 项目结构

```
worker/
├── src/
│   ├── graphql/     # GraphQL Schema 和 Resolvers
│   ├── ai/          # DeepSeek API 集成
│   └── utils/       # 工具函数
└── wrangler.toml
```

## 快速开始

### 1. 申请 DeepSeek API 密钥

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册/登录账户
3. 在控制台创建 API 密钥（格式：`sk-xxx`）
4. 查看 [API 文档](https://platform.deepseek.com/api-docs/)

### 2. 安装依赖

```bash
cd worker
npm install
```

### 3. 配置 Cloudflare

```bash
npx wrangler login  # 登录 Cloudflare（会打开浏览器授权）
npx wrangler secret put DEEPSEEK_API_KEY  # 设置API密钥（会提示输入密钥）
```

**注意**：
- 使用 `npx wrangler` 而不是直接使用 `wrangler` 命令
- 设置密钥前需要先登录 Cloudflare（`npx wrangler login`）
- 或设置 `CLOUDFLARE_API_TOKEN` 环境变量

### 4. 本地开发

```bash
npm run dev
```

## 测试

在部署 Worker 之前，建议先运行测试确保代码正常工作：

```bash
cd worker
npm test              # 运行测试（watch 模式）
npm run test:run      # 运行测试一次（CI/CD 使用）
npm run test:ui       # 打开测试 UI 界面
```

**测试覆盖范围**：
- ✅ Worker 入口（CORS、GraphQL 请求处理）
- ✅ 输入验证（空消息、长度限制）
- ✅ 消息历史构建
- ✅ GraphQL Resolvers（成功场景、错误处理）

**测试前准备**：
- 测试使用模拟的 DeepSeek API，无需真实的 API 密钥
- 所有测试都在本地运行，不会调用外部 API

**部署前检查清单**：
1. ✅ 运行 `npm run test:run` 确保所有测试通过
2. ✅ 运行 `npm run type-check` 确保没有类型错误
3. ✅ 运行 `npm run dev` 本地测试功能

## 部署

**⚠️ 重要：部署前请先运行测试！**

```bash
cd worker
npm run test:run      # 运行测试确保代码正常
npm run type-check    # 检查类型错误
npm run deploy        # 部署到 Cloudflare（使用生产环境）
```

或者使用 wrangler 直接部署：

```bash
cd worker
npx wrangler deploy --env production
```

**重要提示**：
- 必须使用 `--env production` 参数，否则路由配置不会被应用
- 部署后路由 `api.antech.store` 会自动绑定

## 环境变量

### Worker

- `DEEPSEEK_API_KEY`: DeepSeek API 密钥
  - 申请地址：https://platform.deepseek.com/
  - API 文档：https://platform.deepseek.com/api-docs/
  - API 端点：https://api.deepseek.com/v1/chat/completions
  - 使用 `wrangler secret put DEEPSEEK_API_KEY` 设置密钥

## API 端点

部署成功后，GraphQL API 可通过以下地址访问：

```
https://api.antech.store/graphql
```

## 相关文档

- [部署指南](DEPLOYMENT.md) - 详细的部署说明
- [实施总结](IMPLEMENTATION_SUMMARY.md) - 项目实现细节

