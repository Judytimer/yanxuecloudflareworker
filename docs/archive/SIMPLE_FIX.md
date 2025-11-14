# 最简单的修复方法

## 🎯 问题
Cloudflare 的安全设置一直拦截 API 请求，很烦人。

## ✅ 最简单的解决方案（3步搞定）

### 方法 1：使用 Page Rules（最简单，Free 计划可用）

1. **在 Cloudflare Dashboard 中：**
   - 左侧菜单：**Rules** → **Page Rules**
   - 点击 **Create rule**

2. **配置规则：**
   ```
   URL: api.antech.store/*
   
   Settings:
   - Security Level: Essentially Off
   - Bot Fight Mode: Off
   ```
   
3. **保存**

### 方法 2：直接关闭所有 Bot 功能

1. **Security** → **Bots**
2. **关闭所有选项：**
   - Bot Fight Mode: **Off**
   - Bot Management: **Off**（如果有）
   - Super Bot Fight Mode: **Off**（如果有）
3. **保存**

### 方法 3：降低安全级别

1. **Security** → **Settings**
2. **Security Level**: 设置为 **Low**
3. **保存**

## 🚀 如果还是不行

可能需要检查：
1. DNS 记录是否正确（api 子域名）
2. Worker 路由是否正确绑定
3. 等待几分钟让设置生效

## 💡 或者换个思路

如果 Cloudflare 的安全设置太麻烦，可以考虑：
- 使用 Cloudflare Workers 的 `workers.dev` 子域名（不需要自定义域名）
- 或者使用其他 CDN/服务


