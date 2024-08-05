---
sidebar_position: 4
---

# 二分查找

二分查找（Binary Search）是面试中最高频的算法模板之一。它的核心思想是：在**有序**序列上每次将搜索区间减半，从而把查找问题从 O(n) 优化到 O(log n)。看似简单，但边界条件极多，是面试官最爱考的"细节杀手"。

## 适用前提

1. 序列**有序**（单调递增或递减）。如果是旋转数组/分段数组，也需具备"二段性"——即能根据中点判断目标在哪一侧。
2. 支持随机访问（数组）。链表不能 O(1) 取中点，不适合。

## 标准模板（推荐左闭右开 `[lo, hi)`）

为什么推荐左闭右开？区间边界对称、循环条件统一为 `lo < hi`、退出时 `lo === hi` 指向答案，不易写错。

```ts
// 在升序数组中查找 target，返回下标，不存在返回 -1
function binarySearch(nums: number[], target: number): number {
  let lo = 0, hi = nums.length; // [lo, hi)
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1); // 防溢出，等价 Math.floor((lo+hi)/2)
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) lo = mid + 1; // [mid+1, hi)
    else hi = mid; // [lo, mid)
  }
  return -1;
}
```

- 时间：O(log n)
- 空间：O(1)

> 关于 `mid` 计算：
> - `(lo + hi) >> 1` 在大数下可能溢出（JS 数字精度问题），所以用 `lo + ((hi - lo) >> 1)`。
> - `>>>` 无符号右移在 JS 中也能强制转 32 位整数，但对超过 2^32 的索引会出错。
> - `>> 1` 等价于 `Math.floor((lo + hi) / 2)`，向下取整。

## 查找左边界：第一个 >= target

这是面试最爱考的变体。要求返回第一个 `>= target` 的位置（若不存在返回 `nums.length`）。STL 中即 `lower_bound`。

```ts
function lowerBound(nums: number[], target: number): number {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < target) lo = mid + 1; // mid 及左侧都排除
    else hi = mid; // nums[mid] >= target，mid 可能是答案，保留
  }
  return lo; // lo === hi
}
```

**关键点**：当 `nums[mid] >= target` 时，`hi = mid` 而非 `mid - 1`，因为 mid 可能就是答案。

## 查找右边界：最后一个 &lt;= target

返回最后一个 `<= target` 的位置（若不存在返回 -1）。等价于 `upper_bound - 1`。

```ts
function upperBoundMinus1(nums: number[], target: number): number {
  // 找第一个 > target 的位置，再 -1
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] <= target) lo = mid + 1; // mid 及左侧都可能 <=，但 mid 已排除
    else hi = mid;
  }
  return lo - 1; // 最后一个 <= target
}
```

> **记忆法**：
> - 找**左边界**（第一个满足）：`nums[mid] < target` 排除左半，否则保留 mid → `hi = mid`。
> - 找**右边界**（最后一个满足）：`nums[mid] <= target` 排除左半（含 mid）→ `lo = mid + 1`，最后 `lo - 1`。
> - 区别在于 `<` 还是 `<=`，以及最后返回 `lo` 还是 `lo - 1`。

## 查找插入位置（LC 35）

给定排序数组和目标值，返回应插入位置（保持有序）。等价于 `lower_bound`：

```ts
function searchInsert(nums: number[], target: number): number {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
```

## 旋转排序数组（LC 33 / 81）

旋转数组如 `[4,5,6,7,0,1,2]`，整体无序但具有"二段性"：取 mid 后，必有一侧是有序的。判断 target 是否在有序一侧，决定去左还是去右。

```ts
// 无重复元素的旋转数组查找
function search(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1; // 这里用闭区间 [lo, hi]
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    // 左半 [lo..mid] 有序
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // 右半 [mid..hi] 有序
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}
```

- 注意 `nums[lo] <= nums[mid]` 必须带 `=`，否则 `lo === mid` 时会误判。
- **有重复元素**（LC 81）：当 `nums[lo] === nums[mid] === nums[hi]` 时无法判断哪侧有序，只能 `lo++; hi--` 退化。最坏退化为 O(n)。

## 求平方根（LC 69，x 的平方根整数部分）

二分答案的典型应用：在 `[0, x]` 范围内二分查找最大的 `mid` 满足 `mid * mid <= x`。

```ts
function mySqrt(x: number): number {
  let lo = 0, hi = x;
  while (lo < hi) {
    const mid = lo + ((hi - lo + 1) >> 1); // 向上取整，避免死循环
    if (mid * mid <= x) lo = mid; // mid 可能是答案
    else hi = mid - 1;
  }
  return lo;
}
```

> **死循环陷阱**：当 `lo = mid`（保留 mid）时，mid 必须向上取整 `(lo + hi + 1) >> 1`，否则 `lo + 1 === hi` 时 mid = lo，永远 `lo = mid = lo` 死循环。反之 `hi = mid` 时用向下取整即可。

## 二分答案（值域二分）

当题目求"最小的最大值"或"最大的最小值"时，常对答案值域二分，配合 check 函数判断是否可行。模板：

```ts
// 在 [lo, hi] 范围内二分答案，找满足 check 的最小值（或最大值）
function binaryAnswer(lo: number, hi: number, check: (mid: number) => boolean): number {
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (check(mid)) hi = mid; // 找最小满足
    else lo = mid + 1;
  }
  return lo;
}
```

典型题：分割数组的最大值（LC 410）、运送包裹的最低能力（LC 1011）、吃香蕉的最低速度（LC 875）。

## 常见坑总结

1. **循环条件 `lo < hi` 还是 `lo <= hi`？**
   - 左闭右开 `[lo, hi)`：用 `lo < hi`，退出时 `lo === hi`。
   - 左闭右闭 `[lo, hi]`：用 `lo <= hi`，退出时 `lo > hi`。
   - 模板要统一，不要混用。

2. **mid 溢出**：用 `lo + ((hi - lo) >> 1)`，不要写 `(lo + hi) >> 1`（大数溢出风险）。

3. **更新边界**：
   - 排除 mid（mid 不可能是答案）：`lo = mid + 1` 或 `hi = mid - 1`。
   - 保留 mid（mid 可能是答案）：`lo = mid`（mid 向上取整）或 `hi = mid`（mid 向下取整）。

4. **死循环**：`lo = mid` 配向上取整；`hi = mid` 配向下取整。

5. **旋转数组判断有序侧**：必须用 `<=` 包含 `lo === mid` 的情况；有重复时遇 `nums[lo] === nums[mid]` 要特殊处理。

6. **JS 中位运算的精度**：`>>` 把操作数转 32 位有符号整数，对 `> 2^31` 的索引会出错；用 `Math.floor((lo + hi) / 2)` 更安全（虽然数组不会这么大）。

7. **返回值**：找左边界返回 `lo`，找右边界返回 `lo - 1`，找精确值在循环内 `return mid`，退出后返回 `-1`。

## 复杂度

- 时间：每次区间减半，共 O(log n) 次比较。
- 空间：迭代版 O(1)，递归版 O(log n) 递归栈。
- 旋转数组有重复元素时退化到 O(n)。

## 经典题目清单

- LC 704 标准二分
- LC 35 查找插入位置
- LC 34 在排序数组中查找元素的第一个和最后一个位置（左右边界组合）
- LC 33 / 81 搜索旋转排序数组
- LC 153 / 154 寻找旋转排序数组中的最小值
- LC 69 x 的平方根
- LC 367 有效的完全平方数
- LC 410 分割数组的最大值（二分答案）
- LC 875 爱吃香蕉的珂珂（二分答案）

> 面试技巧：写二分时**先把模板写下来**（`while (lo < hi)` + 计算 mid），再根据"排除左半还是右半"填空，最后确认返回 `lo` / `lo - 1` / `-1`。这样能避免 90% 的边界错误。
