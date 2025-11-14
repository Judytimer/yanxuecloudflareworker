# GraphQL Playground 使用指南

## 问题：Syntax Error: Unexpected <EOF>

**原因**：查询编辑器为空或只有注释，没有有效的 GraphQL 查询。

## 解决步骤

### 步骤 1: 清空编辑器
1. 在 GraphQL Playground 左侧的查询编辑器中
2. 按 `Ctrl+A`（全选）
3. 按 `Delete`（删除所有内容）

### 步骤 2: 输入有效查询

**最简单的测试查询：**
```graphql
{
  __typename
}
```

**或者测试发送消息：**
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

### 步骤 3: 执行查询
- 点击右上角的 **▶️ 执行按钮**
- 或按 `Ctrl+Enter`（Windows/Linux）或 `Cmd+Enter`（Mac）

## 完整查询示例

### 示例 1: 基本查询（测试连接）
```graphql
{
  __typename
}
```

### 示例 2: 发送消息（推荐）
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

### 示例 3: 带会话ID
```graphql
mutation {
  sendMessage(input: { 
    content: "什么是人工智能？"
    sessionId: "test-123"
  }) {
    id
    aiResponse
  }
}
```

## 重要提示

1. ✅ **删除所有注释**：GraphQL Playground 中的注释（`#` 开头的行）需要删除
2. ✅ **确保查询完整**：查询必须以 `{` 开始，以 `}` 结束
3. ✅ **字符串用双引号**：所有字符串值必须用 `"` 包裹
4. ✅ **Mutation 必须声明**：发送消息需要使用 `mutation` 关键字

## 常见错误及解决

### 错误 1: Syntax Error: Unexpected <EOF>
- **原因**：查询为空或只有注释
- **解决**：输入一个有效的 GraphQL 查询

### 错误 2: Cannot query field "xxx"
- **原因**：字段名不存在
- **解决**：检查可用的字段（id, userMessage, aiResponse, timestamp, sessionId）

### 错误 3: Expected Name, found String
- **原因**：字符串值没有用引号包裹
- **解决**：确保所有字符串值都用双引号 `"` 包裹

## 快速复制粘贴

**最简单的查询（直接复制）：**
```
{
  __typename
}
```

**发送消息查询（直接复制）：**
```
mutation {
  sendMessage(input: { 
    content: "你好"
  }) {
    id
    aiResponse
  }
}
```

