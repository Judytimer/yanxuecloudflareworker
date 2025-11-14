# 如何找到 WAF Custom Rules

## 📍 正确的位置

你当前在：**Rules → Overview**（这是错误的）

需要去：**Security → WAF → Custom rules**

## 🗺️ 导航步骤

### 方法 1：通过左侧导航栏

1. **在左侧导航栏找到 "Security"**
   - 向下滚动左侧菜单
   - 找到 **Security** 部分（在 SSL/TLS 下面）

2. **点击 "Security"**
   - 展开 Security 菜单

3. **点击 "WAF"**
   - 在 Security 子菜单中

4. **点击 "Custom rules" 标签**
   - 在 WAF 页面顶部有多个标签页
   - 选择 **Custom rules** 标签

### 方法 2：直接访问 URL

如果知道你的 Account ID，可以直接访问：
```
https://dash.cloudflare.com/[你的account-id]/antech.store/security/waf
```

然后点击 **Custom rules** 标签。

## 📋 完整路径

```
Cloudflare Dashboard
  └─ antech.store (域名)
      └─ Security (左侧菜单)
          └─ WAF (子菜单)
              └─ Custom rules (标签页)
                  └─ Create rule (按钮)
```

## ⚠️ 区别说明

- **Rules Overview**（你当前的位置）：用于创建 Redirect Rules、Cache Rules 等
- **WAF Custom rules**（需要的位置）：用于创建安全规则，可以跳过 Bot Management

## 🎯 快速检查

如果找不到 Security → WAF：
1. 确认你的账户有 WAF 权限（Free 计划可能没有 WAF）
2. 尝试直接搜索 "WAF" 或 "Custom rules"
3. 检查账户计划是否支持 WAF

## 💡 替代方案（如果没有 WAF）

如果你的账户没有 WAF 功能，可以尝试：

1. **Security → Bots → Bot Management**
   - 关闭 Bot Management

2. **Security → Settings**
   - 将 Security Level 设置为 **Medium** 或 **Low**

3. **使用 Page Rules**（Free 计划可用）
   - Rules → Page Rules → Create rule
   - URL: `api.antech.store/*`
   - Setting: **Security Level** → **Essentially Off**

