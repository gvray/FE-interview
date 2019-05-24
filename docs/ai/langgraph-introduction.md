---
sidebar_position: 1
title: LangGraph 概览
sidebar_label: 概览
---
# LangGraph 深入浅出

## 为什么选择 LangGraph
- 图结构编排：以“节点-边-状态”的显式图结构组织复杂流程，清晰、可维护、可调试。
- 有状态智能体：在对话与任务执行中保留上下文与中间结果，实现更稳健的循环、分支与回溯。
- 工程级特性：检查点（checkpoint）、事件流（events）、并行与条件边、可插拔工具与外部系统。
- TypeScript 生态完善，易于与 LangChain 等结合。

## 适用场景
- 多步骤推理与工具调用：搜索→分析→生成报告。
- 工作流自动化：数据清洗→摘要→审核→发布。
- 对话智能体：带记忆、可中断恢复、可并行调用工具。

## 快速上手（TypeScript）

```ts
// 概念示例：以实际项目依赖为准
type Message = { role: string; content: string };
type State = { messages: Message[] };

const llm = async (s: State): Promise<State> => ({
  messages: [...s.messages, { role: "ai", content: "Hello from LangGraph JS!" }],
});

class StateGraph<S> {
  private nodes = new Map<string, (s: S) => Promise<S> | S>();
  private edges: Array<[string, string]> = [];
  addNode(name: string, fn: (s: S) => Promise<S> | S) { this.nodes.set(name, fn); }
  addEdge(from: string, to: string) { this.edges.push([from, to]); }
  compile() {
    const edges = this.edges.slice();
    return {
      invoke: async (initial: S) => {
        let curr = "START";
        let state = initial;
        while (true) {
          const next = edges.find(e => e[0] === curr)?.[1];
          if (!next || next === "END") break;
          const fn = this.nodes.get(next)!;
          state = await fn(state);
          curr = next;
        }
        return state;
      }
    };
  }
}

const g = new StateGraph<State>();
g.addNode("llm", llm);
g.addEdge("START", "llm");
g.addEdge("llm", "END");
const app = g.compile();
const res = await app.invoke({ messages: [{ role: "user", content: "Hi" }] });
```

## 与传统“顺序链”的区别
- 流程显式：分支、循环、并行与条件路由以图形式表达，复杂度不再“藏在代码里”。
- 稳健性提升：检查点与事件流便于恢复、追踪与监控；更适合长链路、多工具的生产环境。
- 易演进：新增节点与边即可扩展能力，便于渐进式设计与 A/B 试验。
