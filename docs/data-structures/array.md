---
sidebar_position: 1
---
# 数组

数组是面试中出场率最高的数据结构。它看似简单——下标访问、长度可变——但背后隐藏了「JS 数组本质」「动态扩容」「双指针优化」等多个高频考点。本节从底层实现讲到算法技巧，帮你建立完整知识图谱。

## JS 数组的本质

很多语言（C/Java）的数组是一段连续的内存，元素类型固定，长度固定。但 JS 的 `Array` 并非如此：

- **本质是对象**：JS 数组在规范层面是「带额外 `length` 属性的对象」，键是字符串形式的下标（`'0'`、`'1'`…）。引擎（V8）会做优化，连续整数下标时使用真正的连续数组（COW / Fast Elements），一旦下标跳跃或类型混合就可能退化成字典模式（Slow Elements）。
- **长度动态**：`push` / `pop` / `splice` 都会自动调整 `length`，无需手动管理容量。
- **元素异构**：同一数组可存放任意类型，因为存储的是引用而非定长二进制。
- **稀疏数组**：直接给 `arr[100] = 1` 而 `arr.length` 之前未填充，中间会出现 `empty` 槽，遍历行为与 `undefined` 不同。

```js
const a = [];
a[3] = 'x';
console.log(a);          // [ <3 empty items>, 'x' ]
console.log(a.length);   // 4
a.forEach(v => console.log(v)); // 只输出 'x'，跳过空槽
a.map(v => v + 1);       // [ <3 empty items>, 'x1' ]，保留空槽
a.filter(() => true);    // [ 'x' ]，filter 隐式过滤空槽
```

> 面试提示：可以用 `Array.from({length: n})` 或 `Array(n).fill(0)` 构造全 `undefined` / `0` 的稠密数组，避免稀疏带来的坑。

## 动态数组与扩容思想

虽然 JS 屏蔽了扩容细节，但理解「动态数组」思想对分析复杂度至关重要：

- 底层维护一段连续内存与一个容量 `capacity`。
- 当元素数 `size === capacity` 时申请新空间（通常 `2 * capacity`），将旧元素逐个拷贝过去，释放旧空间。
- 单次 `push` 看似 O(1)，但触发扩容时是 O(n)。**均摊（amortized）** 后仍为 O(1)。

```ts
class DynamicArray<T> {
  private data: (T | undefined)[];
  private size = 0;
  private capacity = 4;

  constructor() {
    this.data = new Array(this.capacity);
  }

  push(val: T): void {
    if (this.size === this.capacity) this.resize();
    this.data[this.size++] = val;
  }

  private resize(): void {
    this.capacity *= 2;
    const next = new Array(this.capacity);
    for (let i = 0; i < this.size; i++) next[i] = this.data[i];
    this.data = next;
  }

  get(i: number): T | undefined {
    if (i < 0 || i >= this.size) return undefined;
    return this.data[i];
  }

  pop(): T | undefined {
    if (this.size === 0) return undefined;
    const v = this.data[--this.size];
    this.data[this.size] = undefined; // 释放引用
    return v;
  }

  get length() {
    return this.size;
  }
}
```

**为什么 2 倍扩容？** 平衡「扩容次数少」与「空间浪费可控」。Java ArrayList 是 1.5 倍，Go slice 是 2 倍（小数组时平滑过渡），各语言取舍不同。

## 常见操作复杂度

| 操作                     | 时间复杂度   | 说明                              |
| ------------------------ | ------------ | --------------------------------- |
| `arr[i]` / `arr[i] = v`  | O(1)         | 随机访问                          |
| `push` / `pop`           | O(1) 均摊    | 尾部操作                          |
| `unshift` / `shift`      | O(n)         | 头部操作需整体平移                |
| `splice(i, 0, v)`        | O(n)         | 中间插入需移动后续元素            |
| `indexOf` / `includes`   | O(n)         | 线性查找                          |
| `sort`                   | O(n log n)   | V8 TimSort，传比较器避免默认字典序 |
| `slice` / `concat`       | O(n)         | 拷贝生成新数组                    |

> 面试高频陷阱：**循环里频繁 `unshift` 或 `splice` 会退化到 O(n²)**，需要时可用倒序遍历、额外数组、双指针倒写等技巧替代。

## 双指针技巧

数组的核心优势是 O(1) 随机访问，配合「双指针」可以解决大量问题，空间 O(1)。

### 对撞指针

从两端向中间走，常用于有序数组。

```ts
// 两数之和（有序数组）
function twoSumSorted(nums: number[], target: number): number[] {
  let l = 0, r = nums.length - 1;
  while (l < r) {
    const sum = nums[l] + nums[r];
    if (sum === target) return [l, r];
    sum < target ? l++ : r--;
  }
  return [];
}
```

经典题：盛最多水的容器、三数之和（排序后对撞）、反转字符串、回文判定。

### 快慢指针

同向不同速，常用于原地修改。

```ts
// 移除等于 val 的元素，返回新长度，原地操作
function removeElement(nums: number[], val: number): number {
  let slow = 0;
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== val) nums[slow++] = nums[fast];
  }
  return slow;
}

// 删除有序数组中的重复项，返回去重后长度
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;
  let slow = 1;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[fast - 1]) nums[slow++] = nums[fast];
  }
  return slow;
}
```

### 滑动窗口

左右指针共同维护一个窗口，根据条件扩张或收缩，常用于子串、子数组问题。

```ts
// 无重复字符的最长子串长度
function lengthOfLongestSubstring(s: string): number {
  const last = new Map<string, number>();
  let l = 0, max = 0;
  for (let r = 0; r < s.length; r++) {
    const prev = last.get(s[r]);
    if (prev !== undefined && prev >= l) l = prev + 1;
    last.set(s[r], r);
    max = Math.max(max, r - l + 1);
  }
  return max;
}
```

## 前缀和与差分

数组的另一类「预计算」技巧，把区间查询降到 O(1)。

```ts
// 前缀和：O(1) 求任意区间和
class PrefixSum {
  private prefix: number[];
  constructor(nums: number[]) {
    this.prefix = [0];
    for (const n of nums) this.prefix.push(this.prefix.at(-1)! + n);
  }
  // 闭区间 [l, r] 的和
  sumRange(l: number, r: number): number {
    return this.prefix[r + 1] - this.prefix[l];
  }
}

// 差分：O(1) 区间加，最后 O(n) 还原
function diffExample(n: number, updates: [number, number, number][]): number[] {
  const diff = new Array(n + 1).fill(0);
  for (const [l, r, v] of updates) {
    diff[l] += v;
    diff[r + 1] -= v;
  }
  const res: number[] = [];
  let cur = 0;
  for (let i = 0; i < n; i++) {
    cur += diff[i];
    res.push(cur);
  }
  return res;
}
```

## 面试常见追问

1. **`Array(n)` 与 `Array.from({length:n})` 区别？** 前者创建空槽数组（forEach 跳过），后者创建 `undefined` 数组（forEach 处理）。
2. **为什么 `typeof []` 是 `'object'`？** JS 数组本质是对象；`Array.isArray([])` 才是可靠的判定方式。
3. **如何高效反转数组？** 原地双指针交换；注意 JS `Array.prototype.reverse` 会改变原数组并返回引用。
4. **数组 vs 链表如何选？** 高频读、低频插删 → 数组；高频插删、低频随机访问 → 链表。
5. **`arr.length = 0` 能清空数组吗？** 能，且会释放元素引用；但若外部持有同一数组引用，仍会影响其看到的值。

## 小结

- JS 数组是「带 length 的对象」，引擎会优化但存在稀疏陷阱。
- 动态数组扩容分摊 O(1)，理解其机制能解释很多复杂度结论。
- 数组操作复杂度表务必背熟：头部操作 O(n)，尾部操作 O(1)。
- 双指针（对撞、快慢、滑动窗口）与前缀和/差分是数组题的四大法宝。
