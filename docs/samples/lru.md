---
sidebar_position: 9
---
# 手写 LRU 缓存

> LRU（Least Recently Used，最近最少使用）是最常见的缓存淘汰策略。面试中常以 LeetCode 146 为载体考：实现 `get` / `put` 都 O(1) 的结构。本文给出两种实现：基于 `Map` 的精简版（利用 Map 的插入顺序）和基于双向链表 + 哈希表的工业版。

## 题目描述

设计并实现一个 LRU 缓存类 `LRUCache`：

- `LRUCache(capacity)` 构造器，`capacity` 为最大容量。
- `get(key)`：若 `key` 存在，返回值并将其标记为「最近使用」；不存在返回 `-1`。
- `put(key, value)`：写入键值对。若超过容量，淘汰「最久未使用」的项。
- 要求 `get` / `put` 时间复杂度均为 O(1)。

## 思路分析

LRU 的核心是「按访问时间排序」：每次访问把项移到最新位置，容量超限时删掉最旧项。要 O(1) 完成两件事：

- **O(1) 查找**：哈希表。
- **O(1) 移动到最新位置 / 删除最旧项**：双向链表。

双向链表的头部为最旧、尾部为最新（约定俗成，反过来也行）。`get` / `put` 命中时把节点移到尾部；超容时删头部。

**为什么不用数组？** 数组中间删除 / 移动是 O(n)，不满足要求。但 Map 的键按插入顺序遍历 + 重新 `set` 会把键移到末尾，相当于「自带 LRU 顺序」，所以可以用 Map 写出 5 行的精简版。

### 实现一：Map 版

```js
class LRUCache {
  constructor(capacity) {
    if (capacity <= 0) throw new Error('capacity must be positive');
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    // 重新插入，让该 key 移到 Map 末尾（最新位置）
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      // 已存在：先删，再 set 到末尾
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 超容：淘汰 Map 第一个 key（最久未使用）
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }

  // 可选工具：获取当前所有键，从最旧到最新
  toArray() {
    return [...this.cache.entries()];
  }
}
```

### 实现二：双向链表 + 哈希表

工业实现更显式地控制节点顺序，便于扩展 LFU / LRU-K 等变体。

```js
class DLinkedNode {
  constructor(key = 0, value = 0) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    if (capacity <= 0) throw new Error('capacity must be positive');
    this.capacity = capacity;
    this.size = 0;
    this.cache = new Map(); // key -> DLinkedNode

    // 哨兵：head.next 是最旧，tail.prev 是最新
    this.head = new DLinkedNode();
    this.tail = new DLinkedNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 把节点添加到尾部（最新位置）
  _addToTail(node) {
    const last = this.tail.prev;
    last.next = node;
    node.prev = last;
    node.next = this.tail;
    this.tail.prev = node;
  }

  // 从链表中移除节点
  _removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    node.prev = null;
    node.next = null;
  }

  // 把已存在的节点移到尾部
  _moveToTail(node) {
    this._removeNode(node);
    this._addToTail(node);
  }

  // 弹出最旧节点（head.next）
  _popHead() {
    const oldest = this.head.next;
    if (oldest === this.tail) return null;
    this._removeNode(oldest);
    return oldest;
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const node = this.cache.get(key);
    // 命中后移到尾部，标记为最新使用
    this._moveToTail(node);
    return node.value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      // 已存在：更新值并移到尾部
      const node = this.cache.get(key);
      node.value = value;
      this._moveToTail(node);
      return;
    }
    // 新增节点
    const node = new DLinkedNode(key, value);
    this.cache.set(key, node);
    this._addToTail(node);
    this.size++;

    if (this.size > this.capacity) {
      // 淘汰最旧
      const oldest = this._popHead();
      this.cache.delete(oldest.key);
      this.size--;
    }
  }

  toArray() {
    const arr = [];
    let cur = this.head.next;
    while (cur !== this.tail) {
      arr.push([cur.key, cur.value]);
      cur = cur.next;
    }
    return arr; // 从最旧到最新
  }
}
```

## 边界与测试用例

```js
// 1. 基本命中与淘汰
const cache = new LRUCache(2);
cache.put(1, 1); // cache = [1]
cache.put(2, 2); // cache = [1, 2]
console.log('case1 get1', cache.get(1)); // 1，cache = [2, 1]
cache.put(3, 3); // 淘汰 2，cache = [1, 3]
console.log('case1 get2', cache.get(2)); // -1
cache.put(4, 4); // 淘汰 1，cache = [3, 4]
console.log('case1 get1', cache.get(1)); // -1
console.log('case1 get3', cache.get(3)); // 3
console.log('case1 get4', cache.get(4)); // 4

// 2. 同 key 更新不淘汰其他项
const c2 = new LRUCache(2);
c2.put(1, 1);
c2.put(2, 2);
c2.put(1, 10); // 更新 key=1
console.log('case2', c2.get(2)); // 2，没有被淘汰
console.log('case2', c2.get(1)); // 10

// 3. 容量为 1
const c3 = new LRUCache(1);
c3.put('a', 1);
c3.put('b', 2);
console.log('case3', c3.get('a')); // -1
console.log('case3', c3.get('b')); // 2

// 4. get 之后该 key 变最新
const c4 = new LRUCache(2);
c4.put('x', 1);
c4.put('y', 2);
c4.get('x'); // x 变最新
c4.put('z', 3); // 淘汰 y
console.log('case4', c4.get('y')); // -1
console.log('case4', c4.get('x')); // 1

// 5. 验证顺序
const c5 = new LRUCache(3);
c5.put(1, 'a');
c5.put(2, 'b');
c5.put(3, 'c');
c5.get(1); // [2, 3, 1]
c5.put(4, 'd'); // 淘汰 2
console.log('case5', c5.toArray()); // [[3,'c'],[1,'a'],[4,'d']]

// 6. 容量非法抛错
try {
  new LRUCache(0);
} catch (e) {
  console.log('case6', e.message); // capacity must be positive
}
```

边界细节：

- **同 key put 不增容**：已存在的 key 更新值时，不应该让 `size` 增加，也不应该淘汰别的项。
- **get 后顺序变化**：`get` 也算一次访问，必须把节点移到最新位置，否则 LRU 语义不正确。
- **容量为 1**：每次 put 都淘汰旧项，是常见边界用例。
- **哨兵节点**：用 `head` / `tail` 哨兵避免空链表边界判断，链表操作更简单。
- **淘汰时同时删 Map 与链表**：必须同步，否则会内存泄漏 / 数据不一致。

## 应用场景

- **HTTP 接口缓存**：按 URL 缓存最近响应，容量超限淘汰。
- **图片 / 资源缓存**：前端图片池、Node 缓存磁盘读取结果。
- **数据库 buffer pool**：MySQL InnoDB 的 buffer pool 含 LRU 变体。
- **Redis 的 maxmemory-policy=allkeys-lru**：基于近似 LRU 采样淘汰。
- **Vue 的 keep-alive**：内部用 LRU 管理缓存的组件实例（默认 `max=Infinity`，配 `max` 后用 LRU 淘汰）。

## 进阶追问

1. **为什么 Map 重新 `set` 同一个 key 会移到末尾？** 规范规定 Map 的迭代顺序就是 key 的插入顺序，对已存在的 key 重新 `set` 不创建新槽位，但 ES2015+ 的实现会先 `delete` 再 `set`，从而更新位置。这一行为被广泛用于 LRU 精简版。
2. **双向链表 + Map 相比 Map 版有什么优势？** 显式控制节点顺序，便于扩展（LRU-K、LFU、带 TTL 的 LRU、按权重淘汰）。Map 版只适合简单场景。
3. **如何支持 TTL（过期时间）？** 给每个节点加 `expireAt`，`get` 时检查；或者用最小堆按过期时间排序，定时清理。
4. **LRU 与 LFU 的区别？** LRU 看最近访问时间（时间维度），LFU 看访问次数（频率维度）。LFU 容易被历史热点拖累，新数据难以驻留，所以 Redis 4.0 后默认用 LFU。
5. **并发环境下 LRU 怎么处理？** 用锁或单线程串行化（如 Redis 的单线程）。Node 因为单线程事件循环，一般不需要锁；多 worker 时需要共享内存或分布式锁。
6. **怎么实现 O(1) 的「最旧项」淘汰？** 哈希表 + 双向链表：哈希表保证 O(1) 查找节点；双向链表保证 O(1) 移除任意节点（因为能拿到 prev / next 指针）。
7. **linkedHashMap 与 LRU 的关系？** Java 的 `LinkedHashMap` 设 `accessOrder=true` 后访问会自动移到末尾，重写 `removeEldestEntry` 即可作为 LRU。JS 没有等价类，但 Map 实现就是这个思路的等价物。
