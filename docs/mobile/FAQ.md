---
sidebar_position: 2
---
# FAQ?

## 知道PWA吗

PWA（Progressive Web App，渐进式网页应用）是一种结合了 Web 和原生 App 优势的应用模型。它不是某一项单一技术，而是由多项技术组合而成的 Web 应用，包括 Manifest、Service Worker、Web Push、Notification 等。

**核心特征：**

- 渐进式：可适用于所有浏览器，低版本降级可用
- 响应式：适配不同终端
- 可离线：通过 Service Worker 缓存资源，支持离线访问
- 类 App 交互：可安装到桌面，启动时无浏览器地址栏
- 即时更新：通过 Service Worker 更新机制保持最新
- 安全：必须通过 HTTPS 提供
- 可被搜索引擎检索
- 支持推送通知

**关键技术：**

1. **Manifest（应用清单）**：通过 JSON 文件定义应用图标、名称、启动方式等

```json
{
  "name": "My PWA",
  "short_name": "PWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fff",
  "theme_color": "#000",
  "icons": [
    { "src": "/icon.png", "sizes": "192x192", "type": "image/png" }
  ]
}
```

```html
<link rel="manifest" href="/manifest.json">
```

2. **Service Worker**：在浏览器后台独立线程运行的脚本，可拦截网络请求、缓存资源、实现离线访问和消息推送

```js
// 注册 Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
    console.log('注册成功', reg.scope)
  })
}

// sw.js
const CACHE_NAME = 'v1'
const CACHE_LIST = ['/index.html', '/main.js', '/main.css']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CACHE_LIST)))
})

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)))
})
```

3. **Web Push & Notification**：通过 Push API 和 Notification API 实现消息推送

**优点：** 跨平台、可索引、低存储成本、可离线、即时更新
**缺点：** iOS Safari 对 PWA 支持较晚且有限制；推送依赖用户授权；首屏加载仍依赖网络

## 移动布局方案

移动端常见布局方案：

**1. 静态布局（Static Layout）**
固定像素宽度，移动端会出现横向滚动条，已基本被淘汰

**2. 流式布局（Liquid/Fluid Layout）**
使用百分比作为宽度单位，元素随视口宽度变化

**3. 自适应布局（Adaptive Layout）**
通过媒体查询为不同屏幕尺寸设计不同布局，每种尺寸一套固定布局

**4. 响应式布局（Responsive Layout）**
媒体查询 + 弹性网格，一套代码适配多端

**5. REM 布局**
根据 html 根字体大小（通常结合 JS 监听视口宽度动态计算）实现整体缩放，是早期主流方案（如淘宝 lib-flexible）

```js
// 将视口宽度分为 10rem
function setRem() {
  const docEl = document.documentElement
  const width = docEl.getBoundingClientRect().width
  const rem = width / 10
  docEl.style.fontSize = rem + 'px'
}
window.addEventListener('resize', setRem)
```

**6. VW/VH 布局**
使用视口单位 vw、vh，结合 PostCSS 插件（postcss-px-to-viewport）自动转换，是当前主流方案之一

```css
.box {
  width: 10vw;     /* 视口宽度的 10% */
  height: 5vh;      /* 视口高度的 5% */
  font-size: 4vw;
}
```

**7. Flex 弹性布局**
一维布局，适合组件内部对齐和分布

**8. Grid 网格布局**
二维布局，适合复杂页面结构

**9. 混合方案**
实际项目中常混合使用：根布局用 vw + rem，列表用 flex，复杂区域用 grid

## Rem, Em

两者都是相对长度单位，但参照物不同：

**em**
- 参照当前元素（或继承自父元素）的 font-size
- 嵌套时会层层叠加，容易失控
- 1em = 当前元素的 font-size

```css
.parent { font-size: 20px; }
.child {
  font-size: 1.2em;  /* 24px = 20px * 1.2 */
  padding: 1em;      /* 24px，参照自身 font-size */
}
```

**rem（Root em）**
- 参照根元素 `<html>` 的 font-size
- 嵌套不会叠加，全局统一
- 1rem = html 的 font-size

```css
html { font-size: 16px; } /* 默认 */
.box {
  width: 10rem;     /* 160px */
  font-size: 1rem;  /* 16px */
}
```

**对比：**

| 单位 | 参照物 | 是否叠加 | 适用场景 |
| --- | --- | --- | --- |
| em | 当前/父元素 font-size | 是，嵌套会叠加 | 组件内局部缩放（如按钮内文字、间距） |
| rem | html 根 font-size | 否，全局一致 | 整体布局、跨组件统一尺寸 |

**经验法则：** 组件内部用 em 实现按字号缩放（如 padding、margin 跟随 font-size 变化），整体布局用 rem 保持一致性。

## flex布局及优缺点

Flexbox（弹性盒子）是 CSS3 提供的一维布局模型，专为复杂的对齐和空间分布而设计。

**核心概念：** 容器（flex container）和项目（flex item）；主轴（main axis）和交叉轴（cross axis）

**容器属性：**

```css
.container {
  display: flex;
  flex-direction: row | row-reverse | column | column-reverse;
  justify-content: flex-start | center | flex-end | space-between | space-around | space-evenly;
  align-items: flex-start | center | flex-end | stretch | baseline;
  flex-wrap: nowrap | wrap | wrap-reverse;
  align-content: flex-start | center | stretch | space-between;
  gap: 10px;
}
```

**项目属性：**

```css
.item {
  flex-grow: 0;     /* 放大比例 */
  flex-shrink: 1;   /* 缩小比例 */
  flex-basis: auto; /* 基准尺寸 */
  flex: 1;          /* 1 1 0% 的简写 */
  align-self: auto; /* 单独对齐 */
  order: 0;
}
```

**优点：**

1. 方便实现垂直居中、等高列、自适应分布等传统 CSS 难以处理的布局
2. 一维方向上对齐和空间分配非常灵活
3. 代码量少，易于维护
4. 移动端兼容性良好（IE10+ 部分支持，现代浏览器全支持）
5. 支持自动分配剩余空间

**缺点：**

1. 只是一维布局，复杂二维布局（如不规则网格）应使用 Grid
2. 老版本 IE 的 flex 语法（如 display:box）与现代标准不同，需要前缀
3. 浏览器对 flex 项的最小尺寸有默认值（`min-width: auto`），可能导致项目无法缩小到内容以下，需手动设置 `min-width: 0`
4. 嵌套过深时调试复杂

## Rem布局及其优缺点

REM 布局是一种通过设置根元素 html 的 font-size，然后所有尺寸以 rem 为单位进行换算的移动端适配方案。

**实现原理：**

1. 设计稿通常以固定宽度（如 750px / 375px）为基准
2. 监听视口宽度变化，动态设置根字体大小
3. 页面所有尺寸按设计稿标注 / 基准值计算为 rem

```js
// 以 750 设计稿为例，1rem = 75px
function setRem() {
  const docEl = document.documentElement
  const width = docEl.clientWidth
  const rem = width / 10 // 视口宽度 10 等分
  docEl.style.fontSize = rem + 'px'
}
setRem()
window.addEventListener('resize', setRem)
```

```html
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
```

通过 PostCSS 插件（如 postcss-pxtorem）可自动将 px 转换为 rem：

```js
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 75, // 1rem = 75px
      propList: ['*']
    }
  }
}
```

**优点：**

1. 适配所有屏幕宽度，一套代码兼容多种设备
2. 等比缩放，设计稿还原度高
3. 兼容性好（IE9+）
4. 配合 PostCSS 插件可无感知开发，按 px 写代码

**缺点：**

1. 不是真正响应式，只是等比缩放；在大屏（如平板、桌面）上字体会过大，体验不佳，需要额外处理断点
2. 依赖 JS 设置根字体，JS 加载前页面尺寸为 0，可能出现闪烁
3. 字号也参与缩放，无法根据屏幕宽度做差异化排版
4. 与现代 vw/vh 方案相比略显繁琐
5. 在部分场景下（如用户改变浏览器默认字号），rem 会跟随变化，可能打破布局

**替代方案：** 当前主流方案是 vw/vh + postcss-px-to-viewport，无需 JS 即可纯 CSS 实现等比缩放。

## 百分比布局

百分比布局是流式布局的一种，元素尺寸以父元素为参照按百分比设定。

**参照规则：**

| 属性 | 参照物 |
| --- | --- |
| width / margin / padding / left / right | 父元素的 **width** |
| height / top / bottom | 父元素的 **height** |
| padding（不论方向） | 父元素的 **width** |
| margin（不论方向） | 父元素的 **width** |
| transform: translate(%) | 元素自身的 **width / height** |
| background-size | 元素自身的 **width / height** |
| font-size | 父元素的 **font-size** |
| line-height | 元素自身的 **font-size** |

```css
.parent { width: 200px; height: 100px; }
.child {
  width: 50%;     /* 100px */
  height: 50%;    /* 50px */
  padding: 10%;   /* 20px (参照父 width 而非 height) */
  margin: 5%;     /* 10px (参照父 width) */
  transform: translateX(50%); /* 自身宽度的 50% */
}
```

**优点：**

1. 简单直观，无需 JS
2. 自适应父容器变化
3. 兼容性极佳

**缺点：**

1. 各属性参照规则不统一（padding/margin 参照父 width 而非 height），容易踩坑
2. 嵌套时层层百分比容易失控
3. 无法直接基于视口尺寸（需要 vw/vh）
4. height 百分比在父元素未明确设高度时失效

**适用场景：** 容器内部比例分配、栅格布局、流式图片 `img { max-width: 100%; }`

## 移动端适配1px的问题

**问题原因：**
在 DPR（设备像素比）> 1 的高清屏上，CSS 的 1px 对应多个物理像素，因此 1px 边框看起来比设计稿粗。设计稿中标注的 1px 通常指的是物理像素 1px，而 CSS 写 1px 在 2x 屏上会显示为 2 个物理像素，视觉上偏粗。

**解决方案：**

**方案一：使用 0.5px 边框（iOS 适用）**

```css
.border {
  border-width: 0.5px;
  border-style: solid;
  border-color: #ccc;
}
```

兼容性：iOS 8+、新版 macOS Safari 支持；Android 部分机型不支持，会被当作 0 处理。

**方案二：transform: scale() 伪元素（推荐，通用）**

```css
.border-1px {
  position: relative;
}
.border-1px::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px;
  background: #ccc;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}
/* 3 倍屏 */
@media (-webkit-min-device-pixel-ratio: 3) {
  .border-1px::after { transform: scaleY(0.333); }
}
```

**方案三：viewport + rem（动态修改 initial-scale）**

通过 JS 读取 DPR，调整 meta viewport 的 scale，再相应放大根字体：

```html
<script>
  const dpr = window.devicePixelRatio || 1
  const scale = 1 / dpr
  document.querySelector('meta[name=viewport]').setAttribute(
    'content',
    `width=device-width,initial-scale=${scale},maximum-scale=${scale},user-scalable=no`
  )
  document.documentElement.style.fontSize = `${dpr * 10}px`
</script>
```

**方案四：border-image / background-image**
用一张 2x / 3x 的图片作为边框背景，需准备图片资源，灵活性差。

**方案五：box-shadow 模拟**

```css
.border { box-shadow: 0 0 0 0.5px #ccc; }
```

部分机型有锯齿，慎用。

**推荐：** 方案二（伪元素 + transform）兼容性最好，最常用。

## 移动端性能优化相关经验

**一、加载性能**

1. **资源压缩**：HTML/CSS/JS 压缩，启用 gzip/brotli；图片使用 webp/avif
2. **按需加载**：路由懒加载、组件异步加载、图片懒加载（`loading="lazy"`、IntersectionObserver）
3. **预加载与预取**：
   - `<link rel="preload">` 关键资源（字体、首屏 JS/CSS）
   - `<link rel="prefetch">` 下一页可能用到的资源
   - `<link rel="dns-prefetch">` DNS 预解析
4. **骨架屏 / Loading**：改善白屏体感
5. **CDN 加速**：静态资源分布到边缘节点
6. **HTTP/2**：多路复用、头部压缩、Server Push
7. **减少重定向**：移动端网络 RTT 大，重定向代价高

**二、渲染性能**

1. **减少 DOM 层级**：层级过深影响 layout/paint
2. **避免强制同步布局**：读写分离，批量读样式后再写

```js
// 错误：每次读后写会触发 layout
for (let i = 0; i < els.length; i++) {
  els[i].style.left = els[i].offsetLeft + 10 + 'px'
}
// 正确：先读完再写
const pos = els.map(el => el.offsetLeft + 10)
els.forEach((el, i) => (el.style.left = pos[i] + 'px'))
```

3. **使用 transform / opacity 实现动画**：触发复合层，不引起 layout/paint
4. **will-change 提示浏览器**：`will-change: transform`
5. **虚拟列表**：长列表使用 react-window / vue-virtual-scroller
6. **节流防抖**：scroll、resize、touchmove 等高频事件
7. **骨架屏**：减少布局抖动

**三、交互性能**

1. **响应用户操作 < 100ms**：长任务拆分，使用 `requestIdleCallback` / `setTimeout` 让出主线程
2. **触摸反馈**：`-webkit-tap-highlight-color`、active 状态
3. **避免内存泄漏**：及时解绑事件、清理定时器、释放大对象

**四、网络优化**

1. 首屏数据接口并行
2. 接口合并，减少请求数
3. 数据缓存（IndexedDB / localStorage 缓存列表数据）
4. 图片懒加载 + 占位图

**五、衡量指标**

- **FP / FCP**（首次绘制 / 首次内容绘制）
- **LCP**（最大内容绘制，目标 < 2.5s）
- **FID / INP**（首次输入延迟 / 交互延迟）
- **CLS**（累积布局偏移，目标 < 0.1）
- 工具：Lighthouse、Performance、Web Vitals 库

## toB 和 toC 项目的区别

| 维度 | toB（企业级） | toC（消费级） |
| --- | --- | --- |
| 用户群体 | 企业员工、专业人员 | 大众用户 |
| 使用场景 | 工作、生产 | 生活、娱乐 |
| 决策方 | 采购方与使用方分离 | 用户即决策者 |
| 体验要求 | 稳定、效率、功能完整 | 易用、流畅、视觉吸引力 |
| 设计风格 | 严谨、信息密度高 | 简洁、留白、动效丰富 |
| 表单与表格 | 复杂表单、大数据量表格、批量操作 | 简单表单、卡片流 |
| 权限模型 | 多层级、多角色、组织架构 | 单一用户角色，少量 VIP |
| 兼容性 | 兼容老旧浏览器（如 IE、Chrome 旧版本） | 主流移动端浏览器 |
| 性能 | 首屏可稍慢，但大数据量下要稳 | 首屏必须快 |
| 数据量 | 表格动辄上万行，需虚拟列表 | 单页数据量小 |
| 定制化 | 不同客户不同需求，需配置化、主题化 | 统一标准 |
| 发布频率 | 较低，需经过严格测试 | 高频迭代、灰度发布 |
| 反馈渠道 | 客服 / 工单 / 销售 | 应用市场、客服 |
| 离线/弱网 | 部分场景需离线 | 较少 |

**前端实现差异：**

1. **组件库**：toB 偏好功能丰富的企业级组件库（Ant Design、Element Plus），toC 偏好轻量、可定制（Vant、NutUI）
2. **权限控制**：toB 需要细粒度按钮级权限、菜单权限、数据权限
3. **国际化**：toB 常需多语言、多时区、多币种
4. **表格**：toB 表格支持排序、筛选、固定列、可编辑、虚拟滚动
5. **测试**：toB 更强调单元测试、E2E 测试覆盖率

## 移动端兼容性

移动端兼容性问题众多，按类型归类：

**一、viewport 与缩放**

```html
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no">
```
禁用用户缩放可避免双击缩放误操作。

**二、1px 边框问题**（详见对应章节）

**三、300ms 点击延迟**（详见对应章节）

**四、点击穿透**（详见对应章节）

**五、iOS 输入框默认内阴影**

```css
input, textarea {
  -webkit-appearance: none;
  appearance: none;
}
```

**六、Android 下触摸灰色遮罩**

```css
* {
  -webkit-tap-highlight-color: transparent;
}
```

**七、禁止用户选择文字 / 长按菜单**

```css
body {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
```

**八、字体设置**

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}
```

**九、安全区域适配（刘海屏）**

```html
<meta name="viewport" content="viewport-fit=cover">
```

```css
.bottom {
  padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
  padding-bottom: env(safe-area-inset-bottom);       /* iOS 11.2+ */
}
```

**十、fixed 定位在 iOS 软键盘弹起时错位**
监听 resize 或使用 `position: sticky` 替代。

**十一、滚动卡顿**

```css
.scroll {
  -webkit-overflow-scrolling: touch; /* iOS 惯性滚动 */
  overscroll-behavior: contain;       /* 阻止滚动穿透 */
}
```

**十二、高清屏图片适配**
使用 srcset 或 2x/3x 切图。

**十三、日期兼容**
iOS 部分版本不支持 `new Date('2020-01-01')` 中的 `-`，需用 `/`：

```js
new Date('2020/01/01'.replace(/-/g, '/'))
```

**十四、H5 在微信等容器中**：注意 JSSDK 鉴权、跳转协议（`weixin://`）等。

## 小程序

小程序是各平台提供的运行在原生 App 内的轻量应用，具有接近原生的体验和 Web 的开发便利。

**主流小程序：** 微信小程序、支付宝小程序、字节跳动小程序、百度智能小程序、快应用（厂商联盟）、QQ 小程序

**特点：**

1. 运行在双线程模型：逻辑层（JS）跑在 JSCore / V8 中，视图层（WXML/WXSS）跑在 WebView 中，通过原生 JSBridge 通信
2. 无法直接操作 DOM，采用数据驱动（setData）
3. 包大小受限（主包 2MB，分包 20MB，总计 30MB）
4. 提供原生能力（位置、相机、支付、文件）通过 wx.xx API 调用
5. 支持 WXS（WeiXin Script）在视图层运行脚本处理格式化

**与 H5 区别：**

| 维度 | 小程序 | H5 |
| --- | --- | --- |
| 运行环境 | 微信 App 内 | 浏览器 |
| 开发语言 | WXML/WXSS/JS | HTML/CSS/JS |
| DOM 操作 | 不支持，数据驱动 | 支持 |
| API | 平台提供丰富原生 API | Web API（受浏览器限制） |
| 入口 | 微信内分享/扫码/搜索 | URL |
| 审核 | 需提审 | 无 |
| 包体积 | 限制严格 | 无限制 |
| 体验 | 接近原生 | Web 体验 |

**跨端框架：**

- Taro（React 语法，多端编译）
- uni-app（Vue 语法）
- mpvue（Vue，已停止维护）
- Remax（React）

**优化要点：**

1. 减少 setData 频次和数据量，避免大数据全量传输
2. 分包加载，按页面分包
3. 图片懒加载、占位图
4. 列表使用 `recycle-view` 复用节点
5. 合理使用缓存 Storage

## 2X图 3X图适配

**背景：** 高 DPR 屏幕（DPR=2 即视网膜屏，每个 CSS 像素对应 2x2 物理像素），如果仍用 1x 图会被放大模糊；需要根据 DPR 加载对应倍图。

**srcset 方案（推荐）：**

```html
<img
  src="image@1x.png"
  srcset="image@2x.png 2x, image@3x.png 3x"
  alt="响应式图片"
/>
```

浏览器根据当前 DPR 自动选择对应图片。

**picture + source 方案：**

```html
<picture>
  <source srcset="image@3x.png" media="(min-resolution: 3dppx)">
  <source srcset="image@2x.png" media="(min-resolution: 2dppx)">
  <img src="image@1x.png" alt="">
</picture>
```

**CSS 媒体查询：**

```css
.logo { background-image: url('./image@1x.png'); }
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
  .logo { background-image: url('./image@2x.png'); }
}
@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 3dppx) {
  .logo { background-image: url('./image@3x.png'); }
}
```

**CSS image-set：**

```css
.logo {
  background-image: image-set(
    url('./image@1x.png') 1x,
    url('./image@2x.png') 2x,
    url('./image@3x.png') 3x
  );
}
```

**JS 判断：**

```js
const dpr = window.devicePixelRatio || 1
const img = dpr >= 3 ? 'image@3x.png' : dpr >= 2 ? 'image@2x.png' : 'image@1x.png'
```

**使用 SVG：** 矢量图天然适配所有 DPR，图标类首选 SVG。

## 图片在安卓上，有些设备模糊问题

**原因：**

1. **使用了 1x 图被放大**：在 DPR=2/3 的屏幕上未提供对应倍图
2. **Canvas 绘图模糊**：未按 DPR 放大 canvas 实际像素，再 CSS 缩放
3. **background-size 与图片实际尺寸不匹配**：被强制拉伸
4. **浏览器对非整数像素取整**：导致图片渲染时被重采样
5. **部分 Android 机型 webp 解码 BUG**

**解决方案：**

**一、提供高清图**

```html
<img src="a@1x.png" srcset="a@2x.png 2x, a@3x.png 3x">
```

**二、Canvas 适配 DPR**

```js
function setupCanvas(canvas, w, h) {
  const dpr = window.devicePixelRatio || 1
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  return ctx
}
```

**三、避免缩放**

- background-size 用图片原始尺寸或 cover/contain
- 避免使用 width/height 强行改变图片比例

**四、使用 SVG / WebP / AVIF**

**五、关闭图片抖动（部分场景）**

```css
img {
  image-rendering: -webkit-optimize-contrast;
}
```

## 固定定位布局键盘挡住输入框内容

**问题场景：** 在移动端，输入框 focus 时软键盘弹起，会遮挡 `position: fixed` / `sticky` 的输入框或按钮。

**原因：** iOS 不会缩小 webview，键盘会盖住 fixed 元素；Android 部分机型会触发 resize，部分不会。

**方案一：监听 focus/blur 滚动到可见区域**

```js
const input = document.querySelector('input')
input.addEventListener('focus', () => {
  setTimeout(() => {
    input.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, 300)
})
```

**方案二：使用 VisualViewport API**

```js
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    const keyboardHeight = window.innerHeight - window.visualViewport.height
    document.querySelector('.bottom-bar').style.transform =
      `translateY(${-keyboardHeight}px)`
  })
}
```

**方案三：监听 resize（Android 部分机型有效）**

```js
const originalHeight = window.innerHeight
window.addEventListener('resize', () => {
  const currentHeight = window.innerHeight
  const diff = currentHeight - originalHeight
  const bar = document.querySelector('.bottom-bar')
  if (diff < 0) {
    bar.style.bottom = `${-diff}px` // 键盘弹起
  } else {
    bar.style.bottom = '0'
  }
})
```

**方案四：用 position: sticky 替代 fixed**
sticky 元素随页面滚动，键盘弹起时不会被遮挡。

**方案五：布局上避免 fixed 输入框**
把输入框放在正常文档流中，键盘弹起时浏览器会自动滚动到 focus 元素。

## click的300ms延迟问题和点击穿透问题

**300ms 延迟原因：**
早期移动浏览器为了判断用户是否双击缩放，在第一次点击后会等待 300ms，若无第二次点击才触发 click 事件。

**解决方案：**

1. **设置 viewport 禁用缩放**（Chrome 32+ 不再有 300ms 延迟）

```html
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
```

2. **设置 width=device-width**（Chrome 32+ 直接消除延迟）
3. **使用 touchend 替代 click**（不推荐，会出现新问题）
4. **使用 FastClick 库**（已废弃，现代浏览器不需要）

```js
import FastClick from 'fastclick'
FastClick.attach(document.body)
```

5. **使用 pointerdown / pointerup 事件**

**点击穿透原因：**
触摸事件的触发顺序：`touchstart → touchmove → touchend → click`。如果用 touchstart 隐藏了某个元素（如遮罩层），紧接着 300ms 后 click 事件会作用到下方的元素上，触发其点击。

```js
mask.addEventListener('touchstart', () => {
  mask.style.display = 'none'
})
// 300ms 后 click 落到下方按钮上，触发跳转
```

**解决方案：**

1. **统一使用 click 事件**（在已解决 300ms 延迟的前提下）
2. **touchstart 中调用 e.preventDefault()**，阻止后续 click 触发

```js
mask.addEventListener('touchstart', e => {
  e.preventDefault()
  mask.style.display = 'none'
})
```

3. **延迟隐藏元素**，等待 click 触发完再隐藏

```js
mask.addEventListener('touchstart', () => {
  setTimeout(() => (mask.style.display = 'none'), 350)
})
```

4. **使用 pointer 事件统一**

## phone及ipad下输入框默认内阴影

**问题：** iOS Safari 下 input / textarea 默认有内阴影，影响样式统一。

**解决方案：**

```css
input, textarea {
  -webkit-appearance: none;
  appearance: none;
}
```

或针对单个元素：

```css
input[type="text"], input[type="password"], textarea {
  -webkit-appearance: none;
}
```

**注意：** 设置 `appearance: none` 后，原生表单控件（如 select）的部分样式也会失效，需要重新定义。对 button 元素也应一并设置：

```css
button {
  -webkit-appearance: none;
  appearance: none;
  background: none;
  border: none;
}
```

## 防止手机中页面放大和缩小

**方案一：viewport 禁用缩放（最常用）**

```html
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no">
```

**方案二：iOS 10+ 通过手势事件阻止双击缩放**

iOS 10+ Safari 忽略 user-scalable=no，需要 JS 兜底：

```js
let lastTouchEnd = 0
document.addEventListener('touchend', e => {
  const now = Date.now()
  if (now - lastTouchEnd <= 300) {
    e.preventDefault()
  }
  lastTouchEnd = now
}, { passive: false })

// 禁止双指缩放
document.addEventListener('gesturestart', e => e.preventDefault())
document.addEventListener('gesturechange', e => e.preventDefault())
```

**方案三：禁止文字选中（防止长按选中放大）**

```css
body {
  -webkit-user-select: none;
  user-select: none;
}
/* 输入框等允许选中 */
input, textarea {
  -webkit-user-select: auto;
  user-select: auto;
}
```

**方案四：禁用字体大小调整**

iOS 横屏时字体会自动放大，可通过 CSS 禁用：

```css
body {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
```

## px、em、rem、%、vw、vh、vm这些单位的区别

| 单位 | 类型 | 参照物 | 说明 |
| --- | --- | --- | --- |
| px | 绝对单位 | 物理像素（与 DPR 关联） | 最基础，不随父元素变化 |
| em | 相对单位 | 当前元素（或继承自父）的 font-size | 嵌套会叠加 |
| rem | 相对单位 | 根元素 html 的 font-size | 全局统一，不叠加 |
| % | 相对单位 | 父元素对应属性（padding/margin 参照父 width） | 视属性而异 |
| vw | 相对单位 | 视口宽度的 1% | 1vw = 1% viewport width |
| vh | 相对单位 | 视口高度的 1% | 1vh = 1% viewport height |
| vm / vmin | 相对单位 | 视口宽/高中较小者的 1% | `vmin` 是标准写法，旧 IE 用 vm |
| vmax | 相对单位 | 视口宽/高中较大者的 1% | 较新支持 |

**示例：**

```css
html { font-size: 16px; }
.parent {
  width: 50%;
  font-size: 20px;
}
.child {
  font-size: 1em;    /* 20px（继承父） */
  width: 2rem;       /* 32px（参照 html） */
  height: 10vh;      /* 视口高度 10% */
  padding: 5vw;      /* 视口宽度 5% */
}
```

**使用建议：**

- 字号、间距：rem（响应式）或 px（固定）
- 组件内局部缩放：em
- 容器内部比例：%
- 全屏布局、自适应：vw / vh
- 不依赖方向的尺寸：vmin / vmax

**vm 单位说明：** vm 是早期 IE 提出的同名单位，标准规范中已改为 `vmin`，旧版本 IE 支持 vm。现代浏览器应统一使用 vmin / vmax。

## 移动端适配- dpr浅析

**dpr（Device Pixel Ratio，设备像素比）= 物理像素 / CSS 像素**

- **物理像素**：屏幕实际的硬件像素点，出厂即固定
- **CSS 像素（逻辑像素）**：CSS 中使用的 px，是逻辑单位
- **DPR**：1 个 CSS 像素对应几个物理像素

**关系：**

```js
window.devicePixelRatio // 1, 2, 3 等
```

- 普通 PC 显示器：DPR = 1
- 普通手机（早期 iPhone）：DPR = 2
- 高清手机（iPhone Plus / Pro Max、安卓旗舰）：DPR = 3

**示例：**

- iPhone 6 物理分辨率 750×1334，CSS 视口 375×667，DPR = 2
- iPhone X 物理分辨率 1125×2436，CSS 视口 375×812，DPR = 3

**适配方案：**

1. **viewport meta**

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
```

设置 initial-scale=1 后，CSS 像素与视口对齐，浏览器根据 DPR 渲染对应物理像素。

2. **动态修改 scale**（lib-flexible 思路）

```js
const dpr = window.devicePixelRatio || 1
const scale = 1 / dpr
document.querySelector('meta[name=viewport]').setAttribute(
  'content',
  `width=device-width,initial-scale=${scale},maximum-scale=${scale},user-scalable=no`
)
document.documentElement.style.fontSize = `${dpr * 37.5}px`
```

使 1px CSS 对应 1 物理像素，但会带来字号变小问题，已不推荐。

3. **图片适配**：根据 dpr 加载 @2x、@3x 图片（详见 2X/3X 适配章节）

4. **1px 边框**：通过伪元素 + scale 处理（详见 1px 适配章节）

**lib-flexible 现状：** 已废弃，作者推荐使用 vw/vh 方案。viewport meta 设置 initial-scale=1 即可，单位转换交给 postcss-px-to-viewport 处理。

## 移动端扩展点击区域

点击区域过小（如 < 44x44px）会影响用户体验，iOS HIG 推荐可点击区域至少 44x44pt。

**方案一：增大 padding（最直接）**

```css
.btn {
  display: inline-block;
  padding: 12px 16px;
}
```

**方案二：使用伪元素扩展热区（不改变视觉大小）**

```css
.btn {
  position: relative;
  width: 30px;
  height: 30px;
}
.btn::before {
  content: '';
  position: absolute;
  top: -10px;
  right: -10px;
  bottom: -10px;
  left: -10px;
  z-index: 1;
  /* 透明，但可接收点击 */
}
```

**方案三：使用 touch-action 提升响应**

```css
.btn {
  touch-action: manipulation; /* 移除 300ms 延迟，提升响应 */
}
```

**方案四：line-height 增大行高**
适用于文字链接，可点击区域跟随 line-height 增大。

**方案五：用 button 标签替代 a / span**
原生 button 默认有较大热区。

**注意事项：**

- 扩展热区不要遮挡其他可点击元素
- 邻近按钮之间留出足够间距（至少 8px）防止误触

## 上下拉动滚动条时卡顿、慢

**原因：**

- iOS 早期默认没有惯性滚动
- 滚动时同步触发了 scroll 事件，频繁重排重绘
- 滚动容器内有大图、复杂 DOM、阴影、滤镜

**解决方案：**

**一、开启惯性滚动（iOS 必备）**

```css
.scroll {
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
}
```

**二、阻止滚动穿透，使用 overscroll-behavior**

```css
.scroll {
  overscroll-behavior: contain; /* 防止滚动到边界时影响父容器 */
}
```

**三、使用 transform 替代 top/left 做动画**

**四、滚动事件用 passive 监听 + 节流**

```js
let ticking = false
el.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      // 处理逻辑
      ticking = false
    })
    ticking = true
  }
}, { passive: true }) // 标记为 passive，浏览器不等待 e.preventDefault()
```

**五、will-change 提示合成**

```css
.scroll-item {
  will-change: transform;
}
```

**六、避免在滚动容器中使用大阴影 / filter**

`box-shadow` 大面积、`filter: blur` 会导致每次滚动都重绘。

**七、虚拟列表**

长列表使用虚拟滚动（react-window、vue-virtual-scroller），只渲染可视区域节点。

**八、硬件加速**

```css
.scroll-item {
  transform: translateZ(0);
}
```

将节点提升为合成层（注意层过多会反而卡顿）。

## 长时间按住页面出现闪退

**原因：**

- iOS Safari 在长按时触发图片保存菜单、文字选择菜单
- 部分浏览器在长按视频时触发原生播放器
- 大量 DOM 触发内存溢出
- 长按触发的 `touchstart` 没有触发 `touchend`，事件循环异常

**解决方案：**

1. **禁止长按菜单**

```css
body {
  -webkit-touch-callout: none; /* 禁止长按弹菜单 */
  -webkit-user-select: none;   /* 禁止选中文字 */
  user-select: none;
}
```

2. **阻止长按默认行为**

```js
document.addEventListener('contextmenu', e => e.preventDefault())
document.addEventListener('gesturestart', e => e.preventDefault())
```

3. **图片禁用长按菜单**

```css
img {
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  pointer-events: none; /* 如不需要交互 */
}
```

4. **避免内存泄漏**

- 解绑事件监听
- 清除定时器
- 释放大对象引用
- 路由切换时销毁组件

5. **减少 DOM 数量**，使用虚拟列表

6. **检查 iOS 内存上限**，单页内存超 ~10MB（旧设备）/ ~50MB（新设备）可能崩溃

## ios和android下触摸元素时出现半透明灰色遮罩

**原因：** 移动端默认在 touch 时给元素加一个灰色高亮，用于反馈触摸状态。

**解决方案：**

```css
* {
  -webkit-tap-highlight-color: transparent;
  /* 或 */
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
```

或针对单个元素：

```css
a, button, .tap {
  -webkit-tap-highlight-color: transparent;
}
```

**自定义点击反馈（替代高亮）：**

```css
.btn {
  -webkit-tap-highlight-color: transparent;
  background: #1890ff;
  transition: background 0.2s;
}
.btn:active {
  background: #096dd9;
}
```

## active兼容处理 即 伪类：active失效

**原因：** iOS 上 `:active` 默认不生效，需要在元素或 document 上绑定 touchstart 事件才能激活。

**方案一：document 绑定 touchstart（最简单）**

```js
document.addEventListener('touchstart', () => {}, true)
```

或在 body 上：

```html
<body ontouchstart="">
```

**方案二：CSS 设置 -webkit-tap-highlight-color**

```css
.btn {
  -webkit-tap-highlight-color: transparent;
}
.btn:active {
  background: #096dd9;
  color: #fff;
}
```

**方案三：JS 手动添加 active 类**

```js
const btns = document.querySelectorAll('.btn')
btns.forEach(btn => {
  btn.addEventListener('touchstart', () => btn.classList.add('active'))
  btn.addEventListener('touchend', () => btn.classList.remove('active'))
  btn.addEventListener('touchcancel', () => btn.classList.remove('active'))
})
```

**注意：** 不能在元素上同时绑定 touchstart 添加 active 类、touchend 移除类，因为点击穿透问题（300ms 后 click 仍触发），如果触摸元素也是按钮，会触发两次。建议优先使用方案一或方案二。

## webkit mask兼容处理

**mask（CSS 遮罩）：** 用一张图片的 alpha 通道控制元素的可见区域，类似 PS 的蒙版。

**标准语法（现代浏览器）：**

```css
.masked {
  -webkit-mask: url(mask.png) no-repeat center / contain;
          mask: url(mask.png) no-repeat center / contain;
  -webkit-mask-image: linear-gradient(to right, #000, transparent);
          mask-image: linear-gradient(to right, #000, transparent);
}
```

**兼容性：**

- Chrome / Safari / Edge：需 `-webkit-` 前缀（旧版本），新版本标准支持
- Firefox：早期支持 SVG mask，新版本支持标准 mask
- IE：完全不支持

**兼容方案：**

```css
.masked {
  /* 同时写带前缀和不带前缀 */
  -webkit-mask: url(mask.png) no-repeat center / contain;
      -ms-mask: url(mask.png) no-repeat center / contain;
          mask: url(mask.png) no-repeat center / contain;
}
```

**渐变遮罩兼容：**

```css
.fade {
  -webkit-mask-image: -webkit-linear-gradient(top, #000 50%, transparent);
          mask-image: linear-gradient(to bottom, #000 50%, transparent);
}
```

**降级方案：** 不支持 mask 的浏览器中元素会原样显示。可以先用 `@supports` 检测：

```css
@supports (-webkit-mask: none) or (mask: none) {
  .masked { /* 应用 mask 样式 */ }
}
@supports not ((-webkit-mask: none) or (mask: none)) {
  .masked {
    /* 不支持时降级，如使用 background-image 切图 */
  }
}
```

## transiton闪屏

**问题：** 在 iOS / 部分 Android 上，使用 transition（特别是 transform、opacity）动画时会出现闪烁或白屏。

**原因：**

- 元素未提升为合成层，每帧重绘
- z-index 与合成层冲突
- transition 过程中触发了 layout
- 使用 `position: absolute` 时父级未开启硬件加速

**解决方案：**

**一、开启硬件加速**

```css
.animated {
  transform: translate3d(0, 0, 0);
  /* 或 */
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
```

**二、使用 will-change**

```css
.animated {
  will-change: transform, opacity;
}
```

**三、使用 transform / opacity 替代 top / left**

```css
/* 错误 */
.box { transition: top 0.3s; top: 0; }
.box.show { top: -100px; }

/* 正确 */
.box { transition: transform 0.3s; transform: translateY(0); }
.box.show { transform: translateY(-100px); }
```

**四、关闭抗锯齿（部分场景）**

```css
.animated {
  -webkit-font-smoothing: antialiased;
}
```

**五、避免大元素动画**
对全屏元素做动画容易闪屏，缩小动画范围。

**六、iOS Safari 设置**

```css
* {
  -webkit-transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;
}
```

慎用，可能导致其他渲染问题。

## 圆角bug

**常见圆角 bug：**

**一、iOS 下overflow:hidden + border-radius 子元素溢出**

```css
.parent {
  overflow: hidden;
  border-radius: 10px;
}
.child {
  /* 子元素在 iOS 上可能溢出父圆角 */
}
```

**解决方案：** 父元素加上 `transform: translateZ(0)` 或 `will-change: transform` 强制提升为合成层：

```css
.parent {
  overflow: hidden;
  border-radius: 10px;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}
```

**二、Android 2.x 边框圆角与背景色不匹配（旧机型）**

旧版 Android 浏览器圆角处背景色未裁剪，已基本淘汰，可忽略。

**三、border + border-radius 锯齿**

```css
.box {
  border: 1px solid #ccc;
  border-radius: 5px;
  /* 在 DPR=2 屏上 1px 边框圆角处锯齿明显 */
}
```

解决：用伪元素 + scale 实现 0.5px 边框（详见 1px 章节）。

**四、background-clip 兼容**

```css
.box {
  border-radius: 10px;
  -webkit-background-clip: padding-box;
          background-clip: padding-box;
}
```

确保背景不会溢出到圆角外。

**五、iOS 输入框圆角失效**

```css
input {
  -webkit-appearance: none;
  appearance: none;
  border-radius: 5px;
}
```

**六、SVG 圆角**：用 `rx` / `ry` 属性或 `clip-path` 实现。

## 讲讲viewport和移动端布局

**viewport（视口）** 是浏览器中用于显示网页的区域。在移动端，由于手机屏幕宽度远小于桌面，浏览器默认会以一个较宽的"布局视口"渲染页面再缩放，导致页面在手机上显示异常。需要通过 `<meta name="viewport">` 来控制。

**1. viewport meta 标签**

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
```

各属性含义：

| 属性 | 说明 |
|------|------|
| `width=device-width` | 视口宽度等于设备宽度 |
| `initial-scale=1` | 初始缩放为 1 |
| `maximum-scale=1` / `minimum-scale=1` | 最大/最小缩放 |
| `user-scalable=no` | 禁止用户手动缩放 |
| `viewport-fit=cover` | 适配刘海屏（iPhone X）|

**2. 三种视口**

- **布局视口（Layout Viewport）**：浏览器默认的渲染宽度，移动端通常 980px
- **视觉视口（Visual Viewport）**：用户当前实际可见区域，会随缩放变化
- **理想视口（Ideal Viewport）**：通过 meta 设置 `width=device-width` 后的视口，等于设备物理宽度（CSS 像素）

**3. 移动端布局常用方案**

**a. 响应式布局（媒体查询）**

```css
@media (max-width: 768px) { /* 手机 */ }
@media (min-width: 769px) and (max-width: 1024px) { /* 平板 */ }
@media (min-width: 1025px) { /* 桌面 */ }
```

**b. rem 适配**

根据屏幕宽度动态修改根字号，元素尺寸用 `rem`：

```js
const setRem = () => {
  const docEl = document.documentElement
  const width = docEl.getBoundingClientRect().width
  docEl.style.fontSize = (width / 10) + 'px'
}
setRem()
window.addEventListener('resize', setRem)
```

配合 `lib-flexible` + `postcss-pxtorem` 自动转换。

**c. vw/vh 方案（推荐）**

直接用视口单位，1vw = 1% 视口宽度，配合 PostCSS 插件自动转换：

```css
.box { width: 75vw; font-size: 4vw; }
```

**d. 百分比布局**：`width: 50%`

**e. Flex / Grid**：弹性/网格布局做自适应排列

**4. 1px 边框问题**

高清屏 `devicePixelRatio=2/3` 下 `1px` 显示过粗，通常用伪元素 + `transform: scale(0.5)` 或 viewport 缩放方案解决。

**5. 安全区域适配**

iPhone X 等刘海屏机型需用 `env()` 适配：

```css
padding-bottom: env(safe-area-inset-bottom);
```

