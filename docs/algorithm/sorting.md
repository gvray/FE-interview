---
sidebar_position: 3
---

# 排序算法

排序算法是面试中最基础也是最高频的考点之一。它不仅考察对算法本身的理解，还考察对时间/空间复杂度、稳定性、原地排序等概念的掌握。前端面试中常考的排序算法包括：冒泡、选择、插入、快排、归并、堆排序，本文逐一给出 TypeScript 实现、复杂度分析及使用场景。

## 概念铺垫

在开始之前，先明确几个关键概念：

- **时间复杂度**：算法执行所需的基本操作次数随输入规模 n 的增长量级，用大 O 表示。
- **空间复杂度**：算法执行过程中额外占用的内存空间，原地排序（in-place）通常指 O(1) 额外空间。
- **稳定性**：若两个相等元素在排序后相对顺序不变，则称该排序稳定。稳定性在多关键字排序中很重要。
- **原地排序**：是否借助额外的大块空间，原地排序不需要。

## 冒泡排序（Bubble Sort）

**思想**：重复遍历数组，比较相邻元素，若顺序错误则交换。每轮将当前最大元素"冒泡"到末尾。

```ts
function bubbleSort(arr: number[]): number[] {
  const a = arr.slice(); // 不修改原数组
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false; // 优化：若本轮无交换，已有序
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return a;
}
```

- 时间：最好 O(n)（已有序+优化），平均/最坏 O(n²)
- 空间：O(1)
- 稳定

## 选择排序（Selection Sort）

**思想**：每轮在未排序区中选出最小元素，放到已排序区末尾。

```ts
function selectionSort(arr: number[]): number[] {
  const a = arr.slice();
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
  }
  return a;
}
```

- 时间：所有情况都是 O(n²)
- 空间：O(1)
- **不稳定**（交换可能改变相等元素相对顺序，例：`[5a, 5b, 2]` → `[2, 5b, 5a]`）

## 插入排序（Insertion Sort）

**思想**：将每个元素插入到已排序区的合适位置，类似整理扑克牌。

```ts
function insertionSort(arr: number[]): number[] {
  const a = arr.slice();
  for (let i = 1; i < a.length; i++) {
    const cur = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > cur) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = cur;
  }
  return a;
}
```

- 时间：最好 O(n)（已有序），平均/最坏 O(n²)
- 空间：O(1)
- 稳定

> 插入排序在小数据量（n &lt; 16）或近乎有序数据上表现极佳，常被快排/归并作为底层切换的阈值算法（如 V8 的 `Array.prototype.sort` 在小数组上用插入排序）。

## 快速排序（Quick Sort）

**思想**：分治。选取一个基准（pivot），将数组分为小于基准和大于基准两部分，递归排序两部分。

```ts
function quickSort(arr: number[]): number[] {
  const a = arr.slice();
  sort(a, 0, a.length - 1);
  return a;

  function sort(a: number[], lo: number, hi: number): void {
    if (lo >= hi) return;
    const p = partition(a, lo, hi);
    sort(a, lo, p - 1);
    sort(a, p + 1, hi);
  }

  // Lomuto 分区，选最右为 pivot
  function partition(a: number[], lo: number, hi: number): number {
    const pivot = a[hi];
    let i = lo; // i 指向小于 pivot 区的右边界+1
    for (let j = lo; j < hi; j++) {
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    return i;
  }
}
```

- 时间：平均 O(n log n)，最坏 O(n²)（已有序+选端点为 pivot）
- 空间：O(log n)（递归栈），最坏 O(n)
- **不稳定**
- 优化：随机选 pivot、三数取中、对小区间切换插入排序、尾递归优化

> 三路快排（&lt; pivot / = pivot / > pivot）适合有大量重复元素的场景，能把重复元素一次排好，避免重复递归。

## 归并排序（Merge Sort）

**思想**：分治。先递归拆分到单元素，再两两合并为有序序列。

```ts
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr.slice();
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const res: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) res.push(left[i++]);
    else res.push(right[j++]);
  }
  while (i < left.length) res.push(left[i++]);
  while (j < right.length) res.push(right[j++]);
  return res;
}
```

- 时间：所有情况都是 O(n log n)
- 空间：O(n)（需要临时数组）
- 稳定
- 适合链表排序、外部排序（大数据文件分块排序后归并）

## 堆排序（Heap Sort）

**思想**：构建大顶堆，每次将堆顶（最大值）与末尾交换，缩小堆后下沉调整。

```ts
function heapSort(arr: number[]): number[] {
  const a = arr.slice();
  const n = a.length;

  // 1. 建堆：从最后一个非叶子节点开始下沉
  for (let i = (n >> 1) - 1; i >= 0; i--) {
    siftDown(a, i, n);
  }

  // 2. 反复取最大值放末尾
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    siftDown(a, 0, i);
  }
  return a;
}

// 大顶堆下沉
function siftDown(a: number[], i: number, size: number): void {
  while (true) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    let largest = i;
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest === i) break;
    [a[i], a[largest]] = [a[largest], a[i]];
    i = largest;
  }
}
```

- 时间：所有情况都是 O(n log n)
- 空间：O(1)
- **不稳定**

## 复杂度与稳定性对比表

| 算法 | 最好 | 平均 | 最坏 | 空间 | 稳定 | 备注 |
| --- | --- | --- | --- | --- | --- | --- |
| 冒泡 | O(n) | O(n²) | O(n²) | O(1) | ✅ | 加 swapped 优化后最好 O(n) |
| 选择 | O(n²) | O(n²) | O(n²) | O(1) | ❌ | 交换次数少，但比较次数恒定 |
| 插入 | O(n) | O(n²) | O(n²) | O(1) | ✅ | 小数据/近乎有序首选 |
| 快排 | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ | 实际最快，工程首选 |
| 归并 | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ | 稳定且复杂度恒定，适合链表 |
| 堆排 | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ | 原地+稳定 O(n log n)，但常数大 |

## 什么时候用什么

- **小数据量或近乎有序**：插入排序。常数小，且对有序数据接近 O(n)。
- **通用大数据量内排序**：快排。实际工程中平均最快，是 `Array.prototype.sort` 在 V8 中的实现基础（TimSort 实际上是归并+插入的混合）。
- **要求稳定排序**：归并。Java 对象排序、Python 的 `sorted`、JS 的 `Array.prototype.sort`（ES2019 后规范要求稳定）都用稳定排序。
- **内存受限 / 原地要求**：堆排。仅 O(1) 额外空间，且最坏也是 O(n log n)，不像快排有 O(n²) 退化风险。常用于 TopK 问题。
- **大数据外部排序**：归并。文件分块加载、排序、归并。
- **链表排序**：归并。链表不需要随机访问，归并天然适合。
- **海量重复元素**：三路快排。把等于 pivot 的部分一次跳过。

## 面试常考延伸点

1. **TopK 问题**：求前 K 大/小元素，用小/大顶堆（size = K），而不是完整堆排序。复杂度 O(n log K)。
2. **第 K 大**：快排的 partition 思想，期望 O(n)。每次 partition 后只递归含目标的一侧。
3. **荷兰国旗问题**：三路 partition，把数组分成 &lt; pivot / = pivot / > pivot 三段。
4. **合并 K 个有序数组**：用小顶堆，每次取最小，复杂度 O(N log K)，N 为总元素数。
5. **手写 sort 比较函数**：`arr.sort((a, b) => a - b)` 注意默认按字典序排序数字字符串，必须传比较函数。
6. **稳定性意义**：按多个字段排序时，先排次要字段（稳定），再排主字段，可保证主字段相同时次要字段顺序保留。

## 与语言/工程的关系

- **V8 `Array.prototype.sort`**：早期对长度 > 10 用快排，否则插入排序；现使用 **TimSort**（归并+插入），稳定且在已部分有序数据上接近 O(n)。
- **ES2019**：规范明确要求 `sort` 必须稳定，所有主流浏览器现已实现稳定排序。
- **大数据量排序**：在 JS 中操作百万级以上数组时，避免频繁创建临时数组（如归并每次 `slice`），可用索引版本减少内存。

> 面试中如果只让手写一个，**快排**与**归并**最高频；如果追问稳定性或原地，再延伸到堆排、插入。
