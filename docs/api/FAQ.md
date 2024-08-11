---
sidebar_position: 2
---
# FAQ?
## 一句话概括RESTFUL

**REST（Representational State Transfer，表述性状态转移）是一种基于 HTTP 的 Web 架构风格：用 URL 定位资源，用 HTTP 方法（GET/POST/PUT/DELETE/PATCH）表达对资源的操作，用 HTTP 状态码表达操作结果，无状态、统一接口、对资源做增删改查。**

**核心要点：**

1. **资源（Resource）**：一切皆资源，用 URL 标识，如 `/users/123`
2. **统一接口**：用 HTTP 方法对应 CRUD 操作
3. **无状态**：每个请求自包含，服务端不保存客户端状态
4. **表述（Representation）**：资源以 JSON/XML/HTML 等格式表现
5. **状态转移**：通过操作资源实现应用状态变化

| HTTP 方法 | 语义 | 幂等 | 安全 | 示例 |
|-----------|------|------|------|------|
| GET | 查询 | 是 | 是 | `GET /users/123` |
| POST | 新建 | 否 | 否 | `POST /users` |
| PUT | 全量更新 | 是 | 否 | `PUT /users/123` |
| PATCH | 局部更新 | 否 | 否 | `PATCH /users/123` |
| DELETE | 删除 | 是 | 否 | `DELETE /users/123` |

**RESTful API 设计示例：**

```
GET    /api/users          # 获取用户列表
POST   /api/users          # 创建用户
GET    /api/users/123       # 获取单个用户
PUT    /api/users/123       # 更新用户（全量）
PATCH  /api/users/123       # 更新用户（局部）
DELETE /api/users/123       # 删除用户
GET    /api/users/123/orders  # 获取某用户的订单（嵌套资源）
```

**对比传统风格：** 传统风格如 `POST /api/deleteUser?id=123`，动词在 URL 里；RESTful 风格用 HTTP 方法表达动作，URL 只表示资源。

## GET 和 POST 的请求的区别

1. 参数位置：GET 请求的参数是通过 URL 的查询字符串（query string）传递的，即参数会附加在 URL 的末尾。而 POST 请求的参数是通过请求的消息体（request body）传递的，参数不会直接显示在 URL 中。

2. 参数长度：由于 GET 请求的参数是附加在 URL 中的，所以参数长度受限于浏览器和服务器对 URL 长度的限制，通常在 2048 个字符左右。而 POST 请求的参数可以通过请求消息体传递，没有长度限制。

3. 安全性：GET 请求的参数会显示在 URL 中，因此不适合传递敏感信息，例如密码等。而 POST 请求的参数在消息体中，相对较安全，适合传递敏感信息。

4. 缓存：GET 请求默认可以被缓存，因为它的参数是显示在 URL 中的，浏览器可以直接使用缓存数据。而 POST 请求默认是不缓存的，因为它的参数不会显示在 URL 中，浏览器无法判断是否需要使用缓存数据。

5. 使用场景：GET 请求适用于请求数据，比如获取网页、图片等资源，以及向服务器查询数据。而 POST 请求适用于提交数据，比如用户登录、注册等操作，以及向服务器发送数据。

综上所述，GET 请求适合用于获取数据，参数较少且不敏感；而 POST 请求适合用于提交数据，参数较多且可能包含敏感信息。在实际应用中，根据请求的目的和数据的安全性来选择使用 GET 或 POST 方法。

## POST 和 PUT 请求的区别

1. 目的：POST 请求用于向服务器提交新的实体数据，通常用于创建资源。而 PUT 请求用于向服务器提交更新后的实体数据，通常用于更新资源。

2. 幂等性：POST 请求不具备幂等性，多次相同的 POST 请求会创建多个资源。而 PUT 请求具备幂等性，多次相同的 PUT 请求会更新同一资源，不会产生副作用。

3. 数据位置：POST 请求的数据是通过请求的消息体（request body）传递的，参数不会显示在 URL 中。而 PUT 请求的数据也是通过请求的消息体传递的，但通常会包含资源的标识符在 URL 中。

4. 资源标识符：对于 POST 请求，服务器通常会生成新的资源标识符，返回给客户端。而对于 PUT 请求，客户端需要在请求的 URL 中指定要更新的资源标识符。

5. 并发性：由于 PUT 请求具备幂等性，多个客户端同时发送相同的 PUT 请求不会产生冲突。而对于 POST 请求，多个客户端同时提交相同的数据可能会导致资源的创建冲突。

综上所述，POST 请求用于向服务器提交新的实体数据，不具备幂等性；而 PUT 请求用于向服务器提交更新后的实体数据，具备幂等性。正确选择 POST 或 PUT 请求取决于具体的应用场景和资源的创建或更新需求。

## 常见的 HTTP 请求方法

1. `GET`: 获取指定资源的信息。GET 请求通常用于从服务器获取数据，并不对服务器资源产生任何副作用。它应该是幂等的，多次请求相同的资源应该返回相同的结果。

2. `POST`: 在服务器上创建新的资源或提交数据。POST 请求通常用于提交表单数据或执行非幂等的操作。每次请求可能会创建新的资源或对服务器资源产生影响。

3. `PUT`: 更新服务器上的指定资源。PUT 请求通常用于更新已经存在的资源，其具备幂等性，多次相同的 PUT 请求应该对资源进行完全替换更新。

4. `DELETE`: 删除服务器上的指定资源。DELETE 请求用于删除服务器上的资源，其具备幂等性，多次相同的 DELETE 请求应该对资源产生相同的结果。

5. `PATCH`: 对服务器上的指定资源进行局部更新。PATCH 请求用于对资源的部分属性进行更新，而不是替换整个资源。它通常是非幂等的。

6. `HEAD`: 类似于 GET 请求，但只返回资源的头部信息而不返回实际内容。HEAD 请求用于获取资源的元数据，如响应状态、内容长度等。

7. `OPTIONS`: 查询服务器支持的请求方法。OPTIONS 请求用于检查服务器允许客户端使用的请求方法和其他可用功能。

8. `TRACE`: 回显服务器收到的请求，用于测试和诊断。

这些 HTTP 请求方法定义了客户端和服务器之间进行通信的不同方式，每种请求方法都有特定的语义和用途。在实际应用中，开发人员根据业务需求和 RESTful API 设计原则选择合适的请求方法。

## GET可以上传图片吗

**理论上可以，实际工程中几乎不该这么做**——上传文件应使用 POST/PUT。

**1. 技术上可行的方案**

GET 请求可以通过 URL 查询参数或路径携带数据。把图片 Base64 编码后塞进 URL：

```text
GET /upload?data=data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...

# 或 path 参数
GET /upload/data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
```

**2. 但有大量问题**

**2.1 URL 长度限制**

- 浏览器限制：Chrome ~2MB，IE ~2083 字符，Firefox ~64KB
- 服务器限制：Nginx 默认 8KB，Apache 默认 8KB
- 一张 100KB 的图片 Base64 后约 137KB，几乎肯定超限

**2.2 不符合语义**

- GET 语义是「安全、幂等的获取资源」，不应产生副作用
- 上传是修改服务器状态，应该用 POST/PUT
- RESTful 规范、HTTP 规范都建议写操作用 POST/PUT

**2.3 安全问题**

- URL 会出现在：
  - 浏览器历史记录
  - 服务器访问日志
  - 代理服务器日志
  - Referer 头
  - CDN 缓存日志
- 即使 HTTPS，URL 路径也可能被中间节点记录
- 图片内容泄露风险

**2.4 无法用 multipart/form-data**

- GET 没有 body，无法用 `multipart/form-data` 上传二进制
- 必须 Base64 编码，体积增大 33%
- 服务端要解码 Base64，CPU 开销

**2.5 缓存问题**

- GET 请求可能被浏览器、CDN、代理缓存
- 上传请求被缓存 → 副作用丢失或重复

**2.6 触发 CORS 预检？**

- 如果 URL 带自定义头 → 触发
- 不带则属于简单请求 → 不触发

**3. 正确的图片上传方式**

**3.1 POST + multipart/form-data（最标准）**

```html
<form action="/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="file" />
  <button>上传</button>
</form>
```

```js
const formData = new FormData()
formData.append('file', fileInput.files[0])
fetch('/upload', {
  method: 'POST',
  body: formData        // 不要手动设 Content-Type
})
```

**3.2 POST + Base64（小图）**

```js
// 仅适用于头像、缩略图等小图
const reader = new FileReader()
reader.onload = () => {
  fetch('/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: reader.result })
  })
}
reader.readAsDataURL(file)
```

**3.3 PUT + 二进制（REST 风格）**

```js
fetch('/images/avatar.png', {
  method: 'PUT',
  headers: { 'Content-Type': 'image/png' },
  body: file       // 直接传 Blob/File
})
```

**3.4 大文件分片上传**

```js
// 切片后用 POST 上传
const chunk = file.slice(start, end)
const formData = new FormData()
formData.append('chunk', chunk)
formData.append('index', i)
formData.append('total', total)
fetch('/upload-chunk', { method: 'POST', body: formData })
```

**4. 例外：DataURL / Blob URL**

不是上传，而是本地预览：

```js
// 创建本地 Blob URL（不发给服务器）
const blobUrl = URL.createObjectURL(file)
img.src = blobUrl

// 或 Base64 DataURL
const reader = new FileReader()
reader.readAsDataURL(file)
```

**5. 极少数 GET「上传」场景**

- **GET 跳转携带状态**：上传完成后通过 `?status=success` 跳转，但这不是上传图片本身
- **服务器拉取**：服务器从其他 URL 下载图片，请求本身是 GET，但不是客户端上传

**总结**：GET 上传图片在协议上勉强可行（用 Base64 塞 URL），但 URL 长度限制、安全风险、语义错误、缓存问题让它在生产中几乎不可用。正确方式是 POST + multipart/form-data 或 PUT + 二进制。
