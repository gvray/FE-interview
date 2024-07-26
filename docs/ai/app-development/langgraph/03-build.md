---
sidebar_position: 3
title: 构建与示例
sidebar_label: 构建与示例
---
# LangGraph 构建与示例

## 分支与聚合
- 将任务拆分为多个并行子任务，最后在聚合节点合并结果。

```ts
type PState = { a?: string; b?: string; result?: string };

const fetchA = async (s: PState): Promise<PState> => ({ ...s, a: "结果A" });
const fetchB = async (s: PState): Promise<PState> => ({ ...s, b: "结果B" });
const combine = (s: PState): PState => ({ ...s, result: `${s.a ?? ""}-${s.b ?? ""}` });

const runParallel = async () => {
  const s0: PState = {};
  const [sa, sb] = await Promise.all([fetchA(s0), fetchB(s0)]);
  const merged = { ...sa, ...sb };
  return combine(merged);
};
```

## 循环与停止条件
- 自我修正或逐步细化的场景可用循环模式。

```ts
type RState = { n?: number; ok?: boolean };

const refine = (s: RState): RState => {
  const n = (s.n ?? 0) + 1;
  return { n, ok: n >= 2 };
};

const runRefine = (s0: RState) => {
  let s = s0;
  while (true) {
    s = refine(s);
    if (s.ok) break;
  }
  return s;
};
```

## 错误处理与回退
- 节点内部使用 try/except，或将失败路径显式建模为分支。
- 可结合检查点在失败后恢复到最近成功状态并重试。

```ts
type EState = { ok?: boolean; error?: string; note?: string };

const robust = async (s: EState): Promise<EState> => {
  try {
    // 调用外部服务
    return { ...s, ok: true };
  } catch (e) {
    return { ...s, ok: false, error: String(e) };
  }
};

const fallback = (s: EState): EState => ({ ...s, note: "已降级处理" });

const runRobust = async () => {
  const s = await robust({});
  return s.ok ? s : fallback(s);
};
```

## 工程实践建议
- 明确状态结构与合并策略，避免隐式共享。
- 关键节点设置检查点，提升可恢复性与可审计性。
- 充分利用条件边与并行，保持图结构清晰，便于扩展。
