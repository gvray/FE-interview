---
sidebar_position: 2
---
# FAQ?

## Vue2和Vue3的兼容性

[非兼容性改变](https://v3-migration.vuejs.org/zh/breaking-changes/)

## watch与watchEffect 有什么区别，分别在什么场景下使用？

| 特性         | `watch`                                    | `watchEffect`                            |
| ------------ | ------------------------------------------ | ---------------------------------------- |
| **依赖收集** | 显式指定依赖                               | 自动收集依赖                             |
| **执行时机** | 默认在依赖变化后执行（可配置 `immediate`） | 创建时立即执行一次                       |
| **异步支持** | 支持异步，支持 `onInvalidate` 清理副作用   | 支持异步，支持 `onInvalidate` 清理副作用 |
| **性能开销** | 相对较低（因为依赖是显式的）               | 可能较高（因为依赖是自动收集的）         |

| 如果你需要...          | 推荐                            |
| ---------------------- | ------------------------------- |
| 监听具体变量           | `watch`                         |
| 需要新旧值对比         | `watch`                         |
| 多个依赖且不想手动指定 | `watchEffect`                   |
| 立即执行副作用逻辑     | `watchEffect`                   |
| 需要清理副作用         | 两者都可以，使用 `onInvalidate` |

## Pinia 有哪些使用场景？

Pinia 适用的场景非常广泛，涵盖全局状态管理、异步请求、模块化管理、状态持久化、TypeScript 支持等功能。在现代 Vue 3 项目中，Pinia 是轻量、高效、易用的状态管理工具，能够帮助开发者更好地组织和维护复杂的应用逻辑。

## 说说 Pinia 与 Vuex 的区别

| 对比点       | Pinia                          | Vuex                   |
| ------------ | ------------------------------ | ---------------------- |
| **易用性**   | 轻量简单，贴合 Vue3 API        | 配置严格，学习成本较高 |
| **类型支持** | 内置类型推导，TypeScript 友好  | 类型支持需手动实现     |
| **性能**     | 基于 Vue3 响应式系统，性能更优 | Vue2 响应式性能稍逊    |
| **模块化**   | 扁平化设计，模块更灵活         | 嵌套模块，适合大型项目 |

在 Vue3 中，**Pinia 是官方推荐的状态管理库**，相比 Vuex 更轻量、现代，适合新项目开发；而 Vuex 在一些老旧的 Vue2 项目中仍有广泛使用。

## 说说你对 Vue 中异步组件的理解

Vue 中的异步组件是一个非常强大的特性，允许按需加载组件，减少应用的初始加载时间，提高性能。通过使用 `defineAsyncComponent` 和动态 `import()`，开发者可以轻松地实现这一特性，并通过加载状态提高用户体验。然而，使用异步组件时也要注意网络请求带来的开销、管理复杂性以及可能的 SEO 问题。

## 怎么理解 Vue3 提供的 markRaw ？

`markRaw` 是 Vue 3 提供的一个重要工具，允许开发者在需要的情况下绕过响应式系统，以提升性能并减少不必要的开销。它适用于那些不需要被 Vue 观察的对象，帮助开发者更灵活地管理应用中的响应式数据。

## 手写 vue 的双向绑定

手写 Vue 的双向绑定可以通过使用 JavaScript 的 `Object.defineProperty()`（在 Vue 2 中）或 `Proxy`（在 Vue 3 中）来实现数据响应式。下面是一个简单的实现示例，展示了如何手动实现双向绑定。

 **1. 使用 `Object.defineProperty()` 实现 Vue 2 风格的双向绑定**

**步骤**：

1. **创建一个 Vue 实例**。
2. **实现数据的响应式**。
3. **创建一个简单的 `watcher` 用于更新 DOM**。
4. **实现双向绑定**。

**示例代码**：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue-like Two-way Binding</title>
</head>
<body>
    <div id="app">
        <input type="text" v-model="message">
        <p>{{ message }}</p>
    </div>

    <script>
        // 实现 Vue 实例
        class Vue {
            constructor(options) {
                this.data = options.data;
                this.el = document.querySelector(options.el);
                this.bindings = [];

                // 数据响应式
                this.observe(this.data);

                // 编译模板
                this.compile(this.el);
            }

            // 将数据转换为响应式
            observe(data) {
                Object.keys(data).forEach(key => {
                    let value = data[key];
                    const bindings = [];
                    
                    Object.defineProperty(data, key, {
                        get() {
                            // 这里添加依赖
                            if (Dep.target) {
                                bindings.push(Dep.target);
                            }
                            return value;
                        },
                        set(newValue) {
                            value = newValue;
                            bindings.forEach(fn => fn());
                        }
                    });
                });
            }

            // 编译模板
            compile(el) {
                const nodes = el.childNodes;
                nodes.forEach(node => {
                    if (node.nodeType === 1) { // 处理元素节点
                        const attr = node.getAttribute('v-model');
                        if (attr) {
                            this.bindings.push({
                                node,
                                key: attr,
                                update: () => {
                                    node.value = this.data[attr];
                                }
                            });
                            node.addEventListener('input', e => {
                                this.data[attr] = e.target.value;
                            });
                        }
                    } else if (node.nodeType === 3) { // 处理文本节点
                        const text = node.textContent.trim();
                        const regExp = /\{\{\s*(\w+)\s*\}\}/;
                        const match = text.match(regExp);
                        if (match) {
                            const key = match[1];
                            this.bindings.push({
                                node,
                                key,
                                update: () => {
                                    node.textContent = this.data[key];
                                }
                            });
                        }
                    }
                });

                // 更新绑定
                this.updateBindings();
            }

            // 更新所有绑定
            updateBindings() {
                this.bindings.forEach(binding => binding.update());
            }
        }

        // 依赖管理
        class Dep {
            static target = null;
        }

        // 创建 Vue 实例
        new Vue({
            el: '#app',
            data: {
                message: 'Hello Vue!'
            }
        });
    </script>
</body>
</html>
```

 **2. 使用 `Proxy` 实现 Vue 3 风格的双向绑定**

**步骤**：

1. **创建一个 Vue 实例**。
2. **实现数据的响应式使用 `Proxy`**。
3. **实现双向绑定**。

**示例代码**：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue-like Two-way Binding</title>
</head>
<body>
    <div id="app">
        <input type="text" data-bind="message">
        <p>{{ message }}</p>
    </div>

    <script>
        // 实现 Vue 实例
        function Vue(options) {
            this.data = options.data;
            this.el = document.querySelector(options.el);

            // 数据响应式
            this.proxyData(this.data);

            // 编译模板
            this.compile(this.el);
        }

        Vue.prototype.proxyData = function(data) {
            this._data = new Proxy(data, {
                get: (target, key) => {
                    // 返回数据值
                    return target[key];
                },
                set: (target, key, value) => {
                    // 更新数据
                    target[key] = value;
                    // 触发视图更新
                    this.update();
                    return true;
                }
            });
        };

        Vue.prototype.compile = function(el) {
            const nodes = el.childNodes;
            nodes.forEach(node => {
                if (node.nodeType === 1) { // 处理元素节点
                    const attr = node.getAttribute('data-bind');
                    if (attr) {
                        node.value = this._data[attr];
                        node.addEventListener('input', e => {
                            this._data[attr] = e.target.value;
                        });
                    }
                } else if (node.nodeType === 3) { // 处理文本节点
                    const text = node.textContent.trim();
                    const regExp = /\{\{\s*(\w+)\s*\}\}/;
                    const match = text.match(regExp);
                    if (match) {
                        const key = match[1];
                        node.textContent = this._data[key];
                    }
                }
            });
        };

        Vue.prototype.update = function() {
            const nodes = this.el.querySelectorAll('[data-bind]');
            nodes.forEach(node => {
                const key = node.getAttribute('data-bind');
                node.value = this._data[key];
            });

            const textNodes = this.el.querySelectorAll('p');
            textNodes.forEach(node => {
                const regExp = /\{\{\s*(\w+)\s*\}\}/;
                const text = node.textContent.trim();
                const match = text.match(regExp);
                if (match) {
                    const key = match[1];
                    node.textContent = this._data[key];
                }
            });
        };

        // 创建 Vue 实例
        new Vue({
            el: '#app',
            data: {
                message: 'Hello Vue!'
            }
        });
    </script>
</body>
</html>
```