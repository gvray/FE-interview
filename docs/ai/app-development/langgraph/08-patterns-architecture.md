---
sidebar_position: 8
title: 模式与架构
sidebar_label: 模式与架构
---
# 模式与架构（TypeScript）

## 常见模式
- 门控路由：基于状态或评分决定路径。
- 回退链路：主路径失败时转降级路径。
- 子图组合：将复杂流程拆分为可复用子图。

```ts
type S = { score?: number; ok?: boolean };
const gate = (s: S) => (s.score && s.score > 0.7 ? "high" : "low");
const high = (s: S): S => ({ ...s, ok: true });
const low = (s: S): S => ({ ...s, ok: true });
```

## 子图
- 以函数返回器封装子流程，提升复用与可测性。

```ts
type Node<S> = (s: S) => Promise<S> | S;
const makeSubgraph = <S>(nodes: Node<S>[]) => async (s: S) => {
  let st = s;
  for (const n of nodes) st = await n(st);
  return st;
};

const pipeline = makeSubgraph<S>([high, low]);
```

## 架构建议
- 将图编排、状态、工具、监控分层，降低耦合。
- 明确边界：输入输出契约、错误策略、资源限制。
