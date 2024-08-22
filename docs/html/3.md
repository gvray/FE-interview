---
sidebar_position: 5
---

# script 标签上有那些属性，作用分别是什么？

`<script>` 标签在 HTML 中用于包含 JavaScript 代码。除了基本的 JavaScript 代码嵌入功能外，`<script>` 标签还有一些属性，这些属性用于控制脚本的加载、执行时机以及相关的安全性等。下面是 `<script>` 标签常用的属性及其作用、用法和示例：

### 1. **src**
- **作用**：指定外部 JavaScript 文件的 URL。`src` 属性指向一个 JavaScript 文件的路径，而不是直接嵌入代码。
- **用法**：当你希望从外部文件加载 JavaScript 时使用此属性。
- **示例**：
  ```html
  <script src="script.js"></script>
  ```
  这将加载并执行 `script.js` 文件中的 JavaScript 代码。

### 2. **type**
- **作用**：指定脚本语言的类型。默认值为 `text/javascript`，但可以指定其他类型（如 `module`）。
- **用法**：通常用来指定脚本语言的类型，现代浏览器已默认支持 JavaScript，因此常用 `type="module"` 来指定模块化 JavaScript。
- **示例**：
  ```html
  <script type="text/javascript">
    console.log('Hello, World!');
  </script>
  ```
  或者使用模块：
  ```html
  <script type="module">
    import {myFunction} from './module.js';
    myFunction();
  </script>
  ```

### 3. **async**
- **作用**：使脚本异步加载并执行。当脚本被标记为 `async` 时，浏览器会在下载脚本的同时继续渲染页面，一旦脚本下载完毕立即执行。
- **用法**：适用于不依赖其他脚本的独立脚本。
- **示例**：
  ```html
  <script src="script.js" async></script>
  ```
  `async` 适合不依赖其他脚本的文件，执行顺序不可预测。

### 4. **defer**
- **作用**：使脚本延迟执行，直到 HTML 文档完全解析和构建完成。`defer` 属性确保脚本按照顺序执行，并且不会阻塞页面渲染。
- **用法**：适用于依赖 DOM 的脚本，并且希望保证脚本按顺序执行。
- **示例**：
  ```html
  <script src="script.js" defer></script>
  ```
  这会在 HTML 文档解析完成后执行 `script.js` 文件中的代码，且保证多个 `defer` 脚本按顺序执行。

### 5. **integrity**
- **作用**：用于指定外部脚本文件的哈希值，以确保文件的完整性。这是一种安全措施，可以防止脚本被篡改。
- **用法**：结合 `crossorigin` 使用，用于从 CDN 加载脚本时确保文件未被修改。
- **示例**：
  ```html
  <script src="https://cdn.example.com/script.js" integrity="sha384-9x1L6uQmzpHkx0YoFZ2ly6T1r6kO+U5ZK4T8PvYYDg6ow8bDzLZy6lY6P0BwA2z4" crossorigin="anonymous"></script>
  ```
  这将确保加载的 `script.js` 文件与指定的哈希值匹配，如果不匹配，则浏览器会拒绝加载该文件。

### 6. **crossorigin**
- **作用**：指定跨域请求的 CORS 策略。当脚本来自于不同域时，使用此属性可以控制跨域请求的行为。
- **用法**：常与 `integrity` 配合使用。
  - `anonymous`：请求不发送身份认证信息（如 cookies）。
  - `use-credentials`：请求发送身份认证信息（如 cookies）。
- **示例**：
  ```html
  <script src="https://example.com/script.js" crossorigin="anonymous"></script>
  ```

### 7. **nomodule**
- **作用**：标识一个脚本仅在浏览器不支持 ES6 模块时加载。现代浏览器支持模块化 JavaScript，因此使用 `nomodule` 属性的脚本只会在旧版浏览器中执行。
- **用法**：用于处理浏览器的兼容性，可以在支持模块的浏览器中不加载某些脚本。
- **示例**：
  ```html
  <script src="fallback-script.js" nomodule></script>
  ```

### 8. **charset**
- **作用**：指定外部脚本文件的字符集。这个属性通常不常用，因为 HTML5 默认支持 UTF-8。
- **用法**：可以在需要指定字符编码的情况下使用。
- **示例**：
  ```html
  <script src="script.js" charset="UTF-8"></script>
  ```

### 9. **language**
- **作用**：指定脚本的编程语言。这个属性在 HTML5 中已经被弃用，现代浏览器无需显式指定脚本语言（默认是 JavaScript）。
- **用法**：由于 `language` 属性已经废弃，建议不要使用。
- **示例**（不推荐使用）：
  ```html
  <script language="JavaScript">console.log('Hello');</script>
  ```

### 10. **for**
- **作用**：这个属性已被废弃，在 HTML5 中不再使用。它曾经用来指定脚本应用于哪些 HTML 元素上。
- **用法**：已经废弃，不建议使用。

---

### 总结：
- **src**：加载外部脚本文件。
- **type**：指定脚本类型，通常是 `text/javascript` 或 `module`。
- **async**：使脚本异步加载，立即执行。
- **defer**：延迟脚本执行，等待 DOM 完全加载。
- **integrity**：指定外部文件的哈希值，确保文件未被篡改。
- **crossorigin**：设置跨域请求的 CORS 策略。
- **nomodule**：指定脚本仅在不支持 ES6 模块的浏览器中加载。
- **charset**：指定外部脚本文件的字符集。
- **language**：已废弃，曾用于指定脚本的编程语言。
- **for**：已废弃，曾用于指定脚本的作用范围。

这些属性为开发者提供了灵活的方式来控制 JavaScript 文件的加载、执行和跨域策略。在实际开发中，`async` 和 `defer` 是比较常用的属性，尤其是在优化脚本加载顺序和性能时。