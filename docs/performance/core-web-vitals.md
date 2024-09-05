---
sidebar_position: 2
---

# 性能指标与 Core Web Vitals

> "你无法优化你没有度量过的东西。" —— 性能优化的第一原则是建立度量体系。

在前端面试中，被问到"你们项目性能怎么样"时，如果只能回答"还行、挺快的"，几乎等于没有回答。一个成熟的性能体系，需要从**加载、交互、视觉稳定**三个维度用具体指标来量化。Google 在 2020 年正式推出 **Core Web Vitals（核心网页指标）**，作为搜索排名的信号之一，也成为了业界事实标准。

## 为什么要用指标

性能是一个多维度的概念，"快"可以指：

- **加载快**：首屏内容尽快出现
- **可交互快**：页面尽快能响应用户输入
- **视觉稳定**：内容出现时不会跳动、错位
- **流畅**：滚动、动画不卡顿

不同维度需要不同的指标来衡量。只看 `onload` 时间是远远不够的——它既不代表用户看到内容的时间，也不代表可以交互的时间。

## 关键性能指标总览

| 指标 | 全称 | 含义 | 良好 | 需改进 | 差 |
| --- | --- | --- | --- | --- | --- |
| **TTFB** | Time to First Byte | 首字节时间，从请求到收到第一字节 | &lt; 0.8s | 0.8–1.8s | > 1.8s |
| **FCP** | First Contentful Paint | 首次内容绘制，首次出现文本/图片 | &lt; 1.8s | 1.8–3.0s | > 3.0s |
| **LCP** | Largest Contentful Paint | 最大内容绘制 | &lt; 2.5s | 2.5–4.0s | > 4.0s |
| **FID** | First Input Delay | 首次输入延迟（已废弃） | &lt; 100ms | 100–300ms | > 300ms |
| **INP** | Interaction to Next Paint | 交互到下一次绘制 | &lt; 200ms | 200–500ms | > 500ms |
| **CLS** | Cumulative Layout Shift | 累积布局偏移 | &lt; 0.1 | 0.1–0.25 | > 0.25 |
| **TBT** | Total Blocking Time | 总阻塞时间（实验室） | &lt; 200ms | 200–600ms | > 600ms |

> **注意**：2024 年 3 月起，**INP 正式取代 FID** 成为 Core Web Vitals 的一员。FID 只衡量第一次交互的延迟，而 INP 衡量整个页面生命周期内所有交互的响应速度，更能反映真实体验。

## TTFB：首字节时间

TTFB 是从用户发起请求到浏览器收到第一个字节响应的时间。它反映了网络往返与服务器处理速度。

**TTFB 的构成：**

```
TTFB = 重定向时间 + DNS 查询 + TCP 握手 + TLS 协商 + 请求发送 + 服务器处理 + 响应传输首字节
```

**优化方向：**

- 使用 CDN，将静态资源缓存到离用户最近的边缘节点
- 启用 HTTP/2 或 HTTP/3，减少连接建立开销
- 服务端开启缓存（Redis、页面缓存），降低 SSR 计算耗时
- 避免过多的重定向（`301`/`302` 链）
- 使用 `<link rel="preconnect">` 提前建立第三方域名连接

```html
<!-- 提前与关键第三方建立连接 -->
<link rel="preconnect" href="https://cdn.example.com">
<link rel="preconnect" href="https://api.example.com" crossorigin>
```

## FCP：首次内容绘制

FCP 衡量的是浏览器首次渲染任何**文本、图片、SVG 或非白色 canvas** 的时间点。它回答的是"用户什么时候开始看到内容"。

**注意**：白色背景或加载动画不算 FCP，必须是真实内容。

**优化方向：**

- 内联关键 CSS（critical CSS），避免阻塞渲染的外链样式表
- 减少首屏 JS 体积，避免主线程被长任务占用
- 使用字体预加载，避免 FOIT（Flash of Invisible Text）
- 服务端渲染（SSR）或静态生成（SSG），让浏览器直接拿到可绘制 HTML

## LCP：最大内容绘制

LCP 是 Core Web Vitals 三大核心指标之一，衡量的是**视口内最大可见元素**的渲染完成时间。它取代了旧版"首屏渲染时间"的概念，更贴近用户感知。

**LCP 关注的元素类型通常包括：**

- `<img>` 元素
- `<image>` 在 SVG 内
- `<video>` 的封面图
- 背景图（`background-image`，仅当包含 URL）
- 包含文本节点的块级元素（如 `<h1>`、`<p>`、`<div>`）

**LCP 的四个子阶段：**

```
TTFB → 资源加载开始 → 资源加载结束 → 元素渲染完成
```

任何一个阶段慢都会拖慢 LCP。常见的 LCP 瓶颈与对应优化：

| 瓶颈 | 现象 | 优化方案 |
| --- | --- | --- |
| 服务端响应慢 | TTFB 高 | CDN、SSR 缓存、边缘计算 |
| 关键资源阻塞 | LCP 元素等待 JS/CSS | 内联关键 CSS、`preload` LCP 资源 |
| LCP 图片加载慢 | 大图未优化 | 压缩、WebP/AVIF、`fetchpriority="high"` |
| 字体阻塞渲染 | 文字长时间不出现 | `font-display: swap`、字体预加载 |
| 客户端渲染 | JS 阻塞首屏 | SSR / SSG、骨架屏 |

```html
<!-- 为 LCP 图片设置高优先级 -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">

<!-- 字体预加载 + swap -->
<link rel="preload" as="font" href="/font.woff2" type="font/woff2" crossorigin>
<style>
  @font-face {
    font-family: 'Custom';
    src: url('/font.woff2') format('woff2');
    font-display: swap;
  }
</style>
```

## INP：交互到下一次绘制

INP 是 2024 年替代 FID 的新核心指标，衡量用户交互（点击、按键、鼠标悬停等）到屏幕**下一次绘制**的延迟。它取整个会话中所有交互的"最差"或"接近最差"值，比 FID 严格得多。

**INP 与 FID 的差异：**

- FID 只测量**第一次**交互的输入延迟
- INP 测量**所有**交互，且包含输入延迟 + 处理时间 + 展示时间
- INP 默认报告所有交互中的 P98（98 分位）值

**INP 慢的常见原因：**

1. **长任务（Long Task > 50ms）**：主线程被同步 JS 占用，无法及时响应输入
2. **大量同步布局**：在事件回调里读取 `offsetTop`、`getBoundingClientRect` 等触发布局抖动
3. **第三方脚本**：广告、分析脚本抢占主线程
4. **过大的事件回调**：单次点击做太多工作

**优化方向：**

- 将长任务拆分，使用 `scheduler.yield()` 或 `setTimeout` 让出主线程
- 把非关键工作放到 `requestIdleCallback` 或 Web Worker
- 避免在交互回调里强制同步布局（forced synchronous layout）
- 使用 `content-visibility: auto` 跳过屏幕外内容的渲染

```js
// 把长任务拆分，让出主线程响应用户输入
async function processItems(items) {
  for (const item of items) {
    handle(item);
    // 每处理一项就让出一次主线程
    if (navigator.scheduling?.isInputPending()) {
      await scheduler.yield();
    }
  }
}
```

## CLS：累积布局偏移

CLS 衡量的是页面生命周期内**视觉元素的意外移动**。它不关心"主动"的动画，只关心"被动"的、用户没有预期的布局变化。

**CLS 的计算：**

```
布局偏移分数 = 影响比例 × 距离比例
```

其中影响比例 = 不稳定元素占用视口的面积比例，距离比例 = 元素移动的最大距离 / 视口尺寸。

**常见 CLS 来源与解决：**

| 来源 | 解决方案 |
| --- | --- |
| 图片没有尺寸 | 给所有 `<img>`、`<video>` 设置 `width` 和 `height` |
| 字体加载导致文字跳动 | 使用 `font-display: swap` + 字体度量匹配 |
| 动态插入广告/横幅 | 预留占位空间（占位 div、`min-height`） |
| 异步注入内容 | 在已有容器内更新，不要 push 下方内容 |
| 动画使用非合成属性 | 改用 `transform`、`opacity` |

```html
<!-- 给图片明确尺寸，浏览器可提前计算布局 -->
<img src="/cover.webp" width="800" height="600" alt="cover">
```

```css
/* 用 aspect-ratio 为响应式图片预留空间 */
.card-cover {
  width: 100%;
  aspect-ratio: 4 / 3;
}
```

## 实验室数据 vs 真实用户数据

性能指标有两种测量来源，理解二者的差异非常重要：

| 类型 | 数据来源 | 工具 | 特点 |
| --- | --- | --- | --- |
| 实验室数据（Lab） | 模拟环境 | Lighthouse、WebPageTest | 可复现、可调试、但可能与真实用户不符 |
| 真实用户数据（Field / RUM） | 真实用户浏览器 | Chrome UX Report、Performance API | 真实分布、含长尾，但难复现 |

**实践建议：**

- 开发阶段用 Lighthouse 做回归测试，确保指标不退化
- 线上用 Performance API 收集 RUM 数据，关注 P75 分位
- Core Web Vitals 的官方排名以**真实用户 P75 数据**为准（来自 Chrome UX Report）

## 如何测量 Core Web Vitals

### 使用 web-vitals 库

Google 官方提供的 `web-vitals` 库可以方便地收集所有核心指标：

```bash
npm install web-vitals
```

```js
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, rating, id }) {
  // 使用 sendBeacon 上报，避免页面卸载时丢数据
  navigator.sendBeacon('/api/perf', JSON.stringify({
    name,
    value,
    rating,        // 'good' | 'needs-improvement' | 'poor'
    id,
    page: location.pathname,
    ts: Date.now(),
  }));
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

### 使用 PerformanceObserver

如果不想引入库，可以直接用 PerformanceObserver：

```js
// 监听 LCP
let lastLCP = 0;
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  lastLCP = entries[entries.length - 1].startTime;
}).observe({ type: 'largest-contentful-paint', buffered: true });

// 监听布局偏移
let cls = 0;
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (!entry.hadRecentInput) {
      cls += entry.value;
    }
  }
}).observe({ type: 'layout-shift', buffered: true });
```

## 性能预算

光有指标还不够，还要建立**性能预算**（Performance Budget）——为每个指标设定上限，超过则阻止合入或报警：

```json
{
  "budgets": [
    {
      "resourceSizes": {
        "script": 170,
        "stylesheet": 50,
        "image": 500
      },
      "resourceCounts": {
        "third-party": 5
      },
      "timings": {
        "first-contentful-paint": 2000,
        "largest-contentful-paint": 2500,
        "interactive": 3500
      }
    }
  ]
}
```

配合 CI 集成 Lighthouse，可以在每次 PR 时自动跑一次性能审计，防止性能回退。

## 小结

| 指标 | 维度 | 关键阈值（good） | 核心优化方向 |
| --- | --- | --- | --- |
| TTFB | 网络/服务端 | &lt; 0.8s | CDN、SSR 缓存、HTTP/2 |
| FCP | 加载 | &lt; 1.8s | 关键 CSS 内联、减少阻塞 JS |
| LCP | 加载（核心） | &lt; 2.5s | LCP 资源 preload、SSR、图片优化 |
| INP | 交互（核心） | &lt; 200ms | 拆长任务、避免布局抖动、Web Worker |
| CLS | 视觉稳定（核心） | &lt; 0.1 | 图片尺寸、字体 swap、预留空间 |
| TBT | 长任务（实验室） | &lt; 200ms | 减少主线程阻塞 |

**面试要点**：能准确说出五大指标的含义与达标值，并能针对每个指标说出 2–3 条具体优化手段，是回答性能题的基本盘。更进一步，能结合自己项目讲出"我用 web-vitals 上报了 RUM，发现 P75 的 INP 是 320ms，定位到是某段同步循环导致长任务，拆分后降到 150ms"这样的闭环故事，就是高级工程师的水平。
