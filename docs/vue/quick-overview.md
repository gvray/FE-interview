---
sidebar_position: 2
---

# 快速预览

> 本文针对 **Vue 2**。

这里主要是快速介绍vue2的基本知识，适合以往熟练使用过vue2，但是隔了很长时间没有使用的人。这里帮你快速回复记忆。



## Vue是什么？

vue (读音 /vjuː/，类似于 **view**) 是一套用于构建用户界面的**渐进式框架**。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与[现代化的工具链](https://v2.cn.vuejs.org/v2/guide/single-file-components.html)以及各种[支持类库](https://github.com/vuejs/awesome-vue#libraries--plugins)结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。

## CLI安装

```shell
npm install -g @vue/cli
vue create your-project-name
```

## Vue 实例

每个 Vue 应用都是通过用 `Vue` 函数创建一个新的 **Vue 实例**开始的：

```js
var vm = new Vue({
  // 选项
})
```

下面是一个实际的项目：

```js
// main.js

// 导入 Vue 模块
import Vue from "vue";

// 导入根组件 App.vue
import App from "./App.vue";

// 导入路由配置
import router from "./router";

// 导入状态管理器配置
import store from "./store";

// 配置 Vue 的生产提示，设置为 false 以阻止 Vue 在启动时生成生产提示
Vue.config.productionTip = false;

// 创建一个新的 Vue 实例
new Vue({
  // 将路由配置传递给 Vue 实例，以便在整个应用程序中使用路由功能
  router,

  // 将状态管理器配置传递给 Vue 实例，以便在整个应用程序中使用状态管理器功能
  store,

  // 渲染根组件 App.vue，将其替换为虚拟 DOM 树中的真实 DOM 元素
  render: (h) => h(App),
}).$mount("#app"); // 将渲染后的 DOM 元素挂载到 id 为 app 的 HTML 元素上

```

### 选项/data

- **类型**：`Object | Function`。
- 当一个 Vue 实例被创建时，它将 `data` 对象中的所有的 property 加入到 Vue 的**响应式系统**中。

**示例**：

```js
var data = { a: 1 }

// 直接创建一个实例
var vm = new Vue({
  data: data
})
vm.a // => 1
vm.$data === data // => true

// Vue.extend() 中 data 必须是函数
var Component = Vue.extend({
  data: function () {
    return { a: 1 }
  }
})
```

注意，如果你为 `data` property 使用了箭头函数，则 `this` 不会指向这个组件的实例，不过你仍然可以将其实例作为函数的第一个参数来访问。

```js
data: vm => ({ a: vm.myProp })
```

:::warning

- 组件的定义只接受 `function`
- b没在data里，你是vm.b去赋值，这样b不会响应式
- Object.freeze() data的对象，阻止响应式

:::

### 选项/方法

- **类型**：`{ [key: string]: Function }`

- **示例**：

  ```js
  var vm = new Vue({
    data: { a: 1 },
    methods: {
      plus: function () {
        this.a++
      }
    }
  })
  vm.plus()
  vm.a // 2
  ```

### 选项/计算属性

- **类型**：`{ [key: string]: Function | { get: Function, set: Function } }`

- **示例**：

  ```js
  var vm = new Vue({
    data: { a: 1 },
    computed: {
      // 仅读取
      aDouble: function () {
        return this.a * 2
      },
      // 读取和设置
      aPlus: {
        get: function () {
          return this.a + 1
        },
        set: function (v) {
          this.a = v - 1
        }
      }
    }
  })
  vm.aPlus   // => 2
  vm.aPlus = 3
  vm.a       // => 2
  vm.aDouble // => 4
  ```

:::tip

VS方法，不同的是**计算属性是基于它们的响应式依赖进行缓存的**。只在相关响应式依赖发生改变时它们才会重新求值。

:::

### 选项/监听

- **类型**：`{ [key: string]: string | Function | Object | Array }`
- **示例**：

```js
var vm = new Vue({
  data: {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: {
      f: {
        g: 5
      }
    }
  },
  watch: {
    a: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    // 方法名
    b: 'someMethod',
    // 该回调会在任何被侦听的对象的 property 改变时被调用，不论其被嵌套多深
    c: {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    },
    // 该回调将会在侦听开始之后被立即调用
    d: {
      handler: 'someMethod',
      immediate: true
    },
    // 你可以传入回调数组，它们会被逐一调用
    e: [
      'handle1',
      function handle2 (val, oldVal) { /* ... */ },
      {
        handler: function handle3 (val, oldVal) { /* ... */ },
        /* ... */
      }
    ],
    // watch vm.e.f's value: {g: 5}
    'e.f': function (val, oldVal) { /* ... */ }
  }
})
vm.a = 2 // => new: 2, old: 1
```

### 选项/生命周期

```js
new Vue({
  // 选项...
  beforeCreate() {
    // 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。
    // 在这个阶段，实例上的属性和方法是不可用的。
  },
  created() {
    // 在实例创建完成后被立即调用。
    // 在这个阶段，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。
    // 然而，挂载阶段还没开始，$el 属性目前不可见。
  },
  beforeMount() {
    // 在挂载开始之前被调用：相关的 render 函数首次被调用。
    // 该钩子在服务器端渲染期间不被调用。
  },
  mounted() {
    // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。
    // 如果根实例挂载了一个文档内元素，则当实例被挂载时 vm.$el 也在文档内。
    // 注意 mounted 不会保证所有的子组件也都一起被挂载。
  },
  beforeUpdate() {
    // 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
    // 在这个阶段，你可以对数据进行任何改变，然后稍后会被渲染到视图。
  },
  updated() {
    // 由于数据更改导致的虚拟 DOM 重新渲染和打补丁之后会调用该钩子。
    // 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
    // 然而，在大多数情况下，你应该避免在此期间更改状态。
  },
  beforeDestroy() {
    // 在实例销毁之前调用。在这一步，实例仍然完全可用。
  },
  destroyed() {
    // 在实例销毁之后调用。该钩子被调用后，Vue 实例便解绑了全部指令、事件监听器。
  }
})

```



![生命周期](https://v2.cn.vuejs.org/images/lifecycle.png)

## 模版语法

### 插值

```html
// 文本
<span>Message: {{ msg }}</span>
<span v-once>这个将不会改变: {{ msg }}</span>

// 原始Html
<p>Using mustaches: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>

// HTML attribute 
<div v-bind:id="dynamicId"></div>
<button v-bind:disabled="isButtonDisabled">Button</button>

// js表达式
{{ number + 1 }}
{{ ok ? 'YES' : 'NO' }}
{{ message.split('').reverse().join('') }}
<div v-bind:id="'list-' + id"></div>

```

### 指令

1. `v-bind`

   ```html
   <!-- 完整语法 -->
   <a v-bind:href="url">...</a>
   
   <!-- 缩写 -->
   <a :href="url">...</a>
   
   <!-- 动态参数的缩写 (2.6.0+) -->
   <a :[key]="url"> ... </a>
   ```

2. `v-on`

   ```html
   <!-- 完整语法 -->
   <a v-on:click="doSomething">...</a>
   
   <!-- 缩写 -->
   <a @click="doSomething">...</a>
   
   <!-- 动态参数的缩写 (2.6.0+) -->
   <a @[event]="doSomething"> ... </a>
   ```

   

其他指令参考https://v2.cn.vuejs.org/v2/api/#%E6%8C%87%E4%BB%A4

## 组件

```js
// 全局组件挂载
Vue.component('DictTag', DictTag)

// ComponentB.vue
// 局部挂载组件
import ComponentA from './ComponentA'
import ComponentC from './ComponentC'

export default {
  components: {
    ComponentA,
    ComponentC
  },
  // ...
}
```

### Prop

父组件通过 `prop` 向子组件传递数据，子组件通过 `props` 选项声明接收的字段。

```js
// 子组件
export default {
  props: {
    title: { type: String, required: true },
    count: { type: Number, default: 0 },
  },
};

// 父组件
<Child :title="msg" :count="num" />
```

- 单向数据流：父→子，子组件不能直接修改父级 `prop`，需要通过事件通知父组件修改。
- 通过 `:.sync` 或 `v-model` 可以实现"伪双向"，本质仍是父子间的事件传递。
- 传递静态或动态值：静态值直接写 `title="hello"`，动态值用 `:title="msg"`。

### 自定义事件

子组件通过 `$emit` 触发事件，父组件通过 `v-on` / `@` 监听。

```js
// 子组件
this.$emit("update", newValue);

// 父组件模板
<Child @update="handleUpdate" />
```

- 事件名建议用 kebab-case（如 `item-click`）。
- 配合 `.sync` 修饰符可简化父子双向绑定：子组件 `$emit('update:title', val)`，父组件 `:title.sync="title"`。
- 原生事件：在组件上监听原生 DOM 事件需要用 `.native` 修饰符（Vue 2），Vue 3 已移除 `.native`，自动透传到根元素。

### 插槽

插槽用于内容分发，让父组件向子组件内部注入内容。

```html
<!-- 子组件 -->
<div>
  <slot>默认内容</slot>
</div>

<!-- 父组件 -->
<Child>
  <p>这段会替换 slot</p>
</Child>
```

- 具名插槽：`<slot name="header" />`，父组件用 `<template #header>...</template>`。
- 作用域插槽：子组件通过 `<slot :user="user">` 向父组件暴露数据，父组件用 `<template #default="{ user }">` 接收。
- Vue 2.6+ 与 Vue 3 统一使用 `v-slot` / `#` 语法。

### 动态 & 异步组件

**动态组件**通过 `<component :is="currentComponent">` 在不同组件之间切换。

```html
<component :is="currentComp" />
```

配合 `keep-alive` 缓存组件实例，避免重复渲染：

```html
<keep-alive>
  <component :is="currentComp" />
</keep-alive>
```

**异步组件**只在需要时才加载，配合路由懒加载或按需引入，常用于大型应用拆包：

```js
// Vue 2 写法
Vue.component("AsyncComp", (resolve) => {
  require(["./AsyncComp.vue"], resolve);
});

// Vue 3 / 工程化写法
import { defineAsyncComponent } from "vue";
const AsyncComp = defineAsyncComponent(() => import("./AsyncComp.vue"));

// 可附加加载状态
defineAsyncComponent({
  loader: () => import("./AsyncComp.vue"),
  loadingComponent: Loading,
  errorComponent: Error,
  delay: 200,
  timeout: 3000,
});
```

异步组件本质是返回 `Promise` 的工厂函数，结合 Webpack/Vite 的动态 `import()` 实现代码分割，提升首屏加载速度。