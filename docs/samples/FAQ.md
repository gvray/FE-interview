---
sidebar_position: 2
---
# FAQ?

## webSocket如何兼容低浏览器

- Adobe Flash Socket；
- ActiveX HTMLFile (IE) ；
- 基于 multipart 编码发送 XHR；
- 基于长轮询的 XHR；

## 怎么实现图片懒加载？

方式一：使用 loading="lazy", 兼容性一般

```js
<img src="./example.jpg" loading="lazy">
```

方式二：我们通过js监听页面的滚动也能实现。

使用js实现的原理主要是判断当前图片是否到了可视区域：

- 拿到所有的图片 dom 。
- 遍历每个图片判断当前图片是否到了可视区范围内。
- 如果到了就设置图片的 src 属性。
- 绑定 window 的 scroll 事件，对其进行事件监听。
- 在页面初始化的时候，`<img>`图片的src实际上是放在data-src属性上的，当元素处于可视范围内的时候，就把data-src赋值给src属性，完成图片加载。

```js
function lazyload() {
  let viewHeight = window.innerHeight || document.documentElement.clientHeight|| document.body.clientHeight //获取可视区高度，兼容不同浏览器
  let imgs = document.querySelectorAll('img[data-src]')
  imgs.forEach((item, index) => {
    if (item.dataset.src === '') return

    // 用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置
    let rect = item.getBoundingClientRect()
    if (rect.bottom >= 0 && rect.top < viewHeight) {
      item.src = item.dataset.src
      item.removeAttribute('data-src')
    }
  })
}
```

方式三：使用 Intersection Observer API

IntersectionObserver 是浏览器原生提供的构造函数，接受两个参数：callback 是可见性变化时的回调函数，option 是配置对象（该参数可选）。

目标元素的可见性变化时，就会调用观察器的回调函数 callback。callback 一般会触发两次。一次是目标元素刚刚进入视口（开始可见），另一次是完全离开视口（开始不可见）。

```js
const imgs = document.querySelectorAll('img[data-src]')
const config = {
  rootMargin: '0px',
  threshold: 0,
}
let observer = new IntersectionObserver((entries, self) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      let img = entry.target
      let src = img.dataset.src
      if (src) {
        img.src = src
        img.removeAttribute('data-src')
      }
      // 解除观察
      self.unobserve(entry.target)
    }
  })
}, config)

imgs.forEach((image) => {
  observer.observe(image)
})
```

## 需要在本地实现一个聊天室，多个tab页相互通信，不能用websocket，你会怎么做？

由于不能使用 WebSocket，可以借助浏览器原生的跨标签页通信机制实现。常见有三种方案，优先级从高到低：

**方案一：BroadcastChannel API（推荐）**

原生 API，专为同源跨上下文广播设计，API 简洁，性能好。

```js
// 每个标签页都创建一个同名频道
const channel = new BroadcastChannel('chat_room');

// 发送消息
channel.postMessage({ user: 'Tom', text: '你好', time: Date.now() });

// 接收消息
channel.onmessage = (e) => {
  const { user, text, time } = e.data;
  appendMessage(user, text, time);
};
```

优点：API 简单、无第三方依赖、性能高。缺点：不兼容 IE，但现代浏览器均已支持。

**方案二：localStorage + storage 事件**

利用 `storage` 事件在同源其他标签页触发的特性，把消息写入 localStorage，其他标签页监听变化。

```js
const KEY = 'chat_room_messages';

// 发送消息
function send(user, text) {
  const msg = { user, text, time: Date.now() };
  // 注意：要写入新值才会触发 storage 事件，拼接随机数保证每次不同
  localStorage.setItem(KEY, JSON.stringify(msg) + '|' + Math.random());
}

// 接收消息
window.addEventListener('storage', (e) => {
  if (e.key === KEY && e.newValue) {
    const raw = e.newValue.split('|')[0];
    const { user, text, time } = JSON.parse(raw);
    appendMessage(user, text, time);
  }
});
```

优点：兼容性好（支持 IE8+）。缺点：需要处理存储值去重，容量受 localStorage 5MB 限制。

**方案三：SharedWorker**

创建一个所有标签页共享的 Worker，作为消息中心转发消息。

```js
// chat-worker.js
const ports = new Set();
onconnect = (e) => {
  const port = e.ports[0];
  ports.add(port);
  port.onmessage = (ev) => {
    // 广播给所有连接的标签页
    ports.forEach((p) => p.postMessage(ev.data));
  };
};

// 每个标签页
const worker = new SharedWorker('./chat-worker.js');
worker.port.onmessage = (e) => {
  const { user, text, time } = e.data;
  appendMessage(user, text, time);
};

// 发送
worker.port.postMessage({ user: 'Tom', text: '你好', time: Date.now() });
```

优点：可以在 Worker 中维护完整状态、做复杂逻辑。缺点：调试相对复杂，部分浏览器需配置跨标签页共享。

**选型建议：**

- 现代项目首选 BroadcastChannel，简洁高效。
- 需要兼容旧浏览器选 localStorage + storage 事件。
- 需要在共享上下文中维护复杂状态（如在线人数、消息历史）选 SharedWorker。

三种方案都只适用于同源页面；跨域场景需借助 `postMessage` + 中转页。
