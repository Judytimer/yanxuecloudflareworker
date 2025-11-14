# GraphQL 查询示例

## 在 GraphQL Playground 中使用

访问：`https://antech-worker-production.821973181.workers.dev/graphql`

## 1. 基本查询测试

删除所有注释，输入以下查询：

```graphql
{
  __typename
}
```

点击执行按钮（或按 Ctrl+Enter）

## 2. 发送消息 Mutation

```graphql
mutation {
  sendMessage(input: { 
    content: "你好"
  }) {
    id
    userMessage
    aiResponse
    timestamp
    sessionId
  }
}
```

## 3. 带会话ID的消息

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

## 4. 带历史记录的消息

```graphql
mutation {
  sendMessage(input: { 
    content: "继续刚才的话题"
    sessionId: "my-session-123"
    history: [
      { role: "user", content: "什么是机器学习？" }
      { role: "assistant", content: "机器学习是人工智能的一个分支" }
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

## 5. 只获取部分字段

```graphql
mutation {
  sendMessage(input: { 
    content: "你好"
  }) {
    id
    aiResponse
  }
}
```

## 注意事项

1. **删除所有注释**：GraphQL Playground 中的注释（以 `#` 开头的行）需要删除
2. **使用正确的语法**：确保查询以大括号 `{` 开始和结束
3. **字符串使用双引号**：所有字符串值必须用双引号 `"` 包裹
4. **字段选择**：必须明确指定要返回的字段

## 常见错误

### 错误 1: Syntax Error: Unexpected <EOF>
**原因**：查询为空或只有注释
**解决**：输入一个有效的 GraphQL 查询

### 错误 2: Cannot query field "xxx"
**原因**：字段名不存在
**解决**：检查 schema 中可用的字段

### 错误 3: Expected Name, found String
**原因**：字符串值没有用引号包裹
**解决**：确保所有字符串值都用双引号包裹

