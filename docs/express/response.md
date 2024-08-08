# Response 对象

在 Express 中，`res` 对象（也称为响应对象）是用来处理 HTTP 响应的，它包含了多种方法和属性，用于向客户端发送数据或控制响应的行为。下面是常用的一些 `res` 对象的方法和它们的作用：

1. **res.json()**
   - 作用：发送一个 JSON 格式的响应。
   - 示例：
     ```javascript
     res.json({ message: 'Hello, world!' });
     ```
   
2. **res.send()**
   - 作用：发送各种类型的响应，可以是字符串、JSON、Buffer 等。
   - 示例：
     ```javascript
     res.send('Hello, world!');
     res.send({ message: 'Hello, world!' });
     ```

3. **res.status()**
   - 作用：设置响应的 HTTP 状态码。
   - 示例：
     ```javascript
     res.status(404).send('Not Found');
     ```

4. **res.redirect()**
   - 作用：重定向请求到另一个路径。
   - 示例：
     ```javascript
     res.redirect('/new-path');
     ```

5. **res.render()**
   - 作用：渲染视图模板并发送给客户端。
   - 示例（使用模板引擎如 EJS、Handlebars 等）：
     ```javascript
     res.render('index', { title: 'Homepage' });
     ```

6. **res.sendFile()**
   - 作用：发送文件作为响应。
   - 示例：
     ```javascript
     res.sendFile('/path/to/file.pdf');
     ```

7. **res.cookie()**
   - 作用：设置 cookie。
   - 示例：
     ```javascript
     res.cookie('username', 'John Doe', { maxAge: 900000, httpOnly: true });
     ```

8. **res.setHeader()**
   - 作用：设置响应的 HTTP 头部。
   - 示例：
     ```javascript
     res.setHeader('Content-Type', 'text/html');
     ```

这些方法使得在 Express 应用中能够非常灵活地控制和发送 HTTP 响应，适用于各种场景，如 API 响应、页面渲染、文件下载、重定向等。