---
sidebar_position: 1
---

# 手写练习场

手写题是前端面试的"实操关"。面试官通过让你现场实现 `Promise`、防抖节流、深拷贝、发布订阅等，考察对基础原理的理解与代码功底。这类题没有捷径，只能靠反复练习形成肌肉记忆，并在理解"为什么这么写"的基础上应对追问。

## 题目清单

- [call / apply / bind](./call-apply-bind.md) - 显式绑定 this 的三种方式及其区别与实现。
- [curry 柯里化](./curry.md) - 函数柯里化的实现思路与常见应用场景。
- [debounce / throttle](./debounce-throttle.md) - 防抖与节流的核心思想、边界处理与取消功能。
- [deep clone 深拷贝](./deep-clone.md) - 处理循环引用、特殊对象（Date/RegExp/Map）的深拷贝实现。
- [EventEmitter](./event-emitter.md) - 发布订阅模式，on/emit/off/once 的完整实现。
- [LRU 缓存](./lru.md) - 最近最少使用缓存，结合 Map 与双向链表的经典实现。
- [new / instanceof](./new-instanceof.md) - 手写 new 与 instanceof，理解原型链与对象创建过程。
- [Promise](./promise.md) - 从零实现 Promise/A+，链式调用、错误处理与静态方法。

## 学习路径建议

1. **从最短开始**：先吃透 `call/apply/bind`、`new/instanceof`，它们是理解 this 与原型链的钥匙。
2. **异步核心**：手写 Promise/A+ 是重中之重，务必能独立写出链式调用与错误穿透。
3. **高频场景**：防抖节流、深拷贝、发布订阅是出现频率最高的三道题，做到能默写并能解释边界。
4. **追问准备**：每道题想清楚"如果面试官追问性能、边界、与原生实现的差异怎么回答"，而不只是写出能跑的版本。

[FAQ](./FAQ.md)
