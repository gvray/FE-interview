---
sidebar_position: 6
---
# 手写发布订阅 / EventEmitter

> 发布订阅是前端最常见的解耦模式：组件通信、Node 的 `events` 模块、Vue 的 `$emit/$on`、消息总线都基于它。本文实现一个功能完备的 `EventEmitter`，包括 `on/once/emit/off/removeAllListeners`，再扩展命名空间与通配符匹配。

## 题目描述

实现 `EventEmitter`，满足：

1. `on(event, listener)` 注册监听，返回自身以支持链式。
2. `once(event, listener)` 注册一次性监听，触发后自动移除。
3. `emit(event, ...args)` 同步触发，按注册顺序调用监听器，返回是否有监听。
4. `off(event, listener)` 移除指定监听。
5. `removeAllListeners(event?)` 移除某事件或全部监听。
6. `listenerCount(event)` 统计监听器数量。
7. 进阶：支持命名空间（如 `ns:event`）和通配符（`*` / `ns:*` / `*:event`）。

## 思路分析

核心数据结构是一个 `Map<eventName, listener[]>`。要点：

- **同事件多监听**：数组保存，`emit` 时遍历调用；遍历前拷贝一份，避免监听器内部 `off` 时索引错乱。
- **`once` 实现**：包装一个 wrapper，执行后调 `off(event, wrapper)` 自我移除。注意要保存原始 listener 引用，方便外部 `off(event, originalListener)` 也能移除。
- **`off` 去重**：默认只移除第一个匹配项，与 Node 的 `EventEmitter.off` 一致。
- **错误隔离**：单个监听器抛错不应中断其他监听器，可加 `try/catch` 与 `error` 事件（Node 行为是抛出，这里作为可选项）。
- **通配符**：把 `*` 视为分隔符级别的占位符，常见写法 `order:created`、`order:*`、`*:created`、`*`。匹配时对每个已注册的 pattern 做分词比对。

## 完整实现

### 基础版（含 once / off / removeAllListeners）

```js
class EventEmitter {
  constructor() {
    // 用对象而不是 Map，方便和通配符扩展一起用
    this._events = Object.create(null);
  }

  _getListeners(event) {
    if (!this._events[event]) this._events[event] = [];
    return this._events[event];
  }

  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }
    this._getListeners(event).push(listener);
    return this;
  }

  once(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }
    const wrapper = (...args) => {
      // 先移除再调用，避免 listener 内部再 emit 同事件导致重复触发
      this.off(event, wrapper);
      return listener.apply(this, args);
    };
    // 保留原始引用，让外部 off(originalListener) 也能移除
    wrapper._origin = listener;
    this.on(event, wrapper);
    return this;
  }

  emit(event, ...args) {
    const list = this._events[event];
    if (!list || list.length === 0) return false;
    // 拷贝一份：遍历过程中可能有人 off/on，避免索引错乱
    const snapshot = list.slice();
    for (let i = 0; i < snapshot.length; i++) {
      // 单个监听器出错不影响后续，但抛错让调用方感知
      try {
        snapshot[i].apply(this, args);
      } catch (err) {
        // Node 的行为是抛 'error' 事件或直接抛出
        if (event !== 'error') {
          this.emit('error', err);
        } else {
          throw err;
        }
      }
    }
    return true;
  }

  off(event, listener) {
    if (!this._events[event]) return this;
    if (!listener) {
      // 不传 listener：清空该事件全部监听
      this._events[event] = [];
      return this;
    }
    const list = this._events[event];
    // 倒序遍历，方便删除
    for (let i = list.length - 1; i >= 0; i--) {
      const fn = list[i];
      // 同时支持移除 once 包装过的监听器
      if (fn === listener || fn._origin === listener) {
        list.splice(i, 1);
        break; // Node 行为：只移除第一个匹配
      }
    }
    return this;
  }

  removeAllListeners(event) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
    } else if (this._events[event]) {
      delete this._events[event];
    }
    return this;
  }

  listenerCount(event) {
    const list = this._events[event];
    return list ? list.length : 0;
  }
}
```

### 进阶版：命名空间 + 通配符

约定事件名用 `:` 分隔层级，如 `user:login`。支持 `*` 匹配单层、`**` 匹配多层（类似 glob）。

```js
class WildcardEmitter extends EventEmitter {
  constructor() {
    super();
    this._delimiter = ':';
  }

  // 把事件名或 pattern 拆成段
  _split(name) {
    return typeof name === 'string' ? name.split(this._delimiter) : [name];
  }

  // 判断实际事件是否匹配 pattern
  _match(segments, pattern) {
    const ps = this._split(pattern);
    let i = 0,
      j = 0;
    while (i < segments.length) {
      const seg = ps[j];
      if (seg === '**') {
        // 匹配到结尾
        if (j === ps.length - 1) return true;
        // 尝试在剩余 segments 中找下一个匹配位置
        const next = ps[j + 1];
        while (i < segments.length && segments[i] !== next) i++;
        j++;
        continue;
      }
      if (seg === '*' || seg === segments[i]) {
        i++;
        j++;
        continue;
      }
      return false;
    }
    // pattern 是否已经消费完（剩余只能是 ** 之类）
    while (j < ps.length && ps[j] === '**') j++;
    return j === ps.length;
  }

  emit(event, ...args) {
    const segments = this._split(event);
    let fired = false;
    // 遍历所有 pattern，找到匹配项并触发
    for (const pattern of Object.keys(this._events)) {
      if (pattern === 'error' && event !== 'error') continue;
      if (pattern.includes('*') || pattern.includes('**')) {
        if (!this._match(segments, pattern)) continue;
      } else if (pattern !== event) {
        continue;
      }
      const list = this._events[pattern];
      if (list && list.length) {
        const snapshot = list.slice();
        for (const fn of snapshot) {
          try {
            fn.apply(this, args);
            fired = true;
          } catch (err) {
            if (event !== 'error') this.emit('error', err);
            else throw err;
          }
        }
      }
    }
    return fired;
  }
}
```

## 边界与测试用例

```js
// 1. 基础 on / emit
const bus = new EventEmitter();
let called = 0;
bus.on('click', () => called++);
bus.emit('click');
bus.emit('click');
console.log('case1', called); // 2

// 2. 多监听器按注册顺序执行
const order = [];
bus.on('ev', () => order.push(1));
bus.on('ev', () => order.push(2));
bus.emit('ev');
console.log('case2', order); // [1, 2]

// 3. once 只触发一次
let times = 0;
bus.once('start', () => times++);
bus.emit('start');
bus.emit('start');
console.log('case3', times); // 1

// 4. off 移除指定监听
const cb = () => order.push(99);
bus.on('x', cb);
bus.off('x', cb);
bus.emit('x');
console.log('case4 last item', order[order.length - 1]); // 不是 99

// 5. off 也能移除 once 注册的监听（用原始引用）
let onceCount = 0;
const original = () => onceCount++;
bus.once('y', original);
bus.off('y', original);
bus.emit('y');
console.log('case5', onceCount); // 0

// 6. emit 不存在的 event 返回 false
console.log('case6', bus.emit('nope')); // false

// 7. 遍历中 off 不影响本次回调
const temp = [];
bus.on('z', function a() {
  temp.push('a');
  bus.off('z', a);
});
bus.on('z', () => temp.push('b'));
bus.emit('z');
bus.emit('z');
console.log('case7', temp); // ['a', 'b', 'b']

// 8. 通配符匹配
const wb = new WildcardEmitter();
const logs = [];
wb.on('user:login', () => logs.push('login'));
wb.on('user:*', () => logs.push('user-wildcard'));
wb.on('*:login', () => logs.push('login-wildcard'));
wb.on('**', () => logs.push('global'));
wb.emit('user:login', { id: 1 });
console.log('case8', logs);
// ['login', 'user-wildcard', 'login-wildcard', 'global']

// 9. 多层通配符
wb.on('order:**', () => logs.push('order-recursive'));
wb.emit('order:created:paid');
console.log('case9 has', logs.includes('order-recursive')); // true

// 10. removeAllListeners
bus.removeAllListeners('ev');
console.log('case10', bus.listenerCount('ev')); // 0
```

注意以下边界：

- `emit` 时必须拷贝数组（`slice()`）再遍历，否则监听器中 `off` 会让后续索引错位。
- `off` 必须支持用原始 listener 引用移除 `once` 包装的监听器，否则 `once` 注册后无法取消。
- `error` 事件没有监听器时应抛出（Node 行为），避免错误被吞掉。
- 通配符匹配要兼容多段路径，`*` 只匹配单段、`**` 匹配多段，类比 shell glob。
- `removeAllListeners()` 不传参应清空所有事件，传参只清空指定事件。

## 进阶追问

1. **为什么 `emit` 要 `slice` 后再遍历？** 防止监听器在执行中调用 `off` / `removeAllListeners` 改变数组长度，导致跳过或重复执行后续监听器。
2. **`once` 为什么要先 `off` 再执行 listener？** 如果 listener 内部又 `emit` 同名事件，先移除可以避免递归触发死循环；执行顺序上先 `off` 也不影响 listener 拿到正确参数。
3. **如何做异步 `emit`（返回 Promise，等待所有监听器完成）？** `emitAsync` 返回 `Promise.all(list.map(fn => fn(...args)))`，要求 listener 返回 Promise。
4. **如何做最大监听器数限制？** 像 Node 的 `setMaxListeners`，超过阈值打 warning，防止内存泄漏。
5. **如何实现事件拦截 / 中断后续？** 让 listener 返回特殊值（如 `EventEmitter.STOP`）或抛 `StopPropagationError`，遍历中检测到就 break。
6. **`removeAllListeners` 传 `event` 与不传的区别？** 不传清空整个 `_events`，传则只清该事件；不传参容易误伤其他模块注册的监听器，谨慎使用。
7. **与 Observable / RxJS 的区别？** EventEmitter 是 push-based 的多播；Observable 是冷启动可订阅的流，支持背压、操作符组合，能力更强但概念更重。
