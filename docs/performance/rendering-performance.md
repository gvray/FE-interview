---
sidebar_position: 3
---

# 渲染性能

渲染性能关注的是浏览器从 HTML/CSS/JS 到屏幕像素的整个过程。理解这条流水线，才能解释"为什么动画会卡""为什么滚动不流畅""为什么操作 DOM 慢"。这是中高级前端面试的高频考点，特别是 React/Vue 这种组件化框架普及后，理解底层渲染机制对优化尤为关键。

## 浏览器渲染流水线

从接收 HTML 到绘制像素，浏览器大致经历以下阶段：

```
HTML → DOM → Style → Layout → Paint → Composite → 像素
        树构建   样式计算  布局计算   绘制   合成
```

每个阶段的职责：

| 阶段 | 输入 | 输出 | 说明 |
| --- | --- | --- | --- |
| **DOM** | HTML 字符串 | DOM 树 | 解析标签构建节点树 |
| **Style** | DOM + CSS |ComputedStyle | 计算每个元素的最终样式 |
| **Layout** | DOM + ComputedStyle | 布局树 | 计算几何信息（位置、大小） |
| **Paint** | 布局树 | 绘制指令列表 | 生成绘制顺序、填充文字图片等 |
| **Composite** | 绘制指令 | 图层 | 将各图层合成最终画面 |

> **关键**：JS、Style、Layout、Paint、Composite 这五个阶段中，**只有 Composite 一定在合成线程上执行**，其他都可能阻塞主线程。所以优化的核心思路之一就是**让更多工作跳过前三步，直接走合成**。

## 重排（Reflow）与重绘（Repaint）

### 什么是重排

当修改影响**几何信息**的属性时，浏览器需要重新计算布局，这个过程称为**重排**（layout reflow）。

会触发重排的属性（部分）：

- 盒模型：`width`、`height`、`margin`、`padding`、`border`
- 位置：`top`、`left`、`right`、`bottom`、`float`、`position`
- 文本：`font-size`、`text-align`、`line-height`、`white-space`
- 显隐：`display`
- 内容：`innerHTML`、`appendChild`、`removeChild`

### 什么是重绘

当修改**视觉**属性但不影响几何信息时，只需重新绘制，称为**重绘**。

会触发重绘的属性（部分）：

- 颜色：`color`、`background-color`、`border-color`
- 阴影：`box-shadow`、`text-shadow`
- 可见性：`visibility`、`outline`

### 重排与重绘的关系

**重排必然导致重绘，重绘不一定导致重排**。重排的开销远大于重绘。

```
重排 → 重新 Layout → 重新 Paint → 重新 Composite
重绘 → 直接 Paint → 重新 Composite
合成 → 直接 Composite
```

### 只触发合成的属性

修改以下属性**不**会触发重排和重绘，只触发合成，性能最好：

- `transform`：`translate`、`scale`、`rotate`
- `opacity`
- `filter`
- `will-change`（提示而非直接触发）

```css
/* 推荐：用 transform 做位移，不走 Layout/Paint */
.move {
  transition: transform 0.3s;
  transform: translateX(100px);
}

/* 避免：用 left/top 触发重排 */
.bad {
  transition: left 0.3s;
  left: 100px;
}
```

## 布局抖动（Layout Thrashing）

布局抖动是**强制同步布局**（Forced Synchronous Layout）的连续触发，是常见的性能反模式。

### 触发原理

当你在修改 DOM 后立刻**读取**几何属性，浏览器为了给你最新的值，必须立即执行一次同步布局计算：

```js
// 反模式：在循环中读写交替，每次读都会触发同步布局
const boxes = document.querySelectorAll('.box');
for (let i = 0; i < boxes.length; i++) {
  boxes[i].style.width = box.offsetWidth + 10 + 'px';  // 写
  console.log(box.offsetHeight);                       // 读 → 强制同步布局
}
```

### 规避方法：读写分离

把所有"读"操作集中起来，先读后写：

```js
const boxes = document.querySelectorAll('.box');
// 先读取所有需要的几何信息
const widths = Array.from(boxes, el => el.offsetWidth);

// 再批量写入，避免读写交替
boxes.forEach((el, i) => {
  el.style.width = widths[i] + 10 + 'px';
});
```

使用 `FastDOM` 库或类似的 API 设计，本质就是把读写阶段分离。

### 哪些 API 会触发同步布局

常见的"读"操作会触发同步布局：

- `offsetTop` / `offsetLeft` / `offsetWidth` / `offsetHeight`
- `scrollTop` / `scrollLeft` / `scrollWidth` / `scrollHeight`
- `clientTop` / `clientWidth` / `clientHeight`
- `getComputedStyle()`
- `getBoundingClientRect()`
- `window.scrollTo()` 之后立刻读取 `scrollY`

> **注意**：使用 `ResizeObserver` 监听尺寸变化，比直接轮询 `offsetWidth` 性能更好。

## requestAnimationFrame

`requestAnimationFrame`（rAF）是浏览器专门为视觉动画设计的回调队列，它保证回调在**每次重绘之前**执行，且与显示器刷新率同步（通常 60fps，即约 16.7ms 一次）。

### 为什么用 rAF 而不是 setTimeout

| 特性 | `setTimeout` | `requestAnimationFrame` |
| --- | --- | --- |
| 触发时机 | 由延迟决定，可能错过帧 | 与浏览器刷新同步 |
| 后台标签页 | 仍会执行（节流后约 1s） | 暂停执行，节省电量 |
| 丢帧 | 容易出现 | 浏览器会合并到下一帧 |

### 基本用法

```js
function animate() {
  // 更新动画状态
  element.style.transform = `translateX(${x}px)`;
  if (running) {
    requestAnimationFrame(animate);
  }
}
requestAnimationFrame(animate);
```

### 取消动画

```js
const id = requestAnimationFrame(animate);
// 取消
cancelAnimationFrame(id);
```

> **常见坑**：在 React 中使用 rAF 一定要在 `useEffect` 的清理函数里 `cancelAnimationFrame`，否则组件卸载后回调仍会执行，可能引发报错或内存泄漏。

## 虚拟列表

当渲染成千上万条数据时，一次性渲染全部 DOM 会让浏览器卡死几秒。虚拟列表（Virtual List）只渲染**可见区域**的少量节点，配合滚动事件动态替换数据，实现"无限滚动"的体验。

### 原理

```
┌────────────────┐
│  不可见（不渲染） │
├────────────────┤
│  可见区域       │  ← 只渲染这部分 DOM（通常 + 上下若干缓冲项）
├────────────────┤
│  不可见（不渲染） │
└────────────────┘
```

通过监听 `scroll` 事件（或 `IntersectionObserver`）计算 `startIndex` 和 `endIndex`，仅渲染这部分项，并通过 `transform` 调整容器偏移。

### 简易实现

```js
function VirtualList({ items, itemHeight, visibleHeight }) {
  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(visibleHeight / itemHeight) + 4,  // 4 个缓冲项
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div style={{ height: visibleHeight, overflowY: 'auto' }} onScroll={onScroll}>
      {/* 总高度撑开，保证滚动条正确 */}
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, i) => (
          <div
            key={startIndex + i}
            style={{ position: 'absolute', top: (startIndex + i) * itemHeight, height: itemHeight }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 注意事项

- **滚动事件用 rAF 节流**：直接 `setState` 仍可能卡，配合 rAF 更顺
- **使用 `transform` 而非 `top`** 偏移，避免触发重排
- **`content-visibility: auto`** 可作为现代浏览器的低代码替代方案：
  ```css
  .row { content-visibility: auto; contain-intrinsic-size: 60px; }
  ```
- React 中推荐使用 `react-window` 或 `react-virtualized`

## 合成层（Compositing Layer）

浏览器将页面拆分为多个**图层**，分别绘制后由合成器合并。某些条件下，元素会被提升为独立的合成层（Compositing Layer），享受独立的 GPU 缓存，更新时只影响自身，不拖累其他层。

### 提升为合成层的常见条件

- 3D 变换：`transform: translateZ(0)` / `translate3d`
- `opacity` 小于 1 的动画
- `position: fixed` + 滚动
- `<video>`、`<canvas>`、WebGL
- CSS `filter`、`backdrop-filter`
- 显式声明 `will-change: transform` 等

### 提升合成层的好处

1. **动画走 GPU**：`transform`、`opacity` 动画由合成器处理，不阻塞主线程
2. **已绘制内容缓存**：重绘时只需更新变化层
3. **避免重排**：调整合成层属性不影响其他层布局

### 滥用合成层的风险

每个合成层都会占用内存和 GPU 资源。如果页面里有上千个元素都被显式提升，反而会导致：

- 内存暴涨（每个层有独立纹理）
- GPU 合成开销大
- 部分设备黑屏或闪烁

> **原则**：只对真正需要做动画或频繁更新的元素提升合成层，不要无脑 `translateZ(0)`。

## will-change

`will-change` 是一个**提示**，告诉浏览器某个元素即将发生变化，让浏览器提前优化（通常是提升为合成层）。

```css
.animated-element {
  will-change: transform, opacity;
}
```

### 使用注意

- **不要常驻**：动画结束后应移除 `will-change`，否则会持续占用资源
- **不要过度使用**：给整个页面所有元素都加上会适得其反
- **优先用其他手段**：能用 `transform` 解决就不要依赖 `will-change`

```js
// 在动画开始前加，结束后移除
el.style.willChange = 'transform';
el.addEventListener('transitionend', () => {
  el.style.willChange = 'auto';
});
```

## 常见渲染优化手段汇总

### 1. 用 CSS 动画代替 JS 动画

CSS 动画可以在合成线程运行，不阻塞主线程：

```css
/* 好：合成层动画 */
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 2. 避免大面积重绘

- 减少 `box-shadow` 在大元素上的动画（开销大）
- 用 `transform: scale` 替代 `width/height` 动画

### 3. 使用 `contain` 隔离重排

```css
.widget {
  contain: layout style paint;
}
```

`contain` 告诉浏览器这个元素及其子元素独立于外部文档，可以限制重排范围。

### 4. 减少选择器复杂度

```css
/* 慢：后代选择器嵌套深 */
.nav ul li a span { ... }

/* 快：直接类名 */
.nav-link { ... }
```

### 5. 优化滚动性能

- 使用 `passive: true` 监听滚动事件，告诉浏览器不会 `preventDefault`：
  ```js
  element.addEventListener('scroll', handler, { passive: true });
  ```
- 滚动动画用 `transform` 而非 `top`
- 长列表用虚拟列表
- 用 `content-visibility: auto` 跳过屏幕外内容

### 6. 节流与防抖

```js
// 节流：固定时间至少执行一次
function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// 防抖：停止触发后才执行
function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}
```

## 小结

| 优化方向 | 关键手段 |
| --- | --- |
| 减少重排 | 用 `transform`/`opacity` 替代几何属性 |
| 避免布局抖动 | 读写分离、用 rAF 批量更新 |
| 流畅动画 | rAF + 合成层 + GPU 加速 |
| 大列表渲染 | 虚拟列表、`content-visibility` |
| 隔离渲染 | `contain`、`will-change` 谨慎使用 |
| 滚动流畅 | `passive: true`、节流 |

**面试要点**：能讲清渲染流水线、重排重绘的区别、布局抖动的成因与规避、为什么 `transform` 比 `left` 快（走合成线程而不重排），并能举出虚拟列表的实现思路，就足以应对大部分渲染性能题。
