# Cloudflare 安全设置修复指南

## ✅ 好消息

DNS、SSL/TLS 和 Worker 路由都配置正确了！

## ❌ 当前问题

API 请求被 Cloudflare 的安全挑战拦截（返回 403，显示 "Just a moment..." 页面）

## 🛠️ 修复步骤

### 步骤 1：调整 Security Level

1. **进入 Security 设置**
   - Cloudflare Dashboard → `antech.store` → **Security**
   - 或直接访问：`https://dash.cloudflare.com/[account-id]/antech.store/security`

2. **调整 Security Level**
   - 找到 **"Security Level"** 设置
   - 当前可能是 "High" 或 "I'm Under Attack!"
   - 建议设置为：
     - ✅ **Medium**（推荐）
     - ✅ **Low**（如果 Medium 仍然拦截）

3. **保存设置**

### 步骤 2：检查 Bot Fight Mode

1. **进入 Bot Fight Mode 设置**
   - Security → **Bots**
   - 或访问：`https://dash.cloudflare.com/[account-id]/antech.store/security/bots`

2. **检查 Bot Fight Mode**
   - 如果开启了 **"Bot Fight Mode"**，可能会拦截 API 请求
   - 选项：
     - 关闭 Bot Fight Mode（如果不需要）
     - 或者在 **WAF** 中添加规则允许 API 路径

### 步骤 3：配置 WAF 规则（推荐）

1. **进入 WAF 设置**
   - Security → **WAF**
   - 或访问：`https://dash.cloudflare.com/[account-id]/antech.store/security/waf`

2. **创建自定义规则**
   - 点击 **"Create rule"**
   - 规则名称：`Allow API requests`
   - 条件：
     - Field: `URI Path`
     - Operator: `starts with`
     - Value: `/graphql`
   - Action: `Skip` 或 `Allow`
   - 保存规则

### 步骤 4：检查 Firewall Rules

1. **进入 Firewall Rules**
   - Security → **WAF** → **Firewall rules**
   - 检查是否有规则拦截了 `api.antech.store` 的请求

2. **如果需要，创建允许规则**
   - 条件：`Hostname equals api.antech.store`
   - 操作：`Allow`

## 📋 推荐配置

### Security Level
- **Medium**（平衡安全性和可用性）

### Bot Fight Mode
- 如果 API 需要被程序调用，建议关闭或添加例外

### WAF 规则
- 为 `/graphql` 路径添加允许规则
- 或为 `api.antech.store` 子域名添加例外

## 🎯 快速修复

**最快的方法**：

1. Security → Security Level → 设置为 **Medium**
2. Security → Bots → 关闭 **Bot Fight Mode**（如果开启了）
3. 等待 1-2 分钟
4. 重新测试 API

## ✅ 验证

修复后测试：

```bash
curl -X POST https://api.antech.store/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

应该返回 GraphQL 响应，而不是挑战页面。

## 📝 注意事项

- Security Level 设置会影响所有子域名
- 如果设置为 "Low"，安全性会降低
- 建议使用 WAF 规则来精确控制，而不是降低整体安全级别

