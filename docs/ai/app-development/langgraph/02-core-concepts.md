---
sidebar_position: 2
title: 核心概念
sidebar_label: 核心概念
---
# LangGraph 核心概念

## 节点（Node）
- 接收状态并返回新的状态或部分更新。
- 可以是同步或异步函数，便于集成 LLM、工具、服务。

## 边（Edge）
- 有向连接，决定节点的执行顺序。
- 条件边：根据当前状态选择下一节点，实现路由与分支。

```ts
type Message = { role: string; content: string };
type State = { messages: Message[] };

const route = (s: State) =>
  s.messages.at(-1)?.content.includes("搜索") ? "search" : "llm";

const search = (s: State): State => ({
  messages: [...s.messages, { role: "tool", content: "搜索结果" }],
});
const llm = (s: State): State => ({
  messages: [...s.messages, { role: "ai", content: "已处理" }],
});

class StateGraph<S> {
  private nodes = new Map<string, (s: S) => S>();
  private edges = new Map<string, string | ((s: S) => string)>();
  addNode(name: string, fn: (s: S) => S) { this.nodes.set(name, fn); }
  addEdge(from: string, to: string | ((s: S) => string)) { this.edges.set(from, to); }
  compile() {
    return {
      invoke: (initial: S) => {
        let curr = "START";
        let state = initial;
        while (true) {
          const to = this.edges.get(curr);
          if (!to) break;
          const next = typeof to === "function" ? (to as any)(state) : to;
          if (next === "END") break;
          state = this.nodes.get(next)!(state);
          curr = next;
        }
        return state;
      }
    };
  }
}

const g = new StateGraph<State>();
g.addNode("search", search);
g.addNode("llm", llm);
g.addEdge("START", (s) => route(s));
g.addEdge("search", "llm");
g.addEdge("llm", "END");
const out = g.compile().invoke({ messages: [{ role: "user", content: "需要搜索" }] });
```

## 状态（State）
- 可自定义的结构，通常包含消息、变量与中间产物。
- 通过合并策略（reducers）统一管理不同节点的更新。

## 检查点与事件
- 检查点：在关键步骤保存状态快照，支持中断恢复与审计。
- 事件流：记录节点执行与状态变更，便于调试与观测。

## 并行与循环
- 并行：多个分支同时执行，再聚合结果。
- 循环：自边或条件返回同一节点，实现迭代与自我修正。

```ts
type LoopState = { steps?: number; ok?: boolean };

const iterate = (s: LoopState): LoopState => {
  const n = (s.steps ?? 0) + 1;
  return { steps: n, ok: n >= 3 };
};

const routeLoop = (s: LoopState) => (s.ok ? "END" : "iterate");

class LoopGraph<S> {
  private nodes = new Map<string, (s: S) => S>();
  addNode(name: string, fn: (s: S) => S) { this.nodes.set(name, fn); }
  invoke(initial: S) {
    let state = initial;
    while (true) {
      const next = routeLoop(state as any);
      if (next === "END") break;
      state = this.nodes.get(next)!(state);
    }
    return state;
  }
}

const lg = new LoopGraph<LoopState>();
lg.addNode("iterate", iterate);
const final = lg.invoke({});
```
