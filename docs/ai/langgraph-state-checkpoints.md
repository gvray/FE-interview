---
sidebar_position: 4
title: 状态与检查点
sidebar_label: 状态与检查点
---
# 状态与检查点（TypeScript）

## 定义状态与合并策略
- 明确状态结构，避免隐式共享；建议集中管理合并逻辑。

```ts
type Msg = { role: string; content: string };
type State = { messages: Msg[]; vars?: Record<string, any> };

type Reducer<S> = (prev: S, patch: Partial<S>) => S;
const merge: Reducer<State> = (prev, patch) => ({
  messages: patch.messages ?? prev.messages,
  vars: { ...(prev.vars ?? {}), ...(patch.vars ?? {}) },
});
```

## 轻量检查点实现
- 为关键节点写入快照，支持恢复与审计。

```ts
type Checkpoint<S> = { id: string; state: S; ts: number };
class MemoryCheckpointer<S> {
  private store = new Map<string, Checkpoint<S>>();
  save(id: string, state: S) {
    this.store.set(id, { id, state, ts: Date.now() });
  }
  load(id: string) {
    return this.store.get(id)?.state;
  }
}

const cp = new MemoryCheckpointer<State>();
const id = "flow-001";
cp.save(id, { messages: [{ role: "user", content: "start" }] });
const recovered = cp.load(id);
```

## 将检查点融入图执行
- 在进入高风险或分支前保存快照；失败后回退重试。

```ts
const risky = async (s: State): Promise<State> => {
  const ok = Math.random() > 0.2;
  return ok
    ? merge(s, { vars: { last: "ok" } })
    : merge(s, { vars: { last: "fail" } });
};

const runWithCheckpoint = async (s: State, id: string) => {
  cp.save(id, s);
  const s1 = await risky(s);
  if (s1.vars?.last === "fail") {
    const back = cp.load(id)!;
    return merge(back, { vars: { retried: true } });
  }
  return s1;
};
```

## 建议
- 将检查点写入持久化存储以支持并发与恢复。
- 为关键路径建立统一的保存策略与保留时长。
