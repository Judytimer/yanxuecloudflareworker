# 后端产品需求文档 (PRD)
## AI 学习辅导聊天助手 - 后端部分

**项目名称：** Antech Learning Assistant - Backend  
**域名：** antech.store  
**版本：** v1.0  
**日期：** 2024

---

## 1. 项目概述

### 1.1 后端架构
- **平台：** Cloudflare Workers
- **API 类型：** GraphQL API
- **AI 服务：** DeepSeek API
- **存储：** Cloudflare KV（可选，用于对话历史）

### 1.2 核心功能
- 接收前端聊天消息
- 调用 AI API 生成回复
- 情感分析和意图识别
- 对话上下文管理
- 错误处理和限流

### 1.3 技术栈
- **运行时：** Cloudflare Workers (Edge Runtime)
- **GraphQL：** graphql-helix 或 @graphql-yoga/cloudflare
- **HTTP 客户端：** fetch API
- **环境变量：** Cloudflare Workers Secrets

---

## 2. GraphQL Schema 设计

### 2.1 Schema 定义

```graphql
type Query {
  """
  健康检查接口
  """
  health: HealthResponse!
  
  """
  获取对话历史（可选功能）
  """
  conversationHistory(sessionId: String!): [Message!]!
}

type Mutation {
  """
  发送消息给AI
  """
  sendMessage(input: SendMessageInput!): MessageResponse!
}

"""
输入类型：发送消息
"""
input SendMessageInput {
  """
  用户消息内容
  """
  content: String!
  
  """
  会话ID（可选，用于多轮对话）
  """
  sessionId: String
  
  """
  对话历史（可选，前端传递）
  """
  history: [MessageInput!]
}

"""
消息输入类型
"""
input MessageInput {
  role: MessageRole!
  content: String!
}

"""
消息角色枚举
"""
enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}

"""
消息响应类型
"""
type MessageResponse {
  """
  消息ID
  """
  id: ID!
  
  """
  用户原始消息
  """
  userMessage: String!
  
  """
  AI回复内容
  """
  aiResponse: String!
  
  """
  时间戳（ISO 8601格式）
  """
  timestamp: String!
  
  """
  会话ID
  """
  sessionId: String
  
  """
  情感分析结果（可选）
  """
  emotion: EmotionAnalysis
}

"""
情感分析结果
"""
type EmotionAnalysis {
  """
  情绪类型：anxious, frustrated, confused, stressed, unmotivated, positive
  """
  type: String!
  
  """
  情绪强度：1-5
  """
  intensity: Int!
  
  """
  关键词列表
  """
  keywords: [String!]!
}

"""
消息类型
"""
type Message {
  id: ID!
  role: MessageRole!
  content: String!
  timestamp: String!
}

"""
健康检查响应
"""
type HealthResponse {
  status: String!
  timestamp: String!
  version: String!
}
```

### 2.2 Schema 特点
- **简洁：** 只包含必要的字段
- **类型安全：** 完整的类型定义
- **可扩展：** 预留扩展字段（emotion、sessionId等）

---

## 3. AI 集成设计

### 3.1 AI 服务选择

#### DeepSeek API
- **优势：** 成本低、中文支持好、API简单、响应速度快
- **模型：** deepseek-chat
- **API地址：** https://api.deepseek.com/v1/chat/completions
- **文档：** https://platform.deepseek.com/api-docs/

### 3.2 System Prompt 设计

#### 核心角色定位
```
你是一位专业、温和、理解的学习辅导AI助手。你的任务是帮助厌学或学习困难的孩子重新找到学习的动力和意义。

核心原则：
1. 理解与共情：首先理解孩子的情绪和困难，不要急于说教
2. 温和引导：用温和、鼓励的方式引导，避免批评和指责
3. 个性化建议：根据孩子的具体情况提供针对性的建议
4. 积极正面：始终保持积极正面的态度，传递希望和信心
```

#### 对话策略 Prompt
```
对话阶段指导：

阶段1 - 倾听理解（前2-3轮）：
- 多用提问了解具体情况："能告诉我具体是哪方面让你感到困难吗？"
- 表达理解："我理解你的感受，学习确实有时候会让人感到压力"
- 避免过早给建议

阶段2 - 共情鼓励（中间轮次）：
- 正常化情绪："有这种感觉是很正常的，很多同学都经历过"
- 给予鼓励："你已经很勇敢了，愿意说出来就是第一步"
- 发现积极点："我看到你其实对XX还是有兴趣的"

阶段3 - 引导建议（后续轮次）：
- 提供学习方法："我们可以试试..."
- 设定小目标："不如我们先从一个小目标开始？"
- 分享案例："有个同学也遇到过类似情况..."

阶段4 - 总结巩固（最后）：
- 总结对话要点
- 提供行动建议
- 鼓励继续对话
```

#### 完整 System Prompt 模板
```
你是一位专业的学习辅导AI助手，专门帮助厌学或学习困难的孩子。

你的特点：
- 温和、理解、有耐心
- 不会说教或批评
- 善于倾听和提问
- 提供实用的建议和方法

你的任务：
1. 理解孩子的情绪和困难
2. 用温和的方式引导和鼓励
3. 帮助孩子找到学习的内在动力
4. 提供个性化的学习建议

对话风格：
- 使用简单易懂的语言（适合8-18岁）
- 多用提问引导思考
- 避免长篇大论
- 保持积极正面的态度

请根据对话内容，自然地与孩子交流，帮助他们重新发现学习的意义。
```

### 3.3 API 调用逻辑

#### DeepSeek API 调用示例
```typescript
interface DeepSeekRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}
```

#### 请求构建逻辑
```typescript
// 1. 构建消息历史
const messages = [
  { role: 'system', content: SYSTEM_PROMPT },
  ...history.map(msg => ({
    role: msg.role.toLowerCase(),
    content: msg.content
  })),
  { role: 'user', content: userMessage }
];

// 2. 调用DeepSeek API
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages,
    temperature: 0.7,
    max_tokens: 1000,
    stream: false  // 非流式响应
  })
});

// 3. 处理响应
if (!response.ok) {
  throw new Error(`DeepSeek API错误: ${response.status}`);
}

const data: DeepSeekResponse = await response.json();
const aiContent = data.choices[0]?.message?.content || '抱歉，我暂时无法回复。';

return { content: aiContent };
```

---

## 4. 业务逻辑设计

### 4.1 消息处理流程

```
1. 接收GraphQL请求
   ↓
2. 验证输入（内容非空、长度限制）
   ↓
3. 情感分析（可选，分析用户消息）
   ↓
4. 构建对话历史
   ↓
5. 调用AI API
   ↓
6. 处理AI响应
   ↓
7. 生成MessageResponse
   ↓
8. 返回GraphQL响应
```

### 4.2 情感分析逻辑（简化版）

```typescript
interface EmotionKeywords {
  anxious: string[];
  frustrated: string[];
  confused: string[];
  stressed: string[];
  unmotivated: string[];
  positive: string[];
}

const emotionKeywords: EmotionKeywords = {
  anxious: ['紧张', '担心', '害怕', '焦虑', '不安'],
  frustrated: ['烦', '累', '讨厌', '不想', '厌倦'],
  confused: ['不知道', '迷茫', '困惑', '不明白', '为什么'],
  stressed: ['压力', '压力大', '累', '负担', '太多'],
  unmotivated: ['没动力', '没兴趣', '不想学', '没意思'],
  positive: ['想', '愿意', '试试', '感兴趣', '喜欢']
};

function analyzeEmotion(content: string): EmotionAnalysis {
  const lowerContent = content.toLowerCase();
  let detectedEmotions: { type: string; count: number }[] = [];
  
  // 检测情绪关键词
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    const count = keywords.filter(keyword => 
      lowerContent.includes(keyword)
    ).length;
    if (count > 0) {
      detectedEmotions.push({ type: emotion, count });
    }
  });
  
  // 确定主要情绪
  const primaryEmotion = detectedEmotions.length > 0
    ? detectedEmotions.sort((a, b) => b.count - a.count)[0]
    : { type: 'neutral', count: 0 };
  
  return {
    type: primaryEmotion.type,
    intensity: Math.min(primaryEmotion.count + 1, 5),
    keywords: emotionKeywords[primaryEmotion.type as keyof EmotionKeywords] || []
  };
}
```

### 4.3 对话上下文管理

#### 上下文存储策略
```typescript
// 方案1：前端传递（推荐，简单）
// 前端在每次请求时传递完整的对话历史

// 方案2：KV存储（可选，用于持久化）
interface Conversation {
  sessionId: string;
  messages: Message[];
  createdAt: string;
  lastUpdated: string;
}

// 存储到KV
await env.CONVERSATIONS.put(
  sessionId,
  JSON.stringify(conversation),
  { expirationTtl: 86400 * 7 } // 7天过期
);
```

#### 历史消息构建
```typescript
function buildMessageHistory(
  userMessage: string,
  history?: MessageInput[]
): Array<{ role: string; content: string }> {
  const messages: Array<{ role: string; content: string }> = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];
  
  // 添加历史消息（最多保留最近10轮）
  if (history && history.length > 0) {
    const recentHistory = history.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.role.toLowerCase(),
        content: msg.content
      });
    });
  }
  
  // 添加当前用户消息
  messages.push({ role: 'user', content: userMessage });
  
  return messages;
}
```

### 4.4 错误处理

#### 错误类型定义
```typescript
enum ErrorType {
  INVALID_INPUT = 'INVALID_INPUT',
  AI_API_ERROR = 'AI_API_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

class AppError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
  }
}
```

#### 错误处理逻辑
```typescript
// DeepSeek API错误处理
import { callDeepSeekAPI } from '../ai/deepseek';

try {
  const aiResponse = await callDeepSeekAPI(messages, env.DEEPSEEK_API_KEY);
  return aiResponse;
} catch (error: any) {
  if (error.status === 429) {
    throw new AppError(
      ErrorType.RATE_LIMIT,
      '请求过于频繁，请稍后再试',
      429
    );
  } else if (error.status === 401) {
    throw new AppError(
      ErrorType.AI_API_ERROR,
      'DeepSeek API密钥配置错误',
      500
    );
  } else {
    throw new AppError(
      ErrorType.AI_API_ERROR,
      'DeepSeek服务暂时不可用，请稍后再试',
      503
    );
  }
}
```

### 4.5 限流策略

#### 基于IP的限流
```typescript
// 使用Cloudflare Workers的Rate Limiting
// 或自定义实现

interface RateLimit {
  count: number;
  resetAt: number;
}

async function checkRateLimit(
  ip: string,
  env: Env
): Promise<boolean> {
  const key = `rate_limit:${ip}`;
  const limit = await env.RATE_LIMIT.get(key);
  
  if (!limit) {
    await env.RATE_LIMIT.put(
      key,
      JSON.stringify({ count: 1, resetAt: Date.now() + 60000 }),
      { expirationTtl: 60 }
    );
    return true;
  }
  
  const data: RateLimit = JSON.parse(limit);
  
  if (Date.now() > data.resetAt) {
    // 重置
    await env.RATE_LIMIT.put(
      key,
      JSON.stringify({ count: 1, resetAt: Date.now() + 60000 }),
      { expirationTtl: 60 }
    );
    return true;
  }
  
  if (data.count >= 10) { // 每分钟10次
    return false;
  }
  
  data.count++;
  await env.RATE_LIMIT.put(key, JSON.stringify(data), { expirationTtl: 60 });
  return true;
}
```

---

## 5. Workers 代码结构

### 5.1 项目结构

```
worker/
├── src/
│   ├── index.ts              # Worker入口文件
│   ├── graphql/
│   │   ├── schema.ts         # GraphQL Schema定义
│   │   ├── resolvers.ts      # GraphQL Resolvers
│   │   └── types.ts          # TypeScript类型定义
│   ├── ai/
│   │   ├── deepseek.ts       # DeepSeek API集成
│   │   └── prompt.ts         # System Prompt定义
│   ├── utils/
│   │   ├── emotion.ts        # 情感分析工具
│   │   ├── validation.ts    # 输入验证
│   │   └── errors.ts        # 错误处理
│   └── types/
│       └── env.ts           # 环境变量类型
├── wrangler.toml             # Workers配置
├── package.json
└── tsconfig.json
```

### 5.2 Worker 入口文件

```typescript
// src/index.ts
import { createYoga } from 'graphql-yoga';
import { schema } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // CORS处理
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // 创建GraphQL Yoga实例
    const yoga = createYoga({
      schema,
      resolvers,
      context: { env, request },
    });

    // 处理GraphQL请求
    return yoga.fetch(request);
  },
};
```

### 5.3 DeepSeek API 实现示例

```typescript
// src/ai/deepseek.ts
interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export async function callDeepSeekAPI(
  messages: DeepSeekMessage[],
  apiKey: string
): Promise<{ content: string }> {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: false
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API错误 (${response.status}): ${error}`);
  }

  const data: DeepSeekResponse = await response.json();
  const content = data.choices[0]?.message?.content || '抱歉，我暂时无法回复。';
  
  return { content };
}
```

### 5.4 GraphQL Resolvers

```typescript
// src/graphql/resolvers.ts
import { callDeepSeekAPI } from '../ai/deepseek';
import { analyzeEmotion } from '../utils/emotion';
import { validateInput } from '../utils/validation';
import { buildMessageHistory } from '../utils/conversation';

export const resolvers = {
  Query: {
    health: () => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    }),
    
    conversationHistory: async (_: any, { sessionId }: { sessionId: string }, { env }: any) => {
      // 从KV获取对话历史
      const data = await env.CONVERSATIONS.get(sessionId);
      return data ? JSON.parse(data).messages : [];
    },
  },
  
  Mutation: {
    sendMessage: async (
      _: any,
      { input }: { input: SendMessageInput },
      { env }: any
    ) => {
      // 1. 验证输入
      validateInput(input.content);
      
      // 2. 情感分析
      const emotion = analyzeEmotion(input.content);
      
      // 3. 构建消息历史
      const messages = buildMessageHistory(input.content, input.history);
      
      // 4. 调用AI API
      const aiResponse = await callDeepSeekAPI(messages, env.DEEPSEEK_API_KEY);
      
      // 5. 生成响应
      const response: MessageResponse = {
        id: crypto.randomUUID(),
        userMessage: input.content,
        aiResponse: aiResponse.content,
        timestamp: new Date().toISOString(),
        sessionId: input.sessionId || crypto.randomUUID(),
        emotion,
      };
      
      // 6. 保存到KV（可选）
      if (input.sessionId) {
        // 更新对话历史
      }
      
      return response;
    },
  },
};
```

---

## 6. 环境变量配置

### 6.1 必需的环境变量

```bash
# AI API密钥（DeepSeek）
DEEPSEEK_API_KEY=sk-xxx

# KV命名空间（可选）
CONVERSATIONS=conversations_namespace
RATE_LIMIT=rate_limit_namespace
```

### 6.2 wrangler.toml 配置

```toml
name = "antech-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.production]
routes = [
  { pattern = "api.antech.store", zone_name = "antech.store" }
]

[[kv_namespaces]]
binding = "CONVERSATIONS"
id = "xxx"
preview_id = "xxx"

[[kv_namespaces]]
binding = "RATE_LIMIT"
id = "xxx"
preview_id = "xxx"

[env.production.vars]
ENVIRONMENT = "production"
```

### 6.3 设置 Secrets

```bash
# 使用Wrangler CLI设置DeepSeek API密钥
wrangler secret put DEEPSEEK_API_KEY
# 按提示输入你的DeepSeek API密钥（格式：sk-xxx）
```

---

## 7. API 接口规范

### 7.1 GraphQL Endpoint

```
POST /graphql
Content-Type: application/json

{
  "query": "mutation { sendMessage(input: { content: \"...\" }) { ... } }"
}
```

### 7.2 CORS 配置

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

### 7.3 响应格式

#### 成功响应
```json
{
  "data": {
    "sendMessage": {
      "id": "uuid",
      "userMessage": "用户消息",
      "aiResponse": "AI回复",
      "timestamp": "2024-01-01T00:00:00Z",
      "sessionId": "session-id",
      "emotion": {
        "type": "frustrated",
        "intensity": 3,
        "keywords": ["烦", "累"]
      }
    }
  }
}
```

#### 错误响应
```json
{
  "errors": [
    {
      "message": "消息内容不能为空",
      "extensions": {
        "code": "INVALID_INPUT"
      }
    }
  ]
}
```

---

## 8. 安全设计

### 8.1 输入验证

```typescript
function validateInput(content: string): void {
  // 长度限制
  if (!content || content.trim().length === 0) {
    throw new AppError(ErrorType.INVALID_INPUT, '消息内容不能为空', 400);
  }
  
  if (content.length > 500) {
    throw new AppError(ErrorType.INVALID_INPUT, '消息内容过长（最多500字）', 400);
  }
  
  // 敏感词过滤（可选）
  // ...
}
```

### 8.2 API密钥安全
- 使用 Cloudflare Workers Secrets 存储
- 不在代码中硬编码
- 定期轮换密钥

### 8.3 限流保护
- IP级别限流：每分钟10次请求
- 防止滥用和DDoS攻击

### 8.4 数据隐私
- 不存储个人身份信息
- 对话数据加密存储（KV）
- 支持数据删除（可选）

---

## 9. 开发里程碑（60分钟快速开发）

> **说明：** 借助 Cursor AI 等工具，开发时间大幅缩短。

### Phase 1: 项目初始化（10分钟）
- [ ] Workers项目初始化（Wrangler + TypeScript）- 3分钟
- [ ] GraphQL Schema定义 - 3分钟
- [ ] 基础项目结构搭建 - 2分钟
- [ ] wrangler.toml配置 - 2分钟

### Phase 2: GraphQL实现（15分钟）
- [ ] GraphQL Yoga集成 - 5分钟
- [ ] Schema和类型定义 - 5分钟
- [ ] Resolvers基础实现 - 5分钟

### Phase 3: AI集成（20分钟）
- [ ] DeepSeek API客户端实现 - 8分钟
- [ ] System Prompt设计 - 5分钟
- [ ] 消息历史构建逻辑 - 4分钟
- [ ] 错误处理 - 3分钟

### Phase 4: 业务逻辑完善（10分钟）
- [ ] 情感分析功能 - 4分钟
- [ ] 输入验证 - 2分钟
- [ ] 限流逻辑 - 2分钟
- [ ] CORS配置 - 2分钟

### Phase 5: 部署与测试（5分钟）
- [ ] 环境变量配置 - 2分钟
- [ ] Workers部署 - 2分钟
- [ ] API测试 - 1分钟

**总计：60分钟**

**开发策略：**
- 使用 Cursor AI 生成基础代码结构
- 优先实现核心功能（sendMessage）
- 简化非核心功能（情感分析、KV存储）
- 快速迭代和测试

---

## 10. 测试方案

### 10.1 单元测试（可选）

```typescript
// 测试情感分析
test('analyzeEmotion - frustrated', () => {
  const result = analyzeEmotion('我最近很烦，不想学习');
  expect(result.type).toBe('frustrated');
  expect(result.intensity).toBeGreaterThan(0);
});
```

### 10.2 集成测试

```bash
# 使用curl测试GraphQL API
curl -X POST https://api.antech.store/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { sendMessage(input: { content: \"我最近不想学习\" }) { aiResponse } }"
  }'
```

### 10.3 性能测试
- 响应时间：< 3秒（包含AI API调用）
- 并发处理：支持至少100并发请求
- 错误率：< 1%

---

## 11. 监控与日志

### 11.1 日志记录

```typescript
// 记录关键操作
console.log('[SendMessage]', {
  sessionId: input.sessionId,
  messageLength: input.content.length,
  timestamp: new Date().toISOString(),
});
```

### 11.2 错误监控
- 使用 Cloudflare Workers Analytics
- 记录AI API错误
- 记录限流触发

### 11.3 性能监控
- 响应时间统计
- API调用次数
- 错误率统计

---

## 12. 后续优化方向

### 12.1 功能增强
- [ ] 对话历史持久化（KV存储）
- [ ] 多轮对话上下文优化
- [ ] 更精准的情感分析（使用AI模型）
- [ ] 用户反馈收集

### 12.2 性能优化
- [ ] 响应缓存（相同问题缓存）
- [ ] 流式响应（Streaming）
- [ ] 批量处理优化

### 12.3 安全增强
- [ ] JWT认证（可选）
- [ ] 更严格的限流策略
- [ ] 敏感内容检测

---

## 附录

### A. GraphQL完整Schema

见第2节 Schema定义

### B. API调用示例

```typescript
// 前端调用示例
const response = await fetch('https://api.antech.store/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `
      mutation SendMessage($input: SendMessageInput!) {
        sendMessage(input: $input) {
          id
          userMessage
          aiResponse
          timestamp
          emotion {
            type
            intensity
          }
        }
      }
    `,
    variables: {
      input: {
        content: '我最近不想学习',
        sessionId: 'session-123'
      }
    }
  })
});
```

### C. 环境变量设置指南

```bash
# 1. 安装Wrangler CLI
npm install -g wrangler

# 2. 登录Cloudflare
wrangler login

# 3. 设置Secrets
wrangler secret put DEEPSEEK_API_KEY
# 输入你的API密钥

# 4. 部署
wrangler deploy
```

---

**文档版本：** v1.0  
**最后更新：** 2024  
**维护者：** 开发团队

