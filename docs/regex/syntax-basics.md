---
sidebar_position: 2
---

# 正则基础语法

正则表达式是描述字符串模式的一种微型语言。要读懂、写出一行正则，必须先掌握它的两种创建方式、字符与字符类的语义、锚点的定位作用，以及修饰符对匹配行为的影响。本文是正则系列的基础篇。

## 创建正则的两种方式

### 字面量

最常用的方式，使用两个斜杠包裹模式：

```js
const re = /abc/g;
console.log(re.test("abc")); // true
console.log("xabcx".match(re)); // ['abc']
```

字面量在**脚本加载时**就被编译，性能更好，且不需要关心转义。绝大多数场景下推荐使用。

### RegExp 构造函数

当模式是**动态生成**（来自变量、用户输入）时，必须使用 `RegExp` 构造函数：

```js
const keyword = "abc";
const re = new RegExp(keyword, "g");
console.log(re.test("xxabcxx")); // true

// 注意：字符串中反斜杠会被先解析一次，因此 \d 需要写成 \\d
const re2 = new RegExp("\\d{3}", "g");
console.log("a123b".match(re2)); // ['123']
```

> 这是一个经典面试陷阱：字面量中写 `\d` 即可，但 `new RegExp("\\d")` 中必须写双反斜杠，因为字符串字面量会把 `\d` 中的 `\d` 当作非法转义而吞掉反斜杠。

### 两种方式的对比

| 维度 | 字面量 `/abc/g` | `new RegExp("abc", "g")` |
| --- | --- | --- |
| 编译时机 | 脚本加载时编译 | 运行时编译 |
| 动态模式 | 不支持 | 支持 |
| 转义 | 单反斜杠 `\d` | 双反斜杠 `\\d` |
| 可读性 | 高 | 较低 |
| 性能 | 略优（可被引擎缓存） | 略低 |

## 字符与字符类

### 普通字符

普通字符（如 `a`、`中`、`5`）只匹配它本身：

```js
/cat/.test("a cat"); // true
/cat/.test("a cap");  // false
```

### 字符类 `[...]`

方括号表示一个字符集合，匹配其中**任意一个**字符：

```js
/[aeiou]/.test("hello"); // true，匹配到 e
/[abc]/.test("xyz");     // false
```

- `[a-z]`：匹配 a 到 z 之间任意小写字母
- `[A-Za-z0-9]`：匹配字母与数字
- `[一-龥]`：匹配常用中文字符

### 取反字符类 `[^...]`

在方括号开头加 `^` 表示"不在集合中的任意字符"：

```js
/[^0-9]/.test("abc"); // true
/[^0-9]/.test("123"); // false
```

注意：`^` 在字符类内部只是取反，与作为锚点的 `^` 语义不同。

### 预定义字符类

正则提供了一组简写形式，覆盖最常见的字符集合：

| 写法 | 等价于 | 含义 |
| --- | --- | --- |
| `\d` | `[0-9]` | 数字 |
| `\D` | `[^0-9]` | 非数字 |
| `\w` | `[A-Za-z0-9_]` | 单词字符（含下划线） |
| `\W` | `[^A-Za-z0-9_]` | 非单词字符 |
| `\s` | `[ \t\r\n\f\v]` | 空白符 |
| `\S` | `[^ \t\r\n\f\v]` | 非空白符 |
| `.` | `[^\n\r  ]`（无 s 修饰符时） | 除换行符外任意字符 |

```js
console.log(/\d/.test("a1"));   // true
console.log(/\w/.test("a_b"));  // true
console.log(/\s/.test("a b")); // true
console.log(/./.test("\n"));   // false
```

> 注意 `\w` **不包含**中文、不包含 `-`。匹配中文需要用 `[一-龥]` 这类显式范围。

### 点号 `.` 的特殊性

`.` 默认不匹配换行符。若要让它匹配包括换行符在内的任意字符，需要使用 `s`（dotAll）修饰符：

```js
/a.b/.test("a\nb");  // false
/a.b/s.test("a\nb"); // true
```

## 锚点

锚点不匹配任何实际字符，而是匹配一个**位置**，用于限定模式在字符串中出现的位置。

| 锚点 | 含义 |
| --- | --- |
| `^` | 字符串开头（多行模式下为行首） |
| `$` | 字符串结尾（多行模式下为行尾） |
| `\b` | 单词边界 |
| `\B` | 非单词边界 |

### `^` 与 `$`

```js
/^hello/.test("hello world");  // true，以 hello 开头
/hello$/.test("say hello");   // true，以 hello 结尾
/^hello$/.test("hello");      // true，整行就是 hello
/^hello$/.test("hello world"); // false
```

### 单词边界 `\b`

`\b` 匹配单词字符 `\w` 与非单词字符 `\W` 之间的位置：

```js
/\bcat\b/.test("a cat");       // true
/\bcat\b/.test("a category");  // false，cat 后面是 e，不是边界
/\bcat\b/.test("cat!");        // true
```

> `\b` 在面试中常用于"匹配完整单词"场景。注意它基于 `\w`，对**中文无效**。

### 多行模式下的锚点

默认 `^` `$` 只匹配整个字符串的头尾。加 `m` 修饰符后，每一行的行首行尾都会被匹配：

```js
const text = "line1\nline2";
console.log(/^line\d$/m.test(text)); // true
console.log(/^line\d$/.test(text));  // false，不加 m 时 ^$ 跨越了换行
```

## 修饰符

修饰符放在正则字面量末尾（`/abc/gi`）或 `RegExp` 第二个参数中，影响匹配的全局行为。

| 修饰符 | 名称 | 作用 |
| --- | --- | --- |
| `g` | global | 全局匹配，找到所有结果而非在第一个匹配后停止 |
| `i` | ignoreCase | 忽略大小写 |
| `m` | multiline | 多行模式，`^` `$` 匹配每行的头尾 |
| `s` | dotAll | 让 `.` 匹配包括换行符在内的任意字符 |
| `u` | unicode | 启用 Unicode 模式，正确处理 surrogate pair 与 Unicode 属性 |
| `y` | sticky | 粘连模式，从 `lastIndex` 开始必须立即匹配成功 |

### `g` 全局匹配

```js
"a1b2c3".match(/\d/g); // ['1','2','3']
"a1b2c3".match(/\d/);  // ['1']（非全局只返回第一个）
```

> 注意：带 `g` 的正则用 `test()`、`exec()` 时会**修改 lastIndex**，多次调用可能产生意外结果：

```js
const re = /a/g;
console.log(re.test("aab")); // true
console.log(re.test("aab")); // true
console.log(re.test("aab")); // false ← lastIndex 已超出
```

### `i` 忽略大小写

```js
/abc/i.test("ABC"); // true
```

### `u` Unicode 模式

处理 Emoji、生僻字等 surrogate pair 时务必加 `u`，否则会被当成两个字符：

```js
/😄{2}/.test("😄😄");  // false，😄 是两个码元
/😄{2}/u.test("😄😄"); // true
/^.$/.test("😄");       // false
/^.$/u.test("😄");      // true
```

### `y` 粘连模式

`y` 要求每次匹配必须从 `lastIndex` 位置**立即**开始，不允许跳过字符：

```js
const re = /ab/y;
re.lastIndex = 0;
re.exec("abab");   // ['ab']，从 0 开始匹配成功
re.lastIndex = 2;
re.exec("abab");   // ['ab']，从 2 开始匹配成功
re.lastIndex = 1;
re.exec("abab");   // null，从 1 开始要求立即匹配 'ab'，但 'ba' 不匹配
```

`y` 常用于词法分析、严格分词场景。

## 一个综合示例

校验一个变量名是否合法（以字母或下划线开头，由字母数字下划线组成）：

```js
function isValidVarName(name) {
  return /^[A-Za-z_]\w*$/.test(name);
}
console.log(isValidVarName("_foo"));  // true
console.log(isValidVarName("foo1"));  // true
console.log(isValidVarName("1foo")); // false
```

## 面试常见提问

1. **字面量和 `new RegExp` 的区别？** —— 编译时机、动态性、转义。
2. **`\w` 包含中文吗？** —— 不包含，只含 `[A-Za-z0-9_]`。
3. **`^` 在 `[]` 内外分别是什么意思？** —— 内部为取反，外部为行首锚点。
4. **带 `g` 的正则 `test` 多次调用为什么会返回 `false`？** —— lastIndex 被推进且未重置。
5. **如何让 `.` 匹配换行符？** —— 使用 `s` 修饰符。

## 小结

本文覆盖了正则最基础的部分：两种创建方式、字符与字符类、锚点、修饰符。掌握这些已经可以应付大部分日常场景，但还不能写出复杂的模式。下一篇 [元字符与量词](./meta-and-quantifiers.md) 将介绍量词、分组与反向引用，这是写复杂正则的核心工具。
