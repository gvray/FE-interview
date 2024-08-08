# Request 对象

`req` 对象（也称为请求对象）在 Express 中代表 HTTP 请求。它包含了客户端发送给服务器的各种信息和数据，如请求头、参数、主体等。下面是一些常用的 `req` 对象的方法和属性及其作用：

1. **req.params**
   - 作用：包含路径参数，通常用于定义动态路由。
   - 示例：
     ```javascript
     app.get('/user/:id', (req, res) => {
       const userId = req.params.id;
       res.send(`User ID: ${userId}`);
     });
     ```

2. **req.query**
   - 作用：包含查询字符串参数。
   - 示例：
     ```javascript
     app.get('/search', (req, res) => {
       const keyword = req.query.keyword;
       res.send(`Search keyword: ${keyword}`);
     });
     ```

3. **req.body**
   - 作用：包含请求主体数据。需要中间件（如 `body-parser` 或 Express 的 `express.json()` 和 `express.urlencoded()`）来解析请求主体。
   - 示例：
     ```javascript
     app.use(express.json());

     app.post('/login', (req, res) => {
       const username = req.body.username;
       const password = req.body.password;
       res.send(`Username: ${username}, Password: ${password}`);
     });
     ```

4. **req.headers**
   - 作用：包含请求头信息。
   - 示例：
     ```javascript
     app.get('/headers', (req, res) => {
       const userAgent = req.headers['user-agent'];
       res.send(`User Agent: ${userAgent}`);
     });
     ```

5. **req.method**
   - 作用：包含 HTTP 请求方法（如 `GET`、`POST`、`PUT`、`DELETE` 等）。
   - 示例：
     ```javascript
     app.all('/method', (req, res) => {
       res.send(`HTTP Method: ${req.method}`);
     });
     ```

6. **req.url**
   - 作用：包含请求的 URL 路径（不包括查询字符串）。
   - 示例：
     ```javascript
     app.get('/url', (req, res) => {
       res.send(`Requested URL: ${req.url}`);
     });
     ```

7. **req.path**
   - 作用：包含请求的路径部分。
   - 示例：
     ```javascript
     app.get('/path', (req, res) => {
       res.send(`Path: ${req.path}`);
     });
     ```

8. **req.ip**
   - 作用：包含发出请求的客户端 IP 地址。
   - 示例：
     ```javascript
     app.get('/ip', (req, res) => {
       res.send(`IP Address: ${req.ip}`);
     });
     ```

9. **req.get()**
   - 作用：获取指定的请求头信息。
   - 示例：
     ```javascript
     app.get('/user-agent', (req, res) => {
       const userAgent = req.get('User-Agent');
       res.send(`User Agent: ${userAgent}`);
     });
     ```

10. **req.cookies**
    - 作用：包含从客户端发送的 cookies。需要中间件（如 `cookie-parser`）来解析 cookies。
    - 示例：
      ```javascript
      const cookieParser = require('cookie-parser');
      app.use(cookieParser());

      app.get('/cookies', (req, res) => {
        res.send(req.cookies);
      });
      ```

这些方法和属性使得在 Express 应用中能够非常灵活地处理和获取客户端请求的数据和信息，适用于各种场景，如路由参数处理、查询字符串解析、请求主体处理、请求头获取等。