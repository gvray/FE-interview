---
sidebar_position: 4
---
# 手写防抖与节流

> 防抖（debounce）与节流（throttle）是高频事件优化的两件套。它们都限制了回调的执行频率，但限制方式不同：防抖是「等停止了再执行」，节流是「固定间隔最多执行一次」。本文从基础版逐步演进到支持 leading/trailing/cancel 的工业级实现。

## 题目描述

实现两个高阶函数：

1. `debounce(fn, wait, options)`：在连续触发时只执行最后一次，支持立即执行（leading）和尾部执行（trailing）。
2. `throttle(fn, wait, options)`：在连续触发时每隔 `wait` 至少执行一次，支持 leading/trailing 与取消。

并要求支持 `cancel()` 取消挂起的执行。

## 思路分析

### 防抖

核心：每次触发都重新计时，把已存在的定时器清掉。即「打断重启」。

- 普通版：触发后等 `wait` 毫秒无新触发，才执行最后一次。
- leading 版：第一次立即执行，后续需要等 `wait` 静默期后才允许下一次立即执行。
- trailing 版：在静止后补一次，常用作表单失焦兜底。
- 用一个 `timerId` 句柄管理定时器；用 `lastArgs` 保存最后一次参数；`cancel` 时清掉定时器与状态。

### 节流

核心：固定间隔最多执行一次。基于时间戳判断「自上次执行到现在是否够 `wait`」。

- leading：进入时立刻执行一次（默认 true）。
- trailing：最后一次触发后，若不足 `wait` 间隔，补一次保证不丢尾调用（默认 true）。
- 经典做法：用 `lastTime` 记录上次执行时间戳。当 `now - lastTime >= wait` 时执行 leading；同时用 `timer` 排一个尾部定时器实现 trailing。

## 完整实现

```js
/**
 * 防抖
 * @param {Function} fn 目标函数
 * @param {number} wait 等待毫秒
 * @param {Object} options { leading:false, trailing:true }
 */
function debounce(fn, wait = 300, options = {}) {
  const { leading = false, trailing = true } = options;
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;
  let invoked = false; // leading 已执行过、且还在冷却期

  // 真正执行回调
  function invoke() {
    if (lastArgs == null) return; // 没有缓存参数就不执行
    invoked = true;
    timerId = null;
    fn.apply(lastThis, lastArgs);
    lastArgs = null;
    lastThis = null;
  }

  function debounced(...args) {
    // leading：第一次进入且没有定时器时立即执行
    if (leading && timerId == null) {
      invoked = true;
      fn.apply(this, args);
    } else {
      // 普通模式：缓存最新参数
      lastArgs = args;
      lastThis = this;
    }

    // 每次触发都重置计时器
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      // trailing：静默 wait 后，如果有缓存参数则补一次
      if (trailing && lastArgs != null) {
        invoke();
      } else if (leading) {
        // 纯 leading 模式：冷却期结束，允许下一次立即执行
        invoked = false;
      }
      timerId = null;
    }, wait);
  }

  debounced.cancel = function () {
    if (timerId) clearTimeout(timerId);
    timerId = null;
    lastArgs = null;
    lastThis = null;
    invoked = false;
  };

  debounced.flush = function () {
    if (timerId) clearTimeout(timerId);
    invoke();
  };

  return debounced;
}

/**
 * 节流
 * @param {Function} fn 目标函数
 * @param {number} wait 间隔毫秒
 * @param {Object} options { leading:true, trailing:true }
 */
function throttle(fn, wait = 300, options = {}) {
  const { leading = true, trailing = true } = options;
  let lastTime = 0;
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;

  function invoke(args, thisArg, time) {
    fn.apply(thisArg, args);
    lastTime = time;
  }

  function throttled(...args) {
    const now = Date.now();

    // leading：第一次或冷却期已过，立即执行
    if (lastTime === 0 && !leading) {
      // 关闭 leading 时把首次视为「已执行过」
      lastTime = now;
    }

    const remaining = wait - (now - lastTime);
    lastArgs = args;
    lastThis = this;

    if (remaining <= 0 || remaining > wait) {
      // 时间到，立即执行
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      invoke(args, this, now);
      lastArgs = null;
      lastThis = null;
    } else if (!timerId && trailing && lastArgs != null) {
      // 不足 wait 且没有挂起定时器，安排 trailing
      timerId = setTimeout(() => {
        timerId = null;
        // 只有当 cooldown 内还有触发，才需要补一次
        if (lastArgs != null) {
          const t = Date.now();
          invoke(lastArgs, lastThis, t);
          lastArgs = null;
          lastThis = null;
        }
        // leading=false 时，第一次 lastTime 被设成 now，下一次仍要等 remaining
        if (!leading && lastTime === 0) {
          lastTime = 0;
        }
      }, remaining);
    }
  }

  throttled.cancel = function () {
    if (timerId) clearTimeout(timerId);
    timerId = null;
    lastTime = 0;
    lastArgs = null;
    lastThis = null;
  };

  return throttled;
}
```

## 边界与测试用例

```js
// 测试工具：模拟连续触发
function fireSequence(fn, intervals) {
  intervals.forEach((ms, i) => {
    setTimeout(() => fn(i), ms);
  });
}

// 1. 基础防抖：连续 0/50/100ms 触发，最终只在 100+wait 处执行一次
let count = 0;
const db = debounce(() => count++, 100);
fireSequence(db, [0, 50, 100]);
setTimeout(() => console.log('debounce basic', count), 250); // 1

// 2. leading 防抖：第一次立即执行，尾部不再补
let log = [];
const dl = debounce((i) => log.push(i), 100, { leading: true, trailing: false });
fireSequence(dl, [0, 50, 100]);
setTimeout(() => console.log('debounce leading', log), 250); // [0]

// 3. cancel 后不再执行
let called = false;
const dc = debounce(() => (called = true), 100);
dc();
dc.cancel();
setTimeout(() => console.log('debounce cancel', called), 200); // false

// 4. 节流：固定间隔触发，每 wait 毫秒最多一次
let times = 0;
const th = throttle(() => times++, 100);
fireSequence(th, [0, 30, 60, 90, 120, 150, 180]);
setTimeout(() => console.log('throttle basic', times), 300); // 大约 2~3 次

// 5. leading=false：不立即触发，靠 trailing 兜底
let hits = [];
const tl = throttle((i) => hits.push(i), 100, { leading: false, trailing: true });
fireSequence(tl, [0, 30, 60]);
setTimeout(() => console.log('throttle no-leading', hits), 200); // [2]

// 6. flush：立即触发挂起的执行
let val = 0;
const df = debounce(() => val++, 100);
df();
df.flush();
console.log('debounce flush', val); // 1
```

需要重点关注的边界：

- `this` 与参数必须正确绑定（用闭包缓存 `lastArgs` / `lastThis`），否则会丢参数。
- 定时器里的回调要捕获最新的 `args`，旧定时器要 `clearTimeout` 清理。
- `trailing` 模式下，如果整个冷却期内没有任何触发，不应该多执行一次（即 `lastArgs` 为空时不补执行）。
- `leading` + `trailing` 都开启时，初次立即执行 + 末尾不再补一次（避免连续两次）。
- 取消后再次调用应能正常工作，需要重置 `lastTime`。

## 应用场景

| 场景 | 选择 | 说明 |
| --- | --- | --- |
| 搜索框联想 | 防抖（trailing） | 用户停顿后再请求，避免每键一次 |
| 按钮防重复提交 | 防抖（leading） | 立即响应但冷却期屏蔽后续 |
| 窗口 `resize` 重算布局 | 防抖 | 拖动结束再算，避免大量重排 |
| 滚动加载/懒加载 | 节流 | 固定间隔检查可见性 |
| 拖拽时同步位置 | 节流 | 每 16ms 一次保证流畅 |
| 鼠标移动绘制轨迹 | 节流 | 控制采样率 |

## 进阶追问

1. **防抖和节流的本质区别？** 防抖关心「最后一次」，节流关心「固定频率」。防抖在静止后才执行；节流在过程中持续执行。
2. **为什么节流要分 leading 和 trailing？** leading 保证首次响应即时（用户感觉灵敏）；trailing 防止最后一次触发被丢弃（如最后一次滚动到底）。
3. **取消逻辑为什么要重置 `lastTime`？** `cancel` 应让函数恢复到「从未执行过」的初态，否则再次调用会以为还在冷却期。
4. **如何用 `requestAnimationFrame` 做节流？** 对 60fps 的动画场景，`rAF` 比定时器更顺滑，但只在浏览器可见时执行，且不可控间隔。
5. **lodash 的 debounce 与自己写的有什么区别？** lodash 支持 `maxWait`（最大等待时间），把防抖在长输入流中退化成节流；还支持 `flush` / `pending` 等控制方法。手写时按需引入即可。
6. **React 中如何用防抖？** 注意闭包陷阱：`useCallback` 中引用的 state 是旧的。要么用 `useRef` 保存最新值，要么用 `useDebounce` 之类的 hook 把依赖值本身防抖化。
