---
sidebar_position: 1
title: 7 大核心组件详解
---

# LangChain.js 7 大核心组件详解

> 基于 LangChain.js v1.2.x 官方文档

## 目录

1. [Agents 代理](#1-agents-代理)
2. [Models 模型](#2-models-模型)
3. [Messages 消息](#3-messages-消息)
4. [Tools 工具](#4-tools-工具)
5. [Short-term Memory 短期记忆](#5-short-term-memory-短期记忆)
6. [Streaming 流式输出](#6-streaming-流式输出)
7. [Structured Output 结构化输出](#7-structured-output-结构化输出)

---

## 1. Agents 代理

Agent 是 LangChain 的核心，它能够循环调用工具来完成目标。

### 核心 API

```typescript
import { createAgent } from "langchain";

const agent = createAgent({
  model: "gpt-4o",              // 模型
  tools: [tool1, tool2],        // 工具列表
  systemPrompt: "你是助手",      // 系统提示词
  checkpointer: memSaver,       // 记忆管理
  responseFormat: schema,       // 结构化输出
  stateSchema: customState,     // 自定义状态
  contextSchema: contextSchema, // 上下文 schema
});
```

### 调用方式

```typescript
// invoke - 一次性返回
const result = await agent.invoke({
  messages: [{ role: "user", content: "你好" }],
});

// stream - 流式返回
const stream = await agent.stream(
  { messages: [...] },
  { streamMode: "values" }
);
```

### Middleware 中间件

```typescript
import { createMiddleware } from "langchain";

const middleware = createMiddleware({
  name: "CustomMiddleware",
  beforeModel: (state) => { /* 模型调用前 */ },
  afterModel: (state) => { /* 模型调用后 */ },
  wrapToolCall: async (toolCall, toolFn) => { /* 工具调用包装 */ },
});

const agent = createAgent({
  model: "gpt-4o",
  middleware: [middleware],
});
```

### 项目应用

- `routes/chat.ts`: 使用 `createAgent` 创建对话 agent
- `routes/extract.ts`: 使用 `createAgent` + `responseFormat` 结构化提取

---

## 2. Models 模型

模型是 LangChain 与 LLM 交互的核心接口。

### 初始化模型

```typescript
// 方式1: initChatModel (自动识别)
import { initChatModel } from "langchain";
const model = await initChatModel("gpt-4o");

// 方式2: 直接实例化
import { ChatOpenAI } from "@langchain/openai";
const model = new ChatOpenAI({
  model: "gpt-4o",
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: "https://api.openai.com/v1",
  },
});
```

### 核心方法

| 方法 | 说明 | 返回类型 |
| ---- | ---- | ---- |
| `invoke(input)` | 同步调用 | `AIMessage` |
| `stream(input)` | 流式调用 | `AsyncIterable<AIMessageChunk>` |
| `batch(inputs)` | 批量调用 | `AIMessage[]` |
| `bindTools(tools)` | 绑定工具 | `Model` |
| `withStructuredOutput(schema)` | 结构化输出 | `Model` |

### invoke 示例

```typescript
// 简单文本
const response = await model.invoke("你好");

// 消息数组
const response = await model.invoke([
  { role: "system", content: "你是翻译助手" },
  { role: "user", content: "Hello" },
]);
```

### stream 示例

```typescript
const stream = await model.stream("讲个故事");
for await (const chunk of stream) {
  process.stdout.write(chunk.text);
}
```

### batch 批量调用

```typescript
const responses = await model.batch(
  ["问题1", "问题2", "问题3"],
  { maxConcurrency: 5 }  // 限制并发
);
```

### Tool Calling 工具调用

```typescript
const modelWithTools = model.bindTools([getWeather, calculator]);
const response = await modelWithTools.invoke("北京天气怎么样？");

if (response.tool_calls?.length) {
  for (const tc of response.tool_calls) {
    console.log(tc.name, tc.args, tc.id);
  }
}
```

### 项目应用

- `lib/llm.ts`: `createLLM()` 使用 `ChatOpenAI`
- `routes/summary.ts`: 使用 `model.invoke()`
- `routes/chat.ts`: 使用 `agent.stream()`

---

## 3. Messages 消息

消息是模型交互的基本单位。

### 消息类型

```typescript
import {
  SystemMessage,   // 系统消息
  HumanMessage,    // 用户消息
  AIMessage,       // AI 回复
  ToolMessage,     // 工具返回
  AIMessageChunk,  // 流式 AI 消息块
} from "@langchain/core/messages";
```

### 创建消息

```typescript
// 类实例化
const msg1 = new SystemMessage("你是助手");
const msg2 = new HumanMessage("你好");
const msg3 = new AIMessage("你好！有什么可以帮你？");

// 字典格式
const messages = [
  { role: "system", content: "你是助手" },
  { role: "user", content: "你好" },
  { role: "assistant", content: "你好！" },
];
```

### AIMessage 属性

```typescript
const response = await model.invoke("你好");

response.content;        // 文本内容
response.tool_calls;     // 工具调用列表
response.usage_metadata; // token 使用统计
response.id;             // 消息 ID
```

### ToolMessage 用法

```typescript
// AI 请求调用工具
const aiMsg = new AIMessage({
  content: "",
  tool_calls: [{
    name: "get_weather",
    args: { city: "北京" },
    id: "call_123",
  }],
});

// 工具返回结果
const toolMsg = new ToolMessage({
  content: "晴天，25°C",
  tool_call_id: "call_123",  // 必须匹配
  name: "get_weather",
});
```

### 流式消息合并

```typescript
let full: AIMessageChunk | null = null;
for await (const chunk of stream) {
  full = full ? full.concat(chunk) : chunk;
}
console.log(full.text);
```

### 项目应用

- `routes/summary.ts`: 使用 `HumanMessage`
- `routes/translate.ts`: 使用 `HumanMessage`
- `middleware/tool-error-handler.ts`: 使用 `ToolMessage`

---

## 4. Tools 工具

工具让 Agent 能够执行具体操作。

### 定义工具

```typescript
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const getWeather = tool(
  async ({ city }) => {
    // 工具逻辑
    return `${city}天气：晴天`;
  },
  {
    name: "get_weather",
    description: "获取城市天气",
    schema: z.object({
      city: z.string().describe("城市名称"),
    }),
  }
);
```

### 访问上下文

```typescript
const getUserName = tool(
  (_, config) => {
    return config.context.user_name;  // 访问上下文
  },
  {
    name: "get_user_name",
    description: "获取用户名",
    schema: z.object({}),
  }
);

// 传入上下文
const agent = createAgent({
  model: "gpt-4o",
  tools: [getUserName],
  contextSchema: z.object({ user_name: z.string() }),
});

await agent.invoke(
  { messages: [...] },
  { context: { user_name: "张三" } }
);
```

### 访问 Store (长期存储)

```typescript
import { InMemoryStore } from "@langchain/langgraph";

const store = new InMemoryStore();

const saveUser = tool(
  async ({ userId, name }, config) => {
    await store.put(["users"], userId, { name });
    return "已保存";
  },
  { name: "save_user", ... }
);

const agent = createAgent({
  model: "gpt-4o",
  tools: [saveUser],
  store,  // 注入 store
});
```

### 项目应用

- `tools/calculator.ts`: 数学计算工具
- `tools/current-time.ts`: 获取当前时间
- `tools/weather.ts`: 天气查询 (Open-Meteo API)
- `tools/search.ts`: 网络搜索

---

## 5. Short-term Memory 短期记忆

短期记忆让 Agent 在多轮对话中保持上下文。

### MemorySaver

```typescript
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();

const agent = createAgent({
  model: "gpt-4o",
  tools: [],
  checkpointer,  // 启用记忆
});
```

### 使用 thread_id

```typescript
// 第一轮对话
await agent.invoke(
  { messages: [{ role: "user", content: "我叫小明" }] },
  { configurable: { thread_id: "session_123" } }
);

// 第二轮对话 - 同一 thread_id，记住上下文
await agent.invoke(
  { messages: [{ role: "user", content: "我叫什么？" }] },
  { configurable: { thread_id: "session_123" } }
);
// AI: 你叫小明
```

### 自定义状态 Schema

```typescript
import { MessagesZodState } from "@langchain/langgraph";

const customState = z.object({
  messages: MessagesZodState.shape.messages,
  userPreferences: z.record(z.string(), z.string()),
});

const agent = createAgent({
  model: "gpt-4o",
  stateSchema: customState,
});
```

### 项目应用

- `memory/store.ts`: 使用 `MemorySaver`
- `routes/chat.ts`: 使用 `checkpointer` + `thread_id`

---

## 6. Streaming 流式输出

流式输出提供实时响应体验。

### Stream Modes

| Mode | 说明 | 数据 |
| ---- | ---- | ---- |
| `values` | Agent 状态变化 | 完整状态 |
| `updates` | 每个节点的更新 | 增量更新 |
| `messages` | LLM token 流 | `[token, metadata]` |
| `custom` | 自定义数据 | 任意数据 |

### streamMode: "values"

```typescript
const stream = await agent.stream(
  { messages: [{ role: "user", content: "你好" }] },
  { streamMode: "values" }
);

for await (const chunk of stream) {
  const lastMsg = chunk.messages.at(-1);
  if (lastMsg?.content) {
    console.log(lastMsg.content);
  }
}
```

### streamMode: "updates"

```typescript
for await (const chunk of await agent.stream(
  { messages: [...] },
  { streamMode: "updates" }
)) {
  const [step, content] = Object.entries(chunk)[0];
  console.log(`Step: ${step}`);
  console.log(`Content: ${JSON.stringify(content)}`);
}
```

### streamMode: "messages"

```typescript
for await (const [token, metadata] of await agent.stream(
  { messages: [...] },
  { streamMode: "messages" }
)) {
  console.log(`Node: ${metadata.langgraph_node}`);
  console.log(`Token: ${token.text}`);
}
```

### Custom Streaming (writer)

```typescript
const myTool = tool(
  async (input, config) => {
    config.writer?.("正在查询...");  // 发送自定义更新
    // ... 执行操作
    config.writer?.("查询完成");
    return result;
  },
  { name: "my_tool", ... }
);

for await (const chunk of await agent.stream(
  { messages: [...] },
  { streamMode: "custom" }
)) {
  console.log(chunk);  // "正在查询..." / "查询完成"
}
```

### 多模式同时流式

```typescript
for await (const [mode, chunk] of await agent.stream(
  { messages: [...] },
  { streamMode: ["updates", "messages", "custom"] }
)) {
  console.log(`${mode}: ${JSON.stringify(chunk)}`);
}
```

### 项目应用

- `routes/chat.ts`: 使用 `agent.stream()` + `streamMode: "values"`

---

## 7. Structured Output 结构化输出

强制模型返回符合 Schema 的 JSON。

### 两种策略

```typescript
import { toolStrategy, providerStrategy } from "langchain";

// Provider Strategy - 使用模型原生支持
const agent1 = createAgent({
  model: "gpt-4o",
  responseFormat: providerStrategy(schema),
});

// Tool Strategy - 通过工具调用实现
const agent2 = createAgent({
  model: "gpt-4o",
  responseFormat: toolStrategy(schema),
});
```

### 定义 Schema

```typescript
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().describe("姓名"),
  email: z.string().optional().describe("邮箱"),
  phone: z.string().optional().describe("电话"),
});
```

### 使用示例

```typescript
const agent = createAgent({
  model: "gpt-4o",
  tools: [],
  responseFormat: toolStrategy(ContactSchema),
});

const result = await agent.invoke({
  messages: [{ role: "user", content: "提取: 张三, zhang@example.com" }],
});

console.log(result.structuredResponse);
// { name: "张三", email: "zhang@example.com" }
```

### Model.withStructuredOutput

```typescript
const modelWithStructure = model.withStructuredOutput(ContactSchema);
const response = await modelWithStructure.invoke("提取联系人...");
// 直接返回结构化对象
```

### 错误处理

```typescript
const agent = createAgent({
  model: "gpt-4o",
  responseFormat: toolStrategy(schema, {
    handleError: true,  // 自动重试 (默认)
    // handleError: false,  // 不重试
    // handleError: (err) => `请修正: ${err.message}`,  // 自定义
  }),
});
```

### 项目应用

- `schemas/index.ts`: 定义 Zod schemas
- `routes/extract.ts`: 使用 `toolStrategy` 结构化提取

---

## 项目中的 LangChain 组件使用总结

| 组件 | 文件位置 | 使用方式 |
| ---- | ---- | ---- |
| **Agents** | `routes/chat.ts`, `routes/extract.ts` | `createAgent()` |
| **Models** | `lib/llm.ts` | `ChatOpenAI` |
| **Messages** | `routes/summary.ts`, `routes/translate.ts` | `HumanMessage`, `AIMessage` |
| **Tools** | `tools/*.ts` | `tool()` 函数 |
| **Memory** | `memory/store.ts`, `routes/chat.ts` | `MemorySaver`, `checkpointer` |
| **Streaming** | `routes/chat.ts` | `agent.stream()` |
| **Structured Output** | `routes/extract.ts`, `schemas/` | `toolStrategy`, Zod schemas |

---

## 参考链接

- [Agents](https://docs.langchain.com/oss/javascript/langchain/agents)
- [Models](https://docs.langchain.com/oss/javascript/langchain/models)
- [Messages](https://docs.langchain.com/oss/javascript/langchain/messages)
- [Tools](https://docs.langchain.com/oss/javascript/langchain/tools)
- [Short-term Memory](https://docs.langchain.com/oss/javascript/langchain/short-term-memory)
- [Streaming](https://docs.langchain.com/oss/javascript/langchain/streaming/overview)
- [Structured Output](https://docs.langchain.com/oss/javascript/langchain/structured-output)
