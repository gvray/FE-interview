---
sidebar_position: 5
title: 事件与观测
sidebar_label: 事件与观测
---
# 事件与观测（TypeScript）

## 事件模型
- 在节点执行前后发出事件，记录耗时与输入输出。

```ts
type Event = { type: string; node?: string; ts: number; data?: any };
class EventBus {
  private listeners: Array<(e: Event) => void> = [];
  on(fn: (e: Event) => void) { this.listeners.push(fn); }
  emit(e: Event) { for (const l of this.listeners) l(e); }
}

const bus = new EventBus();
bus.on(e => { /* 写入日志系统 */ });
```

## 包装节点以产生事件

```ts
type Node<S> = (s: S) => Promise<S> | S;
const withEvents = <S>(name: string, node: Node<S>): Node<S> => async (s) => {
  const start = Date.now();
  bus.emit({ type: "node_start", node: name, ts: start, data: { s } });
  const out = await node(s);
  const end = Date.now();
  bus.emit({ type: "node_end", node: name, ts: end, data: { ms: end - start, out } });
  return out;
};
```

## 指标与告警
- 统计节点耗时分布、失败率，设置阈值触发告警。

```ts
class Metrics {
  private times: Record<string, number[]> = {};
  record(node: string, ms: number) {
    (this.times[node] = this.times[node] ?? []).push(ms);
  }
  p95(node: string) {
    const arr = (this.times[node] ?? []).slice().sort((a, b) => a - b);
    const i = Math.floor(arr.length * 0.95);
    return arr[i] ?? 0;
  }
}

const m = new Metrics();
bus.on(e => {
  if (e.type === "node_end") m.record(e.node!, e.data.ms);
});
```

## 建议
- 事件与指标输出到集中式平台，统一检索与告警。
- 为关键节点设置阈值与速率监控，及时发现性能退化。
