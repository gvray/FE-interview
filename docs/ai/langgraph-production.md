---
sidebar_position: 10
title: 生产与部署
sidebar_label: 生产与部署
---
# 生产与部署（TypeScript）

## 并发与限流
- 控制并发数，避免外部服务过载。

```ts
class Limiter {
  private current = 0;
  constructor(private max: number) {}
  async run<T>(fn: () => Promise<T>) {
    while (this.current >= this.max) await new Promise(r => setTimeout(r, 5));
    this.current++;
    try { return await fn(); } finally { this.current--; }
  }
}
```

## 超时与重试
- 为外部调用设置超时与重试，确保可控失败。

```ts
const withTimeout = <T>(p: Promise<T>, ms: number) =>
  new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    p.then(v => { clearTimeout(t); resolve(v); })
     .catch(e => { clearTimeout(t); reject(e); });
  });
```

## 幂等与去重
- 为工具调用设置幂等键，避免重复副作用。

```ts
const idempotent = async <T>(key: string, fn: () => Promise<T>) => {
  // 伪实现：依赖持久化缓存
  return await fn();
};
```

## 观测与告警
- 输出事件与指标到统一平台，设置阈值告警。

## 建议
- 明确资源边界与配额，做好灰度与回滚预案。
- 将检查点、事件、工具层分离部署，便于独立扩缩。
