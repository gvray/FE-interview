---
sidebar_position: 9
title: 测试与评估
sidebar_label: 测试与评估
---
# 测试与评估（TypeScript）

## 单元测试思路
- 为节点提供可控输入，断言状态变更与分支选择。

```ts
type S = { n?: number; ok?: boolean };
const refine = (s: S): S => ({ n: (s.n ?? 0) + 1, ok: (s.n ?? 0) + 1 >= 2 });

const testRefine = () => {
  let s: S = {};
  s = refine(s);
  if (s.ok) throw new Error("should not ok at first");
  s = refine(s);
  if (!s.ok) throw new Error("should ok at second");
};
```

## 回归用例
- 固定输入输出契约与路径，避免演进中行为漂移。

```ts
type Msg = { role: string; content: string };
type State = { messages: Msg[] };
const add = (s: State, m: Msg): State => ({ messages: [...s.messages, m] });

const testAdd = () => {
  const s = { messages: [] };
  const out = add(s, { role: "user", content: "hi" });
  if (out.messages.length !== 1) throw new Error("length mismatch");
};
```

## 评估
- 关注路径正确率、工具调用成功率、响应延迟与稳定性。
- 结合事件与指标做线上评估，定期回归离线用例。
