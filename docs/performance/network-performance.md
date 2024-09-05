---
sidebar_position: 5
---

# 网络性能

网络性能是加载性能的延伸：当资源体积已经压到极致、代码已经分割完毕，**资源如何高效地从服务器到达浏览器**就成了下一个优化点。本章关注 HTTP 协议特性、缓存策略、CDN、域名分片与合并、传输压缩等网络层优化手段。

## HTTP 协议演进

理解 HTTP 协议的演进是网络性能优化的基础，不同版本带来的能力差异决定了优化策略。

### HTTP/1.1 的瓶颈

- **队头阻塞（Head of Line Blocking）**：每个 TCP 连接同时只能处理一个请求，前一个未完成则后续等待
- **连接数受限**：浏览器对同一域名限制约 6 个并发连接
- **冗余头部**：每次请求都带完整 Header，cookie、UA 重复传输
- **明文传输**：不支持压缩（除非自行加 Gzip）

为了绕开 6 个连接限制，HTTP/1.1 时代有"域名分片"（Domain Sharding）的优化手段——把资源分散到多个域名下，每个域名 6 个连接，总数就上去了。

### HTTP/2 的关键特性

| 特性 | 说明 | 性能收益 |
| --- | --- | --- |
| **多路复用** | 一个 TCP 连接上并行多个请求/响应 | 解决 HTTP 队头阻塞，连接数不再是瓶颈 |
| **二进制分帧** | 数据拆为帧，二进制传输 | 解析更快、更紧凑 |
| **头部压缩（HPACK）** | 维护头部表，重复头部只传索引 | 减少 50%+ 头部体积 |
| **Server Push** | 服务器可主动推送资源 | 减少客户端请求往返（已被 Chrome 弃用，但概念仍重要） |
| **流优先级** | 客户端可声明资源优先级 | CSS/JS 优先于图片 |

```bash
# 检查网站是否走 HTTP/2
curl -I --http2 https://example.com
# 看响应中的协议或用 Chrome DevTools 的 Protocol 列
```

### HTTP/3 与 QUIC

HTTP/3 把底层从 TCP 换成 **QUIC**（基于 UDP），解决了 TCP 层的队头阻塞：

- **独立流**：一个连接上的多个流互不阻塞，丢包只影响当前流
- **0-RTT 连接建立**：复用连接时无需重新握手
- **连接迁移**：从 WiFi 切到 4G，连接不断

### HTTP/2 时代的新注意事项

HTTP/2 之后，**域名分片反而成了反模式**：多个域名意味着多个 TLS 握手、多个连接管理开销，而单个连接上的多路复用已经足够。所以现代优化思路是**域名合并**而非分片。

但仍然有反例：**资源域名分片**用于绕开 Cookie（见下文 CDN 部分）。

## 强缓存与协商缓存

HTTP 缓存是网络性能优化中最重要的机制之一，能直接让请求"消失"，是面试必考题。

### 缓存的两层结构

```
浏览器请求资源
  ↓
1. 强缓存（Cache-Control / Expires）命中？
  命中 → 直接用，状态 200 (from disk/memory cache)，不发请求
  未命中 ↓
2. 协商缓存（Last-Modified / ETag）发请求询问服务器
  资源未变 → 返回 304 Not Modified，浏览器用本地缓存
  资源已变 → 返回 200 + 新资源 + 新缓存头
```

### 强缓存：`Cache-Control` 与 `Expires`

| 头部 | 说明 | 缺点 |
| --- | --- | --- |
| `Expires` | 绝对过期时间，如 `Wed, 09 Jul 2026 00:00:00 GMT` | 依赖客户端时间，易出错 |
| `Cache-Control: max-age=N` | 相对秒数 | 现代标准，优先级高于 `Expires` |

**`Cache-Control` 常用指令：**

| 指令 | 含义 |
| --- | --- |
| `max-age=N` | 缓存 N 秒 |
| `s-maxage=N` | 共享缓存（CDN/代理）的有效期，覆盖 `max-age` |
| `public` | 可被任何缓存存储 |
| `private` | 只能被浏览器缓存 |
| `no-cache` | **不是不缓存**，而是使用前必须协商验证 |
| `no-store` | 完全不缓存（敏感数据） |
| `must-revalidate` | 过期后必须重新验证 |
| `immutable` | 资源永不变，无需重新验证 |

```nginx
# 静态资源：长缓存 + immutable
location ~* \.(js|css|png|jpg|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, max-age=31536000, immutable";
}

# HTML：协商缓存
location / {
  add_header Cache-Control "no-cache";
}
```

### 协商缓存：`Last-Modified` 与 `ETag`

| 头部 | 请求/响应 | 说明 |
| --- | --- | --- |
| `Last-Modified` | 响应 | 资源最后修改时间 |
| `If-Modified-Since` | 请求 | 客户端上次拿到的 Last-Modified |
| `ETag` | 响应 | 资源的唯一指纹（通常是内容 hash） |
| `If-None-Match` | 请求 | 客户端上次拿到的 ETag |

```bash
# 第一次请求
> GET /app.js
< 200 OK
< ETag: "abc123"
< Cache-Control: max-age=0, must-revalidate

# 第二次请求（协商）
> GET /app.js
> If-None-Match: "abc123"
< 304 Not Modified   # 资源未变
```

### 为什么有了 Last-Modified 还要 ETag

- `Last-Modified` 精度到秒，1s 内多次修改无法识别
- `ETag` 基于内容 hash，能精确识别内容变化
- 文件被重新生成但内容相同（重新构建），`Last-Modified` 会变但 `ETag` 不变，可避免不必要的传输

### 实战缓存策略

| 资源类型 | 推荐策略 |
| --- | --- |
| HTML | `no-cache`（每次协商验证，保证最新） |
| 带 hash 的 JS/CSS（如 `app.a3f9b2.js`） | `max-age=31536000, immutable`（永久缓存） |
| 图片/字体 | `max-age=31536000` |
| API 响应 | 视场景：`no-store` 或 `max-age=60` |
| 用户隐私数据 | `private, no-store` |

**关键技巧：用文件 hash 做版本号**

```html
<!-- 文件名带 hash，内容变了 hash 就变，浏览器会重新请求 -->
<script src="/app.3a9b2f.js" defer></script>
<link rel="stylesheet" href="/style.7c1d4e.css">
```

## CDN（内容分发网络）

CDN 是一组分布在不同地理位置的服务器，把资源缓存到离用户最近的边缘节点，从而大幅降低网络延迟。

### CDN 的工作流程

```
用户 → 浏览器请求 https://cdn.example.com/app.js
  ↓
本地 DNS 解析 cdn.example.com → 最近的 CDN 边缘节点 IP
  ↓
CDN 节点检查是否已缓存该资源
  ├─ 有缓存且未过期 → 直接返回（命中，最快）
  └─ 未命中 → 向源站请求，缓存后返回（回源，较慢）
```

### CDN 带来的性能收益

- **降低 RTT**：边缘节点离用户近，往返时间从 200ms 降到 20ms
- **减轻源站压力**：大部分请求由 CDN 处理，源站只需处理回源
- **抗突发**：流量大时 CDN 分担
- **附加能力**：图片裁剪、WAF、边缘计算

### CDN 使用注意

1. **域名与主站分离**：静态资源用独立 CDN 域名，避免携带主站 cookie（减少请求体积）
2. **缓存预热**：发布新版本前主动推送资源到 CDN
3. **缓存命中率监控**：命中率低意味着大量回源
4. **缓存失效**：通过文件 hash 而非主动刷新控制缓存

### 域名分片 vs 域名合并

| 时代 | 策略 | 原因 |
| --- | --- | --- |
| HTTP/1.1 | 域名分片（多域名） | 绕开单域名 6 连接限制 |
| HTTP/2+ | 域名合并（少域名） | 多路复用已无连接瓶颈，多域名反而增加 DNS/TLS 开销 |

现代项目的资源域名策略：

- **静态资源**：一个独立的 CDN 域名（如 `static.example.com`），不带 cookie
- **API**：主域名或独立 API 域名
- **第三方资源**：按需使用 `preconnect`

## 资源合并与请求减少

虽然 HTTP/2 多路复用解除了"连接数限制"，但请求本身仍有开销（头部、调度、解析）。减少不必要的请求依然是有效优化。

### 何时合并

| 场景 | 是否合并 |
| --- | --- |
| HTTP/1.1 + 小文件多 | 合并为大文件（雪碧图、CSS/JS 合并） |
| HTTP/2 + 中等数量请求 | 不必强行合并，保持模块化 |
| 大量小图标 | 合并为 SVG sprite 或 icon font |
| 大量微小 API 请求 | 接口聚合（BFF 层） |

### CSS Sprites（雪碧图）

把多个小图标合并为一张大图，用 `background-position` 显示局部：

```css
.icon-home { background-position: 0 0; }
.icon-user { background-position: -20px 0; }
```

> 现代 Web 推荐用 SVG sprite 或 icon font 替代，体积更小、可缩放、可着色。

### 接口聚合

把多个小接口合并为一个，减少 RTT：

```bash
# 不好：5 个独立请求
GET /api/user
GET /api/notifications
GET /api/feed
GET /api/cart
GET /api/recommendations

# 好：聚合接口
GET /api/home?fields=user,notifications,feed,cart,recommendations
```

## 传输压缩

### Gzip 与 Brotli

| 压缩方式 | 压缩率 | 速度 | 浏览器支持 |
| --- | --- | --- | --- |
| Gzip | 中等 | 快 | 全部 |
| Brotli | 高（比 Gzip 高 15–25%） | 较慢（编码） | 现代浏览器 |
| Zstd | 高 + 快 | 最快 | 新兴 |

**重要**：压缩只对文本资源（HTML/CSS/JS/JSON/SVG）有效，图片、字体、视频本身已压缩，重复压缩反而浪费 CPU。

### 配置示例

```nginx
# Nginx
gzip on;
gzip_comp_level 6;             # 6 是平衡点
gzip_min_length 1024;          # 小于 1KB 不压
gzip_types
  text/plain
  text/css
  application/javascript
  application/json
  image/svg+xml;

brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/javascript application/json;
```

### HTTP/2 头部压缩（HPACK）

HTTP/2 内置头部压缩，重复的 `User-Agent`、`Cookie` 等头部只在首次发送完整内容，后续用索引引用。这是协议层透明完成的，无需配置。

## DNS 优化

DNS 查询也是网络开销的一部分，一次查询通常 20–200ms。

### DNS 预解析

```html
<!-- 提前解析第三方域名 DNS -->
<link rel="dns-prefetch" href="//cdn.example.com">
<link rel="dns-prefetch" href="//api.example.com">
<link rel="dns-prefetch" href="//stats.example.com">
```

### 避免过多域名

每个域名都需要 DNS 查询 + TCP 握手 + TLS 协商，域名越多，首屏建立连接的时间越长。**建议单页面的关键域名控制在 2–4 个以内**。

## HTTP/2 Server Push 的兴衰

Server Push 是 HTTP/2 的特色功能，服务器可在客户端请求前主动推送资源。但实际中：

- 浏览器难以判断推送资源是否已被缓存，容易重复推送
- 优先级管理复杂
- Chrome 已弃用对 HTTP/2 Server Push 的支持

**替代方案**：使用 `preload` 在 HTML 里声明高优先级资源，让浏览器自行决定。

## 长连接与连接复用

HTTP/1.1 默认 `Connection: keep-alive`，HTTP/2 天然复用连接。**关键是要确保服务端不要过早关闭连接**：

```nginx
keepalive_timeout 65s;
keepalive_requests 1000;

# HTTP/2
http2_max_concurrent_streams 128;
```

## 网络性能优化清单

| 方向 | 优化项 |
| --- | --- |
| 协议 | 启用 HTTP/2 或 HTTP/3 |
| 缓存 | 静态资源长缓存 + hash、HTML 协商缓存 |
| CDN | 静态资源走 CDN、独立无 cookie 域名 |
| 压缩 | 启用 Gzip/Brotli |
| 请求 | 减少请求、合并小资源、接口聚合 |
| DNS | dns-prefetch、避免过多域名 |
| 连接 | preconnect 第三方域名、keep-alive |
| 头部 | 精简 Cookie、HTTP/2 头部压缩 |

## 小结

| 优化点 | 核心思路 |
| --- | --- |
| HTTP/2 多路复用 | 单连接多请求，连接数不再是瓶颈 |
| 强缓存 | 命中直接返回，无网络往返 |
| 协商缓存 | 资源未变返回 304，省去传输 |
| CDN | 边缘节点缓存，降低 RTT |
| 域名合并 | HTTP/2 时代放弃分片 |
| 资源合并 | 雪碧图、SVG sprite、接口聚合 |
| 压缩 | Gzip/Brotli 减少传输体积 |

**面试要点**：能准确说出强缓存与协商缓存的头部及流程、能解释 ETag 的意义、能说明 HTTP/2 多路复用如何解决队头阻塞、能区分域名分片在 HTTP/1.1 与 HTTP/2 时代的取舍、能讲清 CDN 的工作机制与缓存策略，是网络性能题的核心考察点。
