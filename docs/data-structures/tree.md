---
sidebar_position: 5
---
# 树

树是前端最常打交道的非线性结构——DOM 树、组件树、Vue 模板 AST、React Fiber 树、虚拟 DOM diff，全都是树。二叉树又是面试的核心考察点：遍历、深度、翻转、最近公共祖先等题目几乎是各大厂的「热身题」。

## 基本概念

| 术语         | 含义                                   |
| ------------ | -------------------------------------- |
| 根节点 root  | 唯一无父节点的节点                     |
| 叶节点 leaf  | 无子节点的节点                         |
| 深度 depth   | 根到该节点的边数（根深度为 0）         |
| 高度 height  | 该节点到最远叶节点的边数（叶高度为 0） |
| 度 degree    | 节点的子节点数                         |
| 层 level     | 根为第 1 层，往下递增                  |

**树的高度** = 根节点的高度；**空树高度**通常记为 -1 或 0，看约定。

## 二叉树与特殊形态

每个节点最多两个子节点。常见特殊二叉树：

| 类型              | 性质                                     |
| ----------------- | ---------------------------------------- |
| 满二叉树          | 每个节点要么 0 子要么 2 子                |
| 完全二叉树        | 除最后一层外全满，最后一层从左往右排    |
| 完美二叉树        | 所有层都满                               |
| 二叉搜索树 BST    | 左 &lt; 根 &lt; 右，中序遍历得升序序列          |
| 平衡二叉树 AVL    | BST + 任意节点左右子树高度差 ≤ 1          |
| 红黑树            | 近似平衡 BST，插入删除旋转少              |

```ts
class TreeNode<T> {
  val: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
  constructor(val: T, left: TreeNode<T> | null = null, right: TreeNode<T> | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// 工具：按层序数组构造二叉树（含 null 占位）
function buildTree(arr: (number | null)[]): TreeNode<number> | null {
  if (!arr.length || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const queue: (TreeNode<number> | null)[] = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift()!;
    if (node) {
      node.left = arr[i] === null ? null : new TreeNode(arr[i]!);
      i++;
      node.right = arr[i] === null ? null : new TreeNode(arr[i]!);
      i++;
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  return root;
}
```

## 二叉树的遍历

四种遍历方式：前序（根-左-右）、中序（左-根-右）、后序（左-右-根）、层序。每种都有「递归」和「迭代」两套写法。**面试官最常要求迭代版**。

### 递归写法

```ts
function preorder(root: TreeNode<number> | null, out: number[] = []): number[] {
  if (!root) return out;
  out.push(root.val);
  preorder(root.left, out);
  preorder(root.right, out);
  return out;
}

function inorder(root: TreeNode<number> | null, out: number[] = []): number[] {
  if (!root) return out;
  inorder(root.left, out);
  out.push(root.val);
  inorder(root.right, out);
  return out;
}

function postorder(root: TreeNode<number> | null, out: number[] = []): number[] {
  if (!root) return out;
  postorder(root.left, out);
  postorder(root.right, out);
  out.push(root.val);
  return out;
}
```

### 迭代写法

**前序（栈，右子先入栈）**：

```ts
function preorderIter(root: TreeNode<number> | null): number[] {
  if (!root) return [];
  const res: number[] = [];
  const stack: TreeNode<number>[] = [root];
  while (stack.length) {
    const node = stack.pop()!;
    res.push(node.val);
    if (node.right) stack.push(node.right); // 右先压，左后压 -> 左先出
    if (node.left) stack.push(node.left);
  }
  return res;
}
```

**中序（一路向左入栈）**：

```ts
function inorderIter(root: TreeNode<number> | null): number[] {
  const res: number[] = [];
  const stack: TreeNode<number>[] = [];
  let cur = root;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop()!;
    res.push(cur.val);
    cur = cur.right;
  }
  return res;
}
```

**后序（双栈法 / 反转法）**：前序是「根-左-右」，把左右入栈顺序对调成「根-右-左」，最后反转结果即「左右根」。

```ts
function postorderIter(root: TreeNode<number> | null): number[] {
  if (!root) return [];
  const res: number[] = [];
  const stack: TreeNode<number>[] = [root];
  while (stack.length) {
    const node = stack.pop()!;
    res.push(node.val);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  return res.reverse();
}
```

### 层序（BFS）

```ts
function levelOrder(root: TreeNode<number> | null): number[][] {
  if (!root) return [];
  const res: number[][] = [];
  const queue: TreeNode<number>[] = [root];
  while (queue.length) {
    const levelSize = queue.length;
    const level: number[] = [];
    for (let i = 0; i < levelSize; i++) {
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

> 速记：前序/后序迭代用「栈」，层序用「队列」，中序迭代靠「左链入栈」。

## BST 的性质与操作

二叉搜索树：左子树值都 &lt; 根，右子树值都 > 根。**中序遍历得升序序列**。

```ts
// 在 BST 中查找（迭代）
function searchBST(root: TreeNode<number> | null, target: number): TreeNode<number> | null {
  let cur = root;
  while (cur) {
    if (target === cur.val) return cur;
    cur = target < cur.val ? cur.left : cur.right;
  }
  return null;
}

// 插入
function insertIntoBST(root: TreeNode<number> | null, val: number): TreeNode<number> {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = insertIntoBST(root.left, val);
  else if (val > root.val) root.right = insertIntoBST(root.right, val);
  return root;
}

// 验证 BST
function isValidBST(root: TreeNode<number> | null, low = -Infinity, high = Infinity): boolean {
  if (!root) return true;
  if (root.val <= low || root.val >= high) return false;
  return isValidBST(root.left, low, root.val) && isValidBST(root.right, root.val, high);
}
```

> 陷阱：仅判断「左 &lt; 根 &lt; 右」不够，必须左子树所有节点 &lt; 根、右子树所有节点 > 根。用上下界递归是正解。

## 题目一：最大深度

```ts
// 递归
function maxDepth(root: TreeNode<number> | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// BFS 层序法
function maxDepthBFS(root: TreeNode<number> | null): number {
  if (!root) return 0;
  let depth = 0;
  const queue: TreeNode<number>[] = [root];
  while (queue.length) {
    depth++;
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return depth;
}
```

## 题目二：翻转二叉树

```ts
function invertTree(root: TreeNode<number> | null): TreeNode<number> | null {
  if (!root) return null;
  [root.left, root.right] = [root.right, root.left];
  invertTree(root.left);
  invertTree(root.right);
  return root;
}
```

> 这道题据传曾让 Homebrew 作者 Max Howell 在 Google 面试翻车，是面试的「Hello World」。

## 题目三：对称二叉树

```ts
function isSymmetric(root: TreeNode<number> | null): boolean {
  if (!root) return true;
  const check = (a: TreeNode<number> | null, b: TreeNode<number> | null): boolean => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.val === b.val && check(a.left, b.right) && check(a.right, b.left);
  };
  return check(root.left, root.right);
}
```

## 题目四：最近公共祖先 LCA

```ts
// 普通二叉树的 LCA
function lowestCommonAncestor(
  root: TreeNode<number> | null,
  p: TreeNode<number>,
  q: TreeNode<number>,
): TreeNode<number> | null {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;   // 一左一右，根即是 LCA
  return left ?? right;
}

// BST 的 LCA（利用大小关系，可迭代 O(log n)）
function lowestCommonAncestorBST(
  root: TreeNode<number> | null,
  p: TreeNode<number>,
  q: TreeNode<number>,
): TreeNode<number> | null {
  let cur = root;
  while (cur) {
    if (p.val < cur.val && q.val < cur.val) cur = cur.left;
    else if (p.val > cur.val && q.val > cur.val) cur = cur.right;
    else return cur;
  }
  return null;
}
```

## 题目五：路径总和

```ts
// 是否存在根到叶路径和为 target
function hasPathSum(root: TreeNode<number> | null, target: number): boolean {
  if (!root) return false;
  if (!root.left && !root.right) return target === root.val;
  return hasPathSum(root.left, target - root.val) || hasPathSum(root.right, target - root.val);
}

// 所有路径（回溯）
function binaryTreePaths(root: TreeNode<number> | null): string[] {
  const res: string[] = [];
  const path: number[] = [];
  const dfs = (node: TreeNode<number> | null): void => {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right) {
      res.push(path.join('->'));
    } else {
      dfs(node.left);
      dfs(node.right);
    }
    path.pop();
  };
  dfs(root);
  return res;
}
```

## 题目六：序列化与反序列化

```ts
// 用前序 + 占位符 null 序列化
function serialize(root: TreeNode<number> | null): string {
  const parts: string[] = [];
  const dfs = (node: TreeNode<number> | null): void => {
    if (!node) { parts.push('null'); return; }
    parts.push(String(node.val));
    dfs(node.left);
    dfs(node.right);
  };
  dfs(root);
  return parts.join(',');
}

function deserialize(data: string): TreeNode<number> | null {
  const list = data.split(',');
  let i = 0;
  const dfs = (): TreeNode<number> | null => {
    if (i >= list.length || list[i] === 'null') { i++; return null; }
    const node = new TreeNode(Number(list[i++]));
    node.left = dfs();
    node.right = dfs();
    return node;
  };
  return dfs();
}
```

## 高频追问

1. **前序 + 中序如何重建二叉树？** 前序首元素是根，到中序里找它，左边是左子树，右边是右子树，递归构建。
2. **完全二叉树节点数怎么 O(log²n) 求？** 一直向左走得到左高度 h；若右子树高度 = h-1，则左子树是完美二叉树（节点 `2^h - 1`），递归右子树；否则右子树高度 = h-2，右子树是完美，递归左子树。
3. **递归改迭代何时必须？** 树很深时（如 10 万节点链状树）必爆栈；面试官常指定迭代。
4. **Morris 遍历是什么？** 利用线索化思想，把空间复杂度降到 O(1) 的中序遍历，代价是修改了树结构。

## 小结

- 二叉树遍历的「递归三件套」与「迭代四件套」必须熟到能默写。
- BST 三大操作：查找、插入、验证，都依赖「左 &lt; 根 &lt; 右」的有序性质。
- 树的递归思维：把问题拆成「根做什么 + 左子做什么 + 右子做什么」。
- 高频题：最大深度、翻转、对称、LCA、路径总和、序列化——集中练习效率最高。
