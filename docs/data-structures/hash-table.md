---
sidebar_position: 4
---
# 哈希表

哈希表是面试中「最实用」的数据结构——它把任意键映射到值，平均 O(1) 的查找/插入/删除让大量难题从 O(n²) 降到 O(n)。前端开发中，`Object`、`Map`、`Set`、缓存、依赖收集、去重、计数都依赖哈希表思想。本节从底层原理讲到 LRU 实现。

## 哈希表的工作原理

哈希表 = 哈希函数 + 冲突解决策略。

1. **哈希函数** `hash(key)`：把任意长度的键映射到固定范围的整数（数组下标）。
2. **数组存储**：用 `hash(key) % capacity` 作为下标存值。
3. **冲突处理**：不同键可能映射到同一下标，需要解决方案。

```
key ──hash──> integer ──% capacity──> index ──> bucket
                                                   │
                                  冲突时在此处挂链表或向后探测
```

## 哈希函数

好的哈希函数需要：

- **确定性**：同一 key 每次哈希结果相同。
- **均匀分布**：减少冲突。
- **计算快**：O(1)。
- **雪崩效应**：key 微小变化，hash 大幅变化。

```ts
// 字符串哈希（演示，生产用 crypto / MurmurHash）
function stringHash(str: string, capacity: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0; // 无符号 32 位
  }
  return hash % capacity;
}
```

JS 引擎对 `Object` 键做隐式哈希：键先被转成字符串，再哈希；`Map` 允许任意对象作键，使用更复杂的内部哈希（按引用 + 类型分发）。

## 冲突解决

### 链地址法（Separate Chaining）

每个桶存一个链表（或数组），冲突元素挂到链表后。

```ts
class HashTableChaining<K, V> {
  private buckets: [K, V][][] = [];
  private size = 0;
  private capacity: number;

  constructor(capacity = 16) {
    this.capacity = capacity;
    this.buckets = Array.from({ length: capacity }, () => []);
  }

  private hash(key: K): number {
    const str = typeof key === 'string' ? key : JSON.stringify(key);
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h % this.capacity;
  }

  set(key: K, val: V): void {
    const bucket = this.buckets[this.hash(key)];
    const entry = bucket.find(([k]) => Object.is(k, key));
    if (entry) entry[1] = val;
    else { bucket.push([key, val]); this.size++; }
    if (this.size > this.capacity * 0.75) this.resize();
  }

  get(key: K): V | undefined {
    const entry = this.buckets[this.hash(key)].find(([k]) => Object.is(k, key));
    return entry?.[1];
  }

  delete(key: K): boolean {
    const bucket = this.buckets[this.hash(key)];
    const i = bucket.findIndex(([k]) => Object.is(k, key));
    if (i === -1) return false;
    bucket.splice(i, 1);
    this.size--;
    return true;
  }

  private resize(): void {
    const old = this.buckets;
    this.capacity *= 2;
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this.size = 0;
    for (const bucket of old) for (const [k, v] of bucket) this.set(k, v);
  }
}
```

### 开放寻址法（Open Addressing）

冲突时不挂链表，而是按某种探测规则寻找下一个空槽。

| 探测法               | 公式                              | 特点                             |
| -------------------- | --------------------------------- | -------------------------------- |
| 线性探测             | `(h + i) % capacity`              | 简单，易聚集（clustering）       |
| 二次探测             | `(h + i²) % capacity`             | 缓解聚集，仍可能二次聚集         |
| 双重哈希             | `(h1 + i * h2) % capacity`        | 最均匀，需要两个独立哈希函数     |

```ts
// 线性探测实现（简化版，假定 key 不为 null）
class HashTableOpen<K, V> {
  private keys: (K | null)[];
  private vals: (V | null)[];
  private size = 0;
  private capacity: number;

  constructor(capacity = 16) {
    this.capacity = capacity;
    this.keys = new Array(capacity).fill(null);
    this.vals = new Array(capacity).fill(null);
  }

  private hash(key: K): number {
    const str = String(key);
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h % this.capacity;
  }

  set(key: K, val: V): void {
    let i = this.hash(key);
    while (this.keys[i] !== null && !Object.is(this.keys[i], key)) {
      i = (i + 1) % this.capacity;
    }
    if (this.keys[i] === null) this.size++;
    this.keys[i] = key;
    this.vals[i] = val;
  }

  get(key: K): V | undefined {
    let i = this.hash(key);
    while (this.keys[i] !== null) {
      if (Object.is(this.keys[i], key)) return this.vals[i] ?? undefined;
      i = (i + 1) % this.capacity;
    }
    return undefined;
  }
}
```

> 链地址法实现简单、删除方便，是大多数语言（Java HashMap、JS 引擎早期实现）的选择。开放寻址法缓存友好，Redis dict、Python dict 使用。

## 负载因子与扩容

**负载因子（load factor）** = `元素数 / 桶数`。当超过阈值（链地址法常取 0.75）时触发扩容：容量翻倍，所有元素重新哈希（rehash）。

- 扩容是 O(n)，但分摊后单次操作仍 O(1)。
- 缩容：当负载因子过低（如 0.1）时缩容，避免空间浪费。

## JS 中的哈希结构对比

| 特性            | `Object`        | `Map`              | `Set`            | `WeakMap`         |
| --------------- | --------------- | ------------------ | ---------------- | ----------------- |
| 键类型          | string / Symbol | 任意（含对象）     | 任意（值本身）   | 对象              |
| 键顺序          | 整数键升序在前，其余按插入序 | 按插入序 | 按插入序 | —                 |
| 大小获取        | `Object.keys(o).length` O(n) | `map.size` O(1) | `set.size` O(1) | —       |
| 可枚举          | 是              | 是                 | 是               | 否                |
| 弱引用 GC       | 否              | 否                 | 否               | 是                |
| 序列化 (JSON)   | 支持            | 不支持             | 不支持           | 不支持            |
| 适用场景        | 配置、模型、序列化 | 频繁增删键、键非字符串 | 去重、集合运算 | 对象关联元数据、私有数据 |

```js
// 典型去重
const uniq = [...new Set(arr)];

// Map 维护插入顺序，适合做有序键值
const m = new Map();
m.set('a', 1).set('b', 2);
[...m.keys()]; // ['a', 'b']

// Object 键的坑：数字会按升序排
const o = { 2: 'b', 1: 'a', 10: 'c' };
Object.keys(o); // ['1', '2', '10'] —— 注意是数字升序
```

> 面试高频：能用 Map 就别用 Object 做「键值表」，尤其当键是对象或需要 O(1) 长度时。

## 应用一：两数之和

哈希表把「找另一个数」从 O(n) 降到 O(1)。

```ts
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>(); // val -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need)!, i];
    map.set(nums[i], i);
  }
  return [];
}
```

## 应用二：LRU 缓存（Least Recently Used）

面试经典手写题。需要 O(1) 的 `get` 与 `put`，组合 **哈希表 + 双向链表**：

- 哈希表：key → 链表节点，O(1) 定位。
- 双向链表：按访问时间维护顺序，O(1) 移动到头部、淘汰尾部。

```ts
class LRUNode<K, V> {
  constructor(
    public key: K,
    public val: V,
    public prev: LRUNode<K, V> | null = null,
    public next: LRUNode<K, V> | null = null,
  ) {}
}

class LRUCache<K, V> {
  private map = new Map<K, LRUNode<K, V>>();
  private head = new LRUNode<K, V>(null as any, null as any); // dummy head
  private tail = new LRUNode<K, V>(null as any, null as any); // dummy tail

  constructor(private capacity: number) {
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: K): V | undefined {
    const node = this.map.get(key);
    if (!node) return undefined;
    this.moveToHead(node);
    return node.val;
  }

  put(key: K, val: V): void {
    const node = this.map.get(key);
    if (node) {
      node.val = val;
      this.moveToHead(node);
      return;
    }
    const fresh = new LRUNode(key, val);
    this.map.set(key, fresh);
    this.insertHead(fresh);
    if (this.map.size > this.capacity) {
      const lru = this.tail.prev!;
      this.removeNode(lru);
      this.map.delete(lru.key);
    }
  }

  private moveToHead(node: LRUNode<K, V>): void {
    this.removeNode(node);
    this.insertHead(node);
  }

  private insertHead(node: LRUNode<K, V>): void {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  private removeNode(node: LRUNode<K, V>): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }
}
```

**为什么必须双向链表？** 删除尾部节点时需要拿到 `tail.prev.prev` 来重接，单向链表无法 O(1) 拿到前驱。

## 应用三：LFU 简介

LRU 看时间，LFU（Least Frequently Used）看频率。结构更复杂：哈希表 + 频次双向链表 + 频次索引表。面试中 LFU 出现频率低于 LRU，理解 LRU 后扩展即可。

## 复杂度与陷阱

| 操作            | 平均   | 最坏（全冲突） |
| --------------- | ------ | -------------- |
| 查找            | O(1)   | O(n)           |
| 插入            | O(1)   | O(n)           |
| 删除            | O(1)   | O(n)           |
| 遍历            | O(n)   | O(n)           |

陷阱：

- **哈希碰撞攻击**：构造大量同 hash 的键，让链表退化成 O(n)，DoS 攻击。解决：随机化哈希种子。
- **不要在 for...in 中修改对象**：规范未定义行为，引擎可能不按预期迭代。
- **Map 的对象键不会被 GC**：除非用 `WeakMap`，否则会内存泄漏。

## 小结

- 哈希表 = 哈希函数 + 冲突解决；理解链地址与开放寻址两条路线即可。
- JS 中 `Map`/`Set` 优于 `Object` 做键值存储，`WeakMap` 用于对象关联不阻挡 GC。
- LRU 缓存是哈希表 + 双向链表的组合拳，必须手写熟练。
- 面试见到「计数」「去重」「查找对应关系」三关键词，第一反应：哈希表。
