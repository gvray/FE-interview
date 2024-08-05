---
sidebar_position: 6
---

# 动态规划入门

动态规划（Dynamic Programming，DP）是面试中最具区分度的算法题型。它不像排序/二分有现成模板，而是考察"建模能力"——能否把问题拆成子问题、定义状态、写出转移方程。掌握 DP 的标志不是背题，而是看到新题能想出状态定义。

## 三个核心概念

### 1. 重叠子问题

递归解法会反复求解相同的子问题。比如斐波那契 `fib(5)` 会计算 `fib(3)` 两次、`fib(2)` 三次。DP 通过**记忆化**或**制表**避免重复计算，把指数级降为多项式级。

### 2. 最优子结构

问题的最优解包含子问题的最优解。比如最短路径 `A → C` 经过 B，则 `A → B` 必须是最短路径。这是 DP 成立的前提。
**反例**：求最长简单路径（不能重复经过节点）不具有最优子结构——子问题的最优可能引入冲突。

### 3. 无后效性

"未来与过去无关"：当前状态确定后，未来决策只依赖当前状态值，不依赖到达该状态的路径。这是状态能被压缩的前提。若不满足，需把路径信息编入状态。

## 两种实现方式

### 记忆化搜索（Top-Down，自顶向下）

从原问题出发递归求解，第一次算出的子问题结果存入缓存，后续直接读。

```ts
function fibMemo(n: number): number {
  const memo = new Map<number, number>();
  return helper(n);

  function helper(n: number): number {
    if (n <= 1) return n;
    if (memo.has(n)) return memo.get(n)!;
    const r = helper(n - 1) + helper(n - 2);
    memo.set(n, r);
    return r;
  }
}
```

### 制表法（Bottom-Up，自底向上）

从最小子问题开始迭代填表，最终得到原问题答案。

```ts
function fib(n: number): number {
  if (n <= 1) return n;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// 空间优化：只依赖前两个状态
function fibOpt(n: number): number {
  if (n <= 1) return n;
  let prev = 0, cur = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + cur;
    prev = cur;
    cur = next;
  }
  return cur;
}
```

| 维度 | 记忆化 | 制表法 |
| --- | --- | --- |
| 思路 | 自顶向下递归 | 自底向上迭代 |
| 子问题 | 只算用到的 | 可能算多余的 |
| 空间 | 递归栈 O(n) | O(n) 或优化到 O(1) |
| 实现 | 直觉自然 | 需确定计算顺序 |
| 风险 | 递归过深栈溢出 | 通常更快 |

> 工程上优先用制表法（无栈溢出、常数小）。但思考时往往先用记忆化理清思路，再改成迭代。

## DP 解题四步法

1. **定义状态**：`dp[i]` 或 `dp[i][j]` 表示什么？通常是"考虑前 i 个/到位置 i 时的最优值"。
2. **写出转移方程**：`dp[i]` 如何由更小的子问题得到？枚举最后一步的选择。
3. **确定初始条件和边界**：`dp[0]`、`dp[1]` 的值，空数组/越界处理。
4. **确定计算顺序**：依赖关系决定从大到小还是从小到大，二维时通常从左到右、从上到下。

## 经典题：爬楼梯（LC 70）

每次能爬 1 或 2 阶，爬到第 n 阶有多少种方法？

- **状态**：`dp[i]` = 爬到第 i 阶的方法数
- **转移**：`dp[i] = dp[i-1] + dp[i-2]`（最后一步爬 1 或 2）
- **初始**：`dp[0] = 1, dp[1] = 1`

```ts
function climbStairs(n: number): number {
  if (n <= 2) return n;
  let prev = 1, cur = 2;
  for (let i = 3; i <= n; i++) {
    const next = prev + cur;
    prev = cur;
    cur = next;
  }
  return cur;
}
```

时间 O(n)，空间 O(1)。本质就是斐波那契。

## 经典题：0-1 背包（LC 416 等价分割子集）

有 n 个物品，重量 `w[i]`，背包容量 W，每个物品**最多选一次**，求能装的最大重量（或是否能装满）。

- **状态**：`dp[i][j]` = 考虑前 i 个物品、容量为 j 时的最大价值/可行性
- **转移**：第 i 个物品选或不选
  - 不选：`dp[i][j] = dp[i-1][j]`
  - 选（前提 `j >= w[i]`）：`dp[i][j] = dp[i-1][j-w[i]] + v[i]`
  - 取 max
- **初始**：`dp[0][0] = 0`

```ts
// 0-1 背包：求最大价值
function knapsack01(W: number, w: number[], v: number[]): number {
  const n = w.length;
  // 一维优化：j 从大到小遍历，保证每个物品只用一次
  const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = W; j >= w[i]; j--) {
      dp[j] = Math.max(dp[j], dp[j - w[i]] + v[i]);
    }
  }
  return dp[W];
}

// 等价分割子集（LC 416）：能否分成和相等的两份 = 能否选若干物品装满 sum/2
function canPartition(nums: number[]): boolean {
  const sum = nums.reduce((a, b) => a + b, 0);
  if (sum % 2 !== 0) return false;
  const W = sum >> 1;
  const dp = new Array(W + 1).fill(false);
  dp[0] = true;
  for (const x of nums) {
    for (let j = W; j >= x; j--) {
      dp[j] = dp[j] || dp[j - x];
    }
  }
  return dp[W];
}
```

> **一维滚动数组的关键**：0-1 背包内层 j **从大到小**遍历，否则同一物品会被多次使用（变成完全背包）。完全背包（每种物品无限个）则 j **从小到大**遍历。

## 经典题：完全背包（LC 322 零钱兑换）

每种硬币无限个，求凑成 amount 的最少硬币数。

- **状态**：`dp[j]` = 凑成金额 j 的最少硬币数
- **转移**：`dp[j] = min(dp[j - coin] + 1)`，遍历每种 coin
- **初始**：`dp[0] = 0`，其余 `Infinity`

```ts
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

时间 O(amount * coins.length)，空间 O(amount)。

## 经典题：最长公共子序列（LC 1143）

求两个字符串的最长公共子序列（不要求连续）。

- **状态**：`dp[i][j]` = `s1[0..i-1]` 与 `s2[0..j-1]` 的 LCS 长度
- **转移**：
  - 若 `s1[i-1] === s2[j-1]`：`dp[i][j] = dp[i-1][j-1] + 1`
  - 否则：`dp[i][j] = max(dp[i-1][j], dp[i][j-1])`
- **初始**：`dp[0][*] = dp[*][0] = 0`

```ts
function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length, n = text2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}
```

> 区分：最长公共**子串**（连续）要求 `s1[i-1] === s2[j-1]` 时 `dp[i][j] = dp[i-1][j-1] + 1`，否则 `dp[i][j] = 0`，并维护全局 max。这是常见易混淆点。

## 经典题：最长递增子序列（LC 300）

求数组的最长严格递增子序列长度。

**O(n²) DP 解法**：

- **状态**：`dp[i]` = 以 `nums[i]` 结尾的 LIS 长度
- **转移**：`dp[i] = max(dp[j] + 1)` for all `j < i` 且 `nums[j] < nums[i]`
- **初始**：`dp[i] = 1`

```ts
function lengthOfLIS(nums: number[]): number {
  const n = nums.length;
  const dp = new Array(n).fill(1);
  let ans = 1;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
    ans = Math.max(ans, dp[i]);
  }
  return ans;
}
```

**O(n log n) 二分 + 贪心解法**：维护一个单调递增数组 `tails`，对每个 num 用二分找第一个 >= num 的位置替换，扩展 LIS。

```ts
function lengthOfLIS_NLogN(nums: number[]): number {
  const tails: number[] = [];
  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = lo + ((hi - lo) >> 1);
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    if (lo === tails.length) tails.push(x);
    else tails[lo] = x;
  }
  return tails.length;
}
```

> `tails` 不是真正的 LIS，长度才正确。要还原序列需额外记录前驱。

## 经典题：编辑距离（LC 72）

把 word1 变成 word2 的最少操作数（插入/删除/替换）。

- **状态**：`dp[i][j]` = `word1[0..i-1]` 变成 `word2[0..j-1]` 的最少操作数
- **转移**：
  - 若 `word1[i-1] === word2[j-1]`：`dp[i][j] = dp[i-1][j-1]`（无需操作）
  - 否则：
    - 插入：`dp[i][j-1] + 1`
    - 删除：`dp[i-1][j] + 1`
    - 替换：`dp[i-1][j-1] + 1`
  - 取三者 min
- **初始**：`dp[i][0] = i`（删 i 次），`dp[0][j] = j`（插 j 次）

```ts
function minDistance(word1: string, word2: string): number {
  const m = word1.length, n = word2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}
```

时间 O(mn)，空间 O(mn)，可滚动数组优化到 O(min(m,n))。

## DP 分类与典型题

| 类型 | 典型题 | 状态定义 |
| --- | --- | --- |
| 一维线性 | 爬楼梯、打家劫舍、单词拆分 | `dp[i]` 表示前 i 个的最优 |
| 二维网格 | 最小路径和、不同路径 | `dp[i][j]` 表示到 (i,j) 的最优 |
| 双串 LCS | 最长公共子序列、编辑距离 | `dp[i][j]` 表示两串前缀的关系 |
| 区间 DP | 戳气球、最长回文子串 | `dp[i][j]` 表示区间 [i,j] 的最优 |
| 背包 DP | 0-1/完全背包、分割等和子集 | `dp[j]` 表示容量 j 的最优 |
| 状态压缩 | 旅行商、N 皇后 II | `dp[mask][i]`，mask 为位掩码 |
| 树形 DP | 打家劫舍 III、二叉树最大路径和 | `dp[node]` 表示以 node 为根的最优 |
| 股票系列 | 买卖股票系列 | `dp[i][k][0/1]` 表示第 i 天、剩 k 次、是否持有 |

## 空间优化技巧

1. **滚动数组**：若 `dp[i]` 只依赖 `dp[i-1]` 和 `dp[i-2]`，用两个变量替代整个数组。
2. **一维降维**：二维背包若依赖关系允许，可降为一维，注意遍历方向（0-1 从大到小，完全从小到大）。
3. **状态数压缩**：如股票问题，"持有/不持有"只需两个变量滚动。

## 常见坑

1. **状态定义模糊**：`dp[i]` 是"以 i 结尾"还是"前 i 个"？前者用于 LIS、最大子段和；后者用于爬楼梯、打家劫舍。务必想清。
2. **初始条件遗漏**：`dp[0]` 在"以 i 结尾"语义下通常是 1（空也算一种）或 0。
3. **转移遗漏选项**：背包要枚举选/不选，股票要枚举买/卖/不动。
4. **遍历顺序错误**：依赖 `dp[i-1][j-1]` 时若用一维从小到大，会用到本层刚更新的值（错）；必须从大到小。
5. **混淆子序列与子串**：子序列可断、子串必须连续，转移方程不同。
6. **无后效性破坏**：若当前状态依赖历史路径，需把路径编入状态（如带限制的路径计数）。

## 与贪心、分治的区别

- **与贪心**：贪心每步选当前最优不回头，DP 枚举所有选择取最优。贪心是 DP 的特例（当最优子结构 + 贪心选择性质成立时）。
- **与分治**：分治的子问题独立无重叠，DP 的子问题有重叠。归并排序是分治（无重叠），斐波那契是 DP（重叠）。

## 经典题目清单

- 入门：LC 70 爬楼梯、LC 509 斐波那契、LC 1137 泰波那契
- 一维：LC 198/213 打家劫舍、LC 213 打家劫舍 II、LC 53 最大子数组和、LC 300 LIS、LC 674 最长连续递增序列
- 二维：LC 62/63 不同路径、LC 64 最小路径和、LC 5 最长回文子串、LC 647 回文子串
- 双串：LC 1143 LCS、LC 72 编辑距离、LC 583 两个字符串的删除操作
- 背包：LC 416 分割等和子集、LC 494 目标和、LC 322 零钱兑换、LC 518 零钱兑换 II、LC 474 一和零
- 股票：LC 121/122/123/188/309/714 系列六题
- 状态压缩：LC 691 贴纸拼词、LC 943 最短超串
- 树形：LC 337 打家劫舍 III、LC 124 二叉树最大路径和
- 区间：LC 312 戳气球、LC 516 最长回文子序列

> 面试技巧：拿到题先问自己三个问题——"最优解/方案数？"、"能拆成子问题吗？"、"子问题有重叠吗？"。三个都满足就是 DP。然后花 5 分钟把状态定义和转移方程写在纸上，再写代码。状态定义想清楚，代码自然就出来。
