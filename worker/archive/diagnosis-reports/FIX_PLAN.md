# Worker 问题修复计划

## ✅ 已验证

1. **本地测试成功**: Worker 代码本身正常，可以响应 GraphQL 查询
2. **代码类型检查**: 通过
3. **路由配置**: 正确（`api.antech.store/*`）

## ❌ 问题

**生产环境错误码 1042**: Worker 运行时错误

## 🔧 修复步骤

### 步骤 1: 配置环境变量

虽然简单查询（如 `{ __typename }`）不需要 API key，但：
1. TypeScript 类型定义要求 `DEEPSEEK_API_KEY: string`（非可选）
2. Mutation 操作需要 API key
3. 为了完整性，应该配置环境变量

**操作**:
```bash
cd worker
npx wrangler secret put DEEPSEEK_API_KEY --env production
```

**注意**: 需要输入你的 DeepSeek API 密钥（格式: `sk-xxx`）

### 步骤 2: 重新部署 Worker

```bash
cd worker
npm run deploy
```

### 步骤 3: 测试生产环境

```bash
# 测试 Worker 默认域名
curl -X POST https://antech-worker-production.821973181.workers.dev/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'

# 测试自定义域名
curl -X POST https://api.antech.store/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

## 📝 如果环境变量配置后仍失败

可能需要检查：
1. GraphQL Yoga 版本兼容性
2. Cloudflare Workers 运行时限制
3. 查看 Worker 日志获取详细错误信息

