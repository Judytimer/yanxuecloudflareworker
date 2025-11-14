# Worker 无法打开问题修复指南

## 已完成的修复

### 1. ✅ 更新 wrangler 版本
- 已从 3.114.15 更新到 4.48.0
- 使用最新版本可以避免已知的配置问题

### 2. ✅ 修复路由配置格式
- 路由配置已更新为：`api.antech.store/*`（添加了通配符）
- 这确保所有路径都能正确路由到 Worker

### 3. ✅ 验证代码格式
- 入口文件导出格式正确：`export default { async fetch(...) }`
- 类型检查通过
- 所有依赖项正确安装

### 4. ✅ 环境变量检查
- DEEPSEEK_API_KEY 已配置

## 可能的问题和解决方案

### 问题 1: 路由配置在 Cloudflare Dashboard 中未生效

**症状**: Worker 代码部署成功，但访问 `api.antech.store` 时无法连接

**解决方案**:
1. 登录 Cloudflare Dashboard
2. 进入 **Workers & Pages** → **antech-worker**
3. 点击 **Routes** 标签页
4. 检查是否有 `api.antech.store/*` 路由
5. 如果没有，手动添加路由：
   - Pattern: `api.antech.store/*`
   - Zone: `antech.store`
   - Worker: `antech-worker`

### 问题 2: DNS 配置问题

**症状**: 域名无法解析或解析到错误的 IP

**解决方案**:
1. 登录 Cloudflare Dashboard
2. 进入 **DNS** → **Records**
3. 检查是否有 `api` A 记录或 CNAME 记录
4. 如果没有，添加记录：
   - Type: `A` 或 `CNAME`
   - Name: `api`
   - Content: `192.0.2.1` (A 记录) 或 `antech.store` (CNAME)
   - Proxy status: **Proxied** (必须！)
   - TTL: Auto

### 问题 3: Worker 部署但未绑定到路由

**症状**: Worker 部署成功，但路由未生效

**解决方案**:
1. 确保使用 `--env production` 参数部署：
   ```bash
   cd worker
   npm run deploy
   # 或
   npx wrangler deploy --env production
   ```

2. 检查部署日志中是否显示路由信息

3. 如果路由仍未生效，在 Cloudflare Dashboard 中手动配置路由

### 问题 4: SSL/TLS 证书问题

**症状**: 访问时出现 SSL 错误

**解决方案**:
1. 在 Cloudflare Dashboard 中，进入 **SSL/TLS** 设置
2. 确保 SSL/TLS 加密模式设置为 **Full** 或 **Full (strict)**
3. 等待证书自动生成（通常需要几分钟）

## 验证步骤

### 1. 检查部署状态
```bash
cd worker
npx wrangler deployments list
```

### 2. 检查路由配置
```bash
npx wrangler deployments list --env production
```

### 3. 查看实时日志
```bash
npx wrangler tail --env production
```

### 4. 测试 API
```bash
curl -X POST https://api.antech.store/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { _empty }"}'
```

## 下一步操作

1. **重新部署 Worker**:
   ```bash
   cd worker
   npm run deploy
   ```

2. **检查 Cloudflare Dashboard**:
   - 确认 Worker 已部署
   - 确认路由已配置
   - 确认 DNS 记录正确

3. **测试访问**:
   - 使用 curl 或浏览器测试 API
   - 检查响应是否正确

4. **如果仍然无法访问**:
   - 检查 Cloudflare Dashboard 中的路由状态
   - 查看 Worker 日志
   - 确认 DNS 记录已正确配置
   - 确认域名已添加到 Cloudflare

## 常见错误

### 错误: "Route pattern must include a zone_name"
- **原因**: 路由配置格式不正确
- **解决**: 确保路由配置包含 `zone_name` 字段

### 错误: "Worker not found"
- **原因**: Worker 名称不匹配或未部署
- **解决**: 检查 `wrangler.toml` 中的名称，确保 Worker 已部署

### 错误: "DNS resolution failed"
- **原因**: DNS 记录未正确配置
- **解决**: 在 Cloudflare Dashboard 中检查并修复 DNS 记录

## 联系支持

如果以上步骤都无法解决问题，请：
1. 收集错误日志：`npx wrangler tail --env production`
2. 截图 Cloudflare Dashboard 中的路由配置
3. 联系 Cloudflare 支持或查看官方文档

