---
sidebar_position: 2
---
# FAQ?

## 小程序的运行原理是什么？为什么要设计双线程模型？

小程序采用**双线程模型**：视图层（View）和逻辑层（Service）分别运行在两个独立的线程中，通过 Native 层的 JSBridge 通信。

- **视图层**：多个 WebView 实例，负责渲染 WXML/WXSS，每个页面一个 WebView。
- **逻辑层**：单独的 JS 引擎（iOS 用 JSCore、Android 用 V8、开发者工具用 NW.js），运行全部业务 JS 代码。
- **Native 层**：提供原生组件、网络、存储、UI 控件等能力，作为两个线程的中介。

```
┌─────────────┐   JSBridge   ┌──────────────┐
│  View 层    │ &lt;──────────&gt; │ Service 层   │
│ (WebView)   │   setData     │ (JSCore/V8)  │
└──────┬──────┘               └──────┬───────┘
       │                              │
       └──────── Native 层 ───────────┘
```

**设计双线程的核心原因：可控性与安全。**

1. **禁用 DOM API**：逻辑层没有 `window`、`document`，无法直接操作 DOM，避免开发者绕过框架做不可控行为。
2. **统一渲染**：所有数据通过 `setData` 流向视图层，框架能管控更新节奏，做 diff 与批处理。
3. **安全审查**：逻辑层运行在沙箱中，原生能力只能通过 wx.* 接口受控调用，便于平台审核与权限管控。
4. **体验分离**：逻辑层卡死不影响视图层动画与原生组件（如 map、video）渲染。

代价是：setData 是跨线程通信，存在序列化与传输成本，这也是小程序性能优化的核心战场。

## 小程序与 H5 有什么区别？

| 维度 | 小程序 | H5 |
| --- | --- | --- |
| 运行环境 | 微信 App 内，双线程 | 浏览器，单线程 |
| 开发语言 | WXML / WXSS / JS（受限） | HTML / CSS / JS（完整） |
| DOM 操作 | 禁用，只能 setData | 完全可用 |
| API 能力 | wx.* 受控原生能力 | 受浏览器同源策略限制 |
| 包体限制 | 主包 2MB，总包 20MB | 无硬性限制 |
| 审核 | 需平台审核发布 | 直接上线 |
| 入口 | 微信内搜索/扫码/分享 | URL 链接 |
| 体验 | 接近原生，启动快 | 依赖浏览器，白屏多 |

**关键差异点：**

1. **DOM 隔离**：H5 可直接 `document.getElementById`，小程序只能 `setData` 驱动视图，这是架构层面的根本差异。
2. **原生组件**：小程序的 `map`、`video`、`canvas` 是原生组件，层级高于普通组件（同层渲染前需要 `cover-view` 处理层级问题），H5 则是普通 DOM。
3. **路由栈**：小程序内置 `navigateTo`/`redirectTo`/`switchTab`/`navigateBack` 的页面栈管理（最多 10 层），H5 需要自己实现路由。
4. **网络请求**：小程序只能用 `wx.request` 且需配置合法域名（HTTPS），H5 可用 `fetch`/`XHR` 受 CORS 限制。

## 小程序的生命周期有哪些？App / Page / Component 的区别？

小程序生命周期分三层：

**1. App 全局生命周期**

```js
App({
  onLaunch(options) {
    // 小程序初始化完成，全局只触发一次
    // 常用于：登录态初始化、获取设备信息、读取本地缓存
  },
  onShow(options) {
    // 从后台切到前台
  },
  onHide() {
    // 从前台切到后台
  },
  onError(msg) {
    // 全局错误监听
  },
  onUnhandledRejection(res) {
    // 未处理的 Promise rejection
  }
});
```

**2. Page 页面生命周期**

```js
Page({
  onLoad(options) {
    // 页面加载，可获取参数，只触发一次
  },
  onShow() {
    // 页面显示，每次切回都触发
  },
  onReady() {
    // 首次渲染完成，只触发一次
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面卸载，只触发一次
  },
  onPullDownRefresh() {
    // 下拉刷新
  },
  onReachBottom() {
    // 上拉触底
  },
  onShareAppMessage() {
    // 分享
  }
});
```

**3. Component 组件生命周期**

```js
Component({
  lifetimes: {
    created() {
      // 实例创建，此时不能调用 setData
    },
    attached() {
      // 进入页面节点树，可 setData
    },
    ready() {
      // 布局完成
    },
    moved() {
      // 被移动到新位置
    },
    detached() {
      // 从页面节点树移除
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期
    show() {},
    hide() {},
    resize() {}
  }
});
```

**记忆要点：**

- `onLoad` 触发一次，`onShow` 每次可见都触发——常考"在哪个生命周期请求数据"。
- `onReady` 是首次渲染完成，`onShow` 之后才稳定；操作 DOM（在 H5 语境）对应小程序里在 `onReady` 后 setData。
- Component 有 `pageLifetimes` 监听所在页面 show/hide，用于组件内响应页面切换。

## 小程序的分包加载是什么？为什么需要分包？

小程序有限制：**主包不超过 2MB，所有分包总大小不超过 20MB**（微信）。业务复杂后主包必然超限，分包加载就是按需加载子包的机制。

**分包配置（app.json）：**

```json
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs"
  ],
  "subpackages": [
    {
      "root": "packageA",
      "pages": [
        "pages/cat/cat",
        "pages/dog/dog"
      ]
    },
    {
      "root": "packageB",
      "name": "B",
      "pages": ["pages/apple/apple"],
      "independent": true
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["packageA", "B"]
    }
  }
}
```

**分包类型：**

- **普通分包**：可引用主包资源，也可被主包引用。
- **独立分包**：`independent: true`，不依赖主包，可独立运行。常用于活动页、独立功能模块，能显著降低启动时间。
- **分包预下载**：通过 `preloadRule` 在进入某页面时预下载其他分包，减少用户等待。

**使用分包的注意点：**

1. **路由跳转**：`wx.navigateTo({ url: '/packageA/pages/cat/cat' })` 跨分包跳转，框架自动加载子包。
2. **资源引用**：分包内可引用主包的 JS 模块与图片，但分包间资源不能互相引用。
3. **TabBar 限制**：TabBar 页面必须在主包。

**面试常问的优化点：**

- 主包只放首屏与公共代码，二级页面下沉到分包。
- 启动慢的页面用独立分包，用户能更快进入活动页。
- 配合 `preloadRule` 在空闲时预下载，做到"用户无感加载"。

## setData 的性能问题有哪些？如何优化？

`setData` 是跨线程通信，每次调用都要将数据从逻辑层序列化、传输到视图层再 diff。它的性能瓶颈在：

1. **数据传输成本**：每次 setData 传输的数据越大，序列化与 IPC 越慢。
2. **重渲染范围**：setData 的 path 越靠近根节点，diff 的组件树越大。
3. **频繁调用**：短时间内多次 setData 会触发多次通信与渲染，无法合并。

**优化手段：**

**1. 只传变化的数据（细粒度 path）**

```js
// ❌ 传输整个对象
this.setData({ list: this.data.list });

// ✅ 只传变化的字段
this.setData({ 'list[0].name': 'newName' });
```

**2. 合并多次 setData**

```js
// ❌ 多次调用
this.setData({ a: 1 });
this.setData({ b: 2 });
this.setData({ c: 3 });

// ✅ 合并一次
this.setData({ a: 1, b: 2, c: 3 });
```

**3. 不在 setData 里传与视图无关的数据**

```js
// ❌ 把只用于逻辑的数据也塞进 data
this.setData({ bigList: hugeArray });

// ✅ 用普通实例变量存储
this.bigList = hugeArray;  // 不触发渲染
```

**4. 列表滚动场景用虚拟列表**

长列表渲染成千上万条数据时，用 `recycle-view` 或自己实现虚拟列表，只渲染可视区。

**5. 避免在 onPageScroll 频繁 setData**

`onPageScroll` 触发频率极高，在其中 setData 会造成严重卡顿；用节流或 `WXS` 响应事件代替。

**6. 复杂列表用 key**

`wx:for` 必须配 `wx:key`，让框架能高效 diff，避免整列重建。

## 小程序如何处理登录态与鉴权？

小程序**不能使用 cookie**，因为逻辑层没有浏览器环境。登录态完全依赖 `wx.login` + 自定义登录态（token）。

**标准登录流程：**

```
小程序                    开发者服务器             微信开放平台
  │  wx.login 获取 code      │                        │
  ├─────────────────────────&gt;│  code2session           │
  │                          ├───────────────────────&gt;│
  │                          │  openid + session_key   │
  │                          │&lt;───────────────────────┤
  │                          │                        │
  │                          │  生成自定义 token       │
  │  返回 token              │&lt;─────────────────────┐ │
  │&lt;─────────────────────────┤                     │ │
  │                          │                        │
  │  wx.setStorageSync       │                        │
  │  (token)                 │  后续请求带 token      │
  │                          │&lt;────────────────────────┤
```

```js
// 小程序端
wx.login({
  success(res) {
    if (res.code) {
      wx.request({
        url: 'https://api.example.com/login',
        data: { code: res.code },
        success(r) {
          // 后端返回自定义 token
          wx.setStorageSync('token', r.data.token);
        }
      });
    }
  }
});

// 后续请求带上 token
wx.request({
  url: 'https://api.example.com/data',
  header: { Authorization: `Bearer ${wx.getStorageSync('token')}` }
});
```

**关键点：**

1. **`session_key` 不能下发给前端**——它用于解密 `wx.getUserInfo` 等敏感数据，必须留在后端。
2. **token 存储**：用 `wx.setStorageSync` 持久化，也可用 `wx.checkSession` 校验登录态是否过期（过期需重新 `wx.login`）。
3. **鉴权方式**：因为没有 cookie，所有请求都需手动在 header 里带 `Authorization`，服务端校验 token。
4. **checkSession**：`wx.checkSession` 检查 session_key 是否过期，未过期可不重新 `wx.login`，减少服务器压力。

## 小程序如何与 WebView 通信？

小程序里可以通过 `web-view` 组件内嵌 H5 页面，但两者通信受限。

**1. 小程序 → WebView：通过 URL 参数**

```html
<!-- 只能在 url 里传参 -->
<web-view src="https://h5.example.com/page?token=xxx&userId=123"></web-view>
```

H5 侧通过 `location.search` 解析参数。

**2. WebView → 小程序：通过 wx.miniProgram API**

H5 页面引入微信 JSSDK 后调用：

```js
// H5 端跳回小程序页面
wx.miniProgram.navigateTo({
  url: '/pages/result/index?status=success'
});

// H5 端发消息给小程序（只能在特定时机触发）
wx.miniProgram.postMessage({
  data: { msg: 'from h5' }
});
```

**关键限制：**

- `postMessage` 的消息**不会实时被小程序接收**，只在特定时机（分享、复制链接、`navigateBack`）触发 `bindmessage` 回调。
- 小程序里：

```html
<web-view src="{{url}}" bindmessage="onMessage"></web-view>
```

```js
Page({
  onMessage(e) {
    // e.detail.data 是 H5 postMessage 的数据数组
    console.log(e.detail.data);
  }
});
```

**3. 实时通信的折中方案**

由于 postMessage 不实时，常见做法是用 URL 跳转传参：

- H5 → 小程序：`wx.miniProgram.navigateTo({ url })`，参数走 url。
- 小程序 → H5：重新设置 `web-view` 的 `src`，参数走 url。

**面试要点：**讲清"双线程隔离导致通信受限"是根因，postMessage 只在特定时机触发是为了防止任意时刻的跨域通信风险。

## 小程序性能优化有哪些常见手段？

**1. 启动性能**

- **分包加载**：主包精简到 2MB 内，非首屏页面下沉分包。
- **独立分包**：活动页用独立分包，跳过主包加载。
- **分包预下载**：`preloadRule` 在首屏空闲时预下载常用分包。
- **按需注入**：`app.json` 配置 `"lazyCodeLoading": "requiredComponents"`，只注入用到的组件代码。

**2. 渲染性能**

- **setData 优化**：细粒度 path、合并调用、不传与视图无关的数据（见 setData 专项）。
- **虚拟列表**：长列表用 `recycle-view` 或自实现虚拟滚动。
- **避免大对象 setData**：超过 256KB 的数据 setData 会明显卡顿。
- **key 配置**：`wx:for` 配 `wx:key`，提升 diff 效率。

**3. 网络优化**

- **缓存策略**：接口数据用 `wx.setStorage` 做缓存，配合过期时间。
- **图片优化**：使用 WebP 格式、CDN 缩略图、`lazy-load` 懒加载。
- **并发请求**：小程序最多 10 个并发请求，用 `Promise.all` 并发，但注意限流。

**4. 交互体验**

- **骨架屏**：用 `loading` 组件或骨架屏占位，减少白屏感。
- **避免在 onPageScroll setData**：用 WXS 响应事件或节流。
- **防抖节流**：搜索、滚动、按钮点击都做防抖。

**5. 内存优化**

- **及时清理定时器**：`onUnload` 里 `clearInterval` / `clearTimeout`。
- **避免闭包持有大对象**：组件卸载时手动置空引用。
- **页面栈控制**：`navigateTo` 栈不超过 10 层，超过用 `redirectTo` 替换。

**面试加分点：**能讲清"双线程模型 → setData 是性能瓶颈 → 围绕减少传输、合并更新、预加载"这条主线，比单纯背优化清单更能体现理解深度。
