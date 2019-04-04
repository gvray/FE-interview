---
title: 核心组件技术手册
sidebar_position: 4
---

# LangChain 核心组件技术手册（基于最新官方文档）

## 前言

LangChain 是一套为 **构建智能体（AI Agent）和大语言模型驱动应用** 而设计的开源框架。它通过解耦模型、消息、工具、记忆、流水等核心模块，帮助开发者快速构建复杂的对话系统、工具调度系统、记忆保持系统等。

以下内容基于 **官方文档体系** 精心整合：

- **Agents**（智能体执行结构）([LangChain 文档](https://docs.langchain.com/oss/javascript/langchain/agents?utm_source=chatgpt.com))
- **Models**（模型调用能力）([LangChain 文档](https://docs.langchain.com/oss/javascript/langchain/models?utm_source=chatgpt.com))
- **Messages**（消息结构与角色）([LangChain 文档](https://docs.langchain.com/oss/javascript/langchain/messages?utm_source=chatgpt.com))
- **Tools**（工具扩展与调用）([LangChain 文档](https://docs.langchain.com/oss/javascript/langchain/tools?utm_source=chatgpt.com))
- **Short-term memory**（会话历史记忆）([LangChain 文档](https://docs.langchain.com/oss/javascript/langchain/short-term-memory?utm_source=chatgpt.com))
- **Streaming**（实时生成输出）([LangChain 文档](https://docs.langchain.com/oss/javascript/langchain/streaming?utm_source=chatgpt.com))
- **Structured output**（结构化响应输出）([LangChain 文档](https://docs.langchain.com/oss/javascript/langchain/structured-output?utm_source=chatgpt.com))

![img](https://cdn.nlark.com/yuque/0/2026/png/12952636/1767780325295-6f7f4753-5c1c-4136-ba1e-5d8b99e5067a.png)

## 什么是这 7 个核心组件（核心 What）

这些核心组件共同构成 LangChain 的 Agent 架构层级：

| 组件                  | 核心职责                                           |
| --------------------- | -------------------------------------------------- |
| **Models**            | 负责语言模型推理与生成（Agent 的核心推理引擎）     |
| **Messages**          | 统一管理对话消息角色和内容                         |
| **Tools**             | 用于扩展 LLM 行为的外部能力（API、数据库、计算等） |
| **Short-term memory** | 会话级记忆，用于上下文连续性                       |
| **Streaming**         | 实时、分段输出模型内容                             |
| **Structured Output** | 用于将自然语言结果约束为确定格式                   |
| **Agents**            | 将上述所有组件组合成可执行智能体                   |

------

## 📌 统一 3W1H 分析

| 点                   | 内容                                                         |
| -------------------- | ------------------------------------------------------------ |
| **What** 是什么      | LangChain 的 7 个核心抽象组件，是构建 AI Agent 的最小可执行构件 |
| **Why** 为什么需要   | 解决对话连续性、复杂执行、工具调用和结构化输出等常见 LLM 应用痛点 |
| **When** 何时使用    | 构建多轮对话、自动化任务、强化输出结构、与外部系统对接等场景 |
| **How** 如何组合实现 | 通过 `createAgent()` 将 Models + Messages + Tools + Memory + Streaming + Structured Output 组合成一个可执行 Agent（使用 `invoke()` 或 `stream()` 调用模型） |

------

## Models（模型）—— 推理引擎

### 概述

在 LangChain 中，Models 是负责语言理解和生成的推理引擎，它驱动 Agent 的决策和输出。模型可支持：

- 文本生成、摘要、翻译、对话
- 工具调用（function calling / tool calling）
- 流式输出
- 批量生成等高级模式 ([LangChain 文档](https://docs.langchain.com/oss/javascript/langchain/models?utm_source=chatgpt.com))

### 示例（完整调用）

```typescript
import { initChatModel } from "langchain";

const model = await initChatModel("gpt-4o-mini", {
  temperature: 0.5,
  timeout: 30,
});

// 单条 invoke 调用
const response = await model.invoke("解释什么是 LangChain 核心组件？");
console.log(response.text);

// 批量调用
const results = await model.batch([
  "解释 LangChain Models",
  "解释 LangChain Agents",
]);
results.forEach(r => console.log(r.text));
```

------

## Messages（消息结构）—— 上下文与角色

### 概念

消息是 LangChain Agent 最基础的上下文单元，包含不同角色的信息：

- **SystemMessage**：系统指令或场景设定
- **HumanMessage**：用户输入
- **AIMessage**：模型生成结果（可能含 tool calls）
- **ToolMessage**：工具执行结果 ([LangChain 文档](https://docs.langchain.com/oss/javascript/langchain/messages?utm_source=chatgpt.com))

### 示例构建消息

```typescript
import { SystemMessage, HumanMessage } from "langchain";

const messages = [
  new SystemMessage("你是专业代码助手"),
  new HumanMessage("如何解释 LangChain 7 个组件？"),
];

// 直接传入 model.invoke
const output = await model.invoke(messages);
console.log(output.text);
```

------

## Tools（工具）—— 外部系统能力

### 概念

Tools 是附加能力的抽象，用于让模型在理解对话上下文的基础上执行外部操作，如 API 调用、数据库查询等。([LangChain 文档](https://docs.langchain.com/oss/javascript/langchain/tools?utm_source=chatgpt.com))

### 示例（定义与调用）

```typescript
import { tool } from "langchain";
import * as z from "zod";

const searchDatabase = tool(
  ({ query, limit }) => `Found ${limit} results for '${query}'`,
  {
    name: "search_database",
    description: "搜索客户数据库",
    schema: z.object({
      query: z.string(),
      limit: z.number(),
    }),
  }
);

const searchRes = await searchDatabase.invoke({ query: "AI", limit: 5 });
console.log(searchRes);
```

------

## Short-term memory（短期记忆）

### 核心作用

短期记忆是会话上下文的一部分，它允许 Agent 在同一会话线程中记住历史消息，使对话具有连续性和语境感。
官方推荐通过状态检查点（checkpointer）结合 MemorySaver 来存储会话状态。([LangChain 文档](https://docs.langchain.com/oss/javascript/langchain/short-term-memory?utm_source=chatgpt.com))

### 示例

```typescript
import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();

const agent = createAgent({
  model: "gpt-4o-mini",
  tools: [],
  checkpointer,
});

await agent.invoke(
  { messages: [{ role: "user", content: "你好，我是 Bob" }] },
  { configurable: { thread_id: "session1" } }
);

// 再次 invoke 会带上 session1 的历史
```

------

## Streaming（实时输出）

### 核心作用

Streaming 让应用在模型生成过程中 **逐步获取输出**，无需等待完整生成结果，有助于用户体验和实时显示。([LangChain 文档](https://docs.langchain.com/oss/javascript/langchain/streaming?utm_source=chatgpt.com))

### 基本模式

```typescript
const stream = await model.stream("实时输出内容");
for await (const chunk of stream) {
  console.log(chunk.text);
}
```

也支持 Agent 流程中的 `agent.stream()` 实时观察执行及工具调用进展。([LangChain 文档](https://docs.langchain.com/oss/javascript/langchain/agents?utm_source=chatgpt.com))

------

## Structured Output（结构化输出）

### 概念

结构化输出使得 Agent/Model 的最终返回结果 **遵循一个指定结构**（数据格式、字段类型等），利于自动化系统进一步处理和解析。([LangChain 文档](https://docs.langchain.com/oss/javascript/langchain/structured-output?utm_source=chatgpt.com))

### 官方示例

```typescript
import * as z from "zod";
import { createAgent } from "langchain";

const ContactInfo = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
});

const agent = createAgent({
  model: "gpt-4o-mini",
  tools: [],
  responseFormat: ContactInfo,
});

const result = await agent.invoke({
  messages: [{ role: "user", content: "提取联系人信息: John, [email protected], 1234567890" }]
});

console.log(result.structuredResponse);
```

------

## Agents（智能体）—— 7 组件组合成可执行单位

### 核心作用

Agent 是整合上述所有组件的 **实际执行载体**。通过 `createAgent` + 状态与配置信息，Agent 将模型推理、消息、工具调用、记忆和结构化输出聚合成 **一个可执行闭环系统**。([LangChain 文档](https://docs.langchain.com/oss/javascript/langchain/agents?utm_source=chatgpt.com))

### 最小完整示例

```typescript
import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";

const memory = new MemorySaver();

const agent = createAgent({
  model: "gpt-4o-mini",
  tools: [],
  checkpointer: memory,
});

const resp = await agent.invoke(
  { messages: [{ role: "user", content: "解释 LangChain 核心组件。" }] },
  { configurable: { thread_id: "main_session" } }
);

console.log(resp.output_text);
```

------

## 图示：7 大组件协作流程

下面这张结构图展示了每个组件如何在 Agent 执行周期中协作：

![img](https://cdn.nlark.com/yuque/0/2026/png/12952636/1767782625162-db322dd0-c86f-4e40-a170-21399a0b9aff.png)

------

## 总结：整体协同机制

LangChain 的 7 个核心组件并不是孤立的，它们之间的协同流程如下：

```plain
用户输入 → 创建消息对象（Messages） → 传入 Agent  
              ↓
           Agent 调用 Model  
              ↓
        Model 可能触发 Tools 调用或产生结构化输出  
              ↓
        Short-term memory 记录上下文  
              ↓
        Streaming 将实时内容推送给客户端  
              ↓
          最终输出返回
```

这张流程体现了新版 **LangChain.js 官方推荐的执行路径** —— 清晰、模块化、易于扩展。([LangChain Reference](https://reference.langchain.com/javascript/modules/langchain.html?utm_source=chatgpt.com))
