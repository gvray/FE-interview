---
sidebar_position: 6
---
# 图

图是数据结构里「最通用也最复杂」的一种——树、链表都可以看作图的特例。前端面试中，BFS/DFS、连通分量、拓扑排序是常考题，业务中依赖关系分析、路由网络、知识图谱都依赖图。本节从表示方式讲到经典算法，建立图论入门基础。

## 基本概念

| 术语           | 含义                                       |
| -------------- | ------------------------------------------ |
| 顶点 vertex    | 图中的节点，记为 V                          |
| 边 edge        | 顶点之间的连接，记为 E                      |
| 有向图         | 边有方向（u → v 与 v → u 不同）             |
| 无向图         | 边无方向（u—v 等价 v—u）                    |
| 权重 weight    | 边上的数值，常表示距离/成本                 |
| 度 degree      | 无向图中与顶点相连的边数                    |
| 入度 / 出度    | 有向图中指向 / 离开顶点的边数               |
| 连通图         | 无向图中任意两顶点可达                      |
| 连通分量       | 极大连通子图                               |
| 稀疏图 / 稠密图 | `|E|` 远小于 / 接近 `|V|²`                  |

**树的度数性质**：N 个节点的树有 N-1 条边，无环连通。

## 图的表示方式

### 邻接矩阵

`matrix[i][j] = 1`（或权重）表示 i 到 j 有边。

```ts
// 无向图邻接矩阵
class GraphMatrix {
  private matrix: number[][];
  constructor(public n: number) {
    this.matrix = Array.from({ length: n }, () => new Array(n).fill(0));
  }
  addEdge(u: number, v: number, w = 1): void {
    this.matrix[u][v] = w;
    // this.matrix[v][u] = w; // 无向图需加这一行
  }
  hasEdge(u: number, v: number): boolean {
    return this.matrix[u][v] !== 0;
  }
}
```

特点：

- 查边 O(1)，遍历邻接点 O(n)。
- 空间 O(n²)，适合稠密图。
- 矩阵运算方便（如传递闭包的 Warshall 算法）。

### 邻接表

每个顶点存一个链表（或数组）记录相邻顶点。

```ts
class GraphList {
  private adj: Map<number, [number, number][]>; // u -> [(v, w)]

  constructor(public n: number) {
    this.adj = new Map();
    for (let i = 0; i < n; i++) this.adj.set(i, []);
  }

  addEdge(u: number, v: number, w = 1): void {
    this.adj.get(u)!.push([v, w]);
    // this.adj.get(v)!.push([u, w]); // 无向图
  }

  neighbors(u: number): [number, number][] {
    return this.adj.get(u) ?? [];
  }
}
```

特点：

- 空间 O(n + e)，适合稀疏图（绝大多数实际场景）。
- 遍历邻接点 O(degree)，更快。
- 难以 O(1) 判断两节点是否相邻。

| 表示法     | 空间     | 查边     | 遍历邻居     | 适用         |
| ---------- | -------- | -------- | ------------ | ------------ |
| 邻接矩阵   | O(n²)    | O(1)     | O(n)         | 稠密图       |
| 邻接表     | O(n + e) | O(degree) | O(degree)  | 稀疏图（主流） |

## BFS 广度优先搜索

用队列，按层扩展，常用于无权图最短路径、分层统计。

```ts
function bfs(graph: GraphList, start: number): number[] {
  const visited = new Set<number>([start]);
  const order: number[] = [];
  const queue: number[] = [start];
  while (queue.length) {
    const u = queue.shift()!;
    order.push(u);
    for (const [v] of graph.neighbors(u)) {
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
      }
    }
  }
  return order;
}

// 无权图最短路径（起点到所有可达节点的距离）
function bfsDistance(graph: GraphList, start: number): number[] {
  const dist = new Array(graph.n).fill(-1);
  dist[start] = 0;
  const queue: number[] = [start];
  while (queue.length) {
    const u = queue.shift()!;
    for (const [v] of graph.neighbors(u)) {
      if (dist[v] === -1) {
        dist[v] = dist[u] + 1;
        queue.push(v);
      }
    }
  }
  return dist;
}
```

## DFS 深度优先搜索

用递归或栈，一条路走到底再回溯，适合连通性、环检测、拓扑排序。

```ts
function dfsRecursive(graph: GraphList, start: number): number[] {
  const visited = new Set<number>();
  const order: number[] = [];
  const walk = (u: number): void => {
    visited.add(u);
    order.push(u);
    for (const [v] of graph.neighbors(u)) {
      if (!visited.has(v)) walk(v);
    }
  };
  walk(start);
  return order;
}

// 栈版本（避免深图爆栈）
function dfsIterative(graph: GraphList, start: number): number[] {
  const visited = new Set<number>();
  const order: number[] = [];
  const stack: number[] = [start];
  while (stack.length) {
    const u = stack.pop()!;
    if (visited.has(u)) continue;
    visited.add(u);
    order.push(u);
    for (const [v] of graph.neighbors(u)) {
      if (!visited.has(v)) stack.push(v);
    }
  }
  return order;
}
```

## 连通分量

无向图中「极大连通子图」的数量。一次 DFS / BFS 能遍历一个连通分量。

```ts
function countComponents(graph: GraphList): number {
  const visited = new Set<number>();
  let count = 0;
  for (let i = 0; i < graph.n; i++) {
    if (!visited.has(i)) {
      count++;
      const stack = [i];
      while (stack.length) {
        const u = stack.pop()!;
        if (visited.has(u)) continue;
        visited.add(u);
        for (const [v] of graph.neighbors(u)) {
          if (!visited.has(v)) stack.push(v);
        }
      }
    }
  }
  return count;
}
```

经典题：岛屿数量（网格图 DFS 染色）、省份数量（矩阵 DFS）。

## 环检测

```ts
// 无向图：DFS 中遇到已访问且非父节点即有环
function hasCycleUndirected(graph: GraphList): boolean {
  const visited = new Set<number>();
  const dfs = (u: number, parent: number): boolean => {
    visited.add(u);
    for (const [v] of graph.neighbors(u)) {
      if (!visited.has(v)) {
        if (dfs(v, u)) return true;
      } else if (v !== parent) {
        return true;
      }
    }
    return false;
  };
  for (let i = 0; i < graph.n; i++) {
    if (!visited.has(i) && dfs(i, -1)) return true;
  }
  return false;
}

// 有向图：三色标记法
// WHITE=未访问, GRAY=访问中（在递归栈里）, BLACK=完成
function hasCycleDirected(graph: GraphList): boolean {
  const color = new Array(graph.n).fill(0);
  const dfs = (u: number): boolean => {
    color[u] = 1; // GRAY
    for (const [v] of graph.neighbors(u)) {
      if (color[v] === 1) return true;       // 回到 GRAY，有环
      if (color[v] === 0 && dfs(v)) return true;
    }
    color[u] = 2; // BLACK
    return false;
  };
  for (let i = 0; i < graph.n; i++) {
    if (color[i] === 0 && dfs(i)) return true;
  }
  return false;
}
```

## 最短路径简介

| 算法           | 场景                       | 复杂度             | 思想                       |
| -------------- | -------------------------- | ------------------ | -------------------------- |
| BFS            | 无权图单源最短路径         | O(n + e)           | 层序扩展                   |
| Dijkstra       | 非负权重图单源最短路径     | O((n+e) log n)     | 贪心 + 优先队列             |
| Bellman-Ford   | 允许负权重，可检测负环     | O(n * e)           | 松弛 n-1 轮                |
| Floyd-Warshall | 多源最短路径               | O(n³)              | DP：`d[i][j] = min(d[i][j], d[i][k]+d[k][j])` |

```ts
// Dijkstra（优先队列用排序模拟，生产环境建议用真正的二叉堆）
function dijkstra(graph: GraphList, src: number): number[] {
  const dist = new Array(graph.n).fill(Infinity);
  dist[src] = 0;
  const visited = new Set<number>();
  // [distance, node]，每次取出距离最小的
  const pq: [number, number][] = [[0, src]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;
    if (visited.has(u)) continue;
    visited.add(u);
    for (const [v, w] of graph.neighbors(u)) {
      const nd = d + w;
      if (nd < dist[v]) {
        dist[v] = nd;
        pq.push([nd, v]);
      }
    }
  }
  return dist;
}
```

> 面试常要求用最小堆优化，可以用二叉堆把 sort 的 O(n) 降到 O(log n)。

## 拓扑排序

只适用于 DAG（有向无环图）。两种主流写法：

### Kahn 算法（BFS，入度法）

```ts
function topologicalSort(graph: GraphList): number[] | null {
  const inDegree = new Array(graph.n).fill(0);
  for (let u = 0; u < graph.n; u++) {
    for (const [v] of graph.neighbors(u)) inDegree[v]++;
  }
  const queue: number[] = [];
  for (let i = 0; i < graph.n; i++) if (inDegree[i] === 0) queue.push(i);
  const order: number[] = [];
  while (queue.length) {
    const u = queue.shift()!;
    order.push(u);
    for (const [v] of graph.neighbors(u)) {
      if (--inDegree[v] === 0) queue.push(v);
    }
  }
  // 若 order 长度 != 节点数，说明有环
  return order.length === graph.n ? order : null;
}
```

### DFS 后序逆序

```ts
function topologicalSortDFS(graph: GraphList): number[] | null {
  const color = new Array(graph.n).fill(0);
  const order: number[] = [];
  let hasCycle = false;
  const dfs = (u: number): void => {
    color[u] = 1;
    for (const [v] of graph.neighbors(u)) {
      if (color[v] === 1) { hasCycle = true; return; }
      if (color[v] === 0) dfs(v);
    }
    color[u] = 2;
    order.push(u);
  };
  for (let i = 0; i < graph.n; i++) if (color[i] === 0) dfs(i);
  return hasCycle ? null : order.reverse();
}
```

应用场景：课程表、npm 依赖安装顺序、构建管线、Monorepo 包构建顺序。

## 复杂度速查

| 算法             | 邻接矩阵     | 邻接表           |
| ---------------- | ------------ | ---------------- |
| BFS              | O(n²)        | O(n + e)         |
| DFS             | O(n²)        | O(n + e)         |
| Dijkstra         | O(n²)        | O((n+e) log n)   |
| Prim（最小生成树） | O(n²)      | O((n+e) log n)   |
| 拓扑排序         | O(n²)        | O(n + e)         |

## 高频追问

1. **为什么 DFS 也要会迭代版？** 递归深度受调用栈限制，大图必须显式栈。
2. **BFS 如何求最短路径？** 无权图里 BFS 第一次访问到目标节点的层数即最短距离。
3. **拓扑排序判断课程表是否可行？** Kahn 算法结束时若 order 长度 != n 则有环，不可完成。
4. **A* 算法是什么？** 启发式最短路，把 Dijkstra 的「当前距离」加上「到目标的预估距离」作为优先级，常用于游戏寻路。
5. **网格图（岛屿数量）如何转成图？** 把格子当节点，相邻四方向当边，DFS 染色即可。

## 小结

- 图的表示首选邻接表，空间友好且适配大多数算法。
- BFS 适合分层 / 最短路径（无权），DFS 适合连通性 / 环检测 / 拓扑。
- 三色标记法是有向图环检测的标准答案，务必背熟。
- Dijkstra + 拓扑排序是图论两大「压轴题」，掌握模板与复杂度即可应对 80% 面试。
