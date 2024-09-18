---
sidebar_position: 3
---
# FAQ?

> 本 FAQ 涵盖 **Vue 2** 与 **Vue 3** 的问题，部分题目同时涉及两个版本。标有 **[Vue3]** 的题目针对 Vue 3。

## Vue 的基本原理

Vue.js 是一种流行的前端 JavaScript 框架，它采用了基于组件的开发模式，旨在简化构建交互式的用户界面。以下是 Vue.js 的基本原理：

1. 响应式数据绑定：
   Vue.js 使用了响应式数据绑定的机制。在 Vue 实例中，可以通过将数据对象添加到 `data` 属性中来定义响应式的数据。当数据发生变化时，Vue.js 能够自动追踪变化，并更新相关的视图。这样，开发者只需要关注数据的变化，而无需手动操作 DOM。

2. 虚拟 DOM：
   Vue.js 使用虚拟 DOM（Virtual DOM）来优化 DOM 操作的性能。虚拟 DOM 是一个 JavaScript 对象树，它与真实的 DOM 结构保持同步。当数据发生变化时，Vue.js 首先更新虚拟 DOM，然后通过算法比较虚拟 DOM 和真实 DOM 的差异，最后只对需要更新的部分进行实际的 DOM 操作，从而减少了对真实 DOM 的操作次数，提高了性能。

3. 组件化开发：
   Vue.js 提供了组件化开发的能力，将页面拆分为多个组件，每个组件都有自己的状态和行为。组件可以嵌套使用，形成复杂的应用程序。每个组件都包含模板、数据和方法，可以独立开发、测试和复用。

4. 指令和模板语法：
   Vue.js 提供了丰富的指令和模板语法，用于操作 DOM、绑定数据和实现动态的视图逻辑。指令是以 `v-` 开头的特殊属性，用于操作 DOM 元素，例如 `v-bind` 用于数据绑定，`v-if` 用于条件渲染，`v-for` 用于列表渲染等。

5. 生命周期钩子：
   Vue.js 提供了一系列的生命周期钩子函数，用于在组件生命周期的不同阶段执行特定的操作。例如，在组件创建前、创建后、更新前、更新后等阶段，可以分别执行相应的钩子函数，以便进行初始化、数据处理、销毁等操作。

6. 双向数据绑定：
   Vue.js 支持双向数据绑定，即数据的变化会自动更新视图，同时视图的变化也可以自动更新数据。通过 `v-model` 指令，可以将表单元素和数据进行双向绑定。

通过以上的原理和特性，Vue.js 实现了简洁、高效的前端开发方式，使开发者能够更轻松地构建交互式的用户界面。

## 双向数据绑定的原理

双向数据绑定是 Vue.js 的核心特性之一，它可以实现数据的自动同步，即当数据发生变化时，视图会自动更新；同时，当用户在视图中修改数据时，数据也会自动更新。

双向数据绑定的原理可以简要概括为以下几个步骤：

1. 数据劫持（Data Observing）：
   在 Vue.js 中，通过使用 Object.defineProperty() 方法对数据对象进行劫持。这个方法允许我们定义一个对象的属性，并控制该属性的读取和写入。在数据对象中的每个属性都会被劫持，即在访问或修改属性时会触发对应的 getter 和 setter 函数。

2. 模板编译（Template Compilation）：
   Vue.js 在编译阶段将模板转换成渲染函数。模板中的指令（如 v-model）和插值表达式（如 `{{ data }}`）会被解析，相应的指令会被替换为对应的事件监听器和数据绑定。在编译过程中，会根据模板中的指令和表达式建立对数据对象的依赖关系。

3. 依赖收集（Dependency Collection）：
   在模板编译过程中，Vue.js 会建立一个依赖收集器（Dependency Collection）。当模板中的指令和表达式与数据对象相关联时，依赖收集器会收集这些依赖关系，建立起视图和数据之间的关联。

4. 响应式触发（Reactivity Triggering）：
   当数据对象的属性被访问或修改时，劫持属性的 setter 函数会被触发。在 setter 函数中，Vue.js 会通知依赖收集器，标记相关的依赖项为“脏”（dirty）状态。

5. 视图更新（View Updating）：
   当数据对象的属性被标记为“脏”状态后，Vue.js 会触发更新过程，将新的数据值应用到视图中。这个过程涉及到虚拟 DOM 的比较算法，Vue.js 会对虚拟 DOM 树进行比较，找出差异，并最终更新真实的 DOM，保持视图和数据的同步。

通过上述步骤，Vue.js 实现了双向数据绑定的原理。数据的变化会自动更新视图，视图的变化也会自动更新数据，使得开发者可以更方便地进行数据的管理和操作。

## template 标签为什么不可以使用 v-show？

- **`<template>`** 是一个 **占位符标签**，它本身不会被渲染成 DOM 元素，所以无法使用 `v-show`。
- 如果要控制条件渲染或显示/隐藏，应该将 `v-show` 或 `v-if` 应用到实际的 DOM 元素（如 `<div>`、`<span>` 等）上，而不是 `<template>` 本身。

## Vue 中的 h 函数有什么用？

- `h` 函数是 Vue 中创建虚拟 DOM 的核心工具，灵活性高，支持动态组件、嵌套结构和属性传递。
- 它使得开发者可以在没有模板的情况下，以编程的方式构建组件，适用于复杂的渲染逻辑。
- 在性能上，通过虚拟 DOM 的机制，提升了应用的响应速度和渲染效率。

## 有使用过Vue吗？说说你对Vue理解

Vue 是一款用于构建用户界面的**渐进式** JavaScript 框架，核心理解可以从以下几个维度展开：

1. **渐进式框架**：核心库只关注视图层，可以根据项目需要逐步引入路由（Vue Router）、状态管理（Pinia/Vuex）、构建工具（Vite）等生态，既可作为轻量库混入老项目，也可作为完整框架支撑大型应用。

2. **响应式数据驱动**：通过数据劫持 + 发布订阅模式（Vue 2 用 `Object.defineProperty`，Vue 3 用 `Proxy`），数据变化时自动更新视图，开发者只需关心数据本身，不必手动操作 DOM。

3. **组件化开发**：将 UI 拆分为可复用、可嵌套的组件，每个组件包含模板、逻辑、样式，单文件组件 `.vue` 把三者封装在一起，复用性和可维护性好。

4. **声明式渲染**：通过模板语法（`{{ }}`、`v-bind`、`v-if`、`v-for`）声明式地把数据渲染到 DOM，UI 是状态的函数。

5. **虚拟 DOM + Diff 算法**：通过虚拟 DOM 减少真实 DOM 操作，Vue 3 还引入 PatchFlag、Block Tree、静态提升等编译期优化，进一步提升性能。

6. **生态完善**：Vue Router、Pinia/Vuex、Vite、Vue CLI、Element Plus、Vant、Nuxt 等配套齐全，且由官方统一维护，体验一致。

**实际项目使用经验：**

- 使用 Vue 2 开发过中后台管理系统（基于 Element UI + Vuex + Vue Router），负责权限管理、动态表单、图表等模块。
- 使用 Vue 3 + Vite + Pinia + Element Plus 开发移动端 / PC 端应用，利用 Composition API 复用逻辑、`<script setup>` 简化书写、配合 TS 提升可维护性。
- 对 Vue 的常见优化（`v-show` vs `v-if`、`key` 的作用、长列表虚拟滚动、组件懒加载、keep-alive 缓存）和常见坑（数组响应式、对象新增属性用 `Vue.set` / `reactive`、`nextTick` 时机）有实战经验。

整体上，Vue 的设计哲学是“轻量、渐进、易上手但能支撑大型应用”，在开发者体验和性能之间取得了很好的平衡。

## 说说Vue的优缺点

**优点：**

1. **简单易学**：模板语法接近 HTML，上手门槛低，官方文档完善（尤其中文社区），新手能快速产出。
2. **渐进式架构**：可作为轻量库引入，也可作为完整框架（全家桶）使用，灵活度高。
3. **响应式 + 双向绑定**：数据驱动，减少手动 DOM 操作，开发效率高，特别适合表单密集的中后台系统。
4. **组件化与单文件组件**：`.vue` 把模板、逻辑、样式封装在一起，作用域隔离，复用性好。
5. **生态完善且官方维护**：Vue Router、Pinia/Vuex、Vite、Vue CLI、Vitepress 配套齐全，体验一致，不像 React 那样需要从社区方案中选型。
6. **性能优秀**：虚拟 DOM + Diff、Vue 3 编译期优化（静态提升、PatchFlag、Block Tree）、Tree-shaking 友好，包体积小（gzip ~10KB）。
7. **Composition API**：逻辑复用更优雅，TS 支持更好，解决了 Options API 在大型项目中逻辑分散的问题。
8. **中文社区活跃**：国内使用率高，遇到问题易找到中文资料。

**缺点：**

1. **过度灵活**：Options API 在大型项目里，相同逻辑散落在 `data`/`methods`/`computed`/`watch` 中，维护性差（Composition API 已大幅改善，但老项目仍存在）。
2. **生态相对 React 较小**：第三方库、原生跨端方案（如 React Native）少于 React，海外大厂采用率低于 React。
3. **Vue 2 TS 支持弱**：类型推导不友好，需要 `vue-class-component` 或 `vue-property-decorator`（Vue 3 已大幅改善）。
4. **响应式坑**：Vue 2 对数组、新增对象属性需要 `Vue.set` / `$set`，对象深度监听开销大；老版本 `Object.defineProperty` 不能监听新增/索引操作（Vue 3 用 Proxy 解决）。
5. **SEO 不友好**：SPA 天然劣势，需要 SSR（Nuxt）兜底。
6. **海外就业市场**：国内使用率极高，但海外（尤其北美）大型企业更倾向 React，简历适配度有地域差异。

总体而言，Vue 在中小型项目和国内中后台场景优势明显，在超大型项目或跨端场景下与 React 各有取舍。

## Vue和React有什么不同？使用场景分别是什么？

**核心区别：**

| 维度 | Vue | React |
|------|-----|-------|
| 定位 | 渐进式框架（视图 + 生态） | UI 库（库 + 自由组合生态） |
| 模板 | 推荐用模板（指令 `v-if`/`v-for`） | JSX（JS 的力量，灵活） |
| 数据流 | 双向绑定（`v-model`） + 响应式 | 单向数据流 + `useState`/`useReducer` |
| 响应式 | Vue 3 Proxy 自动追踪依赖 | 手动通过 hooks 声明依赖 |
| 组件逻辑复用 | Composition API（`useXxx`） | Hooks（`useXxx`） |
| 生态 | 官方维护 Router/State | 社区方案居多（Router/Redux 等） |
| 编译 | 模板编译期可优化（静态提升） | JSX 运行时为主（新架构有编译器） |
| 学习曲线 | 平缓 | 稍陡（JSX、函数式思维） |
| TS 支持 | Vue 3 支持良好 | 原生友好 |
| 社区 | 国内活跃 | 全球更大 |

**详细差异：**

1. **理念不同**：Vue 是“框架”，提供一整套约定俗成的方案（Router、State 都官方）；React 是“库”，只管视图，其他交给生态，自由度高但也意味着选型成本。
2. **模板 vs JSX**：Vue 模板语法限制多但约束强、编译期可优化；JSX 灵活、可写任意 JS，但性能优化依赖运行时和手动 memo。
3. **响应式模型**：Vue 是“可变 + 自动依赖追踪”（改 `ref.value` 即可）；React 是“不可变 + 重渲染 + 依赖对比”（必须 `setState` 生成新值），React 有著名的“闭包陈旧值”和“deps 写错”问题，Vue 则没有。
4. **组件写法**：Vue 有 `<script setup>` 编译期糖，简洁；React 函数组件每次渲染都重新执行，心智模型不同。

**使用场景：**

- **Vue**：中后台管理系统（Element Plus 等组件库成熟）、对开发速度/学习成本敏感的项目、国内团队、需要快速交付的中小型应用、SEO 需求强的内容站（配合 Nuxt）。
- **React**：大型复杂应用、跨端（React Native）、生态依赖多（如 Next.js、Remix）、海外团队、需要更精细控制和更高自由度的项目。

两者本质都是组件化 + 声明式 + 数据驱动，选型更多看团队技术栈、人员储备和具体需求，而非绝对优劣。

## 什么是虚拟DOM？

**虚拟 DOM（Virtual DOM）** 是一个用普通 JavaScript 对象描述真实 DOM 结构的树形数据结构，是真实 DOM 的一层抽象。

**结构示例：**

```js
// 真实 DOM
// <div id="app" class="box">
//   <span>hello</span>
// </div>

// 对应的虚拟 DOM（VNode）
{
  tag: 'div',
  props: { id: 'app', class: 'box' },
  children: [
    { tag: 'span', props: {}, children: ['hello'] }
  ]
}
```

**为什么需要虚拟 DOM：**

1. **性能优化**：直接操作真实 DOM 代价昂贵（会触发重排重绘、可能引起频繁的布局计算）。通过对比新旧虚拟 DOM 树（Diff 算法），仅把差异部分 patch 到真实 DOM，减少 DOM 操作次数。
2. **跨平台**：虚拟 DOM 不依赖浏览器环境，可渲染到不同终端（Web、SSR、移动端 Weex/React Native 思路），框架核心与平台解耦。
3. **声明式开发**：开发者只需描述 UI 应该是什么样子（状态 → UI 的映射），框架自动完成 DOM 更新，关注点从“怎么改 DOM”转向“UI 是状态的函数”。

**Diff 算法核心：**

- **同层比较**：只对比同层级节点，不跨层移动（复杂度从 O(n³) 降到 O(n)）。
- **类型相同才复用**：不同类型的节点直接替换，相同类型复用 DOM 并比较属性/子节点。
- **key 优化**：通过 `key` 识别列表中的节点，减少不必要的重建（`v-for` 必须加 key，且应稳定唯一）。

**Vue 中的虚拟 DOM：**

- Vue 2 的 VNode 由 `_c()` / `h()` 生成，渲染函数执行后产出 VNode，再通过 patch 挂载到真实 DOM。
- Vue 3 的 VNode 引入 **PatchFlag**（编译期标记动态节点），Diff 时只对比动态部分，跳过静态部分。
- 静态节点会被 **静态提升**（hoistStatic），提到渲染函数外部，避免每次重新创建。

**注意：** 虚拟 DOM 并非总是比直接操作 DOM 快，它的价值在于“性能足够好 + 声明式开发 + 跨平台”，是一个工程权衡。极致性能场景下，手写 DOM 操作仍可能更快，但开发效率和维护性会大幅下降。

## 请描述下vue的生命周期是什么？

Vue 组件从创建、运行到销毁的整个过程称为生命周期，框架在每个阶段暴露对应的钩子函数，让开发者在合适时机执行逻辑（如发请求、操作 DOM、清理资源等）。

**Vue 2 生命周期（8 个核心 + keep-alive 相关）：**

| 钩子 | 触发时机 | 常见用途 |
|------|---------|---------|
| `beforeCreate` | 实例初始化后，data/methods 未可用 | — |
| `created` | 实例创建完成，data/methods 可用，未挂载 | 发请求、初始化数据 |
| `beforeMount` | 模板编译完成，未挂载到页面 | — |
| `mounted` | 挂载完成，`$el` 可访问 | 操作 DOM、初始化第三方库 |
| `beforeUpdate` | 数据更新前，DOM 还未重渲染 | 获取更新前状态 |
| `updated` | 数据更新且 DOM 重渲染完成 | 操作新 DOM（避免在此改数据） |
| `beforeDestroy` | 实例销毁前 | 清理定时器、解绑事件 |
| `destroyed` | 实例销毁完成 | — |
| `activated` / `deactivated` | keep-alive 激活/停用 | 缓存组件处理 |
| `errorCaptured` | 捕获子孙组件错误 | 错误上报 |

**Vue 3 生命周期（Composition API 形式）：**

| Options API | Composition API |
|-------------|-----------------|
| `beforeCreate` / `created` | `setup()` 本身（无需单独钩子） |
| `beforeMount` | `onBeforeMount` |
| `mounted` | `onMounted` |
| `beforeUpdate` | `onBeforeUpdate` |
| `updated` | `onUpdated` |
| `beforeUnmount` | `onBeforeUnmount` |
| `unmounted` | `onUnmounted` |
| `errorCaptured` | `onErrorCaptured` |

**父子组件执行顺序：**

- 挂载：父 `beforeMount` → 子 `beforeMount` → 子 `mounted` → 父 `mounted`
- 更新：父 `beforeUpdate` → 子 `beforeUpdate` → 子 `updated` → 父 `updated`
- 销毁：父 `beforeUnmount` → 子 `beforeUnmount` → 子 `unmounted` → 父 `unmounted`

```js
// Vue 3 <script setup> 示例
import { ref, onMounted, onBeforeUnmount } from 'vue'

const timer = ref(null)

onMounted(() => {
  console.log('组件挂载完成，可操作 DOM')
  timer.value = setInterval(() => console.log('tick'), 1000)
})

onBeforeUnmount(() => {
  console.log('组件即将卸载，清理定时器')
  clearInterval(timer.value)
})
```

**常见考点：**

- 请求数据一般放在 `created`（Vue 2）或 `setup`（Vue 3），更早拿到数据；如果需要操作 DOM 才放 `mounted`。
- 销毁阶段必须清理定时器、全局事件监听、WebSocket 等，避免内存泄漏。
- `updated` 中不要直接修改响应式数据，否则可能死循环。
- SSR 场景下 `mounted` 不会执行（服务端无 DOM），数据请求需在 `created`/`setup` 中完成。

## vue如何监听键盘事件？

**方式 1：原生 `@keydown` / `@keyup` + 事件处理函数**

```vue
<template>
  <input @keyup="handleKeyup" @keydown.enter="handleEnter" />
</template>

<script setup>
function handleKeyup(e) {
  console.log('按下：', e.key, e.keyCode)
}
function handleEnter() {
  console.log('回车键')
}
</script>
```

**方式 2：Vue 内置按键修饰符**

```vue
<!-- 常用别名：enter / tab / delete / esc / space / up / down / left / right -->
<input @keyup.enter="submit" />
<input @keydown.ctrl.c="copy" />

<!-- 组合修饰键：.ctrl .alt .shift .meta（Mac Command） -->
<input @keyup.alt.enter="clear" />
<button @ctrl.click="doSomething">Ctrl + 点击</button>

<!-- .exact 限定必须且只能是指定组合键 -->
<input @click.ctrl.exact="onCtrlClick" />
```

**方式 3：Vue 3 自定义按键别名**

Vue 3 移除了 keyCode 用法，推荐直接使用 `KeyboardEvent.key`（如 `'a'`、`'Enter'`、`'Escape'`），也可在模板中直接用：

```vue
<!-- 监听具体字母键 -->
<input @keyup.a="handleA" />
<!-- 通过函数内部判断更复杂的按键 -->
<input @keyup="(e) => e.key === 'a' && fn()" />
```

**方式 4：监听全局键盘事件**

适合快捷键场景（如 Esc 关闭弹窗、Ctrl+S 保存），需在 `mounted` 注册、`beforeUnmount` 解绑：

```vue
<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

function handleKeydown(e) {
  if (e.key === 'Escape') close()
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    save()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>
```

**方式 5：第三方库（hotkeys-js、mousetrap）封装为指令**

适合快捷键较多的复杂应用，统一管理绑定：

```js
import hotkeys from 'hotkeys-js'
hotkeys('ctrl+s, ctrl+shift+a', (event, handler) => {
  switch (handler.key) {
    case 'ctrl+s': save(); break
    case 'ctrl+shift+a': doA(); break
  }
})
```

**注意事项：**

- 表单元素需聚焦才能拿到键盘事件，全局监听需绑定到 `window`/`document`。
- 组件卸载时务必解绑，避免内存泄漏和重复触发。
- 阻止默认行为用 `@keydown.prevent` 或在 handler 中调用 `e.preventDefault()`。

## watch怎么深度监听对象变化

**Vue 2 / Vue 3 Options API：**

```js
watch: {
  obj: {
    handler(newVal, oldVal) {
      console.log('obj 变了', newVal)
    },
    deep: true,        // 深度监听对象内部变化
    immediate: true    // 立即执行一次回调
  }
}
```

**Vue 3 Composition API：**

```js
import { watch, ref, reactive } from 'vue'

const obj = reactive({ a: { b: 1 } })

// 方式 1：deep 选项
watch(
  obj,
  (newVal, oldVal) => {
    console.log('obj 变了', newVal)
  },
  { deep: true, immediate: true }
)

// 方式 2：直接监听某个嵌套属性（getter 函数）
watch(
  () => obj.a.b,
  (newVal, oldVal) => {
    console.log('a.b 变了', newVal, oldVal)
  }
)
```

**关键点：**

1. **`deep: true`** 会递归遍历对象的所有嵌套属性，性能开销较大，对象层级深时慎用，可用监听具体属性代替。
2. 监听 `reactive` 对象时，**newValue 和 oldValue 指向同一个对象**（因为是引用修改，并非替换），所以 oldValue 不会是旧值。要拿到旧值可用 getter 函数返回深拷贝：
   ```js
   watch(
     () => _.cloneDeep(obj),
     (newVal, oldVal) => { /* 此处 oldVal 才是真正的旧值 */ }
   )
   ```
3. **监听整个 reactive 对象默认就是深层的**（Vue 3 中 reactive 自身递归代理），但仍建议显式写 `deep: true` 表明意图；监听 `ref` 对象则需要 `deep: true`。
4. **监听数组**：直接 `watch(arr, fn)` 能感知“替换整个数组”和“调用变异方法（push/splice 等）”；如果数组元素是对象，要监听对象内部变化同样需要 `deep: true`。
5. **`watchEffect`** 是自动依赖收集版本，适合不关心旧值、只关心副作用的场景，无需显式声明监听源。

**替代方案：** 多数能用 `watch` 深度监听的场景，可以改用 `computed` 派生 + 监听计算属性，或拆分成多个具体属性的 watcher，性能更好且更清晰。

## 删除数组用delete和Vue.delete有什么区别？

**JavaScript 原生 `delete`：**

```js
const arr = ['a', 'b', 'c']
delete arr[1]
console.log(arr)        // ['a', empty, 'c']
console.log(arr.length) // 3 —— 长度不变
console.log(arr[1])     // undefined
```

`delete` 只是把数组对应索引位置设为**空槽（empty slot）**，**不会改变数组长度**，留下稀疏数组，后续元素也不会前移。

**`Vue.delete`（Vue 2）/ `vm.$delete`：**

```js
// Vue 2
this.$delete(this.arr, 1)
// 或
Vue.delete(this.arr, 1)
// 等价于
this.arr.splice(1, 1)
```

**区别对比：**

| 对比项 | `delete arr[i]` | `Vue.delete(arr, i)` |
|--------|-----------------|----------------------|
| 数组长度 | 不变 | 减 1 |
| 元素 | 留下 empty 稀疏位 | 真正移除，后续元素前移 |
| 响应式（Vue 2） | 不能触发视图更新 | 能触发视图更新 |
| 对象属性 | 可删除属性，但不能触发响应式 | 可删除属性并触发响应式更新 |

**为什么：**

Vue 2 通过 `Object.defineProperty` 劫持数组索引不可行（性能差），所以数组变更走的是“包装 7 个变异方法（push/pop/shift/unshift/splice/sort/reverse）”路径。`delete arr[i]` 不是变异方法，Vue 监听不到；`Vue.delete` 内部对数组走 `splice`，对对象走 `delete` + 通知依赖，从而保证响应式触发。

**Vue 3 中的变化：** 由于使用 Proxy，直接 `delete arr[i]` / `delete obj.key` 也能被 Proxy 的 `deleteProperty` trap 拦截，触发响应式更新，所以 **Vue 3 不再需要 `Vue.delete`**，直接用原生 `delete` 即可：

```js
import { reactive } from 'vue'
const state = reactive({ arr: ['a', 'b', 'c'], obj: { x: 1 } })

delete state.arr[1]        // 能触发更新（但长度仍不变，等同 delete 语义）
state.arr.splice(1, 1)    // 真正移除并触发更新（推荐用法）
delete state.obj.x        // 能触发更新
```

**总结：** Vue 2 中操作响应式数据用 `Vue.delete`/`$set`；Vue 3 中直接用原生 `delete` 和 `splice`，心智负担更小。

## watch和计算属性有什么区别？

**计算属性（computed）：**

- 用于**派生数据**：基于现有响应式数据计算出新值。
- **有缓存**：依赖不变时多次访问只会计算一次，依赖变化才重新计算。
- 必须**返回值**，且应是纯函数，不应有副作用。
- 适合模板里需要“基于某些值算出另一个值”的场景，如全名、过滤后的列表。

**侦听器（watch）：**

- 用于**响应数据变化执行副作用**：发请求、操作 DOM、修改其他状态、写本地存储等。
- **无缓存**，每次依赖变化都执行回调。
- 可以访问 `newVal` / `oldVal`。
- 支持 `immediate`、`deep`、异步操作。
- 适合“数据变化后需要做某事”的场景。

| 维度 | computed | watch |
|------|----------|-------|
| 用途 | 派生值 | 执行副作用 |
| 缓存 | 有 | 无 |
| 返回值 | 必须 | 不需要 |
| 异步 | 不适合 | 适合 |
| 副作用 | 不应 | 可以 |
| 监听多个源 | 隐式（用到即依赖） | 显式（数组形式） |
| 性能 | 更优（缓存） | 每次都执行 |

**示例对比：**

```js
// computed —— 派生值
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
// 模板中使用，依赖不变时复用缓存

// watch —— 副作用
watch(fullName, (val) => {
  localStorage.setItem('fullName', val)  // 数据变化时存本地
})
```

**多源监听：**

```js
// watch 监听多个源
watch([firstName, lastName], ([newFirst, newLast]) => {
  console.log('变化了', newFirst, newLast)
})
```

**经验法则：**

- “我需要一个新的值” → `computed`
- “值变了我要做点什么” → `watch`
- Vue 3 中能用 `computed` 解决的，优先用 `computed`（更声明式、有缓存、性能好）。
- 异步操作或开销较大的操作不要放 `computed`，用 `watch` 代替。

## v-model是什么？有什么用呢？

`v-model` 是 Vue 提供的**双向绑定指令**，用于在表单控件（input、textarea、select）或自定义组件上创建双向数据绑定，使视图和状态保持同步。

**本质：** `v-model` 是**语法糖**，等价于 `:value` + `@input`（不同表单元素略有差异）：

```vue
<input v-model="msg" />
<!-- 等价于 -->
<input :value="msg" @input="msg = $event.target.value" />
```

**常见用法：**

```vue
<template>
  <input v-model="text" />                              <!-- 文本 -->
  <textarea v-model="area"></textarea>                 <!-- 多行文本 -->
  <input type="checkbox" v-model="checked" />          <!-- 单选布尔 -->
  <input type="checkbox" value="A" v-model="picked" />  <!-- 多选数组 -->
  <input type="radio" value="One" v-model="radio" />    <!-- 单选 -->
  <select v-model="selected">
    <option disabled value="">请选择</option>
    <option>A</option>
    <option>B</option>
  </select>
</template>
```

**修饰符：**

- `.lazy`：把 `input` 事件改为 `change` 事件（失焦/回车才同步）。
- `.number`：自动把输入值转为数字。
- `.trim`：自动去除首尾空格。

```vue
<input v-model.lazy="msg" />
<input v-model.number="age" />
<input v-model.trim="name" />
```

**自定义组件上的 `v-model`：**

- **Vue 2**：默认监听 `value` prop + 触发 `input` 事件。可用 `model` 选项自定义 prop 和事件名。

```js
// Vue 2 子组件
export default {
  props: ['value'],
  model: { prop: 'value', event: 'input' },
  methods: {
    update(val) { this.$emit('input', val) }
  }
}
```

- **Vue 3**：默认使用 `modelValue` prop + `update:modelValue` 事件，并支持**多个 `v-model`**（绑定不同字段）。

```vue
<!-- 父组件 -->
<MyInput v-model="msg" v-model:title="title" />

<!-- 子组件 MyInput.vue -->
<script setup>
defineProps(['modelValue', 'title'])
const emit = defineEmits(['update:modelValue', 'update:title'])
</script>
<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

`v-model` 大大简化了表单和受控组件的双向同步逻辑，是 Vue 数据驱动开发的核心指令之一，也是 Vue 表单处理优于 React 受控组件体验的关键。

## axios是什么？怎样使用它？怎么解决跨域的问题？

**axios** 是一个基于 Promise 的 HTTP 客户端，浏览器端使用 XMLHttpRequest，Node 端使用 http 模块，支持请求/响应拦截、取消请求、自动 JSON 转换、超时控制、并发请求（`axios.all`）等，是 Vue 项目中最流行的 HTTP 库。

**基本使用：**

```js
import axios from 'axios'

axios.get('/api/user?id=1').then(res => console.log(res.data))
axios.post('/api/user', { name: 'Tom' }).then(res => console.log(res.data))

// 通用 axios(config) 形式
axios({
  method: 'post',
  url: '/api/user',
  data: { name: 'Tom' },
  timeout: 5000
})
```

**在 Vue 项目中通常封装实例（统一处理 baseURL、token、错误码）：**

```js
// src/utils/request.js
import axios from 'axios'
import { message } from 'element-plus'
import router from '@/router'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10000
})

// 请求拦截：统一加 token
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 响应拦截：统一处理业务错误码
service.interceptors.response.use(
  res => {
    const { code, data, msg } = res.data
    if (code === 0) return data           // 成功返回数据
    if (code === 401) {
      message.error('登录过期')
      router.push('/login')
      return Promise.reject()
    }
    message.error(msg)
    return Promise.reject(msg)
  },
  err => {
    message.error(err.message)
    return Promise.reject(err)
  }
)

export default service
```

**跨域及解决方案：**

跨域是浏览器**同源策略**限制：协议、域名、端口任一不同即跨域。常用方案：

**1. 开发环境 - 代理（Vite / Vue CLI）**

```js
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
}

// vue.config.js (Vue CLI)
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
```

**2. 生产环境 - Nginx 反向代理**

```nginx
location /api/ {
  proxy_pass https://api.example.com/;
  proxy_set_header Host $host;
}
```

**3. CORS（后端设置响应头）**

后端返回 `Access-Control-Allow-Origin: *`（或具体域名）、`Access-Control-Allow-Methods`、`Access-Control-Allow-Headers`、`Access-Control-Allow-Credentials` 等。简单请求直接生效；复杂请求（如 PUT、自定义 header）会先发 OPTIONS 预检。

**4. 其他方案**：JSONP（仅 GET，已较少用）、postMessage（窗口间通信）、WebSocket（不在同源策略内，但仍需后端配合）。

**实践建议：** 开发环境用代理最简单（无侵入），生产环境用 Nginx 反代或后端开 CORS 是主流方案。前端项目里 `baseURL` 配 `/api` 前缀，代理时统一转发即可。

## 在vue项目中如何引入第三方库（比如jQuery）？有哪些方法可以做到？

**方式 1：npm/yarn 安装后 import（推荐）**

```bash
npm install jquery
```

```js
// 在需要的组件或入口文件中按需引入
import $ from 'jquery'
$('body').css('background', '#fff')
```

配合 Tree-shaking，未使用的部分会被剔除（jQuery 整体引入较多，按需即可）。

**方式 2：全局挂载到 Vue 原型 / app.config.globalProperties**

```js
// Vue 2 - main.js
import $ from 'jquery'
Vue.prototype.$ = $

// Vue 3 - main.js
import { createApp } from 'vue'
import App from './App.vue'
import $ from 'jquery'
const app = createApp(App)
app.config.globalProperties.$ = $
```

组件中通过 `this.$`（Vue 2）或 `getCurrentInstance().proxy.$`（Vue 3）访问，但 Vue 3 更推荐直接 import，全局挂载主要用于兼容老代码或工具函数。

**方式 3：CDN `<script>` 引入 + 直接用 `window`**

```html
<!-- index.html -->
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
```

```js
// 业务代码直接用 window.$
window.$('body')
```

适合不希望打包进 bundle、利用 CDN 缓存加速的场景。

**方式 4：expose-loader / ProvidePlugin（Webpack 项目）**

```js
// vue.config.js
const webpack = require('webpack')
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ]
  }
}
```

模块中无需 import，直接使用 `$` 即可，Webpack 会自动注入。

**方式 5：Vite 的 optimizeDeps / define 配置**

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['jquery']  // 预构建
  }
}
```

**建议与注意：**

- 现代 Vue 项目尽量用原生 ES Module + npm 引入，符合模块化趋势。
- jQuery 这类操作 DOM 的库与 Vue 的数据驱动理念**冲突**，仅在改造老项目或使用第三方 jQuery 插件时才引入。
- 避免直接在 Vue 组件里用 jQuery 操作 DOM，否则破坏响应式和可维护性（Vue 管不到的 DOM 改动会导致数据与视图不同步）。
- 优先寻找基于 Vue 的等价方案（如用 `axios` 替代 `$.ajax`，用组件库替代 jQuery 插件）。

## 说说Vue React angularjs jquery的区别

| 维度 | jQuery | AngularJS (1.x) | Vue | React |
|------|--------|------------------|-----|-------|
| 类型 | DOM 操作库 | MVW 框架 | 渐进式框架 | UI 库 |
| 思想 | 命令式操作 DOM | MVC + 双向绑定 | 数据驱动 + 组件化 | 函数式 UI + 组件化 |
| 数据绑定 | 无 | 双向绑定（脏检查） | 双向绑定（响应式） | 单向数据流 |
| 模板 | 无（字符串拼接） | HTML 模板 + 指令 | 模板 + 指令 | JSX |
| 学习曲线 | 平缓 | 陡（概念多） | 平缓 | 中等 |
| 适用场景 | 老项目、DOM 操作、插件 | 老项目维护 | 中后台、移动端、新项目 | 大型应用、跨端 |
| 生态 | 插件多但陈旧 | 渐萎缩 | 国内主流 | 全球主流 |

**详细说明：**

- **jQuery**：早期解决 DOM 兼容性和 AJAX 的工具库，命令式编程，开发者直接操作 DOM。适合传统多页项目、改造遗留系统，已不适合现代大型 SPA，但在老项目维护、简单页面动画、操作第三方插件时仍有用武之地。

- **AngularJS (1.x)**：Google 推出的第一个 MVW 框架，引入双向绑定、依赖注入、指令等概念，影响深远。但性能（脏检查）和复杂度问题突出，被 Angular (2+) 重写，目前新项目很少选它，主要在维护老系统。

- **Vue**：尤雨溪出品，渐进式、模板 + 响应式、文档友好、生态由官方维护，国内最流行，适合中后台、移动端、快速交付。设计上平衡了易用性和能力，上手快但能支撑大型应用。

- **React**：Facebook 推出，JSX + 函数式思维 + 单向数据流、Hooks 逻辑复用、生态庞大、跨端（React Native），适合大型复杂项目和海外团队。自由度高，但也意味着选型成本高。

**演化趋势：** jQuery → AngularJS（DOM 操作 → 数据驱动）→ Vue/React（数据驱动 + 组件化 + 函数式），框架越来越抽象、声明式、组件化，关注点从“怎么改 DOM”转向“UI 是状态的函数”。四者各有定位，不存在绝对优劣，选型看场景：老项目维护用 jQuery/AngularJS，新项目中后台选 Vue，大型复杂/跨端选 React。

## Vue3.0 里为什么要用 Proxy API 替代 defineProperty API？

**Vue 2 的 `Object.defineProperty` 局限：**

1. **无法监听新增/删除属性**：只能劫持初始化时已存在的属性，新增属性需用 `Vue.set`/`$set`，删除需 `Vue.delete`，使用心智负担大。
2. **无法监听数组索引和 length 变化**：通过索引 `arr[0] = x` 或修改 `arr.length` 不会触发更新，需重写 7 个变异方法（push/pop/shift/unshift/splice/sort/reverse）变通。
3. **需要递归遍历**：初始化时需要深度遍历对象每个属性，对大对象初始化性能差、内存开销大。
4. **监听的是属性而非对象**：每个属性都要单独 `defineProperty`，属性多时性能差。
5. **不能监听 Map/Set 等新数据结构**。

**Vue 3 的 `Proxy` 优势：**

1. **代理整个对象**：Proxy 监听对象级别的操作，新增/删除属性自动可感知（`deleteProperty`、`set` trap 都能捕获），无需 `Vue.set`。
2. **支持数组**：索引修改、`length` 变更都能拦截，无需变异方法包装。
3. **惰性响应式**：配合 `Reflect`，访问到嵌套属性才递归代理，初始化更快，按需创建代理。
4. **支持更多数据结构**：Map、Set、WeakMap、WeakSet 都能代理。
5. **语义更清晰**：13 种 trap（get/set/has/deleteProperty/ownKeys 等）覆盖全面，扩展性强。

```js
// Vue 3 响应式简化示意
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      track(target, key)          // 依赖收集
      return typeof res === 'object' && res !== null
        ? reactive(res)           // 惰性递归，访问到才代理
        : res
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      trigger(target, key)        // 触发更新
      return res
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key)
      trigger(target, key)
      return res
    }
  })
}
```

**Proxy 的代价：**

- **不兼容 IE11**，且无法 polyfill（Proxy 是引擎级特性，无法用普通 JS 模拟）。
- **单次操作** Proxy 比 `defineProperty` 略慢（多了 Proxy 层），但整体因惰性代理反而更优，尤其是大对象初始化场景。

综合性能、特性、维护成本，Vue 3 选择 Proxy 是必然的升级，奠定了 Vue 3 响应式系统的基础，也解决了 Vue 2 长期被诟病的“响应式坑”问题。

## Vue3.0 编译做了哪些优化？

Vue 3 的编译器（`@vue/compiler-dom`）通过静态分析模板，生成更易优化的渲染函数代码，主要优化点如下：

**1. 静态提升（Static Hoisting）**

把不依赖动态数据的节点/属性提取到渲染函数外部，避免每次重新创建 VNode：

```js
// 模板
// <div><h1>标题</h1><p>{{ msg }}</p></div>

// 编译后
const _hoisted_1 = createVNode('h1', null, '标题')  // 提升到模块作用域，复用
function render() {
  return createVNode('div', null, [
    _hoisted_1,
    createVNode('p', null, msg, -1 /* HOISTED */)
  ])
}
```

**2. PatchFlag（补丁标记）**

编译期给每个动态节点打上“哪些部分是动态的”标记（TEXT、CLASS、STYLE、PROPS、FULL 等），运行时 Diff 只对比动态部分，跳过静态部分：

```js
createVNode('p', { class: dynamicClass }, msg, PatchFlags.TEXT | PatchFlags.CLASS)
```

**3. Block Tree（块级树）**

把动态节点收集到一个“Block”数组（`dynamicChildren`）中，Diff 时不再递归整棵树，而是直接遍历动态节点数组，复杂度从 O(整棵树) 降到 O(动态节点数)。这是 Vue 3 性能提升的关键。

**4. 缓存事件处理函数（cacheHandlers）**

模板里的内联函数 `@click="() => count++"` 会被缓存，避免每次渲染重建函数，从而避免子组件因 props 引用变化而不必要更新：

```js
// 开启 cacheHandlers
function render(_ctx, _cache) {
  return createVNode('button', {
    onClick: _cache[0] || (_cache[0] = () => count++)
  })
}
```

**5. 静态节点字符串化（SSR / 大量静态节点）**

大量连续静态节点会被编译成纯 HTML 字符串（`createStaticVNode`），减少 VNode 数量，SSR 场景尤其受益。

**6. Fragment & Teleport 内置**

多根节点（Fragment）和 Teleport 直接编译期支持，无额外运行时开销。

**7. Tree-shaking & 按需引入**

编译产物与运行时模块化（`runtime-core` / `runtime-dom`），未使用的特性（`v-model`、`transition`、`keep-alive` 等）可被 Tree-shaking，包体积更小。

这些编译期优化让 Vue 3 在相同模板下运行时性能比 Vue 2 提升约 1.3~2 倍，内存占用也显著降低，是 Vue 3 “更快”的核心来源。

## Vue3.0新特性 —— Composition API 与 React.js 中 Hooks的异同点

**相同点：**

1. **目标一致**：都是为了解决逻辑复用、关注点聚合的问题，把同一逻辑的状态、副作用聚合到一起，替代 Vue 2 Options API / React Class Component 中逻辑分散（同一逻辑散落在 data/methods/computed/生命周期中）的问题。
2. **函数式风格**：都以函数形式组织逻辑（`useXxx`），返回响应式状态或操作方法。
3. **都支持自定义 Hook / Composable 复用**：如 `useMouse()`、`useFetch()`、`useDebounce()` 等可在多个组件复用。
4. **生命周期对应**：Vue 的 `onMounted` 对应 React 的 `useEffect(() => {}, [])`，`onUnmounted` 对应 `useEffect` 返回的清理函数。

**不同点：**

| 维度 | Vue 3 Composition API | React Hooks |
|------|----------------------|-------------|
| 执行时机 | `setup()` 中**只执行一次**，状态持续存在 | 每次渲染都会重新执行函数组件 |
| 依赖追踪 | **自动**追踪响应式依赖（基于 Proxy） | **手动**声明依赖数组 `useEffect(fn, [deps])` |
| 闭包陷阱 | 无（数据是响应式 ref/reactive，始终最新） | 有（闭包捕获的是渲染时的值，需用 deps 或 useRef） |
| 状态更新 | 直接修改 `ref.value` / reactive 对象 | 通过 setState 生成新值触发重渲染 |
| `this` | 无 `this`，全函数式 | 无 `this` |
| 心智负担 | 较低（响应式自动管依赖） | 较高（deps 写错易 bug、闭包陈旧值） |
| 调用位置 | 灵活（setup 顶层，composable 内可分支） | 必须在顶层调用，不能放条件/循环 |
| 性能优化 | `computed` 自动缓存 | `useMemo` / `useCallback` 手动 deps |

**示例对比 —— `useMouse`：**

```js
// Vue 3
import { ref, onMounted, onUnmounted } from 'vue'
function useMouse() {
  const x = ref(0), y = ref(0)
  const update = e => { x.value = e.pageX; y.value = e.pageY }
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
  return { x, y }   // 返回响应式 ref，外部解构仍保持响应性
}
```

```js
// React
import { useState, useEffect } from 'react'
function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const update = e => setPos({ x: e.pageX, y: e.pageY })
    window.addEventListener('mousemove', update)
    return () => window.removeEventListener('mousemove', update)
  }, [])   // 必须写 deps，否则每次渲染都重新绑定
  return pos
}
```

**核心差异本质：**

- Vue 的响应式是“可变数据 + 自动依赖追踪”，数据是响应式引用，组件不会因状态变化重新执行整个函数，性能更优。
- React Hooks 是“不可变数据 + 重渲染 + 依赖对比”，每次 setState 都重新执行函数组件，通过 deps 数组判断是否执行副作用。

两者设计哲学不同，殊途同归。Vue 没有 React 经典的“闭包陈旧值”和“deps 写错”问题，心智负担更低；React 的不可变模型在并发模式（Concurrent Mode）下更易推导，生态也更成熟。两者都显著优于各自的旧方案（Options API / Class Component）。

## Vue3.0是如何变得更快的？（底层，源码）

Vue 3 相比 Vue 2 性能提升约 1.3~2 倍、包体积减半、TS 重写、Tree-shaking 友好，底层优化体现在以下几个方面：

**1. 响应式系统重构：Object.defineProperty → Proxy**

- 代理整个对象，新增/删除属性自动响应式，无需 `Vue.set`/`Vue.delete`，减少运行时开销和心智负担。
- **惰性代理**：访问到嵌套对象才递归代理（`get` 里判断），初始化大对象更快，按需创建代理。
- 支持 Map/Set 等数据结构，无需特殊处理。

**2. 编译期优化（compiler-core / compiler-dom）**

- **静态提升（Static Hoisting）**：静态节点提到 render 外复用，避免每次重建 VNode。
- **PatchFlag**：动态节点标记，Diff 时只比较动态绑定的部分（text/class/style/props），跳过其他。
- **Block Tree**：收集动态节点为数组，Diff 时跳过静态层级，复杂度从 O(整棵树) 降到 O(动态节点数)。
- **缓存事件 handlers**：避免内联函数每次重建，防止子组件不必要的更新。
- **SSR 静态字符串化**：大量静态节点编译为 HTML 字符串，减少 VNode 数量。

**3. 重写虚拟 DOM Diff**

- Vue 2：同层比较 + 双端对比（双端 Diff 算法）。
- Vue 3：基于 PatchFlag 的“快速 Diff”，只 patch 动态绑定的 props/class/style/text，跳过静态部分；Block Tree 让 Diff 只遍历动态节点。

**4. 架构分层，Tree-shaking 友好**

- 拆分为 `@vue/reactivity`、`@vue/runtime-core`、`@vue/runtime-dom`、`@vue/compiler-dom` 等包，按需引入。
- 内置组件（Transition、KeepAlive、Teleport）、指令（`v-model`、`v-show`）按需打包，未用不进 bundle。
- 包体积从 Vue 2 的 ~20KB 降到 ~10KB（gzip），运行时也更小。

**5. 源码层面**

- 全部 **TypeScript 重写**，类型安全，可维护性提升，IDE 支持更好。
- 模块化拆分，包之间解耦，便于长期演进和自定义渲染器（Canvas、WebGL、SSR）。
- 测试覆盖更完善，bug 修复更快。

**6. 其他优化**

- **`<script setup>` 编译期糖**：减少 setup 包装函数和返回值处理开销，代码更简洁、编译产物更小。
- **自定义渲染器 API**：可针对不同平台（Canvas、WebGL、SSR）定制渲染，解耦平台逻辑。
- **Suspense、Teleport、Fragment** 等内置组件编译期生成高效代码，无额外运行时开销。

总体上，Vue 3 在“响应式 + 编译 + 运行时 + 架构 + 包体积”五个层面都做了系统优化，是 Vue 历史上最大的一次重写，综合性能、可维护性、开发体验都显著优于 Vue 2。

## vue要做权限管理该怎么做？如果控制到按钮级别的权限怎么做？

Vue 项目权限管理通常分**页面级（路由级）**和**按钮级（操作级）**两层，核心思路：**用户登录 → 拿到 token + 权限标识 → 渲染菜单/路由 → 控制按钮显隐**。

**整体流程：**

1. 登录成功，后端返回 `token` 和用户权限列表（角色 codes / 权限字符串数组，如 `['user:add', 'user:edit']`）。
2. 前端存到 store（Pinia/Vuex）和本地存储。
3. 根据权限动态生成路由（`addRoute`），注册到 router。
4. 路由守卫拦截，未授权跳转 403 / 登录页。
5. 页面内根据权限控制按钮显隐。

**一、页面级（路由级）权限**

```js
// router/index.js —— 路由 meta 带权限标识
const routes = [
  { path: '/login', component: () => import('@/views/Login.vue') },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/User.vue'),
        meta: { roles: ['admin'], title: '用户管理' }
      }
    ]
  }
]

// 全局守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token
  if (!token) return to.path === '/login' ? next() : next('/login')

  // 首次进入，拉取用户信息并动态添加路由
  if (!userStore.roles.length) {
    await userStore.getUserInfo()
    const accessRoutes = filterRoutes(asyncRoutes, userStore.roles)
    accessRoutes.forEach(r => router.addRoute(r))
    return next({ ...to, replace: true })  // 重新触发导航
  }

  // 校验当前路由权限
  if (to.meta.roles && !to.meta.roles.some(r => userStore.roles.includes(r))) {
    return next('/403')
  }
  next()
})
```

**二、按钮级权限**

**方案 A：自定义指令（推荐，最简洁）**

```js
// directives/permission.js
import { useUserStore } from '@/stores/user'
export default {
  mounted(el, binding) {
    const userStore = useUserStore()
    const required = binding.value            // 字符串或数组
    const has = Array.isArray(required)
      ? required.some(r => userStore.permissions.includes(r))
      : userStore.permissions.includes(required)
    if (!has) el.parentNode.removeChild(el)   // 无权限移除元素
  }
}

// main.js
import permission from '@/directives/permission'
app.directive('permission', permission)
```

```vue
<el-button v-permission="'user:add'" @click="add">新增</el-button>
<el-button v-permission="['user:edit','user:update']">编辑</el-button>
```

**方案 B：工具函数 + v-if**

```js
// utils/permission.js
import { useUserStore } from '@/stores/user'
export function hasPermission(code) {
  return useUserStore().permissions.includes(code)
}
```

```vue
<el-button v-if="hasPermission('user:add')">新增</el-button>
```

**方案 C：封装权限组件**

```vue
<!-- AuthButton.vue -->
<template>
  <el-button v-if="visible" @click="$emit('click')"><slot /></el-button>
</template>
<script setup>
import { computed } from 'vue'
import { hasPermission } from '@/utils/permission'
const props = defineProps(['auth'])
const visible = computed(() => hasPermission(props.auth))
</script>

<!-- 使用 -->
<AuthButton auth="user:add">新增</AuthButton>
```

**三、菜单动态渲染**

```js
const menus = computed(() =>
  allMenus.filter(m => m.meta.roles.some(r => userStore.roles.includes(r)))
)
```

**四、安全注意事项**

- 前端权限只控制显隐，**后端必须做接口级校验**（前端可被绕过，如直接调 API）。
- token 失效（401）跳登录页，并清空 store。
- 权限粒度要清晰：角色（admin/operator）+ 操作权限（user:add）分层，避免混乱。
- 动态路由刷新页面时需要重新生成，可在 `beforeEach` 里用 `userStore.routes` 是否存在判断，避免重复添加。
- `v-permission` 指令在元素已挂载后移除，会有短暂闪烁，可在 CSS 层用 `v-cloak` 或先隐藏。

## vue在created和mounted这两个生命周期中请求数据有什么区别呢？

**核心区别：请求数据的时机不同，DOM 是否已挂载不同。**

| 阶段 | created | mounted |
|------|---------|---------|
| 实例状态 | 实例创建完成，data/methods/computed 可用 | 已挂载，`this.$el`/DOM 可访问 |
| DOM | 未挂载，`this.$el` 为 undefined | 已挂载，可操作 DOM |
| SSR | **支持**（服务端也执行 created） | 不支持（服务端无 DOM） |
| 请求发起时机 | 更早，理论上首屏数据返回更早 | 稍晚（需等挂载完成） |
| 适合场景 | 纯数据请求、不依赖 DOM | 需要 DOM / 第三方库初始化后再请求 |

**具体说明：**

1. **created 中请求数据（推荐用于纯数据）**
   - 优势：发起请求更早，与 Vue 实例创建后的逻辑并行，理论上首屏数据能更快返回。
   - 适合：列表、详情等只依赖数据的请求，不操作 DOM。
   - SSR 场景必须在 created（或 setup）中请求，因为服务端不会执行 mounted。

2. **mounted 中请求数据**
   - 优势：DOM 已就绪，请求回来后能立即操作 DOM（如初始化图表、滚动到某位置）。
   - 适合：需要先初始化第三方库（ECharts、Swiper）再请求数据填充的场景。
   - 劣势：相比 created 晚一个 tick，理论上首屏数据返回稍慢。

**实际差异很小：**

- created 到 mounted 之间主要是模板编译和挂载，通常在毫秒级，对用户感知几乎无差别。
- 真正影响首屏的是：**接口本身的速度 + 是否阻塞渲染**，而不是放在 created 还是 mounted。

**Vue 3 中的等价写法：**

```js
// Vue 3 - setup 中发起（等价 created，更早）
import { ref, onMounted } from 'vue'
import { fetchUser } from '@/api'

const user = ref(null)
fetchUser().then(res => (user.value = res))   // 组件创建时就发请求

// mounted 中发起（需要 DOM 时）
onMounted(async () => {
  const data = await fetchChartData()
  initECharts(data)   // 此时 DOM 已就绪
})
```

**经验总结：**

- 默认在 created（Vue 2）/ setup（Vue 3）里发数据请求，更早更快。
- 只有“请求结果需要立刻配合 DOM 操作”时才放 mounted。
- 不要在 beforeCreate 里发请求，那时 data 都没初始化，无法赋值。
- SSR 项目必须在 created/setup 里请求，mounted 在服务端不执行。

## slot 是什么？有什么作用？原理是什么？

在 Vue.js 中，`slot` 是一种用于在组件之间进行内容分发的机制。它允许在组件的模板中定义插槽（slot），然后在使用该组件时，将内容插入到插槽中，实现灵活的组件组合和内容复用。

作用：

- 实现组件的可插拔性：通过插槽，组件的一部分内容可以由父组件或外部环境提供，使组件更具灵活性。
- 实现组件的内容复用：多个组件可以共享相同的模板结构，但通过插槽插入不同的内容，实现内容的差异化。

原理：

- 在组件的模板中，使用 `<slot></slot>` 标签定义插槽。
- 在使用组件的时候，可以在组件标签内部添加内容，这些内容将被插入到组件模板中的对应插槽位置。
- 如果插槽没有具名，插入的内容将会替换未命名插槽的位置。
- 如果插槽具有名称，需要使用 `<template v-slot:slotName></template>` 或者简写为 `#slotName` 的形式来指定插入的内容。

示例代码如下：

```html
<!-- 子组件 Child.vue -->
<template>
  <div>
    <h2>我是子组件的标题</h2>
    <slot></slot>
  </div>
</template>

<!-- 父组件 Parent.vue -->
<template>
  <div>
    <h1>我是父组件</h1>
    <Child>
      <p>这段内容将插入到子组件的插槽中</p>
    </Child>
  </div>
</template>
```

在上述示例中，`Child` 组件中的 `<slot></slot>` 定义了一个未命名的插槽，父组件 `Parent` 使用 `<Child></Child>` 标签并在其中插入 `<p>这段内容将插入到子组件的插槽中</p>`，这样在渲染时，插入的内容将替换 `Child` 组件中的插槽位置。

通过使用插槽，我们可以实现组件的组合和复用，使得组件更加灵活和可配置。

## $nextTick 原理及作用

在 Vue.js 中，`$nextTick` 是一个实例方法，用于在 DOM 更新队列刷新之后执行回调函数。它的作用是在下次 DOM 更新循环结束后执行回调，以确保在更新后对 DOM 进行操作或访问时获得最新的 DOM。

原理：

1. 当 Vue.js 更新 DOM 时，会将需要执行的 DOM 更新操作放入一个队列中。
2. 在下一次事件循环（Event Loop）中，Vue.js 会清空队列并执行这些 DOM 更新操作。
3. 在清空队列之后，Vue.js 触发 `$nextTick` 的回调函数。

作用：

- 在 Vue.js 更新 DOM 后，使用 `$nextTick` 可以确保回调函数在 DOM 更新后执行，以避免在更新之前对 DOM 进行操作导致的问题。
- `$nextTick` 的回调函数可以用于获取更新后的 DOM、更新后的计算属性值或调用子组件的方法等操作。

使用示例：

```javascript
// 在 Vue 实例中使用 $nextTick
this.$nextTick(() => {
  // DOM 更新后执行的操作
});

// 在组件中使用 $nextTick
this.$nextTick(() => {
  // 组件 DOM 更新后执行的操作
});
```

需要注意的是，`$nextTick` 是异步执行的，它将回调函数推入到下一个事件循环中执行，因此如果需要在 DOM 更新后立即获取最新的 DOM 状态，应该使用 `$nextTick`。

## Vue 单页应用与多页应用的区别

Vue 单页应用（Single-Page Application，SPA）和多页应用（Multiple-Page Application，MPA）是两种不同的前端应用架构方式。

单页应用（SPA）：

- 单页应用是一种通过 JavaScript 动态加载内容的应用，其在初始化加载时只返回一个 HTML 页面，并通过 AJAX 或 WebSocket 等技术与后端进行数据交互。
- SPA 使用前端路由（例如 Vue Router）来管理页面的切换和内容的加载，通常只有一个入口 HTML 文件。
- 页面切换时，SPA 通过局部刷新来更新页面内容，不需要重新加载整个页面，提供了更流畅的用户体验。
- SPA 可以通过使用 Vue.js、React、Angular 等前端框架来实现。

多页应用（MPA）：

- 多页应用是一种传统的 Web 应用，每个页面都是一个独立的 HTML 文件，点击链接或刷新页面时会向服务器发送请求，服务器返回一个新的 HTML 页面。
- MPA 使用后端路由来管理页面的跳转和加载，每个页面都有自己的路由。
- 页面切换时，MPA 需要重新加载整个页面，因此在用户体验上相对较差。
- MPA 可以通过使用后端模板引擎（如 Django、JSP）或前端模板引擎（如 EJS、Handlebars）来生成动态页面。

区别：

- SPA 只返回一个 HTML 页面，通过 JavaScript 动态加载内容，页面切换流畅，用户体验好。而 MPA 每个页面都是独立的 HTML 文件，页面切换需要重新加载整个页面。
- SPA 使用前端路由管理页面切换，通过 AJAX 获取数据，前后端交互更灵活。MPA 使用后端路由管理页面切换，页面间的数据交互需要通过服务器来完成。
- SPA 通常使用前端框架（如 Vue.js）来构建应用，开发效率高。MPA 可以使用后端模板引擎或前端模板引擎，开发方式相对传统。
- SPA 在初次加载时需要下载较大的 JavaScript 文件，对于低端设备或网络较慢的用户可能加载时间较长。MPA 每个页面只需要加载自己所需的资源，加载时间相对较快。

选择使用 SPA 还是 MPA 取决于具体的项目需求。SPA 更适合需要良好用户体验、大量前后端交互和复杂交互逻辑的应用，而 MPA 更适合内容较为独立的多页面网站。

## Vue 中封装的数组方法有哪些，其如何实现页面更新

在 Vue 中，提供了一些用于操作数组的方法，它们被称为响应式数组方法（Reactive Array Methods）。这些方法包括：

1. push()：在数组末尾添加一个或多个元素。
2. pop()：移除并返回数组的最后一个元素。
3. shift()：移除并返回数组的第一个元素。
4. unshift()：在数组的开头添加一个或多个元素。
5. splice()：从数组中添加或删除元素。
6. sort()：对数组进行排序。
7. reverse()：颠倒数组中元素的顺序。

这些方法被封装在 Vue 中，当使用它们修改数组时，Vue 会检测到数组的变化并触发重新渲染。这是因为 Vue 使用了响应式的数据劫持机制，在修改数组时会拦截并通知相关依赖进行更新。

当使用这些响应式数组方法时，Vue 会捕获数组的变化，并触发视图的重新渲染。这样，页面上使用了该数组的部分会根据新的数组内容进行更新，保持页面与数据的同步。

例如，当使用 `push()` 方法向数组中添加新元素时，Vue 会捕获这个变化，触发视图的重新渲染，添加的新元素会在页面上显示出来。

示例代码如下：

```javascript
// 在 Vue 实例中定义一个响应式数组
data() {
  return {
    items: ['apple', 'banana', 'orange']
  };
},

// 在方法中使用响应式数组方法
methods: {
  addItem() {
    this.items.push('grape');
  }
}
```

在上述示例中，当调用 `addItem()` 方法时，`push()` 方法向 `items` 数组中添加了一个新元素 `'grape'`，Vue 检测到数组的变化，并触发相关的重新渲染，页面上会显示出添加的新元素。

需要注意的是，如果直接使用索引或赋值方式修改数组的元素，Vue 无法捕获到这种变化，因此不会触发视图的更新。在修改数组元素时，应该使用响应式数组方法，以确保视图的更新。

---

## **[Vue3]** Vue2和Vue3的兼容性

[非兼容性改变](https://v3-migration.vuejs.org/zh/breaking-changes/)

## **[Vue3]** watch与watchEffect 有什么区别，分别在什么场景下使用？

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

## **[Vue3]** Pinia 有哪些使用场景？

Pinia 适用的场景非常广泛，涵盖全局状态管理、异步请求、模块化管理、状态持久化、TypeScript 支持等功能。在现代 Vue 3 项目中，Pinia 是轻量、高效、易用的状态管理工具，能够帮助开发者更好地组织和维护复杂的应用逻辑。

## **[Vue3]** 说说 Pinia 与 Vuex 的区别

| 对比点       | Pinia                          | Vuex                   |
| ------------ | ------------------------------ | ---------------------- |
| **易用性**   | 轻量简单，贴合 Vue3 API        | 配置严格，学习成本较高 |
| **类型支持** | 内置类型推导，TypeScript 友好  | 类型支持需手动实现     |
| **性能**     | 基于 Vue3 响应式系统，性能更优 | Vue2 响应式性能稍逊    |
| **模块化**   | 扁平化设计，模块更灵活         | 嵌套模块，适合大型项目 |

在 Vue3 中，**Pinia 是官方推荐的状态管理库**，相比 Vuex 更轻量、现代，适合新项目开发；而 Vuex 在一些老旧的 Vue2 项目中仍有广泛使用。

## **[Vue3]** 说说你对 Vue 中异步组件的理解

Vue 中的异步组件是一个非常强大的特性，允许按需加载组件，减少应用的初始加载时间，提高性能。通过使用 `defineAsyncComponent` 和动态 `import()`，开发者可以轻松地实现这一特性，并通过加载状态提高用户体验。然而，使用异步组件时也要注意网络请求带来的开销、管理复杂性以及可能的 SEO 问题。

## **[Vue3]** 怎么理解 Vue3 提供的 markRaw ？

`markRaw` 是 Vue 3 提供的一个重要工具，允许开发者在需要的情况下绕过响应式系统，以提升性能并减少不必要的开销。它适用于那些不需要被 Vue 观察的对象，帮助开发者更灵活地管理应用中的响应式数据。

## **[Vue3]** 手写 vue 的双向绑定

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
