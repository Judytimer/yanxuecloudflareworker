# Worker 测试链接和示例

## GraphQL 端点

### 1. Workers.dev 域名（推荐用于测试）
```
https://antech-worker-production.821973181.workers.dev/graphql
```

### 2. 自定义域名
```
https://api.antech.store/graphql
```

## 在线 GraphQL Playground 测试

### 方法 1: 使用 GraphQL Playground 在线工具

访问：https://lucasconstantino.github.io/graphiql-online/

在左侧输入框中输入以下内容：

**Endpoint URL:**
```
https://antech-worker-production.821973181.workers.dev/graphql
```

**测试查询示例:**

1. **基本查询测试**
```graphql
{
  __typename
}
```

2. **发送消息（中文）**
```graphql
mutation {
  sendMessage(input: { 
    content: "你好，请介绍一下你自己"
  }) {
    id
    userMessage
    aiResponse
    timestamp
    sessionId
  }
}
```

3. **发送消息（带会话ID）**
```graphql
mutation {
  sendMessage(input: { 
    content: "什么是人工智能？"
    sessionId: "my-session-123"
  }) {
    id
    userMessage
    aiResponse
    timestamp
    sessionId
  }
}
```

4. **发送消息（带历史记录）**
```graphql
mutation {
  sendMessage(input: { 
    content: "继续刚才的话题"
    sessionId: "my-session-123"
    history: [
      { role: "user", content: "什么是机器学习？" }
      { role: "assistant", content: "机器学习是人工智能的一个分支..." }
    ]
  }) {
    id
    userMessage
    aiResponse
    timestamp
    sessionId
  }
}
```

## 使用 curl 命令行测试

### 基本查询
```bash
curl -X POST https://antech-worker-production.821973181.workers.dev/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

### 发送消息
```bash
curl -X POST https://antech-worker-production.821973181.workers.dev/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { sendMessage(input: { content: \"你好\" }) { id aiResponse } }"
  }'
```

## 使用 Postman 或 Insomnia 测试

### 设置
- **Method**: POST
- **URL**: `https://antech-worker-production.821973181.workers.dev/graphql`
- **Headers**:
  - `Content-Type: application/json`

### Body (JSON)
```json
{
  "query": "mutation { sendMessage(input: { content: \"你好\" }) { id aiResponse } }"
}
```

## 使用浏览器直接测试（需要启用 CORS）

由于 Worker 已配置 CORS，你也可以使用浏览器的 Fetch API：

打开浏览器控制台（F12），输入：

```javascript
fetch('https://antech-worker-production.821973181.workers.dev/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
      mutation {
        sendMessage(input: { content: "你好" }) {
          id
          userMessage
          aiResponse
          timestamp
        }
      }
    `
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

## 快速测试链接

### GraphQL Playground 在线工具
- **GraphiQL Online**: https://lucasconstantino.github.io/graphiql-online/
- **Altair GraphQL Client**: https://altairgraphql.dev/ (需要安装浏览器扩展)

### 使用 Altair GraphQL Client（推荐）

1. 安装 Altair GraphQL Client 浏览器扩展
2. 打开 Altair
3. 设置 Endpoint: `https://antech-worker-production.821973181.workers.dev/graphql`
4. 在查询编辑器中输入上面的测试查询
5. 点击运行

## 测试用例集合

### 用例 1: 简单问候
```graphql
mutation {
  sendMessage(input: { content: "你好" }) {
    id
    aiResponse
  }
}
```

### 用例 2: 学习问题
```graphql
mutation {
  sendMessage(input: { 
    content: "如何学习编程？"
    sessionId: "learning-session"
  }) {
    id
    userMessage
    aiResponse
    sessionId
  }
}
```

### 用例 3: 数学问题
```graphql
mutation {
  sendMessage(input: { content: "2+2等于多少？" }) {
    id
    aiResponse
  }
}
```

### 用例 4: 英文对话
```graphql
mutation {
  sendMessage(input: { 
    content: "Hello, how are you?"
    sessionId: "english-session"
  }) {
    id
    aiResponse
  }
}
```

## 注意事项

1. **CORS**: Worker 已配置 CORS，支持跨域请求
2. **认证**: 当前无需认证，直接访问即可
3. **速率限制**: DeepSeek API 可能有速率限制
4. **超时**: 请求可能需要 2-5 秒（包含 AI API 调用时间）

## 错误处理

如果遇到错误，检查：
1. 网络连接
2. Endpoint URL 是否正确
3. 请求格式是否为有效的 JSON
4. GraphQL 查询语法是否正确

