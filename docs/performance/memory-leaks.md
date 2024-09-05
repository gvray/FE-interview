---
sidebar_position: 6
---

# 内存与内存泄漏

内存泄漏是前端最隐蔽的问题之一：它不会立刻报错，而是让页面在长时间运行后越来越卡、越来越占内存，最终崩溃。理解 JS 内存模型与 V8 垃圾回收机制，能在面试中讲清"为什么会泄漏""如何排查"，是中高级前端必备能力，对重度交互的 SPA、富文本编辑器、可视化大屏项目尤其重要。

## JS 内存模型

JavaScript 的内存空间大致分为三类：

| 区域 | 存放内容 | 大小 | 回收方式 |
| --- | --- | --- | --- |
| **栈（Stack）** | 基本类型值（`number`、`string`、`boolean`、`null`、`undefined`、`symbol`）、引用地址 | 小、固定 | 自动随执行上下文弹出 |
| **堆（Heap）** | 对象、数组、函数等引用类型 | 大、动态 | GC 管理 |
| **常量池 / 代码段** | 字符串常量、编译后的字节码 | — | — |

```js
// 基本类型：值本身在栈里
let a = 10;
let b = a;        // 复制值
b = 20;
console.log(a);  // 10

// 引用类型：引用在栈，对象在堆
let obj1 = { x: 1 };
let obj2 = obj1; // 复制引用，指向同一个堆对象
obj2.x = 2;
console.log(obj1.x); // 2
```

## V8 垃圾回收

V8（Chrome/Node 的 JS 引擎）采用**分代回收**策略，把堆分为新生代与老生代，分别用不同算法。

### 新生代（Young Generation）

- **存放**：刚创建的对象
- **大小**：较小（通常 1–8 MB）
- **算法**：**Scavenge（半空间复制）**

Scavenge 把堆分为两个半空间（From / To）：

```
1. 新对象分配在 From 空间
2. GC 时，遍历 From 中的存活对象，复制到 To 空间（紧凑排列）
3. 清空 From
4. From 与 To 角色互换
```

**特点**：

- 速度快，适合"朝生夕死"的短命对象
- 牺牲空间换时间（一半空间闲置）
- 存活过一次 GC 的对象晋升到老生代

### 老生代（Old Generation）

- **存放**：存活时间较长、晋升过来的对象
- **大小**：较大（数百 MB 甚至 GB）
- **算法**：**标记-清除（Mark-Sweep）+ 标记-整理（Mark-Compact）**

**Mark-Sweep（标记清除）**：

1. 从根（GC Root）出发，递归遍历所有可达对象，标记为"存活"
2. 清除未被标记的对象（不可达）

**Mark-Compact（标记整理）**：

- Mark-Sweep 会产生内存碎片
- Mark-Compact 在清除时把存活对象移动到一端，整理出连续空闲空间

### 新生代与老生代的差异

| 维度 | 新生代 | 老生代 |
| --- | --- | --- |
| 大小 | 小（MB） | 大（GB） |
| 算法 | Scavenge | Mark-Sweep + Mark-Compact |
| 速度 | 快 | 较慢 |
| 频率 | 高 | 低 |
| 暂停 | 短 | 较长（增量、并发优化） |

### V8 的优化技术

- **增量标记（Incremental Marking）**：把长 GC 拆成多次小步，与 JS 交替执行，减少卡顿
- **并发标记（Concurrent Marking）**：标记阶段在辅助线程执行，不阻塞主线程
- **Orinoco**：V8 现代 GC 的总称，目标是把全停顿（Stop-The-World）降到最低

### GC Root

GC 从"根"出发判断可达性。前端的 GC Root 主要包括：

- 全局对象（`window` / `globalThis`）
- 当前执行栈中的局部变量
- 闭包引用的变量
- DOM 树中的节点（被引用的）
- 定时器回调引用的变量

**只要对象被 GC Root 直接或间接引用，就不会被回收**——这是内存泄漏的根本原因。

## 什么是内存泄漏

内存泄漏指的是：**程序不再需要使用的内存，因为没有正确释放而持续占用**。在 JS 这种 GC 语言里，泄漏通常不是"忘记 free"，而是"**意外保持了引用**，让 GC 误以为对象还在用"。

### JS 内存泄漏 vs C/C++ 内存泄漏

| 语言 | 泄漏类型 | 典型原因 |
| --- | --- | --- |
| C/C++ | 忘记 `free` | 显式管理失败 |
| JS | 引用未解除 | 闭包、定时器、监听器持有引用 |

## 常见内存泄漏场景

### 1. 意外的全局变量

```js
function foo() {
  // 忘了 let/const/var，bar 泄漏到全局
  bar = 'this leaks';
  this.baz = 'also leaks';   // 在非严格模式下，this 指向 window
}
foo();
```

**修复**：使用 `strict mode`：

```js
'use strict';
// 严格模式下未声明变量会报错
```

### 2. 被遗忘的定时器

```js
// 定时器持有闭包引用，组件销毁后未清除
function startTimer() {
  const hugeData = new Array(1e6).fill('*');
  setInterval(() => {
    console.log(hugeData.length);  // hugeData 被闭包引用，永不释放
  }, 1000);
}
```

**修复**：保存 timer id，在合适时机 `clearInterval`：

```js
let timer;
function startTimer() {
  const hugeData = new Array(1e6).fill('*');
  timer = setInterval(() => {
    console.log(hugeData.length);
  }, 1000);
}
function stopTimer() {
  clearInterval(timer);
}
```

**React 中的正确写法**：

```js
useEffect(() => {
  const id = setInterval(() => {
    setCount((c) => c + 1);
  }, 1000);
  return () => clearInterval(id);  // 卸载时清理
}, []);
```

### 3. 未解绑的事件监听器

```js
// 监听器闭包持有大量数据，组件销毁未移除
function setup() {
  const hugeData = fetchData();
  window.addEventListener('resize', () => {
    console.log(hugeData);  // hugeData 被引用
  });
}
```

**修复**：

- 使用具名函数，便于 `removeEventListener`
- 用 `AbortController` 统一管理多个监听器

```js
// AbortController 一次性移除多个监听
const controller = new AbortController();
window.addEventListener('resize', handler, { signal: controller.signal });
window.addEventListener('scroll', handler, { signal: controller.signal });
// 一次性移除全部
controller.abort();
```

### 4. 脱离 DOM 的引用

```js
// 按钮被从 DOM 移除，但 JS 仍持有引用，无法回收
const button = document.getElementById('btn');
document.body.removeChild(button);
// button 变量仍引用该节点，且节点持有 listener 闭包 → 泄漏
button.addEventListener('click', () => { ... });
```

**修复**：移除 DOM 后置空引用：

```js
button.removeEventListener('click', handler);
document.body.removeChild(button);
button = null;
```

### 5. 闭包持有大对象

```js
function createHandler() {
  const hugeData = new Array(1e6).fill('*');
  return function handler() {
    // 只用了一行 hugeData[0]，但闭包持有整个数组
    console.log(hugeData[0]);
  };
}
const handler = createHandler();
```

**修复**：只保留需要的部分：

```js
function createHandler() {
  const hugeData = new Array(1e6).fill('*');
  const first = hugeData[0];  // 只提取需要的部分
  return function handler() {
    console.log(first);
  };
}
```

### 6. 缓存无界增长

```js
// Map 缓存只增不减，长期运行内存暴涨
const cache = new Map();
function getData(key) {
  if (!cache.has(key)) {
    cache.set(key, fetchExpensive(key));
  }
  return cache.get(key);
}
```

**修复**：使用 `WeakMap`、LRU 缓存或限制大小：

```js
// WeakMap：key 弱引用，key 被回收时 value 自动清理
const cache = new WeakMap();

// LRU：限制大小
class LRUCache {
  constructor(max) { this.max = max; this.cache = new Map(); }
  get(key) {
    if (!this.cache.has(key)) return null;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  put(key, val) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, val);
    if (this.cache.size > this.max) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }
}
```

### 7. WeakMap 与 WeakSet

`WeakMap` 的 key 是弱引用，不阻止 GC。**只要 key 对象本身被回收，对应的 entry 自动消失**，非常适合"为对象附加数据"的场景：

```js
const elementData = new WeakMap();
function bindData(el, data) { elementData.set(el, data); }
// el 从 DOM 移除并失去所有引用后，对应 entry 自动清理
```

### 8. Promise 未取消

长时间未 resolve 的 Promise 可能持有闭包：

```js
function loadSomething() {
  const hugeData = new Array(1e6).fill('*');
  return new Promise((resolve) => {
    setTimeout(() => resolve(hugeData), 60000);
  });
}
// 调用方组件销毁后，Promise 仍在等待，hugeData 泄漏
```

**修复**：用 `AbortController` 让 Promise 可取消：

```js
function loadSomething(signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(result), 60000);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}
```

### 9. 第三方脚本

- 统计脚本、广告 SDK、地图组件常常自己持有 DOM 引用与回调
- 加载后即使从页面移除，仍可能持有引用
- 解决：使用 iframe 隔离、按官方方式销毁实例

## 内存泄漏的症状

- **页面运行时间越长越卡**（FPS 下降）
- **Chrome 任务管理器中标签页内存持续上升**
- **重复某个操作后内存阶梯式增长**
- **`performance.memory.usedJSHeapSize` 持续增长不回落**

## 排查工具

### Chrome DevTools Memory 面板

打开 DevTools → Memory，有三种主要快照类型：

| 工具 | 用途 |
| --- | --- |
| **Heap Snapshot** | 拍快照，对比两个快照的差异 |
| **Allocation instrumentation on timeline** | 实时记录分配，定位分配热点 |
| **Allocation sampling** | 采样记录，开销小、定位大致调用栈 |

### 排查流程（Heap Snapshot 对比法）

1. 打开页面，先执行一次操作让内存稳定
2. 拍第一个快照（Snapshot 1）
3. 执行怀疑会泄漏的操作（如打开/关闭弹窗）
4. 强制 GC（点 Memory 面板上的垃圾桶图标）
5. 拍第二个快照（Snapshot 2）
6. 选择 "Comparison" 视图，对比两个快照的增量
7. 关注"Delta"列正数大、且 Constructor 看起来可疑的对象
8. 查看其 Retainers，找出引用链

### 查看 Retainers

Retainers 显示谁在引用这个对象，沿着引用链向上追溯，可以找到 GC Root，从而定位"谁意外持有了引用"。

```js
// 一个典型 Retainers 链
handler() → closure → hugeData → Array(1000000)
```

### Performance 面板看内存趋势

录制 Performance 时勾选 "Memory"，可以在时间轴上看到 JS Heap、DOM 节点、监听器数量的变化曲线。**健康的曲线是锯齿状（GC 周期回落），不健康的曲线是单调上升**。

### `performance.memory`（Chrome 非标准 API）

```js
setInterval(() => {
  const m = performance.memory;
  console.log({
    used: (m.usedJSHeapSize / 1024 / 1024).toFixed(1) + 'MB',
    total: (m.totalJSHeapSize / 1024 / 1024).toFixed(1) + 'MB',
    limit: (m.jsHeapSizeLimit / 1024 / 1024).toFixed(1) + 'MB',
  });
}, 1000);
```

### Node.js 内存排查

```bash
# 查看进程内存
process.memoryUsage()

# 生成堆快照
node --inspect app.js
# 在 Chrome 中打开 chrome://inspect 连接，使用 Memory 面板

# 使用 heapdump 模块
const heapdump = require('heapdump');
heapdump.writeSnapshot('/tmp/test.heapsnapshot');
```

## 常见泄漏模式速查表

| 模式 | 典型代码 | 修复 |
| --- | --- | --- |
| 全局变量 | `bar = 'leak'` | `use strict` |
| 定时器 | `setInterval` 未清除 | `clearInterval` |
| 事件监听 | `addEventListener` 未移除 | `removeEventListener` / `AbortController` |
| 脱离 DOM | 移除节点后仍引用 | 置 `null` |
| 闭包大对象 | 闭包持有未用大数组 | 只提取需要的部分 |
| 无界缓存 | `Map` 持续增长 | `WeakMap` / LRU |

## 小结

| 知识点 | 关键 |
| --- | --- |
| 内存结构 | 栈存基本类型、堆存引用类型 |
| V8 GC | 新生代 Scavenge / 老生代 Mark-Sweep+Compact |
| 泄漏本质 | 意外持有引用，让对象一直可达 |
| 常见场景 | 定时器、监听器、闭包、脱离 DOM、无界缓存 |
| 排查工具 | Heap Snapshot 对比、Allocation timeline、Retainers |

**面试要点**：能讲清新老生代的回收算法、能说出 3 个以上常见泄漏场景及对应修复方案、能用 Heap Snapshot 的对比法描述排查流程，是回答内存题的标准动作。进阶则能讲出 WeakMap 的弱引用原理、`AbortController` 的现代用法、闭包持有的本质（作用域链中变量未被销毁）。
