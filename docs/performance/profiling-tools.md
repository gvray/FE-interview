---
sidebar_position: 7
---

# 性能测量工具

"先度量，再优化"是性能工程的铁律。本章介绍从实验室到线上、从浏览器原生到第三方库的性能测量工具，覆盖 Lighthouse、Chrome DevTools Performance、Performance API、Web Vitals 库以及如何落地线上监控。理解这些工具并能给出具体使用场景，是面试中"如何做性能监控"类问题的标准答案。

## 工具全景

| 工具 | 类型 | 数据来源 | 主要用途 |
| --- | --- | --- | --- |
| **Lighthouse** | 实验室 | 模拟环境 | 综合审计、回归测试、CI 集成 |
| **Chrome DevTools Performance** | 实验室 | 真实浏览器 | 火焰图、长任务、布局抖动 |
| **Chrome DevTools Network** | 实验室 | 真实浏览器 | 网络瀑布、资源大小 |
| **Performance API** | 线上 | 真实用户 | 自定义埋点、关键节点 |
| **Web Vitals 库** | 线上 | 真实用户 | LCP/INP/CLS 上报 |
| **Chrome UX Report** | 线上 | 真实用户 | 全网性能基准、CrUX |
| **WebPageTest** | 实验室 | 多地点模拟 | 高级场景、连接类型测试 |

## Lighthouse

Lighthouse 是 Google 开源的性能审计工具，集成在 Chrome DevTools 中，也可以通过 CLI、CI、Node API 使用。它会模拟一个标准环境（默认 4x CPU 节流 + 移动网络），跑一次完整审计，给出 5 个维度的分数：

- **Performance**（性能）
- **Accessibility**（无障碍）
- **Best Practices**（最佳实践）
- **SEO**（搜索引擎优化）
- **PWA**（渐进式 Web 应用）

### 使用方式

```bash
# 命令行
npx lighthouse https://example.com --view

# 输出 HTML 报告
npx lighthouse https://example.com --output html --output-path ./report.html

# 只跑性能审计
npx lighthouse https://example.com --only-categories=performance

# 模拟设备
npx lighthouse https://example.com --emulated-form-factor=desktop
```

### 关键指标

Lighthouse 性能分基于实验室数据，主要参考：

- **LCP**（Largest Contentful Paint）
- **TBT**（Total Blocking Time，实验室版 INP 替代指标）
- **CLS**（Cumulative Layout Shift）
- **FCP**（First Contentful Paint）
- **SI**（Speed Index，速度指数）

每个指标有权重，加权计算 0–100 分。Lighthouse 也会给出"Opportunities"（可优化项）和"Diagnostics"（诊断项），例如：

- 减少阻塞渲染的资源
- 移除未使用的 CSS/JS
- 启用文本压缩
- 图片优化
- 减少第三方代码

### CI 集成

```bash
# 在 CI 中跑 Lighthouse，分数低于阈值则失败
npm install -g lighthouse
lighthouse https://example.com \
  --output=json \
  --output-path=./lh.json \
  --throttling-method=devtools \
  --quiet

# 用脚本断言分数
node -e "
const r = require('./lh.json');
const score = r.categories.performance.score * 100;
if (score < 80) { console.error('Performance score too low:', score); process.exit(1); }
"
```

或使用 `lighthouse-ci`：

```bash
npm install -g @lhci/cli
lhci autorun --collect.url=https://example.com --assert.preset=lighthouse:no-pwa
```

## Chrome DevTools Performance

Performance 面板是定位运行时性能问题最强大的工具，能记录主线程的每一步工作。

### 录制流程

1. 打开 DevTools → Performance 面板
2. 点击 Reload 图标（录制并刷新页面）
3. 等待加载完成
4. 点击 Stop
5. 分析时间轴

### 关键视图

| 视图 | 看什么 |
| --- | --- |
| **Overview** | FPS、CPU、NET 三条曲线，整体趋势 |
| **Flame Chart（火焰图）** | 主线程的调用栈，每个任务宽度=耗时 |
| **Network** | 资源加载瀑布 |
| **Main** | 主线程任务 |
| **Memory** | JS 堆、DOM 节点、事件监听数 |

### 火焰图阅读

火焰图横向是时间，纵向是调用栈（栈越深越下面）：

```
Task
└─ evaluateScript
   └─ parseHTML
   └─ script
      └─ clickHandler        ← 这个长任务 80ms，红色的就是长任务
         └─ computeStyle
         └─ layout             ← 出现 layout 说明可能强制布局
```

**红色三角形**标记的是长任务（>50ms）。它们会阻塞主线程，影响 INP。

### Performance 面板能定位的问题

| 现象 | 可能原因 |
| --- | --- |
| 长 Task 反复出现 | JS 太重，需拆分 |
| 出现紫色 Layout 条 | 强制同步布局 / 布局抖动 |
| 大段绿色 Recalculate Style | 选择器复杂、DOM 大 |
| 大段黄色 Script | JS 执行是瓶颈 |
| 内存曲线单调上升 | 内存泄漏 |

### 节流模拟

在 Performance 面板顶部可以开启 CPU 节流（4x 或 6x）和网络节流，模拟低端设备：

- **CPU 4x slowdown**：模拟中低端手机
- **Slow 3G**：模拟弱网
- **No throttling**：真实性能

## Chrome DevTools Network

Network 面板关注资源加载：

### 关键列

- **Size**：传输大小（含压缩） / 实际大小
- **Time**：总耗时
- **Waterfall**：资源加载时间轴
- **Priority**：浏览器请求优先级

### 常用筛选与诊断

```bash
# 按状态码筛选
status-code:404

# 按域名筛选
domain:cdn.example.com

# 按资源类型
larger-than:100kb
```

### 关闭缓存测真实加载

Network 面板的 "Disable cache" 选项默认会关闭缓存，模拟首次访问。这是测量首屏真实性能的必要设置。

## Performance API

Performance API 是浏览器原生的性能数据接口，包括 Navigation Timing、Resource Timing、User Timing 等多个子 API。它是线上性能监控的基础。

### `performance.timing`（已弃用） vs `performance.timeOrigin`

现代 API 推荐使用 `PerformanceObserver` + `performance.now()`：

```js
// 精确测量代码执行时间
const start = performance.now();
doWork();
const end = performance.now();
console.log(`耗时: ${(end - start).toFixed(2)}ms`);
```

### Navigation Timing API

通过 `PerformanceObserver` 监听 `navigation` 类型，可以拿到页面加载的各阶段时间：

```js
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log({
      dns: entry.domainLookupEnd - entry.domainLookupStart,
      tcp: entry.connectEnd - entry.connectStart,
      ttfb: entry.responseStart - entry.requestStart,
      download: entry.responseEnd - entry.responseStart,
      domReady: entry.domContentLoadedEventEnd - entry.startTime,
      load: entry.loadEventEnd - entry.startTime,
    });
  }
}).observe({ type: 'navigation', buffered: true });
```

各阶段顺序：

```
navigationStart → redirectStart/End → fetchStart
→ domainLookupStart/End → connectStart/End → secureConnectionStart
→ requestStart → responseStart → responseEnd
→ domInteractive → domContentLoadedEventStart/End
→ domComplete → loadEventStart/End
```

### Resource Timing API

获取每个资源（脚本、图片、XHR）的详细计时：

```js
const resources = performance.getEntriesByType('resource');
resources.forEach((r) => {
  console.log(r.name, r.duration, r.transferSize);
});
```

关键字段：

- `transferSize`：实际传输字节数（压缩后）
- `encodedBodySize`：响应体压缩后大小
- `decodedBodySize`：响应体解压后大小
- `duration`：总耗时

### User Timing：自定义埋点

用 `performance.mark()` 和 `performance.measure()` 标记关键节点：

```js
// 标记关键节点
performance.mark('app-init-start');
initApp();
performance.mark('app-init-end');

// 测量区间
performance.measure('app-init', 'app-init-start', 'app-init-end');

// 用 Observer 监听
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.duration);
  }
}).observe({ type: 'measure', buffered: true });
```

### Long Task API

```js
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('长任务:', entry.duration + 'ms', entry.attribution);
  }
}).observe({ type: 'longtask', buffered: true });
```

## Web Vitals 库

Google 官方维护的 `web-vitals` 是上报 Core Web Vitals 最简单的方式：

```bash
npm install web-vitals
```

```js
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

function report(metric) {
  // 用 sendBeacon 上报，页面卸载时也不丢
  navigator.sendBeacon('/api/perf', JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    id: metric.id,
    delta: metric.delta,
    path: location.pathname,
    ts: Date.now(),
  }));
}

onLCP(report);
onINP(report);
onCLS(report);
onFCP(report);
onTTFB(report);
```

### `rating` 字段

每个 metric 都带 `rating`，取值 `'good' | 'needs-improvement' | 'poor'`，便于直接统计：

```js
const bucket = metric.rating === 'good' ? 'good' : 'bad';
```

## 性能埋点与监控

### 埋点设计

线上性能监控通常包含以下维度：

| 维度 | 字段示例 | 说明 |
| --- | --- | --- |
| 指标 | `name=LCP&value=2500` | 哪个指标 |
| 用户 | `userId=12345` | 区分用户 |
| 页面 | `path=/home` | 哪个页面 |
| 环境 | `ua=...&net=4g` | 用户环境 |
| 版本 | `release=v1.2.3` | 应用版本 |
| 时间 | `ts=1690000000000` | 上报时间 |

### 上报方式对比

| 方式 | 时机 | 优点 | 缺点 |
| --- | --- | --- | --- |
| `fetch` / XHR | 即时 | 通用 | 页面卸载时可能丢失 |
| `navigator.sendBeacon` | 卸载时 | 不阻塞卸载，浏览器调度 | 只能 POST，无响应 |
| `<img>` pixel | 即时 | 跨域简单 | 只能 GET，体积有限 |

```js
// sendBeacon 是首选
function report(metric) {
  navigator.sendBeacon('/api/perf', JSON.stringify(metric));
}

// visibilitychange 是最后机会
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    navigator.sendBeacon('/api/perf/batch', JSON.stringify(queue));
    queue = [];
  }
});
```

### 采样与分位数

线上性能数据量大，关键看 **P75 分位**：

- Core Web Vitals 官方以 P75 作为"达标率"门槛
- 监控大屏通常展示：P50（中位）、P75（达标线）、P95（长尾）

```js
function percentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil(sorted.length * p) - 1;
  return sorted[idx];
}
```

### 错误归因

光有指标值还不够，还要能定位"为什么慢"。常见做法是附带上下文：

- LCP 元素类型（`<img>` / `<h1>` / `<div>`）
- LCP 元素的 URL（图片地址）
- 是否首屏有长任务
- 资源加载耗时
- 用户网络类型（`navigator.connection.effectiveType`）

```js
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.startTime > 0) {
      report({
        name: 'LCP',
        value: entry.startTime,
        element: entry.element?.tagName,
        url: entry.url,
        size: entry.size,
      });
    }
  }
}).observe({ type: 'largest-contentful-paint', buffered: true });
```

## 性能监控平台

业内常见的方案：

| 方案 | 类型 | 特点 |
| --- | --- | --- |
| **Google Analytics 4** | 通用 | 含部分性能事件 |
| **Chrome UX Report** | 公开数据 | BigQuery 查询全网性能 |
| **Sentry Performance** | 商用 | 错误 + 性能一体 |
| **Datadog RUM** | 商用 | 完整 APM |
| **阿里 ARMS / 腾讯 RUM** | 商用 | 国内 CDN 加速 |
| **自研** | — | 灵活，但需投入 |

## 实验室 vs 真实用户数据

```
                  ┌─ Lighthouse / WebPageTest
实验室数据 ──────┤                            └─ 回归测试、本地调试
                  └─ Chrome DevTools
                              │
                              ↓ 上线
真实用户数据 ──── Performance API + Web Vitals ── 线上监控
```

| 维度 | 实验室 | 真实用户 |
| --- | --- | --- |
| 复现性 | 高 | 低 |
| 真实性 | 低 | 高 |
| 长尾 | 不可见 | 可见 |
| 调试 | 容易 | 难 |
| 用途 | 优化方案验证 | 线上趋势监控 |

**实践建议**：开发阶段用 Lighthouse 做回归保护，上线后用 RUM 做长期监控，二者结合。

## 性能预算与回归

性能预算的核心是"指标上限"，超出则在 CI 阻止合入：

```yaml
# .github/workflows/lighthouse.yml
- name: Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun \
      --collect.url=https://staging.example.com \
      --assert.assertions.performance=0.85 \
      --assert.assertions.largest-contentful-paint=2500 \
      --assert.assertions.cumulative-layout-shift=0.1
```

也可以在 bundle 层面设定体积上限：

```js
// bundlesize 配置
{
  "files": [
    { "path": "dist/app.*.js", "maxSize": "170 kB" },
    { "path": "dist/style.*.css", "maxSize": "30 kB" }
  ]
}
```

## 小结

| 工具 | 用途 | 何时用 |
| --- | --- | --- |
| Lighthouse | 综合审计 + CI 回归 | 开发阶段 |
| DevTools Performance | 火焰图、长任务 | 调试运行时 |
| DevTools Network | 网络瀑布 | 调试加载 |
| Performance API | 自定义埋点 | 线上 |
| web-vitals | Core Web Vitals 上报 | 线上 |
| Heap Snapshot | 内存排查 | 调试内存 |

**面试要点**：能讲清"实验室数据与真实用户数据的区别"、能给出 `web-vitals` + `sendBeacon` 的上报代码、能描述用 Heap Snapshot 对比法排查内存、能解释为什么 P75 是关键分位（CWV 官方排名依据），是性能监控题的标准答案。进阶则能讲清性能预算在 CI 中的落地方案。
