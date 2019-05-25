---
sidebar_position: 6
title: 记忆与对话
sidebar_label: 记忆与对话
---
# 记忆与对话（TypeScript）

## 记忆层次
- 短期：当前回合的工作记忆（messages、变量）。
- 长期：摘要与关键事实，跨会话复用。

## 对话状态与裁剪

```ts
type Msg = { role: "user"|"ai"|"system"|"tool"; content: string };
type Conv = { messages: Msg[]; summary?: string };

const limitTokens = (msgs: Msg[], max = 8) => msgs.slice(-max);
const addMessage = (c: Conv, m: Msg): Conv => ({ ...c, messages: [...c.messages, m] });
```

## 摘要记忆
- 当消息长度超限，将历史压缩为摘要，保留关键意图与事实。

```ts
const summarize = (msgs: Msg[]): string => {
  const text = msgs.map(m => `${m.role}:${m.content}`).join("\n");
  return text.slice(0, 120);
};

const ensureMemory = (c: Conv, max = 16): Conv => {
  if (c.messages.length <= max) return c;
  const summary = summarize(c.messages.slice(0, -max));
  return { summary, messages: c.messages.slice(-max) };
};
```

## 工具消息整合
- 将工具结果作为 tool role 注入，便于模型参考与溯源。

```ts
const addToolResult = (c: Conv, content: string): Conv =>
  addMessage(c, { role: "tool", content });
```

## 建议
- 定义一致的裁剪与摘要策略，避免上下文漂移。
- 将关键事实写入长期存储，定期再整合到对话摘要中。
