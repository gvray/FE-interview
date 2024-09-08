---
sidebar_position: 5
---

# 常用正则示例

面试中"手写正则"几乎都集中在几个固定场景：邮箱、手机号、身份证、URL、IP、日期、千分位、密码强度。本文对每个场景给出**正则 + 解释 + 测试**，便于直接背诵与对照修改。

> 工程提示：业务场景千差万别，下面给出的正则只是"够用且严谨度合理"的版本，不是"绝对正确"的版本。面试时说明权衡（如是否允许新版手机号、是否支持港澳台）反而加分。

## 邮箱

### 正则

```js
const emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```

### 解释

| 部分 | 含义 |
| --- | --- |
| `[a-zA-Z0-9._%+-]+` | 用户名：字母数字及常见符号 |
| `@` | 字面量 at 符号 |
| `[a-zA-Z0-9.-]+` | 域名：字母数字及 `.`、`-` |
| `\.[a-zA-Z]{2,}` | 顶级域：`.` 加至少 2 位字母 |

### 测试

```js
emailRe.test("user@example.com");        // true
emailRe.test("user.name+tag@sub.cn");    // true
emailRe.test("user@example");             // false，缺少顶级域
emailRe.test("@example.com");            // false，缺少用户名
emailRe.test("user@.com");               // false，域名不完整
```

> RFC 5322 规范的邮箱极其复杂（支持注释、引号等），完整正则长达几千字符。面试给出上述"实用版本"即可，并主动说明"完整 RFC 邮箱需要更复杂的正则"。

## 手机号

### 正则

```js
// 中国大陆手机号：1 开头，第二位为 3-9，共 11 位
const phoneRe = /^1[3-9]\d{9}$/;
```

### 解释

- `^1`：必须以 1 开头
- `[3-9]`：第二位在 3-9 之间（历史上 1 开头后第二位不可能是 1、2）
- `\d{9}`：剩余 9 位数字
- `$`：结尾必须正好 11 位

### 测试

```js
phoneRe.test("13812345678"); // true
phoneRe.test("19912345678"); // true
phoneRe.test("12345678901"); // false，第二位不能是 2
phoneRe.test("1381234567");  // false，只有 10 位
phoneRe.test("138123456789"); // false，12 位
```

> 进阶：如果需要支持虚拟运营商（170/171/162/165/167 等），可放宽为 `/^1[3-9]\d{9}$/` 已能覆盖；如要严格区分号段，需要按运营商维护号段列表，且会随工信部新号段发布而过时。

## 身份证

### 正则

```js
// 18 位身份证（支持最后一位为 X）
const idRe = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/i;
```

### 解释

| 部分 | 含义 |
| --- | --- |
| `[1-9]\d{5}` | 前 6 位地址码，首位非 0 |
| `(?:18\|19\|20)\d{2}` | 出生年份，限定 1800-2099 |
| `(?:0[1-9]\|1[0-2])` | 月份 01-12 |
| `(?:0[1-9]\|[12]\d\|3[01])` | 日期 01-31 |
| `\d{3}` | 顺序码 3 位 |
| `[\dX]` | 校验码，数字或 X |

### 测试

```js
idRe.test("11010519900307283X"); // true
idRe.test("110105199003072834");  // true
idRe.test("010105199003072834");  // false，地址码首位为 0
idRe.test("110105179903072834");  // false，年份超出范围
idRe.test("110105199013072834");  // false，月份 13 非法
```

> 严格来说还应校验校验码（基于 ISO 7064 MOD 11-2 算法），但面试中给出上述结构校验已经够用。15 位旧身份证已基本不再使用，可不做支持。

## URL

### 正则

```js
const urlRe = /^https?:\/\/[\w.-]+(?::\d+)?(?:\/[^\s]*)?$/i;
```

### 解释

- `https?`：http 或 https
- `:\/\/`：字面量 `://`
- `[\w.-]+`：域名
- `(?::\d+)?`：可选端口
- `(?:\/[^\s]*)?`：可选路径，非空白字符

### 测试

```js
urlRe.test("https://www.example.com");          // true
urlRe.test("http://localhost:3000/api");         // true
urlRe.test("https://example.com/path?q=1#top");  // true
urlRe.test("ftp://example.com");                 // false
urlRe.test("example.com");                       // false，缺少协议
```

> 完整 URL 规范（含 query、fragment、userinfo）极其复杂，JavaScript 内置 `new URL()` 是更可靠的选择。面试说明这个权衡比写一个 500 字符的正则更聪明。

## IP 地址

### IPv4

```js
// IPv4，每段 0-255
const ipv4Re = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
```

### 解释

每一段的匹配分四种情况，从大到小：
- `25[0-5]`：250-255
- `2[0-4]\d`：200-249
- `1\d\d`：100-199
- `[1-9]?\d`：0-99

前三段后面跟 `\.`，最后一段不需要点。

### 测试

```js
ipv4Re.test("192.168.1.1");   // true
ipv4Re.test("0.0.0.0");       // true
ipv4Re.test("255.255.255.255"); // true
ipv4Re.test("256.1.1.1");      // false
ipv4Re.test("192.168.1");      // false
ipv4Re.test("192.168.1.1.1");  // false
```

> 简化版 `^(\d{1,3}\.){3}\d{1,3}$` 能通过 `999.999.999.999`，**不严谨**，面试不要写。

## 日期

### 正则

```js
// YYYY-MM-DD，简化版（不校验 30/31 日跨月）
const dateRe = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
```

### 测试

```js
dateRe.test("2023-07-01"); // true
dateRe.test("2023-13-01"); // false，月份非法
dateRe.test("2023-07-32"); // false，日期非法
dateRe.test("2023-7-1");   // false，必须补 0
```

> 业务校验日期应优先用 `Date` 对象：`new Date(year, month-1, day)` 配合比较年月日是否一致。正则无法处理闰年（2 月 29 日）。

## 千分位

### 正则

```js
"1234567890".replace(/\B(?=(\d{3})+$)/g, ",");
// '1,234,567,890'
```

### 解释

- `\B`：非单词边界，确保不是数字开头
- `(?=(\d{3})+$)`：右边是 3 的倍数个数字直到结尾
- `g`：所有满足条件的位置都替换

### 测试

```js
function formatMoney(n) {
  return String(n).replace(/\B(?=(\d{3})+$)/g, ",");
}
formatMoney(1234567890); // '1,234,567,890'
formatMoney(12345);      // '12,345'
formatMoney(12);         // '12'
formatMoney(1234.56);    // '1,234.56'，注意：此正则不处理小数点
```

> 处理小数的版本：`/\B(?=(\d{3})+(?!\d))/g`，更精确的处理见进阶篇。

## 密码强度

### 正则

```js
// 至少 8 位，包含大小写字母、数字、特殊字符
const strongRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
```

### 解释

四个先行断言叠加：
- `(?=.*[a-z])`：必须含小写
- `(?=.*[A-Z])`：必须含大写
- `(?=.*\d)`：必须含数字
- `(?=.*[!@#$%^&*])`：必须含特殊字符
- `.{8,}`：至少 8 位（任意字符）

### 测试

```js
strongRe.test("Abc123!@");   // true
strongRe.test("abc123!@");   // false，缺大写
strongRe.test("Abcdefgh");   // false，缺数字和特殊字符
strongRe.test("A1!a");       // false，长度不足
```

## 驼峰转换

### kebab-case → camelCase

```js
"my-component-name".replace(/-([a-z])/g, (_, c) => c.toUpperCase());
// 'myComponentName'
```

### camelCase → kebab-case

```js
"myComponentName".replace(/([A-Z])/g, "-$1").toLowerCase();
// 'my-component-name'
```

## 提取所有数字

```js
"abc123def456".match(/\d+/g); // ['123', '456']
```

## 去除首尾空白

```js
"  hello  ".replace(/^\s+|\s+$/g, "");
// 'hello'
// 现代浏览器可直接用 String.prototype.trim()
```

## 中文字符校验

```js
// 仅中文字符
const cnRe = /^[一-龥]+$/;
cnRe.test("你好世界");  // true
cnRe.test("Hello");    // false
cnRe.test("你好1");     // false
```

> `一-龥` 是常用 CJK 统一汉字范围，但**不包含**生僻字、扩展集汉字。严格场景需用 `u` 修饰符配合 Unicode 属性 `\p{Script=Han}`：

```js
const strictCn = /^\p{Script=Han}+$/u;
strictCn.test("你好𠮷"); // true，能覆盖更多汉字
```

## 16 进制颜色

```js
// 支持 #abc 和 #aabbcc
const hexRe = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
hexRe.test("#abc");    // true
hexRe.test("#AABBCC"); // true
hexRe.test("#abcd");   // false
hexRe.test("abc");     // false，缺少 #
```

## 综合测试函数

```js
function testAll() {
  const cases = [
    { re: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, input: "a@b.com", expect: true },
    { re: /^1[3-9]\d{9}$/, input: "13812345678", expect: true },
    { re: /^https?:\/\/[\w.-]+/, input: "https://a.com", expect: true },
    { re: /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/, input: "1.2.3.4", expect: true },
  ];
  cases.forEach((c, i) => {
    const ok = c.re.test(c.input) === c.expect;
    console.log(i, ok ? "PASS" : "FAIL", c.input);
  });
}
testAll();
```

## 小结

| 场景 | 关键正则片段 |
| --- | --- |
| 邮箱 | `[a-zA-Z0-9._%+-]+@...` |
| 手机号 | `^1[3-9]\d{9}$` |
| 身份证 | `[1-9]\d{5}(?:18\|19\|20)\d{2}...` |
| URL | `^https?:\/\/...` |
| IPv4 | `(?:25[0-5]\|2[0-4]\d\|1\d\d\|[1-9]?\d)` 四段 |
| 日期 | `^\d{4}-(?:0[1-9]\|1[0-2])-(?:0[1-9]\|[12]\d\|3[01])$` |
| 千分位 | `\B(?=(\d{3})+$)` |
| 密码强度 | 多个 `(?=.*...)` 叠加 |
| 驼峰转换 | `replace(/-([a-z])/g, ...)` |

下一篇 [进阶用法](./advanced.md) 将介绍 String 与 RegExp 的协同方法、replace 回调、命名捕获组、性能与可读性权衡。
