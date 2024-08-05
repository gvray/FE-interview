---
sidebar_position: 7
---

# 回溯与 BFS/DFS

回溯（Backtracking）、深度优先搜索（DFS）、广度优先搜索（BFS）是图/树/搜索类问题的三大核心范式。它们共享一个本质：**在状态空间里搜索所有可行解或最优解**，差别在于搜索方式与剪枝策略。

## 三者关系

| 范式 | 本质 | 适用场景 | 实现方式 |
| --- | --- | --- | --- |
| 回溯 | DFS + 撤销选择 | 枚举所有排列/组合/子集 | 递归 + 选择/撤销 |
| DFS | 一条路走到底再回头 | 连通性、拓扑、路径 | 递归或栈 |
| BFS | 一层一层向外扩 | 最短路径（无权）、层序 | 队列 |

> 回溯本质就是 DFS，只是强调"做选择 + 撤销选择"这两个动作；DFS 强调遍历方式。回溯常用于解空间是树形（决策树）的问题。

## 一、回溯框架

回溯的核心是"决策树遍历"：在每个节点做出选择，递归深入，然后**撤销选择**回溯到上一层，尝试其他选择。这保证了 path 在递归过程中被复用，不创建新数组。

### 通用模板

```ts
function backtrack(path: number[], choices: number[]): void {
  if (满足结束条件) {
    result.push([...path]); // 注意要拷贝，path 会被后续修改
    return;
  }
  for (const choice of choices) {
    if (不合法) continue; // 剪枝
    path.push(choice);     // 做选择
    backtrack(path, newChoices); // 递归
    path.pop();            // 撤销选择
  }
}
```

> **三个关键点**：
> 1. 结束条件：通常 `path.length === 某个值`。
> 2. 做选择和撤销选择必须配对。
> 3. 收集答案时 `path` 要拷贝（`[...path]` 或 `path.slice()`），因为 path 是引用。

### 1. 全排列（LC 46）

给一个无重复数字数组，返回所有排列。

```ts
function permute(nums: number[]): number[][] {
  const res: number[][] = [];
  const used = new Array(nums.length).fill(false);

  function bt(path: number[]): void {
    if (path.length === nums.length) {
      res.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      bt(path);
      path.pop();
      used[i] = false;
    }
  }
  bt([]);
  return res;
}
```

- 时间 O(n * n!)：n! 个排列，每个拷贝 O(n)
- 空间 O(n)（递归栈 + used 数组，不含结果）

### 2. 子集（LC 78）

给无重复数组，返回所有子集。与排列不同，子集不要求长度，结束条件改为"任何时候都可收集"。

```ts
function subsets(nums: number[]): number[][] {
  const res: number[][] = [];

  function bt(start: number, path: number[]): void {
    res.push([...path]); // 每个节点都是一个子集
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      bt(i + 1, path);
      path.pop();
    }
  }
  bt(0, []);
  return res;
}
```

- 用 `start` 控制起始位置避免重复子集（`[1,2]` 与 `[2,1]`）。
- 组合问题（LC 77）同模板，只在 `path.length === k` 时收集。

### 3. 含重复元素的子集 II（LC 90）

数组含重复元素，要去重。**关键剪枝**：同一层中相同的元素只取第一个。

```ts
function subsetsWithDup(nums: number[]): number[][] {
  nums.sort((a, b) => a - b); // 排序让相同元素相邻
  const res: number[][] = [];

  function bt(start: number, path: number[]): void {
    res.push([...path]);
    for (let i = start; i < nums.length; i++) {
      // 同层中跳过重复元素（i > start 保证是同层）
      if (i > start && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]);
      bt(i + 1, path);
      path.pop();
    }
  }
  bt(0, []);
  return res;
}
```

> **去重剪枝口诀**："同层去重，同枝不去重"。`i > start` 判断保证只在同一层（同一 for 循环）跳过相同元素，而递归下去的同一枝中可以再次使用相同值（已经是不同层了）。

### 4. N 皇后（LC 51）

在 n×n 棋盘上放 n 个皇后，互不攻击。每行放一个，决策是"放在第几列"。

```ts
function solveNQueens(n: number): string[][] {
  const res: string[][] = [];
  const board: number[] = []; // board[i] = 第 i 行皇后所在列

  function isValid(row: number, col: number): boolean {
    for (let r = 0; r < row; r++) {
      const c = board[r];
      if (c === col) return false; // 同列
      if (Math.abs(r - row) === Math.abs(c - col)) return false; // 对角线
    }
    return true;
  }

  function bt(row: number): void {
    if (row === n) {
      // 转换为字符串棋盘
      const grid = board.map(c => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1));
      res.push(grid);
      return;
    }
    for (let col = 0; col < n; col++) {
      if (!isValid(row, col)) continue;
      board[row] = col;
      bt(row + 1);
      // board[row] 不用显式撤销，下次循环会覆盖
    }
  }
  bt(0);
  return res;
}
```

- 时间 O(n!)（每行最多 n 个选择，剪枝后实际远小于 n^n）
- 空间 O(n)

### 5. 组合总和（LC 39）

无重复元素，每个数可重复使用，求和为 target 的所有组合。

```ts
function combinationSum(candidates: number[], target: number): number[][] {
  const res: number[][] = [];

  function bt(start: number, remain: number, path: number[]): void {
    if (remain === 0) {
      res.push([...path]);
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remain) continue; // 剪枝
      path.push(candidates[i]);
      bt(i, remain - candidates[i], path); // 不 +1，可重复使用
      path.pop();
    }
  }
  bt(0, target, []);
  return res;
}
```

> 排序后剪枝（`candidates[i] > remain` 跳过）能大幅减少搜索。

## 二、BFS 模板

BFS 用队列，一层一层向外扩。核心特性：**在无权图上求最短路径/最少步数天然适用**，因为第一次到达终点的步数就是最短。

### 通用模板

```ts
function bfs(start: State): number {
  const queue: State[] = [start];
  const visited = new Set<string>([key(start)]);
  let step = 0;

  while (queue.length > 0) {
    const size = queue.length; // 当前层的节点数
    for (let i = 0; i < size; i++) {
      const cur = queue.shift()!;
      if (isEnd(cur)) return step; // 找到目标
      for (const next of nextStates(cur)) {
        if (visited.has(key(next))) continue;
        visited.add(key(next));
        queue.push(next);
      }
    }
    step++; // 一层走完步数 +1
  }
  return -1;
}
```

> **三个要点**：
> 1. 按层处理：用 `size = queue.length` 锁定当前层，遍历完一层才 `step++`。
> 2. visited 在**入队时**标记，不是出队时。否则同一节点会被多次入队，浪费空间。
> 3. 状态序列化（key）要可哈希，常用 `JSON.stringify` 或自定义分隔符。

### 1. 二叉树层序遍历（LC 102）

```ts
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val: number, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const res: number[][] = [];
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const size = queue.length;
    const level: number[] = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}
```

### 2. 最短路径步数（LC 1091 二进制矩阵中的最短路径）

8 方向可达，求左上到右下的最短步数。

```ts
function shortestPathBinaryMatrix(grid: number[][]): number {
  const n = grid.length;
  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) return -1;
  if (n === 1) return 1;
  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const queue: [number, number][] = [[0, 0]];
  grid[0][0] = 1; // 直接用 grid 标记 visited
  let step = 1;
  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift()!;
      if (r === n - 1 && c === n - 1) return step;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;
        if (grid[nr][nc] === 1) continue;
        grid[nr][nc] = 1; // 入队时标记
        queue.push([nr, nc]);
      }
    }
    step++;
  }
  return -1;
}
```

### 3. 双向 BFS（优化）

当起点和终点都已知时，从两端同时 BFS，相遇即停止。能把搜索空间从 O(b^d) 降到 O(b^(d/2))，b 为分支因子，d 为答案深度。

```ts
function bidirectionalBfs(
  beginWord: string, endWord: string, wordList: string[]
): number {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;
  let front = new Set([beginWord]);
  let back = new Set([endWord]);
  let step = 1;
  while (front.size > 0 && back.size > 0) {
    if (front.size > back.size) [front, back] = [back, front]; // 总是扩展较小的一边
    const next = new Set<string>();
    for (const word of front) {
      for (let i = 0; i < word.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const ch = String.fromCharCode(c);
          if (ch === word[i]) continue;
          const newWord = word.slice(0, i) + ch + word.slice(i + 1);
          if (back.has(newWord)) return step + 1;
          if (wordSet.has(newWord)) {
            next.add(newWord);
            wordSet.delete(newWord);
          }
        }
      }
    }
    front = next;
    step++;
  }
  return 0;
}
```

## 三、DFS 模板

DFS 用递归（或显式栈）一条路走到底再回头。常用于：连通性问题、岛屿问题、拓扑排序、检测环。

### 通用模板（递归版）

```ts
function dfs(graph: number[][], start: number, visited: boolean[]): void {
  if (visited[start]) return;
  visited[start] = true;
  // 处理 start
  for (const next of graph[start]) {
    dfs(graph, next, visited);
  }
}
```

### 1. 岛屿数量（LC 200）

二维网格中 '1' 是陆地，求岛屿数。每个 '1' 触发 DFS 把整块陆地标记为已访问。

```ts
function numIslands(grid: string[][]): number {
  const m = grid.length, n = grid[0].length;
  let count = 0;

  function dfs(i: number, j: number): void {
    if (i < 0 || i >= m || j < 0 || j >= n) return;
    if (grid[i][j] !== '1') return;
    grid[i][j] = '0'; // 沉岛，标记已访问
    dfs(i - 1, j);
    dfs(i + 1, j);
    dfs(i, j - 1);
    dfs(i, j + 1);
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '1') {
        count++;
        dfs(i, j);
      }
    }
  }
  return count;
}
```

- 时间 O(mn)：每个格子访问一次
- 空间 O(mn)：最坏递归深度（全是陆地时）

> **原地修改代替 visited**：把已访问的格子改为 '0' 或 '2'，省去额外 visited 数组。如果不允许修改输入，要拷贝或用 Set。

### 2. 岛屿面积（LC 695）

DFS 返回面积而非只标记。

```ts
function maxAreaOfIsland(grid: number[][]): number {
  const m = grid.length, n = grid[0].length;
  let ans = 0;

  function dfs(i: number, j: number): number {
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== 1) return 0;
    grid[i][j] = 0; // 标记
    return 1 + dfs(i - 1, j) + dfs(i + 1, j) + dfs(i, j - 1) + dfs(i, j + 1);
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) ans = Math.max(ans, dfs(i, j));
    }
  }
  return ans;
}
```

### 3. 被围绕的区域（LC 130）

边界上的 'O' 及与之连通的 'O' 不被围绕。先从边界 DFS 标记所有不该翻转的，再统一处理。

```ts
function solve(board: string[][]): void {
  const m = board.length, n = board[0].length;

  function dfs(i: number, j: number): void {
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== 'O') return;
    board[i][j] = '#'; // 临时标记
    dfs(i - 1, j); dfs(i + 1, j); dfs(i, j - 1); dfs(i, j + 1);
  }

  // 从四条边的 'O' 出发
  for (let i = 0; i < m; i++) {
    dfs(i, 0); dfs(i, n - 1);
  }
  for (let j = 0; j < n; j++) {
    dfs(0, j); dfs(m - 1, j);
  }

  // 还原
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === 'O') board[i][j] = 'X';
      else if (board[i][j] === '#') board[i][j] = 'O';
    }
  }
}
```

> 这种"从边界反向思考"是 DFS/BFS 常用技巧：不直接求被围绕的，先求不被围绕的，剩下就是被围绕的。

## DFS vs BFS 选择

| 维度 | DFS | BFS |
| --- | --- | --- |
| 实现 | 递归或栈 | 队列 |
| 空间 | O(h) 递归深度 | O(w) 层宽度 |
| 最短路径（无权） | 不保证 | **保证** |
| 连通性 | 适合 | 也行 |
| 层级信息 | 难获取 | 天然按层 |
| 大数据 / 深度高 | 可能栈溢出 | 队列可大 |
| 拓扑排序 | 后序逆 + 反转 | 入度法（Kahn） |

> 经验：求"是否/方案数/具体方案"用 DFS（回溯）；求"最短/最少步数/最少操作"用 BFS；求"层级"用 BFS。

## 复杂度分析

- **回溯全排列**：O(n * n!) 时间，O(n) 空间
- **回溯子集**：O(n * 2^n) 时间，O(n) 空间
- **N 皇后**：O(n!) 时间，O(n) 空间
- **BFS 网格最短路**：O(mn) 时间，O(mn) 空间
- **DFS 岛屿**：O(mn) 时间，O(mn) 空间（递归栈最坏）

## 常见坑

1. **回溯忘记拷贝 path**：`res.push(path)` 推的是引用，后续 pop 会改掉结果。必须 `[...path]`。
2. **visited 时机错误**：BFS 应在入队时标记 visited，出队时才标记会导致同一节点多次入队。
3. **BFS 不按层处理**：直接 `while (queue.length)` 不锁定 `size`，step 计数会乱。
4. **DFS 栈溢出**：递归过深（如 1000x1000 全 1 网格）会爆栈，需要改用 BFS 或显式栈 DFS。
5. **方向数组**：四方向 `[[1,0],[-1,0],[0,1],[0,-1]]`，八方向多 4 个对角线。
6. **剪枝条件写错**：去重剪枝 `i > start` 不能写成 `i > 0`，否则会误剪合法递归枝。
7. **JS 中 shift() 是 O(n)**：BFS 用数组 + shift 性能差，大队列用双端队列（自己用 head 指针模拟）或 `collections` 库的 Deque。

## 经典题目清单

- 回溯全排列：LC 46 / 47（含重复）
- 回溯子集/组合：LC 78 / 90 / 77 / 39 / 40 / 216
- 回溯切割：LC 131 分割回文串 / LC 93 复原 IP
- 回溯棋盘：LC 51 N 皇后 / LC 37 解数独 / LC 79 单词搜索
- BFS 最短路：LC 1091 / 542 01 矩阵 / 994 腐烂橘子 / 1926 迷宫最近出口
- BFS 双向：LC 127 单词接龙 / LC 752 开锁
- BFS 拓扑：LC 207 课程表 / 210 课程表 II
- DFS 岛屿：LC 200 / 695 / 1254 / 130 / 417
- DFS 连通分量：LC 323 / 547 省份数量

> 面试技巧：
> - 看到"所有方案/排列/组合" → 回溯。
> - 看到"最少步数/最短路径（无权）" → BFS。
> - 看到"是否连通/有几块/面积" → DFS。
> - 看到"层级/层序" → BFS。
> - 写回溯先把"做选择—递归—撤销选择"骨架写下，再填选择列表和剪枝。
