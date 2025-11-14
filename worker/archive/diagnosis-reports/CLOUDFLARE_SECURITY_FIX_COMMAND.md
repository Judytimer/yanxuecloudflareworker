# Cloudflare 安全设置修复指南（命令行版本）

## 🔍 问题诊断

当前问题：API 请求被 Cloudflare 的安全挑战拦截（返回 403，显示 "Just a moment..." 页面）

**根本原因**：Cloudflare 的 Bot Management 或安全设置拦截了 API 请求

## ✅ Worker 部署状态

- ✅ Worker 已成功部署
- ✅ 路由配置正确：`api.antech.store/*`
- ✅ 代码和配置都正确

## 🛠️ 需要在 Cloudflare Dashboard 中修复的设置

由于安全设置需要通过 Dashboard 修改，请按以下步骤操作：

### 方法 1：创建 WAF 例外规则（推荐）

这是最直接的方法，可以绕过所有安全检查：

1. **登录 Cloudflare Dashboard**
   ```
   https://dash.cloudflare.com
   ```

2. **选择域名**
   - 点击 `antech.store`

3. **进入 WAF 设置**
   - 左侧菜单：**Security** → **WAF**
   - 点击 **Custom rules** 标签

4. **创建新规则**
   - 点击 **Create rule** 按钮
   - 配置如下：
     ```
     Rule name: Allow API subdomain
     
     When incoming requests match:
       Field: Hostname
       Operator: equals
       Value: api.antech.store
     
     Then:
       Action: Skip
       (这会跳过所有安全检查，包括 Bot Management)
     ```

5. **保存规则**
   - 点击 **Deploy** 按钮
   - 等待 1-2 分钟让规则生效

### 方法 2：关闭 Bot Management

如果方法 1 不可用，可以尝试关闭 Bot Management：

1. **进入 Bot 设置**
   - Security → **Bots**

2. **检查 Bot Management**
   - 查看 **Bot Management** 部分
   - 如果显示 "On" 或 "Enabled"，点击关闭

3. **检查 Super Bot Fight Mode**
   - 如果开启，也关闭它

4. **保存设置**

### 方法 3：调整 Security Level

如果上述方法都不行：

1. **进入 Security 设置**
   - Security → **Settings**

2. **调整 Security Level**
   - 找到 **Security Level**
   - 设置为 **Medium** 或 **Low**
   - 保存

## 📋 验证修复

修复后，等待 1-2 分钟，然后运行以下命令测试：

```bash
# 测试 GraphQL API
curl -X POST https://api.antech.store/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { _empty }"}'

# 应该返回 JSON 响应，而不是 HTML 挑战页面
```

**期望响应**：
```json
{
  "data": {
    "_empty": null
  }
}
```

**如果仍然返回挑战页面**：
- 等待更长时间（规则可能需要几分钟生效）
- 检查规则是否正确创建
- 尝试清除浏览器缓存或使用无痕模式

## 🔧 使用 Cloudflare API 自动修复（需要 API Token）

如果你有 Cloudflare API Token 且权限足够，可以使用以下脚本：

```bash
# 设置 API Token
export CLOUDFLARE_API_TOKEN="your_api_token"

# 运行修复脚本
cd worker
./fix-cloudflare-security.sh
```

**创建 API Token**：
1. 访问：https://dash.cloudflare.com/profile/api-tokens
2. 点击 **Create Token**
3. 使用 **Edit zone DNS** 模板
4. 添加额外权限：
   - Zone → Zone Settings → Edit
   - Zone → Security → Edit
5. 复制 Token 并保存

## 📝 当前 Worker 状态

```bash
# 检查部署状态
cd worker
npx wrangler deployments list --env production

# 查看实时日志
npx wrangler tail --env production

# 重新部署（如果需要）
npm run deploy
```

## ⚠️ 重要提示

1. **WAF 规则优先级**：Custom rules 的优先级高于默认安全设置
2. **规则生效时间**：规则创建后通常需要 1-2 分钟生效
3. **测试方法**：使用 curl 测试，避免浏览器缓存影响
4. **安全考虑**：如果关闭 Bot Management，确保有其他安全措施

## 🎯 快速检查清单

- [ ] Worker 已部署 ✅
- [ ] 路由配置正确 ✅
- [ ] 创建 WAF 例外规则（需要手动操作）
- [ ] 等待规则生效（1-2 分钟）
- [ ] 测试 API 访问
- [ ] 如果仍然失败，检查 Bot Management 设置

## 📞 如果仍然无法解决

1. 检查 Cloudflare Dashboard 中的 Analytics：
   - Security → Events
   - 查看是否有被拦截的请求

2. 查看 Worker 日志：
   ```bash
   npx wrangler tail --env production
   ```

3. 检查 DNS 设置：
   - 确保 `api` 子域名的 A 记录存在
   - 确保 Proxy 状态为 **Proxied**（橙色云朵）

4. 联系 Cloudflare 支持（如果以上方法都无效）

