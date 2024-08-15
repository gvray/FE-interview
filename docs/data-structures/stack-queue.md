---
sidebar_position: 3
---
# 栈与队列

栈与队列是操作受限的线性表——栈只允许一端进出（LIFO），队列一端进另一端出（FIFO）。这种「限制」反而是优势，让它们成为撤销栈、BFS、括号匹配等场景的首选。前端实际场景包括函数调用栈、路由 history、消息队列等。

## 定义与基本性质

| 结构 | 操作规则     | 进出端             | 典型应用                         |
| ---- | ------------ | ------------------ | -------------------------------- |
| 栈   | LIFO 后进先出 | 同一端（栈顶）     | 函数调用、撤销/重做、表达式求值  |
| 队列 | FIFO 先进先出 | 一端入队一端出队   | BFS、任务调度、消息管道          |
| 双端队列 | 两端均可进出 | 两端              | 滑动窗口最大值、前端 history     |
| 优先队列 | 按优先级出队 | 入队任意，出队取最大 | Dijkstra、合并 K 个有序链表     |

## JS 实现

### 基于数组

最简单：`Array.prototype.push / pop` 即栈，`push / shift` 即队列。

```ts
// 栈
class Stack<T> {
  private data: T[] = [];
  push(v: T) { this.data.push(v); }
  pop(): T | undefined { return this.data.pop(); }
  peek(): T | undefined { return this.data.at(-1); }
  get size() { return this.data.length; }
  get empty() { return this.data.length === 0; }
}

// 简单队列（基于数组，shift 是 O(n)，仅用于小数据量）
class SimpleQueue<T> {
  private data: T[] = [];
  enqueue(v: T) { this.data.push(v); }
  dequeue(): T | undefined { return this.data.shift(); }
  get size() { return this.data.length; }
}
```

> 注意：基于数组的 `shift()` 是 O(n)，高吞吐队列必须用对象指针法或双栈实现。

### 基于对象的高效队列

```ts
class Queue<T> {
  private data: Record<number, T> = {};
  private head = 0;
  private tail = 0;
  enqueue(v: T): void {
    this.data[this.tail++] = v;
  }
  dequeue(): T | undefined {
    if (this.head === this.tail) return undefined;
    const v = this.data[this.head];
    delete this.data[this.head++];
    return v;
  }
  get size() { return this.tail - this.head; }
  get empty() { return this.head === this.tail; }
}
```

### 基于链表

链表实现天然 O(1) 入队出队，且能扩展为双端队列。

```ts
class Node<T> { constructor(public val: T, public next: Node<T> | null = null) {} }

class LinkedQueue<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;
  private size = 0;

  enqueue(v: T): void {
    const node = new Node(v);
    if (!this.tail) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.size++;
  }

  dequeue(): T | undefined {
    if (!this.head) return undefined;
    const v = this.head.val;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this.size--;
    return v;
  }
}
```

## 应用一：括号匹配

栈的经典题：遇到左括号入栈，遇到右括号匹配栈顶。

```ts
function isValid(s: string): boolean {
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const stack: string[] = [];
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}
```

## 应用二：用栈实现队列（LeetCode 232）

两个栈：一个入队栈 `in`，一个出队栈 `out`。`out` 空时把 `in` 全部倒入 `out`，均摊 O(1)。

```ts
class MyQueue {
  private in: number[] = [];
  private out: number[] = [];

  push(x: number): void {
    this.in.push(x);
  }

  pop(): number | undefined {
    this.shiftIfNeeded();
    return this.out.pop();
  }

  peek(): number | undefined {
    this.shiftIfNeeded();
    return this.out.at(-1);
  }

  private shiftIfNeeded(): void {
    if (this.out.length === 0) {
      while (this.in.length) this.out.push(this.in.pop()!);
    }
  }

  get empty() { return this.in.length === 0 && this.out.length === 0; }
}
```

## 应用三：单调栈

栈内元素保持单调（递增或递减），常用于「下一个更大/更小元素」类问题。

```ts
// 每日温度：求下一个更高温度距今天还有几天
function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const res = new Array<number>(n).fill(0);
  const stack: number[] = []; // 存索引，对应温度单调递减
  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[stack.at(-1)!] < temperatures[i]) {
      const prev = stack.pop()!;
      res[prev] = i - prev;
    }
    stack.push(i);
  }
  return res;
}
```

经典题：下一个更大元素 I/II、柱状图中最大矩形、接雨水（单调栈解法）。

## 应用四：滑动窗口最大值（双端队列）

单调双端队列：队列存「可能成为最大值」的索引，队首是当前窗口最大。

```ts
function maxSlidingWindow(nums: number[], k: number): number[] {
  const res: number[] = [];
  const deque: number[] = []; // 存索引，对应值单调递减
  for (let i = 0; i < nums.length; i++) {
    // 1. 移出超出窗口的队首
    while (deque.length && deque[0] <= i - k) deque.shift();
    // 2. 维护单调递减：把比当前值小的队尾弹出
    while (deque.length && nums[deque.at(-1)!] <= nums[i]) deque.pop();
    deque.push(i);
    // 3. 窗口形成后开始记录
    if (i >= k - 1) res.push(nums[deque[0]]);
  }
  return res;
}
```

## 应用五：函数调用栈

JS 引擎就是用栈管理执行上下文：每调用一个函数就压入一个栈帧，返回时弹出。这也是「栈溢出」的根源——递归太深。

```js
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}
fib(10000); // RangeError: Maximum call stack size exceeded
```

> 尾递归优化在 ES6 严格模式下才生效，且 JS 引擎实际几乎不优化，深递归需改迭代。

## 应用六：表达式求值

中缀转后缀、后缀求值都用栈。

```ts
// 后缀表达式求值
function evalRPN(tokens: string[]): number {
  const stack: number[] = [];
  const ops: Record<string, (a: number, b: number) => number> = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => Math.trunc(a / b),
  };
  for (const t of tokens) {
    if (ops[t]) {
      const b = stack.pop()!;
      const a = stack.pop()!;
      stack.push(ops[t](a, b));
    } else {
      stack.push(Number(t));
    }
  }
  return stack[0];
}
```

## 复杂度对比

| 操作        | 数组栈 | 链表栈 | 数组队列(shift) | 高效队列 |
| ----------- | ------ | ------ | --------------- | -------- |
| push/enqueue | O(1)  | O(1)   | O(1)            | O(1)     |
| pop/dequeue  | O(1)  | O(1)   | O(n)            | O(1)     |
| peek        | O(1)  | O(1)   | O(1)            | O(1)     |
| 空间        | O(n)  | O(n)   | O(n)            | O(n)     |

## 小结

- 栈 = LIFO，队列 = FIFO；用数组实现简单，用链表实现更稳。
- JS 数组 `shift` 是 O(n)，高吞吐场景务必用对象指针法或双栈队列。
- 单调栈解决「下一个更大元素」类问题；单调双端队列解决「滑动窗口极值」。
- 函数调用栈、表达式求值、BFS 是栈与队列的三大经典战场。
