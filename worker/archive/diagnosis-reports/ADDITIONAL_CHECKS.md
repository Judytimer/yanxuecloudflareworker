# 额外检查项

## 当前状态

- ✅ Security Level: Medium（已设置）
- ✅ Bot Fight Mode: 已关闭
- ❌ API 仍然被拦截（403 挑战页面）

## 需要检查的其他设置

### 1. WAF 规则

**位置**：Security → WAF → Custom rules

检查是否有自定义规则拦截了 API 请求：
- 检查规则条件是否匹配 `api.antech.store` 或 `/graphql`
- 如果有拦截规则，需要添加例外或修改规则

### 2. Firewall Rules

**位置**：Security → WAF → Firewall rules

检查是否有防火墙规则：
- 检查是否有规则拦截了 `api.antech.store`
- 可能需要创建允许规则

### 3. Rate Limiting Rules

**位置**：Security → WAF → Rate limiting rules

检查是否有速率限制规则：
- 可能触发了速率限制
- 需要检查或调整规则

### 4. Page Rules（如果使用）

**位置**：Rules → Page Rules

检查是否有页面规则影响 `api.antech.store`：
- 检查规则设置
- 确认没有冲突

### 5. Workers Routes 配置

**位置**：Workers & Pages → antech-worker → Routes

确认路由配置：
- 路由 `api.antech.store` 或 `api.antech.store/*` 已绑定
- 状态为 Active
- 没有冲突的路由

### 6. 子域名特定设置

**位置**：Security → Settings

检查是否有子域名特定的安全设置：
- `api.antech.store` 可能继承了主域名的安全设置
- 可能需要为子域名单独配置

## 建议操作

1. **检查 WAF 自定义规则**
   - 查看是否有规则拦截 API
   - 如果有，添加例外或修改规则

2. **创建 WAF 例外规则**
   - 为 `api.antech.store` 创建允许规则
   - 或为 `/graphql` 路径创建例外

3. **检查 Rate Limiting**
   - 确认没有速率限制规则拦截请求

4. **验证 Worker 路由**
   - 确认路由已正确绑定
   - 检查是否有多个路由冲突

## 快速测试

尝试添加 User-Agent 头：

```bash
curl -X POST https://api.antech.store/graphql \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0" \
  -d '{"query":"{ __typename }"}'
```

如果添加 User-Agent 后可以访问，说明是 Bot 检测的问题。


