---
sidebar_position: 2
---
# FAQ?

## chrome浏览器一般哪些进程

当用户打开一个新的标签页（Tab）时，Chrome 浏览器通常会创建一个新的渲染进程。以下是一般情况下 Chrome 浏览器中的各个进程：

1. 浏览器进程 (Browser Process)：负责浏览器的界面显示、用户交互、子进程管理，以及通过 IPC 与渲染进程、插件进程、网络进程等通信。
2. 渲染进程 (Renderer Process)：渲染网页，每个标签页都有一个独立的渲染进程，用于处理网页 V8 引擎、JavaScript 执行、布局和绘制等任务，以保证页面的流畅性和响应速度。因为渲染进程具有很高的权限，可以访问用户的敏感信息，所以 Chrome 浏览器通过沙盒机制，将每个渲染进程限制在自己的进程空间内，防止恶意代码对系统造成危害。渲染进程中还包括以下类型的子进程：
   1. 主渲染进程（Main Renderer Process）：包括浏览器界面、地址栏等元素。
   2. 子渲染进程（Sub Renderer Process）：渲染网页的具体内容。
   3. GPU渲染进程（GPU Process）：处理 GPU 相关任务，例如 3D 加速等。
3. 插件进程 (Plugin Process)：用来运行 NPAPI 插件，每种插件对应一个插件进程。
4. GPU进程 (GPU Process)：处理与 GPU 相关的任务，例如 WebGL。
5. 网络进程 (Network Process)：负责处理网络请求和响应，以及路由功能。
6. 绑定进程 (Utility Process)：负责解析运行 Chrome 浏览器内部页面协议（chrome://），以及一些外部插件服务。
7. 扩展进程 (Extension Process)：负责运行 Chrome 扩展（Extension）应用程序

## Chrome 浏览器中有以下几种线程

1. 主线程（Main Thread）：也称 UI 线程，是唯一运行在浏览器进程中的线程，负责用户界面、输入事件、JavaScript 执行和页面交互等。
2. I/O 线程（I/O Thread）：负责处理大部分浏览器事件（如鼠标点击、键盘输入等）的输入输出操作，同时管理浏览器的文件缓存。
3. 渲染线程（Render Thread）：渲染进程中的子线程，负责网页的渲染，以及与 GPU 进程交互和通信，而具体的页面 JavaScript 执行任务则由该线程进程提交到 V8 引擎线程中执行。
4. V8 引擎线程（V8 Thread）：负责 JavaScript 代码在渲染线程中的执行，包括脚本解析、执行和垃圾回收等。
5. 网络线程（Network Thread）：浏览器进程中的子线程，负责所有的网络请求和响应，与网络进程进行通信。
6. GPU 线程（GPU Thread）：GPU 进程中的线程，负责处理图像的呈现和渲染任务。

这些线程都是在各自的进程中启动的，通过进程间通信（IPC）机制来相互协作，实现浏览器的各项功能。其中，主线程、I/O 线程、网络线程、GPU 线程均由浏览器进程启动，而渲染线程和 V8 引擎线程则是由渲染进程启动。

## 有哪些可能引起前端安全的问题?

1. 跨站脚本攻击（XSS）：攻击者通过注入恶意脚本代码，使得网站在用户浏览器中执行这些脚本，从而窃取用户信息、篡改页面内容等。

2. 跨站请求伪造攻击（CSRF）：攻击者利用受害者已经登录的身份，在用户不知情的情况下发送恶意请求，执行未授权的操作。

3. 点击劫持攻击：攻击者将目标网站嵌入在一个透明的覆盖层下，诱使用户在不知情的情况下点击恶意按钮或链接，从而触发未预期的操作。

4. 不安全的数据传输：未使用加密协议（如HTTPS）传输敏感数据，导致数据被拦截和篡改。

5. 不当使用第三方库和插件：使用不受信任或过时的第三方库和插件，可能存在漏洞或安全问题，导致被攻击者利用。

6. 不当处理用户输入：未对用户输入进行充分验证和过滤，导致存在代码注入或其他安全漏洞。

7. 不当配置安全策略：未正确配置内容安全策略（CSP）、跨域资源共享（CORS）等安全策略，导致恶意脚本或资源的加载。

8. 不安全的身份验证和授权：使用不安全的方式进行用户身份验证和授权，如明文存储密码、不合理的会话管理等。

9. 敏感信息泄露：在页面或代码中不当处理敏感信息，导致信息泄露，如将敏感信息直接存储在浏览器端或日志中。

10. 过度信任客户端：未进行合适的输入验证和权限验证，使得客户端可能发送恶意请求或绕过验证。

## 网络劫持有哪几种，如何防范？

1. DNS劫持：攻击者篡改DNS解析过程，将域名解析到错误的IP地址上。防范方法包括：

   - 使用可信赖的DNS解析服务提供商。
   - 配置DNSSEC（DNS安全扩展）来验证域名解析的完整性。
   - 定期检查DNS解析配置，确保没有异常。

2. ARP劫持：攻击者在本地网络中发送虚假的ARP（地址解析协议）响应，将合法的IP地址映射到攻击者的MAC地址上。防范方法包括：

   - 使用虚拟专用网络（VPN）来加密通信，阻止ARP劫持。
   - 配置网络设备，限制网络中ARP响应的广播范围。
   - 定期检查网络设备，确保没有异常。

3. HTTP劫持：攻击者篡改HTTP通信，截取或修改数据流量。防范方法包括：

   - 使用HTTPS加密协议来保护通信的安全性。
   - 配置响应头部中的安全策略，如Strict-Transport-Security（STS）和Content-Security-Policy（CSP）。
   - 定期检查网站的通信安全性，确保没有异常。

4. WiFi劫持：攻击者通过伪造WiFi热点或中间人攻击等方式窃取用户的信息。防范方法包括：

   - 连接可信赖的WiFi网络，避免连接未知或不受信任的WiFi热点。
   - 使用VPN来加密通信，阻止中间人攻击。
   - 关闭WiFi自动连接功能，手动选择要连接的网络。

5. MITM攻击（中间人攻击）：攻击者在通信的两端之间插入自己，窃取信息或篡改通信内容。防范方法包括：

   - 使用加密通信协议，如HTTPS、SSL/TLS等，防止信息被窃取或篡改。
   - 验证服务端的数字证书，确保与合法的服务端进行通信。
   - 尽量避免使用公共的、不安全的网络进行敏感操作。

## 浏览器渲染进程的线程有哪些

1. 主线程（Main Thread）：也称为渲染线程或UI线程，负责处理用户交互、执行 JavaScript 代码、布局计算和渲染页面等任务。

2. GUI 渲染线程：负责将渲染进程接收到的绘制命令转化为页面的可视输出，包括绘制窗口、处理图像和文字等。

3. JavaScript 引擎线程：负责解析和执行 JavaScript 代码，例如 V8 引擎线程。

4. 定时器线程（Timer Thread）：负责处理定时器相关的任务，包括 setTimeout、setInterval 等。

5. 事件触发线程（Event Thread）：负责处理事件的派发和监听，例如用户交互事件、网络请求的响应等。

6. 异步 HTTP 请求线程：负责发送网络请求和接收响应数据。

7. Web Worker 线程：Web Worker 是运行在后台的独立线程，可以进行一些耗时的计算任务，与主线程相互独立。

## 僵尸进程和孤儿进程是什么？

僵尸进程：当一个进程的执行完成，但其父进程尚未对其进行处理（即尚未调用 wait() 或类似的系统调用来获取该进程的退出状态），该进程就会变成僵尸进程。僵尸进程不再执行任何代码，但仍然存在于进程表中，以记录其退出状态，直到其父进程对其进行处理。僵尸进程不会占用任何系统资源，但如果大量积累，可能会消耗一定的进程表资源。

孤儿进程：当一个父进程先于其子进程退出时，子进程就会成为孤儿进程。孤儿进程的父进程 ID 变为 1（通常为 init 进程），由 init 进程接管其管理。孤儿进程不会引起系统问题，因为它已经有一个新的父进程来管理它。

## 如何实现浏览器内多个标签页之间的通信?

1. Cookies：通过在不同标签页之间共享和读取同一域名下的 Cookie 数据来进行通信。每个标签页可以读取和修改共享的 Cookie 值，从而实现简单的通信。

2. LocalStorage/SessionStorage：使用浏览器的本地存储机制，如LocalStorage或SessionStorage，来存储和读取共享数据。不同标签页可以通过监听Storage事件来感知到其他标签页对存储的更改。

3. Broadcast Channel API：通过Broadcast Channel API实现跨标签页的消息广播和监听。该API允许在同一域名下的不同标签页之间发送消息，并通过事件订阅机制接收消息。

4. SharedWorker：使用SharedWorker作为中间代理，不同标签页可以通过与共享的Worker进行通信，实现跨标签页的消息传递。

5. IndexedDB：利用浏览器的IndexedDB提供的数据库存储功能，不同标签页可以读取和写入同一数据库中的数据，以实现数据共享和通信。

6. Window.postMessage()：使用Window.postMessage()方法，通过向其他窗口发送消息和监听消息事件来实现跨标签页的通信。这种方式可以在不同域名和跨源的窗口之间进行通信。

## 点击刷新按钮或者按 F5、按 Ctrl+F5 （强制刷新）、地址 栏回车有什么区别？

点击刷新按钮或者按 F5：浏览器直接对本地的缓存文件过期，但是 会带上 If-Modifed-Since，If-None-Match，这就意味着服务器会对 文件检查新鲜度，返回结果可能是 304，也有可能是 200。 用户按 Ctrl+F5（强制刷新）：浏览器不仅会对本地文件过期，而且 不会带上 If-Modifed-Since，If-None-Match，相当于之前从来没有 请求过，返回结果是 200。 地址栏回车： 浏览器发起请求，按照正常流程，本地检查是否过期， 然后服务器检查新鲜度，最后返回内容。

点击刷新按钮或按 F5：这两种方式是浏览器的标准刷新操作，它们会向服务器发送一个请求，请求页面的最新版本。如果服务器设置了缓存策略，浏览器会检查缓存的页面是否过期，如果过期或者没有缓存，则会重新加载页面。

按 Ctrl+F5（强制刷新）：这个快捷键组合会强制浏览器忽略缓存，无论服务器返回的响应是否被缓存，都会向服务器发送一个新的请求，获取最新版本的页面。它会忽略浏览器缓存和代理服务器缓存，始终获取最新内容。

地址栏回车：在地址栏中输入网址并按下回车，也会向服务器发送一个请求，获取页面的最新版本。如果服务器设置了缓存策略，浏览器会根据缓存是否过期来判断是否重新加载页面。

总结：

1. 点击刷新按钮或按 F5：默认刷新方式，会根据缓存策略来决定是否使用缓存。

2. 按 Ctrl+F5（强制刷新）：强制忽略缓存，总是重新请求最新版本的页面。

3. 地址栏回车：与点击刷新按钮类似，根据缓存策略来决定是否使用缓存。

这些刷新方式在页面的展示效果上并没有区别，区别主要在于是否强制忽略缓存，获取最新的页面内容。在开发过程中，使用不同的刷新方式可以帮助我们检查缓存是否正常工作，或者强制获取最新的代码变更。

## 前端储存的⽅式有哪些？

1. cookies： 在 HTML5 标准前本地储存的主要⽅式，优点是兼容性好， 请求头⾃带 cookie⽅便，缺点是⼤⼩只有 4k，⾃动请求头加⼊cookie浪费流量，每个 domain 限制 20 个 cookie，使⽤起来麻烦，需要⾃ ⾏封装；
2. localStorage：HTML5 加⼊的以键值对(Key-Value)为标准的⽅式， 优点是操作⽅便，永久性储存（除⾮⼿动删除），⼤⼩为 5M，兼容 IE8+ ；
3. sessionStorage：与 localStorage 基本类似，区别是 sessionStorage 当⻚⾯关闭后会被清理，⽽且与 cookie、localStorage 不同，他不 能在所有同源窗⼝中共享，是会话级别的储存⽅式；
4. Web SQL：2010 年被 W3C 废弃的本地数据库数据存储⽅案，但是主流 浏览器（⽕狐除外）都已经有了相关的实现，web sql 类似于 SQLite， 是真正意义上的关系型数据库，⽤sql进⾏操作，当我们⽤JavaScript 时要进⾏转换，较为繁琐；
5. IndexedDB：是被正式纳⼊HTML5 标准的数据库储存⽅案，它是 NoSQL 数据库，⽤键值对进⾏储存，可以进⾏快速读取操作，⾮常适合 web 场景，同时⽤JavaScript 进⾏操作会⾮常便。

## 标准模式和怪异模式

标准模式（Standard Mode）和怪异模式（Quirks Mode）是浏览器在渲染 HTML 页面时采用的两种不同的渲染模式。它们主要区别于页面的渲染规则和解析方式。

1. **标准模式（Standard Mode）：**
   - 也称为严格模式（Strict Mode）或标准兼容模式（Standards Mode）。
   - 在标准模式下，浏览器会按照 HTML 和 CSS 规范进行页面的渲染和排版。
   - 开发者应该优先考虑在标准模式下编写网页，以确保页面在不同浏览器中一致地呈现。

2. **怪异模式（Quirks Mode）：**
   - 也称为混杂模式（Compatibility Mode）或怪异兼容模式（Quirks Compatibility Mode）。
   - 在怪异模式下，浏览器会尝试模拟早期浏览器的渲染行为，以保持旧网站的兼容性。
   - 怪异模式可能导致页面在不同浏览器中呈现不一致，同时也可能影响到一些现代特性的使用。

如何触发这两种模式取决于页面的 `<!DOCTYPE>` 声明：

- 如果 HTML 文档中包含了有效的 `<!DOCTYPE>` 声明，且声明符合标准，浏览器会进入标准模式。
- 如果缺少 `<!DOCTYPE>` 声明，或者声明不完整或不规范，浏览器可能会进入怪异模式。

使用标准模式有助于确保页面按照当前的 HTML 和 CSS 规范进行渲染，而怪异模式可能导致页面的渲染方式与标准模式下不一致。因此，在编写网页时，建议始终提供合适的 `<!DOCTYPE>` 声明，以确保页面以标准模式渲染。

## DOCTYPE(⽂档类型) 的作⽤

浏览器渲染页面的两种模式（可通过 document.compatMode 获取.

CSS1Compat：标准模式（Strick mode），默认模式，浏览器使用 W3C 的标准解析渲染页面。在标准模式中，浏览器以其支持的最高标准呈 现页面。

BackCompat：怪异模式(混杂模式)(Quick mode)，浏览器使用自己的 怪异模式解析渲染页面。在怪异模式中，页面以一种比较宽松的向后 兼容的方式显示。

`DOCTYPE`（文档类型）是位于 HTML 文档开头的声明，用于指示浏览器使用哪个 HTML 版本解析文档。它的作用主要包括以下几个方面：

1. **文档解析模式选择：** `DOCTYPE` 声明告诉浏览器使用哪种文档解析模式来解析页面。不同的 HTML 版本有不同的解析规则和特性，`DOCTYPE` 声明帮助浏览器选择正确的解析模式，确保页面以正确的方式呈现。

2. **文档验证：** 一些 HTML 编辑器和工具可以使用 `DOCTYPE` 声明来验证文档的结构和格式是否符合规范。这有助于开发者编写符合标准的 HTML 代码。

3. **浏览器兼容性：** 不同浏览器对 HTML 版本和解析模式的支持可能有所不同。通过提供正确的 `DOCTYPE` 声明，可以确保页面在各种浏览器中以一致的方式呈现。

4. **触发标准模式：** 在标准模式下，浏览器会按照 HTML 和 CSS 规范进行页面渲染。如果缺少 `DOCTYPE` 声明或使用了过时的声明，浏览器可能会进入怪异模式（Quirks Mode），导致页面的渲染方式与标准模式不一致。

5. **性能优化：** 使用正确的 `DOCTYPE` 声明有助于浏览器更快地解析和渲染页面，提升页面加载性能。

常见的 `DOCTYPE` 声明包括以下几种：

- HTML5：`<!DOCTYPE html>`
- HTML 4.01 Strict：`<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">`
- HTML 4.01 Transitional：`<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">`
- XHTML 1.0 Strict：`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">`
- XHTML 1.0 Transitional：`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">`

正确使用 `DOCTYPE` 声明可以确保页面在不同浏览器和设备上以一致的方式呈现，提升页面的可靠性和性能。

## HTML 语义化的理解

HTML 语义化是指在编写 HTML 代码时，使用合适的标签来明确表达文档的结构和内容，使页面具有更好的可读性、可访问性和搜索引擎优化性能。语义化的 HTML 代码能够传达更多的信息，有助于开发者和浏览器正确地理解页面的结构和内容。

以下是 HTML 语义化的一些重要理解点：

1. **合适的标签选择：** 选择合适的 HTML 标签来表示不同的内容元素，如使用 `<h1>` 到 `<h6>` 标签表示标题的层级，使用 `<p>` 标签表示段落，使用 `<ul>` 和 `<ol>` 表示列表等。

2. **结构清晰：** 使用语义化的标签可以将页面的结构清晰地呈现出来，使开发者和维护者更容易理解页面的布局和内容。

3. **可访问性：** 语义化的 HTML 代码可以提升网页的可访问性，使屏幕阅读器等辅助技术更容易解读页面内容，从而使残障用户能够获得更好的浏览体验。

4. **搜索引擎优化：** 语义化的 HTML 代码有助于搜索引擎理解页面的内容，提升页面在搜索结果中的排名，从而增加网站的曝光度。

5. **未来兼容性：** 使用语义化的标签可以保证页面在未来的 HTML 版本中仍然能够正确显示和解释，增加代码的可维护性。

6. **样式和脚本分离：** 通过为不同类型的内容使用不同的标签，可以将样式和脚本与内容分离，使页面结构更清晰，易于管理。

总之，HTML 语义化是一种良好的编码实践，可以提升网页的质量和可用性，同时也有助于开发者更好地组织和维护代码。

## 浏览器是如何对 HTML5 的离线储存资源进行管理和加载？

HTML5 引入了离线储存（Offline Storage）的功能，主要通过使用应用程序缓存（Application Cache）来实现。应用程序缓存允许开发者定义一组资源，这些资源可以在用户离线时被浏览器缓存下来，从而实现离线访问。

浏览器对 HTML5 离线储存资源进行管理和加载的过程如下：

1. **定义应用程序缓存清单（Cache Manifest）：** 开发者需要在网页中创建一个文本文件，通常命名为 `manifest.appcache`，用于定义哪些资源需要被缓存。

2. **设置 HTML 标签属性：** 在 HTML 页面中，需要在 `<html>` 标签中添加 `manifest` 属性，指向定义的清单文件。例如：`<html manifest="manifest.appcache">`。

3. **浏览器解析清单文件：** 当用户访问页面时，浏览器会解析指定的清单文件，其中列出了需要离线缓存的资源，包括 HTML、CSS、JavaScript、图片等。

4. **缓存资源：** 浏览器会根据清单文件中定义的资源列表，将这些资源下载并缓存到本地。这些资源会在用户离线时使用。

5. **更新资源：** 当用户访问页面时，浏览器会检查清单文件中的资源是否有更新。如果有更新，浏览器会下载更新的资源并进行更新。这可以通过在清单文件中修改版本号等方式来触发。

6. **离线访问：** 当用户离线时，他们仍然可以访问缓存的资源，包括页面、样式、脚本等，使网页在断网或网络不稳定的情况下也能正常显示。

需要注意的是，应用程序缓存在一些方面存在一些限制和缺点，例如缓存容量受限、更新资源困难等。另外，由于安全性问题，现代的网络标准越来越倾向于使用 Service Worker 来实现更强大、灵活的离线访问和缓存控制。

## localStorage 和 cookie 到底哪个更安全

两者都不是为存储敏感数据设计的，安全性要从多个维度对比：

| 维度 | Cookie | localStorage |
|------|--------|--------------|
| 是否随请求自动携带 | 是，每次同源请求都会带上（可配置） | 否，纯本地存储 |
| 是否可被 JS 读取 | 默认可以（设置 `HttpOnly` 后 JS 读不到） | 始终可被 JS 读取 |
| 可设置 HttpOnly | 支持，能防 XSS 窃取 | 不支持 |
| 可设置 Secure | 支持，仅 HTTPS 传输 | 不支持，HTTP/HTTPS 均可访问 |
| 可设置 SameSite | 支持（Strict/Lax/None），防 CSRF | 不支持 |
| 作用域 | 同源 + 路径/domain 配置 | 仅同源 |
| 容量 | 约 4KB | 约 5MB |

**结论：**

1. **存储会话令牌等敏感凭证**：Cookie 更安全（前提是设置 `HttpOnly + Secure + SameSite=Strict/Lax`），因为 JS 无法读取，能抵御 XSS 窃取，也能借助 SameSite 降低 CSRF 风险。
2. **存储非敏感业务数据**（如用户偏好、缓存）：localStorage 更合适，容量大、API 简单、不会随请求自动发送造成流量浪费。
3. **localStorage 中绝对不要放 token/密码**：任何 XSS 都能直接 `localStorage.getItem('token')` 拿到，无法通过 `HttpOnly` 保护。

**常见误区：**

- "localStorage 比 cookie 安全" —— 错。localStorage 没有 HttpOnly、Secure、SameSite 等安全属性，一旦发生 XSS，里面的数据是裸奔的。
- "cookie 一定会带在请求里，不安全" —— 不完全对。配合 `HttpOnly`、`SameSite` 后，Cookie 反而是更安全的选择。

**实践建议：**

- 登录态：用 HttpOnly Cookie 存放 access token / refresh token，配合 CSRF Token。
- 业务缓存：用 localStorage，但不要存任何能识别用户身份的信息。
- 敏感数据宁可放服务端，前端尽量不存。

## 几个很实用的BOM属性对象方法?

BOM（Browser Object Model，浏览器对象模型）提供了独立于页面内容、与浏览器窗口交互的 API。核心对象是 `window`，下面是一些非常实用的 BOM 属性/方法：

**1. `window.location`** —— 当前 URL 信息与跳转

```js
window.location.href      // 完整 URL
window.location.protocol  // https:
window.location.host      // www.example.com:8080
window.location.search    // ?id=1&name=abc
window.location.hash      // #section1
window.location.assign('https://example.com')  // 跳转，可后退
window.location.replace('https://example.com')  // 替换，不可后退
window.location.reload()   // 刷新当前页
```

**2. `window.navigator`** —— 浏览器/设备信息

```js
navigator.userAgent   // 浏览器 UA 字符串
navigator.platform    // 操作系统平台
navigator.language    // 浏览器语言
navigator.onLine       // 是否联网
navigator.cookieEnabled // 是否启用 cookie
navigator.geolocation  // 地理定位 API
navigator.clipboard    // 剪贴板 API
```

**3. `window.history`** —— 历史记录操作

```js
history.back()       // 后退
history.forward()    // 前进
history.go(-2)       // 后退两步
history.length       // 历史栈长度
history.pushState({page: 1}, '', '/page1')  // SPA 路由常用
history.replaceState({}, '', '/new-url')
```

**4. `window.screen`** —— 屏幕信息

```js
screen.width / screen.height     // 屏幕分辨率
screen.availWidth / availHeight // 可用区域（除任务栏）
screen.orientation.angle         // 屏幕旋转角度
```

**5. `window` 通用方法**

```js
window.innerWidth / innerHeight   // 视口宽高
window.devicePixelRatio            // 设备像素比
window.scrollTo(x, y)             // 滚动到指定位置
window.scrollTo({ top: 0, behavior: 'smooth' }) // 平滑滚动
window.alert() / confirm() / prompt()  // 系统对话框
window.open('https://example.com')     // 打开新窗口
window.close()                          // 关闭当前窗口
```

**6. 其他常用 API**

- `window.localStorage` / `sessionStorage`：本地存储
- `window.setTimeout` / `setInterval`：定时器
- `window.requestAnimationFrame`：动画帧
- `window.matchMedia('(max-width: 768px)')`：媒体查询
- `window.scrollTo`、`scrollBy`：滚动控制

## 浏览器在生成页面的时候，会生成那两颗树？

浏览器渲染页面时会构造两棵关键的树：**DOM 树**和 **CSSOM 树**，再合成渲染树用于布局和绘制。

**1. DOM 树（Document Object Model）**

由 HTML 解析而来，描述页面结构和元素层级关系。每个 HTML 标签是一个节点，文本、注释也是节点。

```html
<html>
  <head><title>Demo</title></head>
  <body>
    <div id="app"><p>Hello</p></div>
  </body>
</html>
```

```text
document
└── html
    ├── head
    │   └── title
    └── body
        └── div#app
            └── p
                └── "Hello"
```

**2. CSSOM 树（CSS Object Model）**

由 CSS 解析而来（包括 `<style>`、`<link>`、内联样式、浏览器默认样式、用户样式），描述样式规则的层级与覆盖关系。

```css
body { font-size: 14px; }
#app p { color: red; }
```

```text
body (font-size: 14px)
└── div#app
    └── p (color: red)
```

**3. 渲染树（Render Tree）**

DOM + CSSOM 合成渲染树，**只包含可见节点**（`display: none` 不入渲染树；`visibility: hidden` 仍入但不可见）。渲染树才是后续布局（Layout）和绘制（Paint）的输入。

```text
RenderObject (root)
├── body (font-size: 14px)
└── div#app
    └── p (color: red)
        └── "Hello"
```

**完整渲染流程：**

```
HTML ─parse─► DOM ─┐
                    ├─ attach ─► Render Tree ─► Layout ─► Paint ─► Composite
CSS ─parse─► CSSOM ─┘
```

- **Layout（布局/Reflow）**：计算每个渲染对象的几何位置、大小
- **Paint（绘制/Repaint）**：将渲染对象绘制为像素位图
- **Composite（合成）**：把各图层合成最终画面，GPU 加速

**额外补充：** 现代浏览器还有 **层树（Layer Tree）**、**绘制列表（Paint Record）**、**合成图层** 等概念，用于 GPU 加速；还有渲染进程对应的 **排版引擎（Blink/WebKit）** 和 **JS 引擎（V8）** 协作。

## 怎么看网站的性能如何

网站性能可以从**测量指标**、**测量工具**、**性能优化方向**三个层面来评估。

**1. 性能指标**

**a. 加载性能**

- **FP（First Paint）**：首次绘制
- **FCP（First Contentful Paint）**：首次内容绘制
- **LCP（Largest Contentful Paint）**：最大内容绘制，建议 &lt; 2.5s
- **TTI（Time to Interactive）**：可交互时间
- **TTFB（Time to First Byte）**：首字节响应时间，建议 &lt; 200ms
- **DCL（DOMContentLoaded）**：DOM 解析完成
- **Load**：所有资源加载完成
- **白屏时间**：导航开始到首次显示

**b. 交互性能（Core Web Vitals）**

- **LCP**（最大内容绘制）：&lt; 2.5s
- **FID/INP**（首次输入延迟 / 交互延迟）：&lt; 100ms
- **CLS**（累积布局偏移）：&lt; 0.1

**c. 运行性能**

- FPS（帧率）：稳定 60fps
- 长任务（Long Task）：> 50ms 的任务
- JS 堆内存占用

**2. 测量工具**

| 工具 | 用途 |
|------|------|
| **Chrome DevTools - Performance** | 录制火焰图，分析 JS/渲染/绘制耗时 |
| **Lighthouse** | 综合评分（性能、无障碍、SEO、PWA） |
| **Chrome DevTools - Network** | 瀑布图、资源大小、请求耗时 |
| **WebPageTest** | 多地点/多浏览器真机测试 |
| **Performance API** | JS 中采集 FCP/LCP/TTFB 等 |
| **`performance.now()`** | 高精度计时 |
| **PageSpeed Insights** | 线上评分 + 优化建议 |
| **Sentry / 阿里 ARMS** | 线上真实用户监控（RUM） |

**代码采集：**

```js
const [entry] = performance.getEntriesByType('navigation')
console.log('TTFB:', entry.responseStart - entry.requestStart)
console.log('DOM Ready:', entry.domContentLoadedEventEnd - entry.startTime)
console.log('Load:', entry.loadEventEnd - entry.startTime)

// LCP
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('LCP:', entry.startTime)
  }
}).observe({ type: 'largest-contentful-paint', buffered: true })
```

**3. 优化方向**

- **网络**：CDN、HTTP/2、预连接、缓存、压缩
- **资源**：代码分割、懒加载、tree-shaking、图片优化（WebP/AVIF）
- **渲染**：避免大面积 reflow/repaint、CSS 优化、虚拟列表
- **执行**：拆分长任务、Web Worker、`requestIdleCallback`
- **服务端**：SSR/SSG、Edge Runtime

## web性能优化

Web 性能优化是系统工程，从用户输入 URL 到看到页面、再到交互，每个环节都有优化空间。

**一、网络层**

1. **减少 HTTP 请求**：合并文件、雪碧图、内联小资源
2. **启用 HTTP/2 / HTTP/3**：多路复用、头部压缩
3. **使用 CDN**：就近分发静态资源
4. **DNS 预解析**：`<link rel="dns-prefetch" href="//cdn.example.com">`
5. **预连接**：`<link rel="preconnect" href="https://cdn.example.com">`
6. **资源预加载**：`<link rel="preload" href="app.js" as="script">`
7. **强缓存 + 协商缓存**：静态资源带 hash 长缓存，HTML 走协商
8. **Gzip/Brotli 压缩**：减小传输体积
9. **使用 Service Worker 离线**：缓存兜底

**二、资源层**

1. **代码分割**（code splitting）：按路由懒加载
2. **Tree Shaking**：删除无用代码
3. **压缩 JS/CSS/HTML**：Terser、cssnano
4. **图片优化**：
   - 用 WebP/AVIF 替代 JPEG/PNG
   - `<picture>` + `srcset` 响应式图片
   - 懒加载 `<img loading="lazy">`
   - 用 SVG 替代图标字体
5. **字体优化**：`font-display: swap`、子集化

**三、渲染层**

1. **CSS 放 `<head>`**：避免阻塞渲染
2. **JS 放底部或加 `defer`/`async`**
3. **减少 reflow/repaint**：用 `transform`/`opacity` 做动画
4. **虚拟列表**：长列表只渲染可视区域
5. **避免强制同步布局**：批量读写 DOM
6. **`content-visibility: auto`**：跳过屏幕外内容渲染
7. **`will-change`** 提示浏览器优化

**四、JS 执行**

1. **拆分长任务**：用 `setTimeout` / `scheduler.yield()` 切片
2. **Web Worker**：把计算移出主线程
3. **`requestIdleCallback`**：低优先级任务
4. **防抖 / 节流**：滚动、resize、input
5. **事件委托**：减少监听器数量

**五、服务端**

1. **SSR / SSG**：首屏直出，利于 SEO
2. **边缘计算**（Edge Functions）：就近渲染
3. **接口合并**：BFF 聚合多个后端请求
4. **数据库索引 / 缓存**

**六、监控**

```js
// 采集 Web Vitals
new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    navigator.sendBeacon('/metrics', JSON.stringify({
      name: entry.name,
      value: entry.startTime
    }))
  })
}).observe({ type: 'largest-contentful-paint', buffered: true })
```

**七、关键指标**

- LCP &lt; 2.5s
- FID/INP &lt; 100ms
- CLS &lt; 0.1
- TTFB &lt; 200ms

## 如何捕获CDN上的js运行时导致的详细错误信息？

CDN 上的 JS 文件报错时，由于**跨域**和**Safari/Chrome 的安全策略**，`window.onerror` 默认只能拿到 `Script error.`，看不到堆栈和详情。要捕获详细错误，需要从**响应头、Source Map、错误监控**三方面入手。

**1. 为什么只能拿到 "Script error."**

当 JS 文件跨域加载（CDN 域名 ≠ 页面域名）时，浏览器出于安全考虑，不允许读取跨域脚本的详细错误信息：

```js
// 默认情况
window.onerror = (msg, url, line, col, err) => {
  console.log(msg)   // "Script error."
  console.log(url)    // ""
  console.log(err)    // null
}
```

只有 `msg = "Script error."`，其他都是空。

**2. 第一步：让 CDN 脚本「跨域可见」**

**2.1 给 `<script>` 加 `crossorigin` 属性**

```html
<script src="https://cdn.example.com/app.js" crossorigin="anonymous"></script>
```

- `anonymous`：以匿名方式请求，不带 Cookie
- `use-credentials`：带 Cookie 请求

**2.2 CDN 必须返回 CORS 响应头**

```http
Access-Control-Allow-Origin: *
# 或具体域名
Access-Control-Allow-Origin: https://www.example.com
```

只有同时满足这两个条件，浏览器才允许读取详细错误。

**2.3 Nginx 配置 CDN CORS**

```nginx
location ~* \.js$ {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, HEAD, OPTIONS';
    # 或针对具体来源
    # add_header Access-Control-Allow-Origin https://www.example.com;
}
```

**3. 第二步：用 `window.onerror` 捕获**

```js
window.onerror = function(msg, url, line, col, error) {
  // 现在能拿到详细信息
  reportError({
    msg,
    url,
    line,
    col,
    stack: error?.stack,
    userAgent: navigator.userAgent,
    time: Date.now()
  })
  return false  // 不阻止默认错误处理
}
```

**4. 第三步：用 `unhandledrejection` 捕获 Promise 异常**

```js
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason
  reportError({
    msg: 'Unhandled Rejection',
    stack: reason?.stack || String(reason),
    promise: event.promise
  })
})

// 资源加载失败（图片、脚本）
window.addEventListener('error', (event) => {
  const target = event.target
  if (target && (target.tagName === 'SCRIPT' || target.tagName === 'IMG' || target.tagName === 'LINK')) {
    reportError({
      msg: 'Resource load failed',
      url: target.src || target.href,
      type: 'resource_error'
    })
  }
}, true)   // 注意：捕获阶段
```

**5. 第四步：Source Map 还原压缩前的堆栈**

CDN 上的 JS 通常是压缩混淆过的（变量名变 a/b/c），堆栈看起来没意义：

```text
at a (app.min.js:1:23456)
at b (app.min.js:1:12345)
```

需要 Source Map 还原：

**5.1 构建时生成 Source Map**

```js
// vite.config.js
export default {
  build: {
    sourcemap: true,   // 或 'hidden'（不在文件里引用，但生成 .map）
  }
}

// webpack.config.js
module.exports = {
  devtool: 'hidden-source-map'   // 生成但不引用
}
```

**5.2 Source Map 不上传到 CDN**

- `.map` 文件**不要部署到生产环境**（用户能反查源码）
- 上传到错误监控平台，由平台解析

**5.3 用工具还原堆栈**

```js
const { SourceMapConsumer } = require('source-map')
const fs = require('fs')

const rawSourceMap = JSON.parse(fs.readFileSync('app.js.map', 'utf8'))
SourceMapConsumer.with(rawSourceMap, null, (consumer) => {
  // 把压缩后的行列号转回原文件
  const original = consumer.originalPositionFor({
    line: 1,
    column: 23456
  })
  console.log(original)
  // { source: 'src/app.js', line: 42, column: 10, name: 'handleClick' }
})
```

**6. 第五步：用错误监控平台**

主流平台都支持 Source Map 上传 + 自动解析：

- **Sentry**：上传 sourcemap，自动还原堆栈
- **Bugsnag**、**Rollbar**
- 阿里 ARMS、腾讯 BadJS、字节 Slardar

Sentry 配置：

```js
// vite-plugin-sentry
import { vitePluginSentry } from 'vite-plugin-sentry'

export default {
  plugins: [
    vitePluginSentry({
      config: {
        authToken: 'xxx',
        org: 'myorg',
        project: 'frontend',
      },
      sourcemaps: {
        url: 'https://cdn.example.com/assets',
        filesToDeleteAfterUpload: ['*.map']
      }
    })
  ]
}
```

**7. 实际工作流**

```text
1. 构建时生成 Source Map（hidden 模式）
2. 上传 .map 到 Sentry
3. 部署 JS 到 CDN（不含 .map 引用）
4. <script crossorigin="anonymous">
5. CDN 配置 Access-Control-Allow-Origin
6. window.onerror / unhandledrejection 上报到 Sentry
7. Sentry 自动用 Source Map 还原压缩前的堆栈
8. 收到详细错误：源文件、行号、变量名、原始堆栈
```

**8. 常见坑**

- **CDN 没配 CORS**：还是只能拿到 "Script error."
- **`crossorigin` 没加**：JS 加载正常但错误看不到
- **Source Map 上传到 CDN**：被用户发现能反查源码
- **Source Map 与构建版本不匹配**：还原错误
- **CSP 拦截上报**：CSP `connect-src` 要允许上报域名

**总结**：捕获 CDN 上 JS 错误的核心是 `crossorigin` 属性 + CDN CORS 响应头 + Source Map。两步缺一不可，再用错误监控平台自动解析堆栈。

