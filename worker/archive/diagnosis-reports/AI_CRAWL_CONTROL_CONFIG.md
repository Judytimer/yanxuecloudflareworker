# AI Crawl Control 配置指南

## 🎯 当前页面说明

你正在查看 **AI Crawl Control** 页面，这个功能用于控制 AI 爬虫访问你的网站。

## ⚠️ 重要提示

**这个设置不应该影响你的 Worker API**，因为：
- Worker API (`api.antech.store/graphql`) 是程序化 API，不是网页
- AI Crawl Control 主要影响网页爬取，不是 API 调用

## 🔧 推荐配置

### 选项 1: 保持默认（推荐）

**对于 API 服务，建议保持默认设置**：
- 所有爬虫都设置为 **Allow**（允许）
- 这样可以确保：
  - 搜索引擎可以索引你的网站（如果有前端）
  - 不会意外拦截合法的 API 请求

### 选项 2: 如果需要阻止 AI 爬虫

如果你确实想阻止某些 AI 爬虫：

1. **只阻止特定的 AI 爬虫**：
   - 找到你想阻止的爬虫（如 `CCBot`, `Bytespider` 等）
   - 点击对应的 **Block** 按钮

2. **不要阻止搜索引擎爬虫**：
   - **Googlebot** - 保持 Allow
   - **BingBot** - 保持 Allow
   - **Applebot** - 保持 Allow

## 🔍 与 Worker 错误码 1042 的关系

**AI Crawl Control 不太可能是导致错误码 1042 的原因**，因为：
- 错误码 1042 是 Worker 初始化失败
- AI Crawl Control 只影响 HTTP 请求的路由，不影响 Worker 本身

## 📝 建议操作

1. **保持当前设置**（所有爬虫都 Allow）
2. **继续排查 Worker 问题**：
   - 检查 Workers Routes 配置
   - 查看 Worker 日志
   - 联系 Cloudflare 支持

## 🎯 如果确实需要配置

如果你有特殊需求要阻止某些 AI 爬虫：

1. **点击要阻止的爬虫的 "Block" 按钮**
2. **确认操作**
3. **等待几分钟让设置生效**

但记住：**这不会解决 Worker 错误码 1042 的问题**。

