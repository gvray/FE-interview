---
sidebar_position: 10
---
# 手写函数柯里化

> 柯里化（curry）是把一个接受多参数的函数转成一系列接受单参数的函数的过程。它来自 Haskell Curry 的命名，是函数式编程最常用的转换之一。本文实现固定参数版与占位符版，并对比与偏应用（partial application）的区别。

## 题目描述

实现 `curry(fn)`：

1. 调用 `curried(a)(b)(c)` 等价于 `fn(a, b, c)`。
2. 也支持 `curried(a, b)(c)`、`curried(a)(b, c)`、`curried(a, b, c)` 等任意参数切分。
3. 当累计参数个数达到 `fn.length` 时执行 `fn`，否则继续返回柯里化函数。

进阶版要求支持**占位符**（`_`）：

```js
const f = curry(fn);
f(_, 2)(1)(3);     // 等价于 fn(1, 2, 3)
f(1, _, 3)(2);     // 同上
```

## 思路分析

### 固定参数版

核心：递归收集参数。用一个内部函数 `curried` 接收当前批次参数：

- 检查已收集的参数总数 `>= fn.length` → 执行 `fn`。
- 否则返回一个新函数继续收集下一批参数。

注意几个细节：

- `fn.length` 是函数声明中第一个有默认值之前的形参数量，是柯里化终止条件。`...args` 剩余参数不计入。
- 用 `...args` 接收多参数，避免一次只接一个的硬限制。
- `this` 绑定：柯里化后的函数调用时 `this` 应能传递给原函数。简单实现用普通 `function` 让 `this` 自动绑定，内部 `fn.apply(this, collected)` 即可。

### 占位符版

占位符表示「这个位置参数待填」。需要在每次调用时：

1. 把新参数填进旧参数列表中已有的占位符位置。
2. 剩余的新参数追加到末尾。
3. 判断：**所有位置都没有占位符 且 参数总数 >= fn.length** 时执行。

实现要点：用一个数组 `collected` 保存当前已收集的参数，`_` 表示空槽。新一批参数到来时，先填空槽、剩余的 push 到末尾。

## 完整实现

### 固定参数版

```js
function curry(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('curry expects a function');
  }
  const arity = fn.length;

  function curried(...args) {
    // 累计参数达到原函数形参数量，直接执行
    if (args.length >= arity) {
      return fn.apply(this, args);
    }
    // 否则返回一个继续收集的函数
    return function (...rest) {
      return curried.apply(this, [...args, ...rest]);
    };
  }

  return curried;
}
```

### 占位符版

```js
curry.placeholder = Symbol('placeholder');

function curryWithPlaceholder(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('curry expects a function');
  }
  const arity = fn.length;
  const _ = curryWithPlaceholder.placeholder = curryWithPlaceholder.placeholder || Symbol('placeholder');

  function collect(collected, args) {
    // 把新参数填入 collected，遇到占位符先填空槽
    const next = collected.slice();
    let i = 0;

    // 1. 先填已有空槽
    for (let slot = 0; slot < next.length && i < args.length; slot++) {
      if (next[slot] === _) {
        next[slot] = args[i++];
      }
    }
    // 2. 剩余参数追加到末尾
    while (i < args.length) {
      next.push(args[i++]);
    }

    // 3. 判断是否满足执行条件
    const stillHasPlaceholder = next.some((v) => v === _);
    const filled = next.filter((v) => v !== _);
    if (!stillHasPlaceholder && filled.length >= arity) {
      return fn.apply(this, next.slice(0, arity));
    }
    // 还差参数或仍有占位符：返回继续收集的函数
    return function (...rest) {
      return collect.call(this, next, rest);
    };
  }

  function curried(...args) {
    return collect.call(this, [], args);
  }

  return curried;
}

// 简化对外暴露，方便测试
const _ = (curryWithPlaceholder.placeholder = Symbol('placeholder'));
```

## 边界与测试用例

```js
// 1. 固定参数版：基本等价性
const sum3 = (a, b, c) => a + b + c;
const cs = curry(sum3);
console.log('case1 a', cs(1)(2)(3));     // 6
console.log('case1 b', cs(1, 2)(3));     // 6
console.log('case1 c', cs(1)(2, 3));     // 6
console.log('case1 d', cs(1, 2, 3));     // 6

// 2. 少参数时返回函数
console.log('case2', typeof cs(1));      // 'function'

// 3. 多于原参数：忽略多余（与原函数行为一致）
console.log('case3', cs(1, 2, 3, 4, 5)); // 6（多余参数被原函数忽略）

// 4. this 绑定
const obj = {
  factor: 10,
  mul(a, b) { return this.factor * a * b; },
};
const cmul = curry(obj.mul);
console.log('case4', cmul.call(obj, 2)(3)); // 60

// 5. 占位符版：先填后补
const cps = curryWithPlaceholder(sum3);
console.log('case5 a', cps(_, 2, 3)(1));         // 6
console.log('case5 b', cps(_, _, 3)(1, 2));      // 6
console.log('case5 c', cps(1, _, 3)(2));         // 6
console.log('case5 d', cps(_, 2)(1)(3));         // 6
console.log('case5 e', cps(_, 2)(_, 3)(1));     // 6

// 6. 占位符版也支持无占位符
console.log('case6', cps(1, 2, 3));              // 6
console.log('case6 b', cps(1)(2)(3));           // 6

// 7. fn.length 为 0 的边界
const noArgs = () => 'noop';
const c0 = curry(noArgs);
console.log('case7', c0()); // 'noop'

// 8. 形参有默认值时 fn.length 行为
function withDefault(a, b = 2) { return [a, b]; }
console.log('case8 length', withDefault.length); // 1
const cd = curry(withDefault);
console.log('case8', cd(1)); // [1, 2]，因为 fn.length=1，已满足

// 9. 剩余参数不计入 fn.length
function variadic(a, ...rest) { return [a, rest]; }
console.log('case9 length', variadic.length); // 1
const cv = curry(variadic);
console.log('case9', cv(1)); // [1, []]

// 10. 错误参数类型
try {
  curry(123);
} catch (e) {
  console.log('case10', e.constructor.name); // TypeError
}
```

注意以下细节：

- `fn.length` 是「第一个有默认值的参数之前」的形参数量；剩余参数 `...rest` 不计入。当原函数有默认值或剩余参数时，柯里化提前终止。
- 多于 `fn.length` 的参数会传递给原函数，原函数自己决定是否使用（剩余参数会收集）。
- 占位符版必须同时满足「无未填占位符」与「有效参数个数 >= arity」两个条件才执行，否则继续返回柯里化函数。
- 占位符用 Symbol 而非字符串，避免与真实参数冲突。
- `this` 绑定：用普通 `function` + `apply`，让柯里化函数被作为方法调用时 `this` 能透传给原函数。

## 与偏应用（partial application）的区别

| 维度 | 柯里化 | 偏应用 |
| --- | --- | --- |
| 形态 | 多次单参数函数链 | 一次返回剩余参数函数 |
| 输出 | `f(a)(b)(c)` | `g = partial(f, a); g(b, c)` |
| 参数切分 | 任意位置切 | 通常固定一次 |
| 终止条件 | 累计达 `fn.length` | 调用时立即执行 |
| 嵌套深度 | 由 arity 决定 | 通常一层 |

偏应用的简单实现：

```js
function partial(fn, ...presetArgs) {
  return function (...laterArgs) {
    return fn.apply(this, [...presetArgs, ...laterArgs]);
  };
}
const add = (a, b, c) => a + b + c;
const add10 = partial(add, 10);
console.log(add10(1, 2)); // 13
```

要点：偏应用只切一刀，柯里化可切任意刀。带占位符的偏应用本质上更接近「参数模板」，但仍只切一次。

## 进阶追问

1. **`fn.length` 是什么？** 函数显式声明中、第一个有默认值之前的形参数量；剩余参数不计入。柯里化通常以它作为终止条件，遇到默认值 / `...rest` 要小心。
2. **柯里化的性能影响？** 每次调用产生新闭包，深链路下 GC 压力大。性能敏感场景不要无脑柯里化，可以在编译期用 Babel / TS 内联优化，或用 `Function.prototype.bind` 简化。
3. **lodash 的 `_.curry` 与手写版有何差别？** lodash 默认带占位符（`_.curry.placeholder`），且支持显式 `curry(fn, arity)` 指定终止参数量，处理了 `...rest` 等边界。
4. **如何实现「自动判断 arity」？** 默认用 `fn.length`，但如果函数有默认值或剩余参数，可以提供 `curry(fn, arity)` 让用户显式指定。
5. **柯里化的典型应用？** 参数复用（`add(1)(2)(3)` 复用 1）、延迟执行（凑齐再算）、函数组合（`pipe(f, g, h)` 把单参函数串起来）、配置生成（`createRequest('/api/v1')('/users')`）。
6. **为什么占位符要用 Symbol？** 字符串占位符（如 lodash 用 `__` 对象）容易与业务参数冲突；Symbol 全局唯一，类型判断 `===` 更稳。
7. **如何支持「函数本身也是占位符」？** 让 `curry.placeholder` 暴露为可替换的常量，用户可以自定义占位符，但每次调用都用同一个对象做引用比较。
8. **`Function.prototype.bind` 与柯里化的关系？** `bind` 既是偏应用也是 `this` 绑定：`fn.bind(ctx, a)` 等价于「固定 this 和 a 的偏应用」。它不能像柯里化那样再分刀切，只切一次。
