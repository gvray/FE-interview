---
sidebar_position: 6
---

# 进阶用法

正则的真正威力在于与 String 方法的配合。`match`、`matchAll`、`replace`、`split`、`search` 五个方法覆盖了几乎所有字符串处理场景。本文还会覆盖命名捕获组、RegExp 属性、性能与可读性、以及"何时该用正则、何时该手写解析"的工程权衡。

## String 方法与正则

### `match`

行为取决于正则是否带 `g` 修饰符：

```js
// 无 g：返回第一个匹配及捕获组
"2023-07-01".match(/(\d{4})-(\d{2})/);
// ['2023-07', '2023', '07', index: 0, input: '2023-07-01', groups: undefined]

// 有 g：返回所有匹配字符串（不含捕获组）
"2023-07-01".match(/\d{2}/g);
// ['20', '23', '07', '01']

// 没匹配到：始终返回 null
"abc".match(/\d/); // null
```

> 经典坑：`match` 带 `g` 时丢失捕获组信息。要既全局又拿捕获组，必须用 `matchAll` 或 `exec` 循环。

### `matchAll`

ES2020 引入，返回一个迭代器，每次产出包含捕获组的完整匹配结果。要求正则必须带 `g`：

```js
const text = "a=1&b=2&c=3";
const re = /([^&=]+)=([^&]*)/g;
for (const m of text.matchAll(re)) {
  console.log(m[1], "=", m[2]);
}
// a = 1
// b = 2
// c = 3
```

```js
// 转数组方便处理
[...text.matchAll(re)].map(m => [m[1], m[2]]);
// [['a','1'], ['b','2'], ['c','3']]
```

`matchAll` 是替代 `exec` 循环的现代写法，更清晰且不会忘记重置 `lastIndex`。

### `replace`

```js
// 简单替换
"2023-07-01".replace(/-/g, "/"); // '2023/07/01'

// 用 $1 引用捕获组
"2023-07-01".replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1");
// '01/07/2023'
```

#### `replace` 的特殊替换模式

| 写法 | 含义 |
| --- | --- |
| `$$` | 字面量 `$` |
| `$&` | 整个匹配的子串 |
| `` $` `` | 匹配子串左侧的内容 |
| `$'` | 匹配子串右侧的内容 |
| `$n` | 第 n 个捕获组（n 为数字） |
| `$<name>` | 命名捕获组 |

```js
"hello".replace(/l/, "[$&]");   // 'he[l]lo'
"hello".replace(/l/, "[$`]");   // 'he[he]lo'，左侧内容
"hello".replace(/l/, "[$']");   // 'he[lo]lo'，右侧内容
```

### `replace` 回调

`replace` 的第二个参数可以是函数，每次匹配都会调用，返回值作为替换内容。这是 `replace` 最强大的用法：

```js
// 驼峰转 kebab
"myComponentName".replace(/([A-Z])/g, (_, c) => "-" + c.toLowerCase());
// 'my-component-name'

// 千分位（处理小数）
function formatMoney(num) {
  const [int, dec] = String(num).split(".");
  const formatted = int.replace(/\B(?=(\d{3})+$)/g, ",");
  return dec ? `${formatted}.${dec}` : formatted;
}
formatMoney(1234567.89); // '1,234,567.89'

// 模板字符串
const data = { name: "张三", age: 18 };
"我叫{name}，今年{age}岁".replace(/\{(\w+)\}/g, (_, key) => data[key]);
// '我叫张三，今年18岁'
```

回调函数签名：

```js
str.replace(re, (match, p1, p2, /* ... */, offset, string, groups) => {
  // match: 整个匹配
  // p1, p2, ...: 各捕获组
  // offset: 匹配在原字符串中的位置
  // string: 原字符串
  // groups: 命名捕获组对象（如果有）
  return replacement;
});
```

### `split`

```js
"a,b;c,d".split(/[,;]/);  // ['a', 'b', 'c', 'd']
"abc".split("");            // ['a', 'b', 'c']（无正则）
"a1b2c3".split(/\d/);       // ['a', 'b', 'c', '']
```

如果分隔符包含捕获组，分隔符也会出现在结果数组中：

```js
"a1b2c3".split(/(\d)/);
// ['a', '1', 'b', '2', 'c', '3', '']
```

### `search`

返回第一个匹配的索引，找不到返回 -1。忽略 `g` 修饰符：

```js
"abc123".search(/\d/); // 3
"abc".search(/\d/);    // -1
```

要找所有匹配位置，需要用 `matchAll`：

```js
[..."a1b2c3".matchAll(/\d/g)].map(m => m.index); // [1, 3, 5]
```

## 命名捕获组

ES2018 引入。比数字编号更易读、更健壮：

```js
const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const m = "2023-07-01".match(re);
console.log(m.groups.year);  // '2023'
console.log(m.groups.month); // '07'
console.log(m.groups.day);   // '01'
```

在 `replace` 中用 `$<name>` 引用：

```js
"2023-07-01".replace(re, "$<day>/$<month>/$<year>");
// '01/07/2023'
```

命名捕获组在回调中通过 `groups` 参数访问：

```js
"2023-07-01".replace(re, (match, { year, month, day }) => `${day}/${month}/${year}`);
```

## RegExp 对象的属性

```js
const re = /(\d{4})-(\d{2})/gi;
re.source;      // '(\\d{4})-(\\d{2})'，正则源码
re.flags;       // 'gi'，所有修饰符
re.global;      // true，是否有 g
re.ignoreCase;  // true，是否有 i
re.multiline;   // false
re.dotAll;      // false
re.unicode;     // false
re.sticky;      // false
re.lastIndex;   // 0，下次开始匹配的位置（带 g/y 时有意义）
```

### `lastIndex` 与状态

带 `g` 或 `y` 的正则有可变的 `lastIndex` 属性，`exec` 和 `test` 会读取并修改它：

```js
const re = /\d/g;
console.log(re.exec("a1b2")); // ['1', index: 1, ...]
console.log(re.lastIndex);    // 2
console.log(re.exec("a1b2")); // ['2', index: 3, ...]
console.log(re.exec("a1b2")); // null
console.log(re.lastIndex);    // 0，匹配到末尾后重置
```

> 经典陷阱：把同一个带 `g` 的正则用在多个 `test` 上，`lastIndex` 会"串"：

```js
const re = /\d/g;
console.log(re.test("1")); // true，lastIndex 变 1
console.log(re.test("2")); // false！lastIndex 是 1，"2" 的第 1 位是 undefined
```

解决方法：
1. 不复用正则对象，每次 `new` 一个新的。
2. 用完手动 `re.lastIndex = 0`。
3. 如果只是判断是否存在，不要带 `g`。

## `exec` 与全局匹配循环

`exec` 是最灵活的匹配方法，配合 `g` 可循环取所有结果：

```js
const re = /(\d+)/g;
const str = "a1b22c333";
let m;
while ((m = re.exec(str)) !== null) {
  console.log(m[1], "at", m.index);
}
// 1 at 1
// 22 at 3
// 333 at 6
```

现代代码推荐用 `matchAll` 替代，更安全：

```js
for (const m of str.matchAll(/(\d+)/g)) {
  console.log(m[1], "at", m.index);
}
```

## 性能与可读性

### 性能要点

1. **预编译**：循环中不要 `new RegExp`，提前定义一次。
2. **避免灾难性回溯**：见 [断言与回溯](./assertions.md)。
3. **字符类优先**：`[\d.]` 比 `(?:\d|\.)` 快得多。
4. **位置锚定**：用 `^` `$` 锚定可以提前失败，减少无效尝试。
5. **避免不必要的捕获**：用 `(?:...)` 替代 `(...)`。
6. **限定重复次数**：用 `{1,100}` 替代 `+`，避免超长字符串导致回溯爆炸。

```js
// 反例：循环内创建
inputs.forEach(i => /^\d+$/.test(i));

// 正例：预定义（虽然字面量本身就是预编译的，但构造函数场景要小心）
const numRe = /^\d+$/;
inputs.forEach(i => numRe.test(i));
```

### 可读性原则

1. **复杂正则加注释**：用 `RegExp` 拼接 + 注释。

```js
const dateRe = new RegExp(
  "^" +
    "(\\d{4})" +          // 年
    "-" +
    "(\\d{2})" +          // 月
    "-" +
    "(\\d{2})" +          // 日
    "$"
);
```

2. **拆分多个简单正则**：能写多个小正则就不要写一个超长正则。

```js
// 反例：超长正则
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// 正例：拆分（可读性更好）
function validPassword(pw) {
  return pw.length >= 8 &&
    /[a-z]/.test(pw) &&
    /[A-Z]/.test(pw) &&
    /\d/.test(pw);
}
```

3. **善用命名捕获组**：`(?<year>\d{4})` 比裸 `\d{4}` + `$1` 可读性强。

4. **配对测试**：复杂正则必须配一组单元测试，否则改一行就崩。

## 正则 vs 手写解析

不是所有字符串问题都该用正则。当规则过于复杂、需要状态机时，手写解析更清晰。

### 用正则的场景

- 简单的模式匹配与提取（手机号、邮箱）。
- 简单的字符串替换（千分位、模板变量）。
- 字符串分割。
- 已经有成熟、稳定的正则可复用。

### 用手写解析器的场景

- 嵌套结构（HTML、JSON、表达式）。
- 需要维护状态（带引号的 CSV、转义字符）。
- 规则非常复杂、正则会变得不可读。
- 需要精确错误信息。

```js
// 反例：用正则解析 HTML 通常会失败
const html = '<div data-x=">">text</div>';
html.match(/<div\s+(.*?)>(.*?)<\/div>/);
// 不会按预期工作，因为属性值里的 > 会干扰

// 正例：用 DOMParser 或专用解析器
const doc = new DOMParser().parseFromString(html, "text/html");
```

```js
// 反例：用正则解析 JSON
const json = '{"a":"b\\"c"}';
json.match(/\{"a":"(.+)"\}/); // 错误，转义会出问题

// 正例：用 JSON.parse
JSON.parse(json);
```

> 面试金句："能用专用 API 就别用正则"——解析 HTML 用 DOMParser，解析 URL 用 `new URL()`，解析 JSON 用 `JSON.parse()`。正则用于"模式匹配"而非"语法解析"。

## 综合示例：模板引擎

```js
function render(template, data) {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, expr) => {
    const keys = expr.trim().split(".");
    return keys.reduce((obj, k) => (obj == null ? undefined : obj[k]), data) ?? "";
  });
}

render("{{user.name}}, 你好", { user: { name: "张三" } });
// '张三, 你好'
```

## 综合示例：简易 Markdown 标题转 HTML

```js
function mdHeading(md) {
  return md.replace(/^(#{1,6})\s+(.+)$/gm, (_, hashes, text) => {
    const level = hashes.length;
    return `<h${level}>${text}</h${level}>`;
  });
}

mdHeading("# 标题1\n## 标题2");
// '<h1>标题1</h1>\n<h2>标题2</h2>'
```

## 面试常见提问

1. **`match` 带 `g` 和不带 `g` 的返回值有何不同？** —— 带 `g` 返回字符串数组，不带 `g` 返回类数组含捕获组。
2. **如何同时拿到所有匹配和捕获组？** —— `matchAll` 或 `exec` 循环。
3. **`$1` `$&` `` $` `` `$'` 分别是什么？** —— 第一个捕获组、整个匹配、左侧、右侧。
4. **带 `g` 的正则 `test` 多次为什么结果不同？** —— `lastIndex` 会被推进。
5. **命名捕获组相比数字编号有什么优势？** —— 可读性、抗修改（不会因增删捕获组而错位）。
6. **什么时候不该用正则？** —— 解析嵌套结构（HTML/JSON）、需要状态机的场景。

## 小结

| 工具 | 用途 |
| --- | --- |
| `match` | 拿第一个或全部匹配 |
| `matchAll` | 拿全部匹配 + 捕获组（推荐） |
| `replace` | 替换，回调是杀手锏 |
| `split` | 分割，捕获组会出现在结果中 |
| `search` | 找第一个匹配位置 |
| `exec` + `g` | 循环匹配（老式写法） |
| 命名捕获组 | 替代数字编号，更清晰 |
| `lastIndex` | 带 `g/y` 时的状态，需小心 |

至此正则系列从基础到进阶完整覆盖。建议结合 [常用正则示例](./common-patterns.md) 反复练习，把每个正则都自己写一遍——这是最有效的学习方式。
