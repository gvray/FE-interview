---
sidebar_position: 2
---
# 链表

链表是面试中考察「指针操作能力」最典型的结构。它没有数组的随机访问能力，但插入删除 O(1)。前端面试中反转链表、检测环、合并链表几乎是必考题，React Fiber 树也是用类似链表节点串联的。

## 链表的种类

| 类型         | 节点指针                | 特点                                 |
| ------------ | ----------------------- | ------------------------------------ |
| 单链表       | `next`                  | 只能单向遍历                         |
| 双链表       | `prev` + `next`         | 双向遍历，删除 O(1)，但空间开销更大  |
| 环形链表     | 尾节点 `next` 指回头部  | 循环结构，常用于轮询调度、约瑟夫环   |

```ts
// 单链表节点
class ListNode<T> {
  val: T;
  next: ListNode<T> | null;
  constructor(val: T, next: ListNode<T> | null = null) {
    this.val = val;
    this.next = next;
  }
}

// 双链表节点
class DoublyNode<T> {
  val: T;
  prev: DoublyNode<T> | null;
  next: DoublyNode<T> | null;
  constructor(val: T) {
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}
```

## JS 实现单链表

```ts
class SinglyLinkedList<T> {
  private head: ListNode<T> | null = null;
  private size = 0;

  get length() {
    return this.size;
  }

  // 头插法：O(1)
  prepend(val: T): void {
    this.head = new ListNode(val, this.head);
    this.size++;
  }

  // 尾插法：O(n)
  append(val: T): void {
    const node = new ListNode(val);
    if (!this.head) {
      this.head = node;
    } else {
      let cur = this.head;
      while (cur.next) cur = cur.next;
      cur.next = node;
    }
    this.size++;
  }

  // 按索引查找：O(n)
  get(i: number): T | undefined {
    if (i < 0 || i >= this.size) return undefined;
    let cur = this.head;
    for (let k = 0; k < i; k++) cur = cur!.next;
    return cur?.val;
  }

  // 删除指定值首个匹配：O(n)
  remove(val: T): boolean {
    if (!this.head) return false;
    if (this.head.val === val) {
      this.head = this.head.next;
      this.size--;
      return true;
    }
    let cur = this.head;
    while (cur.next && cur.next.val !== val) cur = cur.next;
    if (!cur.next) return false;
    cur.next = cur.next.next;
    this.size--;
    return true;
  }

  toArray(): T[] {
    const res: T[] = [];
    let cur = this.head;
    while (cur) {
      res.push(cur.val);
      cur = cur.next;
    }
    return res;
  }
}
```

## 遍历与边界处理

链表题 80% 的 bug 来自空指针和边界。三件套：

1. **空链表**：`head === null` 单独处理。
2. **单节点**：`head.next === null` 单独处理。
3. **dummy 头节点**：处理「头节点可能被改变」的情况，统一逻辑。

```ts
// 通用遍历模板
let cur = head;
while (cur) {
  // do something with cur.val
  cur = cur.next;
}
```

## 反转链表

链表题的「Hello World」。两种写法都要会。

```ts
// 迭代：三指针 prev / cur / next
function reverseList(head: ListNode<number> | null): ListNode<number> | null {
  let prev = null;
  let cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}

// 递归：把「反转 head.next 之后的链表，再让下一个指向 head」
function reverseListRecursive(head: ListNode<number> | null): ListNode<number> | null {
  if (!head || !head.next) return head;
  const newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}
```

> 递归写法图示：假设 `1 -> 2 -> 3 -> null`，递归到 `3` 返回它本身，回到 `2` 让 `3.next = 2`，回到 `1` 让 `2.next = 1`，最后 `1.next = null`。

## 合并两个有序链表

```ts
function mergeTwoLists(
  l1: ListNode<number> | null,
  l2: ListNode<number> | null
): ListNode<number> | null {
  const dummy = new ListNode<number>(0 as any);
  let tail = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      tail.next = l1;
      l1 = l1.next;
    } else {
      tail.next = l2;
      l2 = l2.next;
    }
    tail = tail.next;
  }
  tail.next = l1 ?? l2;
  return dummy.next;
}
```

**dummy 节点**省去了对头节点为空的特判，是链表题最重要的工程技巧。

## 检测环（Floyd 判圈）

快慢指针：快指针每次走两步，慢指针每次走一步。若进入环，二者必相遇。

```ts
function hasCycle(head: ListNode<number> | null): boolean {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// 进一步找出环入口：相遇后让慢指针回到 head，再同速前进相遇点即入口
function detectCycle(head: ListNode<number> | null): ListNode<number> | null {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      // 第二次相遇
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

**数学证明**：设环外长度 a，环长度 b，相遇点距环入口 c。慢指针走了 `a + c`，快指针走了 `a + c + nb`，且快指针走的步数是慢指针的两倍：`a + c + nb = 2(a + c)`，即 `nb = a + c`，所以 `a = nb - c = (n-1)b + (b-c)`。让慢指针从头走 a 步时，快指针从相遇点走 a 步，恰好走完 `n-1` 整圈再加 `b-c` 到达环入口。

## 找链表中点

快慢指针：快指针到尾时，慢指针正好在中点。

```ts
function middleNode(head: ListNode<number> | null): ListNode<number> | null {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}
```

应用：链表归并排序（找中点 → 分治 → 合并）、判断回文链表（找中点 → 反转后半段 → 比较）。

## 删除倒数第 N 个节点

双指针让快指针先走 N 步，再同步前进，慢指针即停在被删节点的前驱。

```ts
function removeNthFromEnd(head: ListNode<number> | null, n: number): ListNode<number> | null {
  const dummy = new ListNode<number>(0 as any, head);
  let fast: ListNode<number> | null = dummy;
  let slow: ListNode<number> | null = dummy;
  for (let i = 0; i < n; i++) fast = fast!.next;
  while (fast!.next) {
    fast = fast!.next;
    slow = slow!.next;
  }
  slow!.next = slow!.next!.next;
  return dummy.next;
}
```

## 两条链表的第一个公共节点

```ts
function getIntersectionNode(
  headA: ListNode<number> | null,
  headB: ListNode<number> | null
): ListNode<number> | null {
  let pa = headA, pb = headB;
  while (pa !== pb) {
    pa = pa ? pa.next : headB;
    pb = pb ? pb.next : headA;
  }
  return pa;
}
```

**思路**：让两指针走完自己链表后切换到对方链表，二者走过的总长相同（`a + b = b + a`），必然在第一个公共节点相遇；若没有公共节点，则同时为 null 退出。

## 复杂度速查

| 操作                   | 单链表 | 双链表 |
| ---------------------- | ------ | ------ |
| 访问第 i 个            | O(n)   | O(n)   |
| 头插 / 头删            | O(1)   | O(1)   |
| 尾插（无尾指针）       | O(n)   | O(n)   |
| 尾删（无尾指针）       | O(n)   | O(1)   |
| 已知节点删除           | O(n)   | O(1)   |
| 查找值                 | O(n)   | O(n)   |

## 小结

- 链表题 = 指针操作 + 边界处理 + dummy 节点。
- 反转链表、检测环、找中点是基本功，**迭代和递归两种写法都要练**。
- 快慢指针是链表的「双指针」：判环、找中点、删倒数第 N 个全靠它。
- 双链表在 LRU、浏览器历史、撤销栈等需要双向遍历的场景才更划算。
