---
sidebar_position: 2
---
# FAQ?

## JS 的各种位置，比如 clientHeight,scrollHeight,offsetHeight ,以 及 scrollTop, offsetTop,clientTop 的区别？

clientHeight：表示的是可视区域的高度，不包含 border 和滚动条
offsetHeight：表示可视区域的高度，包含了 border 和滚动条
scrollHeight：表示了所有区域的高度，包含了因为滚动被隐藏的部分。
clientTop：表示边框 border 的厚度，在未指定的情况下一般为 0
scrollTop：滚动后被隐藏的高度，获取对象相对于由 offsetParent 属性指定的父坐
标(css 定位的元素或 body 元素)距离顶端的高度。

## const 定义函数和直接用 function 声明有什么区别？

| 特性             | `const` 定义函数         | `function` 声明 |
| ---------------- | ------------------------ | --------------- |
| 提升 (Hoisting)  | 不提升                   | 提升            |
| 作用域           | 块级作用域               | 当前作用域      |
| 是否支持箭头函数 | 支持                     | 不支持          |
| `this` 绑定      | 静态绑定（若为箭头函数） | 动态绑定        |
| 是否可以重新赋值 | 不可以                   | 无重新赋值概念  |

- 用const声明函数时，你可以避免函数被重新赋值，代码的可维护性会更高，特别是当你不希望函数被意外重写时，const更加安全。
- 用function声明函数时，你可以享受函数提升的好处，使代码看起来更灵活，适合在任何位置调用函数。

## JS中本地对象、内置对象、宿主对象分别是什么，有什么区别？

在 JavaScript 中，本地对象、内置对象和宿主对象的定义和区别如下：

 **1. 本地对象（Native Objects）**

- **定义**：本地对象是由 JavaScript 语言本身提供的对象，不依赖于任何外部环境。
- **例子**：`Object`、`Array`、`Function`、`Number`、`String`、`Boolean`、`RegExp` 等。
- **特点**：这些对象的构造函数和方法是 JavaScript 语言标准的一部分，能够在任何 JavaScript 环境中使用。

 **2. 内置对象（Built-in Objects）**

- **定义**：内置对象是本地对象的一部分，提供了标准的功能和方法，通常用来处理特定的数据类型或提供通用的功能。
- **例子**：`Math`、`JSON`、`Date`、`Promise` 等。
- **特点**：内置对象提供了用于特定任务的功能，比如数学计算、日期处理等，通常用于增强语言的功能。

 **3. 宿主对象（Host Objects）**

- **定义**：宿主对象是由宿主环境（如浏览器或 Node.js）提供的对象，通常用于与环境相关的功能。
- **例子**：在浏览器中，`window`、`document`、`XMLHttpRequest`、`console` 等；在 Node.js 中，`fs`、`http` 等模块。
- **特点**：宿主对象的实现和功能依赖于宿主环境，通常用于处理特定的环境交互。

## Js 中，有哪些方法可以退出循环

- **`break`**：立即退出循环体。
- **`return`**：退出循环并返回函数的结果（适用于函数内）。
- **`throw`**：抛出异常，退出循环并转到异常处理部分（适用于错误处理）。

## 高阶函数的理解

**高阶函数的两个主要特征：**

- 接收函数作为参数：一个函数可以接受另一个函数作为参数。
- 返回函数：一个函数可以返回另一个函数。

## get 请求的参数是否能够使用数组？

GET 请求的参数可以使用数组。

虽然在 URL 查询字符串中直接表示数组略有复杂，但有几种常见的方式来实现数组的传递。以下是一些常见的处理数组参数的方法：

 1. **使用重复的参数名**

最简单的方法是使用重复的参数名，每个数组元素作为一个独立的参数传递。例如，传递一个数组 `[1, 2, 3]` 可以表示为：

```
?numbers=1&numbers=2&numbers=3
```

这种方式常见于许多后端框架和库，它们能够解析这种格式的参数。

 2. **使用方括号表示法**

在一些编程环境中，可以使用方括号表示法来传递数组，这种方式可以表示嵌套的数组和对象。例如：

```
?numbers[]=1&numbers[]=2&numbers[]=3
```

这种方式在 PHP 和 Ruby 等语言中非常常见，它们能够解析这样的查询字符串。

 3. **使用逗号分隔的字符串**

另一种常见的方法是将数组元素用逗号或其他分隔符连接成一个字符串。例如：

```
?numbers=1,2,3
```

在服务器端，需要将这个字符串分隔开来以恢复原始数组。这种方式在 JavaScript 中也比较常见，尤其是当数组的顺序不需要保留时。

 4. **使用 JSON 字符串**

在一些情况下，可以将数组序列化为 JSON 字符串进行传递。例如：

```
?numbers=%5B1%2C2%2C3%5D
```

这里的 `%5B`, `%2C`, 和 `%5D` 是 URL 编码形式的 `[`，`,` 和 `]`。在服务器端，需将 JSON 字符串解析回数组。

 **示例代码**

**前端示例：**

```
// 使用重复的参数名
const array = [1, 2, 3];
const queryString = array.map(value => `numbers=${value}`).join('&');
const url = `https://example.com?${queryString}`;

// 使用方括号表示法
const queryStringBrackets = array.map(value => `numbers[]=${value}`).join('&');
const urlBrackets = `https://example.com?${queryStringBrackets}`;

// 使用逗号分隔的字符串
const queryStringComma = `numbers=${array.join(',')}`;
const urlComma = `https://example.com?${queryStringComma}`;

// 使用 JSON 字符串
const queryStringJSON = `numbers=${encodeURIComponent(JSON.stringify(array))}`;
const urlJSON = `https://example.com?${queryStringJSON}`;
```

**后端示例（Node.js Express）：**

```
app.get('/', (req, res) => {
  // 使用重复的参数名
  const numbers = req.query.numbers; // [1, 2, 3] - 自动解析为数组

  // 使用方括号表示法
  const numbersBrackets = req.query['numbers[]']; // [1, 2, 3] - 自动解析为数组

  // 使用逗号分隔的字符串
  const numbersComma = req.query.numbers.split(','); // ['1', '2', '3'] - 需要转换为数字数组

  // 使用 JSON 字符串
  const numbersJSON = JSON.parse(req.query.numbers); // [1, 2, 3]
});
```

## JS的节流和防抖

节流（throttle）和防抖（debounce）都是用来控制高频触发事件执行频率的技术，核心目的是降低回调被调用的次数，从而优化性能。

**1. 防抖（debounce）**

在事件被触发 n 秒后再执行回调，如果在这 n 秒内事件又被触发，则重新计时。也就是"只执行最后一次"。

```js
function debounce(fn, wait) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, wait);
  };
}

// 立即执行版（leading edge）：触发时立即执行一次，之后在停止触发 wait 毫秒后才允许再次触发
function debounceLeading(fn, wait) {
  let timer = null;
  return function (...args) {
    if (!timer) fn.apply(this, args);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => (timer = null), wait);
  };
}
```

**2. 节流（throttle）**

规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次，只有一次生效。

```js
// 时间戳版：每次触发都比较时间，到点就执行
function throttle(fn, wait) {
  let prev = 0;
  return function (...args) {
    const now = Date.now();
    if (now - prev >= wait) {
      fn.apply(this, args);
      prev = now;
    }
  };
}

// 定时器版：触发后 n 秒执行一次，期间忽略后续触发
function throttleTimer(fn, wait) {
  let timer = null;
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, wait);
    }
  };
}
```

**3. 应用场景**

- 防抖：搜索框输入联想、窗口 `resize`、按钮防重复提交、表单校验。
- 节流：滚动加载（`scroll`）、鼠标拖拽（`mousemove`）、键盘连按（`keydown`）。

**4. 区别一句话**

- 防抖：连续触发只执行最后一次。
- 节流：连续触发在固定间隔内只执行一次。

## 如何实现一个私有变量，用 getName 方法可以访问，不能直接访问

1. 通过 defineProperty 来实现

```js
obj={
name:yuxiaoliang,
getName:function(){
return this.name
}}
object.defineProperty(obj,"name",{
//不可枚举不可配置
});
```

2. 通过函数的创建形式

```js
function product(){
var name='yuxiaoliang';
this.getName=function(){
return name;
}}
var obj=new product();
```

## JS怎么控制一次加载一张图片，加载完后再加载下一张

```js
const imgArrs = ['imageurl1', 'imageurl2', 'imageurl3']
const loadImg = () => {
    if (!imgArrs.length)  return;
    const img = new Image()
    img.src = imgArrs[0]
    img.onload = () => {
        setTimeout(() => {
            document.body.appendChild(this)
            imgArrs.shift()
            loadImg()
        }, 2000)
    }
}
loadImg()
```

```js
img.onreadystatechange=function(){
if(this.readyState=="complete"){

}
```

## 数组去重

法一：indexOf 循环去重

法二：ES6 Set 去重；Array.from(new Set(array))

法三：Object 键值对去重；把数组的值存成 Object 的 key 值，比如Object[value1] = true，在判断另一个值的时候，如果 Object[value2]存在的话，就说明该值是重复的。

## 去除字符串首尾空格

使用正则(^\s*)|(\s*$)即可

## 能来讲讲JS的语言特性吗

运行在客户端浏览器上；
不用预编译，直接解析执行代码；
是弱类型语言，较为灵活；
与操作系统无关，跨平台的语言；
脚本语言、解释性语言；

## JS的全排列

给定一个数组，返回其所有可能的全排列。下面分别给出**递归（回溯）**与**非递归（字典序）**两种实现。

**1. 递归实现（回溯法）**

思路：维护一个 `path` 和一个 `used` 标记数组，逐个尝试把未使用的元素放入 `path`，长度达到 n 时收集结果。

```js
function permute(nums) {
  const result = [];
  const used = new Array(nums.length).fill(false);

  function backtrack(path) {
    if (path.length === nums.length) {
      result.push([...path]); // 注意拷贝
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      backtrack(path);
      path.pop();
      used[i] = false;
    }
  }

  backtrack([]);
  return result;
}

console.log(permute([1, 2, 3]));
// [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

**2. 含重复元素的全排列**

先排序，然后在同一层剪掉与前一个相同且前一个未被使用的元素，避免产生重复排列。

```js
function permuteUnique(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  const used = new Array(nums.length).fill(false);

  function backtrack(path) {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      // 当前元素与前一个相同，且前一个在本层未被使用，跳过避免重复
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;
      used[i] = true;
      path.push(nums[i]);
      backtrack(path);
      path.pop();
      used[i] = false;
    }
  }

  backtrack([]);
  return result;
}
```

**3. 非递归实现（字典序法）**

基于"下一个排列"算法：从字典序最小的排列开始，不断求下一个排列，直到没有更大的排列为止。

```js
function permuteIterative(nums) {
  nums = [...nums].sort((a, b) => a - b); // 起点：字典序最小
  const result = [[...nums]];
  const n = nums.length;

  while (true) {
    // 1. 从右向左找第一个满足 nums[i] < nums[i+1] 的 i
    let i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    if (i < 0) break; // 已是字典序最大，结束

    // 2. 从右向左找第一个 nums[j] > nums[i] 的 j
    let j = n - 1;
    while (nums[j] <= nums[i]) j--;

    // 3. 交换 i、j
    [nums[i], nums[j]] = [nums[j], nums[i]];

    // 4. 翻转 i+1 到末尾，使其变为字典序最小
    let l = i + 1, r = n - 1;
    while (l < r) {
      [nums[l], nums[r]] = [nums[r], nums[l]];
      l++; r--;
    }
    result.push([...nums]);
  }

  return result;
}
```

**4. 复杂度**

- n 个不同元素的全排列共有 n! 个。
- 时间复杂度：O(n · n!)。
- 空间复杂度：递归版 O(n)（递归栈 + used 数组），非递归版 O(1)（不含结果）。

## js消除异步传染性

"异步传染性"指的是：一旦某个函数变成了 async（或返回 Promise），所有调用它的函数也必须变成 async 才能用 `await` 拿到结果，错误处理链路也要随之改造，于是 async 一路向上传染。常见的消除（或缓解）手段如下。

**1. 顶层 await（Top-level await）**

在 ES Modules 中，模块顶层可以直接使用 `await`，避免把入口逻辑包进额外的 async 函数，让异步不向业务层传染。

```js
// config.mjs
const config = await fetch('/config.json').then(r => r.json());
export default config;
```

**2. Generator + 自执行器（"用同步写异步"）**

借助 generator 把异步流程写成"看似同步"的形式，由执行器驱动 Promise，调用方无需感知 async。

```js
function* gen() {
  const a = yield fetch('/a').then(r => r.json());
  const b = yield fetch('/b').then(r => r.json());
  return a + b;
}

function run(gen) {
  const it = gen();
  function step(val) {
    const { value, done } = it.next(val);
    if (done) return value;
    return value.then(step);
  }
  return step();
}
run(gen());
```

**3. 把异步收口在基础设施层**

把数据请求封装在 service / store 层，对外暴露同步访问接口（命中缓存时同步返回，未命中再异步刷新），调用方不感知 async。

**4. 用同步语义做错误处理**

在 async 函数里用 `try/catch` 包裹，避免 `.catch` 链一层层向外抛，使错误处理与同步代码风格一致。

**5. React Suspense**

在 React 中，把"读取异步数据"的能力收口到组件树，让子组件保持同步写法，由 Suspense 边界处理 loading、ErrorBoundary 处理错误。

```js
const resource = fetchProfileData(); // 内部抛 Promise

function Profile() {
  const user = resource.user.read(); // 内部 throw Promise，由 Suspense 捕获
  return <h1>{user.name}</h1>;
}
```

**6. 同步化 API（如 Web Worker 同步消息、SharedArrayBuffer + Atomics.wait）**

特定场景下，可以用 `Atomics.wait` 等机制让主线程"阻塞等待" worker 结果，模拟同步语义（但会阻塞渲染，需谨慎）。

**本质**：异步传染性是 JS 单线程 + 异步模型带来的固有特性，无法完全消除，只能通过抽象（generator、Suspense、顶层 await、缓存同步化）把它限制在更小的范围内，让业务代码看起来更接近同步。

## codePointAt()与charCodeAt()方法区别

两者都用于获取字符串中某个位置的字符编码，但处理 Unicode 的范围不同，核心区别在于**是否识别代理对（surrogate pair）**。

| 方法            | 返回值                                   | 处理范围                          | 入参       |
| --------------- | ---------------------------------------- | --------------------------------- | ---------- |
| `charCodeAt()`  | UTF-16 编码单元（code unit，0 ~ 65535）  | 仅基本多语言平面 BMP（U+0000 ~ U+FFFF） | 字符串索引 |
| `codePointAt()` | Unicode 码点（code point，0 ~ 1114111）  | 全部 Unicode 平面（含辅助平面）   | 字符串索引 |

**1. BMP 之外字符的存储方式**

辅助平面字符（如 emoji 😀，码点 U+1F600）在 JS 字符串中以**代理对**存储，占两个 16 位编码单元。`charCodeAt` 一次只能取一个 code unit，会返回一个孤立的代理项码点；而 `codePointAt` 能识别代理对，返回真正的码点。

```js
const s = '😀'; // 用户视角是 1 个字符，但 s.length === 2

s.charCodeAt(0);  // 55357  (0xD83D，高代理项)
s.charCodeAt(1);  // 56832  (0xDE00，低代理项)
s.codePointAt(0); // 128512 (0x1F600，真正的码点)
s.codePointAt(1); // 56832  (从代理对中间开始读，只返回低代理项)
```

**2. 配套方法**

- 反向转换：`String.fromCharCode` 只支持 BMP；`String.fromCodePoint` 支持全部码点。
- 遍历含辅助平面字符的字符串：`for...of` 按**码点**迭代；`for (let i...)` 按 code unit 迭代会把代理对拆开。

```js
for (const ch of 'a😀b') console.log(ch); // 'a' '😀' 'b'
for (let i = 0; i < 'a😀b'.length; i++) console.log('a😀b'[i]); // 'a' '\uD83D' '\uDE00' 'b'
```

**3. 判断代理对起点**

```js
function isHighSurrogate(code) {
  return code >= 0xD800 && code <= 0xDBFF;
}
```

**结论**：处理可能含 emoji、生僻字等辅助平面字符的场景，应使用 `codePointAt` / `fromCodePoint` / `for...of`，避免 `charCodeAt` 把代理对拆坏。

## 常用的正则表达式有哪些？

1. 邮箱验证：

   ```regex
   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
   ```

2. 电话号码验证（纯数字，可包含括号、空格和短横线）：

   ```regex
   /^(\+\d{1,3})?[\s-]?\d{1,}$/ 
   ```

3. URL 验证（包括 http、https、www 等）：

   ```regex
   /^(https?:\/\/)?(www\.)?[\w-]+\.[\w.-]+$/
   ```

4. 身份证号码验证（仅适用于中国大陆身份证）：

   ```regex
   /^(^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}[0-9Xx]$)?$/
   ```

5. 邮政编码验证（中国邮政编码为 6 位数字）：

   ```regex
   /^\d{6}$/
   ```

6. IP 地址验证：

   ```regex
   /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
   ```

## 对 JSON 的理解

JSON（JavaScript Object Notation）是一种轻量级的数据交换格式，常用于将数据从一个应用程序传输到另一个应用程序。它以易于阅读和编写的文本格式表示结构化数据，并且易于解析和生成。以下是对 JSON 的理解：

1. 数据格式：JSON 使用键值对的形式来表示数据，其中键是字符串，值可以是字符串、数字、布尔值、数组、对象或 null。键值对之间使用冒号（:）分隔，多个键值对使用逗号（,）分隔。整个 JSON 数据被包含在花括号（{}）或方括号（[]）中，分别表示对象和数组。

2. 平台无关性：JSON 是一种与编程语言无关的数据格式，几乎所有的编程语言都支持解析和生成 JSON 数据。这使得 JSON 成为不同系统之间进行数据交换的通用格式。

3. 简洁性和可读性：JSON 的语法简洁、清晰且易于阅读。对于人类来说，编写和理解 JSON 数据相对容易，这使得调试和调用 API 等场景变得更加方便。

4. 数据交换和存储：JSON 通常用于在客户端和服务器之间传输数据。客户端可以将数据序列化为 JSON 字符串，然后将其发送到服务器进行处理。服务器可以解析 JSON 字符串，并将数据存储到数据库中或进行进一步的处理。

5. API 和配置文件：许多 Web API 和服务都使用 JSON 作为数据交换格式。通过使用 JSON，客户端可以与服务器进行通信，并以结构化的方式传递参数和接收响应。此外，JSON 也常用于配置文件，以存储和加载应用程序的配置信息。

6. 支持的数据类型：JSON 支持字符串、数字、布尔值、数组、对象和 null。这些数据类型的组合和嵌套能够表示丰富的数据结构。

需要注意的是，JSON 是一种数据格式，它描述了数据的结构和值，但并不包含行为或方法。在使用 JSON 数据时，需要将其解析为特定编程语言的对象或数据结构，以便进行进一步的处理和操作。

## JavaScript 脚本延迟加载的方式有哪些？

JavaScript 脚本的延迟加载是一种优化技术，它可以提高网页的加载性能。以下是几种常见的 JavaScript 脚本延迟加载的方式：

1. 使用 `async` 属性：将 `<script>` 标签的 `async` 属性设置为 `true` 可以使脚本在下载的同时不阻塞页面的解析和渲染。脚本将在下载完成后立即执行，但执行时可能会打断页面的渲染。

```html
<script src="script.js" async></script>
```

2. 使用 `defer` 属性：将 `<script>` 标签的 `defer` 属性设置为 `true` 可以将脚本的执行推迟到页面解析完成后。这样脚本将在文档完全解析和渲染完成后执行，不会打断页面的渲染。

```html
<script src="script.js" defer></script>
```

3. 动态加载脚本：通过 JavaScript 动态创建 `<script>` 标签并将其插入到页面中，可以实现按需加载脚本。可以在适当的时机使用 `createElement` 和 `appendChild` 方法来动态加载脚本。

```javascript
var script = document.createElement('script');
script.src = 'script.js';
document.body.appendChild(script);
```

4. 使用异步加载库：一些第三方库和工具提供了异步加载的功能，例如 RequireJS、LoadJS 等。这些库可以帮助管理和加载依赖关系，并在需要时按需加载脚本。

```javascript
// 使用 RequireJS 异步加载模块
require(['module'], function(module) {
  // 模块加载完成后的回调函数
});
```

需要根据具体情况选择适合的延迟加载方式。`async` 和 `defer` 属性适用于静态脚本的加载，而动态加载适用于动态生成的脚本或根据条件加载脚本。通过延迟加载 JavaScript 脚本，可以提高网页的响应速度和用户体验。

## 什么是 DOM 和 BOM？

DOM（Document Object Model）和 BOM（Browser Object Model）是两个与浏览器相关的概念：

1. DOM（文档对象模型）：DOM 是指将 HTML 或 XML 文档表示为一个树状结构的方式，使得开发者可以通过脚本语言（通常是 JavaScript）来访问和操作文档的内容、结构和样式。DOM 提供了一组 API，使得开发者可以使用 JavaScript 动态地创建、修改和删除文档的元素、属性和文本。通过 DOM，可以实现对网页的动态交互和改变。

2. BOM（浏览器对象模型）：BOM 是指浏览器提供的一组对象和方法，用于访问和控制浏览器窗口、浏览器的历史记录、浏览器的位置和尺寸、浏览器的导航等功能。BOM 提供了一些对象，如 window、navigator、location、history 等，开发者可以使用这些对象来操作浏览器的行为和属性。BOM 并没有由标准规范定义，不同浏览器可能提供不同的 BOM 实现。

总结来说，DOM 是用于访问和操作文档内容的 API，而 BOM 是用于访问和控制浏览器窗口和浏览器功能的 API。它们共同组成了浏览器提供给开发者的编程接口，使得开发者可以通过 JavaScript 来与网页和浏览器进行交互。

## escape、encodeURI、encodeURIComponent 的区别

`escape`、`encodeURI` 和 `encodeURIComponent` 是 JavaScript 中用于编码 URL 的方法，它们有一些区别：

1. `escape`：`escape` 方法用于对字符串进行编码，将字符串中的特殊字符转换为十六进制转义序列。它可以对整个字符串进行编码，包括字母、数字和特殊字符。然而，`escape` 方法已经被废弃，不推荐使用，因为它对非 ASCII 字符的处理不一致，不适用于完整的 URL 编码。

2. `encodeURI`：`encodeURI` 方法用于对整个 URL 进行编码，包括协议、域名、路径和查询参数。它用于将字符串转换为有效的 URL 字符串，对于大部分情况而言是足够的。`encodeURI` 不会编码某些特殊字符，如 `:/?#[]@!$&'()*+,;=`，以保留它们在 URL 中的含义。

3. `encodeURIComponent`：`encodeURIComponent` 方法用于对 URL 中的查询参数进行编码。它会对字符串中的所有非字母数字字符进行编码，以便安全地包含在 URL 的查询参数中。`encodeURIComponent` 包括对 `encodeURI` 不编码的字符的编码，如 `/`。

下面是一些使用示例：

```javascript
var url = "http://example.com/my page.html?name=John&age=30";
var encodedURL = encodeURI(url);
console.log(encodedURL);
// 输出："http://example.com/my%20page.html?name=John&age=30"

var encodedQueryParam = encodeURIComponent("Hello, World!");
console.log(encodedQueryParam);
// 输出："Hello%2C%20World%21"
```

需要根据具体的使用场景选择适当的方法。通常情况下，使用 `encodeURI` 对整个 URL 进行编码，使用 `encodeURIComponent` 对查询参数进行编码是最常见的做法，以确保 URL 的正确性和安全性。

## script标签中async与defer的区别

`async` 和 `defer` 是用于控制 `<script>` 标签的加载和执行行为的属性。它们具有以下区别：

1. **加载行为：**
   - `async`：带有 `async` 属性的脚本是异步加载的。当浏览器解析到带有 `async` 属性的脚本时，它会立即开始下载脚本文件，并在下载完成后立即执行脚本，而不会阻塞 HTML 文档的解析。多个带有 `async` 属性的脚本的执行顺序无法保证，因此它们之间的依赖关系需要通过其他方式处理。
   - `defer`：带有 `defer` 属性的脚本是延迟加载的。当浏览器解析到带有 `defer` 属性的脚本时，它会继续解析 HTML 文档，并在文档解析完成后按照它们在文档中的顺序依次执行脚本。`defer` 脚本的执行发生在 `DOMContentLoaded` 事件之前。

2. **执行时机：**
   - `async`：脚本在下载完成后立即执行，独立于 HTML 文档的解析进程。这意味着脚本的执行可能发生在 HTML 文档的解析过程中，因此它们不能保证访问或修改位于脚本之前的文档元素。
   - `defer`：脚本的执行发生在 HTML 文档解析完成之后，但在 `DOMContentLoaded` 事件触发之前。这意味着 `defer` 脚本可以访问和操作位于它们之前的文档元素。

3. **顺序保证：**
   - `async`：多个带有 `async` 属性的脚本的执行顺序无法保证，因此如果脚本之间有依赖关系，需要通过其他方式来处理依赖。
   - `defer`：多个带有 `defer` 属性的脚本会按照它们在文档中的顺序依次执行，因此可以确保脚本的执行顺序。

当浏览器解析到带有 async 属性的脚本标签时，它会立即开始异步加载脚本文件。在脚本文件下载的过程中，浏览器会继续解析和渲染 HTML 文档。一旦脚本文件下载完成，浏览器会立即中断 HTML 文档的解析，并开始执行该脚本。

这是 async 属性与传统的阻塞式脚本加载方式（没有 async 或 defer）的主要区别。传统的脚本加载方式会阻塞 HTML 文档的解析和渲染，直到脚本文件下载和执行完成。

需要注意的是，由于 async 脚本会在下载完成后立即执行，所以它们可能会在 HTML 文档的解析过程中执行。这意味着在脚本执行之前，它们无法访问或修改位于脚本之前的文档元素。如果脚本需要操作文档中的元素，可以将其放置在 body 标签的末尾，或使用 DOMContentLoaded 事件来确保脚本在文档解析完成后执行。

总结来说，`async` 属性用于异步加载和执行脚本，而 `defer` 属性用于延迟加载和按顺序执行脚本。你可以根据具体的需求选择适合的属性来控制脚本的加载和执行行为。

## 什么是BMP

BMP 是 Unicode 中的缩写，指的是"基本多文本平面"（Basic Multilingual Plane），也称为 Plane 0。BMP 是 Unicode 字符集的一个重要部分，包括 U+0000 到 U+FFFF（0到65535）之间的码点范围。

在 BMP 内，包含了大多数常见的字符，包括：

- 标准的拉丁字母（A-Z，a-z）
- 数字（0-9）
- 基本的标点符号
- 常见的特殊字符
- 控制字符

BMP 的设计目的是为了包括所有主要的世界语言和符号，以便在一个单一平面内进行表示，使得文本处理和字符编码更为简便。它包含了许多国际化的字符，包括拉丁字母、希腊字母、西里尔字母、汉字、日文假名、阿拉伯数字，以及各种符号和表情符号。

非常重要的是，BMP 包括了最常用的字符，使得大多数文本处理操作更加高效。非常规的或不常用字符通常位于较高的 Unicode Plane 中。

总结，BMP（Basic Multilingual Plane）是 Unicode 字符集的一个平面，包括 U+0000 到 U+FFFF 范围内的大多数字符，它涵盖了主要的世界语言和符号，以促进多语言文本的正确表示和处理。

## 聊聊前端字符编码：ASCII、Unicode、Base64、UTF-8、UTF-16、UTF-32

**1. ASCII**

- 7 位编码，0 ~ 127，共 128 个字符：英文字母、数字、标点、控制字符。
- 不足以表示中文、日文、emoji 等其他字符。

**2. Unicode**

- 字符集（不是编码方式），目标是给全世界所有字符分配一个唯一编号（码点 code point），范围 U+0000 ~ U+10FFFF（约 111 万个码点）。
- Unicode 只是"编号表"，具体如何在内存/磁盘中存储，由 UTF-8 / UTF-16 / UTF-32 等编码方案实现。

**3. UTF-8**

- 变长编码，1 ~ 4 字节。
- ASCII 字符（0 ~ 127）占 1 字节，与 ASCII 完全兼容；中文字符通常占 3 字节；emoji 等辅助平面字符占 4 字节。
- 无字节序问题，互联网传输首选；对英文友好，省空间。

**4. UTF-16**

- 变长编码，2 或 4 字节。BMP 字符占 2 字节，辅助平面字符用代理对（surrogate pair）占 4 字节。
- **JS 字符串在内存中即以 UTF-16 存储**，所以 `'😀'.length === 2`（两个 code unit，而非用户感知的 1 个字符）。
- 存在字节序问题（大端 BE / 小端 LE），文件需 BOM 标识。

**5. UTF-32**

- 定长 4 字节编码，每个码点固定 4 字节。
- 简单但浪费空间，前端实际存储/传输中几乎不用。

**6. Base64**

- 不是字符编码，而是一种**二进制到文本的编码**：把任意字节流按 6 位一组映射成 64 个可打印 ASCII 字符（`A-Za-z0-9+/`，用 `=` 填充）。
- 用于在文本协议（HTTP、HTML、CSS、JSON、URL）中传输/嵌入二进制数据，如图片内嵌、JWT、data URI。
- 体积会变大（约 4/3 倍），但避免了二进制传输与转义问题。

**7. 前端常见场景**

- `<meta charset="utf-8">`：声明 HTML 文件用 UTF-8 解码。
- `'A'` 是用 Unicode 转义表示字符 'A'；`'\u{1F600}'` 用 ES6+ 码点表示法表示 emoji。
- `String.prototype.length` 返回 UTF-16 code unit 数；`[...str].length` 或 `Array.from(str).length` 才是用户感知的字符数。
- `encodeURIComponent` 先按 UTF-8 编码字节，再做百分号编码。
- `atob` / `btoa`：base64 与二进制字符串互转（注意只处理 Latin1，处理 UTF-8 中文需先 `encodeURIComponent` 再 `btoa`）。

**8. 关系图**

```
Unicode (字符集 / 码点表)
   ├─ UTF-8    (变长 1~4B，ASCII 兼容，互联网主流)
   ├─ UTF-16   (变长 2/4B，JS 内存表示，含代理对)
   └─ UTF-32   (定长 4B，少用)

Base64：字节流 → ASCII 字符串（体积 4/3 倍），用于传输而非编码字符
```

## javascript引擎工作流程

JavaScript 引擎（如 V8、SpiderMonkey、JavaScriptCore）负责解析、编译、执行 JS 代码。以 V8 为例，工作流程大致如下：

**1. 解析（Parsing）**

- **词法分析（Lexer）**：把源代码字符串拆成 token 流（关键字、标识符、字面量、操作符等）。
- **语法分析（Parser）**：根据 ECMAScript 语法把 token 流构建成**抽象语法树（AST）**，同时收集作用域信息，进行变量提升等静态分析。

**2. 解释执行（Ignition）**

- V8 用 Ignition 解释器把 AST 编译成**字节码（bytecode）**，然后逐行解释执行。
- 字节码比机器码紧凑，启动快，是 V8 的主要执行方式。
- 这一阶段会收集**类型反馈（type feedback）**和热点代码信息。

**3. 即时编译（JIT / TurboFan）**

- 当某段代码被频繁执行（成为"热点"），Ignition 把它交给 **TurboFan** 优化编译器，基于类型反馈把字节码编译成高度优化的**机器码**。
- 后续调用直接走机器码，性能接近 C。
- 如果运行时类型假设被推翻（如变量类型变化），会进行**去优化（deoptimization）**，回退到字节码解释执行。

**4. 垃圾回收（GC）**

- V8 采用分代式 GC：新生代用 Scavenge（短生命周期对象），老生代用 Mark-Sweep / Mark-Compact。
- GC 与主线程交替进行，部分阶段为并发/并行。

**5. 完整流程**

```
源代码
  │
  ├─ 词法分析 → Token 流
  ├─ 语法分析 → AST（含作用域、变量提升分析）
  ├─ Ignition  → 字节码 → 解释执行（收集类型反馈）
  │                          │
  │                          └─ 热点代码 → TurboFan → 机器码
  │                                              │
  │                                              └─ 类型失配 → 去优化 → 回字节码
  │
  └─ GC 分代回收（新生代 Scavenge / 老生代 Mark-Sweep）
```

**关键点**：

- JS 是**解释 + JIT 混合**执行，不是纯解释型语言。
- 解释器负责快速启动，编译器负责长期性能，二者权衡。
- 热点代码、内联缓存（IC）、隐藏类（hidden class）是 V8 性能优化的核心机制。

## 理解JavaScript的编译过程与运行机制

JavaScript 虽然通常被归类为"解释型语言"，但现代 JS 引擎采用了**解析 → 字节码 → JIT 机器码**的混合编译执行模式。从代码到运行，整个过程可分为编译阶段和执行阶段。

**一、编译阶段**

1. **词法分析**：源代码字符串 → token 流。
2. **语法分析**：token 流 → AST（抽象语法树）。
3. **作用域与变量提升**：生成 AST 时，引擎会扫描所有声明，把 `var`、`function` 声明提升到作用域顶部——函数声明整体提升，`var` 只提升声明不提升赋值，`let`/`const` 进入 **TDZ（暂时性死区）**。
4. **字节码生成与解释执行**：Ignition（V8）把 AST 编译成字节码逐行执行，收集类型反馈。
5. **JIT 优化**：热点代码经 TurboFan 编译为机器码；类型假设失效时去优化回退。

**二、执行阶段（运行时机制）**

1. **执行上下文栈（Execution Context Stack）**

   - 每调用一个函数就创建一个新的执行上下文，压入栈顶；执行完毕出栈。
   - 一个执行上下文包含：变量环境（var）、词法环境（let/const/闭包）、`this` 绑定。

2. **作用域链**

   - 函数定义时确定（**词法作用域/静态作用域**），与调用位置无关。闭包即函数携带其词法环境。

3. **this 绑定**

   - 默认绑定、隐式绑定、显式绑定（`call`/`apply`/`bind`）、`new` 绑定、箭头函数词法 `this`。

4. **事件循环（Event Loop）**

   - 主线程执行栈清空后，先清空所有**微任务**，再取一个**宏任务**执行，循环往复，中间穿插 UI 渲染。
   - 宏任务：`setTimeout`、`setInterval`、I/O、UI 事件、`postMessage`、`MessageChannel`。
   - 微任务：`Promise.then/catch/finally`、`queueMicrotask`、`MutationObserver`、`await` 后续逻辑（本质是 Promise）。

```js
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
console.log(4);
// 输出：1 4 3 2
```

5. **异步模型**

   - 单线程 + 事件循环。I/O、定时器、网络请求由宿主环境（浏览器/Node）的底层线程池处理，完成后把回调推入任务队列。

**三、整体流程**

```
源代码
  → 词法分析 → token
  → 语法分析 → AST（作用域、提升分析）
  → 字节码 → 解释执行 → JIT 热点优化 → 机器码
                                ↓
                  执行上下文栈 + 作用域链 + this
                                ↓
                  事件循环（调用栈 / 微任务 / 宏任务 / 渲染）
```

**理解意义**：掌握变量提升、TDZ、闭包、事件循环、JIT 优化机制，能解释"为什么 `setTimeout` 在 `Promise` 后执行"、"为什么 `var` 重复声明不报错"、"为什么热点函数突然变慢"等典型问题。

## JS代码中的use strict是什么意思？

`"use strict"` 是 ECMAScript 5 添加的一种**严格运行模式（strict mode）**，这种模式使得 JavaScript 在更严格的条件下运行。

**1. 设立严格模式的目的，主要有以下几个：**

- 消除 JavaScript 语法的一些不合理、不严谨之处，减少一些怪异行为；
- 消除代码运行的一些不安全之处，保证代码运行的安全；
- 提高编译器效率，增加运行速度；
- 为未来新版本的 JavaScript 做好铺垫。

**2. 严格模式与正常模式的主要区别：**

- 禁止使用 `with` 语句。
- 禁止 `this` 关键字指向全局对象（普通函数中 `this` 默认为 `undefined`，而非 `window`）。
- 对象不能有重名的属性（报错）。
- 函数不能有重名的参数（报错）。
- 禁止八进制字面量（如 `010`）。
- 未声明的变量不能直接使用（必须 `var`/`let`/`const`）。
- 不能使用 `delete` 删除不可配置的属性。
- `eval` 中声明的变量不会泄漏到外层作用域。
- 禁用 `arguments.callee`、`arguments.caller`、`caller`、`callee` 等。

**3. 开启方式：**

```js
'use strict'; // 全局严格模式

function f() {
  'use strict'; // 函数级严格模式
  // ...
}
```

也可以在 ES Module 或 Class 中默认开启严格模式（无需手写指令）。

"严格模式"体现了 JavaScript 更合理、更安全、更严谨的发展方向，包括 IE 10 在内的主流浏览器都已支持它，许多大项目已经开始全面拥抱它。掌握这些内容，有助于更细致深入地理解 JavaScript。

## 为什么JavaScript是单线程？

JavaScript语言的一大特点就是单线程，也就是说，同一个时间只能做一件事。那么，为什么JavaScript不能有多个线程呢？这样能提高效率啊。

JavaScript的单线程，与它的用途有关。作为浏览器脚本语言，JavaScript的主要用途是与用户互动，以及操作DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定JavaScript同时有两个线程，一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

所以，为了避免复杂性，从一诞生，JavaScript就是单线程，这已经成了这门语言的核心特征，将来也不会改变。

为了利用多核CPU的计算能力，HTML5提出Web Worker标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。所以，这个新标准并没有改变JavaScript单线程的本质。

## base64编码图片，为什么会让数据量变大？

Base64 把每 3 字节（24 bit）数据编码成 4 个 ASCII 字符（每个字符占 1 字节，承载 6 bit 信息），所以**编码后的体积是原始数据的 4/3 倍，即约增大 33%**。

**1. 为什么必须扩大**

Base64 的目标是把任意二进制数据映射成 64 个**可打印 ASCII 字符**（`A-Za-z0-9+/`，用 `=` 填充），以便在文本协议（HTML、CSS、JSON、URL）中安全传输。每个 ASCII 字符占 1 字节（8 bit），但只承载 6 bit 信息，于是有 2 bit 是"冗余"。

**2. 体积计算**

- 原始：3 字节 = 24 bit
- 编码：24 / 6 = 4 个字符 = 4 字节
- 比例：4 / 3 ≈ 1.333（+33%）

**3. 尾部填充的影响**

若原始字节数不是 3 的倍数，Base64 用 `=` 填充：

- 多 1 字节：补成 `XX==`，结果 4 字节，原始 1 字节，增大 4 倍。
- 多 2 字节：补成 `XXX=`，结果 4 字节，原始 2 字节，增大 2 倍。

**4. 图片场景的实际影响**

- 一张 30KB 的 PNG，Base64 后约 40KB。
- 在 CSS/HTML 中以 `data:image/png;base64,...` 形式内嵌后，HTML 文件变大；浏览器解析 HTML 时无法单独缓存这张图，每次刷新都重新下载（除非 HTML 本身被缓存）。
- 优点：省一次 HTTP 请求，避免跨域问题，适合小图标、icon。
- 缺点：体积增大约 33%，不能独立缓存，可能阻塞主文档解析。
- Gzip 压缩能部分抵消增大（Base64 字符重复度高，压缩效果好），但净体积通常仍大于原始二进制。

**结论**：Base64 用空间换"传输协议兼容性"，图片变大是编码机制本身的代价，不是压缩算法。对于较大图片，仍建议使用二进制资源 + CDN + 缓存。

## JavaScript中的 sort 方法是怎么实现的？

`Array.prototype.sort` 的实现因引擎而异，但都需要满足一个核心约束：**稳定排序**（ES2019 起规范要求）。

**1. 各引擎实现**

- **V8（Chrome / Node.js）**：历史上 V8 对短数组（长度 ≤ 10）使用**插入排序（Insertion Sort）**，对长数组使用**快速排序（Quick Sort）**；由于旧版快排非稳定，V8 7.0 起改为 **TimSort**（归并 + 插入的混合稳定排序，源自 Python），与规范要求一致。TimSort 在已部分有序的数据上接近 O(n)，最坏 O(n log n)。
- **SpiderMonkey（Firefox）**：使用归并排序（Merge Sort），稳定。
- **JavaScriptCore（Safari）**：较新版本使用 TimSort-like 稳定实现。

**2. 默认排序规则**

`sort()` 不传比较函数时，**默认把元素转成字符串按 UTF-16 码点升序排列**，因此 `[10, 2, 1].sort()` 得到 `[1, 10, 2]`（字典序中 `'10'` < `'2'`）。

```js
[10, 2, 1, 21].sort();
// [1, 10, 2, 21]
[10, 2, 1, 21].sort((a, b) => a - b);
// [1, 2, 10, 21]
```

**3. 自定义比较函数约定**

- `(a, b) => x`，`x < 0` 表示 a 排在 b 前面；`x > 0` 表示 a 排在 b 后面；`x === 0` 顺序不变。
- 升序：`(a, b) => a - b`；降序：`(a, b) => b - a`。
- 对象数组按字段排序：`arr.sort((a, b) => a.age - b.age)`。

**4. 复杂度总结**

| 引擎           | 算法        | 时间复杂度                  | 稳定性 |
| -------------- | ----------- | --------------------------- | ------ |
| V8（现代）     | TimSort     | 平均 O(n log n)，最优 O(n)  | 稳定   |
| SpiderMonkey   | Merge Sort  | O(n log n)                   | 稳定   |
| JavaScriptCore | TimSort-like| O(n log n)                   | 稳定   |

**面试要点**：

- 不传比较函数会按字符串排序，数字排序必须显式传函数。
- ES2019 起规范要求稳定排序，所有主流引擎均已实现。
- 排序对象数组时需提供比较函数，否则结果不可预期。

## js中数组是如何在内存中存储的？

JavaScript 数组并不是 C/Java 中那种"连续内存 + 定长元素"的数组，而是一种**特殊的对象**——以"类数组对象（array-like object）"形式实现，并配合引擎优化达到接近真实数组的性能。

**1. 本质：对象 + 索引属性**

- JS 数组本质上是对象，键是字符串形式的索引（`'0'`、`'1'`…），并维护 `length` 属性。
- 在 V8 中，数组有两种底层表示：
  - **Packed Array（紧凑 / FAST_ELEMENTS）**：所有索引 `0 ~ length-1` 都有值且类型一致，存为紧凑的 C++ 数组，访问 O(1)，性能接近 C 数组。
  - **Holey Array（HOLEY_ELEMENTS）**：存在空槽（如 `[1,,3]` 或 `delete arr[i]` 后），退化为稀疏存储（字典 / hash 表），访问变慢。
- 元素类型决定存储模式：`PACKED_SMI_ELEMENTS`（小整数）→ `PACKED_DOUBLE_ELEMENTS`（浮点）→ `PACKED_ELEMENTS`（任意对象），由具体类型决定。一旦插入更宽类型，会"过渡（transition）"到更通用的表示，且无法回退。

**2. 内存不连续的代价**

- `[1, 2, 3]` 在 V8 中可能是紧凑连续存储；
- 但 `[1, 'a', {}, 3.14]` 因类型混杂，必须用通用对象表示；
- 大跨度索引（如 `arr[1000000] = 1`）会触发稀疏 / 字典模式，浪费内存且变慢。

**3. 与 C/Java 数组的区别**

| 特性     | C/Java 数组      | JS 数组                  |
| -------- | ---------------- | ------------------------ |
| 内存布局 | 连续定长         | 可能连续，可能稀疏字典   |
| 元素类型 | 固定             | 可异构                   |
| 长度     | 编译期/分配时固定| 动态，可 `push`/`pop`    |
| 越界访问 | 非法/未定义行为  | 返回 `undefined`         |
| 多维数组 | 真正多维连续     | 数组的数组（引用嵌套）   |

**4. 扩容机制**

V8 数组 `push` 满时会动态扩容，新容量约为旧容量的 1.5 倍 + 少量 padding，避免频繁扩容。

**5. 性能建议**

- 尽量使用同类型、连续索引的数组，避免 `delete arr[i]`、避免大跨度索引。
- 已知大小时预分配固定长度（`new Array(n)`）可减少扩容开销。
- 数组很大且数值计算密集时，使用 **TypedArray**（`Int32Array`、`Float64Array` 等），它们是**真正的连续内存**，性能接近 C 数组，且支持 `SharedArrayBuffer` 跨 Worker 共享。

```js
const a = [1, 2, 3];               // PACKED_SMI_ELEMENTS，最快
a.push(3.14);                      // 过渡到 PACKED_DOUBLE_ELEMENTS
a.push({});                        // 过渡到 PACKED_ELEMENTS，最慢
const b = new Float64Array(1000);   // 真正连续内存，数值计算首选
```

## addEventListener参数

`addEventListener` 是 DOM 元素注册事件监听器的标准方法，签名如下：

```js
target.addEventListener(type, listener, options)
// 或
target.addEventListener(type, listener, useCapture)
```

**参数详解：**

**1. `type`（字符串）**：事件类型，如 `'click'`、`'input'`、`'keydown'`、`'DOMContentLoaded'`，注意不带 `on` 前缀。

**2. `listener`（函数或对象）**：事件触发时的回调函数，接收一个 `Event` 对象。

```js
btn.addEventListener('click', (e) => {
  console.log(e.target, e.currentTarget)
})
```

也可是实现了 `handleEvent` 方法的对象：

```js
const handler = {
  handleEvent(e) { console.log(e.type) }
}
btn.addEventListener('click', handler)
```

**3a. `useCapture`（布尔值，老式第三参数）**

- `false`（默认）：在**冒泡阶段**触发
- `true`：在**捕获阶段**触发

**3b. `options`（对象，现代第三参数）**

```js
btn.addEventListener('click', cb, {
  capture: false,    // 是否在捕获阶段触发
  once: true,        // 触发一次后自动移除
  passive: true      // 不调用 preventDefault，提升滚动性能
})
```

- `capture`：等价于 `useCapture`
- `once`：触发一次后自动 `removeEventListener`，常用于一次性引导/动画
- `passive: true`：告诉浏览器该监听器不会调用 `e.preventDefault()`，浏览器可以立即滚动而不用等监听器执行完毕，对 `touchmove`、`wheel` 等触摸事件尤其重要

**完整示例：**

```js
const btn = document.getElementById('btn')
const onClick = (e) => {
  console.log('clicked', e.target)
  // once: true 时无需手动移除
}
btn.addEventListener('click', onClick, { capture: false, once: true, passive: true })

// 手动移除（参数须与注册时一致）
btn.removeEventListener('click', onClick, false)
```

**注意点：**

- 同一 listener 用相同参数注册多次只触发一次；不同 `useCapture` 视为不同监听器
- `removeEventListener` 时第三参数必须与注册时一致才能正确移除
- `this` 默认指向注册事件的元素，箭头函数会绑定到外层 `this`

