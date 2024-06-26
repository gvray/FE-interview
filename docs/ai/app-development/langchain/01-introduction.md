---
sidebar_position: 1
title: LangChain 入门
---

## 什么是 LangChain

LangChain 是一个用于开发大语言模型（LLM）应用的框架，它提供了一套工具和抽象，帮助开发者更容易地构建基于 LLM 的应用程序。

## 核心概念

### 1. Models（模型）

- LLMs：大语言模型
- Chat Models：对话模型
- Embedding Models：嵌入模型

### 2. Prompts（提示词）

- Prompt Templates：提示词模板
- Example Selectors：示例选择器

### 3. Chains（链）

- 将多个组件组合成一个工作流

### 4. Agents（代理）

- 让 LLM 自主决定采取什么行动

### 5. Memory（记忆）

- 在对话中保持上下文

## 快速开始

```python
# 安装
pip install langchain langchain-openai

# 基础示例
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

model = ChatOpenAI(model="gpt-4")
response = model.invoke([HumanMessage(content="你好")])
print(response.content)
```

## 下一步

- [LCEL 表达式语言](./02-lcel.md)
- [Prompt 模板](./03-prompts.md)
- [Chain 链式调用](./04-chains.md)
