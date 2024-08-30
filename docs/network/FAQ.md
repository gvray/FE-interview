---
sidebar_position: 2
---
# FAQ?
## tcp三次握手，一句话概括

客户端和服务端都需要直到各自可收发，因此需要三次握手。
简化三次握手：

从图片可以得到三次握手可以简化为：C 发起请求连接 S 确认，也发起连接 C 确认我们
再看看每次握手的作用：第一次握手：S 只可以确认 自己可以接受 C 发送的报文段第
二次握手：C 可以确认 S 收到了自己发送的报文段，并且可以确认 自己可以接受 S 发
送的报文段第三次握手：S 可以确认 C 收到了自己发送的报文段

## 一个图片url访问后直接下载怎样实现？

要让浏览器访问一个图片 URL 时直接触发下载而不是在页面中展示，核心是让响应以"附件"形式返回。主要有以下几种方式：

**1. 服务端设置 `Content-Disposition` 响应头（最标准）**

在响应头中设置 `Content-Disposition: attachment; filename="xxx.jpg"`，浏览器会将其作为下载文件处理：

```http
HTTP/1.1 200 OK
Content-Type: image/jpeg
Content-Disposition: attachment; filename="photo.jpg"
Content-Length: 102400
```

- `attachment` 表示以附件方式下载，不会内联展示
- `filename` 指定下载后的文件名
- 如果设为 `inline` 则会尝试在页面内展示

Nginx 中可以通过如下配置实现：

```nginx
location /download/ {
    add_header Content-Disposition "attachment; filename=$args";
}
```

**2. 前端使用 `download` 属性（同源场景）**

对于同源图片，可以给 `<a>` 标签添加 `download` 属性：

```html
<a href="/images/photo.jpg" download="自定义名称.jpg">下载图片</a>
```

**3. 前端通过 Blob 实现跨域下载**

对于跨域图片，`download` 属性会失效，可以通过 fetch 转 Blob 的方式实现：

```js
async function downloadImage(url, name) {
  const res = await fetch(url);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}
```

**4. 通过后端接口中转**

如果图片资源跨域且不允许跨域请求，可以让后端接口代理请求图片并加上 `Content-Disposition` 头返回。

## 说一下http2.0

HTTP/2（RFC 7540，2015 年正式发布）是 HTTP/1.1 的升级版，兼容现有语义（方法、状态码、URI、Header 字段含义不变），主要在传输层做了大幅优化。它基于 Google 提出的 SPDY 协议，所有数据以二进制帧（frame）形式传输。

**核心特性：**

**1. 二进制分帧层**

HTTP/2 不再以文本行传输，而是将 HTTP 报文拆成更小的二进制帧：Headers 帧、Data 帧。所有帧都属于某个**流（Stream）**，每个流有唯一 ID。

```
HTTP/1.1：  "GET / HTTP/1.1\r\nHost: ...\r\n\r\n"（明文）
HTTP/2：    [Length][Type][Flags][StreamID][Payload]（二进制）
```

**2. 多路复用（Multiplexing）**

在一个 TCP 连接上可以同时并发多个请求/响应，每个请求是一个独立的流，互不阻塞。彻底解决了 HTTP/1.1 的队头阻塞问题（应用层），大幅减少 TCP 连接数。

**3. 头部压缩（HPACK）**

HTTP/1.x 每个请求都重复发送大量 Header（Cookie、User-Agent 等）。HTTP/2 引入 HPACK 算法：

- 客户端和服务端各自维护**静态表**（61 个常用头字段）和**动态表**（已发过的自定义头）
- 使用哈夫曼编码压缩字段值
- 相同的 Header 只发一次索引，后续用数字引用

**4. 服务端推送（Server Push）**

服务器可以在客户端请求 HTML 时，主动把 CSS、JS 等相关资源一并推送过来，减少往返等待。

**5. 流优先级与依赖**

可以为每个流设置权重和依赖关系，让重要资源优先传输。

**6. 单一长连接**

HTTP/2 只需要一个 TCP 连接就能承载所有请求，减少握手开销和内存占用。

**注意事项：**

- HTTP/2 仍是基于 TCP，**TCP 层的丢包仍会造成所有流阻塞**（TCP 队头阻塞），这正是 HTTP/3 改用 QUIC/UDP 的原因
- 实际使用通常需要 HTTPS（主流浏览器只在 TLS 上启用 HTTP/2，即 h2）
- Server Push 在实践中效果有限，Chrome 一度移除了对它的支持

## 补充 400 和 401 、 403 状态码

这三者都属于 4xx 客户端错误状态码，但语义不同，定位问题时要区分：

**400 Bad Request（请求语法错误）**

表示客户端发送的请求有语法错误，服务器无法理解。常见场景：

- 请求参数缺失或类型错误
- JSON 格式不合法
- URL 编码错误
- 必填字段为空

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{ "error": "invalid_request", "message": "参数 username 不能为空" }
```

**401 Unauthorized（未认证）**

表示请求需要身份认证。注意它的真正含义是"未认证"而非"未授权"。响应中通常会带 `WWW-Authenticate` 头提示认证方式：

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="api"

{ "error": "invalid_token", "message": "token 已过期，请重新登录" }
```

典型场景：未登录、Token 失效、Token 无效、未携带 `Authorization` 头。

**403 Forbidden（无权限/禁止访问）**

表示服务器已识别用户身份（已认证），但该用户没有访问该资源的权限（未授权）。即"我知道你是谁，但你不能进"。

```http
HTTP/1.1 403 Forbidden

{ "error": "forbidden", "message": "您没有管理员权限" }
```

典型场景：普通用户访问管理员接口、IP 被封禁、文件权限不足、越权访问。

**三者的判断顺序：**

1. 先看请求格式是否正确 → 400
2. 再看是否携带有效身份凭证 → 401
3. 最后看该身份是否有权限 → 403

| 状态码 | 类比 | 含义 |
|--------|------|------|
| 400 | "你说的是什么，我没听懂" | 请求格式/参数错误 |
| 401 | "你谁？请先出示证件" | 未认证 |
| 403 | "我认识你，但你没权限进这里" | 已认证但无权限 |

## fetch发送 2 次请求的原因

用 `fetch` 发送某些跨域请求时，浏览器会先发一个 **OPTIONS 预检请求（Preflight Request）**，再发真正的请求，所以看起来是"两次请求"。这是 CORS 机制的"非简单请求"才会触发的行为。

**触发条件：非简单请求**

只要满足下列任一条件，就是非简单请求，会触发预检：

1. 使用了 `PUT`、`DELETE`、`PATCH`、`CONNECT`、`TRACE`、`OPTIONS` 之外的方法
2. 自定义请求头（除 `Accept`、`Accept-Language`、`Content-Language`、`Content-Type`、`Range` 之外）
3. `Content-Type` 不是下列三种之一：
   - `application/x-www-form-urlencoded`
   - `multipart/form-data`
   - `text/plain`
4. 请求中的 `XMLHttpRequest.upload` 注册了事件监听
5. 请求中使用了 `ReadableStream` 对象

**典型场景：发 JSON**

```js
fetch('https://api.example.com/user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },  // 触发预检
  body: JSON.stringify({ name: 'Tom' })
})
```

**预检流程：**

```http
// 第一次：OPTIONS 预检
OPTIONS /user HTTP/1.1
Origin: https://www.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```

```http
// 服务端响应预检
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://www.example.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400   // 预检结果缓存一天
```

预检通过后，浏览器才发起真正的 POST 请求。如果设置了 `Access-Control-Max-Age`，在缓存期内同一类请求不会再次预检。

**优化：减少预检次数**

- 尽量使用简单请求（`Content-Type: application/x-www-form-urlencoded`）
- 不使用多余的自定义头
- 服务端设置较长的 `Access-Control-Max-Age`

## 讲讲强，协商缓存

浏览器缓存分为**强缓存**和**协商缓存**两层，触发顺序是：先强缓存，命中则直接用本地副本；未命中再走协商缓存，向服务器确认是否可用，可用就返回 304 + 本地副本，不可用就返回 200 + 新资源。

**1. 强缓存（Strong Cache）**

命中后**不发送请求**，直接读本地缓存副本。由这两个响应头控制：

- `Cache-Control: max-age=3600`（HTTP/1.1，优先级高）：缓存有效时长，秒
- `Expires: Wed, 09 Jul 2026 07:28:00 GMT`（HTTP/1.0）：绝对过期时间，已基本被取代

```http
HTTP/1.1 200 OK
Cache-Control: public, max-age=31536000
```

浏览器再次访问时：

- `max-age` 未过期 → 直接用本地副本，状态码 200，size 显示 `(from disk cache)` 或 `(from memory cache)`
- 过期 → 走协商缓存

**2. 协商缓存（Negotiation Cache / Conditional Request）**

强缓存过期后，浏览器带着缓存标识去问服务器"还能不能用"。涉及两组头：

| 客户端请求头 | 服务端响应头 | 比较 |
|-------------|-------------|------|
| `If-Modified-Since` | `Last-Modified` | 资源最后修改时间 |
| `If-None-Match` | `ETag` | 资源唯一标识（哈希）|

- `Last-Modified` 只能精确到秒，且文件改了内容没变也会更新，粒度粗
- `ETag` 是文件内容哈希，更精确，**优先级高于 `Last-Modified`**

**流程：**

```http
# 第一次请求，服务器返回
HTTP/1.1 200 OK
ETag: "abc123"
Last-Modified: Wed, 09 Jul 2026 07:28:00 GMT
Cache-Control: max-age=0

# 第二次请求（强缓存失效），带上标识
GET /index.html HTTP/1.1
If-None-Match: "abc123"
If-Modified-Since: Wed, 09 Jul 2026 07:28:00 GMT

# 服务器判断未变化
HTTP/1.1 304 Not Modified
```

304 响应只返回头不返回 body，节省带宽；如果变化则返回 200 + 新资源 + 新的 `ETag`/`Last-Modified`。

**两者对比：**

| 对比项 | 强缓存 | 协商缓存 |
|--------|--------|---------|
| 是否发请求 | 否 | 是（带条件头） |
| 命中状态 | 200（from cache） | 304 |
| 节省流量 | 是（不传输 body） | 否（仍发请求，但不传 body） |
| 控制头 | `Cache-Control` / `Expires` | `ETag/If-None-Match`、`Last-Modified/If-Modified-Since` |

## 强缓存、协商缓存什么时候用哪个

两者不是二选一，而是配合使用：先强缓存，失效后再走协商缓存。但在**资源类型**和**更新策略**上有不同侧重。

**1. 优先使用强缓存的场景**

- 资源**长期不变**：带 hash 的静态资源（`app.a3f9b2.js`）、CDN 上的字体/图片/库文件
- 设置较长 `max-age`（如一年），文件名变 hash 后用户会立即重新请求新文件

```http
Cache-Control: public, max-age=31536000, immutable
```

`immutable` 表示资源永不变（文件名带 hash），浏览器甚至不会发条件请求。

**2. 优先使用协商缓存的场景**

- 资源会更新但**频率低**，且文件名不变（如 `index.html`）
- 需要保证用户尽快看到最新内容（首页、活动页）
- 设置 `Cache-Control: no-cache`（强制走协商）或 `max-age=0`

```http
Cache-Control: no-cache
ETag: "v2"
```

注意 `no-cache` 不是不缓存，而是"每次用前都要问服务器"。

**3. 完全不缓存的场景**

- 实时数据、敏感接口、银行余额
- 设置 `Cache-Control: no-store`，连副本都不存

```http
Cache-Control: no-store
```

**4. 常见搭配策略**

| 资源类型 | HTML | JS/CSS（带 hash） | 接口数据 | 图片/字体 |
|---------|------|--------------------|---------|----------|
| 策略 | `no-cache` + ETag | `max-age=31536000, immutable` | 按需 `no-store` 或短 `max-age` | 长 `max-age` |
| 缓存层 | 协商 | 强缓存 | — | 强缓存 |

**5. `Cache-Control` 常用组合**

```http
# 静态资源长期缓存
Cache-Control: public, max-age=31536000, immutable

# HTML 走协商
Cache-Control: no-cache

# 完全不缓存
Cache-Control: no-store, max-age=0

# 客户端可缓存，中间代理不能缓存
Cache-Control: private, max-age=600
```

**结论**：长期不更新的资源用强缓存，会更新但需要新鲜度的资源用协商缓存，敏感/实时数据用 `no-store`。

## 在地址栏里输入一个URL,到这个页面呈现出来，中间会发生什么？

这是一道经典全链路题，大致分为 **DNS 解析 → TCP 连接 → TLS 握手 → HTTP 请求响应 → 浏览器渲染** 几个阶段。

**1. URL 解析与 HSTS 检查**

- 浏览器解析 URL（协议、域名、端口、路径、查询参数）
- 如果是 HTTP 且域名在 HSTS 列表，强制转为 HTTPS
- 检查是否是搜索关键字（如直接转搜索引擎）

**2. DNS 解析（域名 → IP）**

按以下顺序查找：

1. 浏览器 DNS 缓存
2. 操作系统 DNS 缓存（hosts 文件）
3. 本地 DNS 服务器（递归查询）
4. 根域名服务器 → 顶级域名服务器 → 权威域名服务器
5. 拿到 IP 后写入各级缓存

**3. 建立 TCP 连接（三次握手）**

```text
客户端 → SYN → 服务器
客户端 ← SYN+ACK ← 服务器
客户端 → ACK → 服务器
```

如果是 HTTPS，还需在 TCP 建立后做 TLS 握手。

**4. TLS 握手（HTTPS 才有）**

ClientHello → ServerHello + 证书 → 客户端校验证书 → 协商密钥 → 加密通信开始。

**5. 发送 HTTP 请求**

- 浏览器拼接请求行、请求头、（如有）请求体
- 经过代理服务器、CDN、负载均衡器等中间节点
- Cookie、Authorization 头自动附加

**6. 服务器处理并返回响应**

- 经过路由 → 中间件 → 控制器
- 查数据库、读模板、生成 HTML/JSON
- 返回状态码、响应头、响应体
- 经过 CDN 缓存判断

**7. 浏览器接收响应并解析**

- 检查状态码：301/302 跳转、304 用缓存、200 正常处理
- 解压 gzip/br
- 根据 `Content-Type` 决定如何处理

**8. 渲染流程**

1. **解析 HTML → DOM 树**
2. **解析 CSS → CSSOM 树**
3. **DOM + CSSOM → 渲染树（Render Tree）**（不含 `display:none` 的节点）
4. **布局（Layout/Reflow）**：计算每个节点的几何位置
5. **绘制（Paint）**：填充像素到各图层
6. **合成（Composite）**：GPU 合成各图层并显示

**9. 加载子资源并执行脚本**

- 遇到 `<link>` 阻塞渲染，下载 CSS
- 遇到 `<script>` 默认阻塞 HTML 解析；`async` 异步下载完立即执行；`defer` 等解析完后按序执行
- 遇到 `<img>` 异步加载，不阻塞
- 每个子资源可能再走一遍 DNS → TCP → HTTP

**10. 触发事件与持续通信**

- `DOMContentLoaded`：DOM 解析完成
- `load`：所有资源加载完成
- WebSocket / SSE / 长轮询建立
- Service Worker、缓存策略生效

整个过程的优化空间很多：DNS 预解析、预连接、HTTP/2 多路复用、CDN、缓存、懒加载、SSR 等。

## cache-control的值有哪些

`Cache-Control` 是 HTTP/1.1 引入的缓存控制头，可同时出现在请求头和响应头中，由多个指令（directive）组合，逗号分隔。

**响应头中的指令（最常用）：**

| 指令 | 说明 |
|------|------|
| `public` | 任何中间节点（CDN、代理）都可缓存 |
| `private` | 仅浏览器可缓存（不允许 CDN/代理缓存，常见于用户私有数据） |
| `no-cache` | **可以缓存**，但每次使用前必须向服务器验证（走协商缓存） |
| `no-store` | **完全不缓存**，连副本都不存（敏感数据/实时数据） |
| `max-age=<seconds>` | 缓存有效时长（秒），从响应生成开始算 |
| `s-maxage=<seconds>` | 共享缓存（CDN/代理）的有效时长，覆盖 `max-age` |
| `must-revalidate` | 过期后必须重新验证，不能用陈旧缓存 |
| `proxy-revalidate` | 要求共享缓存重新验证（私有不要求） |
| `immutable` | 资源永不变，浏览器即使过期也不发条件请求（用于带 hash 的静态资源） |
| `no-transform` | 禁止中间代理修改响应体（如压缩图片） |
| `stale-while-revalidate=<s>` | 过期后 N 秒内可先用旧缓存，同时异步更新 |
| `stale-if-error=<s>` | 服务器出错时可用过期缓存兜底 |

**请求头中的指令：**

| 指令 | 说明 |
|------|------|
| `max-age=0` | 强制走协商缓存 |
| `no-cache` | 不使用强缓存，强制验证 |
| `no-store` | 不存任何缓存 |
| `only-if-cached` | 只用缓存，缓存没有就直接 504 |

**常见组合示例：**

```http
# 静态资源长期缓存（带 hash 文件名）
Cache-Control: public, max-age=31536000, immutable

# HTML 走协商缓存
Cache-Control: no-cache

# 完全不缓存（API 响应）
Cache-Control: no-store

# 用户私有数据
Cache-Control: private, max-age=600

# CDN 缓存 1 天，浏览器 5 分钟
Cache-Control: public, max-age=300, s-maxage=86400

# 旧缓存兜底
Cache-Control: public, max-age=600, stale-while-revalidate=3600
```

**注意 `no-cache` 与 `no-store` 的区别**：`no-cache` 是"用前要问"，仍可省流量；`no-store` 是"完全不存"，最严格。

## 介绍HTTP协议(特征)

HTTP（HyperText Transfer Protocol，超文本传输协议）是应用层协议，基于 TCP（HTTP/3 改用 QUIC/UDP），用于在客户端与服务器之间传输超文本、图片、视频、JSON 等数据。它的核心特征如下：

**1. 简单灵活**

- 报文格式简单：请求行/状态行 + 头部 + 空行 + 主体
- 通过 URI 定位资源，通过 Header 表达元信息，可扩展任意类型数据
- `Content-Type` 支持任意媒体类型

**2. 无状态**

- 每个请求独立，服务器默认不保留客户端状态
- 需要"登录态"等场景要靠 Cookie + Session、JWT 等机制补充

**3. 请求-响应模型**

- 一问一答：客户端发起请求，服务器返回响应
- 服务器不能主动推送（HTTP/1.x）；HTTP/2 引入 Server Push，HTTP/3 进一步优化

**4. 基于文本（HTTP/1.x）**

- HTTP/1.x 报文以 ASCII 文本传输，便于调试
- HTTP/2 改为二进制帧

**5. 可靠传输**

- 基于 TCP，提供有序、不丢失的字节流
- HTTP/3 改用 QUIC（UDP + 自己实现的可靠传输）

**6. 短连接 → 持久连接**

- HTTP/1.0 默认短连接（一次请求一次连接）
- HTTP/1.1 默认 `Connection: keep-alive`，复用 TCP 连接
- HTTP/2 单连接多路复用

**7. 支持缓存**

通过 `Cache-Control`、`ETag`、`Last-Modified` 等头字段实现强缓存和协商缓存。

**8. 可加密（HTTPS）**

在 TCP 与 HTTP 之间加 TLS/SSL 层，实现加密传输、身份认证、防篡改。

**9. 分层设计**

HTTP 是 OSI 应用层协议，依赖 TCP（传输层）、IP（网络层）、数据链路层。HTTP 与下层解耦，可在任何可靠传输层上运行。

**报文示例：**

```http
GET /api/users/1 HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0
Accept: application/json
Cookie: sessionId=abc

```

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 32
Cache-Control: max-age=60

{"id":1,"name":"Tom"}
```

## 知道 304 吗，什么时候用 304 ？

**304 Not Modified** 是协商缓存命中时服务器返回的状态码。表示"你缓存的副本仍然有效，直接用就行"，响应中**不携带 body**，节省带宽。

**触发流程：**

1. 第一次请求资源，服务器响应 200，并带上 `ETag` 和 `Last-Modified` 等缓存标识：

```http
HTTP/1.1 200 OK
ETag: "abc123"
Last-Modified: Wed, 09 Jul 2026 07:28:00 GMT
Cache-Control: max-age=0     // 强缓存立即失效
```

2. 浏览器把副本和标识存到本地。

3. 再次请求，强缓存已过期（或 `no-cache`），浏览器带条件请求头去问服务器：

```http
GET /style.css HTTP/1.1
If-None-Match: "abc123"
If-Modified-Since: Wed, 09 Jul 2026 07:28:00 GMT
```

4. 服务器比较资源当前的 ETag/Last-Modified 与请求头：

- **未变化** → 返回 304，不返回 body：

```http
HTTP/1.1 304 Not Modified
ETag: "abc123"
Cache-Control: max-age=0
```

- **已变化** → 返回 200 + 新资源 + 新的 ETag

**什么时候用 304？**

| 场景 | 是否用 304 |
|------|-----------|
| 文件名带 hash 的静态资源 | 一般不用，直接强缓存 |
| 文件名不变的 HTML / API | 用，需及时感知更新 |
| 资源会变但更新不频繁 | 用 304 节省带宽 |
| 实时性强的数据 | 不用，直接 200 或 `no-store` |

**优先级：** `ETag` > `Last-Modified`，因为 ETag 基于内容哈希，能识别"修改时间变了但内容没变"的情况，更精确。

**注意点：**

- 304 响应仍然消耗一次 RTT（往返），不如强缓存省事
- 走 HTTPS 时 304 也经过完整 TLS 握手后的连接，所以建议复用 keep-alive
- 服务端实现时要正确处理 `If-None-Match` / `If-Modified-Since`，避免错误返回 200

## 具体有哪些请求头是跟缓存相关的

HTTP 缓存相关头字段分布在**请求头**和**响应头**两边，配合使用形成强缓存与协商缓存。

**一、响应头（服务端 → 客户端）**

| 头字段 | 作用 | 示例 |
|--------|------|------|
| `Cache-Control` | HTTP/1.1 缓存策略，最常用 | `max-age=3600, public` |
| `Expires` | HTTP/1.0 绝对过期时间 | `Wed, 09 Jul 2026 12:00:00 GMT` |
| `ETag` | 资源唯一标识（哈希） | `"abc123"` |
| `Last-Modified` | 资源最后修改时间 | `Wed, 09 Jul 2026 07:28:00 GMT` |
| `Vary` | 指定哪些请求头不同时缓存失效 | `Accept-Encoding, User-Agent` |
| `Age` | 资源在缓存中存在的时长（秒） | `300` |

**二、请求头（客户端 → 服务端，用于协商缓存）**

| 头字段 | 对应响应头 | 作用 |
|--------|-----------|------|
| `If-None-Match` | `ETag` | 上次拿到的 ETag，服务端比较是否变化 |
| `If-Modified-Since` | `Last-Modified` | 上次的修改时间，服务端比较是否更新 |
| `If-Range` | `ETag`/`Last-Modified` | 配合 `Range` 实现断点续传 |
| `Cache-Control` | — | 请求侧指令，如 `no-cache`、`max-age=0`、`no-store` |
| `Pragma` | — | HTTP/1.0 旧字段，`Pragma: no-cache` 等价于 `Cache-Control: no-cache` |

**三、断点续传相关**

| 头字段 | 方向 | 作用 |
|--------|------|------|
| `Range` | 请求 | 指定字节范围 `bytes=0-1023` |
| `Accept-Ranges` | 响应 | 是否支持断点续传，值 `bytes` |
| `Content-Range` | 响应 | 实际返回范围 `bytes 0-1023/2048` |

**四、配合场景**

```http
# 第一次响应
HTTP/1.1 200 OK
Cache-Control: max-age=60
ETag: "v1"
Last-Modified: Wed, 09 Jul 2026 07:28:00 GMT

# 60 秒内：直接用强缓存（不发请求）

# 60 秒后：发协商请求
GET /style.css HTTP/1.1
If-None-Match: "v1"
If-Modified-Since: Wed, 09 Jul 2026 07:28:00 GMT

# 未变化
HTTP/1.1 304 Not Modified
```

**优先级：** `Cache-Control` > `Expires`；`ETag/If-None-Match` > `Last-Modified/If-Modified-Since`。

## 说说 302 ， 301 ， 304 的状态码

三者都是 3xx 系列状态码，但含义截然不同：301/302 是**重定向**，304 是**缓存命中**。

**1. 301 Moved Permanently（永久重定向）**

资源被永久移到新 URL，搜索引擎和浏览器会**记住新地址**，下次直接访问新 URL，原 URL 不再请求。

- 用于：域名迁移、HTTP → HTTPS 强制跳转、URL 规范化
- **会缓存**：浏览器下次直接跳到新地址
- 搜索引擎会把原 URL 的 SEO 权重转移到新 URL

```http
HTTP/1.1 301 Moved Permanently
Location: https://www.example.com/new-path
```

**2. 302 Found（临时重定向）**

资源临时移到新 URL，搜索引擎**不会**更新索引，下次仍访问原 URL。

- 用于：临时维护页、登录后跳转、A/B 测试
- **默认不缓存**（除非显式加 `Cache-Control`）
- 注意：早期 HTTP/1.0 客户端在 302 时可能把 POST 改成 GET，HTTP/1.1 引入 303 明确这种行为；307 保留原方法

```http
HTTP/1.1 302 Found
Location: https://www.example.com/temp-path
```

**3. 304 Not Modified（缓存命中）**

不是重定向，而是协商缓存命中。表示"你本地缓存的副本还可用，不用重新下载"，**响应体为空**。

- 用于：协商缓存机制
- 由服务端比较 `If-None-Match`/`If-Modified-Since` 后返回

```http
HTTP/1.1 304 Not Modified
ETag: "abc123"
```

**对比：**

| 状态码 | 含义 | 是否缓存 | 是否返回 body | 用途 |
|--------|------|---------|--------------|------|
| 301 | 永久重定向 | 是（更新地址） | 否（带 Location） | 域名迁移、HTTP→HTTPS |
| 302 | 临时重定向 | 否 | 否（带 Location） | 临时跳转、登录跳转 |
| 304 | 协商缓存命中 | 已是缓存场景 | 否 | 减少重复下载 |

**补充 307 / 308：**

- **307 Temporary Redirect**：临时重定向，**保留原请求方法**（POST 仍是 POST）
- **308 Permanent Redirect**：永久重定向，**保留原请求方法**

**注意点：** 301/302 在历史实现中常被简化为"GET 重定向"，如果接口需要保留方法，用 307/308 更安全。

## 常见的 HTTP 请求头和响应头

HTTP 请求头：

1. `User-Agent`: 浏览器或客户端的标识字符串，用于告知服务器发送请求的客户端类型和版本。
2. `Accept`: 告知服务器客户端可以接受的内容类型（MIME 类型），用于指定服务器返回的数据类型。
3. `Content-Type`: 请求消息体的数据类型（MIME 类型），用于指定发送给服务器的数据类型。
4. `Authorization`: 用于进行身份验证，通常在请求头中包含用户凭证，如 Basic Auth 或 Bearer Token。
5. `Referer`: 表示当前请求的来源页面 URL，通常用于防止跨站请求伪造 (CSRF) 攻击。
6. `Cookie`: 包含客户端的会话标识，用于在多个请求间维持状态。
7. `Cache-Control`: 控制请求/响应的缓存策略，如缓存的有效时间、是否强制重新验证等。
8. `Origin`: 指示请求的来源，用于支持跨域请求时进行 CORS 验证。

HTTP 响应头：

1. `Content-Type`: 响应消息体的数据类型（MIME 类型），用于指定返回的数据类型。
2. `Content-Length`: 响应消息体的长度，用于指示客户端正确解析响应内容。
3. `Cache-Control`: 控制响应的缓存策略，如缓存的有效时间、是否强制重新验证等。
4. `Set-Cookie`: 用于在响应头中设置客户端的 Cookie。
5. `Location`: 用于重定向响应，告知客户端新的资源位置。
6. `Access-Control-Allow-Origin`: 用于 CORS 验证，指定允许访问资源的源地址。
7. `ETag`: 用于缓存验证，表示资源的标识符，与 If-None-Match 一起用于条件请求。
8. `Content-Encoding`: 响应消息体的数据编码方式，如 gzip、deflate 等。

## Content-Type

`Content-Type` 是 HTTP 请求和响应头中的一个字段，用于指示消息体的数据类型，即请求或响应中携带的实际数据的格式。

在请求头中，`Content-Type` 用于指示客户端发送给服务器的数据类型，例如：

- `Content-Type: application/json`: 表示请求消息体中的数据是 JSON 格式。
- `Content-Type: application/x-www-form-urlencoded`: 表示请求消息体中的数据是 URL 编码表单数据。浏览器的原生 form 表 单 ， 如 果 不 设 置 enctype 属 性 ， 那 么 最 终 就 会 以 application/x-www-form-urlencoded 方式提交数据。该种方式提交 的数据放在 body 里面，数据按照 key1=val1&key2=val2 的方式进 行编码，key 和 val 都进行了 URL 转码。
- `Content-Type: multipart/form-data`: 表示请求消息体中的数据是一个表单，通常用于上传文件。
- `Content-Type: text/plain`: 表示请求消息体中的数据是纯文本格式。

在响应头中，`Content-Type` 用于指示服务器返回给客户端的数据类型，例如：

- `Content-Type: application/json`: 表示响应消息体中的数据是 JSON 格式。
- `Content-Type: text/html`: 表示响应消息体中的数据是 HTML 格式。
- `Content-Type: image/jpeg`: 表示响应消息体中的数据是 JPEG 图像。
- `Content-Type: application/octet-stream`: 表示响应消息体中的数据是二进制数据，通常用于下载文件。

## HTTP2 的头部压缩算法是怎样的？

HTTP/2 使用 **HPACK** 算法（RFC 7541）压缩头部。HTTP/1.x 每个请求都重复发送大量 Header（User-Agent、Cookie、Accept 等），HPACK 通过静态表、动态表和哈夫曼编码把重复字段压缩到极小。

**核心机制：**

**1. 静态表（Static Table）**

预定义了 61 个最常见的头字段（HTTP/2 修订后扩展到 99 个），如 `:method: GET`、`:path: /`、`accept-encoding: gzip`。客户端只发索引号，不发完整字符串。

```
索引 2 → :method GET
索引 4 → :path /
索引 16 → accept-encoding gzip, deflate
```

**2. 动态表（Dynamic Table）**

连接级共享表，记录本连接已发过的自定义头字段。第一次发送完整字段，后续只发索引。

```
首次：Cookie: sessionId=abc123xyz...（200 字节）
后续：索引 62（仅 1 字节）
```

动态表有容量上限（`SETTINGS_HEADER_TABLE_SIZE`，默认 4096 字节），LRU 淘汰。

**3. 哈夫曼编码（Huffman Coding）**

对字符串字面值做哈夫曼编码，高频字符用短位串、低频字符用长位串，平均能压缩 30%~70%。

**完整压缩流程：**

1. 客户端准备发送的请求头，先按 ASCII 小写化（HPACK 要求字段名小写）
2. 静态表能查到 → 发索引号
3. 静态表查不到但连接动态表里有 → 发动态表索引
4. 都没有 → 发送字面值，并可选择性地加入动态表
5. 字面值用哈夫曼编码压缩

```text
原始头：
  :method: GET
  :path: /index.html
  cookie: sessionId=abc123xyz

压缩后（示意）：
  [索引2]  ← :method GET
  [字面值 :path /index.html，加入动态表]
  [索引62] ← cookie（如果之前发过）
```

**注意：**

- HPACK 是有状态的，连接的两端各自维护一份动态表
- 必须基于单一 TCP 连接，所以 HTTP/2 的多路复用是前提
- HTTP/3 替换为更安全的 **QPACK**（与 HPACK 类似但适配 QUIC 的乱序传输）

## 说一下 HTTP 3.0

HTTP/3 是 HTTP 协议的最新版本（RFC 9114，2022 年正式发布）。它最革命性的变化是**不再使用 TCP，而是基于 Google 提出的 QUIC 协议**，而 QUIC 运行在 UDP 之上。

**为什么放弃 TCP？**

HTTP/2 虽然在应用层做了多路复用，但仍跑在单个 TCP 连接上：

- **TCP 队头阻塞（HOL Blocking）**：TCP 保证数据有序到达，一个包丢失会阻塞后续所有包，包括其他流的数据
- **TCP 握手慢**：建连要 3 次握手 + TLS 1.3 至少 1 RTT
- **连接迁移困难**：手机从 WiFi 切到 4G，IP 变了，TCP 连接就断了

**HTTP/3 = HTTP over QUIC：**

QUIC（Quick UDP Internet Connections）解决上述问题：

1. **基于 UDP**，自己在应用层实现可靠传输、拥塞控制、加密
2. **多路复用无队头阻塞**：每个流独立传输，丢一个包只影响该流，不阻塞其他流
3. **0-RTT / 1-RTT 握手**：QUIC 把传输握手和 TLS 1.3 握手合并，首次连接 1 RTT，复用连接 0 RTT
4. **连接迁移**：用 Connection ID 标识连接，不依赖 IP，网络切换（WiFi→4G）不断连
5. **前向纠错（FEC）**：可选，减少重传
6. **加密内置**：QUIC 强制 TLS 1.3，不能明文传输

**HTTP/3 与 HTTP/2 对比：**

| 特性 | HTTP/2 | HTTP/3 |
|------|--------|--------|
| 传输层 | TCP | QUIC（UDP） |
| 队头阻塞 | TCP 层有 | 无 |
| 握手 | TCP 3 次握手 + TLS | 1 RTT（首次）/ 0 RTT（复用） |
| 连接迁移 | 不支持 | 支持 |
| 头部压缩 | HPACK | QPACK |
| 加密 | 可选（实际多数 TLS） | 强制 TLS 1.3 |
| 拥塞控制 | 内核 TCP | 应用层可定制 |

**部署现状：**

- 主流浏览器（Chrome、Firefox、Edge、Safari）已支持 HTTP/3
- Cloudflare、Google、Facebook 等大厂已大规模部署
- 需要 CDN/服务器支持 UDP 和 QUIC

**握手示意：**

```text
Client → ClientHello (含 QUIC + TLS 1.3) → Server
Client ← ServerHello + 证书 + 密钥 ← Server    （1 RTT）
Client → 加密数据 → Server

# 已连过的连接
Client → 0-RTT 数据（带早期密钥） → Server    （0 RTT）
```

**不足：** UDP 在某些网络环境（公司防火墙、运营商）被限速或拦截，部署仍有阻力；CPU 开销略高（应用层实现可靠传输）。

## OSI 七层模型

OSI（Open Systems Interconnection）参考模型由 ISO 提出，把网络通信划分为 7 层。它是理论模型，实际 TCP/IP 协议栈合并了一些层。

| 层级 | 名称 | 功能 | 典型协议 |
|------|------|------|----------|
| 7 | 应用层（Application） | 为应用提供网络服务接口 | HTTP、HTTPS、FTP、SMTP、DNS、WebSocket |
| 6 | 表示层（Presentation） | 数据格式转换、加密压缩 | TLS/SSL、JPEG、GIF、ASCII |
| 5 | 会话层（Session） | 建立、管理、终止会话 | RPC、NetBIOS、SOCKS |
| 4 | 传输层（Transport） | 端到端通信、可靠性 | TCP、UDP、QUIC |
| 3 | 网络层（Network） | 路由、寻址、转发 | IP、ICMP、OSPF |
| 2 | 数据链路层（Data Link） | 物理寻址、帧传输 | Ethernet、PPP、ARP（介于 2/3 层） |
| 1 | 物理层（Physical） | 比特流传输 | 光纤、网线、无线电波 |

**记忆口诀**（自下而上）：物（物理）数（数据链路）网（网络）传（传输）会（会话）表（表示）应（应用）。

**TCP/IP 四层模型对照：**

| OSI 七层 | TCP/IP 四层 |
|----------|------------|
| 应用、表示、会话 | 应用层 |
| 传输 | 传输层 |
| 网络 | 网络层 |
| 数据链路、物理 | 网络接口层 |

**每层的数据单元：**

- 应用层：消息（Message）/ 数据（Data）
- 传输层：TCP 段（Segment）/ UDP 数据报（Datagram）
- 网络层：IP 数据包（Packet）
- 数据链路层：帧（Frame）
- 物理层：比特（Bit）

**HTTP 在 OSI 中的位置：**

- HTTP 工作在第 7 层（应用层）
- HTTPS 中的 TLS 工作在第 6 层（表示层），提供加密
- HTTP 依赖 TCP（第 4 层）提供可靠传输
- HTTP/3 依赖 QUIC（基于 UDP，第 4 层）

**数据封装过程：**

```
应用层：Data
   ↓ 加 TCP 头
传输层：[TCP][Data]
   ↓ 加 IP 头
网络层：[IP][TCP][Data]
   ↓ 加帧头帧尾
链路层：[Frame Hdr][IP][TCP][Data][FCS]
   ↓
物理层：比特流
```

## 谈一谈http的缺点

虽然 HTTP（Hypertext Transfer Protocol）是现代网络通信的基础之一，但它也存在一些缺点。以下是一些常见的 HTTP 缺点：

1. **无状态：** HTTP 协议是无状态的，每个请求之间没有关联。这意味着服务器无法识别两个请求是否来自同一个客户端，需要额外的机制（如 Cookies 或 Tokens）来维护用户状态。

2. **明文传输：** HTTP 在传输过程中是明文的，容易受到中间人攻击。未加密的通信可能导致敏感信息泄露，因此需要使用 HTTPS 进行加密。

3. **性能：** 在传输大量数据时，HTTP 的性能可能受到影响。每个请求都需要建立连接、发送请求头等，这会导致额外的延迟。这在移动网络或高延迟环境下尤为明显。

4. **单向通信：** HTTP 是一种单向通信协议，只允许客户端发起请求，服务器只能响应。这种单向性可能不适用于一些实时性要求较高的应用场景。

5. **Header 大小：** HTTP 请求和响应的 Header 大小是有限制的，对于包含大量 Header 信息的复杂请求，可能需要进行优化或者采用其他机制。

6. **连接保持问题：** 默认情况下，HTTP 是一种短连接协议，每个请求都需要重新建立连接。虽然 HTTP/1.1 引入了持久连接（Keep-Alive），但仍然存在一些连接保持的管理问题，如连接过早关闭或过度打开的问题。

7. **缺乏推送机制：** HTTP 是一种请求-响应模型，服务器不能主动向客户端推送数据。虽然有一些工具和技术可以模拟推送效果，但它们通常需要使用轮询或长连接等机制。

8. **无法处理复杂的事务：** 在某些场景下，HTTP 无法提供足够的支持，例如，对于需要处理复杂事务和事务回滚的系统，HTTP 可能显得力不从心。

尽管 HTTP 存在这些缺点，但它仍然是互联网通信的基石。为了解决其中一些问题，一些新的协议和技术如 HTTP/2、HTTP/3、WebSocket 等被引入，以提高性能、安全性和实时性。

## TCP和UDP的区别

UDP（User Datagram Protocol）和TCP（Transmission Control Protocol）是两种不同的传输层协议，它们在网络通信中有一些显著的区别：

1. **连接性：**
   - **TCP：** 提供面向连接的通信，建立可靠的、全双工的连接。在数据传输前，必须经过三次握手建立连接，保证数据的可靠性，然后通过四次挥手关闭连接。
   - **UDP：** 无连接的通信，发送数据前不需要建立连接，也不保证可靠性。每个UDP数据包都是一个独立的数据单元，相互之间没有关联。

2. **可靠性：**
   - **TCP：** 提供可靠的数据传输，通过序列号、确认和重传机制来确保数据的完整性和有序性。如果数据包丢失或损坏，TCP会尝试重新发送。
   - **UDP：** 不保证可靠性，数据包可能会丢失或到达顺序可能被打乱。UDP更适用于实时性要求较高的应用，如音视频传输。

3. **数据流：**
   - **TCP：** 提供面向字节流的通信，数据被视为字节流，确保有序且不丢失。
   - **UDP：** 数据被分割成数据包，每个数据包都是独立的，UDP对数据包的处理更为简单。

4. **开销：**
   - **TCP：** 需要较多的开销来维护连接状态、序列号、确认等，适用于要求可靠性和完整性的应用。
   - **UDP：** 开销较小，适用于实时性要求高、可以容忍一些数据丢失的应用。

5. **应用场景：**
   - **TCP：** 适用于需要可靠传输的应用，如文件传输、网页访问等。
   - **UDP：** 适用于实时性要求高、可以容忍一些数据丢失的应用，如音视频传输、在线游戏等。

总体而言，选择使用TCP还是UDP取决于具体的应用需求。TCP适用于对数据可靠性有较高要求的场景，而UDP适用于实时性要求高、对数据完整性要求相对较低的场景。

## http/https协议总结

HTTP 与 HTTPS 是 Web 通信的核心协议，下面对两者做整体总结对比。

**1. HTTP 协议要点**

- 应用层、基于 TCP（HTTP/3 用 QUIC/UDP）
- 无状态、请求-响应模型
- 默认端口 80
- 报文：请求行/状态行 + 头部 + 空行 + 主体
- 方法：GET/POST/PUT/DELETE/PATCH/HEAD/OPTIONS
- 状态码：1xx 信息、2xx 成功、3xx 重定向、4xx 客户端错误、5xx 服务端错误
- 版本：HTTP/0.9 → 1.0 → 1.1 → 2 → 3

**2. HTTPS 协议要点**

- HTTP + TLS/SSL
- 默认端口 443
- 加密（防窃听）+ 完整性校验（防篡改）+ 数字证书（防冒充）
- 握手增加 1-2 RTT（TLS 1.3 减为 1 RTT，0-RTT 复用）
- 证书由 CA 签发，Let's Encrypt 等可免费申请

**3. 对比表**

| 维度 | HTTP | HTTPS |
|------|------|-------|
| 端口 | 80 | 443 |
| 传输 | 明文 | 加密（TLS） |
| 证书 | 不需要 | 需要（CA 签发） |
| 性能 | 快（无握手） | 多 1-2 RTT 握手 + 加解密开销 |
| 安全 | 不安全（易被窃听/篡改） | 安全 |
| SEO | 一般 | 略优（搜索引擎偏好） |
| 成本 | 0 | 证书（现已可免费）+ 服务器 CPU |

**4. 关键机制回顾**

- **缓存**：强缓存（`Cache-Control: max-age`）+ 协商缓存（`ETag` / `Last-Modified`，返回 304）
- **持久连接**：`Connection: keep-alive`（HTTP/1.1 默认）
- **Cookie/Session**：维持登录态
- **CORS**：跨域资源共享
- **内容协商**：`Accept`、`Content-Type`
- **分块传输**：`Transfer-Encoding: chunked`
- **断点续传**：`Range`、`Content-Range`
- **压缩**：`Accept-Encoding: gzip, br`

**5. 现代演进**

- HTTP/2：二进制分帧、多路复用、HPACK 头部压缩、Server Push
- HTTP/3：基于 QUIC（UDP），0-RTT、无队头阻塞、连接迁移
- TLS 1.3：握手简化到 1-RTT，废弃了不安全的算法（RSA、SHA-1）

**6. 实践建议**

- 全站 HTTPS，HTTP 强制 301 跳转到 HTTPS
- 启用 HTTP/2（前提是 TLS）
- 静态资源上 CDN，带 hash 长缓存
- 接口设合理 Cache-Control
- 关键 Cookie 设 `HttpOnly + Secure + SameSite`
- 启用 HSTS：`Strict-Transport-Security: max-age=31536000`

## 正向代理和反向代理

代理（Proxy）是位于客户端与目标服务器之间的中间节点。两者都"代为转发请求"，但**代理的对象不同**：

- **正向代理**：代理**客户端**，服务器不知道真实客户端是谁
- **反向代理**：代理**服务端**，客户端不知道真实服务器是谁

**一、正向代理（Forward Proxy）**

```
[客户端] → [正向代理] → [目标服务器]
```

- 代理的是客户端，服务器看到的请求方是代理服务器
- 客户端要**主动配置**代理地址（或 PAC、系统代理）
- 用于：突破访问限制（翻墙）、隐藏真实 IP、公司上网行为管理、缓存加速

**典型场景：**

- 公司内网通过 Squid 代理上网
- VPN / 翻墙工具
- 开发时用 Charles / Fiddler 抓包

**示例（Nginx 正向代理）：**

```nginx
server {
  listen 8080;
  location / {
    resolver 8.8.8.8;
    proxy_pass $scheme://$http_host$request_uri;
  }
}
```

**二、反向代理（Reverse Proxy）**

```
[客户端] → [反向代理] → [后端服务器集群]
```

- 代理的是服务端，客户端以为反向代理就是目标服务器
- 客户端**无需配置**，对用户透明
- 用于：负载均衡、缓存、安全隔离、SSL 卸载、灰度发布、限流

**典型场景：**

- Nginx 做负载均衡分发到多台后端
- CDN 节点是反向代理
- 网站入口网关（API Gateway）
- 隐藏后端真实 IP

**示例（Nginx 反向代理 + 负载均衡）：**

```nginx
upstream backend {
  server 192.168.1.10:8080;
  server 192.168.1.11:8080;
  server 192.168.1.12:8080 backup;
}

server {
  listen 80;
  server_name www.example.com;
  location / {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

**三、对比**

| 对比项 | 正向代理 | 反向代理 |
|--------|----------|----------|
| 代理对象 | 客户端 | 服务端 |
| 配置方 | 客户端 | 服务端 |
| 服务器是否感知 | 知道代理但不知真实客户端 | 直接面对的就是代理 |
| 客户端是否感知 | 知道用了代理 | 不感知 |
| 主要用途 | 突破封锁、隐藏 IP、缓存 | 负载均衡、安全、缓存 |

**反向代理能做的事：**

- 负载均衡（Round Robin、IP Hash、最少连接）
- 健康检查（心跳）
- SSL 卸载（外网 HTTPS，内网 HTTP）
- 静态资源缓存
- 限流、熔断、WAF
- 灰度发布、A/B 测试路由

## DNS如何工作的

DNS（Domain Name System）是一种用于将域名映射到IP地址的分布式命名系统。DNS的工作涉及多个组件，包括客户端、本地DNS服务器、根域名服务器、顶级域名服务器和授权域名服务器。以下是DNS工作的基本过程：

1. **域名解析请求：** 当用户在浏览器中输入一个域名（例如，www.example.com）并按下Enter键时，计算机首先尝试查找这个域名对应的IP地址。

2. **本地DNS缓存：** 操作系统会首先检查本地的DNS缓存，看是否已经缓存了对应域名的IP地址。如果找到了，就直接使用缓存的IP地址。

3. **本地DNS服务器：** 如果本地缓存中没有找到对应的IP地址，计算机会向本地DNS服务器发起解析请求。本地DNS服务器通常由Internet服务提供商（ISP）提供，也可以是自己配置的其他DNS服务器。

4. **根域名服务器：** 如果本地DNS服务器无法直接解析请求，它将向根域名服务器发送查询。根域名服务器是全球DNS体系的顶级，负责管理顶级域名服务器的IP地址。

5. **顶级域名服务器：** 根域名服务器返回一个指向相应顶级域名服务器的IP地址。例如，在解析www.example.com时，它会指向.com顶级域名服务器。

6. **授权域名服务器：** 顶级域名服务器返回一个指向授权域名服务器的IP地址，负责管理该域的二级域名。在这个例子中，授权域名服务器可能指向管理example.com的域名服务器。

7. **目标域名服务器：** 最终，授权域名服务器返回请求域名的IP地址给本地DNS服务器。本地DNS服务器将这个IP地址缓存，并将其返回给计算机。

8. **计算机：** 最后，计算机得到了域名对应的IP地址，可以使用这个IP地址与目标服务器进行通信。

这个过程中，DNS采用了分布式的设计，将域名解析的任务分散到多个层次的服务器上，以提高效率和可靠性。每个层次的DNS服务器都负责管理一部分域名系统，从而实现了对整个互联网域名系统的管理。

## HTTP/1.0 HTTP1.1 HTTP2.0版本之间的差异

HTTP 协议历经多个版本演进，主要差异在连接管理、性能、特性上。

| 特性 | HTTP/1.0 | HTTP/1.1 | HTTP/2 |
|------|----------|----------|--------|
| 默认连接 | 短连接（每次请求建 TCP） | 持久连接（keep-alive） | 单连接多路复用 |
| 管线化 | 不支持 | 支持（默认不开启，基本废弃） | 多路复用取代 |
| Host 头 | 无 | 必需 | 必需 |
| 请求方法 | GET/POST/HEAD | + PUT/DELETE/OPTIONS/CONNECT/TRACE/PATCH | 同 1.1 |
| 缓存控制 | `Expires`/`Pragma` | + `Cache-Control`、`ETag` | 同 1.1 |
| 状态码 | 基本 | 扩展（如 206、303、307） | 同 1.1 |
| 头部压缩 | 无 | 无 | HPACK |
| 传输格式 | 文本 | 文本 | 二进制帧 |
| Server Push | 无 | 无 | 支持 |
| 流优先级 | 无 | 无 | 支持 |
| 范围请求 | 不支持 | `Range` | 支持 |

**详细对比：**

**1. HTTP/1.0（1996）**

- 每次请求建立独立 TCP 连接，请求完即关闭
- 无 `Host` 头，无法支持虚拟主机
- 缓存仅靠 `Expires`/`Pragma`

```http
GET /index.html HTTP/1.0

HTTP/1.0 200 OK
```

**2. HTTP/1.1（1997，至今最广泛使用）**

- **持久连接**：`Connection: keep-alive` 默认开启，复用 TCP 连接
- **管线化**（Pipelining）：可连续发多个请求不等响应，但实际中浏览器基本禁用（队头阻塞）
- **Host 头**：必填，支持一个 IP 上多个域名（虚拟主机）
- **范围请求**：`Range: bytes=0-1023`，断点续传
- **新方法**：PUT/DELETE/OPTIONS/CONNECT/TRACE
- **新状态码**：303、307、206、409、410 等
- **缓存增强**：`Cache-Control`、`ETag`、`Vary`

```http
GET /index.html HTTP/1.1
Host: www.example.com
Connection: keep-alive

HTTP/1.1 200 OK
Cache-Control: max-age=3600
ETag: "v1"
```

**3. HTTP/2（2015）**

- **二进制分帧**：报文拆成二进制帧
- **多路复用**：一个 TCP 连接并发多个请求，无应用层队头阻塞
- **HPACK 头部压缩**
- **Server Push**：服务器主动推送
- **流优先级**：可设置权重
- **兼容 HTTP/1.1 语义**：方法、状态码、Header 不变

```http
GET /index.html HTTP/2
Host: www.example.com
```

**4. HTTP/3（2022，补充）**

- 基于 QUIC（UDP），无 TCP 队头阻塞
- 0-RTT 握手、连接迁移
- 强制 TLS 1.3

**演进趋势：** 每个版本主要解决前版的性能瓶颈——HTTP/1.1 解决短连接，HTTP/2 解决 HTTP 层队头阻塞，HTTP/3 解决 TCP 层队头阻塞。

## HTTP跨域请求时为什么要发送options请求

跨域请求中先发一个 `OPTIONS` 请求是 **CORS（跨域资源共享）** 的预检机制（Preflight）。其目的是：**在正式发送可能对服务器产生副作用的请求前，先询问服务器是否允许这次跨域请求。**

**触发条件：非简单请求**

满足任一条件即触发预检：

1. 方法不是 `GET`、`HEAD`、`POST`
2. 自定义头（除 `Accept`、`Accept-Language`、`Content-Language`、`Content-Type`、`Range`）
3. `Content-Type` 不是 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`
4. `XMLHttpRequestUpload` 注册了事件
5. 使用 `ReadableStream`

**典型触发场景：**

```js
// POST JSON 是最常见触发
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Tom' })
})
```

**预检流程：**

```http
# 1. 预检请求
OPTIONS /users HTTP/1.1
Origin: https://www.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

# 2. 预检响应
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://www.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400     # 预检结果缓存一天

# 3. 真正请求
POST /users HTTP/1.1
Origin: https://www.example.com
Content-Type: application/json
Authorization: Bearer xxx

{"name":"Tom"}
```

**为什么要先问？**

1. **保护服务器**：非简单请求可能修改服务器数据（POST/PUT/DELETE），先确认服务器允许跨域再发，避免无意中执行副作用
2. **避免浏览器无谓发送 body**：预检只发头不发 body，确认通过后才发完整请求
3. **统一权限控制**：服务器通过 `Access-Control-Allow-*` 头声明跨域策略

**优化：减少预检次数**

- 尽量使用简单请求（`Content-Type: application/x-www-form-urlencoded`）
- 不带多余自定义头
- 服务端设较长 `Access-Control-Max-Age`（如 86400 秒）让浏览器缓存预检结果
- 把跨域请求做成同域（同源部署 + 反向代理）

## SSL 连接断开后如何恢复

SSL/TLS 连接断开后，重新建立完整握手代价大（1-2 RTT + 加密运算），因此提供了**会话恢复（Session Resumption）** 机制，让断线重连更快。

**1. Session ID（会话 ID 复用，TLS 1.0 引入）**

- 首次握手时，服务器生成一个 Session ID，并在 ServerHello 中返回
- 服务器在自己的缓存里保存会话信息（密钥、加密套件等）
- 客户端断线重连时，在 ClientHello 中带上 Session ID
- 服务器在缓存中找到该 Session ID → 跳过密钥协商，只做 1 RTT 的简短握手

```text
Client → ClientHello (SessionID=abc) → Server
Client ← ServerHello (SessionID=abc) + ChangeCipherSpec ← Server
Client → Finished → Server
```

**缺点：**

- 服务器要保存所有会话状态，分布式环境下要在多台服务器间共享（如用 Redis）
- 服务器内存压力大
- Session ID 明文传输，理论上可被关联

**2. Session Ticket（会话票据，TLS 1.2 引入）**

- 首次握手时，服务器把会话信息加密成一张 Ticket（用只有服务器知道的密钥），通过 `NewSessionTicket` 消息发给客户端
- 客户端保存 Ticket
- 重连时在 ClientHello 中带上 SessionTicket 扩展
- 服务器用自己的密钥解密 Ticket，恢复会话状态 → 1 RTT 完成

```text
首次握手末尾：
  Server → NewSessionTicket (加密的 Ticket) → Client

重连：
  Client → ClientHello + SessionTicket → Server
  Client ← ServerHello + ChangeCipherSpec ← Server
  Client → Finished → Server
```

**优点：**

- 服务器无状态，不需要保存会话（stateless）
- 易于横向扩展，任何一台服务器只要持有相同密钥都能解密

**3. PSK（Pre-Shared Key，TLS 1.3 引入）**

- TLS 1.3 简化握手，复用上次的 PSK 身份
- 支持 **0-RTT** 握手：客户端在第一个包里就带上加密的应用数据

```text
首次握手：
  Client → ClientHello → Server
  Client ← ServerHello + 证书 + Finished ← Server
  Client → Finished → Server

0-RTT 重连：
  Client → ClientHello + EarlyData → Server    （数据直接发出去）
```

**0-RTT 注意事项：**

- 有**重放攻击**风险：攻击者截获 0-RTT 数据包重复发送
- 不要在 0-RTT 中执行非幂等操作（如转账）
- 服务端可选择性禁用 0-RTT

**总结：** 现代浏览器和服务器默认优先尝试会话恢复，能显著降低断线重连延迟。

## 介绍一下HTTPS和HTTP区别

HTTP 与 HTTPS 的核心区别在于：HTTPS = HTTP + TLS/SSL 加密层。

| 维度 | HTTP | HTTPS |
|------|------|-------|
| 全称 | HyperText Transfer Protocol | HTTP Secure / HTTP over TLS |
| 端口 | 80 | 443 |
| 传输内容 | 明文 | 加密（TLS） |
| 是否需要证书 | 否 | 需要 CA 签发的证书 |
| 安全性 | 不安全，易被窃听、篡改、冒充 | 加密 + 完整性校验 + 身份认证 |
| 性能 | 握手快（仅 TCP） | 多 1-2 RTT 握手 + 加解密开销 |
| SEO | 一般 | 搜索引擎优先收录 |
| 浏览器提示 | "不安全" 标识 | "安全锁" 标识 |
| HSTS | 不适用 | 可强制只用 HTTPS |
| 成本 | 0 | 证书（可免费）+ 服务器 CPU |

**架构差异：**

```
HTTP：        应用层（HTTP） → 传输层（TCP）
HTTPS：       应用层（HTTP） → 安全层（TLS） → 传输层（TCP）
```

**安全层面：**

- **加密**：HTTP 明文传输，HTTPS 用对称密钥加密内容
- **完整性**：HTTP 无校验，HTTPS 用 MAC 防止中间人篡改
- **身份认证**：HTTP 无身份验证，HTTPS 通过数字证书验证服务器身份

**性能层面：**

- HTTPS 多出 TLS 握手（1-2 RTT，TLS 1.3 减为 1 RTT）
- 加解密 CPU 开销（现代硬件 + TLS 1.3 已基本可忽略）
- 服务器开启 Session Resumption / 0-RTT 可降低延迟

**实际部署：**

- 全站 HTTPS + HTTP 强制 301 跳转到 HTTPS
- 启用 HSTS（`Strict-Transport-Security`），避免降级攻击
- 用 Let's Encrypt 免费申请证书
- OCSP Stapling 减少 TLS 握手延迟
- 启用 HTTP/2（前提是 HTTPS）

**典型响应头：**

```http
# HTTP
HTTP/1.1 200 OK
Content-Type: text/html

# HTTPS
HTTP/1.1 200 OK
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'
Content-Type: text/html
```

**结论：** 现代 Web 全站 HTTPS 已是标配，HTTP 只在开发/内网中使用。

## 谈一谈HTTP数据传输

HTTP 数据传输涉及：报文格式、内容协商、压缩、分块、范围请求、编码等机制。

**1. 报文结构**

```http
GET /api HTTP/1.1
Host: example.com          ← 起始行 + 头部
                            ← 空行
{"name":"Tom"}             ← 主体（可选）
```

**2. 内容协商（Content Negotiation）**

客户端通过 `Accept*` 头告诉服务器自己需要什么格式：

```http
Accept: application/json, text/html
Accept-Language: zh-CN, en;q=0.8
Accept-Encoding: gzip, br
Accept-Charset: utf-8
```

服务器响应实际采用的格式：

```http
Content-Type: application/json; charset=utf-8
Content-Language: zh-CN
Content-Encoding: gzip
```

**3. 数据压缩**

- 文本：gzip / deflate / br（Brotli，压缩率更高）
- 图片：用 WebP / AVIF / JPEG-XL（编码层压缩，与 HTTP 无关）
- 服务端启用：Nginx `gzip on; gzip_types text/css application/javascript;`

```http
Accept-Encoding: gzip, br
Content-Encoding: gzip
```

**4. 分块传输（Chunked Transfer）**

响应数据长度未知时（如流式输出、SSE），用 `Transfer-Encoding: chunked` 分块发送：

```http
HTTP/1.1 200 OK
Transfer-Encoding: chunked

5\r\n
Hello\r\n
7\r\n
, world\r\n
0\r\n
\r\n
```

每个分块前是十六进制长度 + CRLF，0 长度表示结束。

**5. 范围请求（Range Request / 断点续传）**

大文件分多段下载，或下载中断后续传：

```http
# 请求
Range: bytes=0-1023

# 响应
HTTP/1.1 206 Partial Content
Content-Range: bytes 0-1023/10240
Content-Length: 1024
Accept-Ranges: bytes
```

**6. 表单数据编码**

- `application/x-www-form-urlencoded`：`key=val&key=val`
- `multipart/form-data`：分段上传文件
- `application/json`：现代 API 最常用

```http
Content-Type: multipart/form-data; boundary=----xyz

------xyz
Content-Disposition: form-data; name="file"; filename="a.jpg"
Content-Type: image/jpeg

<二进制数据>
------xyz--
```

**7. 内容类型（MIME）**

`Content-Type` 指定数据格式，浏览器据此选择处理方式：

```
text/html              渲染为网页
application/json       交给 JS 解析
image/jpeg             显示图片
application/octet-stream  下载
application/pdf         预览 PDF
```

**8. 持久连接与管道化**

HTTP/1.1 默认 `Connection: keep-alive`，一个 TCP 连接可发多个请求；HTTP/2 进一步多路复用。

**9. 数据流向**

- 请求：客户端 → 服务端
- 响应：服务端 → 客户端
- Server Push（HTTP/2）：服务端主动推
- WebSocket：双向全双工

## 谈一谈队头阻塞问题

**队头阻塞（Head-of-Line Blocking，HOL Blocking）** 指在一个有序队列中，队首的请求/数据包被阻塞时，后面所有请求/包都被卡住，无法前进。

HTTP 发展史就是一部对抗队头阻塞的历史。分为两层：

**1. HTTP 层队头阻塞（HTTP/1.1）**

HTTP/1.1 默认持久连接，一个 TCP 连接串行处理请求-响应。如果第一个请求响应慢，后续请求只能等。

**问题：**

```
请求1 ────────慢─────► 响应1
请求2                  等待响应1才能发送
请求3                  等待响应1才能发送
```

**HTTP/1.1 的"管线化"（Pipelining）：** 允许连续发多个请求，但响应必须按序返回，第一个响应慢仍阻塞后续响应。浏览器基本禁用。

**解决方式：**

- 浏览器对同一域名开 6 个 TCP 连接并行请求（HTTP/1.1 默认上限）
- 用多域名（sharding）部署资源，绕开连接数限制
- 内联关键 CSS、雪碧图减少请求数
- HTTP/2 彻底解决（多路复用）

**2. TCP 层队头阻塞（HTTP/2）**

HTTP/2 在应用层解决了队头阻塞——多个流可并发。但仍跑在**单个 TCP 连接**上：

```
TCP 包 1（流A的数据）─丢失
TCP 包 2（流B的数据）─到达，但被 TCP 重组阻塞
TCP 包 3（流C的数据）─到达，但被 TCP 重组阻塞
```

TCP 保证字节有序，丢一个包，后续到达的包（哪怕属于不同流）都要等丢失的包重传回来才能交付给应用层。这是 **TCP 协议本身的限制**，HTTP/2 无法绕开。

**3. HTTP/3 的解决：彻底无队头阻塞**

HTTP/3 基于 QUIC（UDP）：

- 每个流独立传输，**流与流之间无序**
- 流 A 丢包只阻塞流 A，流 B/C/D 不受影响

```
流A: 包1─丢失 ─ 重传
流B: 包1─已到 ─ 交付应用层
流C: 包1─已到 ─ 交付应用层
```

**4. 各版本对比**

| 版本 | 是否有 HTTP 层 HOL | 是否有 TCP 层 HOL |
|------|-------------------|-------------------|
| HTTP/1.1 | 是 | 是（一个连接多个包） |
| HTTP/2 | 否（多路复用） | 是（TCP 丢包阻塞所有流） |
| HTTP/3 | 否 | 否（QUIC 流独立） |

**5. 实践影响**

- 高丢包率网络（移动端、跨国）下，HTTP/2 性能可能不如 HTTP/1.1 多连接
- HTTP/3 在弱网下优势明显
- 开启 BBR 拥塞控制、合理设拥塞窗口可缓解

## HTTP实体数据

HTTP 实体数据（Entity / Payload）指请求或响应中携带的实际数据（即 body）。围绕实体数据，HTTP 提供了一组头字段来描述其类型、长度、编码、语言、范围等信息。

**1. 实体相关头字段**

| 头字段 | 用途 | 示例 |
|--------|------|------|
| `Content-Type` | 数据的 MIME 类型 | `application/json; charset=utf-8` |
| `Content-Length` | 字节数 | `1024` |
| `Content-Encoding` | 压缩/编码方式 | `gzip`、`br`、`deflate` |
| `Content-Language` | 内容语言 | `zh-CN` |
| `Content-Location` | 实体的替代 URL | `/api/users.json` |
| `Content-MD5` | 实体摘要（已基本废弃，被 TLS 替代） | `Q2hlY2...` |
| `Content-Disposition` | 如何展示（附件下载） | `attachment; filename="a.pdf"` |
| `Content-Range` | 范围响应 | `bytes 0-1023/20480` |
| `Transfer-Encoding` | 传输编码 | `chunked` |
| `Vary` | 缓存键（按这些头区分版本） | `Accept-Encoding` |
| `Allow` | 资源支持的方法 | `GET, POST` |
| `Last-Modified` | 最后修改时间 | `Wed, 09 Jul 2026 07:28:00 GMT` |
| `ETag` | 实体版本标识 | `"abc123"` |
| `Expires` | 实体过期时间 | `Wed, 09 Jul 2026 12:00:00 GMT` |

**2. 数据类型（Content-Type）**

```
text/html                       HTML
text/plain                      纯文本
text/css / text/javascript       样式/脚本
application/json                JSON
application/xml                 XML
application/x-www-form-urlencoded  表单
multipart/form-data             文件上传
application/octet-stream        二进制（默认下载）
application/pdf                 PDF
image/jpeg / image/png / image/webp  图片
video/mp4 / audio/mpeg          音视频
```

**3. 编码（Content-Encoding）**

```http
Accept-Encoding: gzip, br
Content-Encoding: br
```

- `gzip`：最通用
- `deflate`：少用
- `br`（Brotli）：压缩率更高，现代浏览器支持
- `identity`：不压缩

**4. 分块传输（Transfer-Encoding: chunked）**

当响应总大小未知时（流式输出）：

```http
HTTP/1.1 200 OK
Transfer-Encoding: chunked

10\r\n
0123456789ABCDEF\r\n
0\r\n
\r\n
```

**5. 范围请求（Range）**

```http
Range: bytes=0-1023            # 请求
Content-Range: bytes 0-1023/20480  # 响应
Accept-Ranges: bytes
```

**6. 表单上传示例**

```http
POST /upload HTTP/1.1
Content-Type: multipart/form-data; boundary=----xyz
Content-Length: 1234

------xyz
Content-Disposition: form-data; name="title"

Hello
------xyz
Content-Disposition: form-data; name="file"; filename="a.jpg"
Content-Type: image/jpeg

<二进制数据>
------xyz--
```

**总结：** HTTP 实体数据由一组 `Content-*` 头描述，覆盖类型、编码、长度、范围、版本等。配合内容协商，可以让同一资源有多种表示形式。

## HTTP前生今世

HTTP（Hypertext Transfer Protocol）是一种用于传输超文本的协议，是万维网（World Wide Web）的基础。HTTP的发展经历了多个版本，从初始的HTTP/0.9到目前主流的HTTP/1.1和HTTP/2，以及更新的HTTP/3。以下是HTTP的前世今生的简要概述：

### HTTP/0.9（1991年）

- **特点：** 初始版本，仅支持GET请求，没有Header，只能传输HTML。
- **用途：** 用于简单的文本传输，适用于静态网页。

### HTTP/1.0（1996年）

- **特点：** 引入了多种HTTP方法（GET、POST等）、Header、状态码、协议版本号等。
- **用途：** 用于传输更丰富的内容，支持动态生成页面和多媒体文件。

### HTTP/1.1（1997年）

- **特点：** 持久连接、管线化、虚拟主机等新特性，提高了性能。
- **用途：** 成为当前主流的HTTP版本，用于绝大多数Web应用。

### HTTP/2（2015年）

- **特点：** 多路复用、头部压缩、服务器推送等新特性，提高了性能和效率。
- **用途：** 通过单一连接并行传输多个资源，减少了加载时间，适用于现代Web应用。

### HTTP/3（2018年）

- **特点：** 基于UDP的QUIC协议，实现更低的延迟和更高的性能。
- **用途：** 在不同网络条件下提供更好的性能，支持实时应用。

### 发展趋势

1. **安全性：** HTTPS的推广和强制，使用TLS/SSL保护通信内容，提高数据传输的安全性。

2. **性能优化：** 不断推出新的协议版本和特性，如HTTP/2、HTTP/3，以提高传输效率和用户体验。

3. **移动端优化：** 针对移动设备的特性进行优化，减少页面加载时间和资源消耗。

4. **Web应用需求：** 随着Web应用的复杂性增加，HTTP协议会不断演进以满足更复杂的业务需求，例如大规模数据传输、实时通信等。

总体而言，HTTP协议的演进是为了适应互联网的不断发展和应对新的挑战。由于Web应用越来越复杂，HTTP协议的性能和安全性一直是关注的焦点。

## HTTP世界全览

HTTP 不是孤立存在的，它存在于一个庞大的生态系统中。从下到上、从硬件到软件，整个 HTTP 世界可以分为几大组成：

**1. 网络分层（数据如何流动）**

```
应用层：    HTTP / HTTPS / WebSocket / DNS
安全层：    TLS / SSL
传输层：    TCP / UDP / QUIC
网络层：    IP / ICMP
数据链路层：Ethernet / Wi-Fi
物理层：    光纤 / 双绞线 / 无线电波
```

**2. 协议族**

- **HTTP/1.0、HTTP/1.1**：经典版本，基于 TCP
- **HTTP/2**：二进制分帧、多路复用、HPACK
- **HTTP/3**：基于 QUIC/UDP，0-RTT
- **HTTPS**：HTTP + TLS
- **WebSocket**：在 HTTP 升级握手后的全双工通信
- **DNS**：域名解析
- **TLS/SSL**：加密层

**3. 关键组件**

| 组件 | 职责 |
|------|------|
| **浏览器**（渲染引擎、JS 引擎）| 发起请求、解析响应、渲染页面 |
| **CDN** | 就近缓存分发静态资源 |
| **反向代理 / 网关**（Nginx、API Gateway）| 负载均衡、限流、SSL 卸载 |
| **应用服务器**（Node、Tomcat、Go）| 业务逻辑 |
| **数据库 / 缓存**（MySQL、Redis）| 数据存储 |
| **DNS 服务器** | 域名 → IP |
| **CA 机构** | 签发数字证书 |

**4. 核心机制**

- **URL**：资源定位
- **方法**：GET/POST/PUT/DELETE/PATCH/HEAD/OPTIONS
- **状态码**：1xx~5xx
- **头部字段**：通用头、请求头、响应头、实体头
- **缓存**：强缓存 + 协商缓存
- **Cookie/Session**：状态管理
- **CORS**：跨域
- **内容协商**：MIME、语言、编码
- **认证**：Basic、Bearer、JWT、OAuth

**5. 性能优化**

- HTTP/2 / HTTP/3
- 多路复用、头部压缩
- 缓存、CDN、压缩、懒加载
- Service Worker、预加载、预连接
- SSR / SSG

**6. 安全**

- HTTPS 加密
- HSTS、CSP
- Cookie `HttpOnly`/`Secure`/`SameSite`
- 防范 XSS、CSRF、SQL 注入、点击劫持
- 限流、防 DDoS

**7. 演进趋势**

- 协议：HTTP/1.1 → HTTP/2 → HTTP/3
- 安全：全站 HTTPS → TLS 1.3
- 边缘计算、Serverless、Edge Functions
- 实时通信：WebSocket、Server-Sent Events、WebRTC

**一句话总结：** HTTP 是互联网的"通用语言"，它依托 TCP/IP 网络栈，配合 DNS、TLS、CDN、Cookie、缓存等机制，构成了我们看到的 Web 世界。

## HTTP分层

HTTP 是一个分层的系统：一方面它本身处在 OSI/TCP-IP 网络分层中；另一方面 HTTP 处理流程在工程实现上也常被分层。

**1. 网络协议分层（HTTP 在协议栈中的位置）**

```
应用层：      HTTP / WebSocket / DNS
安全层：      TLS / SSL（HTTPS 才有）
传输层：      TCP / UDP / QUIC
网络层：      IP / ICMP
数据链路层：  Ethernet / ARP / Wi-Fi
物理层：      双绞线 / 光纤 / 无线电
```

**OSI 七层与 TCP/IP 四层对照：**

| OSI 七层 | TCP/IP 四层 | 典型协议 |
|----------|------------|---------|
| 应用、表示、会话 | 应用层 | HTTP、HTTPS、DNS、FTP |
| 传输 | 传输层 | TCP、UDP、QUIC |
| 网络 | 网络层 | IP、ICMP |
| 数据链路、物理 | 网络接口层 | Ethernet、Wi-Fi |

**2. HTTP 自身的处理分层（应用架构）**

现代 Web 服务通常分多层：

```
┌─────────────────────────────────────┐
│  CDN / 反向代理（Nginx）            │ ← 接入层：TLS 卸载、缓存、限流
├─────────────────────────────────────┤
│  API Gateway（网关）                │ ← 鉴权、路由、聚合
├─────────────────────────────────────┤
│  BFF / 业务服务                      │ ← 业务编排
├─────────────────────────────────────┤
│  基础服务（用户、订单、支付）         │ ← 领域服务
├─────────────────────────────────────┤
│  数据层（MySQL、Redis、ES）          │ ← 持久化
└─────────────────────────────────────┘
```

每一层职责：

- **接入层**：处理 HTTPS、负载均衡、限流、防火墙
- **网关层**：路由、鉴权、协议转换
- **业务层**：业务逻辑
- **服务层**：领域服务，可独立部署
- **数据层**：存储

**3. 浏览器端分层（渲染进程内）**

```
网络线程（发请求）
   ↓
HTML 解析器 → DOM
CSS 解析器 → CSSOM
   ↓
渲染树 → 布局 → 绘制 → 合成
   ↓
JS 引擎（V8）执行脚本
```

**4. 分层的好处**

- **解耦**：每层只关心自己的职责
- **复用**：HTTP 可基于 TCP 也可基于 QUIC
- **可替换**：TLS 1.2 → 1.3、HTTP/1.1 → HTTP/2 升级不影响上层
- **可测试**：每层独立测试

**5. 跨层数据封装**

```
[HTTP 报文]
   ↓ + TCP 头
[TCP 段]
   ↓ + IP 头
[IP 包]
   ↓ + 帧头
[以太网帧]
   ↓
[比特流]
```

每一层加自己的头部，对等层只看自己的头。

## HTTP报文是什么样子

HTTP报文是在客户端和服务器之间传输的数据块，它包括请求报文和响应报文。以下是HTTP请求和响应报文的一般结构：

### HTTP请求报文

一个HTTP请求报文通常由以下部分组成：

1. **请求行（Request Line）：** 包含HTTP方法（GET、POST等）、请求的URL和使用的协议版本。

   ```
   GET /path/to/resource HTTP/1.1
   ```

2. **请求头部（Request Headers）：** 包含关于请求的附加信息，如Host、User-Agent、Content-Type等。

   ```
   Host: www.example.com
   User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36
   Content-Type: application/json
   ```

3. **空行（CRLF）：** 表示请求头部的结束，用一个空行（回车换行符）分隔请求头部和请求体。

   ```
   (空行)
   ```

4. **请求体（Request Body）：** 对于一些HTTP方法（如POST、PUT），可以包含请求的数据。

   ```
   {"key": "value"}
   ```

### HTTP响应报文

一个HTTP响应报文通常由以下部分组成：

1. **状态行（Status Line）：** 包含协议版本、状态码和状态消息。

   ```
   HTTP/1.1 200 OK
   ```

2. **响应头部（Response Headers）：** 包含关于响应的附加信息，如Server、Content-Type、Content-Length等。

   ```
   Server: Apache/2.4.38 (Unix)
   Content-Type: text/html; charset=UTF-8
   Content-Length: 1234
   ```

3. **空行（CRLF）：** 表示响应头部的结束，用一个空行（回车换行符）分隔响应头部和响应体。

   ```
   (空行)
   ```

4. **响应体（Response Body）：** 包含服务器返回的数据。

   ```
   <html>
     <head>
       <title>Hello, World!</title>
     </head>
     <body>
       <h1>Hello, World!</h1>
     </body>
   </html>
   ```

上述结构是HTTP报文的基本组成部分，实际的报文内容和头部字段会根据具体的请求或响应而有所变化。HTTP报文的设计是为了传输和描述Web页面及其相关资源的信息。

## HTTP之URL

URL（Uniform Resource Locator，统一资源定位符）是 URI 的子集，用于标识互联网上资源的位置和访问方式。HTTP URL 是 HTTP 请求的核心。

**1. URL 的完整结构**

```
http://user:pass@www.example.com:8080/path/to/file?key=value&x=1#fragment
└─┬─┘└────┬────┘└──────┬───────┘└┬┘└──────┬──────┘└──────┬───────┘└──┬───┘
 协议    用户信息        域名       端口    路径          查询字符串    锚点
```

| 部分 | 说明 | 示例 |
|------|------|------|
| `scheme` | 协议 | `http`、`https`、`ftp`、`ws` |
| `userInfo` | 用户凭证（基本已废弃） | `user:pass@` |
| `host` | 主机名（域名或 IP） | `www.example.com` |
| `port` | 端口 | `80`、`443`、`8080` |
| `path` | 资源路径 | `/api/users/123` |
| `query` | 查询参数 | `?key=value&x=1` |
| `fragment` | 锚点（仅客户端用，不发到服务器） | `#section1` |

**默认端口：** HTTP 默认 80，HTTPS 默认 443，省略不写。

**2. URL 编码（百分号编码）**

URL 中只能出现 ASCII 字符集的子集，特殊字符和中文字符必须编码：

- 保留字符：`;`、`,`、`/`、`?`、`:`、`@`、`&`、`=`、`+`、`$`、`#`
- 不安全字符：空格、`<`、`>`、`"`、`{`、`}` 等
- 中文：UTF-8 编码后百分号编码

```js
encodeURIComponent('Tom & Jerry 中文')
// "Tom%20%26%20Jerry%20%E4%B8%AD%E6%96%87"
```

**3. URL 长度限制**

- HTTP 规范未规定 URL 最大长度
- 浏览器实际限制：Chrome 2MB、IE 2083 字符
- 服务器通常限制 8KB
- POST 请求的 body 没有这个限制（这也是大参数用 POST 的原因之一）

**4. URI / URL / URN 的关系**

- **URI（Uniform Resource Identifier）**：统一资源标识符（最广义）
- **URL**：通过位置定位资源（`http://...`、`ftp://...`）
- **URN**：通过名称定位资源（`urn:isbn:0451450523`）

URL 和 URN 都是 URI 的子集。

**5. URL 与 HTTP 请求的关系**

```http
GET /api/users/123?fields=name,email HTTP/1.1
Host: www.example.com
```

- `Host` 头对应 URL 的 `host:port`
- 请求行的 path 对应 URL 的 `path?query`
- `fragment` 永远不会发给服务器

**6. 绝对 URL 与相对 URL**

```
绝对：https://www.example.com/api/users
相对：/api/users          （同协议同 host）
相对：users/123            （相对当前路径）
相对：//cdn.example.com/x.js  （同协议，跨 host）
```

**7. URL 重写（SEO 友好）**

```
传统：https://example.com/article.php?id=123
友好：https://example.com/article/123.html
```

通过服务器重写规则或前端路由实现。

## HTTP协议的主要特点

简单快速、灵活、无连接、无状态

## HTTP报文的组成部分

HTTP 报文是纯文本格式（HTTP/2 之前），分为**请求报文**和**响应报文**两种，结构都是 `起始行 + 头部 + 空行 + 主体`。

**1. 请求报文**

```http
POST /api/login HTTP/1.1            ← 请求行（方法 URI 协议版本）
Host: api.example.com               ← 请求头（多行 key: value）
Content-Type: application/json
Content-Length: 36
Authorization: Bearer eyJhb...
                                       ← 空行（CRLF）
{"username":"tom","password":"123"} ← 请求体（可选）
```

四个部分：

| 部分 | 内容 | 说明 |
|------|------|------|
| 请求行 | `POST /api/login HTTP/1.1` | 方法 + URI + 版本号 |
| 请求头 | `Host`、`Content-Type` 等 | 元数据，每行一个字段 |
| 空行 | `\r\n` | 标记头部结束 |
| 请求体 | JSON/表单/二进制 | GET/HEAD 一般无 body |

**2. 响应报文**

```http
HTTP/1.1 200 OK                     ← 状态行（版本 状态码 短语）
Content-Type: application/json      ← 响应头
Content-Length: 21
Cache-Control: max-age=60
                                       ← 空行
{"token":"xyz"}                     ← 响应体
```

| 部分 | 内容 | 说明 |
|------|------|------|
| 状态行 | `HTTP/1.1 200 OK` | 版本 + 状态码 + 原因短语 |
| 响应头 | `Content-Type` 等 | 元数据 |
| 空行 | `\r\n` | 标记头部结束 |
| 响应体 | HTML/JSON/二进制 | 实际数据 |

**3. 起始行**

- 请求行：`方法 + 空格 + URI + 空格 + 协议版本 + CRLF`
- 状态行：`协议版本 + 空格 + 状态码 + 空格 + 原因短语 + CRLF`

**4. 头部字段格式**

```
Field-Name: value
```

- 字段名大小写不敏感，习惯用 Pascal-Case
- 冒号后建议加空格
- 同名字段可重复出现（如 `Set-Cookie`），也可用逗号合并
- 头部按出现顺序处理，但语义上无先后

**5. 常见的请求头**

```
Host: www.example.com          # 目标主机（HTTP/1.1 必填，支持虚拟主机）
User-Agent: Mozilla/5.0        # 客户端标识
Accept: application/json       # 期望的内容类型
Accept-Encoding: gzip, br      # 期望的压缩方式
Cookie: sessionId=abc          # Cookie
Authorization: Bearer xxx      # 身份凭证
Content-Type: application/json # 主体类型
Content-Length: 36              # 主体字节数
Origin: https://www.example.com # 来源（CORS）
Referer: https://www.example.com/ # 来源页面
```

**6. 常见的响应头**

```
Content-Type: text/html; charset=utf-8
Content-Length: 1234
Content-Encoding: gzip
Cache-Control: max-age=3600
Set-Cookie: sessionId=abc; HttpOnly
ETag: "v1"
Location: https://example.com/new  # 重定向
Access-Control-Allow-Origin: *
Server: nginx/1.20
```

**7. 主体**

- 可为空（GET、HEAD、204、304 等）
- 可为任意字节序列：文本、JSON、HTML、图片、二进制流
- `Content-Length` 表示字节长度，未知长度可用 `Transfer-Encoding: chunked` 分块发送

**8. HTTP/2 的差异**

HTTP/2 报文本身仍是 HTTP 语义，但传输时被拆成二进制帧（Headers 帧、Data 帧），HPACK 压缩头部，不再是纯文本行。

## 持久链接/http长链接

**持久连接（Persistent Connection，又称 HTTP 长连接）** 指 TCP 连接在完成一次请求-响应后**不立即关闭**，而是被后续多个请求复用，避免每次请求都重新建连。

**1. 演进**

- **HTTP/1.0**：默认短连接，每次请求都要 `TCP 三次握手`，完了 `四次挥手`。可通过 `Connection: keep-alive` 显式开启
- **HTTP/1.1**：默认持久连接，`Connection: keep-alive` 是默认行为；要关闭用 `Connection: close`
- **HTTP/2**：单一持久连接 + 多路复用，所有请求复用同一条连接

**2. 短连接 vs 长连接**

```text
短连接（HTTP/1.0 默认）
  TCP握手 → 请求1 → 响应1 → TCP关闭
  TCP握手 → 请求2 → 响应2 → TCP关闭
  （每次都付握手开销）

长连接（HTTP/1.1 默认）
  TCP握手 → 请求1 → 响应1 → 请求2 → 响应2 → ... → TCP关闭
  （握手只付一次）
```

**3. 控制头**

```http
# 客户端请求
Connection: keep-alive        # 期望复用连接
Keep-Alive: timeout=5, max=100   # 期望的超时与最大请求数（非标准但常见）

# 服务端响应
Connection: keep-alive
Keep-Alive: timeout=5
```

- `timeout`：服务端保持空闲连接的最长时间（秒）
- `max`：连接上允许的最大请求数，达到后关闭

**4. 优点**

- **减少握手开销**：不用每次 TCP 三次握手 + 慢启动
- **降低延迟**：首个请求后，后续请求几乎无建连延迟
- **减少服务端 socket 资源消耗**：同一连接复用，不必维护大量短连接
- **利于 QoS**：TCP 拥塞窗口能积累到合理大小

**5. 缺点与注意点**

- **队头阻塞**：HTTP/1.1 长连接上请求-响应仍串行，前一个慢，后续全等
- **连接占用资源**：长时间空闲的连接占用服务端内存/文件描述符
- **超时关闭**：服务端通常设 `keepalive_timeout`（如 Nginx 默认 75s），空闲超时自动关闭
- **TCP Keep-Alive 与 HTTP Keep-Alive 不是一回事**：
  - HTTP Keep-Alive 是应用层概念，控制连接复用
  - TCP Keep-Alive 是传输层探测机制（`SO_KEEPALIVE`），检测对端是否还活着

**6. Nginx 配置示例**

```nginx
http {
    keepalive_timeout 75s;       # 空闲连接超时
    keepalive_requests 100;      # 单连接最大请求数
}
```

**7. 实际应用**

- 现代浏览器对单域名默认开 6 个长连接并行请求（HTTP/1.1）
- 移动端弱网下长连接优势明显
- HTTP/2 把所有请求都放在同一条长连接上多路复用，进一步发挥长连接的价值

## 长链接中的管线化

**管线化（Pipelining）** 是 HTTP/1.1 在持久连接基础上引入的机制：客户端可以**连续发送多个请求而不必等待每个响应**，服务器按请求顺序返回响应。

**1. 与串行请求的区别**

```text
非管线化（串行）
  请求1 ──► 响应1 ──► 请求2 ──► 响应2 ──► 请求3 ──► 响应3
  ◄────────── 总耗时 = 各 RTT 之和 ──────────►

管线化
  请求1 ──►
  请求2 ──►
  请求3 ──►        响应1 ──► 响应2 ──► 响应3
  ◄─── 总耗时 ≈ 1 个 RTT + 传输时间 ────►
```

理想情况下，N 个请求的总耗时从 `N × RTT` 降到约 `1 × RTT`。

**2. 触发条件**

- 必须基于持久连接（`Connection: keep-alive`）
- 客户端显式启用（不同浏览器实现不同）
- 服务器必须按 FIFO 顺序返回响应

**3. 致命缺陷：响应队头阻塞**

虽然请求可以并发发送，但**响应必须按序返回**。如果第一个请求响应慢，后面的响应即使生成好了也必须等：

```text
请求1（慢）─► 响应1（慢）
请求2（快）─► 等响应1
请求3（快）─► 等响应1
```

这并没有真正解决队头阻塞问题，反而让用户看不到任何中间结果。

**4. 其他限制**

- **幂等性要求**：管线化只适合幂等请求（GET、HEAD），POST 等不安全方法不应管线化
- **代理兼容性差**：中间代理可能不识别管线化，导致响应乱序
- **服务器实现复杂**：要正确处理并发请求、按序响应、连接中断时的回滚
- **难以取消请求**：已经发出的请求无法中断

**5. 浏览器现状**

- 现代浏览器（Chrome、Firefox、Edge）**默认禁用管线化**
- HTTP/1.1 时代浏览器改用「多 TCP 连接并行」（每域名 6 个）替代管线化
- HTTP/2 的**多路复用**才真正解决了这个问题：每个请求是一个独立的流，可以乱序响应，无队头阻塞

**6. HTTP/2 多路复用 vs HTTP/1.1 管线化**

| 对比项 | HTTP/1.1 管线化 | HTTP/2 多路复用 |
|--------|----------------|-----------------|
| 传输层 | 一个 TCP 连接，串行字节流 | 一个 TCP 连接，二进制帧 |
| 请求并发 | 可以连续发 | 可以并发发 |
| 响应顺序 | 必须按序 | 可以乱序 |
| 队头阻塞 | 有（响应级） | 无（应用层） |
| 实际使用 | 基本禁用 | 主流方案 |

**总结**：管线化是 HTTP/1.1 试图解决队头阻塞的失败尝试，被 HTTP/2 多路复用取代。

## 常见状态码

HTTP 状态码用三位数字表示服务器对请求的处理结果，按首位分为 5 类。

**1. 五大分类**

| 类别 | 含义 | 典型 |
|------|------|------|
| 1xx | 信息性（请求已接收，继续处理） | 100、101 |
| 2xx | 成功 | 200、201、204、206 |
| 3xx | 重定向 | 301、302、304、307、308 |
| 4xx | 客户端错误 | 400、401、403、404、405、429 |
| 5xx | 服务端错误 | 500、502、503、504 |

**2. 常见状态码详解**

**2xx 成功**

| 状态码 | 含义 | 场景 |
|--------|------|------|
| 200 OK | 请求成功 | 普通 GET/POST |
| 201 Created | 资源创建成功 | POST 创建新资源 |
| 204 No Content | 成功但无 body | DELETE 成功 |
| 206 Partial Content | 范围请求成功 | 断点续传 |

**3xx 重定向 / 缓存**

| 状态码 | 含义 | 场景 |
|--------|------|------|
| 301 Moved Permanently | 永久重定向 | 域名迁移、HTTP→HTTPS |
| 302 Found | 临时重定向 | 登录跳转、临时维护 |
| 304 Not Modified | 协商缓存命中 | 资源未变化，用本地缓存 |
| 307 Temporary Redirect | 临时重定向，保留方法 | 替代 302（POST 不变 GET） |
| 308 Permanent Redirect | 永久重定向，保留方法 | 替代 301 |

**4xx 客户端错误**

| 状态码 | 含义 | 场景 |
|--------|------|------|
| 400 Bad Request | 请求语法/参数错误 | JSON 格式错、必填字段缺失 |
| 401 Unauthorized | 未认证 | 未登录、Token 失效 |
| 403 Forbidden | 已认证但无权限 | 普通用户访问管理员接口 |
| 404 Not Found | 资源不存在 | URL 错误 |
| 405 Method Not Allowed | 方法不允许 | 对只读资源发 POST |
| 408 Request Timeout | 请求超时 | 客户端发送太慢 |
| 409 Conflict | 冲突 | 并发修改 |
| 413 Payload Too Large | 请求体过大 | 上传文件超限 |
| 415 Unsupported Media Type | 不支持的 Content-Type | 接口只接受 JSON |
| 429 Too Many Requests | 限流 | 触发频控 |

**5xx 服务端错误**

| 状态码 | 含义 | 场景 |
|--------|------|------|
| 500 Internal Server Error | 服务器内部错误 | 代码异常 |
| 501 Not Implemented | 不支持该功能 | 未实现的方法 |
| 502 Bad Gateway | 网关错误 | 上游服务挂了 |
| 503 Service Unavailable | 暂时不可用 | 服务维护、过载 |
| 504 Gateway Timeout | 网关超时 | 上游响应超时 |
| 505 HTTP Version Not Supported | 不支持该 HTTP 版本 | — |

**3. 容易混淆的状态码**

- **301 vs 302**：301 永久（浏览器缓存）、302 临时（不缓存）
- **302 vs 307**：302 历史上会把 POST 改成 GET，307 保留原方法
- **401 vs 403**：401 是「你是谁」（未认证），403 是「我知道你但你不让进」（未授权）
- **500 vs 502 vs 504**：500 服务端自己崩了，502 上游崩了，504 上游响应慢
- **200 vs 304**：200 返回完整 body，304 不返回 body（用缓存）

**4. 自定义业务状态码**

RESTful 接口应直接用 HTTP 状态码表达结果，但很多公司会在 body 里再加一层业务码：

```json
HTTP/1.1 200 OK

{ "code": 0, "msg": "ok", "data": {...} }
```

这是工程实践，不属于 HTTP 规范。

## TCP为什么要三次握手

TCP 是**面向连接、可靠传输**的协议，建立连接前必须通过三次握手让双方都确认彼此的收发能力。为什么是三次而不是两次或四次？核心原因是：**双向确认双方收发能力，并同步初始序列号（ISN）**。

**1. 三次握手流程**

```text
客户端                            服务端
  │                                │
  │ ─── SYN, seq=x ──────►         │  ①客户端发起连接
  │                                │
  │ ◄── SYN+ACK, seq=y, ack=x+1 ── │  ②服务端确认并发起反向连接
  │                                │
  │ ─── ACK, ack=y+1 ─────►       │  ③客户端确认服务端的连接
  │                                │
  │     连接建立，可双向传输          │
```

**2. 每次握手的作用**

| 次数 | 作用 |
|------|------|
| 第一次 | 服务端确认：客户端**能发送**，自己**能接收** |
| 第二次 | 客户端确认：服务端**能接收+能发送**，自己也**能发送+能接收** |
| 第三次 | 服务端确认：客户端**能接收**，自己**能发送** |

三次之后，双方都确认了「自己 + 对方」的「收 + 发」能力，连接才真正建立。

**3. 为什么不是两次？（防止历史失效连接）**

RFC 793 给出的核心原因：**防止已失效的旧连接请求重新到达服务端，导致资源浪费。**

```text
1. 客户端发出旧 SYN（seq=x），但因网络延迟滞留
2. 客户端超时，重发新 SYN（seq=x'），正常建立连接并通信完
3. 旧 SYN 终于到达服务端
4. 服务端回 SYN+ACK，如果只两次握手 → 直接建立连接
5. 但客户端根本不想要这条连接，服务端却一直空等，浪费资源
```

有了第三次握手，客户端收到旧 SYN+ACK 时可以发 RST 拒绝，避免服务端误建连接。

**4. 为什么不是四次？（合并优化）**

- 第二次握手时，服务端的 ACK（确认客户端）+ SYN（发起反向连接）可以合并成一个包
- 因此 4 次被压缩为 3 次

**5. 同步初始序列号（ISN）**

TCP 用序列号保证有序、可靠。三次握手让双方互相告知自己的 ISN：
- 客户端 ISN=x，服务端确认 ack=x+1
- 服务端 ISN=y，客户端确认 ack=y+1
- 后续数据基于 ISN 编号，便于重传与去重

**6. 一句话总结**

**三次握手是最小次数，既能双向确认收发能力 + 同步 ISN，又能防止历史失效连接浪费服务端资源。**

## 三次握手过程中可以携带数据吗

**可以，但仅限第三次握手包；前两次不行。**

**1. 前两次为什么不能带数据？**

第一次和第二次握手用于同步序列号、确认收发能力。此时：
- 连接还没建立，对方收到的「数据」无法被正确处理
- 增加被攻击面——攻击者可在 SYN 包里塞大量数据，放大 SYN Flood 拥塞

因此 RFC 793 规定 SYN / SYN+ACK 包只携带 TCP 头，不含应用层数据。

**2. 第三次可以带数据（TCP Fast Open 更进一步）**

第三次握手是客户端发的 ACK 包，此时：
- 客户端已经确认服务端可收发，连接状态变为 ESTABLISHED
- 客户端可以立即在 ACK 包里捎带应用数据，不必再等一次握手结束

```text
第三次握手：
  客户端 ──── ACK + 数据 ──────► 服务端
  服务端收到后直接处理数据
```

这是 **TCP Fast Open（TFO，RFC 7413）** 的核心思想：首次握手后服务端给客户端发一个 Cookie，后续连接客户端在 SYN 包里带上 Cookie + 数据，服务端验证 Cookie 后直接处理数据，实现 0-RTT 发送。

**3. 实践影响**

- 普通 TCP 实现中，第三次 ACK 包默认不携带数据，应用层 `connect()` 返回后再调 `send()`
- HTTP/HTTPS 在 TCP 握手后立即发送请求，相当于「握手后第一个包就是数据」
- TLS 1.3 的 0-RTT 借鉴了类似思想：握手第一个包就带应用数据

**4. 注意**

第三次握手能携带数据是「协议允许」，并不等于「应用程序一定会用」。绝大多数应用层协议仍等握手完整结束再发数据。

## TCP的四次挥手

TCP 是**全双工**通信，断开连接时双方都要独立关闭自己→对方的发送通道，因此需要四次挥手。

**1. 流程**

```text
主动方                              被动方
  │                                   │
  │ ──── FIN, seq=u ────────►        │  ①主动方：我没有数据要发了
  │     (FIN_WAIT_1)                  │  (CLOSE_WAIT)
  │                                   │
  │ ◄─── ACK, ack=u+1 ───────        │  ②被动方：知道了，但我可能还有数据
  │     (FIN_WAIT_2)                  │  (仍可发数据)
  │                                   │
  │ ◄─── FIN, seq=v ────────         │  ③被动方：我也发完了
  │                                   │  (LAST_ACK)
  │                                   │
  │ ──── ACK, ack=v+1 ───────►       │  ④主动方：好的，再见
  │     (TIME_WAIT, 等 2MSL)          │  (CLOSED)
  │                                   │
  │     (CLOSED)                      │
```

**2. 每一次的作用**

| 次数 | 含义 |
|------|------|
| 第一次 | 主动方说「我没数据要发了」(FIN) |
| 第二次 | 被动方回应「知道了」，但可能继续发自己的数据 (ACK) |
| 第三次 | 被动方发完数据，说「我也结束了」(FIN) |
| 第四次 | 主动方回应「再见」(ACK) |

**3. 为什么要四次而不是三次？**

因为 TCP 全双工，两个方向的关闭是独立的：
- 主动方 FIN 只关闭「主动方→被动方」方向
- 被动方回 ACK 后，仍可继续向主动方发数据（半关闭 half-close）
- 被动方数据发完才发 FIN，关闭「被动方→主动方」方向

如果被动方没有待发数据，第二、三次可以合并成 `FIN+ACK`，变成三次挥手。

**4. 关键状态**

- **FIN_WAIT_1**：主动方发了 FIN，等对方 ACK
- **FIN_WAIT_2**：主动方收到 ACK，等对方 FIN（半关闭状态）
- **CLOSE_WAIT**：被动方收到 FIN，等应用层调用 `close()`
- **LAST_ACK**：被动方发了 FIN，等最后一个 ACK
- **TIME_WAIT**：主动方发了最后一个 ACK，等 2MSL 再彻底关闭
- **CLOSED**：完全关闭

**5. 为什么主动方要等 2MSL（TIME_WAIT）？**

MSL（Maximum Segment Lifetime）= 一个 TCP 段在网络中的最长生存时间。

等 2MSL 有两个目的：
1. **保证最后一个 ACK 能到达**：如果主动方的 ACK 丢失，被动方会重发 FIN，主动方重发 ACK，重新计时。等 2MSL 给重发留出时间。
2. **让本次连接的所有报文都消失**：防止延迟到达的旧报文影响下一个新连接（特别是相同四元组的新连接）。

**6. 大量 TIME_WAIT 的危害**

- 每条 TIME_WAIT 占用一个本地端口（四元组），高并发短连接服务器会耗尽端口
- 服务端大量 CLOSE_WAIT 通常是应用层 bug：没正确调用 `close()`，导致连接泄漏

**7. 优化**

- 服务端用 `SO_REUSEADDR` / `SO_REUSEPORT` 复用地址
- 调小 `tcp_fin_timeout`、`tcp_max_tw_buckets`
- 用长连接 / HTTP keep-alive 减少建连断开次数

## HTTP和TCP的不同

HTTP 和 TCP 不是同一层级的协议，HTTP 基于 TCP 之上。两者在职责、抽象层级、特性上都不同。

**1. 所在层级不同**

```
应用层：   HTTP / HTTPS / WebSocket
传输层：   TCP / UDP / QUIC
网络层：   IP
```

- **TCP**：传输层协议，提供端到端的可靠字节流
- **HTTP**：应用层协议，定义客户端和服务器之间如何交换超文本

HTTP 把报文交给 TCP，TCP 把字节流切成段交给 IP。

**2. 核心区别**

| 对比项 | TCP | HTTP |
|--------|-----|------|
| 所在层 | 传输层 | 应用层 |
| 设计目标 | 可靠传输、有序、不丢 | 超文本传输的语义约定 |
| 数据形式 | 字节流（无边界） | 请求-响应报文（有边界） |
| 是否有状态 | 有连接状态（ISN、窗口、序号） | 默认无状态（1.x） |
| 连接模型 | 面向连接（三次握手、四次挥手） | 请求-响应模型 |
| 关注点 | 数据怎么可靠地传过去 | 数据是什么意思、怎么组织 |
| 端口 | 通过端口号区分进程 | 默认端口 80/443 |
| 流量/拥塞控制 | 有（滑动窗口、慢启动、拥塞避免） | 无（依赖 TCP） |
| 是否加密 | 否（需上层 TLS） | HTTP 不加密，HTTPS 加密 |

**3. 关系：HTTP 依赖 TCP**

```text
HTTP 报文（应用层）
    ↓ 交给 TCP 切成段
TCP 段（传输层，加 TCP 头）
    ↓ 交给 IP 切成包
IP 包（网络层）
    ↓
链路层帧
```

- HTTP/1.x、HTTP/2 跑在 TCP 上
- HTTP/3 改用 QUIC（基于 UDP），不再依赖 TCP
- WebSocket 也是先 HTTP 升级握手，之后用 TCP 全双工

**4. 类比理解**

- TCP 像「快递公司」，保证包裹不丢、按序到达，但不管包裹里装什么
- HTTP 像「寄件单的格式规范」，规定寄件人、收件人、内容怎么填
- HTTP 把填写好的「单子」交给 TCP 寄出

**5. HTTP 不关心的（交给 TCP）**

- 数据怎么分片、怎么重传
- 拥塞控制、流量控制
- 连接如何建立、如何断开
- 包的顺序

**6. TCP 不关心的（交给 HTTP）**

- 这个字节流是 GET 还是 POST
- 状态码、Header、Cookie
- 缓存、重定向、CORS

**总结**：TCP 提供底层可靠传输能力，HTTP 在其上构建应用语义。两者是上下层关系，不是替代关系。

## http/2的Server Push有什么优点

**Server Push（服务端推送）** 是 HTTP/2 的特性之一：服务器在客户端请求 HTML 时，**主动**把 HTML 中即将引用的 CSS、JS、图片等资源一并推送过去，客户端不必再发请求等待。

**1. 解决什么问题**

HTTP/1.x 是严格请求-响应模型，客户端必须解析 HTML 后才知道还需要哪些子资源，再发请求：

```text
1. 客户端 ──► GET /index.html
2. 客户端解析 HTML，发现 <link rel="stylesheet" href="app.css">
3. 客户端 ──► GET /app.css
4. 解析 CSS，发现字体...
```

每个资源都多一个 RTT 等待。Server Push 让服务器提前把资源推过去：

```text
1. 客户端 ──► GET /index.html
2. 服务端响应 HTML 的同时，主动推送 app.css、app.js
   （PUSH_PROMISE 帧 + 数据帧）
3. 客户端解析 HTML 时发现需要 app.css，发现已经在本地缓存了，直接用
```

**2. 优点**

1. **减少 RTT 等待**：子资源随首屏 HTML 一起到达，省去单独请求的往返延迟
2. **优化首屏渲染**：CSS、关键 JS 提前到位，加速 FCP/LCP
3. **复用同一连接**：所有推送走同一条 HTTP/2 连接，不必新开 TCP
4. **客户端可控**：客户端可通过 `RST_STREAM` 拒绝推送，已缓存的资源不会被重复推
5. **比内联更好**：内联 CSS 会让 HTML 变大且无法被浏览器缓存；推送的资源是独立资源，可被缓存复用

**3. PUSH_PROMISE 帧机制**

```text
服务端先发 PUSH_PROMISE 帧：声明「我马上要推送 stream ID=X 的 /app.css」
   → 客户端可以拒绝（RST_STREAM）
服务端再发 DATA 帧：推送 app.css 的实际内容
```

PUSH_PROMISE 让客户端有机会拒绝（比如已经缓存了），避免重复传输。

**4. 局限与争议**

- **推送的资源客户端可能已经缓存**：协议层有 `Cache-Digest` 提案缓解，但部署复杂
- **服务端要预测哪些资源会被引用**：策略复杂，推错就浪费带宽
- **多路复用已大幅缩短并发请求时间**：Server Push 的边际收益有限
- **Chrome 在 HTTP/2-Server-Push 上已移除支持**（106+ 版本），改为更激进的 `<link rel="preload">`、`103 Early Hints`
- **HTTP/3 也未广泛实现 Server Push**

**5. 替代方案**

- **`<link rel="preload">`**：在 HTML 里声明预加载关键资源
- **103 Early Hints**：服务器先用 103 状态码返回 `Link` 头，浏览器预加载，再发真正的 200 响应
- **HTTP/2 多路复用本身**：6 个请求的并发上限被解除，子资源可同时请求

**总结**：Server Push 是 HTTP/2 的标志性特性，理论上能减少 RTT、加速首屏，但实践效果有限、部署复杂，逐渐被 preload / Early Hints 取代。面试重点理解原理与机制即可。

## 谈谈你对多路复用的理解

**多路复用（Multiplexing）** 指在**单一 TCP 连接**上同时承载多个独立的请求/响应流，互不阻塞。这是 HTTP/2 相对 HTTP/1.x 最关键的改进之一。

**1. HTTP/1.x 的痛点**

- 浏览器对同一域名默认只开 6 个 TCP 连接
- 6 个连接都用满后，第 7 个请求只能等
- 每条连接内部还是串行请求-响应（队头阻塞）
- 大量 TCP 连接带来握手开销 + 服务端 socket 占用

**2. HTTP/2 的多路复用**

在一条 TCP 连接上，把每个请求/响应拆成**二进制帧（Frame）**，每帧属于一个**流（Stream）**，流之间可以交错传输：

```text
单条 TCP 连接：
┌───────────────────────────────────────────┐
│ Stream 1: Headers帧 ──── Data帧 ──── ... │
│ Stream 3: Headers帧 ─ Data帧 ─ Data帧 ── │
│ Stream 5: ──── Headers帧 ──── Data帧 ──── │
└───────────────────────────────────────────┘
   帧可以交错发送，接收端按 Stream ID 重组
```

- 每个 `Stream` 有唯一 ID（客户端发起的奇数，服务端推送的偶数）
- 帧到达顺序可以是任意的，应用层根据 Stream ID 重新组装
- 流之间互不阻塞：流 1 慢，不影响流 3、5

**3. 帧与流的结构**

```text
HTTP/2 帧：
┌──────────┬──────┬───────┬────────────┬──────────┐
│ Length   │ Type │ Flags │ Stream ID  │ Payload  │
└──────────┴──────┴───────┴────────────┴──────────┘

帧类型：
- HEADERS：传递 HTTP 头部（HPACK 压缩）
- DATA：传递请求/响应体
- RST_STREAM：终止某个流
- SETTINGS、PRIORITY、PUSH_PROMISE 等
```

**4. 解决了什么问题**

| 问题 | HTTP/1.x | HTTP/2 多路复用 |
|------|----------|------------------|
| 同域连接数限制 | 6 个 | 1 个 |
| 应用层队头阻塞 | 有 | 无 |
| TCP 握手开销 | 6 次 | 1 次 |
| 头部重复发送 | 是 | HPACK 压缩 + 共享动态表 |

**5. 仍存在的问题：TCP 层队头阻塞**

HTTP/2 在应用层解决了队头阻塞，但**传输层仍是 TCP**：

```text
TCP 包 1（流A数据）─ 丢失
TCP 包 2（流B数据）─ 到达但被 TCP 重组阻塞
TCP 包 3（流C数据）─ 到达但被 TCP 重组阻塞
```

TCP 保证字节有序，丢一个包后续包都要等重传。这是 HTTP/3 改用 QUIC 的原因：QUIC 在 UDP 上独立维护每个流的可靠性，流之间互不影响。

**6. HTTP/3 的多路复用**

HTTP/3 把流的概念下移到 QUIC：

- 每个 QUIC 流独立可靠传输
- 流 A 丢包只阻塞流 A
- 流 B、C 可以正常交付

| 对比 | HTTP/2 | HTTP/3 |
|------|--------|--------|
| 应用层 HOL | 无 | 无 |
| TCP 层 HOL | 有 | 无 |
| 传输层 | TCP | QUIC（UDP） |
| 流间影响 | 有 | 无 |

**7. 实践影响**

- 现代网站大量资源（HTML/CSS/JS/图片）可以放心并行加载，不必再做域名分片
- 单条 TCP 连接更易优化拥塞窗口、长连接复用
- HTTP/2 多路复用 + HPACK 头部压缩大幅提升弱网下的首屏速度
- 不再做域名分片（多域名反而会让 HPACK 动态表失效，浪费压缩效果）

**总结**：多路复用是 HTTP/2 的核心，把「单连接串行」改成「单连接并发」，彻底解决 HTTP 层队头阻塞，让 6 连接限制成为历史。

## HTTPS加的一层SSL在七层中哪个位置

SSL/TLS 工作在 OSI 七层模型的**表示层（Presentation Layer，第 6 层）**，位于应用层与传输层之间。在 TCP/IP 四层模型里，它被并入应用层。

**1. 在协议栈中的位置**

```text
应用层        HTTP / HTTPS / WebSocket
                  │
                  ▼
              TLS / SSL       ← 在这里
                  │
                  ▼
传输层        TCP / UDP / QUIC
                  │
                  ▼
网络层        IP / ICMP
                  │
                  ▼
数据链路层    Ethernet / ARP
                  │
                  ▼
物理层        光纤 / 双绞线 / 无线电
```

**2. 各模型中的归类**

| 模型 | SSL/TLS 所在层 |
|------|----------------|
| OSI 七层 | 第 6 层：表示层 |
| TCP/IP 四层 | 应用层（合并了应用、表示、会话） |
| 五层协议模型 | 表示层 |

**3. 为什么是表示层？**

表示层的职责：**数据格式转换、加密压缩**。SSL/TLS 干的正是「加密、解密、完整性校验」——把应用层 HTTP 报文加密后再交给 TCP，把 TCP 收到的密文解密后交给应用层。这正符合表示层的定位。

**4. SSL 与 TLS 的关系**

- SSL（Secure Sockets Layer）是网景公司 1995 年提出的早期版本（SSL 1.0/2.0/3.0）
- TLS（Transport Layer Security）是 IETF 在 SSL 3.0 基础上制定的标准化版本，1999 年发布 TLS 1.0
- TLS 1.1（2006）、TLS 1.2（2008）、TLS 1.3（2018）
- 现在说的「HTTPS 中的 SSL」实际上是 TLS，但习惯上仍叫「SSL 证书」

**5. 它对上下层做了什么**

```text
HTTP 应用层数据
   ↓ TLS 加密（对称密钥）+ 完整性 MAC + 加 TLS 头
TLS Record（密文）
   ↓ 切段加 TCP 头
TCP 段
```

- 对**应用层**：透明，HTTP 看不到加密过程，只管把报文交给 TLS
- 对**传输层**：透明，TCP 看到的就是普通字节流，只是内容是密文

**6. 不在传输层的原因**

- TCP 提供可靠传输但**不加密**，无法验证身份
- TLS 是可选的（不是所有应用都需要加密），把它做成传输层的一部分会过于强耦合
- 把加密做成独立一层，可以让 HTTP、FTP、SMTP、WebSocket 等所有应用层协议共用同一套加密能力

**7. 实践影响**

- HTTPS 默认端口 443，HTTP 默认 80
- WebSocket 的 `wss://` 也是 WebSocket over TLS
- HTTP/2 在浏览器中**强制基于 TLS**（即 h2，明文 h2c 仅在服务间使用）
- HTTP/3 直接把 TLS 1.3 内嵌进 QUIC，不再独立成层

## 什么是 WebSocket

**WebSocket** 是 HTML5 引入的**全双工、双向、单连接**通信协议，允许浏览器与服务器之间建立一条持久连接，双方都可以随时主动发数据，弥补了 HTTP 不能主动推送的不足。

**1. 为什么需要 WebSocket**

HTTP 是请求-响应模型，只能客户端发起，服务器不能主动推送：

```text
HTTP 半双工：
  客户端 ──► 请求 ──► 服务端响应 ──► 客户端
  服务端无法主动通知客户端
```

实时场景（聊天、股票、协作、游戏）下，传统方案都有缺陷：

| 方案 | 缺陷 |
|------|------|
| 短轮询（Short Polling） | 间隔查询，延迟高、流量浪费 |
| 长轮询（Long Polling） | 服务端 hold 请求，每个消息占一个连接 |
| SSE（Server-Sent Events） | 只能服务端→客户端单向，文本 |
| iframe 流 | hack，已被淘汰 |

WebSocket 解决这一切：**一条连接，双方都可随时发消息**。

**2. URL 形式**

```text
ws://echo.example.com           ← 明文（类似 HTTP）
wss://echo.example.com          ← 加密（类似 HTTPS，基于 TLS）
```

**3. WebSocket 生命周期**

```text
1. 客户端发起 HTTP 请求（带 Upgrade 头）
   GET /chat HTTP/1.1
   Host: echo.example.com
   Upgrade: websocket
   Connection: Upgrade
   Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
   Sec-WebSocket-Version: 13

2. 服务端返回 101 Switching Protocols
   HTTP/1.1 101 Switching Protocols
   Upgrade: websocket
   Connection: Upgrade
   Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

3. 协议升级成功，连接切换为 WebSocket
   双方通过同一 TCP 连接全双工通信

4. 双方收发「帧」（Frame）
   文本帧、二进制帧、Ping/Pong、Close

5. 任一方可以发送 Close 帧关闭连接
```

**4. JS API**

```js
const ws = new WebSocket('wss://echo.example.com/chat')

ws.onopen = () => {
  console.log('连接已建立')
  ws.send('Hello')
}

ws.onmessage = (e) => {
  console.log('收到消息：', e.data)
}

ws.onerror = (e) => {
  console.error('错误', e)
}

ws.onclose = (e) => {
  console.log('连接关闭', e.code, e.reason)
}

// 主动关闭
ws.close(1000, '客户端主动关闭')
```

**5. 数据帧类型**

| Opcode | 类型 | 用途 |
|--------|------|------|
| 0x0 | Continuation | 分片帧续传 |
| 0x1 | Text | UTF-8 文本 |
| 0x2 | Binary | 二进制数据 |
| 0x8 | Close | 关闭连接 |
| 0x9 | Ping | 心跳请求 |
| 0xA | Pong | 心跳响应 |

**6. 特点**

- **全双工**：双方可同时收发
- **基于 TCP**：可靠传输
- **轻量**：帧头最小仅 2 字节（HTTP 头动辄几百字节）
- **跨域友好**：握手是 HTTP，但仍受同源策略限制（Origin 头校验）
- **支持二进制**：可传 Blob、ArrayBuffer
- **持久连接**：建连一次，长期复用

**7. 应用场景**

- 即时通讯（IM）：微信网页版、Slack、Discord
- 实时协作：在线文档、Figma
- 实时数据：股票、赛事直播、IoT 监控
- 多人游戏：实时同步状态
- 协同编辑、推送通知

**8. 局限**

- 仍是 TCP，弱网下仍有队头阻塞
- 没有内置重连机制（应用层要自己做）
- 没有消息边界之外的元数据（需应用层约定协议）
- 部分代理/防火墙对长连接不友好

**9. 替代方案**

- **SSE（Server-Sent Events）**：单向服务端推送，简单场景适用
- **WebRTC**：P2P 音视频、数据通道
- **HTTP/2 Server Push**：被 preload / Early Hints 替代
- **HTTP Streaming**：分块传输

**总结**：WebSocket 是为实时双向通信设计的协议，通过 HTTP 升级握手建立持久连接，之后用轻量的帧协议全双工通信，是 IM、协作、实时推送场景的首选。

## 理解WebSocket协议的底层原理、与HTTP的区别

WebSocket 通过 **HTTP 升级握手**复用 80/443 端口建立连接，之后切换为独立的二进制帧协议。它在传输层仍基于 TCP，但应用层完全是另一套协议。

**1. 底层原理：握手与帧**

**1.1 升级握手**

客户端用普通 HTTP 请求发起，但带上 `Upgrade` 头：

```http
GET /chat HTTP/1.1
Host: echo.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==    ← 客户端随机数
Sec-WebSocket-Version: 13
Origin: https://www.example.com
Sec-WebSocket-Protocol: chat, superchat         ← 子协议协商
Sec-WebSocket-Extensions: permessage-deflate      ← 扩展协商
```

服务端响应 101：

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
Sec-WebSocket-Protocol: chat
```

- `Sec-WebSocket-Accept` = Base64(SHA1(Sec-WebSocket-Key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"))
- 这个固定 GUID 是 RFC 6455 规定的，让服务端证明自己确实理解 WebSocket
- 服务端响应 101 后，TCP 连接就切换到 WebSocket 协议

**1.2 数据帧格式**

WebSocket 数据以「帧」为单位，最小帧头仅 2 字节：

```text
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length    |
|I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
|N|V|V|V|       |S|             |   (if payload len==126/127)   |
| |1|2|3|       |K|             |                               |
+-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
|     Extended payload length continued, if payload len == 127  |
+ - - - - - - - - - - - - - - - +-------------------------------+
|                               |Masking-key, if MASK set to 1  |
+-------------------------------+-------------------------------+
| Masking-key (continued)       |          Payload Data         |
+-------------------------------- - - - - - - - - - - - - - - - +
:                     Payload Data continued ...                :
+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
|                     Payload Data continued ...                |
+---------------------------------------------------------------+
```

- FIN（1 bit）：是否最后一帧
- opcode（4 bits）：帧类型（文本/二进制/关闭/Ping/Pong）
- MASK（1 bit）：是否掩码（客户端→服务端必须掩码）
- Payload length（7/16/64 bits）：数据长度
- Masking-key（32 bits）：掩码密钥
- Payload Data：实际数据

**1.3 客户端掩码**

RFC 规定**客户端→服务端的帧必须用 32 位掩码加密**（XOR），目的是防止中间代理缓存污染。但掩码密钥在帧里明文传输，所以**不提供任何加密**，仅防特定攻击。

**1.4 分片**

长消息可拆成多个帧，最后一帧 FIN=1。允许边生成边发送（如流式语音）。

**1.5 心跳**

- Ping（opcode 0x9）：主动探测对端是否存活
- Pong（opcode 0xA）：响应 Ping
- 应用层定时发 Ping，对端不回 Pong 即视为断线

**2. 与 HTTP 的区别**

| 维度 | HTTP | WebSocket |
|------|------|-----------|
| 通信模型 | 请求-响应（半双工） | 全双工 |
| 连接方向 | 客户端发起 | 双方都可主动发 |
| 协议层 | 应用层独立协议 | 基于 HTTP 握手，之后切换 |
| 头部开销 | 每次几百字节 | 帧头 2-14 字节 |
| 数据格式 | 文本（HTTP/1.x） | 文本 + 二进制 |
| 服务端推送 | HTTP/1.x 不支持；HTTP/2 Server Push 已弃用 | 原生支持 |
| 协议状态 | 无状态 | 有状态（连接保持） |
| 默认端口 | 80 / 443 | 80（ws）/ 443（wss） |
| 代理支持 | 普通代理即可 | 需代理支持 Upgrade（HTTP/1.1） |
| 适合场景 | 一次性请求 | 实时、低延迟、持续通信 |

**3. 与 HTTP 的关系**

- WebSocket 不是 HTTP 的子集，是独立协议
- 但**握手借用了 HTTP**（用 GET 请求 + Upgrade 头）
- 握手成功后，TCP 连接上的字节流由 WebSocket 帧协议接管
- HTTP/2 不能升级 WebSocket，必须用 HTTP/1.1 握手

**4. 与 SSE、HTTP Streaming 对比**

| 方案 | 双向 | 二进制 | 自动重连 | 浏览器原生 |
|------|------|--------|----------|-----------|
| WebSocket | 是 | 是 | 否（要自己做） | 是 |
| SSE | 否（单向） | 否（仅文本） | 是 | 是 |
| HTTP Streaming | 否 | 是 | 否 | — |
| 长轮询 | 否 | 是 | 否 | — |

**5. 实践要点**

- 前端要做**自动重连 + 心跳**
- 用 `wss://` 而非 `ws://`，否则会被中间人篡改
- 服务端校验 `Origin` 头，防止跨站 WebSocket 劫持
- 用 Ping/Pong 维持连接（NAT/代理会回收空闲连接）
- 消息序列化推荐 JSON 或 Protobuf
- 大量消息可考虑 Pub/Sub 模式

**总结**：WebSocket 借用 HTTP 升级握手，之后切换到轻量二进制帧协议，提供全双工通信。它解决了 HTTP 不能服务端主动推送的痛点，是实时 Web 应用的核心协议。

## 简单请求和复杂请求

CORS（跨域资源共享）把跨域请求分为**简单请求**和**复杂请求（预检请求）**。简单请求直接发，复杂请求先发 OPTIONS 预检。

**1. 简单请求的判定**

必须**同时满足**以下所有条件：

**1.1 方法是这三种之一**

- `GET`
- `HEAD`
- `POST`

**1.2 自定义头只能用「安全字段」**

只能是：
- `Accept`
- `Accept-Language`
- `Content-Language`
- `Content-Type`（受下面限制）
- `Range`（仅简单场景，部分浏览器）

**1.3 Content-Type 只能是这三种**

- `application/x-www-form-urlencoded`
- `multipart/form-data`
- `text/plain`

**1.4 其他限制**

- 请求中任意 `XMLHttpRequestUpload` 对象没有注册事件
- 请求中没有使用 `ReadableStream`
- 不使用事件监听器

**2. 简单请求的流程**

```text
1. 浏览器直接发请求（带 Origin 头）
   GET /api/users HTTP/1.1
   Origin: https://www.example.com

2. 服务端响应（带 CORS 头）
   HTTP/1.1 200 OK
   Access-Control-Allow-Origin: https://www.example.com
   Content-Type: application/json

3. 浏览器检查 Access-Control-Allow-Origin 是否匹配 Origin
   - 匹配 → 把响应交给 JS
   - 不匹配 → 拦截响应，JS 拿不到
```

注意：**请求已经发到服务端并执行了**，浏览器只是决定是否把响应给 JS。所以简单请求并不能防止服务端被副作用调用。

**3. 复杂请求**

只要不满足简单请求任一条件，就是复杂请求。复杂请求会**先发 OPTIONS 预检**：

```text
1. 预检请求
   OPTIONS /api/users HTTP/1.1
   Origin: https://www.example.com
   Access-Control-Request-Method: POST
   Access-Control-Request-Headers: Content-Type, Authorization

2. 预检响应
   HTTP/1.1 200 OK
   Access-Control-Allow-Origin: https://www.example.com
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE
   Access-Control-Allow-Headers: Content-Type, Authorization
   Access-Control-Max-Age: 86400

3. 预检通过 → 发真正请求
   POST /api/users HTTP/1.1
   Origin: https://www.example.com
   Content-Type: application/json
   Authorization: Bearer xxx
   {"name":"Tom"}

4. 服务端响应
   HTTP/1.1 201 Created
   Access-Control-Allow-Origin: https://www.example.com
```

**4. 常见触发复杂请求的场景**

```js
// 1. POST JSON（最常见）
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },  // ← 触发预检
  body: JSON.stringify(data)
})

// 2. 自定义头
fetch(url, {
  headers: { 'X-Token': 'xxx' }   // ← 触发预检
})

// 3. PUT / DELETE / PATCH
fetch(url, { method: 'DELETE' })

// 4. Content-Type 为 application/xml 等
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/xml' }
})
```

**5. 对比表**

| 维度 | 简单请求 | 复杂请求 |
|------|---------|----------|
| 是否预检 | 否 | 是（OPTIONS） |
| 请求次数 | 1 次 | 2 次（预检 + 实际） |
| 方法限制 | GET/HEAD/POST | 任意 |
| 自定义头 | 仅 CORS 安全字段 | 任意 |
| Content-Type | 3 种之一 | 任意 |
| 是否能避免副作用 | 否（请求已发到服务端） | 是（预检通过才发真请求） |
| 适用场景 | 表单、简单 GET | 现代 API（JSON、Token、PUT/DELETE） |

**6. 预检结果缓存**

`Access-Control-Max-Age` 让浏览器缓存预检结果，缓存期内同类型请求不再预检：

```http
Access-Control-Max-Age: 86400    # 缓存一天
```

不同浏览器上限不同（Chrome 最大 2 小时，Firefox 最大 24 小时）。

**7. 设计考量**

- 现代 API 几乎都是复杂请求（JSON + Token + PUT/DELETE），预检不可避免
- 服务端必须正确响应 OPTIONS，否则跨域请求全部失败
- 网关 / 反向代理层应统一处理 CORS，避免每个服务都写
- 同源部署（前后端同域）可彻底避免 CORS

**总结**：简单请求 = GET/HEAD/POST + 安全头 + 三种 Content-Type，不发预检；复杂请求 = 其他情况，先发 OPTIONS 预检。简单请求不等于「不跨域」，也不等于「无副作用」。

## Http请求中的keep-alive有了解吗

`keep-alive` 是 HTTP/1.1 引入的**持久连接机制**，让一个 TCP 连接可以承载多个请求-响应，避免每次请求都重新建连。

**1. 演进**

- **HTTP/1.0**：默认短连接，每请求一次开一次 TCP，完了关闭。可通过 `Connection: keep-alive` 显式开启
- **HTTP/1.1**：默认就是持久连接，`Connection: keep-alive` 是默认行为，要关闭用 `Connection: close`
- **HTTP/2**：单一持久连接 + 多路复用

**2. 头字段**

```http
# 客户端请求
Connection: keep-alive
Keep-Alive: timeout=5, max=100    # 期望的超时与最大请求数（非标准但常见）

# 服务端响应
Connection: keep-alive
Keep-Alive: timeout=5
```

- `timeout`：服务端保持空闲连接的最长时间（秒）
- `max`：连接上允许的最大请求数
- `Connection: close`：本次响应后关闭连接

**3. 短连接 vs 长连接**

```text
短连接（HTTP/1.0）
  TCP握手 → 请求1 → 响应1 → TCP关闭
  TCP握手 → 请求2 → 响应2 → TCP关闭

长连接（HTTP/1.1 keep-alive）
  TCP握手 → 请求1 → 响应1 → 请求2 → 响应2 → ... → TCP关闭
```

**4. 优点**

- 减少握手开销（不必每次三次握手 + 慢启动）
- 降低延迟，提升首屏速度
- 减少服务端 socket 占用
- TCP 拥塞窗口能积累到合理大小

**5. 注意点**

- **HTTP 层队头阻塞**：keep-alive 上请求仍串行，前一个慢，后续全等
- **资源占用**：空闲连接占用内存和文件描述符，服务端要设超时关闭
- **连接数限制**：浏览器对同域名默认开 6 个长连接
- **TCP Keep-Alive ≠ HTTP Keep-Alive**：
  - HTTP Keep-Alive 是应用层概念，控制连接复用
  - TCP Keep-Alive 是传输层探测（`SO_KEEPALIVE`），检测对端是否还活着

**6. Nginx 配置**

```nginx
http {
    keepalive_timeout 75s;       # 空闲连接超时
    keepalive_requests 100;      # 单连接最大请求数
    keepalive_disable msie6;     # 禁用某些 UA
}

# 反向代理时与上游保持长连接
upstream backend {
    server 127.0.0.1:8080;
    keepalive 32;                # 缓存 32 个连接
}
location / {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
}
```

**7. Node.js 中的 keep-alive**

```js
const http = require('http')
const agent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 256,
  maxFreeSockets: 32,
  timeout: 5000,
})

http.get({ hostname: 'example.com', path: '/', agent }, (res) => {
  // 复用连接
})
```

**8. 与 HTTP/2 的关系**

- HTTP/2 不再有 `Connection: keep-alive` 头（HTTP/2 不用 `Connection` 头）
- HTTP/2 默认就是单一持久连接 + 多路复用
- 但底层 TCP 连接仍是 keep-alive

**9. 实践影响**

- 静态资源、API 都建议开启 keep-alive（Nginx 默认开）
- 移动端弱网下长连接优势明显
- 大量短连接会让服务端 TIME_WAIT 堆积
- 长连接配合 HTTP/2 多路复用，是现代 Web 性能优化的基础

**总结**：HTTP keep-alive 是持久连接机制，HTTP/1.1 默认开启，让 TCP 连接被多个请求复用，减少握手开销。HTTP/2 进一步发展为单一连接多路复用，但底层仍是长连接。

## 什么情况下会触发option请求

`OPTIONS` 请求在 CORS 跨域场景下用作**预检请求（Preflight）**。当浏览器判定一个跨域请求是「非简单请求」时，会自动先发一个 OPTIONS 请求，询问服务端是否允许这次跨域请求。

**1. 触发条件：非简单请求**

满足下列任一条件就会触发预检：

**1.1 方法不是 GET / HEAD / POST**

```js
fetch(url, { method: 'PUT' })      // ← 触发
fetch(url, { method: 'DELETE' })   // ← 触发
fetch(url, { method: 'PATCH' })    // ← 触发
```

**1.2 自定义请求头**

除「安全字段」外都触发：
- `Accept`、`Accept-Language`、`Content-Language`、`Content-Type`、`Range` 是安全的
- 其他如 `Authorization`、`X-Token`、`X-Requested-With` 等都触发

```js
fetch(url, {
  headers: { Authorization: 'Bearer xxx' }   // ← 触发
})
fetch(url, {
  headers: { 'X-Requested-With': 'XMLHttpRequest' }  // ← 触发
})
```

**1.3 Content-Type 不是这三种**

- `application/x-www-form-urlencoded`
- `multipart/form-data`
- `text/plain`

```js
// 最常见触发：POST JSON
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },   // ← 触发
  body: JSON.stringify(data)
})
```

**1.4 其他**

- `XMLHttpRequest.upload` 注册了事件监听
- 使用了 `ReadableStream`

**2. 预检流程**

```http
# 第一次：OPTIONS 预检
OPTIONS /api/users HTTP/1.1
Origin: https://www.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

# 服务端响应预检
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://www.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

预检通过后才发真正的 POST 请求。

**3. 完整示例**

```js
// 这段代码会触发两次请求：OPTIONS + POST
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer xxx'
  },
  body: JSON.stringify({ name: 'Tom' })
})
```

**4. 为什么需要预检**

1. **保护服务器**：非简单请求可能修改数据（POST/PUT/DELETE），先确认服务器允许跨域再发，避免无意中执行副作用
2. **避免浏览器无谓发送 body**：预检只发头不发 body
3. **统一权限控制**：服务端通过 `Access-Control-Allow-*` 头声明跨域策略
4. **历史原因**：在 CORS 标准化前，服务器只接收同源请求；预检让服务端有机会声明「我支持 CORS」

**5. 不会触发 OPTIONS 的场景**

- **同源请求**：同源根本不涉及 CORS
- **简单请求**：GET/HEAD/POST + 安全头 + 三种 Content-Type 之一
- **`mode: 'no-cors'`** 的 fetch（但响应会被严格限制，JS 读不到内容）

**6. 减少预检的方法**

- 尽量用简单请求（POST 表单格式而非 JSON）
- 不带多余自定义头
- 服务端设较长 `Access-Control-Max-Age`（如 86400 秒）
- 同域部署（前后端同源 + 反向代理）
- 用 JSONP（已过时，仅 GET）
- 服务端用反向代理把跨域转成同域

**7. 容易踩的坑**

- **预检请求不带 Cookie**：预检本身不携带身份凭证，但通过后真实请求会带
- **预检失败导致跨域请求失败**：服务端必须正确响应 OPTIONS，网关 / Nginx 要放行 OPTIONS
- **预检结果跨浏览器不共享**：不同浏览器各自缓存

**总结**：跨域请求只要不满足「简单请求」条件，就会触发 OPTIONS 预检。最常见的触发原因是 POST JSON、自定义头（Authorization）、PUT/DELETE 方法。

## CDN的作用和原理

**CDN（Content Delivery Network，内容分发网络）** 是一组分布在不同地理位置的服务器集群，把静态资源缓存到离用户最近的节点，让用户就近获取，加速访问。

**1. 解决什么问题**

- 用户与服务器物理距离远 → RTT 高、丢包率高
- 跨运营商（电信↔联通）互联互通瓶颈
- 服务器单点带宽有限
- 流量突增时服务器易被压垮

CDN 把内容复制到全国/全球各地的边缘节点，让用户就近访问。

**2. 核心作用**

| 作用 | 说明 |
|------|------|
| 加速访问 | 就近获取，RTT 低 |
| 减少源站压力 | 流量被边缘节点消化 |
| 提升可用性 | 多节点容灾，单点故障不影响整体 |
| 节省带宽 | 边缘节点缓存，源站带宽需求降低 |
| 抗 DDoS | 流量分散到边缘，源站不易被攻击 |
| 跨网加速 | 节点跨运营商部署 |

**3. 工作原理**

**3.1 DNS 智能解析**

```text
1. 用户访问 www.example.com
2. DNS 查询：example.com 的 CNAME 指向 CDN 厂商域名
   www.example.com  CNAME  www.example.com.cdn.cloudflare.net
3. CDN 厂商 DNS（智能 DNS）根据用户 IP、运营商、地理位置
   返回离用户最近的边缘节点 IP
4. 用户直接访问该边缘节点
```

**3.2 边缘节点缓存**

```text
1. 用户首次请求 /app.js
2. 边缘节点没有缓存 → 回源（向源站请求）
3. 源站返回 /app.js，边缘节点缓存一份
4. 边缘节点返回给用户

5. 后续用户访问 /app.js
6. 边缘节点命中缓存 → 直接返回，不回源
```

**3.3 缓存控制**

CDN 缓存遵循 `Cache-Control`、`Expires` 等头字段，也可在 CDN 控制台手动配置：

- 文件名带 hash：长缓存 `max-age=31536000, immutable`
- HTML：`no-cache` 走协商
- 通过版本号或 hash 更新文件

**4. CDN 节点架构**

```text
                    源站（Origin）
                         │
                ┌────────┴────────┐
                │                 │
          区域中心节点        区域中心节点
            （回源）          （回源）
         ┌────┴────┐       ┌────┴────┐
       边缘1   边缘2      边缘3   边缘4
       （缓存）（缓存）   （缓存）（缓存）
```

- **源站**：原始服务器，存放最新内容
- **区域中心节点**：汇聚多个边缘节点的回源请求，二级缓存
- **边缘节点**：直接服务用户，离用户最近

**5. 缓存命中率优化**

- 静态资源带 hash 文件名，长缓存
- HTML 走协商缓存
- 大文件分片
- 主动预热：发布前预热新内容到 CDN
- 缓存刷新：内容更新后强制刷新 CDN

**6. 加速方式**

- **静态加速**：缓存静态资源
- **动态加速**：CDN 节点与源站之间走专线/优化路由（如 Cloudflare Argo）
- **直播流媒体**：HLS、RTMP 推流
- **下载加速**：大文件分片下载
- **安全加速**：WAF、DDoS 防护

**7. 主流 CDN 厂商**

- **国际**：Cloudflare、Akamai、AWS CloudFront、Fastly
- **国内**：阿里云 CDN、腾讯云 CDN、百度云加速、七牛云
- **开源/自建**：Nginx + 缓存 + 多机房

**8. 关键技术**

- **CNAME**：把域名指向 CDN
- **智能 DNS**：根据用户位置解析到最近节点
- **Anycast**：全球 IP 共享，路由自动选近节点
- **HTTP/2、HTTP/3**：现代协议加速
- **Brotli 压缩**：比 gzip 压缩率更高
- **TLS 1.3、OCSP Stapling**：握手加速
- **图片优化**：WebP/AVIF 转换、动态裁剪

**9. 典型配置**

```nginx
# 源站 nginx
server {
    listen 80;
    server_name origin.example.com;
    root /var/www;
}

# CDN 边缘节点（简化）
location ~* \.(js|css|png|jpg|svg|woff2)$ {
    proxy_cache cache_zone;
    proxy_cache_valid 200 365d;
    proxy_cache_key $uri$is_args$args;
    proxy_pass http://origin;
}
```

**10. 注意点**

- **缓存污染**：内容更新后没及时刷新 CDN，用户看到旧版本
- **跨域问题**：CDN 与源站不同域时要做 CORS
- **HTTPS**：CDN 节点也要有证书（共享证书或上传自定义证书）
- **回源保护**：源站只允许 CDN 节点访问，防直连源站

**总结**：CDN 通过 DNS 智能解析 + 边缘节点缓存，让用户就近获取静态资源，加速访问、减轻源站压力。它是现代 Web 性能优化的基础设施，配合缓存策略、HTTP/2、TLS 1.3 等技术效果更佳。

## 强缓存命中发生了什么？

**强缓存命中**时，浏览器**完全不发送网络请求**，直接用本地缓存的副本响应，状态码显示 200，size 标注 `(from disk cache)` 或 `(from memory cache)`。

**1. 触发条件**

强缓存由这两个响应头控制：

- `Cache-Control: max-age=<seconds>`（HTTP/1.1，优先级高）
- `Expires: <绝对时间>`（HTTP/1.0）

只要缓存的资源**未过期**，下次访问就命中强缓存。

**2. 命中后浏览器的行为**

```text
1. 用户访问 URL
2. 浏览器检查本地缓存（disk / memory）
3. 资源未过期（max-age 内 / Expires 之前）
4. 浏览器不发送任何 HTTP 请求
5. 直接读本地副本，渲染/执行
6. 网络面板显示 200，size 为 (from disk cache) 或 (from memory cache)
```

**关键点**：**请求根本没发出去**，服务器完全不知道这次访问。这就是为什么强缓存能省下完整的 RTT 和带宽。

**3. 状态码与标识**

浏览器开发者工具中：

| 标识 | 含义 |
|------|------|
| `200 (from memory cache)` | 缓存在内存中（当前标签页期间访问过，如 CSS、JS） |
| `200 (from disk cache)` | 缓存在磁盘（之前会话访问过，如图片） |
| `200 (from prefetch cache)` | 通过 `<link rel="prefetch">` 预取 |
| `304 Not Modified` | 协商缓存命中（不是强缓存！） |
| `200`（无标识） | 正常请求，发到服务器 |

**memory vs disk**：
- **memory cache**：存内存，标签页关闭即失效，速度快，常放 JS、CSS
- **disk cache**：存磁盘，跨会话持久，容量大，常放图片、字体

**4. 命中流程示意**

```text
首次访问：
  GET /app.js
  ──► HTTP/1.1 200 OK
      Cache-Control: max-age=31536000
      ETag: "abc"
      Content-Length: 10240
      
  [浏览器把响应 + 元信息存入 disk cache]

第二次访问（1 年内）：
  GET /app.js
  ──► 浏览器检查：未过期
      不发请求
      
  Network 面板：
  Status: 200
  Size: (from disk cache)
  Time: 0ms（几乎瞬间）
```

**5. `immutable` 的额外优化**

```http
Cache-Control: max-age=31536000, immutable
```

`immutable` 告诉浏览器「这个资源永不变」（带 hash 文件名）。即使：

- 用户主动刷新（F5）—— 默认会让 max-age 失效发条件请求
- 浏览器因内存压力清理

带 `immutable` 时，连主动刷新都不会发请求，直接用缓存。

**6. 命中与不命中的对比**

| 场景 | 是否发请求 | 状态码 | 节省 |
|------|-----------|--------|------|
| 强缓存命中 | 否 | 200 (from cache) | 完整 RTT + 带宽 |
| 强缓存未命中 → 协商缓存命中 | 是（带条件头） | 304 | 带宽（不传 body） |
| 强缓存未命中 → 协商缓存未命中 | 是 | 200 | 无 |

**7. 用户行为对强缓存的影响**

| 操作 | 强缓存 | 协商缓存 |
|------|--------|----------|
| 普通访问（点击链接、输入 URL 回车） | 用 | 用 |
| F5 / Cmd+R 普通刷新 | 跳过 | 用（发条件请求） |
| Cmd+Shift+R 强制刷新 | 跳过 | 跳过（重新下载） |
| DevTools 勾选 Disable cache | 跳过 | 跳过 |

**8. 命中后的副作用**

- **不更新 Last-Modified / ETag**：因为没发请求
- **不刷新缓存有效期**：max-age 是从原始响应时间算的
- **不能撤销**：一旦发出，浏览器就拿不到新版本了，除非文件名带 hash 重新请求

**9. 失效方式**

- `max-age` 到期
- 用户清除缓存
- 强制刷新（Cmd+Shift+R）
- DevTools 勾选 Disable cache
- Service Worker 拦截并请求新版本

**10. 实践建议**

- 静态资源带 hash 文件名 + 长 `max-age` + `immutable`
- HTML 走协商缓存（`no-cache`）
- 频繁更新的 API 用 `no-store` 或短 `max-age`
- 不要用强缓存缓存用户私有数据

**总结**：强缓存命中时浏览器不发任何请求，直接读本地副本，状态码显示 200 (from cache)，节省完整 RTT 和带宽。`Cache-Control: max-age` 控制有效期，`immutable` 进一步防止刷新触发条件请求。

## 默认的强制缓存时间是多少？

**HTTP 协议没有规定「默认的强制缓存时间」**——具体行为取决于浏览器、服务器和响应头字段，没有统一默认值。

**1. HTTP 协议层面**

- HTTP/1.1 规范未规定 max-age 的默认值
- 服务器必须**显式设置** `Cache-Control` 或 `Expires` 才能控制强缓存
- 如果都没设，按启发式缓存（Heuristic Caching）处理

**2. 没有显式缓存头时**

**2.1 浏览器的启发式缓存**

如果响应既没有 `Cache-Control`，也没有 `Expires`，浏览器会按启发式规则推断缓存时间：

```
heuristic_refresh_value = (Date - Last-Modified) × 10%
```

- 用响应头 `Date` 和 `Last-Modified` 的时间差 × 10% 作为缓存时间
- 上限通常 24 小时（Chrome）
- 例：`Last-Modified` 是 10 天前 → 缓存 1 天

所以「没有显式设置 ≠ 不缓存」。

**2.2 各浏览器行为**

| 浏览器 | 没有缓存头时的行为 |
|--------|-------------------|
| Chrome | 启发式缓存，上限约 24 小时 |
| Firefox | 启发式缓存 |
| Safari | 较保守，可能不缓存 |

**3. 显式设置的常见值**

| 场景 | 推荐设置 | 时长 |
|------|----------|------|
| 带 hash 的静态资源 | `max-age=31536000, immutable` | 1 年 |
| 不带 hash 的静态资源 | `max-age=300` 或 `no-cache` | 短 |
| HTML 文档 | `no-cache`（走协商） | 0（强缓存） |
| 实时数据 API | `no-store` | 不缓存 |
| 用户私有数据 | `private, max-age=60` | 1 分钟 |

**4. `max-age` 的取值范围**

- 最小：`max-age=0` —— 等同于 `no-cache`，每次走协商
- 最大：建议不超过 1 年（31536000 秒）
- 实际上有些 CDN / 服务器会限制

**5. 一些容易误解的点**

**5.1 「默认」≠「永久」**

- 不写 `max-age` 不是「永久缓存」
- 也不是「不缓存」
- 而是「浏览器按启发式规则自行决定」

**5.2 `Expires` 的默认值**

- 不设 `Expires` 时不影响缓存
- `Expires: 0` 或 `Expires: 过去时间` → 视为已过期，走协商

**5.3 304 不是强缓存**

- `200 (from cache)` 才是强缓存
- `304 Not Modified` 是协商缓存命中

**6. 实践建议**

- **必须显式设置缓存头**，不要依赖默认行为
- HTML：`Cache-Control: no-cache`，确保用户拿到最新版本
- 静态资源：`max-age=31536000, immutable`，文件名带 hash
- API：按业务定 `no-store` / `max-age=60`
- 不要让浏览器猜——启发式缓存行为不一致，难调试

**7. Nginx 示例**

```nginx
# 静态资源长缓存
location ~* \.(js|css|png|jpg|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML 协商缓存
location ~ \.html$ {
    add_header Cache-Control "no-cache";
}

# API 不缓存
location /api/ {
    add_header Cache-Control "no-store";
}
```

**总结**：HTTP 没有默认的强制缓存时间。不写 `Cache-Control` 时浏览器用启发式规则（约 `(Date - Last-Modified) × 10%`）推断，各浏览器行为不一致。生产环境务必显式设置 `Cache-Control`。

## CORS跨域的原理

**CORS（Cross-Origin Resource Sharing，跨域资源共享）** 是浏览器的安全机制，允许服务器声明「哪些跨域请求可以访问我的资源」。它通过一组 HTTP 头字段实现，**核心是浏览器拦截响应**而非请求。

**1. 什么是跨域**

**同源（Same Origin）** = 协议 + 域名 + 端口 三者完全相同。

```text
https://www.example.com/page
└─┬─┘ └──────┬───────┘ └┬┘
协议      域名         端口(443)

任一不同即跨域：
https://www.example.com  vs  http://www.example.com      ← 协议不同
https://www.example.com  vs  https://api.example.com     ← 域名不同
https://www.example.com  vs  https://www.example.com:8080 ← 端口不同
```

**同源策略**：浏览器默认禁止 JS 跨域读取响应（防止一个网站的脚本读取另一个网站的数据，如银行页面被恶意脚本读取）。

**2. CORS 的核心机制**

CORS 通过 HTTP 头让**服务器声明允许的跨域来源**，浏览器检查响应头决定是否把响应交给 JS。

**2.1 简单请求（不预检）**

```text
1. 浏览器发请求，自动带 Origin 头
   GET /api/users HTTP/1.1
   Origin: https://www.example.com

2. 服务器响应，带 CORS 头
   HTTP/1.1 200 OK
   Access-Control-Allow-Origin: https://www.example.com

3. 浏览器检查 Origin 是否在 Allow-Origin 中
   - 是 → 把响应交给 JS
   - 否 → 拦截响应，JS 拿不到（请求实际已发到服务端）
```

**2.2 复杂请求（预检）**

```text
1. 预检 OPTIONS
   OPTIONS /api/users HTTP/1.1
   Origin: https://www.example.com
   Access-Control-Request-Method: POST
   Access-Control-Request-Headers: Content-Type, Authorization

2. 预检响应
   HTTP/1.1 200 OK
   Access-Control-Allow-Origin: https://www.example.com
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE
   Access-Control-Allow-Headers: Content-Type, Authorization
   Access-Control-Max-Age: 86400

3. 预检通过 → 发真请求
   POST /api/users HTTP/1.1
   Origin: https://www.example.com
   ...

4. 真请求响应
   HTTP/1.1 201 Created
   Access-Control-Allow-Origin: https://www.example.com
```

**3. CORS 头字段全表**

**响应头：**

| 头字段 | 作用 |
|--------|------|
| `Access-Control-Allow-Origin` | 允许的来源（`*` 或具体域名） |
| `Access-Control-Allow-Methods` | 允许的方法 |
| `Access-Control-Allow-Headers` | 允许的请求头 |
| `Access-Control-Allow-Credentials` | 是否允许带 Cookie |
| `Access-Control-Expose-Headers` | 允许 JS 读取的响应头 |
| `Access-Control-Max-Age` | 预检结果缓存时间 |

**请求头：**

| 头字段 | 作用 |
|--------|------|
| `Origin` | 自动带，表示请求来源 |
| `Access-Control-Request-Method` | 预检中声明实际请求的方法 |
| `Access-Control-Request-Headers` | 预检中声明实际请求的头 |

**4. 携带 Cookie（凭证）**

默认 CORS 请求**不带 Cookie**。要带：

```js
// 客户端
fetch(url, { credentials: 'include' })
// 或
xhr.withCredentials = true
```

```http
# 服务端必须显式允许
Access-Control-Allow-Origin: https://www.example.com   # 不能用 *
Access-Control-Allow-Credentials: true
```

**注意**：带 Cookie 时 `Allow-Origin` 不能是 `*`，必须是具体域名。

**5. 服务端配置示例**

```js
// Express
const cors = require('cors')
app.use(cors({
  origin: ['https://www.example.com', 'https://admin.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}))

// 或手写中间件
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Access-Control-Max-Age', '86400')
    return res.status(204).end()
  }
  next()
})
```

```nginx
# Nginx
location /api/ {
    if ($http_origin ~* "^https://(www|admin)\.example\.com$") {
        add_header Access-Control-Allow-Origin $http_origin;
        add_header Access-Control-Allow-Credentials true;
    }
    if ($request_method = OPTIONS) {
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization";
        add_header Access-Control-Max-Age 86400;
        return 204;
    }
    proxy_pass http://backend;
}
```

**6. 常见错误**

| 错误 | 原因 |
|------|------|
| `No 'Access-Control-Allow-Origin' header` | 服务端没返回 CORS 头 |
| `Credentials flag is true, but Allow-Origin is *` | 带 Cookie 时不能用 `*` |
| `Method DELETE not allowed` | 没在 `Allow-Methods` 中 |
| `Header Authorization not allowed` | 没在 `Allow-Headers` 中 |
| 预检 OPTIONS 404 | 路由没处理 OPTIONS 方法 |

**7. 与代理的关系**

- CORS 是浏览器机制，服务器之间互相请求没有跨域问题
- 解决跨域另一思路：**反向代理**把跨域转成同域

```nginx
# 同域代理
server {
    listen 80;
    location /api/ {
        proxy_pass https://api.example.com/;   # 浏览器以为同域
    }
}
```

**8. CORS 与 CSP 的区别**

- **CORS**：放松同源策略，允许跨域访问
- **CSP**：限制资源加载来源，加强安全
- 两者不冲突，CSP 主要约束 `<script src>`、`<link href>` 等标签

**总结**：CORS 通过一组 HTTP 头让服务器声明允许的跨域来源，浏览器检查响应头决定是否把响应交给 JS。简单请求直接发，复杂请求先预检。带 Cookie 时不能用 `*`，要显式指定来源。

## CORS的哪些是简单请求？

CORS 把跨域请求分为**简单请求**和**复杂请求（预检请求）**。简单请求不发预检，直接发到服务端；复杂请求先发 OPTIONS 预检。

**1. 简单请求的判定条件**

必须**同时满足**以下所有条件：

**1.1 方法是这三种之一**

- `GET`
- `HEAD`
- `POST`

**1.2 自定义头只能是「CORS 安全字段」**

只能是：
- `Accept`
- `Accept-Language`
- `Content-Language`
- `Content-Type`（受下面限制）
- `Range`（仅简单场景，部分浏览器支持）

**1.3 Content-Type 只能是这三种**

- `application/x-www-form-urlencoded`（原生表单默认）
- `multipart/form-data`（文件上传）
- `text/plain`

**1.4 其他限制**

- `XMLHttpRequest.upload` 没有注册事件监听
- 没有使用 `ReadableStream`

**2. 典型简单请求**

```http
# GET 请求
GET /api/users HTTP/1.1
Origin: https://www.example.com
Accept: application/json

# 原生表单 POST
POST /api/login HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Origin: https://www.example.com

username=tom&password=123

# 文件上传表单
POST /upload HTTP/1.1
Content-Type: multipart/form-data; boundary=----xyz
Origin: https://www.example.com

# text/plain
POST /api/log HTTP/1.1
Content-Type: text/plain
Origin: https://www.example.com

log line 1
```

**3. 典型复杂请求**

```http
# POST JSON（最常见）
POST /api/users HTTP/1.1
Content-Type: application/json    ← 触发预检
Origin: https://www.example.com

{"name":"Tom"}

# 带自定义头
GET /api/users HTTP/1.1
Authorization: Bearer xxx         ← 触发预检
Origin: https://www.example.com

# PUT / DELETE / PATCH
DELETE /api/users/123 HTTP/1.1    ← 触发预检
Origin: https://www.example.com

# 其他 Content-Type
POST /api/xml HTTP/1.1
Content-Type: application/xml     ← 触发预检
Origin: https://www.example.com
```

**4. 对比表**

| 维度 | 简单请求 | 复杂请求 |
|------|---------|----------|
| 是否预检 | 否 | 是（OPTIONS） |
| 请求次数 | 1 次 | 2 次（预检 + 实际） |
| 方法限制 | GET/HEAD/POST | 任意 |
| 自定义头 | 仅 CORS 安全字段 | 任意 |
| Content-Type | 3 种之一 | 任意 |
| 是否能避免副作用 | 否（请求已发到服务端） | 是（预检通过才发真请求） |

**5. 简单请求的流程**

```text
1. 浏览器直接发请求（带 Origin 头）
2. 服务端处理请求并响应（带 CORS 头）
3. 浏览器检查 Access-Control-Allow-Origin 是否匹配
   - 匹配 → 把响应交给 JS
   - 不匹配 → 拦截响应，JS 拿不到（但请求已执行！）
```

**注意**：简单请求**不预检**，所以服务端会执行这次请求。如果请求有副作用（如 POST 修改数据），即使 CORS 校验失败，副作用已经发生。所以服务端不应该用「简单请求」作为安全机制。

**6. 简单请求中的特殊处理**

- **HEAD 请求**：和 GET 一样，但服务端不返回 body
- **multipart/form-data**：用于文件上传，是简单请求
- **`text/plain`**：虽然罕见，但属于简单请求

**7. 实际场景**

- **传统表单提交**：默认 `application/x-www-form-urlencoded`，是简单请求
- **现代 API（fetch + JSON）**：基本都是复杂请求
- **文件上传（input type=file + FormData）**：是简单请求
- **带 Token 的请求**：基本都是复杂请求

**8. 注意点**

- 简单请求**仍然受 CORS 限制**——只是不预检
- 服务端仍要返回 `Access-Control-Allow-Origin`，否则响应被拦截
- 简单请求 ≠ 安全请求，副作用仍会执行
- 简单请求 ≠ 同源请求

**总结**：简单请求 = GET/HEAD/POST + 安全头 + 三种 Content-Type 之一，不发预检，直接发到服务端；其他都是复杂请求，先发 OPTIONS 预检。

## 为什么简单请求不需要预检？

简单请求不预检的核心原因是 **历史兼容性**：在 CORS 标准化前，HTML 表单就能跨域提交（GET/HEAD/POST + 三种 Content-Type），这些请求是「合法」的旧用法，CORS 不应打破它们。

**1. CORS 标准化前的事实**

在 CORS 出现前（2009 年前），Web 已经有大量跨域请求：

```html
<!-- 跨域 GET -->
<img src="https://cdn.example.com/logo.png" />
<link rel="stylesheet" href="https://cdn.example.com/style.css" />
<script src="https://cdn.example.com/lib.js"></script>

<!-- 跨域表单 POST -->
<form action="https://api.example.com/submit" method="POST">
  <input name="name" />
</form>
```

这些请求**本身就能跨域**——CORS 不是为了禁止它们，而是为了让**跨域 JS 能读取响应**。

**2. 简单请求 = 旧时代已能跨域的请求**

CORS 把这些"原本就能跨域"的请求归为简单请求：

- 方法：GET / HEAD / POST（HTML 表单支持的）
- 头：只有 `Accept`、`Content-Type` 等浏览器自动加的
- Content-Type：只有 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`（HTML 表单的 enctype）

这些请求即使没有 CORS 也能发出，所以不需要预检——预检的目的是保护服务器，但这些请求本来就能到达服务器。

**3. 复杂请求是新能力，需要先问**

CORS 出现后，JS 可以发任意方法和头：

```js
fetch(url, {
  method: 'DELETE',
  headers: { Authorization: 'Bearer xxx', 'X-Custom': 'value' }
})
```

在没有 CORS 前，浏览器 JS 根本不能发这种请求。这是**新增能力**，可能对服务器造成意外副作用（DELETE 删数据、自定义头触发特殊逻辑）。

所以浏览器先发 OPTIONS 预检：「服务器，我可以用 DELETE + Authorization + X-Custom 跨域访问吗？」服务器同意后才发真请求。

**4. 简单请求不预检的风险**

简单请求不预检意味着：
- 请求**会到达服务端并执行**
- 即使 CORS 校验失败（响应被浏览器拦截），副作用已经发生

```text
1. evil.com 用 <form> 提交到 bank.com/transfer
2. 浏览器自动带 Cookie（如果没 SameSite）
3. 服务器执行转账
4. 浏览器拦截响应，但钱已经转了
```

这是 **CSRF 攻击的本质**，CORS 无法解决，需要靠：
- CSRF Token
- SameSite Cookie
- Referer 校验
- 关键操作二次验证

**5. CORS 的真实目的**

CORS 不是为了防 CSRF（那是 CSRF Token 的活），而是为了**让 JS 能合法读取跨域响应**：

| 场景 | 没 CORS | 有 CORS |
|------|---------|---------|
| `<img>` 跨域加载图片 | 能加载，JS 读不到像素 | 仍能加载 |
| `<form>` 跨域 POST | 能提交，JS 读不到响应 | 仍能提交 |
| `fetch` 跨域 GET | 不能发 | 能发，按 CORS 规则读响应 |
| `fetch` 跨域 DELETE | 不能发 | 预检通过才能发 |

**6. 表单 POST 是简单请求但仍有风险**

简单请求的 POST 表单即使能跨域，也不能用 `fetch`/`XMLHttpRequest` 读取响应（除非服务端返回 CORS 头）。这是 CORS 给 JS 加的额外限制。

但纯 HTML 表单提交不需要 JS 读响应，所以不受影响。

**7. 为什么 POST + JSON 要预检？**

`Content-Type: application/json` 不是 HTML 表单的 enctype，是 JS fetch 才能发的。属于「新能力」，需要预检让服务端确认。

**8. 简单请求的限制合理吗？**

争议：
- 简单请求会执行副作用，CORS 不能阻止 CSRF
- 但预检所有请求会让 Web 兼容性崩溃（表单提交都要预检）
- 折衷：只对「新能力」预检，旧表单仍按原行为

**9. 实践影响**

- 不要依赖 CORS 防 CSRF，要用 CSRF Token
- 服务器对写操作要做 CSRF 防护
- 服务端要正确处理 OPTIONS（网关、Nginx）
- 减少预检的方法：用简单请求（form 编码）、不带头、设 Max-Age

**总结**：简单请求不预检，是因为它们在 CORS 之前就能跨域（HTML 表单、`<img>` 等），CORS 不打破已有兼容性。预检是为了让服务端有机会拒绝「新能力」（自定义方法、自定义头、JSON Content-Type），避免意外副作用。

## 复杂请求预检检查什么东西？

预检（OPTIONS 请求）的目的是**让服务端声明这次跨域请求是否被允许**。浏览器在发真实请求前，先用 OPTIONS 询问服务端：方法、头、来源是否 OK。

**1. 预检请求带什么**

```http
OPTIONS /api/users HTTP/1.1
Host: api.example.com
Origin: https://www.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

浏览器告诉服务端三件事：
- **请求来源**（`Origin`）：请求从哪个域发起
- **真实请求的方法**（`Access-Control-Request-Method`）：即将用的方法
- **真实请求的 headers**（`Access-Control-Request-Headers`）：即将带的自定义头

**2. 服务端响应什么**

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://www.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
Access-Control-Expose-Headers: X-Total-Count
Content-Length: 0
```

服务端声明：
- **允许的来源**（`Allow-Origin`）
- **允许的方法**（`Allow-Methods`）
- **允许的头**（`Allow-Headers`）
- **是否允许带 Cookie**（`Allow-Credentials`）
- **预检结果缓存时间**（`Max-Age`）
- **JS 可读的响应头**（`Expose-Headers`）

**3. 浏览器检查的项**

浏览器收到预检响应后，逐项检查：

| 检查项 | 来源 | 通过条件 |
|--------|------|---------|
| Origin 是否被允许 | `Allow-Origin` | 等于 `Origin` 或为 `*`（带 Cookie 时不能 `*`） |
| Method 是否被允许 | `Allow-Methods` | 真实请求方法在列表中 |
| Headers 是否都被允许 | `Allow-Headers` | 真实请求的所有自定义头都在列表中 |
| 是否允许带 Cookie | `Allow-Credentials` | 如果 `fetch(credentials: include)`，必须为 `true` |

任何一项不通过，浏览器就**不发真实请求**，并报错：

```text
Access to fetch at 'https://api.example.com/users' from origin 
'https://www.example.com' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**4. 预检请求的特点**

- **方法固定 OPTIONS**：预检请求永远是 OPTIONS
- **不带 body**：只发头，不传数据
- **不带 Cookie**（除非服务端要求）：预检本身不带身份
- **浏览器自动发**：JS 代码看不到预检请求，是浏览器底层行为
- **可缓存**：通过 `Access-Control-Max-Age` 缓存结果

**5. 各响应头详解**

**5.1 `Access-Control-Allow-Origin`**

```http
Access-Control-Allow-Origin: https://www.example.com    # 具体域名
Access-Control-Allow-Origin: *                           # 任意域名
```

- 带凭证时不能用 `*`，必须具体域名
- 一次只能一个值（不支持多个域名逗号分隔，浏览器会拒绝）

**5.2 `Access-Control-Allow-Methods`**

```http
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
```

实际请求的方法必须在这个列表里。

**5.3 `Access-Control-Allow-Headers`**

```http
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Custom
```

实际请求带的所有「非安全字段」头都必须在列表里。

**5.4 `Access-Control-Allow-Credentials`**

```http
Access-Control-Allow-Credentials: true
```

允许实际请求带 Cookie 和 Authorization。

**5.5 `Access-Control-Max-Age`**

```http
Access-Control-Max-Age: 86400
```

预检结果缓存时间（秒）。缓存期内同类型请求不再预检。

**5.6 `Access-Control-Expose-Headers`**

```http
Access-Control-Expose-Headers: X-Total-Count, X-Page-Size
```

默认 JS 只能读几个安全响应头（Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma）。其他响应头要在这里声明，JS 才能读到。

**6. 预检通过后的真实请求**

```http
POST /api/users HTTP/1.1
Origin: https://www.example.com
Content-Type: application/json
Authorization: Bearer xxx

{"name":"Tom"}
```

服务端响应：

```http
HTTP/1.1 201 Created
Access-Control-Allow-Origin: https://www.example.com
```

**7. 常见预检失败原因**

| 错误 | 原因 |
|------|------|
| `No 'Access-Control-Allow-Origin'` | 服务端没返回 CORS 头 |
| `Method X is not allowed` | 没在 `Allow-Methods` 中 |
| `Header X is not allowed` | 没在 `Allow-Headers` 中 |
| `Credentials flag true, but Allow-Origin is *` | 带 Cookie 时不能用 `*` |
| 预检 OPTIONS 405 | 路由没处理 OPTIONS 方法 |
| 预检 OPTIONS 404 | 路由未匹配 |

**8. 服务端处理 OPTIONS 的注意**

- 路由要允许 OPTIONS 方法
- Nginx / API 网关要放行 OPTIONS，不要鉴权拦截
- 返回 200 或 204，不要返回 401
- 不需要业务逻辑处理，只返回 CORS 头

```js
// Express
app.options('/api/*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')
  res.status(204).end()
})
```

**总结**：预检检查「来源、方法、头、Cookie 凭证」是否被服务端允许。浏览器根据 `Access-Control-Allow-*` 响应头逐项核对，任一不通过就拒绝发真实请求。

## 如果CORS附带身份凭证要怎样做？

默认 CORS 请求**不带 Cookie、HTTP 认证、客户端 SSL 证书**。要带身份凭证（如 Cookie），客户端和服务端都要做相应配置。

**1. 客户端：声明要带凭证**

**1.1 fetch**

```js
fetch('https://api.example.com/users', {
  credentials: 'include'      // ← 关键
})
```

`credentials` 三个值：
- `omit`：不带任何凭证（默认）
- `same-origin`：同源才带
- `include`：跨域也带

**1.2 XMLHttpRequest**

```js
const xhr = new XMLHttpRequest()
xhr.open('GET', 'https://api.example.com/users')
xhr.withCredentials = true    // ← 关键
xhr.send()
```

**1.3 axios**

```js
axios.get('https://api.example.com/users', {
  withCredentials: true
})
```

**1.4 Cookie 要正确配置**

光在请求中带 `credentials: 'include'` 还不够，Cookie 本身必须能跨域发送：

```http
Set-Cookie: sessionId=abc; 
  Domain=.example.com;       # 允许子域共享
  Path=/;
  Secure;                    # 必须 HTTPS
  SameSite=None;              # 跨站必须设 None
  HttpOnly
```

**关键**：跨域发送 Cookie，Cookie 的 `SameSite` 必须设为 `None`，且必须同时设 `Secure`（HTTPS）。

**2. 服务端：必须显式允许凭证**

```http
Access-Control-Allow-Origin: https://www.example.com
Access-Control-Allow-Credentials: true
```

两个关键点：
- `Allow-Credentials: true` 必须显式设置
- **`Allow-Origin` 不能是 `*`**，必须是具体域名（与 `Origin` 一致）

如果服务端同时设了 `Allow-Credentials: true` 和 `Allow-Origin: *`，浏览器会拒绝：

```text
Access to fetch at '...' from origin '...' has been blocked by CORS policy: 
The value of the 'Access-Control-Allow-Origin' header in the response must 
not be the wildcard '*' when the request's credentials mode is 'include'.
```

**3. 完整示例**

**3.1 客户端**

```js
fetch('https://api.example.com/users', {
  method: 'GET',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' }
})
```

**3.2 服务端（Node.js Express）**

```js
const cors = require('cors')

app.use(cors({
  origin: (origin, callback) => {
    // 必须返回具体域名，不能用 *
    const allowed = ['https://www.example.com', 'https://admin.example.com']
    if (!origin || allowed.includes(origin)) {
      callback(null, origin)   // 把 Origin 回显作为 Allow-Origin
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,           // ← 关键
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}))
```

**3.3 Nginx 配置**

```nginx
location /api/ {
    # 动态回显 Origin
    add_header Access-Control-Allow-Origin $http_origin;
    add_header Access-Control-Allow-Credentials true;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
    add_header Access-Control-Allow-Headers "Content-Type, Authorization";
    
    if ($request_method = OPTIONS) {
        add_header Access-Control-Allow-Origin $http_origin;
        add_header Access-Control-Allow-Credentials true;
        add_header Access-Control-Max-Age 86400;
        return 204;
    }
    
    proxy_pass http://backend;
}
```

注意 `add_header` 在 Nginx 中默认只在 2xx/3xx 响应生效，OPTIONS 的 204 要重新加。

**4. Cookie 跨域的额外要求**

跨域请求带 Cookie，Cookie 必须满足：

| Cookie 属性 | 要求 |
|-------------|------|
| `SameSite` | `None`（跨站发送） |
| `Secure` | 必须（SameSite=None 时强制） |
| `Domain` | 必须覆盖请求域 |
| `HttpOnly` | 可选（不影响发送） |

```http
Set-Cookie: sessionId=abc; Domain=.example.com; Path=/; Secure; SameSite=None; HttpOnly
```

**5. 第三方 Cookie 限制**

- 现代浏览器（Safari ITP、Chrome 默认）逐步限制第三方 Cookie
- 跨域请求带的 Cookie 属于「第三方 Cookie」
- 浏览器可能直接拦截，导致 Cookie 不发送
- 解决方案：用 Token（Authorization 头）替代 Cookie，或用同域代理

**6. Authorization 头带凭证**

如果不用 Cookie 而用 Token：

```js
fetch('https://api.example.com/users', {
  headers: { Authorization: 'Bearer xxx' }
})
```

- Token 在 Authorization 头里，浏览器不自动发，需 JS 主动加
- 不受第三方 Cookie 限制
- 但仍是跨域请求，要 CORS 头
- `Authorization` 是非安全字段，会触发预检

**7. 注意事项**

- 带 Cookie 的 CORS 请求不能用 `*`，必须具体域名
- 浏览器会校验 Cookie 的 SameSite、Secure、Domain
- 第三方 Cookie 限制越来越严，推荐改用 Token
- 凭证请求会暴露用户身份，服务端要做 CSRF 防护（即使 CORS 通过）

**总结**：CORS 附带身份凭证需要客户端 `credentials: include` + 服务端 `Allow-Credentials: true` + `Allow-Origin` 用具体域名 + Cookie 设 `SameSite=None; Secure`。但第三方 Cookie 限制日益严格，更推荐用 Token。

## 如何减少CORS预请求的次数？

预检请求（OPTIONS）会多一次 RTT，影响性能。可以通过以下方式减少预检次数。

**1. 让请求变成「简单请求」**

简单请求不预检。条件：GET/HEAD/POST + 安全头 + 三种 Content-Type 之一。

**1.1 用 `application/x-www-form-urlencoded` 替代 JSON**

```js
// 复杂请求（触发预检）
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})

// 简单请求（不预检）
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams(data).toString()
})
```

但实际中现代 API 几乎都用 JSON，这种妥协不划算。

**1.2 不带多余自定义头**

```js
// 触发预检
fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })

// 不触发
fetch(url, { /* 无自定义头 */ })
```

把 `Authorization` 改放 Cookie 也能避免预检，但失去 Token 优势，不推荐。

**2. 用 `Access-Control-Max-Age` 缓存预检结果**

服务端设置较长的 `Max-Age`，浏览器在缓存期内不再预检同类型请求：

```http
Access-Control-Max-Age: 86400
```

不同浏览器上限：
- Chrome、Safari：最大 2 小时（7200 秒）
- Firefox：最大 24 小时（86400 秒）

设大点浏览器会自动截断到上限，是性价比最高的优化。

**3. 同源部署**

最彻底的方法——让前后端同域，跨域问题彻底消失：

```text
https://www.example.com         ← 前端
https://www.example.com/api     ← 后端 API（通过反向代理）
```

Nginx 反向代理：

```nginx
server {
    listen 443;
    server_name www.example.com;
    
    root /var/www/frontend;
    
    location /api/ {
        proxy_pass http://backend:8080;
    }
}
```

这样浏览器请求 `/api/users` 是同源，无 CORS、无预检。

**4. 服务端正确处理 OPTIONS**

确保 OPTIONS 快速返回 204，不进入业务逻辑：

```nginx
if ($request_method = OPTIONS) {
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
    add_header Access-Control-Allow-Headers "Content-Type, Authorization";
    add_header Access-Control-Max-Age 86400;
    return 204;
}
```

OPTIONS 响应应尽量轻：不查数据库、不做鉴权、不返回 body。

**5. 减少跨域请求的方法数**

- 同一接口尽量用同一种方法和头组合
- 避免每个接口都用不同的自定义头
- 提取通用的 CORS 中间件，统一配置

**6. 用 WebSocket / SSE 替代部分请求**

WebSocket 握手是 HTTP，之后不再受 CORS 预检影响。SSE 也是单向推送，不需要预检。

**7. 避免在每次请求都加 `Authorization` 头**

虽然 `Authorization` 触发预检，但配合 `Max-Age`，缓存期内只预检一次。

**8. 服务端统一 CORS 配置**

```js
// 网关层统一处理
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token')
  res.setHeader('Access-Control-Max-Age', '86400')
  if (req.method === 'OPTIONS') return res.status(204).end()
  next()
})
```

集中配置避免每个路由单独写。

**9. 预检缓存的命中率**

浏览器对预检结果缓存是按「方法 + 头组合」做的。如果不同请求用了不同的头组合，会触发多次预检：

```js
// 这些请求会触发多次预检
fetch(url, { headers: { Authorization: 'a' } })
fetch(url, { headers: { 'X-Custom': 'b' } })
fetch(url, { headers: { Authorization: 'a', 'X-Custom': 'b' } })
```

统一所有请求的头集合，让预检缓存命中率最大化：

```js
// 推荐用 axios 拦截器统一加头
axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`
  config.headers['X-Requested-With'] = 'XMLHttpRequest'
  return config
})
```

**10. 实际建议**

| 方法 | 效果 | 推荐度 |
|------|------|--------|
| `Access-Control-Max-Age` 大 | 大 | 高 |
| 同源部署 | 大 | 高 |
| 统一头集合 | 中 | 中 |
| 改用表单格式 | 中 | 低（牺牲 JSON） |
| 用 Cookie 替代 Token | 中 | 低（XSS/CSRF 风险） |

**总结**：减少预检最有效的方法是 `Access-Control-Max-Age` 缓存预检结果、同源部署、统一请求头集合。改用表单格式虽能变简单请求，但牺牲了 JSON 的便利，不推荐。

## 在深圳的网页上输入百度，是怎么把这个请求发到北京的

这是一道考察对网络全链路理解的题目。从用户在浏览器输入 `www.baidu.com` 到百度北京机房收到请求，要经过 DNS 解析、TCP 路由、可能的 CDN 节点、负载均衡等多个环节。

**1. 输入 URL 解析**

- 用户在浏览器地址栏输入 `www.baidu.com`
- 浏览器解析 URL：协议默认 `https`，主机 `www.baidu.com`
- 浏览器检查 HSTS 列表，如果该域在列表中强制 HTTPS

**2. DNS 解析：把域名变成 IP**

```text
1. 浏览器 DNS 缓存
   ↓ 未命中
2. 操作系统 DNS 缓存（hosts 文件 + 系统缓存）
   ↓ 未命中
3. 本地 DNS 服务器（深圳电信 / 联通运营商的 DNS）
   ↓ 未命中
4. 本地 DNS 向根域名服务器查询
   ↓ 根服务器返回 .com 顶级域 NS
5. 本地 DNS 向 .com TLD 查询
   ↓ TLD 返回 baidu.com 权威 NS
6. 本地 DNS 向 baidu.com 权威 DNS 查询 www.baidu.com
   ↓
7. 百度权威 DNS 返回 IP（可能是 CDN 的 CNAME）
   ↓
8. 本地 DNS 缓存结果，返回给浏览器
```

**关键点：智能 DNS 解析**

百度等大公司用智能 DNS（如 GeoDNS、HTTPDNS）：
- 根据用户来源 IP 解析到**就近的 CDN / 节点**
- 深圳用户解析到的可能不是北京机房，而是深圳或广州的 CDN 节点
- 不同运营商用户解析到不同 IP（电信用户走电信节点，联通用户走联通节点）

```text
深圳电信用户 → 解析得到 深圳电信节点 IP
深圳联通用户 → 解析得到 深圳联通节点 IP
北京电信用户 → 解析得到 北京电信节点 IP
海外用户 → 解析得到 香港 / 海外节点 IP
```

**3. 建立 TCP 连接**

浏览器拿到 IP 后：

```text
浏览器（深圳）
  ↓ TCP SYN
路由器 → 城域网 → 省级骨干 → 国家骨干（电信/联通）
  ↓
通过 BGP 路由找到目标 IP 所在网络
  ↓
到达目标机房（可能是深圳 CDN，或北京源站）
  ↓
TCP 三次握手完成
```

**4. 路由怎么找到目标机房**

互联网是分层的，数据包通过**路由器一跳一跳转发**到目的地：

- 每个路由器维护**路由表**（通过 BGP/OSPF 等协议学习）
- 数据包根据目标 IP 查路由表，决定下一跳
- 经过多个路由器最终到达目标机房

```text
深圳 → 深圳城域网 → 广东骨干网 → 全国骨干网 → 北京骨干网 → 北京城域网 → 百度机房
```

**5. 如果走 CDN**

```text
深圳用户 → 解析得到深圳 CDN 节点 IP → 直接连深圳 CDN
  ↓
深圳 CDN 命中缓存 → 直接返回（极快）
  ↓ 未命中
深圳 CDN 回源到北京源站 → 拿到内容 → 缓存 → 返回用户
```

所以「深圳访问百度」实际上**通常不直接连到北京**，而是连到深圳/广州的 CDN 节点，由 CDN 决定是否回源北京。

**6. TLS 握手**

如果是 HTTPS（百度强制 HTTPS）：

```text
TCP 建立后 → TLS 握手
ClientHello → ServerHello + 证书 → 客户端验证 → 协商密钥 → 加密通信开始
```

CDN 节点有自己的证书，握手在 CDN 完成。

**7. 发送 HTTP 请求**

```http
GET / HTTP/1.1
Host: www.baidu.com
User-Agent: Mozilla/5.0 ...
Accept: text/html
Cookie: BAIDUID=xxx
```

请求经过：
- 浏览器 → 本地 NAT → 城域网 → 骨干网 → CDN / 百度机房
- 可能经过运营商的 HTTP 代理、防火墙
- 到达百度入口的负载均衡器（F5、LVS、Nginx）

**8. 负载均衡**

百度的入口是大规模负载均衡集群：

```text
LVS（四层 LB）→ Nginx（七层 LB）→ 应用服务器集群
```

- LVS 基于 IP + 端口转发
- Nginx 基于 Host、URL、Cookie 路由
- 应用服务器实际处理请求，生成响应

**9. 响应回传**

服务器返回 HTML：

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Encoding: gzip
Cache-Control: private
Set-Cookie: BAIDUID=xxx
```

响应沿着原路返回到深圳用户浏览器。

**10. 浏览器渲染**

- 解析 HTML → DOM 树
- 加载 CSS、JS、图片（每个又是一次完整的网络请求）
- 渲染页面

**11. 关键技术**

| 技术 | 作用 |
|------|------|
| DNS 智能解析 | 就近返回 IP |
| BGP 路由 | 跨网络转发数据包 |
| CDN | 边缘节点缓存，加速访问 |
| 负载均衡 | 海量请求分发到多台服务器 |
| HTTP/2、TLS 1.3 | 协议层加速 |
| BBR 拥塞控制 | 优化长距离传输 |

**12. 为什么用户感觉是「直接连到北京」**

- 用户只看到 `www.baidu.com`，不知道背后 IP
- 智能 DNS 让用户感觉「访问很快」，其实可能压根没到北京
- 大公司通过 CDN + 多地机房，让用户就近访问
- 真正的「回源」只在 CDN 缓存未命中时才发生

**总结**：深圳访问百度不是字面意义上的「请求发到北京」。DNS 把域名解析到智能节点（可能是深圳 CDN），TCP 通过 BGP 路由跨网转发，CDN 缓存命中则就近返回，未命中才回源到北京机房。整个链路涉及 DNS、TCP、TLS、CDN、负载均衡等多个技术。

## 为什么使用多域名部署？

多域名部署（Domain Sharding / 多域名分发资源）是 HTTP/1.x 时代的常见优化手段。原因是浏览器对单域名有连接数限制，多域名可以绕过这个限制，提高并发。

**1. HTTP/1.x 的连接数限制**

浏览器对**同一域名**的并发连接数有上限：

| 浏览器 | 单域名最大并发连接 |
|--------|---------------------|
| Chrome | 6 |
| Firefox | 6 |
| Safari | 6 |
| IE 8-9 | 6 |
| IE 7 | 2 |
| HTTP/1.1 RFC 建议 | 2 |

超过上限的请求只能排队等待，影响首屏速度。

**2. 多域名部署如何提升并发**

```text
单域名：
  www.example.com：6 个连接 → 第 7 个请求等待

多域名：
  www.example.com：6 个连接
  static1.example.com：6 个连接
  static2.example.com：6 个连接
  → 总共 18 个并发连接
```

把静态资源分散到多个子域，每个子域独立 6 个连接，整体并发能力 ×N。

**3. 典型部署方式**

```text
www.example.com         ← HTML、API
static1.example.com     ← CSS、JS
static2.example.com     ← 图片
static3.example.com     ← 字体、视频
```

```html
<link rel="stylesheet" href="https://static1.example.com/app.css">
<script src="https://static2.example.com/app.js"></script>
<img src="https://static1.example.com/logo.png">
```

**4. 多域名部署的其他收益**

**4.1 Cookie 隔离**

- 主站 `www.example.com` 有大 Cookie（sessionId、token）
- 静态资源请求带 Cookie 浪费带宽
- 用 `static.example.com`（无 Cookie 域）发静态资源 → 不带 Cookie

```text
有 Cookie：每次请求多带 1-2KB
无 Cookie：纯净请求
```

**4.2 隔离风险**

- 不同域隔离 XSS、CSRF
- 主站 Cookie 不会被静态资源域读到

**4.3 安全策略**

- 静态资源域可以单独设 CSP、防盗链
- 主站可以禁用 `SameSite=None` 跨域 Cookie

**4.4 CDN 优化**

- 不同域名的资源走不同 CDN 路径
- 方便分别配置缓存策略

**5. 多域名部署的代价**

**5.1 DNS 查询增多**

每个新域名都要 DNS 解析：

```text
www.example.com      → DNS 查询
static1.example.com  → DNS 查询
static2.example.com  → DNS 查询
```

**解决**：用 `dns-prefetch` 预解析：

```html
<link rel="dns-prefetch" href="//static1.example.com">
<link rel="dns-prefetch" href="//static2.example.com">
```

**5.2 TLS 握手增多**

每个域名都要单独 TLS 握手。

**解决**：
- 通配符证书（一张证书覆盖 `*.example.com`）
- Session Resumption 复用
- TLS 1.3 0-RTT

**5.3 HTTP/2 下失去优势**

HTTP/2 多路复用让单连接就足够并发：
- 一个域名上 100 个请求都可以并发
- 多域名反而让 HPACK 动态表失效，降低头部压缩效果

**5.4 失去连接复用**

每个域名独立 TCP 连接，握手开销增加。

**6. HTTP/2 / HTTP/3 时代的多域名策略**

- HTTP/2 上**不再推荐**做域名分片
- 用一个域名 + 多路复用更好
- Cookie 隔离仍可用独立域名

**7. 现代推荐做法**

```text
推荐架构：
  www.example.com       ← 主站 + 静态资源（HTTP/2 多路复用）
  api.example.com       ← API（独立 Cookie 策略）
  cdn.example.com       ← CDN 加速的大文件
  analytics.example.com ← 埋点（独立域）
```

**8. 何时仍用多域名**

- 仍跑 HTTP/1.1 的场景
- 需要隔离 Cookie 的场景
- 大型网站，不同业务独立部署
- CDN 资源用独立域名

**9. 与 Cookie-free 域的关系**

经典的 Cookie-free 域配置：

```text
www.example.com       ← 带 Cookie
static.example.com    ← 不带 Cookie（独立子域 + 不设 Cookie）
```

- 主域 Cookie 设 `Domain=.example.com` 会被子域共享
- 所以静态资源域最好用**完全独立的父域**，如 `example-cdn.com`

**总结**：多域名部署在 HTTP/1.x 时代为绕过浏览器单域名连接数限制、隔离 Cookie、提升并发而生。HTTP/2 多路复用让域名分片不再必要，但 Cookie 隔离、业务隔离、CDN 优化等场景仍有多域名需求。

## 页面10张img，http1是怎样的加载表现？怎样解决的？

**HTTP/1.1 下 10 张图片的加载表现** 受浏览器并发连接数限制影响，需要排队。

**1. 浏览器并发限制**

- 单域名最多 6 个并发 TCP 连接
- 同一连接上请求串行（HTTP/1.1 队头阻塞）
- 超过 6 个的请求要等前面释放连接

**2. 10 张图片的表现**

假设 10 张图都在 `cdn.example.com`：

```text
时间轴：
连接1: [img1 ─] [img7 ─]
连接2: [img2 ─] [img8 ─]
连接3: [img3 ─] [img9 ─]
连接4: [img4 ─] [img10 ─]
连接5: [img5 ─]
连接6: [img6 ─]

第一批：img1-6 并发下载
第二批：img7-10 等第一批释放连接后才开始
```

- 前 6 张并发下载
- 后 4 张排队等连接释放
- 总耗时 ≈ 2 个 RTT × 单图下载时间

如果都在同一台服务器且走 keep-alive，连接复用还好；否则每张图都要 TCP 握手。

**3. 还会有什么问题**

- **TCP 队头阻塞**：连接上某张图下载慢，阻塞后续
- **DNS 解析开销**：多域名要多次 DNS
- **TLS 握手开销**：每个新连接都要 TLS 握手
- **服务端 socket 占用**：6 个连接 × 大量用户 = 大量 socket

**4. HTTP/1.x 时代的解决方案**

**4.1 域名分片（Domain Sharding）**

把图片分散到多个域名，每个域名独立 6 连接：

```html
<img src="https://static1.example.com/1.jpg">
<img src="https://static1.example.com/2.jpg">
<img src="https://static1.example.com/3.jpg">
<img src="https://static2.example.com/4.jpg">
<img src="https://static2.example.com/5.jpg">
...
<img src="https://static3.example.com/10.jpg">
```

3 个域名 × 6 连接 = 18 并发，10 张图能同时下载。

代价：DNS 查询、TLS 握手增多。

**4.2 雪碧图（Sprite）**

把多张小图标合并成一张大图，用 CSS `background-position` 切片：

```css
.icon {
  background: url('/sprite.png') no-repeat;
}
.icon-home { background-position: 0 0; }
.icon-user { background-position: -16px 0; }
```

10 个图标变成 1 张图，1 个请求搞定。

**4.3 内联 Base64**

小图直接 Base64 内联到 HTML/CSS：

```html
<img src="data:image/png;base64,iVBORw0KGgo..." />
```

```css
.logo {
  background: url('data:image/png;base64,...');
}
```

- 0 个 HTTP 请求
- 但 HTML/CSS 文件变大
- 不能缓存（每次请求 HTML 都要带）
- 适合 &lt; 4KB 的小图

**4.4 懒加载**

```html
<img src="placeholder.jpg" data-src="real.jpg" loading="lazy">
```

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.src = e.target.dataset.src
      observer.unobserve(e.target)
    }
  })
})
document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img))
```

只加载视口内的图，滚动到才加载。

**4.5 启用 keep-alive**

```http
Connection: keep-alive
```

复用 TCP 连接，减少握手开销。

**5. HTTP/2 的解决方案**

**5.1 多路复用**

一个 TCP 连接可以并发多个流：

```text
单条 TCP 连接：
├── Stream 1: img1
├── Stream 2: img2
├── Stream 3: img3
...
└── Stream 10: img10
全部并发！
```

- 不再需要域名分片（反而有害：HPACK 表失效）
- 不再需要雪碧图（多请求本身不慢了）
- 不再需要内联 Base64（请求开销极小）

**5.2 HPACK 头部压缩**

每张图的请求头都被压缩，体积大幅减小。

**5.3 流优先级**

可以为关键图片设高优先级，优先传输：

```text
Stream 1 (high): 关键 logo
Stream 2-10 (low): 其他图片
```

**6. HTTP/3 的进一步优化**

- QUIC 基于 UDP，无 TCP 队头阻塞
- 流之间独立，img1 丢包不阻塞 img2
- 0-RTT 握手，建连更快
- 连接迁移（WiFi→4G 不断连）

**7. 现代最佳实践**

```html
<!-- 1. 用 WebP / AVIF 替代 JPEG/PNG（更小） -->
<img src="photo.webp" />

<!-- 2. 响应式图片 -->
<picture>
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" />
</picture>

<!-- 3. 懒加载（原生） -->
<img src="photo.jpg" loading="lazy" decoding="async" />

<!-- 4. CDN -->
<img src="https://cdn.example.com/photo.jpg" />

<!-- 5. 不再做域名分片（HTTP/2 下有害） -->
```

**8. 性能对比**

| 方案 | 10 张图并发数 | 总耗时（示意） |
|------|--------------|---------------|
| HTTP/1.1 单域名 | 6 | 2 × RTT |
| HTTP/1.1 + 域名分片（3 域） | 18 | 1 × RTT |
| HTTP/1.1 + 雪碧图 | 1 | 1 × RTT（但图大） |
| HTTP/2 单域名 | 10 | 1 × RTT |
| HTTP/3 单域名 | 10 | 1 × RTT（弱网更优） |

**总结**：HTTP/1.x 下 10 张图受 6 连接限制要排队，通过域名分片、雪碧图、Base64 内联、懒加载解决。HTTP/2 多路复用让单连接并发所有请求，彻底解决问题，且不应再做域名分片。

## HTTP传输大文件

HTTP 传输大文件（视频、安装包、备份）有多个挑战：**首字节延迟、内存占用、断点续传、流量控制**。HTTP 提供了多种机制应对。

**1. 核心挑战**

- 服务器一次性读取整个大文件会占大量内存
- 网络中断后从头传，浪费已传部分
- 大文件传输占用连接时间长，影响其他请求
- 用户带宽有限，下载慢影响体验
- 没法分块给用户

**2. 主要机制**

| 机制 | 头字段 | 用途 |
|------|--------|------|
| 分块传输 | `Transfer-Encoding: chunked` | 总长度未知时分块发 |
| 范围请求 | `Range` / `Content-Range` | 断点续传、分片下载 |
| 压缩 | `Content-Encoding: gzip, br` | 减小体积 |
| 流式响应 | SSE、HTTP Streaming | 边生成边传 |
| 持久连接 | `Connection: keep-alive` | 复用连接 |

**3. 分块传输（Chunked Transfer Encoding）**

服务器不知道总长度时（如流式生成），用分块传输：

```http
HTTP/1.1 200 OK
Transfer-Encoding: chunked

19\r\n
<html><head><title>Chunk
\r\n
1A\r\n
ed Transfer</title></head>
\r\n
0\r\n
\r\n
```

每块格式：
- 十六进制长度 + CRLF
- 数据 + CRLF
- 0 表示结束

应用：动态生成的 HTML、SSE、大文件分块流式输出。

**4. 范围请求（Range Request / 断点续传）**

**4.1 单段范围**

```http
# 请求文件 0-1023 字节
GET /big.mp4 HTTP/1.1
Range: bytes=0-1023

# 响应
HTTP/1.1 206 Partial Content
Content-Range: bytes 0-1023/10240
Content-Length: 1024
Accept-Ranges: bytes
```

**4.2 多段范围**

```http
Range: bytes=0-1023, 2048-3071

HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=THIS_STRING_SEPARATES

--THIS_STRING_SEPARATES
Content-Range: bytes 0-1023/10240
[0-1023 字节]
--THIS_STRING_SEPARATES
Content-Range: bytes 2048-3071/10240
[2048-3071 字节]
--THIS_STRING_SEPARATES--
```

**4.3 断点续传流程**

```text
1. 客户端下载到 5MB 时网络中断
2. 重新发起请求：
   Range: bytes=5242880-
3. 服务器从 5MB 处继续传
4. 客户端拼接已下载 + 新数据
```

**4.4 服务端要支持**

```http
# 响应头声明支持范围请求
Accept-Ranges: bytes
```

`Accept-Ranges: none` 表示不支持。

**4.5 Nginx 配置**

Nginx 默认支持 Range 请求，对静态文件直接生效。常见配置：

```nginx
location /download/ {
    # 启用 sendfile（零拷贝）
    sendfile on;
    # 启用 aio（异步 IO）
    aio threads;
    # 限速（防止单连接占满带宽）
    limit_rate 1m;
}
```

**5. 分片上传（Chunked Upload）**

客户端把大文件切成多片，逐个上传：

```text
1. 文件 1GB → 切成 1000 个 1MB 块
2. 并发上传各块
3. 全部上传完，请求服务端合并
4. 服务端合并成完整文件
```

```js
// 客户端切片
const CHUNK_SIZE = 1024 * 1024  // 1MB
const chunks = []
for (let i = 0; i < file.size; i += CHUNK_SIZE) {
  chunks.push(file.slice(i, i + CHUNK_SIZE))
}

// 并发上传
await Promise.all(chunks.map((chunk, index) =>
  fetch(`/upload?index=${index}&total=${chunks.length}`, {
    method: 'POST',
    body: chunk
  })
))

// 通知合并
await fetch('/merge', { method: 'POST', body: JSON.stringify({ filename: file.name, total: chunks.length }) })
```

**优点**：
- 断点续传（只续传失败的块）
- 并发上传，速度更快
- 内存占用低
- 进度可控

**6. 秒传（内容哈希）**

上传前先算文件哈希，问服务端是否已有：

```text
1. 客户端算 MD5 / SHA-256
2. 请求 /check?hash=xxx
3. 服务端命中 → 直接秒传（不传文件）
4. 未命中 → 走分片上传
```

百度网盘、阿里云 OSS 都用此机制。

**7. 流式传输（Streaming）**

视频流、直播用 HTTP Streaming：

```text
GET /video.mp4 HTTP/1.1
Range: bytes=0-

HTTP/1.1 206 Partial Content
Content-Type: video/mp4
Transfer-Encoding: chunked
[持续输出数据]
```

**8. 视频流媒体协议**

- **HLS（HTTP Live Streaming）**：把视频切成 .ts 小片，用 .m3u8 索引
- **DASH**：类似 HLS，国际标准
- **MP4 流式**：直接 Range 请求 mp4，浏览器渐进式播放

```text
HLS 流程：
1. 客户端请求 /video.m3u8
2. m3u8 列出 video1.ts、video2.ts、video3.ts...
3. 客户端按顺序下载 .ts 分片
4. 边下边播
```

**9. 压缩与编码**

- 文本类大文件（CSV、JSON、日志）：gzip / br
- 视频：H.264 / H.265 / AV1 编码（与 HTTP 无关）
- 图片：WebP / AVIF

```http
Accept-Encoding: gzip, br
Content-Encoding: br
```

**10. 限流与防滥用**

- 限制单连接带宽：`limit_rate 1m;`
- 限制并发数：Nginx `limit_conn`
- 鉴权：登录或 Token 才能下载
- 防盗链：`Referer` 校验
- 签名 URL：限时下载链接

```nginx
# 生成签名 URL，限时 5 分钟
location /download/ {
    secure_link $arg_md5,$arg_expires;
    secure_link_md5 "$secure_link_expires$uri$remote_addr secret";
    if ($secure_link = "") { return 403; }
    if ($secure_link = "0") { return 410; }  # 链接过期
}
```

**11. CDN 加速**

大文件部署到 CDN：
- 用户就近下载
- CDN 节点之间分片同步
- 源站带宽压力小

**12. 实战建议**

| 场景 | 推荐 |
|------|------|
| 大文件下载 | Range + 断点续传 + CDN |
| 大文件上传 | 分片 + 秒传 + 并发 |
| 视频 | HLS / DASH |
| 实时流 | SSE / HTTP Streaming |
| 日志文件 | gzip + 分块传输 |
| 备份文件 | 离线下载 + 通知 |

**总结**：HTTP 传输大文件的核心机制是 `Transfer-Encoding: chunked`（分块）和 `Range`（范围请求/断点续传）。结合分片上传、内容哈希秒传、CDN 加速、限流防盗链等手段，可以高效安全地传输大文件。

## HTTP的代理服务

- 负载均衡： 代理服务器可以分发客户端请求到多个目标服务器，以实现负载均衡。这有助于提高系统的可伸缩性和性能。
- 健康检查：使用“心跳”等机制监控后端服务器，发现有故障就及时“踢出”集群，保证服务高可用；
- 安全防护：保护被代理的后端服务器，限制 IP地址或流量，抵御网络攻击和过载；
- 加密卸载：对外网使用 SSL/TLS 加密通信认证，而在安全的内网不加密，消除加解密成本；
- 数据过滤：拦截上下行的数据，任意指定策略修改请求或者响应；
- 内容缓存：暂存、复用服务器响应
