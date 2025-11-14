# Bot Management 检查指南

## 🔍 问题

即使 Security Level 是 Medium，Bot Fight Mode 已关闭，API 仍然被拦截。

## 🛠️ 需要检查的设置

### 1. Bot Management（最重要！）

**位置**：Security → Bots → Bot Management

检查项：
- **Bot Management** 可能仍然开启
- 即使 Bot Fight Mode 关闭，Bot Management 也可能拦截请求
- 需要检查 Bot Management 的设置

**操作**：
1. 进入 Security → Bots
2. 查看 **Bot Management** 状态
3. 如果开启了，可能需要：
   - 关闭 Bot Management（如果不需要）
   - 或者在 **WAF** 中添加规则允许 API 请求

### 2. WAF 自定义规则

**位置**：Security → WAF → Custom rules

检查是否有规则拦截 `api.antech.store` 或 `/graphql`：
- 查看所有自定义规则
- 检查规则条件是否匹配 API 请求
- 如果有拦截规则，需要添加例外或修改规则

### 3. Rate Limiting Rules

**位置**：Security → WAF → Rate limiting rules

检查是否有速率限制规则：
- 可能触发了速率限制
- 需要检查或调整规则

### 4. 创建 WAF 例外规则（推荐）

**位置**：Security → WAF → Custom rules → Create rule

创建一个规则允许 API 请求：

**规则配置**：
- **Rule name**: `Allow API requests`
- **When incoming requests match**:
  - Field: `Hostname`
  - Operator: `equals`
  - Value: `api.antech.store`
- **Then**:
  - Action: `Skip` (跳过所有安全检查)
  - 或 `Allow` (允许请求)

**或者更精确的规则**：
- Field: `URI Path`
- Operator: `starts with`
- Value: `/graphql`
- Action: `Skip`

### 5. 检查 Workers Routes

**位置**：Workers & Pages → antech-worker → Routes

确认：
- 路由 `api.antech.store` 已绑定
- 状态为 Active
- 没有冲突的路由（如 `api.antech.store/*`）

## 🎯 快速修复方案

### 方案 1：创建 WAF 例外规则（推荐）

1. Security → WAF → Custom rules → Create rule
2. 规则名称：`Allow API subdomain`
3. 条件：
   - Field: `Hostname`
   - Operator: `equals`
   - Value: `api.antech.store`
4. 操作：`Skip`（跳过所有安全检查）
5. 保存

### 方案 2：关闭 Bot Management

1. Security → Bots → Bot Management
2. 如果开启了，关闭它
3. 等待几分钟后测试

### 方案 3：检查 Rate Limiting

1. Security → WAF → Rate limiting rules
2. 检查是否有规则影响 API
3. 如果有，调整或删除规则

## 📝 验证步骤

创建规则后，等待 1-2 分钟，然后测试：

```bash
curl -X POST https://api.antech.store/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

应该返回 GraphQL 响应，而不是挑战页面。

## ⚠️ 重要提示

**Bot Management** 和 **Bot Fight Mode** 是不同的功能：
- Bot Fight Mode：基础的 Bot 检测
- Bot Management：更高级的 Bot 检测和管理

即使 Bot Fight Mode 关闭，Bot Management 可能仍然开启并拦截请求。


