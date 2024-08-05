---
sidebar_position: 5
---

# 双指针与滑动窗口

双指针和滑动窗口是面试中最高频的优化技巧之一。它们能把朴素 O(n²) 的解法降到 O(n)，是数组/字符串题的"标配武器"。本文总结三大框架：快慢指针、左右指针、滑动窗口，并给出经典应用。

## 为什么用双指针

当一个朴素解法满足"**两指针同向移动且只前进不后退**"或"**两端向中间收敛**"时，可以利用指针的单调性把双重循环降为一重，时间复杂度从 O(n²) 降到 O(n)。

## 一、快慢指针（同向）

两个指针 `slow` / `fast` 都从起点出发，`fast` 走得快，`slow` 走得慢。常见用途：

- 链表判环、找中点、找倒数第 k 个
- 原地去重（数组/字符串）
- 原地移除元素

### 1. 链表判环（LC 141 / 142）

快指针每次走 2 步，慢指针每次走 1 步。若有环，二者必相遇。

```ts
class ListNode<T = number> {
  val: T;
  next: ListNode<T> | null;
  constructor(val: T, next: ListNode<T> | null = null) {
    this.val = val;
    this.next = next;
  }
}

// 判环：返回是否有环
function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// 找环入口：相遇后让一个指针回到 head，二者同速走，再次相遇即入口
function detectCycle(head: ListNode | null): ListNode | null {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      // 相遇，重置 slow 到 head
      slow = head;
      while (slow !== fast) {
        slow = slow!.next;
        fast = fast!.next;
      }
      return slow;
    }
  }
  return null;
}
```

- 时间 O(n)，空间 O(1)

### 2. 数组原地移除元素（LC 27）

`slow` 指向已处理区末尾，`fast` 扫描，遇到不等于目标值的就复制到 `slow` 位置。

```ts
function removeElement(nums: number[], val: number): number {
  let slow = 0;
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== val) {
      nums[slow++] = nums[fast];
    }
  }
  return slow; // 新长度
}
```

### 3. 有序数组去重（LC 26）

`slow` 指向唯一元素区末尾，`fast` 扫描，遇到与 `nums[slow-1]` 不同的就追加。

```ts
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;
  let slow = 1; // 第一个元素必保留
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow - 1]) {
      nums[slow++] = nums[fast];
    }
  }
  return slow;
}
```

## 二、左右指针（对撞）

两个指针从两端向中间走。适用于有序数组或回文判定。

### 1. 两数之和（有序数组，LC 167）

```ts
function twoSum(sorted: number[], target: number): number[] {
  let lo = 0, hi = sorted.length - 1;
  while (lo < hi) {
    const sum = sorted[lo] + sorted[hi];
    if (sum === target) return [lo + 1, hi + 1]; // 题目要求 1-indexed
    else if (sum < target) lo++;
    else hi--;
  }
  return [];
}
```

- 时间 O(n)，空间 O(1)
- **关键**：数组必须有序。无序数组两数之和（LC 1）只能用哈希表 O(n) 空间。

### 2. 验证回文串（LC 125）

```ts
function isPalindrome(s: string): boolean {
  let lo = 0, hi = s.length - 1;
  while (lo < hi) {
    while (lo < hi && !/[a-zA-Z0-9]/.test(s[lo])) lo++;
    while (lo < hi && !/[a-zA-Z0-9]/.test(s[hi])) hi--;
    if (s[lo].toLowerCase() !== s[hi].toLowerCase()) return false;
    lo++; hi--;
  }
  return true;
}
```

### 3. 反转数组 / 双指针反转字符串（LC 344）

```ts
function reverseString(s: string[]): void {
  let lo = 0, hi = s.length - 1;
  while (lo < hi) {
    [s[lo], s[hi]] = [s[hi], s[lo]];
    lo++; hi--;
  }
}
```

### 4. 盛最多水的容器（LC 11）

宽度由两指针距离决定，高度由较短边决定。每次移动较短边以寻求更高。

```ts
function maxArea(height: number[]): number {
  let lo = 0, hi = height.length - 1;
  let ans = 0;
  while (lo < hi) {
    const h = Math.min(height[lo], height[hi]);
    ans = Math.max(ans, h * (hi - lo));
    if (height[lo] < height[hi]) lo++;
    else hi--;
  }
  return ans;
}
```

## 三、滑动窗口

滑动窗口是双指针的高级形式：维护一个窗口 `[left, right]`，右端扩张、左端收缩，根据窗口内状态判断是否满足条件。适合**子串 / 子数组 / 连续区间**问题。

### 通用模板

```ts
function slidingWindow(s: string): number {
  let left = 0, right = 0;
  const window: Map<string, number> = new Map();
  let ans = 0;

  while (right < s.length) {
    const c = s[right];
    // 1. 右端元素入窗
    window.set(c, (window.get(c) ?? 0) + 1);
    right++;

    // 2. 当窗口不满足条件时收缩左端
    while (windowNeedsShrink(window)) {
      const d = s[left];
      window.set(d, window.get(d)! - 1);
      if (window.get(d) === 0) window.delete(d);
      left++;
    }

    // 3. 更新答案（窗口 [left, right] 满足条件）
    ans = Math.max(ans, right - left);
  }
  return ans;
}

// 占位：判断窗口是否需要收缩
function windowNeedsShrink(m: Map<string, number>): boolean {
  return false; // 视题意而定
}
```

> 三个步骤要记牢：**右端入窗 → 不满足则收缩左端 → 更新答案**。所有滑动窗口题都是这个骨架。

### 1. 无重复字符的最长子串（LC 3）

窗口内不能有重复字符。当某字符计数 > 1 时收缩左端。

```ts
function lengthOfLongestSubstring(s: string): number {
  let left = 0, right = 0, ans = 0;
  const count = new Map<string, number>();
  while (right < s.length) {
    const c = s[right];
    count.set(c, (count.get(c) ?? 0) + 1);
    right++;
    while (count.get(c)! > 1) {
      // 出现重复，收缩
      const d = s[left];
      count.set(d, count.get(d)! - 1);
      left++;
    }
    ans = Math.max(ans, right - left);
  }
  return ans;
}
```

- 时间 O(n)，每个字符进出窗口各一次
- 空间 O(字符集大小)

### 2. 最小覆盖子串（LC 76）

求 s 中包含 t 所有字符的最短子串。窗口扩张到满足条件后，尝试收缩左端找最短。

```ts
function minWindow(s: string, t: string): string {
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  const window = new Map<string, number>();
  let left = 0, right = 0;
  let valid = 0; // 满足字符种类数
  let start = 0, len = Infinity;

  while (right < s.length) {
    const c = s[right];
    window.set(c, (window.get(c) ?? 0) + 1);
    if (need.has(c) && window.get(c) === need.get(c)) valid++;
    right++;

    // 所有字符都满足，开始收缩
    while (valid === need.size) {
      if (right - left < len) {
        start = left;
        len = right - left;
      }
      const d = s[left];
      if (need.has(d) && window.get(d) === need.get(d)) valid--;
      window.set(d, window.get(d)! - 1);
      left++;
    }
  }
  return len === Infinity ? '' : s.slice(start, start + len);
}
```

- 时间 O(|s| + |t|)
- 空间 O(字符集)

### 3. 字符串的排列（LC 567）

判断 s2 是否包含 s1 的排列（即 s1 的某排列是 s2 的子串）。固定窗口大小 = s1.length，比较字符频次。

```ts
function checkInclusion(s1: string, s2: string): boolean {
  if (s1.length > s2.length) return false;
  const need = new Map<string, number>();
  for (const c of s1) need.set(c, (need.get(c) ?? 0) + 1);
  const window = new Map<string, number>();
  let left = 0, right = 0, valid = 0;

  while (right < s2.length) {
    const c = s2[right];
    window.set(c, (window.get(c) ?? 0) + 1);
    if (need.has(c) && window.get(c) === need.get(c)) valid++;
    right++;

    // 窗口大小固定为 s1.length
    if (right - left === s1.length) {
      if (valid === need.size) return true;
      const d = s2[left];
      if (need.has(d) && window.get(d) === need.get(d)) valid--;
      window.set(d, window.get(d)! - 1);
      left++;
    }
  }
  return false;
}
```

## 滑动窗口的两种变体

| 类型 | 窗口大小 | 收缩条件 | 典型题 |
| --- | --- | --- | --- |
| 可变窗口求最大 | 不定 | 不满足时收缩 | LC 3 无重复最长子串 |
| 可变窗口求最小 | 不定 | 满足时收缩 | LC 76 最小覆盖子串 |
| 固定窗口 | 固定 k | 长度到 k 时滑动 | LC 567 字符串排列 |
| 求和 >= target 的最小长度 | 不定 | 满足时收缩 | LC 209 长度最小子数组 |

### 4. 长度最小子数组（LC 209）

求和 >= target 的最短连续子数组。窗口扩张到和满足后收缩。

```ts
function minSubArrayLen(target: number, nums: number[]): number {
  let left = 0, sum = 0, ans = Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      ans = Math.min(ans, right - left + 1);
      sum -= nums[left++];
    }
  }
  return ans === Infinity ? 0 : ans;
}
```

## 复杂度总结

| 框架 | 时间 | 空间 | 适用场景 |
| --- | --- | --- | --- |
| 快慢指针 | O(n) | O(1) | 链表判环/中点、原地修改数组 |
| 左右指针 | O(n) | O(1) | 有序数组两数之和、回文、容器 |
| 滑动窗口 | O(n) | O(字符集) | 子串/子数组连续区间问题 |
| 二维前缀和+滑窗 | O(mn) | O(mn) | 矩阵区域和 |

> 滑动窗口的关键是**窗口内状态的单调性**：右端扩张让状态变大（变"更可能满足"），左端收缩让状态变小（变"更可能不满足"）。找到这个状态量，模板就套上了。

## 常见坑

1. **收缩条件写错**：求最大窗口应在"不满足时收缩"，求最小应在"满足时收缩"。颠倒就错。
2. **更新答案的时机**：在收缩后（求最大）或收缩中（求最小）更新。位置错了答案错。
3. **窗口边界**：`[left, right)` 还是 `[left, right]` 要统一，影响 `right - left` 还是 `right - left + 1`。
4. **无序两数之和不能用双指针**：必须先排序（O(n log n)），如果要求返回原下标则排序后下标丢失，只能用哈希表。
5. **Map vs 数组计数**：字符集 ASCII 用 `new Array(128).fill(0)` 更快；Unicode 字符用 Map。

## 经典题目清单

- 快慢指针：LC 141 / 142 / 287（找重复数）/ 202（快乐数）/ 876（链表中点）
- 左右指针：LC 167 / 11 / 15（三数之和，固定一个数 + 双指针）/ 16 / 977（有序平方数组）
- 滑动窗口：LC 3 / 76 / 209 / 219（存在重复元素 II）/ 567 / 438（找所有字母异位词）/ 239（滑动窗口最大值，配合单调队列）

> 面试技巧：看到"子串/子数组/连续区间" + "最大/最小/最长/最短"，第一反应就是滑动窗口。先写出模板骨架（右扩、左缩、更新答案三步），再填具体的状态量。
