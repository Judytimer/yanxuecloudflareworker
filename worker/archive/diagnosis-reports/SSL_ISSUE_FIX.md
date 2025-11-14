# SSL/TLS 问题修复指南

## 🔍 问题诊断结果

### 测试发现
- ✅ DNS 解析正常（已解析到 Cloudflare IP: 198.18.0.195）
- ✅ TCP 连接成功
- ❌ SSL/TLS 握手失败

### 问题定位
DNS 和路由配置都是正确的，问题出在 **SSL/TLS 配置**。

## 🛠️ 修复步骤

### 步骤 1：检查 Cloudflare SSL/TLS 设置

1. **登录 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com
   - 选择域名：`antech.store`

2. **进入 SSL/TLS 设置**
   - 左侧菜单：**SSL/TLS**
   - 或直接访问：`https://dash.cloudflare.com/[account-id]/antech.store/ssl-tls`

3. **检查加密模式**
   - 找到 **"SSL/TLS encryption mode"** 设置
   - 确保设置为以下之一：
     - ✅ **Full**（推荐）
     - ✅ **Full (strict)**（如果源服务器有有效证书）
   - ❌ **不要使用** "Flexible" 或 "Off"

4. **保存设置**
   - 如果设置不正确，修改后保存
   - 等待 1-2 分钟让设置生效

### 步骤 2：验证 Worker 路由绑定

1. **进入 Workers 设置**
   - 左侧菜单：**Workers & Pages**
   - 选择：`antech-worker`

2. **检查路由**
   - 点击 **Routes** 标签页
   - 确认路由 `api.antech.store` 存在
   - 确认状态为 **Active**

3. **如果路由不存在**
   - 点击 **Add route**
   - 输入：`api.antech.store/*`
   - 选择 Worker：`antech-worker`
   - 保存

### 步骤 3：等待 SSL 证书生成

- Cloudflare 会自动为新的子域名生成 SSL 证书
- 通常需要 **2-5 分钟**
- 可以在 SSL/TLS → Edge Certificates 中查看证书状态

### 步骤 4：重新测试

等待 2-5 分钟后测试：

```bash
curl -X POST https://api.antech.store/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

或在浏览器中访问：`https://api.antech.store/graphql`

## 📋 检查清单

- [ ] DNS 记录已添加（Name: api, Proxy: Proxied）✅
- [ ] SSL/TLS 加密模式设置为 **Full** 或 **Full (strict)**
- [ ] Worker 路由已绑定（`api.antech.store`）
- [ ] 等待了 2-5 分钟让 SSL 证书生效

## ⚠️ 重要提示

**SSL/TLS 加密模式必须设置为 Full 或 Full (strict**，否则：
- Cloudflare 无法正确建立 SSL 连接
- Worker 路由可能无法正常工作
- 会出现 SSL_ERROR_SYSCALL 错误

## 🔗 相关设置位置

- SSL/TLS 设置：`https://dash.cloudflare.com/[account-id]/antech.store/ssl-tls`
- Worker 路由：`https://dash.cloudflare.com/[account-id]/workers/services/view/antech-worker/routes`

