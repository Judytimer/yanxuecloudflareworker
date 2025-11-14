# 修复 Variables 错误

## 当前错误

**错误信息**：`Variables are invalid JSON: InvalidSymbol.`

**原因**：在 "Variables" 标签页中输入了中文文本，这不是有效的 JSON 格式。

## 解决方案

### 步骤 1: 清空 Variables 标签页

1. 点击底部的 **"Variables"** 标签
2. 删除其中的所有内容（包括中文文本）
3. 留空即可（或者输入 `{}`）

### 步骤 2: 在查询编辑器中输入查询

1. 点击主查询编辑器（不是 Variables 标签）
2. 删除所有注释（按 `Ctrl+A` 然后 `Delete`）
3. 复制并粘贴以下查询：

**将你的问题放在查询的 content 字段中：**

```graphql
mutation {
  sendMessage(input: { 
    content: "请告诉我为什么我的孩子平时会比较拖拉?"
  }) {
    id
    userMessage
    aiResponse
    timestamp
  }
}
```

### 步骤 3: 执行查询

点击执行按钮（▶️）或按 `Ctrl+Enter`

## 重要说明

### Variables 标签页的作用

- **Variables** 标签页用于定义 GraphQL 变量（必须是有效的 JSON）
- **不是**用来输入你的问题内容
- 你的问题应该放在查询的 `content` 字段中

### 正确的使用方式

**查询编辑器（主区域）：**
```graphql
mutation {
  sendMessage(input: { 
    content: "你的问题在这里"
  }) {
    id
    aiResponse
  }
}
```

**Variables 标签页：**
- 留空，或者
- 输入 `{}`（空对象）

## 完整示例

### 示例 1: 你的问题（关于孩子拖拉）
```graphql
mutation {
  sendMessage(input: { 
    content: "请告诉我为什么我的孩子平时会比较拖拉?"
  }) {
    id
    userMessage
    aiResponse
    timestamp
  }
}
```

### 示例 2: 其他问题
```graphql
mutation {
  sendMessage(input: { 
    content: "如何帮助孩子提高学习效率？"
  }) {
    id
    aiResponse
  }
}
```

## 快速修复步骤

1. ✅ 清空 Variables 标签页（删除中文文本）
2. ✅ 在主查询编辑器中删除所有注释
3. ✅ 复制上面的查询并粘贴
4. ✅ 点击执行按钮


