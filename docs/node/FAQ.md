---
sidebar_position: 2
---
# FAQ?

## 简单实现Node的Events模块

Node.js 的 `events` 模块是发布订阅模式的实现，几乎所有 Node 内置模块（如 `http`、`stream`、`fs`）都基于它。下面是一个简化版的实现：

```js
class EventEmitter {
  constructor() {
    this._events = {}; // 存储事件名 -> 监听器数组
  }

  // 注册监听器，追加到队列末尾
  on(eventName, listener) {
    if (!this._events[eventName]) {
      this._events[eventName] = [];
    }
    this._events[eventName].push(listener);
    return this;
  }

  // 注册一次性监听器，触发后自动移除
  once(eventName, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(eventName, wrapper);
    };
    // 标记原始监听器，方便 off 时查找
    wrapper._raw = listener;
    this.on(eventName, wrapper);
    return this;
  }

  // 触发事件，依次执行对应监听器
  emit(eventName, ...args) {
    const listeners = this._events[eventName];
    if (!listeners) return false;
    // 拷贝一份，防止监听器内部 off 导致遍历错乱
    [...listeners].forEach((fn) => fn(...args));
    return true;
  }

  // 移除监听器
  off(eventName, listener) {
    if (!this._events[eventName]) return this;
    this._events[eventName] = this._events[eventName].filter(
      (fn) => fn !== listener && fn._raw !== listener
    );
    if (this._events[eventName].length === 0) {
      delete this._events[eventName];
    }
    return this;
  }

  // 移除某事件的所有监听器，或全部事件
  removeAllListeners(eventName) {
    if (eventName) {
      delete this._events[eventName];
    } else {
      this._events = {};
    }
    return this;
  }
}
```

**使用示例：**

```js
const emitter = new EventEmitter();
emitter.on('login', (user) => console.log(`${user} 登录了`));
emitter.once('boot', () => console.log('系统启动'));

emitter.emit('boot');        // 系统启动
emitter.emit('boot');        // 不再触发
emitter.emit('login', 'Tom'); // Tom 登录了
```

**实现要点：**

1. 使用对象 `_events` 以事件名为 key 存储监听器数组。
2. `emit` 时先拷贝监听器列表，避免监听器内部移除自身导致遍历异常。
3. `once` 通过包装函数 + `off` 实现，同时保留 `_raw` 引用，便于 `off` 匹配原始函数。
4. Node 原生 `EventEmitter` 还支持 `prependListener`、`setMaxListeners`、`error` 事件特殊处理等，可按需扩展。

## 在nodejs中使用import语句

在 Node.js 中，使用 `import` 语句可以导入模块。但是需要注意的是，Node.js 默认是不支持 ES6 的 `import` 语法的，而是使用 CommonJS 的 `require()` 语法。

如果要在 Node.js 中使用 `import` 语句，需要在代码中使用 ES6 模块的语法，并且需要通过一些方式来将其转换为 CommonJS 模块的语法。

有几种方式可以实现这一点：

1. 使用 Babel 转换：使用 Babel 可以将 ES6 的 `import` 语句转换为 CommonJS 的 `require()` 语法。你需要安装 `@babel/core` 和 `@babel/node`，并创建一个 Babel 配置文件来指定需要转换的代码。
2. 使用 TypeScript：TypeScript 本身就支持 ES6 模块的语法，并且可以编译为 CommonJS 的模块语法。你需要安装 `typescript`，并创建一个 TypeScript 配置文件来指定需要编译的代码。
3. 使用 `esm` 模块：`esm` 是一个第三方的模块，可以在 Node.js 中使用 ES6 模块的语法。你需要安装 `esm` 模块，并在代码中使用 `import` 语法。使用 `esm` 的方式比较简单，但是需要注意的是它并不是 Node.js 的标准模块，可能存在一些不兼容的问题。

下面是使用 `esm` 模块的示例代码：

```
javascriptCopy code
// 安装 esm 模块
npm install --save esm

// index.js
require = require("esm")(module/*, options*/);
module.exports = require("./main.js");

// main.js
import { foo } from "./foo.js";
console.log(foo);
```

在上面的示例代码中，我们使用 `esm` 模块将 ES6 模块语法转换为 CommonJS 的模块语法。在 `index.js` 文件中，我们将默认的 `require()` 函数替换为 `esm` 的 `require()` 函数，并将其导出为 Node.js 模块的语法。在 `main.js` 文件中，我们可以直接使用 `import` 语法来导入其他模块。

**如果您使用的是高版本的 Node.js（v13.2.0 或更高版本），则可以直接使用 ES6 的 `import` 语法，无需进行转换。**

以下是一个简单的示例代码：

```
javascriptCopy code
// 导入模块
import { createServer } from 'http';

// 创建 HTTP 服务器
const server = createServer((req, res) => {
  res.end('Hello, World!');
});

// 启动服务器
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

在上面的示例代码中，我们使用 ES6 的 `import` 语法来导入 Node.js 的 `http` 模块，并创建一个 HTTP 服务器。然后，我们使用 ES6 的箭头函数语法来启动服务器，并在控制台输出一条消息。

需要注意的是，如果您在使用 ES6 的 `import` 语法时遇到了问题，请确保您的 Node.js 版本高于 v13.2.0，并且已经将模块的文件扩展名设置为 `.mjs`。如果您使用的是旧版本的 Node.js，则需要使用其中一种转换方法来支持 ES6 的 `import` 语法。

**如果您不想在文件名中使用 `.mjs` 扩展名，可以在 Node.js 中通过设置 `"type": "module"` 来启用 ES6 模块的支持。这可以在您的项目的 `package.json` 文件中设置。**

例如，在 `package.json` 文件中添加以下行：

```
jsonCopy code
{
  "type": "module"
}
```

然后，您就可以在项目中的任何文件中使用 ES6 的 `import` 语法，而不必添加 `.mjs` 扩展名。

以下是一个示例代码：

```
javascriptCopy code
// 导入模块
import { createServer } from 'http';

// 创建 HTTP 服务器
const server = createServer((req, res) => {
  res.end('Hello, World!');
});

// 启动服务器
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

需要注意的是，在启用 ES6 模块支持后，您无法使用 `require()` 函数来导入模块，而必须始终使用 ES6 的 `import` 语法。此外，如果您需要使用第三方模块，那么您需要确保这些模块也支持 ES6 的 `import` 语法，否则可能会导致运行时错误。

## 循环事件

Node.js 的事件循环（Event Loop）是其在单线程下处理高并发的核心机制。它允许 Node 在执行 I/O 操作时不阻塞主线程，I/O 完成后通过回调通知继续执行。

**六个阶段（Phases）**

Node 的事件循环由 libuv 实现，每次循环依次经过六个阶段：

```
┌───────────────────────────┐
│   timers                  │  执行 setTimeout / setInterval 到期的回调
├───────────────────────────┤
│   pending callbacks       │  执行上一轮延迟的系统级回调（如 TCP errno）
├───────────────────────────┤
│   idle, prepare           │  内部使用
├───────────────────────────┤
│   poll                    │  获取新的 I/O 事件，执行 I/O 回调
├───────────────────────────┤
│   check                   │  执行 setImmediate 的回调
├───────────────────────────┤
│   close callbacks         │  执行 close 事件回调（如 socket.on('close')）
└───────────────────────────┘
```

每个阶段都有一个 FIFO 队列，循环到该阶段时把队列里的回调执行完，或达到执行上限后进入下一阶段。

**微任务（Microtask）**

每个阶段切换之间，会清空 `process.nextTick` 和微任务队列。优先级：

1. `process.nextTick` 队列
2. Promise 微任务队列（`then`、`queueMicrotask`）

**典型示例：**

```js
setTimeout(() => console.log('1: setTimeout'), 0);
setImmediate(() => console.log('2: setImmediate'));

Promise.resolve().then(() => console.log('3: promise'));
process.nextTick(() => console.log('4: nextTick'));
```

输出顺序固定为：

```
4: nextTick
3: promise
1: setTimeout / 2: setImmediate（这两者顺序不固定）
```

**setTimeout vs setImmediate vs process.nextTick**

| API | 执行阶段 | 说明 |
|-----|---------|------|
| `setTimeout` | timers | 在指定延迟后执行 |
| `setImmediate` | check | 在当前事件循环的 poll 阶段结束后执行 |
| `process.nextTick` | 各阶段之间 | 优先级最高，在下一阶段开始前执行 |

**与浏览器事件循环的区别**

- 浏览器只有"宏任务 + 微任务"两层；Node 有六个阶段。
- Node 11 之前，一个阶段的多个 `setTimeout` 回调算作一个宏任务，全部执行完才切到微任务；Node 11+ 改为每个回调执行后都清空微任务，与浏览器行为一致。
- `process.nextTick` 是 Node 独有，浏览器没有。

理解事件循环能帮助排查异步顺序问题，避免在 I/O 回调中抛出同步异常导致进程退出等。

## path.resolve 和 path.join 有什么不同？它们分别用于什么情况？

**`path.resolve`：**

- `path.resolve` 用于将路径片段解析为绝对路径。
- 它会将所有传入的路径片段拼接在一起，并返回一个绝对路径。
- 如果存在以 `/` 开头的路径片段，它会忽略之前的所有片段，并以该路径片段为准。
- 通常用于生成文件系统中的绝对路径。

**示例：**

```javascript
const path = require('path');
const absolutePath = path.resolve('/foo', 'bar', 'baz');
// 输出：'/foo/bar/baz'
```

**`path.join`：**

- `path.join` 用于将路径片段连接成一个相对路径。
- 它会将所有传入的路径片段拼接在一起，并返回一个相对路径。
- 不会处理绝对路径，始终返回相对路径。
- 通常用于生成相对于当前工作目录的路径。

**示例：**

```javascript
const path = require('path');
const relativePath = path.join('foo', 'bar', 'baz');
// 输出：'foo/bar/baz'
```

通常情况下，选择使用 `path.resolve` 还是 `path.join` 取决于您的需求：

- 使用 `path.resolve` 当您需要生成绝对路径，无论传递的路径片段是相对路径还是绝对路径。
- 使用 `path.join` 当您需要生成相对路径，特别是在构建文件路径或URL时，以相对于当前工作目录的方式连接路径片段。
