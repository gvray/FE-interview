---
sidebar_position: 3
---
# 手写 Promise（含 then/catch/finally + all/race/allSettled/any）

> 这是前端面试中频率最高的手写题之一。一个完整的 Promise 实现需要理解状态机、发布订阅、微任务调度以及链式调用穿透。本文从最简版本一步步演进到贴近 Promise/A+ 的实现，并补齐常用静态方法。

## 题目描述

请实现一个 `MyPromise`，满足以下要求：

1. 拥有 `pending / fulfilled / rejected` 三种状态，状态只能从 `pending` 转换一次。
2. 实例方法：`then / catch / finally`，支持链式调用，支持值穿透。
3. 静态方法：`resolve / reject / all / race / allSettled / any`。
4. `then` 的回调需在微任务中执行。

## 思路分析

整体可以拆成三块来理解：

- **状态机**：用一个字段 `state` 持有当前状态，`value` / `reason` 持有终值。`resolve` / `reject` 只允许在 `pending` 时变更一次。
- **发布订阅**：在 `pending` 阶段调用 `then` 注册的回调不能立即执行，要存进两个队列（`onFulfilledCallbacks` / `onRejectedCallbacks`）。等状态敲定时依次弹出。
- **链式调用**：`then` 必须返回一个新的 `MyPromise`。新 `MyPromise` 的终值由当前 `then` 回调的返回值决定：
  - 回调返回普通值 → 新 Promise `fulfilled` 该值；
  - 回调返回一个 `thenable` / `MyPromise` → 采用其状态和终值；
  - 回调抛错 → 新 Promise `rejected` 该错误。
- **微任务调度**：浏览器没有公开的微任务 API，通常用 `queueMicrotask`，兼容写法回退到 `Promise.resolve().then(fn)` 或 `MutationObserver`。这里直接使用 `queueMicrotask`，更贴近规范语义。

## 完整实现

```js
// 三种状态常量
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// 工具：保证回调在微任务中执行
const runMicrotask = typeof queueMicrotask === 'function'
  ? queueMicrotask
  : (cb) => Promise.resolve().then(cb);

// 解析 then 回调的返回值 x，决定下一个 promise 的状态
function resolvePromise(promise2, x, resolve, reject) {
  // 1. 不能返回自身，否则死循环
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<MyPromise>'));
  }

  // 2. 如果是 MyPromise 实例，采用其状态
  if (x instanceof MyPromise) {
    if (x.state === PENDING) {
      x.then(
        (v) => resolvePromise(promise2, v, resolve, reject),
        (r) => reject(r)
      );
    } else if (x.state === FULFILLED) {
      resolve(x.value);
    } else {
      reject(x.reason);
    }
    return;
  }

  // 3. 如果是 thenable 对象（鸭子类型兼容）
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let then;
    try {
      then = x.then;
    } catch (err) {
      // 取 then 抛错，直接 reject
      return reject(err);
    }

    if (typeof then === 'function') {
      // 防止重复调用
      let called = false;
      try {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            // 递归解析，支持 thenable 嵌套
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (err) {
        if (called) return;
        called = true;
        reject(err);
      }
    } else {
      // 普通对象，直接 fulfilled
      resolve(x);
    }
  } else {
    // 基础类型，直接 fulfilled
    resolve(x);
  }
}

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state !== PENDING) return;
      this.state = FULFILLED;
      this.value = value;
      this.onFulfilledCallbacks.forEach((fn) => fn());
    };

    const reject = (reason) => {
      if (this.state !== PENDING) return;
      this.state = REJECTED;
      this.reason = reason;
      this.onRejectedCallbacks.forEach((fn) => fn());
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    // 值穿透：非函数时把值/原因往后传
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (r) => {
            throw r;
          };

    const promise2 = new MyPromise((resolve, reject) => {
      const handleFulfilled = () => {
        runMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      };

      const handleRejected = () => {
        runMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      };

      if (this.state === FULFILLED) {
        handleFulfilled();
      } else if (this.state === REJECTED) {
        handleRejected();
      } else {
        // pending 时存入队列，等待 resolve/reject 触发
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });

    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (value) => MyPromise.resolve(typeof onFinally === 'function' ? onFinally() : undefined).then(
        () => value
      ),
      (reason) =>
        MyPromise.resolve(typeof onFinally === 'function' ? onFinally() : undefined).then(
          () => {
            throw reason;
          }
        )
    );
  }

  // ---------- 静态方法 ----------
  static resolve(value) {
    // 已经是 MyPromise 直接返回
    if (value instanceof MyPromise) return value;
    // thenable 转换
    if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
      const then = value.then;
      if (typeof then === 'function') {
        return new MyPromise((resolve, reject) => {
          then.call(value, resolve, reject);
        });
      }
    }
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const arr = Array.from(promises);
      const result = new Array(arr.length);
      let count = 0;
      if (arr.length === 0) return resolve(result);
      arr.forEach((p, i) => {
        MyPromise.resolve(p).then(
          (v) => {
            result[i] = v;
            if (++count === arr.length) resolve(result);
          },
          (r) => reject(r)
        );
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      const arr = Array.from(promises);
      arr.forEach((p) => {
        MyPromise.resolve(p).then(resolve, reject);
      });
    });
  }

  static allSettled(promises) {
    return new MyPromise((resolve) => {
      const arr = Array.from(promises);
      const result = new Array(arr.length);
      let count = 0;
      if (arr.length === 0) return resolve(result);
      arr.forEach((p, i) => {
        MyPromise.resolve(p).then(
          (v) => {
            result[i] = { status: 'fulfilled', value: v };
            if (++count === arr.length) resolve(result);
          },
          (r) => {
            result[i] = { status: 'rejected', reason: r };
            if (++count === arr.length) resolve(result);
          }
        );
      });
    });
  }

  static any(promises) {
    return new MyPromise((resolve, reject) => {
      const arr = Array.from(promises);
      const errors = new Array(arr.length);
      let count = 0;
      if (arr.length === 0) {
        return reject(new AggregateError([], 'All promises were rejected'));
      }
      arr.forEach((p, i) => {
        MyPromise.resolve(p).then(
          (v) => resolve(v),
          (r) => {
            errors[i] = r;
            if (++count === arr.length) {
              reject(new AggregateError(errors, 'All promises were rejected'));
            }
          }
        );
      });
    });
  }
}
```

## 边界与测试用例

```js
// 1. 基本状态流转
const p1 = new MyPromise((resolve) => {
  setTimeout(() => resolve(1), 100);
});
p1.then((v) => console.log('case1', v)); // 100ms 后输出 1

// 2. 链式调用 + 异步返回值穿透
new MyPromise((resolve) => resolve(1))
  .then((v) => v + 1)
  .then((v) => new MyPromise((r) => r(v * 10)))
  .then((v) => console.log('case2', v)); // 20

// 3. 错误冒泡到 catch
new MyPromise((_, reject) => reject('err'))
  .then((v) => console.log('不会执行', v))
  .catch((e) => console.log('case3', e)); // err

// 4. finally 不吞掉原值，且其返回值不影响链
new MyPromise((r) => r(42))
  .finally(() => console.log('case4 finally'))
  .then((v) => console.log('case4', v)); // 42

// 5. all：其中一个失败整体失败
MyPromise.all([MyPromise.resolve(1), MyPromise.resolve(2)]).then((v) =>
  console.log('case5', v)
); // [1, 2]

// 6. allSettled：保留每个结果
MyPromise.allSettled([
  MyPromise.resolve(1),
  MyPromise.reject('x'),
]).then((v) => console.log('case6', v));
// [{status:'fulfilled',value:1},{status:'rejected',reason:'x'}]

// 7. race：第一个落定者决定结果
MyPromise.race([
  new MyPromise((r) => setTimeout(() => r('slow'), 100)),
  MyPromise.resolve('fast'),
]).then((v) => console.log('case7', v)); // fast

// 8. any：第一个 fulfilled 胜出，全失败才 reject
MyPromise.any([
  MyPromise.reject('a'),
  MyPromise.resolve('b'),
]).then((v) => console.log('case8', v)); // b

// 9. 值穿透：onFulfilled 不是函数时，值应透传
MyPromise.resolve(7)
  .then()
  .then((v) => console.log('case9', v)); // 7

// 10. 循环引用检测
const p = new MyPromise((r) => r(1));
const bad = p.then(() => bad);
bad.catch((e) => console.log('case10', e.constructor.name)); // TypeError
```

需要特别留意的几个边界：

- `resolve` / `reject` 必须只生效一次，第二次调用直接忽略。
- `then` 回调必须是**异步**执行（微任务），不能同步触发，否则会让依赖顺序的代码出错。
- 链式调用中如果 `then` 回调返回的是当前 `then` 返回的新 Promise 自身，要抛 `TypeError`。
- `all` 接收空数组应直接 `resolve([])`；`race` 接收空数组则永远 `pending`（与原生一致）。
- `any` 全部 reject 时返回 `AggregateError`，注意老环境 polyfill。

## 进阶追问

1. **为什么 `then` 要放进微任务而不是宏任务？** 微任务在当前同步代码执行完后、下一次事件循环前执行，时序更可控；宏任务会延迟到下一轮，导致 `then` 链路顺序与原生不一致。
2. **`then` 回调里 `return this` 会怎样？** 会触发 `promise2 === x` 检测，抛 `TypeError`，避免无限递归。
3. **如何兼容 Promise/A+ 规范的 thenable？** 用 `x.then` 鸭子类型判断 + `called` 标志位防止 thenable 重复 resolve/reject，符合规范的 2.3.3 节。
4. **`finally` 为什么要 `Promise.resolve(onFinally())` 再 `then`？** 因为 `onFinally` 可能返回 Promise，需等其落定后再恢复原值/原因，保证异步行为一致。
5. **手写 Promise 的 executor 同步抛错会怎样？** 必须 `try/catch` 包裹 executor，捕获后调用 `reject`，否则会同步向上抛错破坏链式调用。
6. **多次调用 `then` 的回调顺序？** 同一个 Promise 上多次 `then` 注册的回调按注册顺序依次执行（规范要求 FIFO）。
