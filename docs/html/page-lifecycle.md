---
sidebar_position: 6
---

# 页面生命周期事件的理解：DOMContentLoaded，load，beforeunload，unload

## 1. **DOMContentLoaded**
### **作用**
- 该事件在 **HTML 解析完成并构建 DOM 之后** 触发。
- 但 **不等待 CSS、图片、iframe、JS 文件等外部资源的加载**。

### **触发时机**
- **当 HTML 文档完全解析完毕，且所有 `script`（如果没有 `defer` 或 `async`）执行完毕**，此事件就会触发。
- **不会等待 CSS、图片、iframe、视频等资源加载完成**。

### **适用场景**
- **DOM 操作**：如果你的代码只需要操作 DOM（比如修改文本、添加事件监听等），使用 `DOMContentLoaded` 事件更好，因为它比 `load` 事件触发得更快。

### **示例**
```javascript
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM 已加载完成，但外部资源可能仍未加载");
});
```
在这个示例中，代码会在 HTML 结构解析完成后执行，而不会等待图片等外部资源。

---

## 2. **load**
### **作用**
- 该事件在 **页面所有资源（包括 DOM、CSS、图片、iframe、字体、脚本等）都完全加载后** 触发。

### **触发时机**
- 只有当 **DOM 完全构建完成，所有样式、图片、iframe、脚本等外部资源都加载完毕** 后才会触发。

### **适用场景**
- **确保所有资源加载完毕**，比如图片轮播、网页统计、动画初始化等，避免资源未加载完导致的错误。
- **监听全页面的加载完成**，比如向用户展示“页面已加载”的提示。

### **示例**
```javascript
window.addEventListener("load", function () {
  console.log("整个页面（包括图片、CSS、iframe 等）加载完成");
});
```
该事件的触发通常比 `DOMContentLoaded` 晚，适合用于确保所有资源都已可用的场景。

---

## 3. **beforeunload**
### **作用**
- 该事件在 **用户即将离开页面（关闭、刷新、跳转到新页面等）之前** 触发。
- 通常用于 **提示用户是否确认离开页面**，防止数据丢失。

### **触发时机**
- 当 **用户尝试关闭、刷新、导航到其他页面** 时，浏览器会触发此事件。

### **适用场景**
- **防止用户误操作（如关闭未保存的表单）**。
- **在离开页面前执行一些清理操作**（如保存数据、记录日志、断开 WebSocket 连接等）。

### **示例**
```javascript
window.addEventListener("beforeunload", function (event) {
  event.preventDefault(); // 标准写法（某些浏览器可能忽略）
  event.returnValue = "您确定要离开此页面吗？"; // 兼容某些浏览器
});
```
⚠️ **注意**
- 现代浏览器可能不会显示 `returnValue` 自定义文本，而是显示默认的离开提示。
- `beforeunload` 可能会影响用户体验，因此应该谨慎使用。

---

## 4. **unload**
### **作用**
- 该事件在 **用户离开页面（关闭、刷新、跳转）时触发**，但不会阻止页面的卸载。
- **适用于最后的清理工作**，如记录日志、释放资源、断开网络连接等。

### **触发时机**
- 当 **页面完全卸载并从浏览器的内存中移除时**，触发 `unload` 事件。
- **不能阻止页面的卸载**，但可以在离开前执行一些清理操作。

### **适用场景**
- **清理 WebSocket 连接**，断开与服务器的长连接。
- **记录用户离开时间**，用于分析用户行为。
- **释放内存资源**，如清除缓存或 localStorage 数据。

### **示例**
```javascript
window.addEventListener("unload", function () {
  console.log("用户已离开页面，可以清理资源");
});
```
⚠️ **注意**
- `unload` 事件中的代码 **不能执行异步操作**，因为页面会立即关闭，任何 `setTimeout` 或异步请求都可能无法执行完成。
- `unload` 事件通常不会显示任何提示，而是直接执行清理代码。

---

## **事件触发顺序**
### **正常加载**
```
1. DOMContentLoaded —— DOM 结构解析完毕
2. load —— 所有资源加载完成
```

### **用户离开页面**
```
1. beforeunload —— 询问用户是否确定离开（可阻止）
2. unload —— 页面卸载，清理资源（不可阻止）
```

---

## **总结**
| 事件名 | 触发时机 | 是否等待外部资源 | 是否可阻止 | 适用场景 |
|--------|----------|----------------|------------|------------|
| `DOMContentLoaded` | HTML 解析完成 | ❌ 不等待 | ❌ 不能阻止 | 仅需操作 DOM，不依赖外部资源 |
| `load` | 页面所有资源加载完毕 | ✅ 等待 | ❌ 不能阻止 | 确保所有资源加载完后再执行代码 |
| `beforeunload` | 用户尝试离开页面 | - | ✅ 可以阻止 | 提示用户避免误操作（如未保存数据） |
| `unload` | 页面即将卸载 | - | ❌ 不能阻止 | 记录日志、断开连接、释放资源 |

---

## **最佳实践**
- **如果你只需要操作 DOM**（如修改文本、添加事件监听器等），使用 `DOMContentLoaded`，避免等待不必要的资源加载：
  ```javascript
  document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM 解析完毕");
  });
  ```
- **如果你需要等待所有资源（包括图片、CSS 等）加载完毕**，使用 `load`：
  ```javascript
  window.addEventListener("load", function () {
    console.log("所有资源加载完毕");
  });
  ```
- **如果你希望在用户离开页面前进行一些确认**，使用 `beforeunload`：
  ```javascript
  window.addEventListener("beforeunload", function (event) {
    event.returnValue = "您确定要离开吗？";
  });
  ```
- **如果你想在页面关闭时做一些清理工作**（如断开 WebSocket），使用 `unload`：
  ```javascript
  window.addEventListener("unload", function () {
    console.log("页面已关闭，清理资源");
  });
  ```

这些事件在实际开发中经常用到，合理使用可以优化用户体验，提高页面性能！🚀