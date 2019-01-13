---
sidebar_position: 13
title: "React合成事件机制"
---

# React合成事件机制

React 中的合成事件机制是一种用于处理浏览器事件的封装机制。React 合成事件系统的设计目的是为了解决跨浏览器兼容性问题，提供一致的事件接口，并且优化事件处理的性能。以下是关于React合成事件机制的一些关键点：

1. **事件委托（Event Delegation）：** React 使用事件委托的方式处理事件。它将事件监听器绑定在 document 上,react18是挂载在root上，通过事件冒泡的机制，在合适的时候触发组件内的事件处理函数。这样可以减少事件处理器的数量，提高性能。

2. **合成事件对象：** React 提供了一种合成事件对象，该对象封装了底层浏览器的原生事件对象，使开发者能够跨浏览器使用一致的事件接口。合成事件对象包含了常见的事件属性（如 `event.type`、`event.target`）以及一些React特有的属性。

3. **事件池（Event Pooling）：** 为了提高性能，React 使用了事件池来重用合成事件对象。合成事件对象在事件处理完成后会被重置，然后可以被再次使用。这样可以减少垃圾回收的开销，提高性能。

4. **异步处理：** React 的事件处理是异步的。当组件中的事件处理函数被调用时，它实际上是将事件加入到一个事件队列中，稍后才会被执行。这样可以在一定程度上提高性能，因为多个事件处理函数可能会被批量处理。

5. **事件代理（Event Delegation）：** React 将事件委托到最外层的容器，然后根据事件冒泡的原理，逐级向下触发相应的事件处理函数。这样可以减少事件监听器的数量，提高效率。

6. **支持不同类型的事件：** React 支持常见的原生事件，如点击、键盘输入、鼠标移动等，同时还支持一些移动端的手势事件。

## setState和batchUpdate机制

`setState` 本质上是异步的（批量更新）。React 会将同一事件循环中多次 `setState` 合并为一次更新，避免不必要的重复渲染，这就是 **batchUpdate（批量更新）机制**。

**为什么需要批量更新？** 如果每次 `setState` 都立即触发一次重渲染，在一个事件处理函数中多次调用会导致性能问题。批量更新将多次状态变更收集起来，最终只触发一次 re-render，保证 UI 与状态一致。

**React 17 vs React 18：**

- **React 17**：只在 React 管理的事件处理函数（如合成事件 onClick）中进行批量更新；在 `setTimeout`、`Promise.then`、原生事件等异步回调中，每次 `setState` 都会立即触发一次渲染（不批量）。
- **React 18**：引入 **Automatic Batching（自动批量更新）**，在所有上下文中（包括 `setTimeout`、`Promise`、原生事件回调）都会自动批量更新。

```js
// React 18 中，以下两次 setState 会被合并为一次渲染
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // 只会触发一次 re-render
}, 0);
```

**`flushSync`**：如果需要在某些场景下立即同步更新（退出批量更新），可以使用 `flushSync`：

```js
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCount(c => c + 1); // 立即触发渲染
  });
  // 此时 DOM 已更新
  setFlag(f => !f); // 进入下一次批量更新
}
```

批量更新基于 Fiber 架构的调度机制：`setState` 会创建一个 update 对象挂到对应 Fiber 节点的 updateQueue 上，调度器在合适的时机统一处理。

## 受控组件和非受控组件

**受控组件（Controlled Component）**：表单元素的值由 React state 控制，用户输入通过 `onChange` 同步到 state，再由 state 驱动 UI 更新。数据流是单向的。

```jsx
function Controlled() {
  const [value, setValue] = useState('');
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

**非受控组件（Uncontrolled Component）**：表单元素的状态由 DOM 自身管理，React 通过 `ref` 在需要时读取其值，不实时跟踪输入过程。

```jsx
function Uncontrolled() {
  const inputRef = useRef(null);
  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };
  return <input ref={inputRef} defaultValue="hello" />;
}
```

**何时使用哪种？**

| 场景 | 推荐方式 |
| --- | --- |
| 需要对输入做实时校验、格式化 | 受控组件 |
| 数据需要与其他组件联动 | 受控组件 |
| 一次性提交、无需实时追踪 | 非受控组件 |
| 集成非 React 代码、文件上传 (`<input type="file">`) | 非受控组件 |

大多数业务场景推荐使用受控组件，它让数据流更清晰、可预测。非受控组件适合简单场景或受控成本较高的场景。

## Diff算法以及key的作用

React 的 Diff 算法基于三个假设将复杂度从 O(n³) 降到 O(n)：

1. **不同类型的元素产生不同的树**：如 `<div>` 变为 `<span>`，直接销毁旧树并创建新树。
2. **同层级的元素通过 key 标识**：同层兄弟节点通过 `key` 判断是否可以复用。
3. **只比较同一层级**：跨层级移动节点视为删除+创建，不做跨层移动复用。

**Diff 的三个层次：**

- **Tree Diff（树级）**：从根节点开始，按层级逐层比较，跨层级的移动会直接销毁并重建。
- **Component Diff（组件级）**：同类型组件继续递归比较子树；不同类型直接销毁重建。可通过 `shouldComponentUpdate` / `React.memo` 跳过本次渲染。
- **Element Diff（元素级）**：同层级的子节点列表比较，包含插入、删除、移动操作。

**key 的作用：**

`key` 是 React 识别同层级节点的唯一标识。当列表顺序发生变化时，React 通过 `key` 判断哪些节点可以复用、哪些需要移动，从而避免不必要的销毁和重建。

```jsx
// 列表顺序变化时，有 key 的节点会被移动而非重新创建
<ul>
  {items.map(item => <li key={item.id}>{item.text}</li>)}
</ul>
```

**用 `index` 作为 key 的隐患：**

- 当列表顺序变化（插入、删除、排序）时，index 对应的节点会变化，React 会复用错误的节点，导致状态错乱（如输入框内容残留）。
- 性能上也会退化为类似全量重建。

```jsx
// 反例：index 作为 key
{items.map((item, index) => <li key={index}>{item.text}</li>)}
```

**结论**：列表项应使用稳定、唯一的业务 ID 作为 `key`，避免使用数组索引，除非列表纯展示且不会发生顺序变化。

## 组件渲染和更新过程

React 组件从挂载到更新经历以下核心流程：

**1. Render 阶段（可中断、可重入）**

- `setState` 触发后，调度器（Scheduler）安排一次更新任务。
- React 从根节点开始递归对比 Fiber 树，执行组件函数（函数组件）或 `render` 方法（类组件），生成新的虚拟 DOM。
- 与现有 Fiber 树进行 Diff，标记需要变更的副作用（effect），构建 `effects` 链表。
- 这一阶段是纯计算、无副作用的，可以被中断和恢复（时间切片 / Time Slicing）。

**2. Reconciliation（协调）阶段**

- React 比较 current Fiber 和 work-in-progress Fiber，根据 Diff 结果决定节点的增、删、改、移动。
- 协调完成后，work-in-progress Fiber 树准备提交。

**3. Commit 阶段（同步、不可中断）**

- React 将变更应用到真实 DOM，这一阶段是同步执行的。
- 分为三个子阶段：
  - **Before Mutation**：执行 `getSnapshotBeforeUpdate` 等。
  - **Mutation**：执行 DOM 的增删改。
  - **Layout**：执行 `useLayoutEffect`、`componentDidMount` / `componentDidUpdate` 等。

**4. Effects 执行阶段**

- 在浏览器绘制之后，异步执行 `useEffect` 中的副作用（Passive Effects）。

**Fiber 工作循环：**

- React Fiber 是一种可中断、可恢复的链表结构，每个 Fiber 节点对应一个组件。
- 调度器通过时间切片（5ms 左右）将工作拆分为多个帧，避免长时间阻塞主线程。
- `shouldComponentUpdate` / `React.memo` / `useMemo` 等优化可减少不必要的 render 阶段执行。

简单流程图：

```
setState → Scheduler 调度 → Render 阶段（生成 WIP Fiber 树、Diff）
        → Reconciliation → Commit 阶段（更新 DOM）
        → 浏览器绘制 → 执行 useEffect
```
