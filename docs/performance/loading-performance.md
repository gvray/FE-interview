---
sidebar_position: 4
---

# 加载性能

加载性能关注的是**从用户发起访问到页面可用**这段时间的优化，是首屏体验的核心。在面试中，加载性能题通常会考察你是否理解关键渲染路径、会不会用代码分割与懒加载、能否解释 preload 与 prefetch 的区别。本章系统梳理这些知识。

## 关键渲染路径（Critical Rendering Path）

关键渲染路径指的是浏览器**首次渲染页面所必须经历**的资源加载与处理流程。理解它，才知道哪些资源会阻塞首屏。

### 阻塞渲染的资源

| 资源 | 是否阻塞渲染 | 是否阻塞解析 | 说明 |
| --- | --- | --- | --- |
| CSS `<link>` | ✅ 阻塞 | ❌ 不阻塞解析，但阻塞渲染 | 必须等 CSS 加载完才会渲染 |
| JS `<script>` | ❌ | ✅ 阻塞 HTML 解析 | 默认同步阻塞 |
| JS `<script async>` | ❌ | ❌ 不阻塞 | 异步下载，下载完立即执行 |
| JS `<script defer>` | ❌ | ❌ 不阻塞 | 异步下载，HTML 解析完按顺序执行 |
| `<img>` | ❌ | ❌ | 不阻塞，但影响 LCP |
| 字体 | ✅ 阻塞文字 | ❌ | 默认 FOIT，最长 3s |

```html
<!-- 经典优化：CSS 放头部，JS 放尾部 + defer -->
<head>
  <link rel="stylesheet" href="/critical.css">
  <link rel="preload" as="style" href="/non-critical.css" onload="this.rel='stylesheet'">
</head>
<body>
  <!-- ... -->
  <script src="/app.js" defer></script>
</body>
```

### `async` vs `defer`

| 属性 | 下载时机 | 执行时机 | 执行顺序 | 适用场景 |
| --- | --- | --- | --- | --- |
| 无 | 遇到即下载 | 下载完立即执行，阻塞解析 | — | 同步脚本 |
| `async` | 并行下载 | 下载完立即执行，阻塞 | 不保证顺序 | 独立第三方脚本（统计、广告） |
| `defer` | 并行下载 | HTML 解析完、`DOMContentLoaded` 前执行 | 按顺序 | 应用主 JS bundle |

### 关键路径长度

关键路径长度 = 关键资源数 + 关键资源的最大往返次数。优化目标：

- **减少关键资源数**：合并 CSS、内联关键 CSS
- **缩短关键资源体积**：压缩、tree shaking
- **缩短传输时间**：CDN、HTTP/2、压缩传输

## 代码分割（Code Splitting）

把所有 JS 打到一个 bundle 里，首屏就会等待整个 bundle 加载完。代码分割按需加载，只加载首屏需要的代码。

### 路由级分割

在 SPA 中最常见，按路由拆分：

```js
// React 中使用 React.lazy
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));

function App() {
  return (
    <React.Suspense fallback={<div>加载中...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </React.Suspense>
  );
}
```

```js
// Vue 中使用动态 import
const routes = [
  { path: '/', component: () => import('./pages/Home.vue') },
  { path: '/about', component: () => import('./pages/About.vue') },
];
```

### 组件级分割

大组件（如富文本编辑器、图表）按需加载：

```js
const Editor = React.lazy(() => import('./Editor'));

function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>打开编辑器</button>
      {show && (
        <React.Suspense fallback={<Spinner />}>
          <Editor />
        </React.Suspense>
      )}
    </>
  );
}
```

### Magic Comments 命名 chunk

```js
import(
  /* webpackChunkName: "editor" */
  /* webpackPrefetch: true */
  './Editor'
);
```

### 配置层面的分割

Webpack 默认配置：

```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',           // 同步 + 异步都分割
      minSize: 20000,
      maxSize: 244000,         // 超过 244KB 进一步拆分
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: 'single',    // 把 runtime 单独抽离，避免修改业务代码导致 vendor 缓存失效
  },
};
```

## 懒加载（Lazy Loading）

懒加载指**资源在需要时才加载**，而不是一次性全部加载。常用于图片、组件、模块。

### 图片懒加载

```html
<!-- 原生 loading="lazy"，现代浏览器支持 -->
<img src="cover.jpg" loading="lazy" width="800" height="600" alt="...">
```

```js
// 使用 IntersectionObserver 兼容老浏览器
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach((img) => observer.observe(img));
```

### 组件懒加载

```js
// React 中的模态框懒加载
const Modal = React.lazy(() => import('./Modal'));

function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>打开</button>
      {open && (
        <Suspense fallback={null}>
          <Modal onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
```

### 动态 import

```js
// 用户点击按钮时才加载并执行模块
button.addEventListener('click', async () => {
  const module = await import('./heavy-module');
  module.doSomething();
});
```

## 预加载：preload / prefetch / preconnect / dns-prefetch

这是面试高频考点，必须能区分清楚。

| 指令 | 作用 | 时机 | 适用资源 |
| --- | --- | --- | --- |
| `preload` | 强制浏览器**立即**加载当前页面需要的资源 | 当前页高优先级 | 关键字体、LCP 图片、关键 CSS/JS |
| `prefetch` | 空闲时**预取**下一页可能用到的资源 | 空闲低优先级 | 下一页的 chunk、图片 |
| `preconnect` | 提前完成 DNS/TCP/TLS 连接 | 立即 | 第三方域名 |
| `dns-prefetch` | 只做 DNS 解析 | 立即 | 第三方域名（轻量） |
| `modulepreload` | 预加载 ES 模块及其依赖 | 立即 | ES Module |

```html
<!-- preload：声明当前页关键资源的高优先级 -->
<link rel="preload" as="font" href="/font.woff2" type="font/woff2" crossorigin>
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">
<link rel="preload" as="script" href="/critical.js">

<!-- prefetch：声明未来页面的资源，低优先级 -->
<link rel="prefetch" as="script" href="/next-page.js">

<!-- preconnect：提前建立连接 -->
<link rel="preconnect" href="https://cdn.example.com" crossorigin>
<link rel="dns-prefetch" href="https://stats.example.com">
```

### preload 与 prefetch 的差异

| 维度 | preload | prefetch |
| --- | --- | --- |
| 优先级 | 高（与同 as 类型同优先级） | 低（空闲时获取） |
| 用途 | 当前页关键资源 | 未来页资源 |
| 缓存 | 必须被当前页使用，否则浪费 | 进入 HTTP 缓存，供后续页面使用 |
| CORS | 字体、跨域资源需要 `crossorigin` | 一般无 |

### 谨慎使用 preload

`preload` 是双刃剑：用对了加速首屏，用错了会与首屏关键资源抢带宽。原则：

- **只 preload 真正影响 LCP 的资源**
- **必须指定 `as`**，否则浏览器不知道如何排优先级
- **字体必须加 `crossorigin`**，否则加载两次

### 基于"路由预取"的策略

在用户即将进入下一页时提前 prefetch：

```js
// 鼠标 hover 在链接上时预取
link.addEventListener('mouseenter', () => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = '/next-page.js';
  document.head.appendChild(link);
});

// 或使用 Quicklink、Guess.js 等库
```

## Tree Shaking

Tree Shaking 是指**打包时移除未使用的代码**，依赖 ES Module 的静态结构。

### 工作原理

ES Module 是静态的，import/export 必须在顶层、是字符串字面量，打包器可以在编译时分析出哪些导出被使用：

```js
// math.js
export function add(a, b) { return a + b; }
export function sub(a, b) { return a + b; }  // 这个未使用

// app.js
import { add } from './math.js';
add(1, 2);
```

打包后 `sub` 会被移除。CommonJS 的 `require` 是动态的，无法 tree shake。

### 让 Tree Shaking 生效的条件

1. **使用 ESM**：`import` / `export`，不要用 `require`
2. **package.json 标记 sideEffects**：
   ```json
   {
     "name": "my-lib",
     "sideEffects": false
   }
   ```
   或精确指定：
   ```json
   {
     "sideEffects": ["./src/polyfills.js", "*.css"]
   }
   ```
3. **避免整模块导入**：
   ```js
   // 不好：导入整个 lodash，无法 tree shake（旧版本）
   import _ from 'lodash';
   _.get(obj, 'a.b');

   // 好：按需导入
   import get from 'lodash/get';
   // 或
   import { get } from 'lodash-es';  // ESM 版本
   ```

### 验证 Tree Shaking 效果

```bash
# Webpack 分析
webpack --json --profile > stats.json
# 用 webpack-bundle-analyzer 可视化
```

## 资源压缩

### 文本压缩

- **Gzip**：通用、兼容性最好，压缩率约 70%
- **Brotli**：压缩率比 Gzip 高 15–25%，现代浏览器都支持
- 服务端开启即可，Nginx 配置示例：

```nginx
gzip on;
gzip_types text/plain application/javascript text/css application/json;
gzip_min_length 1024;

# Brotli（需要 brotli 模块）
brotli on;
brotli_types text/plain application/javascript text/css application/json;
brotli_comp_level 6;
```

### JS/CSS 代码压缩

- **Terser**：JS 压缩、变量名混淆
- **cssnano** / **lightningcss**：CSS 压缩
- **SWC** / **esbuild**：新一代构建工具内置压缩，速度更快

```js
// Webpack 配置
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      parallel: true,
      terserOptions: { compress: { drop_console: true } },
    })],
  },
};
```

## 图片优化

图片往往是页面体积的大头，优化收益最大。

### 格式选择

| 格式 | 优点 | 缺点 | 适用 |
| --- | --- | --- | --- |
| JPEG | 兼容性好、色彩丰富 | 不支持透明 | 照片 |
| PNG | 无损、支持透明 | 体积大 | 图标、需要透明的图 |
| WebP | 比 JPEG 小 25–35%、支持透明 | 老浏览器不支持 | 通用替代 |
| AVIF | 比 WebP 还小 50% | 编码慢、兼容性较差 | 现代项目 |
| SVG | 矢量、可缩放 | 不适合复杂图片 | 图标、图形 |

```html
<!-- 使用 picture 标签提供多种格式，浏览器按优先级选择 -->
<picture>
  <source srcset="/hero.avif" type="image/avif">
  <source srcset="/hero.webp" type="image/webp">
  <img src="/hero.jpg" width="800" height="600" alt="hero">
</picture>
```

### 响应式图片

根据屏幕尺寸加载不同大小的图片：

```html
<img
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 480px, (max-width: 1200px) 800px, 1200px"
  src="medium.jpg"
  alt="responsive">
```

### 图片懒加载 + 占位

- `loading="lazy"` 原生懒加载
- 低质量占位图（LQIP）：先显示模糊小图，加载完替换
- BlurHash：用几十字节编码图片，前端解码出模糊预览

### CDN 图片处理

使用 CDN 实时裁剪、转格式、压缩：

```html
<img src="https://cdn.example.com/photo.jpg?w=800&h=600&q=75&format=webp">
```

## Service Worker 缓存

PWA 通过 Service Worker 离线缓存资源，二次访问时几乎瞬时加载：

```js
// sw.js
const CACHE = 'app-v1';
const ASSETS = ['/', '/app.js', '/style.css', '/offline.html'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
```

## 关键 CSS 内联

把首屏需要的关键 CSS 内联到 `<head>`，避免阻塞渲染的额外请求：

```html
<head>
  <style>
    /* 关键 CSS：首屏可见元素的样式 */
    body { margin: 0; font-family: sans-serif; }
    .header { background: #1f2937; color: #fff; padding: 16px; }
    /* ... */
  </style>
  <link rel="preload" as="style" href="/full.css" onload="this.rel='stylesheet'">
</head>
```

可使用 `critical`、`critters` 等工具自动抽取。

## 优化检查清单

| 项目 | 检查点 |
| --- | --- |
| HTML | CSS 在头部、JS 在尾部、`defer`/`async` |
| JS | 路由级 + 组件级代码分割、tree shaking、按需 import |
| CSS | 关键 CSS 内联、非关键 CSS 异步加载 |
| 图片 | WebP/AVIF、`loading="lazy"`、响应式 `srcset` |
| 字体 | `preload`、`font-display: swap`、子集化 |
| 资源 | preload LCP 资源、preconnect 第三方域名 |
| 传输 | Gzip/Brotli、HTTP/2、CDN |
| 缓存 | 静态资源带 hash、长 `max-age`、Service Worker |

## 小结

加载性能优化遵循三个层次：

1. **减少首屏资源体积**：tree shaking、代码分割、按需加载
2. **加速首屏资源到达**：CDN、HTTP/2、preload、压缩
3. **优化关键渲染路径**：CSS 在头、JS 在尾、关键 CSS 内联、字体优化

**面试要点**：能讲清关键渲染路径与阻塞关系、能区分 preload/prefetch/preconnect、能给出路由级与组件级代码分割的代码示例、能说出图片优化与字体优化的具体手段，就覆盖了加载性能的核心考察点。
