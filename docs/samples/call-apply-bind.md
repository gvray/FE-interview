---
sidebar_position: 7
---
# 手写 call / apply / bind

> `call` / `apply` / `bind` 三个方法都是改变函数运行时 `this` 指向的工具。它们都基于「隐式绑定」原理：把函数挂到目标对象上作为方法调用，`this` 就指向那个对象。本文从原理出发逐步实现，并处理严格模式与 `bind` 的构造函数组合。

## 题目描述

不使用原生 `call / apply / bind`，实现：

1. `myCall(thisArg, ...args)`：立即调用，`this` 指向 `thisArg`，返回执行结果。
2. `myApply(thisArg, argsArray)`：与 `call` 类似，但参数以数组传入。
3. `myBind(thisArg, ...presetArgs)`：返回一个新函数，预置部分参数；若被 `new` 调用，`this` 指向新实例而非 `thisArg`。

## 思路分析

### call / apply

JavaScript 的 `this` 绑定规则中，**隐式绑定**最简单：`obj.fn()` 时 `fn` 内的 `this` 指向 `obj`。所以核心思路是：

1. 把函数作为 `thisArg` 的一个临时属性（用唯一 Symbol 避免覆盖已有属性）。
2. 通过 `thisArg[key](...args)` 调用，触发隐式绑定。
3. 调用完删除临时属性。
4. `thisArg` 是 `null` / `undefined` 时回退到全局对象（非严格）或保持 `null`/`undefined`（严格）。
5. `thisArg` 为原始值（如 `1`、`'s'`）时用 `Object(thisArg)` 包装。

### bind

`bind` 比 `call` 多两件事：

1. **柯里化参数**：预置参数 + 调用时追加参数合并。
2. **构造函数组合**：返回的函数若用 `new` 调用，应让 `this` 指向新实例，而不是 `thisArg`。

构造函数组合的实现思路：用中间函数 `F` 把原型链搭好，`new` 调用时 `this instanceof F` 为 true，说明是 `new` 触发，就走原函数 `apply(this, args)`；否则按普通调用 `apply(thisArg, args)`。

## 完整实现

```js
const SYMBOL_KEY = Symbol('fn');

function getThisArg(thisArg) {
  // 严格模式下 null/undefined 不包装成全局对象
  const isStrict = (function () {
    return !this;
  })();
  if (thisArg == null) {
    return isStrict ? thisArg : (typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
  }
  return Object(thisArg);
}

Function.prototype.myCall = function (thisArg, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('myCall must be called on a function');
  }
  const target = getThisArg(thisArg);
  const hasOwn = Object.prototype.hasOwnProperty.call(target, SYMBOL_KEY);
  // 备份原有同名属性，防止覆盖
  const originVal = hasOwn ? target[SYMBOL_KEY] : undefined;
  target[SYMBOL_KEY] = this;
  const result = target[SYMBOL_KEY](...args);
  // 还原
  if (hasOwn) {
    target[SYMBOL_KEY] = originVal;
  } else {
    delete target[SYMBOL_KEY];
  }
  return result;
};

Function.prototype.myApply = function (thisArg, argsArray) {
  if (typeof this !== 'function') {
    throw new TypeError('myApply must be called on a function');
  }
  // 规范：argsArray 可以是数组或类数组对象，传 null/undefined 视为空
  if (argsArray == null) {
    argsArray = [];
  } else if (!Array.isArray(argsArray) && typeof argsArray[Symbol.iterator] === 'function') {
    // 支持类数组、Set 等可迭代对象
    argsArray = [...argsArray];
  } else if (typeof argsArray !== 'object') {
    throw new TypeError('CreateListFromArrayLike called on non-object');
  }
  const target = getThisArg(thisArg);
  const hasOwn = Object.prototype.hasOwnProperty.call(target, SYMBOL_KEY);
  const originVal = hasOwn ? target[SYMBOL_KEY] : undefined;
  target[SYMBOL_KEY] = this;
  const result = target[SYMBOL_KEY](...argsArray);
  if (hasOwn) {
    target[SYMBOL_KEY] = originVal;
  } else {
    delete target[SYMBOL_KEY];
  }
  return result;
};

Function.prototype.myBind = function (thisArg, ...presetArgs) {
  if (typeof this !== 'function') {
    throw new TypeError('myBind must be called on a function');
  }
  const originFn = this;
  // 用一个中间构造器搭好原型链
  const Bound = function (...laterArgs) {
    // new 调用时 this instanceof Bound 为 true
    const isNew = this instanceof Bound;
    const args = [...presetArgs, ...laterArgs];
    // new 时让原函数以 this（新实例）作为 this 执行
    if (isNew) {
      // 关键：需要把原函数的返回值（如果是对象）作为实例
      const result = originFn.myApply(this, args);
      const isObject = result !== null && (typeof result === 'object' || typeof result === 'function');
      return isObject ? result : this;
    }
    return originFn.myApply(thisArg, args);
  };

  // 维持原型链：Bound 的实例继承自 originFn 的原型
  // 注意：直接 Bound.prototype = originFn.prototype 会互相污染，需用空函数桥接
  const Empty = function () {};
  Empty.prototype = originFn.prototype;
  Bound.prototype = new Empty();
  Bound.prototype.constructor = Bound;

  return Bound;
};
```

## 边界与测试用例

```js
// 1. 基础 call
function greet(prefix, suffix) {
  return `${prefix}-${this.name}-${suffix}`;
}
const ctx = { name: 'Tom' };
console.log('case1', greet.myCall(ctx, 'Hi', '!')); // Hi-Tom-!

// 2. apply 传数组
console.log('case2', greet.myApply(ctx, ['Hi', '!'])); // Hi-Tom-!

// 3. apply 不传 args
console.log('case3', (function () { return this.name; }).myApply(ctx)); // Tom

// 4. thisArg 是原始值
function getThis() { return this; }
const boxed = getThis.myCall(5);
console.log('case4', boxed instanceof Number); // true（被包装）

// 5. null thisArg 在非严格模式指向 globalThis
function globalName() { return typeof this === 'object' ? (this === globalThis ? 'global' : 'obj') : 'primitive'; }
console.log('case5', globalName.myCall(null)); // 'global' 或 'primitive' 取决于严格模式

// 6. bind 基础
const bound = greet.myBind(ctx, 'Hello');
console.log('case6', bound('?')); // Hello-Tom-?

// 7. bind 被直接调用时不改变 this
const obj = { name: 'Jerry', greet };
console.log('case7', obj.greet.myBind(ctx)('Yo', '!')); // Yo-Tom-!，bind 优先

// 8. bind 作为构造函数：this 指向新实例
function Person(name, age) {
  this.name = name;
  this.age = age;
}
const BoundPerson = Person.myBind({ name: 'ignored' }, 'Alice');
const p = new BoundPerson(30);
console.log('case8', p.name, p.age); // Alice 30

// 9. bind 后的原型链
console.log('case9', p instanceof Person); // true
console.log('case9 instanceof Bound', p instanceof BoundPerson); // true

// 10. 原函数返回对象时 new 取该对象
function Factory() {
  return { from: 'factory' };
}
const BF = Factory.myBind({});
console.log('case10', new BF().from); // 'factory'

// 11. 原函数返回 undefined / 基础类型时 new 取实例
function NumCtor() {
  this.x = 1;
  return 5; // 基础类型被忽略
}
const BN = NumCtor.myBind({});
console.log('case11', new BN().x); // 1

// 12. 类数组 args
function sum() {
  let s = 0;
  for (let i = 0; i < arguments.length; i++) s += arguments[i];
  return s;
}
const arrLike = { 0: 1, 1: 2, 2: 3, length: 3 };
console.log('case12', sum.myApply(null, arrLike)); // 6
```

注意几个细节：

- 临时属性要用 Symbol，避免与目标对象已有属性冲突。
- 调用前后要还原原值（处理「目标对象刚好有同名 Symbol」的极端情况）。
- 严格模式下 `null` / `undefined` 的 `thisArg` 不包装为全局对象；非严格模式才包装。
- `bind` 后的函数被 `new` 调用时，预置参数仍生效，且 `this` 指向新实例而非 `thisArg`。
- 原函数如果返回对象，`new` 时实际返回该对象（标准 `[[Construct]]` 行为）。
- 直接 `Bound.prototype = originFn.prototype` 会让外部修改原型时污染原函数原型，用空函数桥接更安全。

## 进阶追问

1. **为什么用 Symbol 而不是字符串做临时属性？** Symbol 唯一性高、不可枚举、不会与已有属性冲突，比 `'__fn__'` 这种字符串更安全。
2. **call 与 apply 的差别？** 参数传递方式不同：call 是展开的参数列表，apply 是数组（或类数组、可迭代对象）。
3. **bind 为什么需要原型桥接？** 直接 `Bound.prototype = originFn.prototype` 会让对 `Bound.prototype` 的修改直接打到原函数原型上，污染原函数。用空函数 `Empty` 做一层原型链隔离即可避免。
4. **bind 返回的函数被 new 时 `this` 是什么？** 是 `new` 创建的新实例，不是 `bind` 的第一个参数。这是 bind 与 call/apply 最大的差别。
5. **bind 后还能再 call 改变 this 吗？** 不能。bind 产生的函数内部已经锁定了 `thisArg`（除非被 `new`），后续 `call` 无法改变。
6. **箭头函数的 `this` 能用 call/apply/bind 改吗？** 不能。箭头函数没有自己的 `this`，沿词法作用域向上查找，call/apply/bind 的第一个参数对箭头函数无效。
7. **如何实现一个「软绑定」？** 即默认绑定到某个对象，但显式 call/apply 时仍可改变。在 bound 内部判断 `this` 是否为 globalThis，是则用默认对象，否则用当前 `this`。
