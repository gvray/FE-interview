---
sidebar_position: 8
---
# 手写 new 与 instanceof

> `new` 和 `instanceof` 是 JS 中两块互为镜像的能力：`new` 把一个函数当构造器使用并产生实例，`instanceof` 判断实例与构造器的关系。它们都依赖原型链。本文实现两个操作并解释清楚每一步的对应规范。

## 题目描述

1. 实现 `myNew(Constructor, ...args)`：等同 `new Constructor(...args)` 的行为。
2. 实现 `myInstanceof(obj, Constructor)`：等同 `obj instanceof Constructor`，沿原型链查找。

## 思路分析

### new 的四步

ECMAScript 规范中 `[[Construct]]` 的语义可拆为四步：

1. **创建新对象**：以 `Constructor.prototype` 为原型新建一个普通对象。
2. **绑定并执行**：把上一步新对象作为 `this`，调用构造函数并传入 `args`。
3. **判断返回值**：如果构造函数返回对象，则 `new` 表达式返回该对象；否则返回第 1 步新建的对象（构造函数显式返回基础类型会被忽略）。
4. **(规范额外)** ES6 的 `newTarget`、`Symbol.species` 等扩展暂不处理。

关键点：第 1 步要兼容 `Constructor.prototype` 不是对象的情况（如被改写为 `null`），此时应回退到 `Object.prototype`。

### instanceof 的原型链查找

`obj instanceof Ctor` 等价于：拿到 `Ctor.prototype`，沿 `obj` 的原型链（`Object.getPrototypeOf` 一路向上）查找是否相等。任一层匹配则返回 `true`，找到原型链尽头（`null`）仍未匹配则返回 `false`。

边界：

- `obj` 不是对象（如 `1`、`'s'`）直接返回 `false`（基础类型没有 `[[Prototype]]`）。
- `Ctor` 不是函数抛 `TypeError`。
- `Ctor.prototype` 不是对象（如 `Object.create(null)` 后被设为 `null`）直接返回 `false`。
- 多个 realm（iframe）下不同 `Array` 的原型可能不同，`arr instanceof Array` 跨 realm 可能失败，但 `myInstanceof` 行为与之一致。

## 完整实现

```js
/**
 * 手写 new
 * @param {Function} Constructor 构造函数
 * @param  {...any} args 构造参数
 */
function myNew(Constructor, ...args) {
  if (typeof Constructor !== 'function') {
    throw new TypeError(`${Constructor} is not a constructor`);
  }

  // 1. 以 Constructor.prototype 为原型创建新对象
  //    如果 prototype 不是对象（被改写为 null/原始值），回退到 Object.prototype
  let proto = Constructor.prototype;
  if (proto === null || (typeof proto !== 'object' && typeof proto !== 'function')) {
    proto = Object.prototype;
  }
  const instance = Object.create(proto);

  // 2. 以 instance 作为 this 调用构造函数
  const result = Constructor.apply(instance, args);

  // 3. 构造函数返回对象则采用该返回值，否则用新建的实例
  const isObject = result !== null && (typeof result === 'object' || typeof result === 'function');
  return isObject ? result : instance;
}

/**
 * 手写 instanceof
 * @param {*} obj 左值
 * @param {Function} Constructor 构造函数
 */
function myInstanceof(obj, Constructor) {
  if (typeof Constructor !== 'function') {
    throw new TypeError('Right-hand side of instanceof is not callable');
  }

  // 基础类型直接 false
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return false;
  }

  let target = Constructor.prototype;
  // Constructor.prototype 不是对象直接返回 false
  if (target !== null && typeof target !== 'object' && typeof target !== 'function') {
    return false;
  }

  // 沿原型链向上查找
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (proto === target) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

## 边界与测试用例

```js
// 1. 基础构造
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} speaks`;
};

const a = myNew(Animal, 'Cat');
console.log('case1', a.name, a.speak()); // 'Cat' 'Cat speaks'
console.log('case1 instanceof', myInstanceof(a, Animal)); // true

// 2. 构造函数返回对象：被采用
function ReturnsObj() {
  this.x = 1;
  return { y: 2 };
}
const r = myNew(ReturnsObj);
console.log('case2', r.x, r.y); // undefined 2

// 3. 构造函数返回基础类型：被忽略
function ReturnsPrim() {
  this.x = 1;
  return 5;
}
const p = myNew(ReturnsPrim);
console.log('case3', p.x); // 1

// 4. 原型链继承
function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.bark = function () {
  return `${this.name} barks`;
};
const d = myNew(Dog, 'Rex');
console.log('case4', myInstanceof(d, Dog), myInstanceof(d, Animal)); // true true

// 5. prototype 被设为 null：回退到 Object.prototype
function NoProto() {}
NoProto.prototype = null;
const n = myNew(NoProto);
console.log('case5 proto', Object.getPrototypeOf(n) === Object.prototype); // true

// 6. instanceof 对基础类型返回 false
console.log('case6', myInstanceof(1, Number)); // false
console.log('case6 str', myInstanceof('a', String)); // false

// 7. 跨原型链查找
console.log('case7', myInstanceof([], Array)); // true
console.log('case7 obj', myInstanceof([], Object)); // true
console.log('case7 fn', myInstanceof(function () {}, Function)); // true

// 8. Object.create(null) 不属于任何构造器
const bare = Object.create(null);
console.log('case8', myInstanceof(bare, Object)); // false

// 9. 原型链尽头
console.log('case9', myInstanceof({}, Object)); // true
console.log('case9 proto null', myInstanceof(Object.create(null), Object)); // false

// 10. 右值不是函数抛错
try {
  myInstanceof({}, {});
} catch (e) {
  console.log('case10', e.constructor.name); // TypeError
}

// 11. ES6 class 默认不能不 new 调用，myNew 同样适用
class Foo {
  constructor(v) {
    this.v = v;
  }
}
const f = myNew(Foo, 42);
console.log('case11', f.v, myInstanceof(f, Foo)); // 42 true
```

注意以下细节：

- **`Constructor.prototype = null` 的兼容**：原生 `new` 在这种情况下，新对象的原型回退到 `Object.prototype`，不是 `null`。手写时也需要回退。
- **构造函数返回值规则**：返回**对象**才被采用；返回基础类型（`number`/`string`/`boolean`/`symbol`/`bigint`/`undefined`/`null`）都被忽略，使用新建实例。
- **基础类型的 instanceof**：`1 instanceof Number` 永远 `false`，因为基础类型没有原型链。包装对象 `new Number(1)` 才是 `true`。
- **`class` 必须用 new 调用**：手写 `myNew` 不会绕过这个限制，class 内部 `[[Construct]]` 会做校验。
- **跨 realm**：iframe 里的 `Array` 与外层 `Array` 是不同构造器，跨 realm 的 `instanceof` 失败。替代方案是用 `Array.isArray` 或 `Object.prototype.toString`。

## 进阶追问

1. **`new` 的四步是什么？** 创建对象并以 `Constructor.prototype` 为原型 → 把对象作为 `this` 执行构造函数 → 判断返回值是对象则采用否则用新对象 → 返回。还有第 0 步：检查 Constructor 是否可被 `new`（class 不能直接调）。
2. **构造函数返回对象会怎样？** `new` 表达式的结果就是该返回对象，而不是新建的实例；返回基础类型则被忽略。
3. **`Object.create(null)` 为什么不属于 `Object`？** 它的原型链直接是 `null`，没有 `Object.prototype` 这一层，所以 `instanceof Object` 是 `false`。
4. **`instanceof` 与 `typeof` 的区别？** `typeof` 只能区分基础类型和函数；`instanceof` 基于原型链判断对象与构造器的关系，能区分 `Array` / `Date` / `RegExp` 等子类型。
5. **`constructor` 检查与 `instanceof` 哪个更可靠？** `instanceof` 更可靠。`constructor` 属性可以被改写、可以被覆盖（如继承后未修正 `constructor`），而 `instanceof` 基于原型链真实查找。
6. **为什么 `instanceof` 跨 iframe 失败？** 每个 iframe 有独立的 `Array` 构造器，原型链上的 `Array.prototype` 也是不同对象，`===` 比较失败。替代方案是 `Array.isArray` 或 `Object.prototype.toString.call(x)`。
7. **如何实现 `Symbol.hasInstance` 自定义 instanceof 行为？** 在类上定义静态方法 `[Symbol.hasInstance](obj)`，`obj instanceof Cls` 时会调用它，返回值就是 instanceof 的结果。
