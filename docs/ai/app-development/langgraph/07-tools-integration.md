---
sidebar_position: 7
title: 工具与外部系统
sidebar_label: 工具与外部系统
---
# 工具与外部系统（TypeScript）

## 工具接口

```ts
type Tool = (args: Record<string, any>) => Promise<any>;
const search: Tool = async ({ q }) => ({ items: [`${q}-A`, `${q}-B`] });
const fetchJson: Tool = async ({ url }) => (await (await fetch(url)).json());
```

## 调度与并发

```ts
const runTools = async (q: string) => {
  const [s, j] = await Promise.all([
    search({ q }),
    fetchJson({ url: "https://api.example.com/data" }),
  ]);
  return { s, j };
};
```

## 失败重试与超时

```ts
const withRetry = <T>(fn: () => Promise<T>, times = 2) =>
  fn().catch(e => (times > 0 ? withRetry(fn, times - 1) : Promise.reject(e)));

const withTimeout = <T>(p: Promise<T>, ms: number) =>
  new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    p.then(v => { clearTimeout(t); resolve(v); })
     .catch(e => { clearTimeout(t); reject(e); });
  });
```

## 建议
- 工具需声明幂等性与副作用，便于重试与去重。
- 统一错误包装与状态输出，减少模型对异常文本的敏感性。
