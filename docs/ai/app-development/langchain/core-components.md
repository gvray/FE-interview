---
sidebar_position: 1
title: 核心组件指南
---

# LangChain.js 核心组件指南

> 基于 LangChain.js v1.2.x

## 目录

1. [Models 模型](#1-models-模型)
2. [Messages 消息](#2-messages-消息)
3. [Prompts 提示词模板](#3-prompts-提示词模板)
4. [Tools 工具](#4-tools-工具)
5. [Agents 代理](#5-agents-代理)
6. [Memory 记忆](#6-memory-记忆)
7. [Middleware 中间件](#7-middleware-中间件)

---

## 1. Models 模型

### 安装

```bash
pnpm add @langchain/openai @langchain/core
```

### ChatOpenAI

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o",           // 模型名称
  temperature: 0.7,          // 创造性 (0-1)
  maxTokens: 2000,           // 最大输出 token
  apiKey: "sk-xxx",          // API Key
  configuration: {
    baseURL: "https://api.openai.com/v1",  // 自定义端点
  },
});
```

### 兼容 OpenAI API 的服务

```typescript
// 阿里云百炼
const model = new ChatOpenAI({
  model: "qwen-turbo",
  apiKey: process.env.API_KEY,
  configuration: {
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  },
});

// Ollama 本地
const model = new ChatOpenAI({
  model: "llama3",
  configuration: {
    baseURL: "http://localhost:11434/v1",
  },
});
```

---

## 2. Messages 消息

### 消息类型

```typescript
import {
  HumanMessage,      // 用户消息
  AIMessage,         // AI 回复
  SystemMessage,     // 系统提示
  ToolMessage,       // 工具返回
} from "@langchain/core/messages";
```

### 使用示例

```typescript
const messages = [
  new SystemMessage("你是一个助手"),
  new HumanMessage("你好"),
  new AIMessage("你好！有什么可以帮你的？"),
  new HumanMessage("今天天气怎么样"),
];

const response = await model.invoke(messages);
console.log(response.content);
```

### Tool Calls

```typescript
// AI 返回的 tool_calls
if (response.tool_calls && response.tool_calls.length > 0) {
  for (const toolCall of response.tool_calls) {
    console.log(toolCall.name);  // 工具名
    console.log(toolCall.args);  // 参数
    console.log(toolCall.id);    // 调用 ID
  }
}

// 返回工具结果
const toolMessage = new ToolMessage({
  tool_call_id: toolCall.id,
  content: "工具执行结果",
});
```

---

## 3. Prompts 提示词模板

### PromptTemplate

基础变量插值模板。

```typescript
import { PromptTemplate } from "@langchain/core/prompts";

const template = PromptTemplate.fromTemplate(
  `请将以下文本翻译成{language}：

{text}`
);

const prompt = await template.format({
  language: "英文",
  text: "你好世界",
});
// 输出: "请将以下文本翻译成英文：\n\n你好世界"
```

### ChatPromptTemplate

用于构建对话消息序列。

```typescript
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

const chatTemplate = ChatPromptTemplate.fromMessages([
  ["system", "你是一个{role}"],
  new MessagesPlaceholder("history"),  // 历史消息占位符
  ["human", "{input}"],
]);

const messages = await chatTemplate.formatMessages({
  role: "翻译助手",
  history: [
    new HumanMessage("你好"),
    new AIMessage("Hello!"),
  ],
  input: "谢谢",
});
```

### FewShotPromptTemplate

带示例的提示模板，提升输出质量。

```typescript
import { FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

const examplePrompt = PromptTemplate.fromTemplate(
  `输入: {input}
输出: {output}`
);

const examples = [
  { input: "happy", output: "开心" },
  { input: "sad", output: "悲伤" },
  { input: "angry", output: "愤怒" },
];

const fewShotTemplate = new FewShotPromptTemplate({
  examples,
  examplePrompt,
  prefix: "将英文情感词翻译成中文：",
  suffix: "输入: {word}\n输出:",
  inputVariables: ["word"],
});

const prompt = await fewShotTemplate.format({ word: "excited" });
// 输出包含示例，引导模型输出格式
```

---

## 4. Tools 工具

### 定义工具

```typescript
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const myTool = tool(
  async (input) => {
    // 工具逻辑
    return `结果: ${input.param}`;
  },
  {
    name: "tool_name",           // 唯一标识
    description: "工具描述",      // LLM 根据此决定是否调用
    schema: z.object({           // Zod schema 定义参数
      param: z.string().describe("参数说明"),
    }),
  }
);
```

### 绑定工具到模型

```typescript
const tools = [calculator, getWeather, searchWeb];
const modelWithTools = model.bindTools(tools);

const response = await modelWithTools.invoke(messages);

// 检查是否有工具调用
if (response.tool_calls?.length > 0) {
  // 执行工具...
}
```

### 工具调用循环

```typescript
async function runAgentLoop(messages, model, tools) {
  let currentMessages = [...messages];
  const maxIterations = 5;

  for (let i = 0; i < maxIterations; i++) {
    const response = await model.invoke(currentMessages);
    currentMessages.push(response);

    if (response.tool_calls?.length > 0) {
      // 执行每个工具调用
      for (const toolCall of response.tool_calls) {
        const tool = tools.find(t => t.name === toolCall.name);
        const result = await tool.invoke(toolCall.args);
        
        currentMessages.push(new ToolMessage({
          tool_call_id: toolCall.id,
          content: result,
        }));
      }
    } else {
      // 无工具调用，返回最终响应
      return response.content;
    }
  }
}
```

---

## 5. Agents 代理

### createAgent (LangChain v1.2+)

```typescript
import { createAgent } from "langchain";

const agent = createAgent({
  model: "gpt-4o",           // 或 ChatOpenAI 实例
  tools: [tool1, tool2],
  systemPrompt: "你是一个助手",
});

const result = await agent.invoke({
  messages: [{ role: "user", content: "你好" }],
});
```

### 流式输出

```typescript
const stream = await agent.stream(
  { messages: [{ role: "user", content: "搜索新闻" }] },
  { streamMode: "values" }
);

for await (const chunk of stream) {
  const lastMsg = chunk.messages.at(-1);
  if (lastMsg?.content) {
    console.log(lastMsg.content);
  }
}
```

---

## 6. Memory 记忆

### MemorySaver (LangGraph)

```typescript
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();

const agent = createAgent({
  model: "gpt-4o",
  tools: [],
  checkpointer,  // 启用记忆
});

// 使用 thread_id 追踪会话
await agent.invoke(
  { messages: [{ role: "user", content: "我叫小明" }] },
  { configurable: { thread_id: "user_123" } }
);

// 后续对话，同一 thread_id 会记住上下文
await agent.invoke(
  { messages: [{ role: "user", content: "我叫什么？" }] },
  { configurable: { thread_id: "user_123" } }
);
// AI 回复: 你叫小明
```

### 自定义 Memory Store

```typescript
class InMemoryStore {
  private store = new Map();

  get(threadId: string) {
    return this.store.get(threadId)?.messages || [];
  }

  set(threadId: string, messages: BaseMessage[]) {
    this.store.set(threadId, {
      messages: this.trimMessages(messages),
      updatedAt: new Date(),
    });
  }

  // 自动裁剪旧消息
  private trimMessages(messages: BaseMessage[]) {
    const maxMessages = 20;
    if (messages.length <= maxMessages) return messages;
    return [messages[0], ...messages.slice(-maxMessages + 1)];
  }
}
```

---

## 7. Middleware 中间件

### createMiddleware

```typescript
import { createMiddleware } from "langchain";

const loggingMiddleware = createMiddleware({
  name: "Logging",
  beforeModel: (state) => {
    console.log("Before model:", state.messages.length);
  },
  afterModel: (state) => {
    console.log("After model:", state.messages.at(-1)?.content);
  },
});
```

### Tool Error Handling

```typescript
const toolErrorMiddleware = createMiddleware({
  name: "ToolErrorHandler",
  wrapToolCall: async (toolCall, toolFn) => {
    try {
      return await toolFn(toolCall);
    } catch (error) {
      console.error(`Tool ${toolCall.name} failed:`, error);
      return new ToolMessage({
        tool_call_id: toolCall.id,
        content: `Error: ${error.message}`,
      });
    }
  },
});

const agent = createAgent({
  model: "gpt-4o",
  tools: [myTool],
  middleware: [toolErrorMiddleware],
});
```

### Trim Messages

```typescript
import { RemoveMessage } from "@langchain/core/messages";
import { REMOVE_ALL_MESSAGES } from "@langchain/langgraph";

const trimMiddleware = createMiddleware({
  name: "TrimMessages",
  beforeModel: (state) => {
    if (state.messages.length <= 10) return;
    
    const systemMsg = state.messages[0];
    const recent = state.messages.slice(-8);
    
    return {
      messages: [
        new RemoveMessage({ id: REMOVE_ALL_MESSAGES }),
        systemMsg,
        ...recent,
      ],
    };
  },
});
```

---

## 8. Structured Output 结构化输出

强制模型返回符合 Schema 的结构化 JSON。

### 两种策略

```typescript
import { createAgent, toolStrategy, providerStrategy } from "langchain";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

// 方式1: Provider Strategy（模型原生支持）
const agent1 = createAgent({
  model: "gpt-4o",
  responseFormat: providerStrategy(schema),
});

// 方式2: Tool Strategy（通过工具调用实现）
const agent2 = createAgent({
  model: "gpt-4o",
  responseFormat: toolStrategy(schema),
});
```

### 使用示例

```typescript
const ContactSchema = z.object({
  name: z.string().describe("姓名"),
  email: z.string().optional().describe("邮箱"),
  phone: z.string().optional().describe("电话"),
});

const agent = createAgent({
  model: createLLM(),
  tools: [],
  responseFormat: toolStrategy(ContactSchema),
});

const result = await agent.invoke({
  messages: [{ role: "user", content: "提取: 张三, zhang@example.com" }],
});

console.log(result.structuredResponse);
// { name: "张三", email: "zhang@example.com" }
```

### 错误处理

```typescript
const agent = createAgent({
  model: createLLM(),
  responseFormat: toolStrategy(schema, {
    handleError: true,  // 自动重试（默认）
    // handleError: false,  // 不重试，抛出异常
    // handleError: (err) => `请修正: ${err.message}`,  // 自定义
  }),
});
```

---

## 常用包

| 包名 | 用途 |
| ---- | ---- |
| `langchain` | 核心库，createAgent 等 |
| `@langchain/core` | 消息、工具、提示词基础类 |
| `@langchain/openai` | OpenAI / 兼容 API 模型 |
| `@langchain/langgraph` | 状态图、记忆、Checkpointer |
| `zod` | Schema 验证（工具参数） |

---

## 参考链接

- [LangChain.js 官方文档](https://docs.langchain.com/oss/javascript)
- [Tools 文档](https://docs.langchain.com/oss/javascript/langchain/tools)
- [Agents 文档](https://docs.langchain.com/oss/javascript/langchain/agents)
- [Short-term Memory](https://docs.langchain.com/oss/javascript/langchain/short-term-memory)
- [Middleware](https://docs.langchain.com/oss/javascript/langchain/middleware)
