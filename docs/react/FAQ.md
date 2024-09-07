---
sidebar_position: 2
---
# FAQ?

## 什么是 React？

React 是一种用于构建用户界面的 JavaScript 库。它由 Facebook 开发，可以用于构建单页应用程序和复杂的 UI。

## 什么是组件？

在 React 中，组件是可以复用的 UI 模块，它们可以接收输入并返回输出。组件可以分为函数组件和类组件。

## React 中如何处理受控组件和非受控组件？

受控组件是指由 React 控制的表单元素，它们的值始终由 React 状态管理。非受控组件是指没有被 React 控制的表单元素。在 React 中，我们可以使用 ref 来获取非受控组件的值。

## React 中如何处理组件之间的通信？

在 React 中，我们可以使用 props 和 state 来处理组件之间的通信。另外，我们还可以使用 Context 或 Redux 管理应用程序状态。

## 什么是异步组件？

异步组件是指在需要时，动态地加载组件。在 React 中，我们可以使用 `React.lazy()` 和 `Suspense` API 来实现异步组件加载。

## 什么是 React 中的渲染属性？

渲染属性是指在 React 中允许通过属性将一个或多个组件作为其子元素的方法。通过使用渲染属性，我们可以更灵活地定义组件并传递数据。

## React 中的合成事件是什么？

合成事件是 React 提供的一种优化后的事件系统，它处理了跨浏览器兼容性问题，通过事件委托实现高效事件处理，而且能够避免浏览器默认行为。在 React 中，我们可以通过 `SyntheticEvent` 来访问合成事件的属性。

## 在 React 中如何进行单元测试？

在 React 中，我们可以使用 Jest 和 Enzyme 进行单元测试。我们可以测试组件的渲染和行为，确保组件响应用户的交互。单元测试有助于确保组件的稳定性和可维护性，并帮助我们验证组件是否按预期运行。

## 什么是渲染道具/children？

在 React 中，每个组件都有一个 `props` 对象作为输入，可以通过该对象向其传递数据。在某些情况下，我们还可以使用 `children` 属性，该属性可以让我们向组件传递的内容作为一个或多个子元素。这种技术可以用于可复用的组件，例如 modal 组件、提示组件等

## angularJs和React区别

React 对比 Angular 是思想上的转变，它也并不是一个库，是一种开发理念，组件化，分治的管理，数据与 view 的一体化。它只有一个中心,发出状态，渲染 view，对于虚拟 dom 它并没有提高渲染页面的性能，它提供更多的是利用 jsx 便捷生成 dom 元素，利用组件概念进行分治管理页面每个部分(例如 header section footer slider)

## redux中间件

中间件提供第三方插件的模式，自定义拦截 action -> reducer 的过程。变为action -> middlewares -> reducer 。这种机制可以让我们改变数据流，实现如异步
action ，action 过滤，日志输出，异常报告等功能。常见的中间件： redux-logger：提供日志输出；redux-thunk：处理异步操作；redux-promise：处理异步操作；actionCreator 的返回值是 promise

## redux有什么缺点

1. 状态管理可能过度中央化：Redux 鼓励将应用中的所有状态都存储在单一的状态树中。这可能会导致状态管理过度中央化，使得修改状态变得更加困难，同时也可能会增加组件之间的耦合度。
2. 繁琐的模板代码：Redux 需要编写许多模板代码，包括定义 Action 类型、编写 Action 创建函数、编写 Reducer 等。这可能会增加开发人员的工作量，尤其是对于较小的项目来说，这些额外的代码可能会显得冗余。
3. 可能会产生性能问题：由于 Redux 中的所有状态都存储在单一的状态树中，因此在某些情况下，组件可能会在不必要的情况下重新渲染。这可能会对应用的性能产生负面影响。
4. 学习曲线陡峭：Redux 使用了许多概念和抽象概念，包括 Action、Reducer、Store、Middleware 等。这些概念可能需要一些时间来理解和学习。
5. 可能会导致重复的网络请求：由于 Redux 中的所有状态都存储在单一的状态树中，因此在某些情况下，多个组件可能会对同一个状态进行修改。如果这个状态是异步请求的结果，可能会导致多次发送相同的网络请求，浪费带宽和时间。

总之，Redux 在技术层面上存在一些缺点，使用时需要权衡其优点和缺点，并根据具体情况来选择是否使用它。

## React组件的划分业务组件技术组件？

根据组件的职责通常把组件分为 UI 组件和容器组件。UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑。两者通过 React-Redux 提供 connect 方法联系起来。

## 为什么虚拟dom会提高性能?

虚拟DOM之所以可以提高性能，是因为它可以进行更有效的DOM操作。

在传统的网页开发中，当数据变化时，我们需要直接更新DOM元素。这样做会导致浏览器频繁地重新渲染页面，从而降低了性能。而使用虚拟DOM，我们可以在内存中构建整个DOM树，然后将其与前一个版本进行比较来确定变化的部分，最后只更新这些变化的部分，而非整个DOM树。

这样做可以减少不必要的DOM操作，从而提高性能。虚拟DOM还可以将多个操作合并成一个批量操作，从而进一步加快渲染速度。

## 简述flux 思想

Flux是一种前端应用程序架构的思想，旨在解决传统MVC或MVVM架构中数据流的复杂性。

Flux架构中，数据是单向流动的，用户的操作会产生一个ACTION并交给DISPATCHER，DISPATCHER会把这个ACTION分发给STORE，STORE会修改状态并发出CHANGE事件，VIEW会监听此事件并从STORE获取新的状态并做出相应的更新。

Flux这种架构模式的核心思想是将数据和行为（action）分离，通过强制单向数据流和严格的数据和状态管理来简化应用程序的状态处理逻辑，并确保应用程序始终处于一种可预测和可控的状态。

因此，Flux可以帮助开发人员更轻松地开发和维护复杂的前端应用程序，提高应用程序的性能和可维护性，还可以避免潜在的数据流混乱和状态管理问题。

## React项目用过什么脚手架？Mern? Yeoman?

React项目可以使用许多不同的脚手架工具，其中最常用的是Create React App，它是由React团队提供的一个官方命令行工具，用于启动和快速构建React应用程序。Create React App可以自动设置开发环境，包括Webpack和Babel等工具。

除此之外，还有许多其他流行的React项目脚手架，例如Next.js、Gatsby、React Starter Kit 等等。

MERN Stack是一个完整的技术堆栈，包括MongoDB、Express、React和Node.js。因此，如果你要开发一个MERN Stack项目，你可以使用MERN Starter或其他类似的脚手架来快速搭建起整个技术堆栈。

Yeoman是一个通用的脚手架工具，它适用于搭建各种各样的应用程序，包括React应用程序。Yeoman可以通过提供各种所需的模板和工具，快速生成具有特定功能和结构的应用程序。

## React解决了什么问题？

React主要解决了以下几个问题：

1. 提高JSX的可读性和可维护性：React提供了JSX语法来构建UI组件，它使得编写和维护大规模的组件变得更加容易。开发人员可以使用HTML类似的语法来描述UI组件，同时集成了JavaScript的能力，帮助开发人员更好的理解和管理代码。
2. 更高效的渲染性能：React采用了虚拟DOM的概念，可以通过比较前后两个虚拟DOM的差异，只更新需要更新的部分，从而减少了页面的重新渲染次数，提高了应用程序的渲染性能。
3. 状态管理和数据流控制：React倡导使用单向数据流应用模型，通过将整个应用程序的状态都保存在一个的Store中，使得应用程序的状态更新更加一致和可控制。这种模型使得多个组件可以共享同一个状态，并可以更细致地控制数据流的传递。
4. 组件化开发方式：React推广了组件化开发方式，将UI视为一个组件，可以将UI组件的代码封装为独立的代码块，提高了代码重用性和可维护性。

总之，React解决了前端开发中的一些痛点问题，例如代码维护困难、渲染效率低、数据流控制繁琐等问题，从而帮助开发人员更快速和高效的开发和维护大型前端应用程序。

## React的协议？

React本身没有独立的协议，它是一个开源的基于MIT许可证的JavaScript库，任何人都可以自由地使用、复制和修改React的代码。

但是，如果您要使用React为某个项目编写代码并将其公开发布，则必须遵守React的相关条款。这包括在项目中包含React的版权声明、不删除或修改React的许可证、将React的许可证包含在所有的衍生项目中等等。

需要注意的是，如果您使用的是React的前端框架如Gatsby，可能会有额外的协议条款需要遵守，例如Gatsby的默认协议是Apache License 2.0。

总之，React并没有自己的独立协议，它是一个开源的JavaScript库，遵循MIT许可证，但在使用React时需要遵守相关的许可协议。

## React 的工作原理？

React 是一种用于创建用户界面的 JavaScript 库，它基于组件的思想，允许您将界面分解为独立且可重用的部分，并在这些组件之间进行交互。

React 的核心工作原理是使用虚拟 DOM（Virtual DOM）来优化 UI 的渲染效率。在 React 中，当组件的状态发生更改时，虚拟 DOM 会用新的状态重新渲染部分 UI，然后将其与先前的虚拟 DOM 进行比较。这个比较过程非常快速，因为只会对发生更改的部分进行更新，减少了浏览器的开销和重绘。

在 React 中，组件是单向数据流的。当组件的 props 或 state 发生更改时，React 将自动重新渲染组件，并更新底层的虚拟 DOM。这使得 React 在处理大型、动态 UI 时十分高效，因为它只会在必要时更新界面的部分，而不是重新渲染整个界面。

此外，React 还提供了一些其他功能，如生命周期钩子函数、组件之间的通信、事件处理程序等，使开发人员可以更轻松地创建高度可定制和交互性的 UI。

## 使用 React 有何优点？

使用 React 作为前端框架/库有以下优点：

1. 高效的虚拟 DOM：React 使用虚拟 DOM，以最小化对 DOM 的直接操作，尤其是在大量数据变化的情况下速度更快，从而提供了更快的应用程序响应速度和更好的性能。
2. 组件化开发：React 的一大特点是组件化开发，可以将整个应用程序拆分成独立的组件，以组合的方式进行开发，提高了代码重用性、可维护性和可测试性。
3. 单向数据流：React 采用单向数据流，它将数据从父组件传递到子组件，使组件的关系更加明确，数据更安全，代码更容易维护。
4. JSX 语法：React 使用 JSX 语法编写组件，它使组件代码更易于阅读，同时也允许开发者将 HTML 标记和 JavaScript 代码混合使用，从而简化了代码编写流程。
5. 社区活跃：React 拥有庞大的社区和强大的生态系统，开发者可以轻松地找到很多第三方库和插件来扩展应用程序的功能和性能。

总的来说，React 是一个功能强大、性能卓越的前端框架，它的灵活性和可扩展性使得开发者可以轻松地构建高质量的应用程序。

## 展示组件(Presentational component)和容器组件(Container component)之间有何不同？

展示组件（Presentational component）和容器组件（Container component）是 React 组件的两种基本类型，它们通常被用于不同的目的。

**展示组件（Presentational component）**

展示组件是负责根据输入（props）和状态（state）生成用于展示数据的视图部分。它们通常不包含逻辑代码，而是只负责 UI 的呈现。它们使用组合和属性传递来接收数据，并渲染渲染视图，但并不知道应用程序的状态或需要进行哪些操作。展示组件还通常以静态形式存在，因为它们不受外部输入的影响而单独进行绘制。

**容器组件（Container component）**

容器组件是负责管理应用程序的状态、处理数据流以及关注业务逻辑的组件。它们通过 props 传递数据到子组件，并且也负责将子组件中发生的事件通过回调函数传递给其他组件。它们并不直接负责 UI 的渲染，而是将任务委托给展示组件。在 React 中，容器组件通常包含代码逻辑和状态管理的整个代码结构，因为它们负责将业务逻辑与展示逻辑分离，从而使应用程序更具有可维护性和可测试性。

总的来说，容器组件负责管理数据和状态，展示组件负责根据输入和状态渲染 UI。 这两种组件通过属性传递和回调函数相互作用，从而创建大型和高度可复用的 React 组件。

## 类组件(Class component)和函数式组件(Functional component)之间有何不同？

**类组件（Class component）**

类组件是使用 ES6 类定义的，它们是 React 组件的最初实现方式。类组件通常包含状态（state）和生命周期方法（lifecycle methods），它们还可以通过 this 引用访问实例变量以及继承命名方法。

以下是一个简单的类组件的示例：

```
import React, { Component } from 'react';

class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

**函数式组件（Functional component）**

函数式组件是使用函数定义的，它们通常更加简单和精简。函数式组件通常不包含状态或生命周期方法，它们只接收输入 props 并返回呈现的内容。

以下是一个简单的函数式组件的示例：

```
import React from 'react';

function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
```

除此之外，React 自从 16.8 版本之后，还引入了 Hooks API，它使得函数式组件中能够使用状态和其他特性。使用 Hooks，函数式组件可以方便地替代类组件完成复杂的应用程序逻辑。函数式组件与类组件的比较：

- 函数式组件通常比类组件更加简单。
- 类组件可以定义 state 和 lifecycle 方法。
- 使用 Hooks，函数式组件也可以定义 state 和其他特性。

总的来说，函数式组件具有更少的代码和更快的渲染速度，但是，如果需要使用状态和生命周期方法，那么类组件是更好的选择。

## 应该在 React 组件的何处发起 Ajax 请求？

在 React 组件中发起 Ajax 或其他异步请求时，最好的实践是在组件生命周期的 componentDidMount 方法中发起这些请求。

在这种情况下，当组件挂载完成时，React 提供了一个机会来向数据库或 API 发送请求以获取数据，并将其保存在组件的状态中，以便在呈现组件时使用。

以下是一个使用 componentDidMount 发起 Ajax 请求的示例：

```
import React, { Component } from 'react';
import axios from 'axios';

class MyComponent extends Component {
  state = {
    data: null,
  }

  componentDidMount() {
    axios.get('/api/data')
      .then(response => {
        // 处理数据并将其保存在状态中
        this.setState({ data: response.data });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <div>
        {/* 使用状态中的数据呈现组件 */}
        {this.state.data && <p>{this.state.data}</p>}
      </div>
    )
  }
}
```

在这个示例中，我们使用 componentDidMount 方法向服务器发起 AJAX 请求，并将返回的数据保存在组件的状态中。当数据准备好时，我们使用呈现方法将其渲染到组件。这种方法能够确保组件只在挂载后才发起请求，并且只在服务器响应时才进行数据处理。

## 在 React 中，refs 的作用是什么？

在 React 中，refs提供了一种方式可以从组件中获取DOM节点或者React组件的引用。refs是React提供的一种访问真实DOM及React组件的方法，可以用于访问和操作在组件实例内部的DOM元素、组件实例和组件实例内的方法。

使用refs，可以在React中控制和访问DOM元素的方法，包括获取表单元素中输入的值，聚焦表单元素，滚动到指定位置等。另外，refs也可以用于父组件和子组件之间的通信，可以让父组件直接访问子组件的props和state，这样可以使得组件之间的数据传递更加直接和高效。

在具体应用中，使用 refs的方式为在需要引用的DOM元素或组件上添加 ref 属性，然后在组件中通过 this.refs.xxx的方式来访问对应的节点或组件实例。需要注意的是，使用refs方式有时会导致代码结构复杂度增加，同时也增加了组件之间的耦合度，所以应该在必要的时候才使用。

## 何为高阶组件(higher order component)？

高阶组件（Higher-Order Component，HOC）是一个可以接收一个或多个组件作为参数，并返回一个新组件的函数。 这个新组件具备了被包装的组件所没有的能力。

高阶组件是 React 中的一种高级技术，用于在组件之间共享代码和行为，从而实现代码重用和抽象化。 它通常被用来编写通用的功能，如身份验证、数据获取、日志记录等。

具体来说，HOC 是一个函数，接收一个组件作为参数，返回一个新的组件。新组件可以在不修改原组件的情况下增强其功能。实际上，HOC 返回了一种新的组件，这个新的组件可以操作被包装组件的 props 或者增强其渲染方法，并且可以通过被包装的组件调用来实现共享所需的函数或逻辑。

以下是一个简单的高阶组件示例：

```
function withLogger(WrappedComponent) {
  return class extends React.Component {
    componentDidMount() {
      console.log(`Component ${WrappedComponent.name} mounted`);
    }

    componentWillUnmount() {
      console.log(`Component ${WrappedComponent.name} will unmount`);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

在这个示例中，withLogger 是一个高阶组件，它接收一个组件作为参数并返回一个新的组件。新组件可以在加载和卸载时打印日志。被包装的组件可以在需要的情况下添加日志功能，而不会在组件本身中混杂日志代码。

在使用时，可以通过以下方式使用：

```
class MyComponent extends React.Component {
  render() {
    return <div>Hello, World!</div>;
  }
}

const MyComponentWithLogger = withLogger(MyComponent);
```

在这个示例中，MyComponent 将通过 withLogger 函数进行包装，生成一个新的组件 MyComponentWithLogger，这个新组件可以增强渲染方法并包含日志功能。 HOC 在 React 中非常常见，常用于编写可重用代码、添加共享功能并向组件注入所需的属性。

## 为什么建议传递给 setState 的参数是一个 callback 而不是一个对象？

在 React 中，setState 方法用于更新组件的状态（state）。尽管 setState 可以接受一个新的状态对象，但是官方文档建议使用一个回调函数来代替对象来调用 setState，因为在许多情况下这会更加可靠。

以下是使用回调函数的方式来进行 setState 操作的示例：

```
this.setState(prevState => ({
  counter: prevState.counter + 1
}));
```

以下是使用对象来进行 setState 操作的示例：

```
this.setState({
  counter: this.state.counter + 1
});
```

这种情况下，推荐使用回调函数的原因有以下几点：

1. 异步更新状态

   setState 调用是异步的，React 会将更新的状态入列并根据需要进行批处理。如果在调用 setState 时只传递一个对象，则不能确保属性当前将传递给 setState 的对象的值。 因此，在 setState 中传递回调函数，而不是对象，可以确保在异步执行的状态更新中使用最新的值。

2. 避免状态竞争

   使用回调函数而不是对象，还可以避免状态竞争（State Race Condition）。例如，如果两个或多个 setState 调用同时发生，并且它们试图更新相同的状态，则无法确保更新的顺序。由于 setState 回调是逐个执行的，因此使用回调函数来进行状态更新将确保它们按顺序执行。

3. 更好的性能

   在使用回调函数时，可以在回调函数中只更新状态中某个属性。当尝试更新状态时，React 将对新状态和旧状态进行比较，然后只更新发生更改的状态，以此来提高性能并减少系统资源的消耗。

综上所述，使用回调函数来调用 setState 操作通常是一种更加可靠和安全的选择，可以避免状态竞争，提高性能，并且确保在异步执行的状态更新中始终使用最新的值。

## 除了在构造函数中绑定 this，还有其它方式吗？

是的，除了在构造函数中绑定this之外，还有其他两种常见的方式来绑定 this。

第一种方式是使用箭头函数。箭头函数不会创建自己的作用域，而是会捕捉当前上下文中的 this 值。因此，可以在组件中使用箭头函数来绑定this的值，而不用将this绑定在构造函数中。

例如：

```
class MyComponent extends React.Component {
  handleClick = () => {
    console.log(this);
  };

  render() {
    return <button onClick={this.handleClick}>Click me</button>;
  }
}
```

在上面的代码中， handleClick 使用箭头函数定义，因此它的 this 值会指向 MyComponent 组件实例。

第二种方式是使用 bind 方法。bind 方法会创建一个新的函数实例，并绑定该函数实例的 this 值为指定的值。可以在需绑定this的函数中调用 bind，来获取绑定this后的新函数，并将这个新函数传递给需要调用它的组件或者其他地方使用。

例如：

```
class MyComponent extends React.Component {
  handleClick() {
    console.log(this);
  }

  render() {
    return <button onClick={this.handleClick.bind(this)}>Click me</button>;
  }
}
```

在上面的代码中， handleClick 方法中使用了 bind 方法来绑定this值，然后将绑定this后的新函数作为onClick属性的值传递给button组件，在用户点击button时，绑定this后的新函数会被调用。

## 怎么阻止组件的渲染？

在React中，我们可以使用shouldComponentUpdate生命周期方法来阻止组件的渲染。当shouldComponentUpdate返回false时，React将不会执行组件的重新渲染操作。

shouldComponentUpdate方法是一个用于控制组件是否需要重新渲染的生命周期方法。它接收两个参数：nextProps和nextState。我们可以在shouldComponentUpdate方法中比较当前的props和state与下一个props和state是否发生变化，如果没有变化，则返回false来阻止组件的渲染。

下面是一个示例代码：

```
class MyComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // 比较当前的props和state与下一个props和state是否相等
    if (this.props.someProp === nextProps.someProp && this.state.someState === nextState.someState) {
      return false; // 返回false来阻止组件的重新渲染
    }
    return true; // 返回true来允许组件的重新渲染
  }
  render() {
    // 组件的渲染逻辑
    return (
      <div>
        // ...
      </div>
    );
  }
}
```

需要注意的是，使用shouldComponentUpdate方法时需要谨慎，因为它可能会对应用程序的性能产生影响。过于频繁地在shouldComponentUpdate方法中进行比较操作会影响应用程序的性能，因此应该在必要的情况下才使用该方法。

对于函数组件，我们可以使用React.memo()函数来阻止组件的重新渲染。React.memo()是一个高阶组件，它可以接收一个组件作为参数，并返回一个经过优化后的组件。

React.memo()基于浅层比较来判断组件是否需要重新渲染。如果组件的props发生了变化，React.memo()会对新旧props进行浅层比较，如果发现props没有变化，则返回上一次的渲染结果，否则重新渲染组件。React.memo()可以显著提高函数组件的性能，特别是当组件的props较多时。

下面是一个示例代码：

```
import React from 'react';

function MyComponent(props) {
  // 组件的渲染逻辑
  return (
    <div>
      // ...
    </div>
  );
}

export default React.memo(MyComponent);
```

需要注意的是，React.memo()只适用于props是基本数据类型的情况。如果props是对象、数组或函数时，需要进行深层比较才能判断是否需要重新渲染组件，这时候需要手动使用shouldComponentUpdate()或shouldUpdateComponent()。

## 当渲染一个列表时，何为 key？设置 key 的目的是什么？

在React中，当渲染一个列表时，key是一个用于标识列表中每个子元素的唯一标识符。key通常是一个字符串或数字类型，它被指定在列表中的每个子元素上，并用于帮助React在列表中找到和识别每个子元素。 key的设置是通过设置元素的key属性来实现的。

设置key的目的是帮助React提高渲染性能。如果没有key，React将会在列表中遍历每个子元素来找到改变的元素，造成性能上的浪费。而有了唯一的key，React在进行列表元素比较时就可以精准地定位到每个子元素的位置，只更新变更的部分，从而提高了应用程序的性能。

此外，设置key还可以帮助React正确地跟踪和处理列表元素的状态。当子元素在列表中添加、删除或重新排序时，key可以确保React更新相应的DOM元素，并且在进一步操作过程中能够正确识别元素的状态。

## 在 React 中如何处理事件

为了解决跨浏览器的兼容性问题，SyntheticEvent 实例将被传递给你的事件处理函数，SyntheticEvent是 React 跨浏览器的浏览器原生事件包装器，它还拥有和浏览器原生事件相同的接口，包括 stopPropagation() 和 preventDefault()。

比较有趣的是，React 实际上并不将事件附加到子节点本身。React 使用单个事件侦听器侦听顶层的所有事件。这对性能有好处，也意味着 React 在更新 DOM 时不需要跟踪事件监听器。

## 如何创建 refs

Refs 是使用 `React.createRef()` 创建的，并通过 `ref` 属性附加到 React 元素。在构造组件时，通常将 `Refs` 分配给实例属性，以便可以在整个组件中引用它们。

## 在构造函数调用 super 并将 props 作为参数传入的作用是啥？

在调用 `super()` 方法之前，子类构造函数无法使用`this`引用，ES6 子类也是如此。将 `props` 参数传递给 `super()` 调用的主要原因是在子构造函数中能够通过`this.props`来获取传入的 `props`。

**传递 props**

```js
class MyComponent extends React.Component { constructor(props) {  super(props);  console.log(this.props); // { name: 'sudheer',age: 30 } }}
```

**没传递 props**

```js
class MyComponent extends React.Component { constructor(props) {  super();  console.log(this.props); // undefined  // 但是 Props 参数仍然可用  console.log(props); // Prints { name: 'sudheer',age: 30 } }  render() {  // 构造函数外部不受影响  console.log(this.props) // { name: 'sudheer',age: 30 } }}
```

上面示例揭示了一点。`props` 的行为只有在构造函数中是不同的，在构造函数之外也是一样的。

## 什么是控制组件？

在 HTML 中，表单元素如 `<input>`、`<textarea>`和`<select>`通常维护自己的状态，并根据用户输入进行更新。当用户提交表单时，来自上述元素的值将随表单一起发送。

而 React 的工作方式则不同。包含表单的组件将跟踪其状态中的输入值，并在每次回调函数(例如`onChange`)触发时重新渲染组件，因为状态被更新。以这种方式由 React 控制其值的输入表单元素称为**受控组件**。

## 如何 React.createElement ？

**问题：**

```
const element = ( <h1 className="greeting">  Hello, world! </h1>)
```

上述代码如何使用 `React.createElement` 来实现:

```
const element = React.createElement( 'h1', {className: 'greeting'}, 'Hello, world!');
```

## 讲讲什么是 JSX ？

当 **Facebook** 第一次发布 React 时，他们还引入了一种新的 JS 方言 `JSX`，将原始 HTML 模板嵌入到 JS 代码中。JSX 代码本身不能被浏览器读取，必须使用`Babel`和`webpack`等工具将其转换为传统的JS。很多开发人员就能无意识使用 JSX，因为它已经与 React 结合在一直了。

## 为什么不直接更新 `state` 呢 ?

如果试图直接更新 `state` ，则不会重新渲染组件。

```
// 错误This.state.message = 'Hello world';
```

需要使用`setState()`方法来更新 `state`。它调度对组件`state`对象的更新。当`state`改变时，组件通过重新渲染来响应：

```
// 正确做法This.setState({message: ‘Hello World’});
```

## 这三个点(...)在 React 干嘛用的？

`...` 在React（使用JSX）代码中做什么？它叫什么？

```
<Modal {...this.props} title='Modal heading' animation={false}/>
```

这个叫扩展操作符号或者展开操作符，例如，如果`this.props`包含`a：1`和`b：2`，则

```
<Modal {...this.props} title='Modal heading' animation={false}>
```

等价于下面内容：

```
<Modal a={this.props.a} b={this.props.b} title='Modal heading' animation={false}>
```

扩展符号不仅适用于该用例，而且对于创建具有现有对象的大多数（或全部）属性的新对象非常方便，在更新`state` 咱们就经常这么做：

```
this.setState(prevState => {  return {foo: {...prevState.foo, a: "updated"}};});
```

## 什么是 React Hooks？

**Hooks**是 React 16.8 中的新添加内容。它们允许在不编写类的情况下使用`state`和其他 React 特性。使用 Hooks，可以从组件中提取有状态逻辑，这样就可以独立地测试和重用它。Hooks 允许咱们在不改变组件层次结构的情况下重用有状态逻辑，这样在许多组件之间或与社区共享 Hooks 变得很容易。

## React 中的 `useState()` 是什么？

下面说明`useState(0)`的用途：

```
...const [count, setCounter] = useState(0);const [moreStuff, setMoreStuff] = useState(...);... const setCount = () => {  setCounter(count + 1);  setMoreStuff(...);  ...};
```

`useState` 是一个内置的 React Hook。`useState(0)` 返回一个元组，其中第一个参数`count`是计数器的当前状态，`setCounter` 提供更新计数器状态的方法。

咱们可以在任何地方使用`setCounter`方法更新计数状态-在这种情况下，咱们在`setCount`函数内部使用它可以做更多的事情，使用 Hooks，能够使咱们的代码保持更多功能，还可以避免过多使用基于类的组件。

## React 中的StrictMode(严格模式)是什么？

React 的`StrictMode`是一种辅助组件，可以帮助咱们编写更好的 react 组件，可以使用`<StrictMode />`包装一组组件，并且可以帮咱们以下检查：

- 验证内部组件是否遵循某些推荐做法，如果没有，会在控制台给出警告。
- 验证是否使用的已经废弃的方法，如果有，会在控制台给出警告。
- 通过识别潜在的风险预防一些副作用。

## 为什么类方法需要绑定到类实例？

在 JS 中，`this` 值会根据当前上下文变化。在 React 类组件方法中，开发人员通常希望 `this` 引用组件的当前实例，因此有必要将这些方法绑定到实例。通常这是在构造函数中完成的:

```
class SubmitButton extends React.Component { constructor(props) {  super(props);  this.state = {   isFormSubmitted: false  };  this.handleSubmit = this.handleSubmit.bind(this); }  handleSubmit() {  this.setState({   isFormSubmitted: true  }); }  render() {  return (   <button onClick={this.handleSubmit}>Submit</button>  ) }}
```

## 什么是 prop drilling，如何避免？

在构建 React 应用程序时，在多层嵌套组件来使用另一个嵌套组件提供的数据。最简单的方法是将一个 `prop` 从每个组件一层层的传递下去，从源组件传递到深层嵌套组件，这叫做**prop drilling**。

`prop drilling`的主要缺点是原本不需要数据的组件变得不必要地复杂，并且难以维护。

为了避免`prop drilling`，一种常用的方法是使用**React Context**。通过定义提供数据的`Provider`组件，并允许嵌套的组件通过`Consumer`组件或`useContext` Hook 使用上下文数据。

## 描述 Flux 与 MVC？

传统的 MVC 模式在分离数据(Model)、UI(View和逻辑(Controller)方面工作得很好，但是 MVC 架构经常遇到两个主要问题:

**数据流不够清晰**:跨视图发生的级联更新常常会导致混乱的事件网络，难于调试。

**缺乏数据完整性**:模型数据可以在任何地方发生突变，从而在整个UI中产生不可预测的结果。

使用 Flux 模式的复杂用户界面不再遭受级联更新，任何给定的React 组件都能够根据 `store` 提供的数据重建其状态。Flux 模式还通过限制对共享数据的直接访问来加强数据完整性。

## 受控组件和非受控组件区别是啥？

- **受控组件**是 React 控制中的组件，并且是表单数据真实的唯一来源。
- 非受控组件是由 DOM 处理表单数据的地方，而不是在 React 组件中。

尽管非受控组件通常更易于实现，因为只需使用`refs`即可从 DOM 中获取值，但通常建议优先选择受控制的组件，而不是非受控制的组件。

这样做的主要原因是受控组件支持即时字段验证，允许有条件地禁用/启用按钮，强制输入格式。

## 这段代码有什么问题吗？

这段代码有什么问题:

```
this.setState((prevState, props) => { return {  streak: prevState.streak + props.count }})
```

**答案：**

没有什么问题。这种方式很少被使用，咱们可以将一个函数传递给`setState`，该函数接收上一个 `state` 的值和当前的`props`，并返回一个新的状态，如果咱们需要根据以前的状态重新设置状态，推荐使用这种方式。

## 如何在 ReactJS 的 Props上应用验证？

当应用程序在开发模式下运行时，React 将自动检查咱们在组件上设置的所有 `props`，以确保它们具有正确的数据类型。对于不正确的类型，开发模式下会在控制台中生成警告消息，而在生产模式中由于性能影响而禁用它。强制的 `props` 用 `isRequired`定义的。

下面是一组预定义的 prop 类型:

- React.PropTypes.string
- React.PropTypes.number
- React.PropTypes.func
- React.PropTypes.node
- React.PropTypes.bool

例如，咱们为用户组件定义了如下的`propTypes`

```
import PropTypes from 'prop-types'; class User extends React.Component { render() {  return (   <h1>Welcome, {this.props.name}</h1>   <h2>Age, {this.props.age}  ); }} User.propTypes = { name: PropTypes.string.isRequired, age: PropTypes.number.isRequired};
```

## 在 React 中使用构造函数和 getInitialState 有什么区别？

构造函数和`getInitialState`之间的区别就是`ES6`和`ES5`本身的区别。在使用`ES6`类时，应该在构造函数中初始化`state`，并在使用`React.createClass`时定义`getInitialState`方法。

```
class MyComponent extends React.Component { constructor(props) {  super(props);  this.state = { /* initial state */ }; }}
```

等价于：

```
var MyComponent = React.createClass({ getInitialState() {  return { /* initial state */ }; },});
```

## 如何有条件地向 React 组件添加属性？

对于某些属性，React 非常聪明，如果传递给它的值是虚值，可以省略该属性。例如：

```
var InputComponent = React.createClass({  render: function() {   var required = true;   var disabled = false;    return (    <input type="text" disabled={disabled} required={required} />   );  }});
```

渲染结果：

```
<input type="text" required>
```

另一种可能的方法是：

```
var condition = true; var component = ( <p  value="foo"  { ...( condition && { disabled: true } ) } />);
```

## Hooks会取代 `render props` 和高阶组件吗？

通常，`render props`和高阶组件仅渲染一个子组件。React团队认为，Hooks 是服务此用例的更简单方法。

这两种模式仍然有一席之地(例如，一个虚拟的 `scroller` 组件可能有一个 `renderItem prop`，或者一个可视化的容器组件可能有它自己的 DOM 结构)。但在大多数情况下，Hooks 就足够了，可以帮助减少树中的嵌套。

## 如何避免组件的重新渲染？

React 中最常见的问题之一是组件不必要地重新渲染。React 提供了两个方法，在这些情况下非常有用：

- `React.memo()`:这可以防止不必要地重新渲染函数组件
- `PureComponent`:这可以防止不必要地重新渲染类组件

这两种方法都依赖于对传递给组件的`props`的浅比较，如果 `props` 没有改变，那么组件将不会重新渲染。虽然这两种工具都非常有用，但是浅比较会带来额外的性能损失，因此如果使用不当，这两种方法都会对性能产生负面影响。

通过使用 **React Profiler**，可以在使用这些方法前后对性能进行测量，从而确保通过进行给定的更改来实际改进性能。

## 什么是纯函数？

纯函数是不依赖并且不会在其作用域之外修改变量状态的函数。本质上，纯函数始终在给定相同参数的情况下返回相同结果。

## 当调用`setState`时，React `render` 是如何工作的？

咱们可以将"`render`"分为两个步骤：

1. 虚拟 DOM 渲染:当`render`方法被调用时，它返回一个新的组件的虚拟 DOM 结构。当调用`setState()`时，`render`会被再次调用，因为默认情况下`shouldComponentUpdate`总是返回`true`，所以默认情况下 React 是没有优化的。
2. 原生 DOM 渲染:React 只会在虚拟DOM中修改真实DOM节点，而且修改的次数非常少——这是很棒的React特性，它优化了真实DOM的变化，使React变得更快。

## 如何避免在React重新绑定实例？

在React中重新绑定实例可以导致性能问题，并且容易造成代码的混乱。可以通过以下几种方式来避免在React中重新绑定实例：

1. 在constructor函数中使用箭头函数：可以在constructor函数中使用箭头函数来绑定方法的this指向，这样在组件的整个生命周期中，方法的this指向都不会发生变化，从而提高了组件的渲染性能，同时也能够使代码更加清晰简洁。

例如：

```
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = () => {
    console.log(this);
  };

  render() {
    return <button onClick={this.handleClick}>Click me</button>;
  }
}
```

1. 使用箭头函数定义方法：可以使用ES6中的箭头函数来定义方法，因为箭头函数的 this 会绑定到当前组件实例中。这样在方法中就不需要再手动绑定this，可以避免重新绑定实例的问题。

例如：

```
class MyComponent extends React.Component {
  handleClick() {
    console.log(this);
  }

  render() {
    return <button onClick={() => this.handleClick()}>Click me</button>;
  }
}
```

1. 使用bind方法绑定this：可以在组件的render函数中使用bind方法来绑定方法的this指向，并将其缓存到变量中，避免多次重新渲染时重复绑定实例的问题。

例如：

```
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log(this);
  }

  render() {
    const boundHandleClick = this.handleClick.bind(this);

    return <button onClick={boundHandleClick}>Click me</button>;
  }
}
```

总之，在React中避免重新绑定实例的方法可以大大提高组件的性能，并且使代码更加清晰易懂。

## React.js中如何处理图片懒加载?

在React.js中处理图片懒加载可以使用第三方库，例如react-lazyload。以下是使用react-lazyload实现图片懒加载的步骤：

使用npm安装react-lazyload: npm install --save react-lazyload
在组件中引入Lazyload组件: import LazyLoad from react-lazyload
使用LazyLoad组件包装需要懒加载的img标签，并在其中设置placeholder占位符图:

```
<LazyLoad height={200} once>
  <img src={imageSrc} alt="example" />
</LazyLoad>
```

其中，height属性代表懒加载图片的高度，once属性表示只加载一次。

这样，当页面滚动到需要加载图片的位置时，较小的占位符图会先显示，然后再异步加载真实的图片。这可以有效地减轻页面初始加载时的负担，提高应用程序的性能。

## useTransition为啥不会阻塞UI

关于 “useTransition” Hook，它本质上是一个 React Hook，它可以帮助开发人员更轻松地管理组件的加载和更新。它通过在组件加载和更新时使用异步函数，从而确保它不会阻塞用户界面。

当组件需要加载或更新时，“useTransition” Hook 可以通过使用 Promise 和 async/await 语法来控制组件的加载和更新。这样，组件加载和更新可以在后台运行，不会影响用户界面的响应性。

因此，“useTransition” Hook 可以确保组件加载和更新不会阻塞用户界面，从而提高用户体验。

## React 的事件和普通的 HTML 事件有什么不同？

1. 事件命名方式：React 事件命名采用驼峰命名法，与普通的 HTML 事件命名方式有所不同。例如，`onclick` 在 React 中变为 `onClick`。

2. 事件处理函数传参：在普通的 HTML 事件中，事件处理函数的参数是事件对象（event object），可以通过 `event.target` 等属性获取相关信息。而在 React 中，事件处理函数的参数是合成事件对象（synthetic event object），这是为了保持跨浏览器兼容性和性能优化。合成事件对象提供了与原生事件对象相似的属性和方法，但不完全一致。

3. 事件绑定方式：在普通的 HTML 事件中，事件可以直接绑定在 HTML 元素的属性上，例如 `<button onclick="handleClick()">Click</button>`。而在 React 中，事件需要通过特定的语法进行绑定，通常是在组件的 JSX 中使用回调函数作为事件处理函数，例如 `<button onClick={handleClick}>Click</button>`。

4. 事件冒泡和阻止默认行为：React 中的事件处理函数默认不会冒泡，也不会触发元素的默认行为。如果需要实现事件冒泡或阻止默认行为，可以使用合成事件对象提供的方法，例如 `event.stopPropagation()` 和 `event.preventDefault()`。

5. 事件委托：在普通的 HTML 事件中，可以使用事件委托（event delegation）将事件处理函数绑定在父元素上，通过事件冒泡机制处理子元素的事件。而在 React 中，不需要显式使用事件委托，可以直接在子组件上绑定事件处理函数。

## React 组件中怎么做事件代理？它的原理是什么？

React 中的事件代理（Event Delegation）是合成事件系统的核心机制。

**原理：**

React 不会为每个 DOM 元素单独绑定事件监听器。而是在根容器（React 17+）或 `document`（React 16 及之前）上注册一个统一的事件监听器。当用户交互触发原生事件后，事件会冒泡到根容器，React 再根据事件目标（`event.target`）向上遍历组件树，依次调用对应的事件处理函数。

**工作流程：**

1. **挂载时：** 组件中绑定了 `onClick` 等事件后，React 不会在对应 DOM 元素上调用 `addEventListener`，而是在 root 容器上注册一个监听器（每种事件类型只注册一次）。
2. **触发时：** 用户点击元素，浏览器触发原生事件并冒泡到 root 容器。
3. **分发时：** React 从 `event.target` 开始向上遍历到 root，收集路径上所有绑定了该事件类型的处理函数。
4. **执行时：** React 构造合成事件对象（`SyntheticEvent`），按冒泡顺序依次调用收集到的事件处理函数。

```js
// React 内部简化逻辑
function dispatchEvent(nativeEvent) {
  const target = nativeEvent.target;
  const path = []; // 从 target 到 root 的路径
  let node = target;
  while (node) {
    path.push(node);
    node = node.parentNode;
  }

  // 构造合成事件
  const syntheticEvent = createSyntheticEvent(nativeEvent);

  // 按冒泡顺序执行事件处理函数
  path.forEach(node => {
    const handler = getEventHandler(node, 'onClick');
    if (handler) handler(syntheticEvent);
    if (syntheticEvent.isPropagationStopped) return; // stopPropagation
  });
}
```

**为什么使用事件代理：**

1. **性能优化：** 无论列表有多少项，只注册一个监听器，避免大量 `addEventListener`。
2. **统一管理：** 方便实现事件池、跨浏览器兼容、批量更新等。
3. **自动清理：** 组件卸载时不需要手动移除事件监听器，React 在 root 上统一管理。

**与原生事件代理的区别：** 原生事件代理需要开发者手动在父元素上绑定监听器并通过 `event.target` 判断子元素。React 自动完成这一过程，开发者只需在子组件上写 `onClick`，React 内部自动代理。

## React 高阶组件、Render props、hooks 有什么区别，为什 么要不断迭代

React 高阶组件（Higher-Order Components）、Render Props 和 Hooks 是 React 中常用的代码复用模式，它们在实现方式和使用方式上有一些区别。

1. 高阶组件（Higher-Order Components）：高阶组件是一个函数，接受一个组件作为参数，并返回一个新的增强后的组件。高阶组件通过将共享的逻辑封装在一个函数中，使得多个组件可以共享该逻辑。它是一种函数式编程的概念，可以通过组合多个高阶组件来实现更复杂的功能。高阶组件的缺点是可能会引入嵌套过深的组件结构，导致代码可读性降低。

2. Render Props：Render Props 是一种通过将组件作为函数的形式，将数据或行为传递给子组件的技术。通过在父组件的 `render` 方法中将数据或函数作为参数传递给子组件，并在子组件的 `render` 方法中调用该函数并使用其返回值。这样可以实现在组件树中共享逻辑。相比高阶组件，Render Props 更灵活，但可能需要更多的代码。

3. Hooks：Hooks 是 React 16.8 引入的一项新特性，使函数组件能够具有状态和其他 React 特性。Hooks 可以让我们在无需编写类组件的情况下，使用状态管理、生命周期方法等功能。通过使用 Hooks，我们可以将组件的逻辑拆分为更小的可重用函数，并且可以在函数组件中使用各种 React 特性。Hooks 的优势是代码简洁、逻辑清晰，并且可以更好地处理组件的状态管理。

不断迭代这些代码复用模式是为了改进 React 的开发体验和代码组织方式。React 社区根据开发者的反馈和需求，不断改进和优化 React 的特性和用法，以提供更好的开发体验和更高效的代码复用。每种模式都有其适用的场景和优势，可以根据具体需求选择最合适的方式。同时，这些模式的迭代也推动了 React 的发展和进步，使得 React 在不断变化的前端开发环境中保持活跃。

## Component, Element, Instance 之间有什么区别和联系？

在 React 中，"Component"、"Element" 和 "Instance" 是常用的概念，它们之间有以下区别和联系：

1. Component（组件）：Component 是 React 中构建用户界面的基本单元。它是一个可复用、可组合的代码单元，用于描述用户界面的外观和行为。Component 可以是函数组件或类组件。

2. Element（元素）：Element 是描述 React 组件结构和配置的对象。它是构建 React 虚拟 DOM 的基础单元，类似于一个描述性的数据结构。Element 是由 React.createElement() 函数创建的，并且可以通过 JSX 语法进行声明。

3. Instance（实例）：Instance 是指通过 Component 创建的实例对象，也称为组件实例。当将 Component 渲染到 DOM 中时，React 会创建该组件的实例。每个组件实例都有自己的状态（state）和属性（props），并且可以被渲染到页面上。

联系：

- 通过定义 Component 可以创建 Element，并通过调用 ReactDOM.render() 方法将 Element 渲染为实际的 DOM 元素。

- 在运行时，React 会将 Element 转换为对应的实例对象，并在组件的生命周期中管理实例的状态和行为。

- 实例是根据 Component 的定义而创建的，每个 Component 可以创建多个实例，每个实例都具有独立的状态和属性。

总结来说，Component 是组件的定义，Element 是描述组件的对象，Instance 是根据组件创建的实例对象。Component 和 Element 是静态的概念，用于描述组件结构和配置，而 Instance 是动态的，代表组件在运行时的实例。

## React.createClass 和 extends Component 的区别有哪些？

在 React 中，React.createClass 和 extends Component 是两种创建组件的方式，它们之间有以下区别：

1. 语法差异：React.createClass 是 ES5 语法的一种方式，而 extends Component 是 ES6 类语法的一种方式。React.createClass 使用对象字面量来定义组件，而 extends Component 使用类继承的方式来定义组件。

2. API 的不同：React.createClass 提供了一些内置的生命周期方法（如 componentDidMount、componentWillMount 等），可以直接在组件对象中定义这些方法。而 extends Component 是通过继承 React.Component 类来创建组件，并重写相应的生命周期方法。

3. Mixins 支持：React.createClass 支持使用 Mixins 来复用组件逻辑，可以在组件定义中使用 mixins 属性。而 extends Component 不直接支持 Mixins，需要使用其他方式实现相同的功能，如使用高阶组件或自定义的复用逻辑。

4. 静态属性和方法：extends Component 允许在组件类中定义静态属性和静态方法，以及使用 ES6 的类特性（如箭头函数）。React.createClass 不支持定义静态属性和方法。

5. ECMAScript 规范：React.createClass 是 ES5 语法，而 extends Component 是 ES6 语法。随着 JavaScript 发展，ES6 已经成为了标准的语法规范，推荐使用 extends Component 创建组件。

## React 如何判断什么时候重新渲染组件？

在 React 中，组件的重新渲染是由 React 自身的机制来判断和触发的。React 使用虚拟 DOM（Virtual DOM）来进行高效的组件更新。

React 在判断是否需要重新渲染组件时，会进行以下步骤：

1. 初始渲染：在组件首次渲染时，会执行组件的 `render()` 方法，并生成对应的虚拟 DOM 树。

2. 属性变化：当组件接收到新的属性（props）时，React 会比较新旧属性的差异。如果发现属性有变化，React 将会重新调用组件的 `render()` 方法，并生成新的虚拟 DOM 树。

3. 状态变化：当组件的状态（state）发生变化时，React 会触发组件的重新渲染。React 会比较新旧状态的差异，并重新调用 `render()` 方法生成新的虚拟 DOM 树。

4. 父组件重新渲染：如果一个组件的父组件重新渲染，那么该组件也会重新渲染，即使它的属性和状态没有变化。

5. 强制更新：通过调用组件实例的 `forceUpdate()` 方法，可以强制触发组件的重新渲染，即使属性和状态没有变化。

在判断是否需要重新渲染时，React 会进行虚拟 DOM 的比较，找出前后两次渲染的差异，并仅更新有变化的部分，以提高性能和效率。React 使用一种称为 "协调"（Reconciliation）的算法来处理组件的重新渲染，通过比较虚拟 DOM 树的结构和属性来确定更新的内容。

需要注意的是，React 并不是实时地比较属性和状态的变化，而是根据一定的优化策略来进行判断。这意味着在某些情况下，即使属性或状态有变化，React 也可能不会立即重新渲染组件。

可以通过实现 `shouldComponentUpdate()` 或使用 React 提供的纯组件（PureComponent）来控制组件的重新渲染。这些方法可以在组件更新之前进行自定义的判断，以决定是否要进行重新渲染。

总结：React 使用虚拟 DOM 和协调算法来判断和触发组件的重新渲染。判断是否需要重新渲染的条件包括属性的变化、状态的变化、父组件的重新渲染，以及通过 `forceUpdate()` 方法的强制更新。开发者也可以自定义判断逻辑，通过 `shouldComponentUpdate()` 或纯组件来控制组件的重新渲染。

## React 组件的 state 和 props 有什么区别？

在 React 中，组件的 state 和 props 是两个不同的概念，它们有以下区别：

1. 定义和所有权：
   - state：组件的 state 是组件自身内部管理的数据，可以通过 `this.state` 来访问。state 是可变的，可以通过 `setState()` 方法来更新。
   - props：组件的 props 是从父组件传递给子组件的数据，子组件不能直接修改 props 的值。props 是只读的，只能通过父组件来修改。

2. 数据来源：
   - state：state 是组件自身管理的数据，用于存储和跟踪组件的内部状态。通常用于存储组件的可变数据，如用户输入、组件的状态切换等。
   - props：props 是由父组件传递给子组件的数据，作为组件的配置参数。props 用于在组件之间进行数据传递，使得组件能够复用和灵活配置。

3. 更新方式：
   - state：组件的 state 可以通过调用 `setState()` 方法来更新。React 会根据新的 state 值重新渲染组件，并更新相关的 UI。
   - props：props 是从父组件传递给子组件的，子组件无法直接修改 props 的值。只能通过父组件的更新来改变 props 的值，当父组件的 props 发生变化时，React 会重新渲染子组件。

4. 生命周期影响：
   - state：组件的 state 的更新会触发组件的重新渲染，会经历生命周期的更新过程，包括 `shouldComponentUpdate`、`componentWillUpdate` 和 `componentDidUpdate` 等生命周期方法。
   - props：组件的 props 的更新也会触发组件的重新渲染，但它不会触发完整的生命周期更新，只会执行 `componentWillReceiveProps`、`shouldComponentUpdate`、`componentWillUpdate` 和 `componentDidUpdate` 这几个生命周期方法。

总结：
state 是组件内部管理的可变数据，用于存储和跟踪组件的内部状态；props 是从父组件传递给子组件的只读数据，用于组件之间的数据传递和配置。state 的更新会触发组件的重新渲染，而 props 的更新也会触发组件的重新渲染，但对生命周期的影响不同。理解和正确使用 state 和 props 可以更好地管理组件的状态和数据流动。

## React 中的 props 为什么是只读的？

在 React 中，props 被设计为只读的，即不能在组件内部直接修改 props 的值。这是基于以下考虑：

1. 单向数据流：React 推崇单向数据流的设计模式，即数据从父组件流向子组件，子组件无法直接修改父组件传递的数据。这样可以确保数据流动的可预测性和可控性，减少出错的可能性。

2. 组件的可复用性：通过将数据作为 props 传递给子组件，可以使组件具有更高的可复用性。子组件可以独立于父组件进行开发和测试，因为它们不依赖于具体的数据源，而是通过 props 来获取数据。

3. 组件的纯函数特性：React 的组件被设计为纯函数，给定相同的输入（即相同的 props），组件应该始终呈现相同的输出。如果组件可以直接修改 props 的值，那么就会破坏组件的纯函数特性，导致组件的行为不可预测。

4. 性能优化：React 使用虚拟 DOM 进行高效的组件更新，当组件的 props 发生变化时，React 可以根据新的 props 值判断是否需要重新渲染组件。如果允许组件直接修改 props，那么组件内部对 props 的修改将无法被 React 感知到，从而导致组件无法正确更新。

综上所述，将 props 设计为只读的有助于维护 React 应用的稳定性、可维护性和可测试性。如果需要修改组件的状态或数据，可以使用组件的 state 来管理可变数据，并通过父组件的 props 传递给子组件进行展示和操作。

## React 中怎么检验 props？验证 props 的目的是什么？

在 React 中，可以通过使用 PropTypes 或 TypeScript 来检验和验证 props。

1. PropTypes：PropTypes 是 React 提供的一个属性类型检验库。通过在组件中定义静态属性 `propTypes`，可以指定每个 prop 的类型、是否必需以及其他约束条件。PropTypes 提供了多种类型检验器，如 `string`、`number`、`array`、`object` 等。在开发环境中，如果传递给组件的 prop 不符合指定的类型或约束条件，将会在控制台中显示警告信息。

示例使用 PropTypes 进行检验：

```jsx
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    age: PropTypes.number,
    hobbies: PropTypes.arrayOf(PropTypes.string),
    address: PropTypes.shape({
      street: PropTypes.string,
      city: PropTypes.string,
      zipCode: PropTypes.string
    })
  };

  render() {
    // ...
  }
}
```

2. TypeScript：如果使用 TypeScript 来编写 React 代码，可以通过类型注解来检验和验证 props。在 TypeScript 中，可以为组件的 props 定义接口，并在组件的声明中指定 props 的类型。TypeScript 在编译阶段会进行类型检查，如果传递给组件的 prop 与指定的类型不匹配，将会报编译错误。

示例使用 TypeScript 进行检验：

```tsx
interface MyComponentProps {
  name: string;
  age?: number;
  hobbies?: string[];
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
  };
}

class MyComponent extends React.Component<MyComponentProps> {
  render() {
    // ...
  }
}
```

验证 props 的目的主要有以下几点：

1. 数据完整性和一致性：通过验证 props，可以确保传递给组件的数据符合预期的类型和格式，从而减少错误数据的传递和使用。

2. 提供开发时的警告和错误提示：当传递给组件的 prop 与预期的类型不匹配时，PropTypes 或 TypeScript 可以提供警告和错误信息，帮助开发者及时发现和修复问题。

3. 组件的可维护性和可复用性：通过明确指定 props 的类型和约束条件，可以提高组件的可维护性和可复用性。在开发过程中，可以更清晰地了解组件所需的数据和用法，降低出错的概率，并使组件更容易被其他开发者理解和使用。

总结：通过使用 PropTypes 或 TypeScript 来检验和验证 props，可以保证传递给组件的数据的完整性、正确性和一致性。验证 props 的目的是提高代码质量、提供开发时的警告和错误提示，并增强组件的可维护性和可复用性。

## React 16.X 中 props 改变后在哪个生命周期中处理

在 React 16.x 中，当组件的 props 发生变化后，可以通过以下生命周期方法来处理：

1. getDerivedStateFromProps(props, state)：该生命周期方法在组件接收到新的 props 时被调用，它接收两个参数：新的 props 和当前的 state。在这个方法中，可以根据新的 props 来更新组件的状态。它的返回值将被用作新的 state。这个生命周期方法是一个静态方法，所以不能访问组件的实例。

2. componentDidUpdate(prevProps, prevState)：该生命周期方法在组件更新（重新渲染）完成后被调用，它接收两个参数：前一个 props 和前一个 state。在这个方法中，可以根据前一个 props 和当前的 props 进行比较，并根据需要执行相应的操作，如更新组件的状态、发送网络请求、触发其他组件的更新等。

这两个生命周期方法都提供了处理 props 变化的机会，但它们的使用场景有所不同：

- `getDerivedStateFromProps`：适用于根据新的 props 来更新组件的状态，即根据 props 计算出新的 state。它应该返回一个对象，表示组件的新状态，或者返回 null 表示不需要更新状态。注意，这个生命周期方法在组件的初始渲染和后续的更新中都会被调用。

- `componentDidUpdate`：适用于在组件更新完成后执行一些副作用操作，如发送网络请求、操作 DOM、更新其他组件等。在这个方法中，可以根据前一个 props 和当前的 props 进行比较，并根据需要执行相应的操作。注意，这个生命周期方法在组件的初始渲染时不会被调用，只有在组件更新后才会被调用。

需要注意的是，在处理 props 变化时，应该谨慎地使用这些生命周期方法，并遵循 React 的最佳实践。尽量避免直接修改组件的状态，而是根据新的 props 计算出新的状态。同时，确保在适当的生命周期方法中进行处理，避免不必要的渲染和性能问题。

## React-Router 的实现原理是什么？

客户端路由实现的思想：

基于 hash 的路由：
通过监听 hashchange 事件，感知 hash 的变化 改变 hash 可以直接通过 location.hash=xxx

基于 H5 history 路由：
改变 url 可以通过 history.pushState 和 resplaceState 等，会 将 URL 压入堆栈，同时能够应用 history.go() 等 API 监听 url 的变化可以通过自定义事件触发实现 react-router

实现的思想：
基于 history 库来实现上述不同的客户端路由实现思想，并且能够 保存历史记录等，磨平浏览器差异，上层无感知 通过维护的列表，在每次 URL 发生变化的回收，通过配置的 路由路 径，匹配到对应的 Component，并且 render

## react-router 里的 Link 标签和 a 标签的区别

从最终渲染的 DOM 来看，这两者都是链接，都是 标签，区别是∶ `<Link>`是 react-router 里实现路由跳转的链接，一般配合`<Route>` 使用，react-router 接管了其默认的链接跳转行为，区别于传统的 页面跳转，`<Link>` 的“跳转”行为只会触发相匹配的`<Route>`对应的 页面内容更新，而不会刷新整个页面。 `<Link>`做了 3 件事情: 有 onclick 那就执行 onclick click 的时候阻止 a 标签默认事件 根据跳转 href(即是 to)，用 history (web 前端路由两种方式之一， history & hash)跳转，此时只是链接变了，并没有刷新页面而`<a>`标签就是普通的超链接了，用于从当前页面跳转到 href 指向的另一 个页面(非锚点情况)。
a 标签默认事件禁掉之后做了什么才实现了跳转？

```
使用 JavaScript 中的路由导航方法，例如 window.location.href = targetUrl 或 window.location.replace(targetUrl) 来进行页面跳转。
```

## 对 Redux 的理解，主要解决什么问题

Redux 是一个用于管理 JavaScript 应用中的状态的库，它的设计思想基于 Flux 架构。Redux 的主要目标是解决应用中的状态管理问题。

在复杂的应用中，组件之间的状态共享和管理可能变得非常困难。在没有合适的状态管理工具时，状态分散在各个组件之间，导致代码的维护和调试变得困难，并且难以追踪数据的流动和变化。这就引发了一些常见的问题，如状态的一致性、难以调试和追踪状态变化等。

Redux 主要解决以下几个问题：

1. 单一数据源：Redux 强制使用单一的状态存储，即应用中的所有状态都被保存在一个称为 "store" 的对象中。这使得状态变化的追踪和管理更加简单，避免了状态分散和混乱。

2. 可预测性的状态管理：Redux 使用纯函数来处理状态的变化，称为 "reducer"。Reducer 接收先前的状态和一个动作对象，并返回一个新的状态。这种基于纯函数的方式确保了状态的可预测性，相同的输入会产生相同的输出，简化了状态的管理和调试。

3. 状态不可变性：Redux 鼓励状态的不可变性，即状态对象在修改时不会直接被改变，而是通过创建新的状态对象来表示变化。这样可以更好地追踪状态的变化历史，方便开发者进行调试和回溯。

4. 中心化的状态管理：Redux 的状态存储是一个中心化的存储，组件可以通过订阅和派发动作的方式与状态进行交互。这使得状态的变化和传递更加可控和可追踪，组件可以根据需要选择性地订阅状态的部分，并对状态的变化作出响应。

通过上述特点和设计思想，Redux 提供了一种可靠、可预测的状态管理方案，可以有效地解决应用中的状态管理问题，提供了更好的可维护性、可测试性和扩展性。

## Redux 状态管理器和变量挂载到 window 中有什么区别

将 Redux 状态管理器和变量挂载到 `window` 对象上与正常的 Redux 使用方式有一些区别。

1. 命名空间：将 Redux 状态管理器挂载到 `window` 对象上可能会导致全局命名空间的冲突。如果应用中的其他代码也使用了 `window` 对象来存储数据或方法，可能会造成命名冲突和不可预测的行为。使用 Redux 提供的正常方式，将状态管理器限定在应用内部，可以避免这种问题。

2. 封装性和安全性：将 Redux 状态管理器挂载到 `window` 对象上破坏了状态的封装性和安全性。Redux 的设计理念是将状态存储在单一的状态容器中，通过纯函数来处理状态的变化。将状态挂载到 `window` 对象上，意味着任何代码都可以直接修改状态，无法保证状态的一致性和可预测性。

3. 维护性：通过正常的 Redux 使用方式，状态管理器是集中管理的，可以方便地进行状态的追踪、调试和测试。而将状态挂载到 `window` 对象上，状态的变化可能分散在应用的各个部分，增加了代码的复杂性和维护的难度。

综上所述，将 Redux 状态管理器和变量挂载到 `window` 对象上可能会引入一些潜在的问题，如命名冲突、封装性和安全性的缺失，以及维护性的下降。因此，建议遵循 Redux 的正常使用方式，将状态管理器限定在应用内部，以保持代码的可维护性和安全性。

## Redux 和 Vuex 有什么区别，它们的共同思想

Redux 和 Vuex 都是用于管理状态的库，分别用于 JavaScript 应用和 Vue.js 应用。它们的共同思想基于 Flux 架构，但在实现细节和用法上有一些区别。

1. 库的属地：Redux 是为 JavaScript 应用而设计的，可以与任何 JavaScript 框架或库一起使用。而 Vuex 是专门为 Vue.js 应用而设计的，紧密集成在 Vue.js 生态系统中。

2. 语法和用法：Redux 使用纯 JavaScript 来编写和管理状态，它具有简洁明确的 API，包括创建状态容器、定义动作、编写纯函数的 reducer 等。而 Vuex 则利用 Vue.js 的响应式系统来实现状态管理，它提供了更直接的语法和概念，例如使用 `store` 对象、`state` 属性、`getters`、`mutations`、`actions` 等。

3. 工具和插件：Redux 提供了丰富的开发者工具和插件生态系统，如 Redux DevTools，可以帮助开发者更好地调试和追踪状态变化。Vuex 也提供了类似的工具，如 Vue DevTools，可以方便地监视和调试 Vuex 状态。

尽管 Redux 和 Vuex 在语法和用法上存在一些差异，但它们的共同思想是相似的：

1. 单一数据源：Redux 和 Vuex 都使用单一的状态容器来存储应用的所有状态，确保状态的一致性和可预测性。

2. 状态不可变性：Redux 和 Vuex 都鼓励状态的不可变性，即通过创建新的状态对象来表示状态的变化，而不是直接修改现有的状态对象。

3. 纯函数的状态变化：Redux 和 Vuex 都使用纯函数来处理状态的变化，通过接收先前的状态和动作对象，返回一个新的状态。这种方式保证了状态变化的可预测性和可追踪性。

综上所述，Redux 和 Vuex 都是基于 Flux 架构的状态管理库，它们有着相似的思想和目标，但在具体的实现和用法上有一些区别，适用于不同的技术栈和应用场景。

## Redux 中间件是怎么拿到 store 和 action? 然后怎么处理?

Redux 中间件是一个位于 action 被发起之后，到达 reducer 之前的扩展点，用于处理额外的逻辑。Redux 中间件可以拿到 store 和 action，并对其进行处理。

在 Redux 中，中间件是通过 `applyMiddleware` 函数来添加的。它接受一个或多个中间件作为参数，并返回一个增强后的 store 创建函数。

中间件函数的形式是 `store => next => action`，其中 `store` 是当前的 Redux store 对象，`next` 是一个函数，表示派发下一个中间件的函数，`action` 则是当前正在处理的 action 对象。

下面是一个简单的中间件示例，展示了如何拿到 store 和 action，并对其进行处理：

```javascript
const myMiddleware = store => next => action => {
  console.log('Current state:', store.getState());
  console.log('Action:', action);
  
  // 可以在此处进行一些逻辑处理，如异步操作、日志记录等
  
  // 调用下一个中间件，或者派发 action 到 reducer
  const result = next(action);
  
  console.log('New state:', store.getState());
  
  return result;
};
```

在上述示例中，中间件函数首先打印当前的状态和接收到的 action 对象。然后可以在中间件中进行一些逻辑处理，如异步操作或日志记录。最后，调用 `next(action)` 将控制权传递给下一个中间件，或者如果没有下一个中间件，则将 action 派发到 reducer。

通过使用中间件，可以对 action 进行拦截、修改、延迟或异步处理，以及在派发之前和之后执行其他逻辑。这使得 Redux 可以灵活地扩展和定制应用的行为。

在 Redux 应用中，可以使用多个中间件，并通过 `applyMiddleware` 函数将它们添加到 Redux store 中。这样，每个中间件都可以依次处理 action，并按照需要进行相应的操作。

## React Hooks 解决了哪些问题？

React Hooks 是 React 16.8 引入的一项功能，它解决了以下几个问题：

1. 状态逻辑的复用：在 React 之前，为了在组件之间共享状态逻辑，我们需要使用高阶组件（Higher-Order Components）或 Render Props。这种方式会导致组件层级的增加，使代码变得复杂。而 React Hooks 允许我们在函数组件中直接使用状态（useState）和其他 React 特性，使得状态逻辑的复用更加简单和直接。

2. 解决了类组件的冗余代码：在类组件中，需要通过定义生命周期方法（如 componentDidMount、componentDidUpdate 等）来处理副作用和状态的更新。这样会导致组件中的相关逻辑被分散在不同的生命周期方法中，增加了理解和维护的难度。而使用 React Hooks，我们可以使用 useEffect 来处理副作用和状态更新，将相关逻辑集中在一起，使代码更加清晰和易于管理。

3. 更直观的代码结构：使用类组件时，状态和生命周期方法之间的关系并不直观，需要阅读和理解大量的类组件代码。而使用函数组件和 React Hooks，我们可以将状态和副作用逻辑放在一起，使得组件的代码结构更加直观和自然，更容易理解和维护。

4. 避免了 this 的问题：在类组件中，需要使用 this 关键字来访问组件实例的属性和方法。但 this 的行为容易让人迷惑，而且需要额外的绑定操作（如使用 bind 或箭头函数）。而在函数组件中使用 React Hooks，不需要关注 this 的问题，直接使用函数的方式编写代码。

总体而言，React Hooks 提供了一种更简洁、更直观的方式来编写组件逻辑，解决了在类组件中遇到的一些问题，使得 React 组件的编写更加灵活、可维护和易于理解。它提供了一种函数式的编程方式，使得我们可以更专注于组件的逻辑和状态管理，而不需要关注类组件中的繁琐细节。

## React Hook 的使用限制有哪些？

React Hooks 有一些使用限制，需要遵循以下规则：

1. 只能在函数组件中使用：React Hooks 只能在函数组件中使用，不能在类组件中使用。这是因为 Hooks 是基于函数组件的函数式编程思想而设计的。

2. 顶层调用规则：在函数组件中使用 Hooks 时，需要确保 Hooks 在组件的顶层作用域中调用，不能在循环、条件语句或嵌套函数中调用 Hooks。这是为了确保 Hooks 的调用顺序始终保持一致。

3. Hooks 的调用次数和顺序：React Hooks 的调用次数和顺序必须保持稳定，即每次渲染时 Hooks 的调用次数和顺序必须相同。不能在条件语句中动态添加或移除 Hooks 的调用。

4. 自定义 Hook 的命名规则：自定义的 Hook 函数必须以 "use" 开头，这是为了与 React 内置的 Hooks 区分开来，并且使其在规范中更容易被识别。

5. Hooks 的顺序和依赖数组：在使用 `useState`、`useEffect` 等具有依赖项的 Hooks 时，需要确保传递的依赖数组是正确的，以避免不必要的渲染或副作用。需要注意的是，依赖数组中的每个元素都应该是稳定的引用，不要在依赖数组中使用变化的对象或数组。

需要遵守这些限制是为了确保 React Hooks 的正确使用和预期行为。违反这些限制可能导致错误的渲染结果、性能问题或其他不可预测的行为。因此，在使用 React Hooks 时，应该仔细阅读官方文档，并遵循规范和最佳实践。

## 对虚拟DOM的理解

虚拟 DOM（Virtual DOM）是 React 中的核心概念，它是一种轻量级的 JavaScript 对象，用于描述真实 DOM 的结构。

**核心思想：** 在内存中维护一棵虚拟 DOM 树，当数据变化时，先在内存中生成新的虚拟 DOM 树，然后与旧的虚拟 DOM 树进行对比（Diff），最后只将变化的部分更新到真实 DOM 上。

**虚拟 DOM 的本质：** 虚拟 DOM 本质上是一个普通的 JavaScript 对象（React 元素），通过 `React.createElement` 或 JSX 语法创建。每个虚拟 DOM 节点包含 `type`（元素类型）、`props`（属性）和 `children`（子节点）等信息。

```js
// JSX
const element = <div className="box">Hello</div>;

// 编译后等价于
const element = {
  type: 'div',
  props: {
    className: 'box',
    children: 'Hello'
  }
};
```

**虚拟 DOM 的优势：**

1. **性能优化**：通过 Diff 算法最小化 DOM 操作，减少浏览器重排和重绘。直接操作真实 DOM 代价昂贵，而虚拟 DOM 在内存中进行比对，只更新必要的部分。
2. **跨平台**：虚拟 DOM 是 JavaScript 对象，不依赖浏览器环境，因此可以用于服务端渲染（SSR）、移动端（React Native）等场景。
3. **声明式编程**：开发者只需描述 UI 应该是什么样子，React 负责将虚拟 DOM 映射到真实 DOM，降低了直接操作 DOM 的复杂度。
4. **批量更新**：React 会将多次状态更新合并为一次批量操作，减少不必要的渲染。

**虚拟 DOM 的劣势：**

- 首次渲染时，需要先构建虚拟 DOM 再映射到真实 DOM，比直接操作 DOM 略慢。
- 非常简单的页面中，虚拟 DOM 带来的 Diff 开销可能超过直接操作 DOM。

**与真实 DOM 的关系：** 虚拟 DOM 并非完全取代真实 DOM，而是一种中间层。React 通过虚拟 DOM 来管理真实 DOM 的更新，最终呈现给用户的仍然是真实 DOM。

## 谈谈你对React的理解

React 是一个用于构建用户界面的 JavaScript 库，其核心设计理念可以归纳为以下几方面：

**1. 组件化开发：** React 将 UI 拆分为独立、可复用的组件。每个组件管理自己的状态和逻辑，通过组合组件构建复杂界面。组件化提高了代码复用性、可维护性和可测试性。

**2. 声明式编程：** 开发者只需描述 UI 在任意时刻应该是什么样子（基于当前 state 和 props），React 负责高效地更新和渲染组件。与命令式编程（手动操作 DOM）相比，声明式编程更直观、更易调试。

**3. 虚拟 DOM 与 Diff 算法：** React 使用虚拟 DOM 作为真实 DOM 的内存映射。当状态变化时，React 通过 Diff 算法对比新旧虚拟 DOM 树，找出最小变更集，再批量更新真实 DOM，从而优化渲染性能。

**4. 单向数据流：** 数据从父组件通过 props 流向子组件，状态变更通过回调函数通知父组件。单向数据流使数据流向清晰、可追踪，便于调试和维护。

**5. Fiber 架构：** React 16 引入了 Fiber 架构，支持增量渲染、任务优先级调度和中断恢复。这使得 React 能更好地处理大规模应用的性能问题，并支持 Concurrent Mode（并发模式）。

**6. Hooks：** React 16.8 引入 Hooks，让函数组件也能拥有状态和副作用管理能力。Hooks 提取和复用有状态逻辑更加简单，减少了高阶组件和 Render Props 的嵌套地狱。

**7. 生态体系：** React 本身只关注视图层，但拥有丰富的生态系统：React Router（路由）、Redux/Zustand（状态管理）、Next.js（SSR/SSG）、React Native（跨平台）等。

总之，React 的本质是一个"视图 = f(state)"的函数式思想：给定相同的输入（state + props），总是渲染相同的输出（UI）。这种设计使 React 应用具有高度的可预测性和可维护性。

## 如何避免React生命周期中的坑

在 React 开发中，生命周期方法的使用存在一些常见的"坑"，需要特别注意：

**1. 避免在 render 阶段执行副作用：**

`render` 方法应该是纯函数，不应在其中执行 `setState`、发起请求、操作 DOM 等副作用操作。副作用应放在 `componentDidMount` 或 `componentDidUpdate` 中。

```js
// 错误：在 render 中调用 setState
render() {
  this.setState({ count: this.state.count + 1 }); // 导致无限循环
  return <div>{this.state.count}</div>;
}
```

**2. 避免在废弃的生命周期中执行副作用：**

`componentWillMount`、`componentWillReceiveProps`、`componentWillUpdate` 在 Fiber 架构下可能被多次执行。应使用 `getDerivedStateFromProps`（静态方法）或 `componentDidUpdate` 替代。

**3. getDerivedStateFromProps 的坑：**

- 它是静态方法，无法访问 `this`，不能调用 `this.setState`。
- 不要用它来"同步 props 到 state"，否则每次父组件渲染都会覆盖子组件的内部状态，导致 bug。如果需要基于 props 更新 state，应该使用 key 重新挂载组件或使用 `componentDidUpdate`。

```js
// 反模式：直接映射 props 到 state
static getDerivedStateFromProps(nextProps, prevState) {
  return { value: nextProps.value }; // 每次都会覆盖内部状态
}
```

**4. componentDidUpdate 中的无限循环：**

在 `componentDidUpdate` 中调用 `setState` 时必须加条件判断，否则会导致无限循环。

```js
componentDidUpdate(prevProps) {
  // 正确：条件判断
  if (this.props.id !== prevProps.id) {
    this.fetchData(this.props.id);
  }
}
```

**5. 避免在 shouldComponentUpdate 中进行深比较：**

深比较代价昂贵，反而可能降低性能。应使用 `React.PureComponent`（浅比较）或自定义浅比较逻辑。

**6. 避免在 componentWillUnmount 中忘记清理副作用：**

定时器、事件监听器、订阅等如果在组件卸载时未清理，会导致内存泄漏。

```js
componentDidMount() {
  this.timer = setInterval(this.tick, 1000);
  this.subscription = store.subscribe(this.handleChange);
}

componentWillUnmount() {
  clearInterval(this.timer);
  this.subscription(); // 取消订阅
}
```

**7. 函数组件的注意事项：**

使用 Hooks 时，`useEffect` 的清理函数（return 的函数）会在组件卸载或依赖变化时执行，确保清理逻辑正确。

```js
useEffect(() => {
  const subscription = store.subscribe(handleChange);
  return () => subscription(); // 清理函数
}, []);
```

## React Fiber架构

React Fiber 是 React 16 引入的全新协调（Reconciliation）引擎，是对 React 核心算法的一次重写。它的主要目标是支持**增量渲染**和**任务调度**。

**为什么需要 Fiber：**

旧版 React 的协调过程（Stack Reconciler）是同步、递归且不可中断的。当组件树很大时，一次性 Diff 和渲染会长时间占用主线程，导致动画卡顿、交互延迟。Fiber 架构解决了这个问题。

**Fiber 的核心概念：**

1. **Fiber 节点：** 每个组件对应一个 Fiber 节点，它是一个内部数据结构，记录了组件的类型、状态、props、子节点、兄弟节点、父节点等信息。Fiber 节点之间通过 `child`、`sibling`、`return` 指针形成链表结构（而非树结构），使得遍历可以中断和恢复。

2. **工作单元（Unit of Work）：** Fiber 将渲染任务拆分为多个小的工作单元。每处理完一个 Fiber 节点，React 会检查是否需要让出主线程（通过 `shouldYield` 判断是否有剩余时间）。

3. **可中断与可恢复：** Fiber 架构将渲染过程分为两个阶段：
   - **Render 阶段**（可中断）：构建 Fiber 树、计算变更。这个阶段是纯计算的，可以被中断和恢复。
   - **Commit 阶段**（不可中断）：将变更应用到真实 DOM。这个阶段是同步的，确保 UI 一致性。

4. **优先级调度：** Fiber 为不同类型的更新分配优先级（如用户交互 > 网络请求 > 动画）。高优先级任务可以打断低优先级任务的渲染。

5. **双缓冲技术：** React 维护两棵 Fiber 树——`current` 树（当前屏幕显示的）和 `workInProgress` 树（正在构建的）。渲染完成后，两棵树指针交换，实现平滑切换。

**Fiber 架构的工作流程：**

```js
// 简化的工作循环
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1; // 检查剩余时间
  }
  requestIdleCallback(workLoop); // 继续下一帧
}
```

**Fiber 带来的能力：**

- **并发渲染（Concurrent Rendering）：** React 18 的并发特性建立在 Fiber 之上。
- **Suspense：** 异步组件加载不阻塞主线程。
- **优先级更新：** `startTransition` 标记低优先级更新。
- **Streaming SSR：** 服务端流式渲染。

## createElement过程

`React.createElement` 是 React 用于创建虚拟 DOM 元素的核心方法。JSX 语法最终都会被 Babel 编译为 `createElement` 调用。

**函数签名：**

```js
React.createElement(type, [props], [...children])
```

- `type`：元素类型（字符串如 `'div'`，或组件函数/类，或 `React.Fragment`）
- `props`：属性对象（如 `{ className: 'box' }`）
- `children`：子元素（可变参数）

**执行过程：**

1. **参数处理：** `createElement` 首先处理传入的参数，将 `children` 从参数列表中提取出来。如果有多个 children，它们会被放入一个数组。

2. **props 合并：** 将传入的 props 和 children 合并为一个 props 对象。如果 children 只有一个，直接赋值；多个则放入数组。

3. **key 和 ref 提取：** 从 props 中提取 `key` 和 `ref`，它们不会作为普通 props 传递给子组件。

4. **defaultProps 处理：** 如果组件定义了 `defaultProps`，将未传入的 prop 设为默认值。

5. **生成 React 元素：** 返回一个 `ReactElement` 对象。

```js
const element = {
  $$typeof: Symbol(react.element),
  type: type,
  key: key,
  ref: ref,
  props: { ...props, children: children },
};
```

**示例：**

```js
// JSX
<div className="container">
  <h1 title="hello">Hello</h1>
  <p>World</p>
</div>

// 编译后
React.createElement('div', { className: 'container' },
  React.createElement('h1', { title: 'hello' }, 'Hello'),
  React.createElement('p', null, 'World')
);
```

**React 17+ 的变化：** React 17 引入了新的 JSX 转换，不再自动引入 React，而是使用 `react/jsx-runtime` 中的 `jsx` 函数替代 `createElement`。但核心流程基本一致。

## 调和阶段 setState内部干了什么

当调用 `setState` 时，React 在调和（Reconciliation）阶段会执行以下流程：

**1. 创建 Update 对象：**

`setState` 不会立即修改 state，而是创建一个 Update 对象，将其加入当前 Fiber 节点的更新队列（Update Queue）。

```js
// 简化的 Update 结构
{
  payload: newStateOrUpdater, // 可以是对象或函数
  callback: callback,         // 回调函数
  next: null,                 // 指向下一个 update（链表）
}
```

**2. 标记更新（Schedule Update）：**

React 将该 Fiber 节点标记为"需要更新"（`Update` flag），并从该节点向上遍历到根节点，沿途标记 `childLanes`，通知调度器有更新需要处理。

**3. 调度阶段（Schedule）：**

调度器根据更新的优先级决定何时开始处理。在 Concurrent Mode 下，高优先级更新（如用户输入）可以打断低优先级更新。

**4. Render 阶段（协调）：**

调度器分配时间片后，React 开始从根节点向下遍历 Fiber 树：

- **beginWork：** 处理每个 Fiber 节点，调用 `render`（类组件）或执行函数体（函数组件），生成子元素。
- 对于发生更新的节点，遍历 Update Queue，依次执行每个 update（如果是函数则传入 prevState 计算），得到新的 state。
- 将新 state 与旧 state 浅比较，判断是否需要继续向下调和。
- 构建 `workInProgress` Fiber 树。

**5. Reconcile Children：**

在 `beginWork` 中，React 会 Diff 新旧子节点（`reconcileChildren`），标记需要增、删、改的节点（`Placement`、`Deletion`、`Update` 等 effect tag）。

**6. Commit 阶段：**

Render 阶段完成后，进入 Commit 阶段（同步执行）：

- **Before mutation：** 读取 DOM 快照。
- **Mutation：** 执行 DOM 操作（增、删、改）。
- **Layout：** 调用 `componentDidMount`、`componentDidUpdate` 等生命周期，执行 `setState` 的回调函数。

**关键点：**

- `setState` 是异步的（批处理）。多次调用会被合并为一次更新。
- 在 React 18 中，所有更新都自动批处理（Automatic Batching），包括 `setTimeout`、Promise 中的 `setState`。
- 如果 `setState` 传入函数，React 会按顺序依次执行，确保拿到最新的 prev state。

```js
// 批处理示例
handleClick() {
  this.setState({ a: 1 }); // 不会立即更新
  this.setState({ b: 2 }); // 合并到同一次更新
  console.log(this.state); // 仍然是旧值
}
```

## setState原理分析

`setState` 是 React 类组件中更新状态的核心 API。其原理涉及批处理、更新队列和协调过程。

**1. setState 的本质：**

`setState` 不会直接修改 `this.state`，而是将更新请求放入一个更新队列中，然后触发重新渲染。React 会将多个 setState 合并处理，提高性能。

```js
// React.Component.prototype.setState 的简化逻辑
setState(partialState, callback) {
  // 创建一个 update 对象
  const update = {
    payload: partialState,   // 可以是对象或 (prevState, props) => partialState
    callback,                // setState 的回调函数
    next: null,
  };
  // 将 update 加入当前 Fiber 的更新队列
  enqueueUpdate(this, update);
  // 调度更新
  scheduleUpdateOnFiber(this);
}
```

**2. 批处理（Batching）：**

React 会将同一事件循环中的多次 setState 合并为一次更新：

```js
// 对象形式，后者覆盖前者
this.setState({ count: 1 });
this.setState({ count: 2 });
this.setState({ count: 3 });
// 最终只触发一次重新渲染，state.count = 3

// 使用函数形式避免覆盖
this.setState(prev => ({ count: prev.count + 1 }));
this.setState(prev => ({ count: prev.count + 1 }));
this.setState(prev => ({ count: prev.count + 1 }));
// 最终 count 增加 3
```

**3. 异步更新的原因：**

- **性能优化：** 如果每次 setState 都立即更新并重新渲染，会导致大量不必要的渲染。批处理将多次更新合并为一次。
- **一致性：** 在事件处理函数中，state 和 props 在整个处理过程中保持一致，避免读到中间状态。

**4. 更新队列的处理：**

在 Fiber 架构下，每个类组件的 Fiber 节点持有一个 `updateQueue`（更新队列），它是一个环形链表。在 Render 阶段，React 会遍历这个链表，依次处理每个 update：

- 如果 update.payload 是对象，直接浅合并到 state。
- 如果 update.payload 是函数，调用 `function(prevState, props)` 得到新的部分 state。

**5. 什么时候是同步的？**

在 React 的生命周期和事件处理中，setState 是异步的。但在 `setTimeout`、`Promise.then`、原生事件监听器中，React 18 之前会同步执行（React 18 后统一为异步批处理）。

```js
// React 17 的行为
componentDidMount() {
  this.setState({ count: 1 }); // 异步
  console.log(this.state.count); // 0

  setTimeout(() => {
    this.setState({ count: 2 }); // 同步（React 17）
    console.log(this.state.count); // 2
  }, 0);
}

// React 18：setTimeout 中的 setState 也是异步的（Automatic Batching）
```

**6. 函数组件的等价：**

函数组件使用 `useState` 返回的 setter（如 `setCount`），其原理类似，也是将更新放入队列然后调度。React 18 后两者完全统一。

## React事务机制

React 事务（Transaction）机制是 React 内部用于管理批量更新和生命周期的一种设计模式，主要存在于旧版 React（Fiber 之前）的 `ReactDefaultBatchingStrategy` 中。

**事务的核心思想：**

事务提供了一种"包装"机制，在任何方法执行前后自动运行初始化（initialize）和收尾（close）逻辑。类似于数据库事务的概念。

**事务的结构：**

```js
// 简化的事务结构
class Transaction {
  wrappers = []; // 包装器列表

  perform(method, scope, ...args) {
    // 1. 执行所有 wrapper 的 initialize
    this.wrappers.forEach(w => w.initialize());

    try {
      // 2. 执行目标方法
      return method.apply(scope, args);
    } finally {
      // 3. 执行所有 wrapper 的 close
      this.wrappers.forEach(w => w.close());
    }
  }
}
```

**在 React 中的应用：**

React 的事务机制主要用于批处理更新。当你在事件处理函数中调用多次 `setState` 时：

1. **initialize 阶段：** 设置 `isBatchingUpdates = true`，告诉 React 后续的 setState 不要立即更新，而是放入队列。
2. **执行阶段：** 运行事件处理函数，其中的 setState 被收集到队列中。
3. **close 阶段：** 设置 `isBatchingUpdates = false`，然后统一处理队列中的所有更新（flush batch），触发一次重新渲染。

```js
const BATCHING_UPDATE = {
  initialize() {
    isBatchingUpdates = true;
  },
  close() {
    isBatchingUpdates = false;
    flushBatchedUpdates(); // 统一处理所有排队的状态更新
  }
};
```

**Fiber 架构后的变化：**

在 React 16+ 的 Fiber 架构中，事务机制逐渐被新的调度器（Scheduler）和优先级模型取代。React 18 引入了 Automatic Batching，不再依赖旧的事务机制，而是通过 `lane` 模型和调度器统一管理批处理。

**总结：** React 事务机制是一种在方法执行前后自动运行初始化和清理逻辑的模式，主要用于批量更新。它在 Fiber 架构之前是 React 状态管理的核心机制，之后被调度器取代，但其思想（包装 + 批处理）仍然延续。

## 如何解释 React 的渲染流程

React 的渲染流程可以分为**初始渲染**和**更新渲染**两个阶段，核心是"协调"（Reconciliation）过程。

**一、初始渲染（Mount）：**

1. **创建虚拟 DOM：** 根据 JSX 或 `createElement` 生成 React 元素树（虚拟 DOM）。

2. **构建 Fiber 树：** React 将虚拟 DOM 转换为 Fiber 节点链表结构（`current` Fiber 树）。

3. **渲染到 DOM：** 在 Commit 阶段，React 根据 Fiber 树创建真实 DOM 节点，并插入到页面。

```js
// 入口
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

**二、更新渲染（Update）：**

当组件的 state 或 props 变化时：

1. **触发更新：** `setState` 或 `useState` 的 setter 将更新加入队列。

2. **调度（Schedule）：** 调度器根据优先级决定何时处理更新。Concurrent Mode 下可中断。

3. **Render 阶段（可中断）：**
   - React 从根节点开始遍历 Fiber 树（`beginWork`）。
   - 对每个发生更新的组件，重新执行 render 或函数体，得到新的子元素。
   - **Diff（Reconciliation）：** 比较新旧 Fiber 节点的 children，标记需要增删改的操作。
   - 构建 `workInProgress` Fiber 树（双缓冲技术）。

4. **Commit 阶段（不可中断）：**
   - **Before Mutation：** 读取 DOM 信息（如 scroll position）。
   - **Mutation：** 执行 DOM 操作（增、删、改节点）。
   - **Layout：** 调用类组件的 `componentDidMount`/`componentDidUpdate`，函数组件的 `useLayoutEffect`。
   - **Passive Effects：** 异步执行 `useEffect`。

**三、Diff 算法（协调核心）：**

React 的 Diff 基于三个假设来降低时间复杂度（从 O(n³) 降到 O(n)）：

- **同层比较：** 只比较同一层级的节点，不跨层级移动。
- **类型不同直接替换：** 如果节点类型（如 `div` → `span`）不同，直接销毁旧节点创建新节点。
- **key 标识：** 通过 key 判断列表元素是否可以复用。

**四、渲染流程总结：**

```
state/props 变化
    ↓
Schedule（调度，分配优先级）
    ↓
Render 阶段（构建 Fiber 树 + Diff，可中断）
    ↓
Commit 阶段（更新 DOM + 生命周期，不可中断）
    ↓
浏览器绘制
```

## diff算法是怎么运作

React 的 Diff 算法是协调（Reconciliation）的核心，用于对比新旧虚拟 DOM 树，找出需要更新的最小变更集。

**三个优化策略（将复杂度从 O(n³) 降到 O(n)）：**

1. **同层比较：** 只对同一层级的节点进行 Diff，不跨层级移动节点。如果一个节点跨层移动了，React 会将其视为"删除 + 新建"。

2. **类型不同直接替换：** 如果新旧节点的 `type` 不同（如 `div` → `span`），直接销毁旧节点及其子树，创建新节点及其子树。

3. **列表 key 标识：** 对于同类型的列表子节点，通过 `key` 来判断节点是否可以复用。

**Diff 的分类：**

**1. Tree Diff（树级比较）：** 按层级从上到下遍历，对每一层进行节点比较。如果发现节点类型不同，直接替换整棵子树。

**2. Component Diff（组件级比较）：**
- 如果组件类型相同，继续 Diff 子节点。
- 如果组件类型不同，直接卸载旧组件，挂载新组件。
- 可以通过 `shouldComponentUpdate` 跳过子树 Diff。

**3. Element Diff（元素级比较，列表 Diff）：**

当同一层级的子节点是列表时，React 通过 key 来判断元素是否复用：

```
旧列表: A B C D
新列表: A D B C
```

Diff 过程：
- 遍历新列表，逐个与旧列表对应位置比较。
- 如果 key 相同且 type 相同，复用该节点，更新 props。
- 如果 key 不存在于旧列表中，创建新节点。
- 遍历结束后，旧列表中未被复用的节点被删除。

**为什么需要 key：**

- 没有 key 时，React 默认用 index 作为 key。当列表顺序变化时，会导致不必要的 DOM 操作甚至状态错乱。
- 有了唯一 key，React 能精准定位节点，只移动而非重建。

```js
// 错误：用 index 作为 key
list.map((item, index) => <li key={index}>{item}</li>);

// 正确：用唯一 id 作为 key
list.map(item => <li key={item.id}>{item.name}</li>);
```

## 合成事件原理

React 的合成事件（SyntheticEvent）是 React 对浏览器原生事件的封装，提供统一的跨浏览器 API。

**核心原理：事件委托（Event Delegation）：**

React 并不将事件监听器绑定到每个 DOM 元素上，而是在 `document`（React 16）或 `root` 容器（React 17+）上注册一个统一的事件监听器。当事件冒泡到顶层时，React 从触发事件的 DOM 节点向上遍历到根节点，依次调用对应的事件处理函数。

**工作流程：**

1. **挂载阶段：** 当组件中绑定了 `onClick` 等事件时，React 不会在 DOM 元素上添加 `addEventListener`，而是在 `document`/`root` 上注册一个统一监听器（如 `click` 的监听器只注册一次）。

2. **事件触发：** 用户点击元素后，浏览器将原生事件冒泡到 `document`/`root`。

3. **事件分发（Dispatch）：** React 从 `event.target` 开始向上遍历，收集路径上所有绑定了同类型事件的组件。

4. **构造合成事件：** React 创建 `SyntheticEvent` 对象，它包装了原生事件，提供统一的属性（`target`、`currentTarget`、`preventDefault` 等）。

5. **执行事件处理函数：** React 按冒泡顺序依次调用收集到的事件处理函数，并将合成事件对象传入。

**React 16 vs React 17 的事件变化：**

| 特性 | React 16 | React 17+ |
|------|----------|-----------|
| 事件委托位置 | `document` | root 容器 |
| 事件池 | 有（事件对象会被复用） | 无（事件对象不会被回收） |
| 嵌套容器问题 | 多个 React 应用事件冲突 | 解决了 |

**合成事件的优势：**

1. **跨浏览器兼容：** 统一了不同浏览器的事件 API 差异。
2. **性能优化：** 事件委托减少了事件监听器数量。
3. **事件池：** React 16 中合成事件对象会被复用，减少 GC 压力。

```js
// React 16 中的事件池问题
function handleClick(e) {
  setTimeout(() => {
    console.log(e.target); // null！事件对象已被回收
  }, 0);
  // 解决：调用 e.persist() 或手动保存值
  const target = e.target;
  setTimeout(() => {
    console.log(target); // 正常
  }, 0);
}
```

## 为什么 React 元素有一个 $$typeof 属性

`$$typeof` 属性是 React 元素对象上的一个标识字段，用于**安全校验**，防止 XSS 攻击。

**作用：**

React 在创建元素时，会为每个元素对象添加 `$$typeof: Symbol.for('react.element')`（或 `0xeac7` 在不支持 Symbol 的环境中）。React 在渲染前会检查这个字段，如果值不匹配，会拒绝渲染该对象。

**为什么需要：**

React 允许通过 JSX 嵌入动态内容。如果应用从 API 或用户输入接收到一个"假"的 React 元素对象（实际上是一个包含恶意 `type` 的 JSON），React 可能会执行其中的代码。`$$typeof` 作为"防伪标签"，确保只有 React 自身创建的元素才会被渲染。

```js
// 一个合法的 React 元素
{
  $$typeof: Symbol.for('react.element'),
  type: 'div',
  key: null,
  ref: null,
  props: { children: 'Hello' }
}

// 伪造的对象（来自 API 响应）
// 没有 $$typeof 或值不匹配，React 拒绝渲染
{
  type: 'div',
  props: { children: 'Hello' }
}
```

**为什么用 Symbol：**

`Symbol.for('react.element')` 是全局唯一的且不可伪造的。JSON 中无法包含 Symbol 类型（`JSON.parse` 不会产生 Symbol），因此即使攻击者通过 JSON 注入一个假对象，也无法伪造合法的 `$$typeof` 值。

**总结：** `$$typeof` 是 React 元素的"身份证"，确保只有 React 内部创建的元素对象才会被渲染到 DOM，防止 XSS 注入。

## React有哪些优化性能的手段

React 应用的性能优化可以从多个维度入手：

**1. 减少不必要的渲染：**

- **`React.memo`**：对函数组件进行 props 浅比较，避免无关 props 变化导致的重新渲染。

```js
const MyComponent = React.memo(function MyComponent(props) {
  return <div>{props.name}</div>;
}, (prevProps, nextProps) => {
  return prevProps.name === nextProps.name; // 返回 true 表示不重新渲染
});
```

- **`PureComponent`**：类组件的浅比较版本，自动实现 `shouldComponentUpdate`。
- **`useMemo` / `useCallback`**：缓存计算结果和回调函数，避免子组件不必要的渲染。

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

**2. 列表优化：**

- 使用唯一且稳定的 `key`（不要用 index）。
- **虚拟滚动**：长列表只渲染可视区域内的元素（如 `react-window`、`react-virtualized`）。

```js
import { FixedSizeList } from 'react-window';
<FixedSizeList height={600} itemCount={1000} itemSize={35}>
  {({ index, style }) => <div style={style}>Item {index}</div>}
</FixedSizeList>
```

**3. 代码分割（Code Splitting）：**

- **`React.lazy` + `Suspense`**：按需加载路由组件，减少首屏包体积。

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
<Suspense fallback={<div>Loading...</div>}>
  <OtherComponent />
</Suspense>
```

**4. 状态管理优化：**

- 将频繁变化的状态下沉到子组件中，避免大范围重新渲染。
- 使用 `useReducer` 替代多个 `useState`，合并相关状态。
- 避免在 Context 中存储频繁变化的值，或使用选择器（selector）减少订阅范围。

**5. 避免内联函数和对象：**

```js
// 错误：每次渲染创建新函数，导致子组件重新渲染
<Component onChange={(e) => handleChange(e.id)} />

// 正确：useCallback 缓存函数
const handleChangeById = useCallback((id) => handleChange(id), []);
<Component onChange={handleChangeById} />
```

**6. 请求优化：**

- 数据缓存（如 SWR、React Query），避免重复请求。
- 防抖（debounce）和节流（throttle）减少触发频率。

**7. 使用 Profiler 定位性能瓶颈：**

```js
<React.Profiler id="app" onRender={(id, phase, actualDuration) => {
  console.log(`${id} ${phase} took ${actualDuration}ms`);
}}>
  <App />
</React.Profiler>
```

**8. 并发特性（React 18+）：**

- **`useTransition`**：将低优先级更新标记为 transition，不阻塞用户交互。

```js
const [isPending, startTransition] = useTransition();
const handleChange = (e) => {
  setInput(e.target.value); // 高优先级
  startTransition(() => {
    setSearchResults(search(e.target.value)); // 低优先级
  });
};
```

## Redux实现原理解析

Redux 是一个基于 Flux 思想的状态管理库，其核心是**单一数据源**、**纯函数 Reducer**和**单向数据流**。

**三大原则：**

1. **单一数据源：** 整个应用的状态存储在一个对象树（Store）中。
2. **状态只读：** 改变状态的唯一方式是触发 Action。
3. **纯函数变更：** Reducer 是纯函数，接收旧 state 和 action，返回新 state。

**核心实现：**

**1. createStore：**

```js
function createStore(reducer, preloadedState, enhancer) {
  let state = preloadedState;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action); // 调用 reducer 计算新 state
    listeners.forEach(fn => fn());   // 通知所有订阅者
    return action;
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(fn => fn !== listener); // 取消订阅
    };
  };

  dispatch({ type: '@@INIT' }); // 初始化 state

  return { getState, dispatch, subscribe };
}
```

**2. combineReducers：**

将多个子 reducer 合并为一个 root reducer。

```js
function combineReducers(reducers) {
  return (state = {}, action) => {
    const nextState = {};
    let hasChanged = false;

    for (const key in reducers) {
      const prevChildState = state[key];
      const nextChildState = reducers[key](prevChildState, action);
      nextState[key] = nextChildState;
      hasChanged = hasChanged || nextChildState !== prevChildState;
    }

    return hasChanged ? nextState : state;
  };
}
```

**3. applyMiddleware：**

中间件机制是 Redux 的扩展点，位于 dispatch 和 reducer 之间。

```js
function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState) => {
    const store = createStore(reducer, preloadedState);

    let dispatch = store.dispatch;
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    };

    const chain = middlewares.map(mw => mw(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch); // 洋葱模型

    return { ...store, dispatch };
  };
}
```

**4. 数据流：**

```
View → dispatch(action) → middleware → reducer → new state → notify listeners → View 更新
```

**5. React 绑定（react-redux）：**

`connect` 和 `useSelector` 通过 `store.subscribe` 订阅 store 变化。当 store 更新时，检查 selector 返回的值是否变化，决定是否触发组件重新渲染。

## 谈谈你对状态管理的理解

状态管理是前端应用的核心议题之一，其本质是**如何在组件树中高效、可维护地管理共享数据和 UI 状态**。

**为什么需要状态管理：**

1. **组件通信：** 当深层嵌套组件需要共享数据时，通过 props 逐层传递（prop drilling）会导致中间组件冗余和难以维护。
2. **状态同步：** 多个组件需要展示同一份数据，且数据变化时需要同步更新。
3. **数据缓存：** 缓存 API 请求结果，避免重复请求。
4. **可预测性：** 集中管理状态变化，便于调试和回溯（如时间旅行）。

**状态管理的分类：**

**1. 本地状态（Local State）：** 组件内部使用的状态，通过 `useState` 或类组件的 `this.state` 管理。适合不与其他组件共享的简单状态。

**2. 共享状态（Shared State）：** 跨组件共享的状态。根据共享范围选择方案：

| 方案 | 适用场景 | 特点 |
|------|---------|------|
| props / callback | 父子组件 | 简单直接，不适合深层嵌套 |
| Context | 中等规模共享 | React 原生，无额外依赖 |
| Redux | 大型应用 | 单一数据源、可预测、时间旅行 |
| Zustand | 中小型应用 | 轻量、无 Provider、Hook 式 API |
| MobX | 响应式偏好 | 自动追踪依赖，细粒度更新 |
| Jotai/Recoil | 原子化状态 | 细粒度订阅，避免不必要渲染 |

**3. 服务端状态（Server State）：** 从 API 获取的数据，需要缓存、同步、失效等管理。推荐使用 SWR 或 React Query 等。

**状态管理的设计原则：**

1. **单一数据源：** 将共享状态集中管理，而非分散在各组件。
2. **不可变性：** 状态变更通过创建新对象完成，便于追踪和优化。
3. **单向数据流：** 数据从 store 流向组件，组件通过 dispatch/action 触发变更。
4. **关注点分离：** 将业务逻辑（reducer）与视图（组件）解耦。
5. **合理粒度：** 不是所有状态都需要全局管理。局部状态留在组件中，全局状态才放入 store。

**现代趋势：**

- React Context + useReducer 可以满足中小型应用的需求，无需引入 Redux。
- 原子化状态（Jotai、Recoil）解决 Context 全局更新导致的性能问题。
- React 18 的 `useSyncExternalStore` 为外部状态库提供了标准接入方式。

## connect组件原理分析

`connect` 是 react-redux 提供的高阶组件（HOC），用于将 Redux store 中的状态和 dispatch 方法注入到 React 组件中。

**基本用法：**

```js
const mapStateToProps = (state) => ({ count: state.count });
const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch({ type: 'INCREMENT' })
});
export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

**实现原理：**

`connect` 的核心是通过 Context 获取 store，订阅 store 变化，并在状态变化时触发组件重新渲染。

```js
// 简化的 connect 实现
function connect(mapStateToProps, mapDispatchToProps) {
  return (WrappedComponent) => {
    class ConnectedComponent extends React.Component {
      static contextType = ReactReduxContext;

      componentDidMount() {
        this.unsubscribe = this.context.store.subscribe(this.handleChange);
        this.handleChange();
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      handleChange = () => {
        const newState = mapStateToProps(this.context.store.getState());
        if (!shallowEqual(newState, this.state.mappedProps)) {
          this.setState({ mappedProps: newState });
        }
      };

      render() {
        const dispatchProps = mapDispatchToProps
          ? mapDispatchToProps(this.context.store.dispatch)
          : { dispatch: this.context.store.dispatch };
        return <WrappedComponent {...this.state.mappedProps} {...dispatchProps} {...this.props} />;
      }
    }
    return ConnectedComponent;
  };
}
```

**关键优化：**

1. **浅比较（shallowEqual）：** connect 内部对 mapStateToProps 返回的对象做浅比较，只有当引用变化时才触发重新渲染。
2. **合并 props：** connect 合并 mapStateToProps 返回的 props、mapDispatchToProps 返回的 props 和组件自身的 props。
3. **订阅优化：** react-redux 使用 `useSyncExternalStore`（React 18）或自定义的订阅机制，确保批量更新时只重新渲染一次。

**Hooks 替代方案：**

```js
import { useSelector, useDispatch } from 'react-redux';

function Counter() {
  const count = useSelector(state => state.count, shallowEqual);
  const dispatch = useDispatch();
  return <button onClick={() => dispatch({ type: 'INCREMENT' })}>{count}</button>;
}
```

## 如何避免ajax数据请求重新获取

在 React 应用中，避免 AJAX 请求重复发送是一个常见的性能优化问题。

**1. 缓存请求结果：**

将已请求的数据缓存起来，下次需要时直接从缓存读取。可以使用 SWR、React Query 等库自动处理。

```js
import useSWR from 'swr';

function UserProfile({ id }) {
  const { data, error } = useSWR(`/api/users/${id}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000, // 5 秒内去重
  });
}
```

**2. 请求去重：**

对于同时发出的相同请求，合并为一个。

```js
const cache = new Map();
function fetchData(url) {
  if (cache.has(url)) return cache.get(url);
  const promise = fetch(url).then(res => {
    cache.delete(url);
    return res.json();
  }).catch(err => {
    cache.delete(url);
    throw err;
  });
  cache.set(url, promise);
  return promise;
}
```

**3. 防抖和节流：**

对于搜索框等频繁触发的请求，使用防抖。

```js
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
```

**4. 竞态条件处理：**

当快速切换页面时，使用请求 ID 或 AbortController 处理后发先至的问题。

```js
useEffect(() => {
  const controller = new AbortController();
  let isCancelled = false;

  fetch(`/api/data/${id}`, { signal: controller.signal })
    .then(res => res.json())
    .then(data => {
      if (!isCancelled) setData(data);
    });

  return () => {
    isCancelled = true;
    controller.abort();
  };
}, [id]);
```

**5. 状态管理缓存：**

将请求结果存入 Redux/Zustand，在请求前先检查 store 中是否已有数据。

```js
function fetchUserIfNeeded(id) {
  return (dispatch, getState) => {
    const { users } = getState();
    if (users[id]) return Promise.resolve(users[id]);
    return fetchUser(id).then(user => {
      dispatch({ type: 'USER_LOADED', user });
      return user;
    });
  };
}
```

## 组件之间通信

React 中组件之间通信的方式有多种，根据组件之间的关系选择合适的方式：

**1. 父子组件通信（直接）：**

- **父 → 子：** 通过 props 传递数据和回调函数。
- **子 → 父：** 通过回调函数。

```js
function Parent() {
  const [data, setData] = useState('hello');
  return <Child data={data} onAction={(v) => setData(v)} />;
}
```

**2. 兄弟组件通信：**

通过共同的父组件中转，或使用状态提升。

```js
function Parent() {
  const [shared, setShared] = useState('');
  return (
    <>
      <SiblingA onChange={setShared} />
      <SiblingB value={shared} />
    </>
  );
}
```

**3. 跨层级通信：**

- **Context API：** 通过 Provider/Consumer 或 `useContext` 跨层传递数据。

```js
const ThemeContext = createContext();

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <DeepComponent />
    </ThemeContext.Provider>
  );
}

function DeepComponent() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Content</div>;
}
```

**4. 全局状态管理：**

使用 Redux、Zustand、MobX 等状态管理库，实现任意组件间通信。

```js
const useStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 }))
}));
const { count, increment } = useStore();
```

**5. Refs 通信：**

通过 `ref` 或 `forwardRef` 直接访问子组件实例或 DOM 节点。

```js
const Child = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    method: () => console.log('called')
  }));
  return <div>Child</div>;
});
```

**通信方式选择：**

| 场景 | 推荐方式 |
|------|---------|
| 父子直接通信 | props + callback |
| 兄弟/小范围 | 状态提升 |
| 跨层级 | Context |
| 全局共享 | Redux / Zustand |
| DOM 操作 | ref / forwardRef |

## 如何设计React组件

良好的 React 组件设计是构建可维护应用的关键。以下是一些设计原则和实践：

**1. 单一职责原则（SRP）：** 每个组件只做一件事。如果一个组件同时负责数据获取、业务逻辑和 UI 展示，应该将其拆分。

```js
// 拆分前：一个组件做了太多事
function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => fetchUsers().then(setUsers), []);
  const [filter, setFilter] = useState('');
  // ...
}

// 拆分后：分离职责
function UserListContainer() {
  const [users, setUsers] = useState([]);
  useEffect(() => fetchUsers().then(setUsers), []);
  return <UserListView users={users} />;
}

function UserListView({ users }) {
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

**2. 容器组件与展示组件分离：**

- **容器组件：** 负责数据获取和状态管理。
- **展示组件：** 只负责 UI 呈现，通过 props 接收数据。

**3. 自定义 Hook 提取逻辑：** 将有状态逻辑提取为可复用的自定义 Hook。

```js
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(url).then(res => res.json()).then(data => {
      setData(data);
      setLoading(false);
    });
  }, [url]);
  return { data, loading };
}
```

**4. 合理的接口设计：** props 命名清晰、语义化，提供合理的默认值，避免传递过多 props。

**5. 组合优于继承：** React 推荐使用组合模式而非继承来复用代码。

```js
function Dialog({ children, title }) {
  return (
    <div className="dialog">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

**6. 类型安全：** 使用 TypeScript 或 PropTypes 定义组件的 props 类型。

## 组件的协同及（不）可控组件

**组件协同：** 组件协同是指多个组件之间如何配合工作。常见的协同模式有：

1. **组合模式（Composition）：** 通过 `children` 或 `render props` 将组件组合在一起。
2. **高阶组件（HOC）：** 通过包装组件注入额外能力。
3. **自定义 Hook：** 将状态逻辑复用，组件之间通过 Hook 协同。
4. **Context 共享：** 通过 Context 在组件树中共享状态。

**受控组件（可控组件）：** 组件的值由 React 的 state 完全控制。

```js
function ControlledInput() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}
```

特点：数据源是 React state，是"唯一真相源"；支持即时验证、条件禁用按钮等；更容易处理表单提交。

**非受控组件（不可控组件）：** 组件的值由 DOM 自身管理，React 通过 `ref` 获取值。

```js
function UncontrolledInput() {
  const inputRef = useRef();
  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="default" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

特点：代码更简洁；适合一次性获取值（如表单提交时）；难以实现即时验证。

**何时选择哪种：**

| 场景 | 推荐 |
|------|------|
| 即时验证 | 受控 |
| 动态禁用按钮 | 受控 |
| 简单表单，提交时取值 | 非受控 |
| 与第三方库集成 | 非受控 |
| 大型复杂表单 | 受控 |

## React 17 带来了哪些改变

React 17 是一个"无新特性"的版本，主要聚焦于内部架构的改进和为后续版本铺路。

**1. 事件委托的改变：** React 16 及之前，React 在 `document` 上注册事件监听器。React 17 将事件委托改为在 React 应用的根容器（root node）上注册。影响：多个 React 应用可以安全地嵌套在同一页面中，不会互相干扰。

**2. 新的 JSX 转换：** React 17 引入了新的 JSX 编译方式，不再需要在每个文件中 `import React`。Babel 通过 `react/jsx-runtime` 自动处理。

```js
// 旧：必须导入 React
import React from 'react';
const el = <div />;

// 新（React 17+）：无需导入 React
const el = <div />;
// 编译为：import { jsx as _jsx } from 'react/jsx-runtime'; _jsx('div', {});
```

**3. 事件池移除：** React 17 移除了合成事件池（Event Pooling），事件对象不再被复用。React 16 中需要 `e.persist()` 才能异步访问事件属性，React 17 后不再需要。

**4. 副作用清理时机：** `useEffect` 的清理函数执行时机从同步变为异步。React 17 中，清理函数会在屏幕更新后执行，确保不会阻塞浏览器绘制。

**5. 渐进升级支持：** React 17 的核心改进是为"渐进升级"铺路，使得未来可以逐步将应用从旧版本 React 迁移到新版本，而非一次性全部升级。

**总结：** React 17 本身没有面向开发者的新特性，但内部架构（事件系统、JSX 转换、effect 时机）的改进为 React 18 的并发渲染打下了基础。

## 如何理解React State不可变性的原则

React 中的状态不可变性原则是指一旦创建了组件的状态（state），就不能直接修改它，而应该通过 setState 方法来进行更新。这个原则的核心思想是确保状态的变更是可控、可预测的，以提高代码的可维护性和性能。

## JSX本质

1. **语法糖：** JSX 实际上是 JavaScript 的语法糖，它提供了一种更易读、更直观的方式来描述 UI 结构。在运行时，JSX 会被转译为普通的 JavaScript 对象，这些对象描述了要渲染的 UI 结构。

2. **React.createElement：** JSX 元素最终会被转译为对 `React.createElement` 函数的调用。`React.createElement` 接受三个参数：要创建的元素类型、元素的属性（props），以及子元素。它返回一个描述虚拟 DOM 结构的对象。

例如，以下的 JSX 代码：

```jsx
const element = <h1 className="greeting">Hello, React!</h1>;
```

将被转译为类似于下面的 JavaScript 代码：

```jsx
const element = React.createElement('h1', { className: 'greeting' }, 'Hello, React!');
```

JSX 是 React 提供的一种方便的语法糖，使得在 JavaScript 中描述 UI 结构更加清晰和直观，而它的本质则是通过 `React.createElement` 函数来创建虚拟 DOM 对象。

## 为什么要废弃 componentWillMount、componentWillReceiveProps、componentWillUpdate ?

React 在 16.3 版本中：

- 将 `componentWillMount`、`componentWillReceiveProps`、`componentWillUpdate` 三个生命周期钩子加上了 `UNSAFE` 前缀，变为 `UNSAFE_componentWillMount`、`UNSAFE_componentWillReceiveProps` 和 `UNSAFE_componentWillUpdate`。
- 并引入了一个新的生命周期钩子：`getDerivedStateFromProps`。

并在 17.0 以及之后的版本中：

- 删除了 `componentWillMount`、`componentWillReceiveProps`、`componentWillUpdate` 这三个生命周期钩子。
- 不过 `UNSAFE_componentWillMount`、`UNSAFE_componentWillReceiveProps` 和 `UNSAFE_componentWillUpdate` 还是可以用的。

我们知道 React 的更新流程分为：render 阶段和 commit 阶段。

`componentWillMount`、`componentWillReceiveProps`、`componentWillUpdate` 这三个生命周期钩子都是在 render 阶段执行的。

在 fiber 架构被应用之前，render 阶段是不能被打断的。当页面逐渐复杂之后，就有可能会阻塞页面的渲染，于是 React 推出了 fiber 架构。在应用 fiber 架构之后，低优先级任务的 render 阶段可以被高优先级任务打断。

而这导致的问题就是：**在 render 阶段执行的生命周期函数可能被执行多次**。

componentWillMount、componentWillReceiveProps、componentWillUpdate 这三个生命周期钩子，如果我们在其中执行一些具有副作用的操作，例如发送网络请求，就有可能导致一个同样的网络请求被执行多次，这显然不是我们想看到的。

而 React 又没法强迫开发者不去这样做，因为怎么样使用 React 是开发者的自由，所以 React 就新增了一个静态的生命周期 `getDerivedStateFromProps`，来解决这个问题。

用一个静态函数 `getDerivedStateFromProps `来取代被废弃的几个生命周期函数，这样开发者就无法通过 this 获取到组件的实例，也不能发送网络请求以及调用 this.setState。它就是强制开发者在 render 之前只做无副作用的操作，间接强制我们无法进行这些不合理不规范的操作，从而避免对生命周期的滥用。

## 如何通过 React.memo 优化条件渲染？

- **`React.memo`** 通过 **props 比较** 来决定是否跳过组件渲染，从而优化性能。
- 适用于组件的 **props** 在某些情况下不会变化的场景。
- 如果组件接收的 **props** 比较复杂，可以提供一个 **自定义比较函数** 来优化判断。

## redux-thunk 和 redux 是什么关系？

- **Redux** 主要用于同步状态管理。
- **`redux-thunk`** 作为中间件扩展了 Redux，支持异步操作和复杂的逻辑，使 Action Creators 可以返回函数以处理异步请求和状态更新。

## React Router 中，HashRouter 和 BrowserRouter 的区别和原理？

- **`HashRouter`**：
  - **原理**：使用 URL 的哈希部分（`#`）来管理路由。
  - **优点**：不需要服务器配置，适合不支持 HTML5 History API 的浏览器。
  - **缺点**：URL 中包含 `#` 符号，不太友好。
- **`BrowserRouter`**：
  - **原理**：使用 HTML5 History API 管理路由，URL 更干净。
  - **优点**：支持传统的 URL 链接和书签功能，用户体验更好。
  - **缺点**：需要服务器配置来处理路由。

## React中，useRef、ref、forwardsRef 的区别是什么?

- **`useRef`**：在函数组件中创建和管理引用，适用于访问 DOM 元素或保存任意数据。
- **`ref`**：用于类组件和通过 `forwardRef` 的函数组件来访问 DOM 节点或组件实例。
- **`forwardRef`**：允许函数组件接收和转发 `ref`，使得 `ref` 能够传递到子组件的 DOM 元素。

## forwardRef 作用是什么？

`forwardRef` 是 React 的一个高阶组件（HOC），用于将父组件的 `ref` 转发到子组件的 DOM 节点或组件实例中。它使得父组件能够直接访问子组件的 DOM 元素或方法。这在一些情况下非常有用，比如需要在父组件中操作子组件的 DOM 元素或调用子组件的方法时。

### **使用场景**

1. **访问子组件的 DOM 节点：** 当需要对子组件的 DOM 元素进行操作（例如，获取焦点、调整大小等），而这个子组件是由其他组件包裹的情况下。
2. **组合高阶组件和 `ref`：** 在使用高阶组件（HOC）时，`ref` 不会自动转发到被包裹的组件中。使用 `forwardRef` 可以将 `ref` 转发到正确的组件或 DOM 元素。

### **基本用法**

```
import React, { forwardRef, useRef, useImperativeHandle } from 'react';

// 子组件
const Input = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));

  return <input ref={inputRef} {...props} />;
});

// 父组件
function ParentComponent() {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // 调用子组件的 focus 方法
    }
  };

  return (
    <div>
      <Input ref={inputRef} />
      <button onClick={handleClick}>Focus Input</button>
    </div>
  );
}

export default ParentComponent;
```

### **关键点**

- **`forwardRef`**：是一个 React 函数，用于包装组件并转发 `ref`。
- **`useImperativeHandle`**：用来自定义暴露给父组件的 `ref` 实例。可以将特定的函数或属性暴露给父组件。

## React Reconciler 为何要采用 fiber 架构？

React Reconciler 采用 Fiber 架构主要是为了提升性能和用户体验。Fiber 是 React 16 引入的一种新的协调算法，它相对于旧版的 Reconciler 具备以下优势：

### **1. 增量渲染**

- **旧版 Reconciler**：一次性计算并更新整个 UI 树，可能会导致性能瓶颈，尤其是在大型应用中。
- **Fiber 架构**：支持增量渲染，将渲染任务拆分为小的单元，分批执行。这样可以在长时间运行的任务中插入中断点，使得 UI 更响应式。

### **2. 中断和优先级**

- **旧版 Reconciler**：一旦开始更新，渲染过程无法中断，可能会阻塞用户交互。
- **Fiber 架构**：允许中断和恢复工作，可以根据任务的优先级来调整渲染顺序。低优先级的任务可以在高优先级任务完成后再继续执行，提高了用户交互的流畅性。

### **3. 任务调度**

- **旧版 Reconciler**：没有任务调度机制，所有更新都按顺序执行。
- **Fiber 架构**：使用任务调度机制（Scheduler）来管理和调度不同优先级的更新任务，确保重要任务（如用户输入、动画）优先处理。

### **4. 异常处理**

- **旧版 Reconciler**：异常处理能力有限，无法优雅地处理渲染过程中的错误。
- **Fiber 架构**：允许局部错误处理，确保在渲染过程中即使发生异常，也能保证 UI 的部分更新和恢复。

### **5. 渲染中断与恢复**

- **旧版 Reconciler**：无法中断和恢复渲染。
- **Fiber 架构**：支持在渲染过程中中断并恢复，能够平滑处理长时间运行的任务。

### **6. 事务管理**

- **旧版 Reconciler**：处理复杂的事务和操作较为困难。
- **Fiber 架构**：将渲染任务分解为独立的事务，每个事务可以独立地管理和控制，简化了复杂操作的管理。

## fiber 架构的工作原理？

React 中的 Fiber 架构是一种新的协调算法，旨在提高 React 的性能和用户体验。它通过引入新的数据结构和机制，使得 React 能够更高效地处理 UI 更新。以下是 Fiber 架构的工作原理：

### **1. Fiber 数据结构**

- **Fiber 节点**：Fiber 是一个表示组件的内部数据结构，每个 Fiber 节点对应一个 React 组件。它包含了组件的状态、更新信息和子组件的引用等。
- **Fiber 树**：Fiber 节点形成了一棵 Fiber 树，类似于旧版的虚拟 DOM 树。每个 Fiber 节点指向其父节点、子节点和兄弟节点。

### **2. 工作单元和增量渲染**

- **工作单元**：渲染过程被分解为多个工作单元，每个单元代表一个小的渲染任务。这样可以将渲染过程拆分成可中断的任务，以避免长时间的阻塞。
- **增量渲染**：Fiber 允许将渲染任务拆分为增量的操作，逐步完成整个渲染过程。每次渲染会处理 Fiber 树的一部分，允许在任务之间插入中断点，从而提高了渲染的响应性。

### **3. 调度优先级**

- **优先级调度**：Fiber 引入了任务调度机制，允许根据任务的优先级来决定渲染的顺序。高优先级的任务（如用户输入、动画）会优先处理，而低优先级的任务（如数据加载）会在空闲时间处理。
- **任务中断和恢复**：Fiber 支持在渲染过程中中断并恢复任务。当重要任务需要处理时，当前的渲染任务可以被中断，待重要任务完成后再恢复继续。

### **4. 更新和协调**

- **更新队列**：每个 Fiber 节点都有一个更新队列，用于存储与组件相关的更新信息。更新队列可以包含多个更新，React 会根据更新的优先级和顺序进行协调。
- **协调过程**：Fiber 通过对比新旧 Fiber 树来决定哪些部分需要更新。这一过程称为协调（Reconciliation），它会检查节点的变更，生成更新的补丁。

### **5. 渲染阶段和提交阶段**

- **渲染阶段**：在渲染阶段，Fiber 架构会计算出需要更新的部分，但不会立即更新 DOM。这一阶段主要用于计算新的 Fiber 树，并生成更新任务。
- **提交阶段**：在提交阶段，Fiber 会将渲染阶段计算出的更新应用到实际的 DOM 上。这个阶段是同步的，确保所有的更改都被正确地应用。

### **6. 错误处理**

- **错误边界**：Fiber 提供了更好的错误处理机制，可以局部地处理渲染中的错误。即使在渲染过程中发生错误，也能保证 UI 的部分更新和恢复。

## 你对 createPortal 的了解

`ReactDOM.createPortal` 是 React 的一个 API，用于将子节点渲染到 DOM 的不同部分，而不是当前组件的父级节点中。这对于需要在 DOM 的不同层级中插入内容（如模态框、工具提示、下拉菜单等）非常有用，因为它允许我们将子元素渲染到指定的 DOM 节点中，保持其逻辑上的位置和结构。

### **`createPortal` 的用法**

```
ReactDOM.createPortal(child, container)
```

- **`child`**：要渲染的子元素或 React 元素。
- **`container`**：要将 `child` 渲染到的 DOM 节点。

### **特点和使用场景**

1. **DOM 层级结构**：
   - 通过 `createPortal`，你可以将子元素插入到 DOM 的任意位置，这对于需要在页面不同层级中展示内容的情况很有帮助。例如，模态框通常需要渲染在页面的顶层。
2. **维持 React 组件的生命周期和状态**：
   - 使用 `createPortal` 渲染的元素仍然保持在 React 组件树中，因此它们会遵循 React 的生命周期方法，状态和上下文不会受到影响。
3. **避免 CSS 影响**：
   - 在某些情况下，使用 `createPortal` 可以避免子组件的 CSS 被父组件的样式干扰，因为渲染到的 DOM 节点通常是在 `body` 或其他顶层容器中。

### **示例**

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

class Modal extends React.Component {
  render() {
    return ReactDOM.createPortal(
      <div className="modal">
        <h1>I'm a modal!</h1>
        <button onClick={this.props.onClose}>Close</button>
      </div>,
      document.body  // Modal 将被渲染到 body 元素中
    );
  }
}

export default Modal;
```

### **原理**

- `createPortal` 创建的组件会挂载到指定的 DOM 节点 `container` 中，但它仍然在 React 的组件树中。这意味着 React 可以处理它的生命周期和更新，而不是直接操作 DOM。

## React 中的 createContext 和 useContext 分别有什么用？

在 React 中，`createContext` 和 `useContext` 是处理上下文的两个相关 API，但它们的功能和用途有所不同：

### **1. `createContext`**

- **作用**：用于创建一个新的上下文对象。

- **用法**：调用 `createContext` 会返回一个上下文对象，这个对象包含 `Provider` 和 `Consumer` 组件。`Provider` 用于提供上下文的值，而 `Consumer` 用于消费上下文的值。

- 示例

  ：

  ```
  // 创建上下文对象
  const MyContext = createContext(defaultValue);
  
  // 提供上下文的值
  <MyContext.Provider value={someValue}>
    {/* 子组件 */}
  </MyContext.Provider>
  
  // 消费上下文的值
  <MyContext.Consumer>
    {value => /* 使用上下文的值 */}
  </MyContext.Consumer>
  ```

### **2. `useContext`**

- **作用**：用于在函数组件中访问上下文的值。

- **用法**：`useContext` 是一个 Hook，用于在函数组件中消费上下文的值，而不需要使用 `Consumer` 组件。

- 示例

  ：

  ```
  import { useContext } from 'react';
  
  // 在函数组件中访问上下文
  const value = useContext(MyContext);
  ```

## 使用 react-router 跳转时，如何将参数传递给下一个页面？

**方式一 URL 参数（路径参数）**

适用于参数是页面的一部分，例如 `/user/:id`。

**传递参数**

```tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <Link to="/user/123">Go to User 123</Link>
    </div>
  );
}

function UserPage() {
  const { id } = useParams(); // 获取 URL 参数
  return <h2>User ID: {id}</h2>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<UserPage />} />
      </Routes>
    </Router>
  );
}
```

**解析参数**

在目标页面使用 `useParams()`：

```tsx
import { useParams } from 'react-router-dom';

function UserPage() {
  const { id } = useParams(); // 获取 URL 参数
  return <h2>User ID: {id}</h2>;
}
```

------

**方式二 查询参数（Query Parameters）**

适用于可选参数，例如 `/search?query=react`。

**传递参数**

```tsx
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <Link to="/search?query=react">Search React</Link>
    </div>
  );
}
```

**解析参数**

在目标页面使用 `useSearchParams()`：

```tsx
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  return <h2>Search Query: {query}</h2>;
}
```

------
**方式三 `state` 参数（`useNavigate` 传递）**

适用于不希望参数出现在 URL 上的情况，使用 `useNavigate()`。

**传递参数**

```tsx
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate('/detail', { state: { name: 'Alice', age: 25 } });
  };

  return (
    <div>
      <h2>Home</h2>
      <button onClick={goToDetail}>Go to Detail</button>
    </div>
  );
}
```

**解析参数**

在目标页面使用 `useLocation().state`：

```tsx
import { useLocation } from 'react-router-dom';

function DetailPage() {
  const location = useLocation();
  const { name, age } = location.state || {}; // 确保 state 存在

  return (
    <div>
      <h2>Detail Page</h2>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
}
```

------

**方式四 全局状态管理（Context / Redux / Zustand）**

适用于跨页面共享状态。

```tsx
import { createContext, useContext, useState } from 'react';

// 创建 Context
const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState({ name: 'Alice', age: 25 });

  return (
    <UserContext.Provider value={user}>
      <Home />
      <Detail />
    </UserContext.Provider>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function Detail() {
  const user = useContext(UserContext);

  return (
    <div>
      <h2>Detail Page</h2>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
    </div>
  );
}
```

------

**总结**

| 方式                                       | 适用场景                    | 解析方式              |
| ------------------------------------------ | --------------------------- | --------------------- |
| **URL 参数** (`/user/:id`)                 | 关键参数，必须出现在 URL 中 | `useParams()`         |
| **查询参数** (`?query=value`)              | 可选参数                    | `useSearchParams()`   |
| **`state` 参数** (`useNavigate`)           | 需要隐藏参数                | `useLocation().state` |
| **全局状态** (`Context / Redux / Zustand`) | 需要在多个页面共享数据      | `useContext()`        |

**推荐方案：**

- **数据较小、关键参数** → **URL 参数**
- **搜索、筛选等可选参数** → **查询参数**
- **不想暴露在 URL 中的数据** → **`state` 参数**
- **长期存储或跨组件共享** → **全局状态**

## react 中，数组用useState做状态管理的时候，使用push，pop，splice等直接更改数组对象，会引起页面渲染吗？

在 React 中，直接使用 `push`、`pop`、`splice` 等方法修改数组不会触发页面重新渲染。React 的状态更新机制依赖于状态的不可变性（immutability），即通过创建新的状态对象来更新状态。直接修改原始状态对象（如数组）不会创建新的对象引用，因此 React 不会检测到状态的变化，也不会触发重新渲染。

## react 中，在什么场景下需要使用 useContext？

在 React 中，`useContext` 是一个用于在组件树中共享状态或数据的钩子。它允许我们在没有通过属性逐层传递的情况下，将数据从祖先组件传递到后代组件。`useContext` 主要用于避免 prop drilling 问题，即当需要将数据从顶层组件传递到深层嵌套的组件时，可能会涉及多层组件传递属性，代码会变得冗长和难以维护。

### 使用 `useContext` 的场景

1. **全局状态管理**：

   - 当你需要在多个组件之间共享全局状态时，`useContext` 是一个简单而有效的工具。例如，用户认证状态、主题设置或语言选择等全局数据可以通过 `useContext` 在整个应用中访问。

   ```jsx
   const UserContext = React.createContext();
   
   function App() {
       const [user, setUser] = useState(null);
   
       return (
           <UserContext.Provider value={user}>
               <UserProfile />
           </UserContext.Provider>
       );
   }
   
   function UserProfile() {
       const user = useContext(UserContext);
       return <div>{user ? `Welcome, ${user.name}` : 'Not logged in'}</div>;
   }
   ```

2. **避免 prop drilling**：

   - 当数据需要从顶层组件传递到深层嵌套的子组件时，使用 `useContext` 可以避免将数据逐层通过 `props` 传递。这样可以减少中间组件不必要的属性传递，保持代码的简洁和清晰。

   ```jsx
   const ThemeContext = React.createContext();
   
   function App() {
       const theme = 'dark';
   
       return (
           <ThemeContext.Provider value={theme}>
               <Toolbar />
           </ThemeContext.Provider>
       );
   }
   
   function Toolbar() {
       return (
           <div>
               <ThemedButton />
           </div>
       );
   }
   
   function ThemedButton() {
       const theme = useContext(ThemeContext);
       return <button className={theme}>Themed Button</button>;
   }
   ```

3. **跨组件通信**：

   - 在组件树的不同部分之间进行通信时，`useContext` 提供了一种简单的方式来共享信息，而不需要通过复杂的回调或全局事件总线。

4. **复杂应用中的配置和设置**：

   - 在需要全局配置（如路由、表单验证、国际化等）的复杂应用中，`useContext` 使得这些配置可以被所有需要的组件访问，而不需要反复传递。

5. **在与 `useReducer` 结合使用时**：

   - `useReducer` 可以用来管理复杂的本地状态。将 `useReducer` 与 `useContext` 结合使用时，可以将状态和分发函数提供给需要的组件，而无需逐层传递。

   ```jsx
   const CountContext = React.createContext();
   
   function reducer(state, action) {
       switch (action.type) {
           case 'increment':
               return { count: state.count + 1 };
           case 'decrement':
               return { count: state.count - 1 };
           default:
               throw new Error();
       }
   }
   
   function Counter() {
       const [state, dispatch] = useReducer(reducer, { count: 0 });
   
       return (
           <CountContext.Provider value={{ state, dispatch }}>
               <ChildComponent />
           </CountContext.Provider>
       );
   }
   
   function ChildComponent() {
       const { state, dispatch } = useContext(CountContext);
       return (
           <div>
               Count: {state.count}
               <button onClick={() => dispatch({ type: 'increment' })}>+</button>
               <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
           </div>
       );
   }
   ```

### 适用性与注意事项

- **适用性**：
  - `useContext` 适用于需要跨多个组件共享状态的场景，避免不必要的属性传递，特别是在状态涉及到多个组件层级时。
- **注意事项**：
  - 不要滥用 `useContext`。如果数据仅在少量组件之间共享，或局部状态足够处理问题，可能并不需要使用 `useContext`。
  - `useContext` 提供的数据是引用类型的，如果上下文中的数据变化会导致使用该上下文的所有组件重新渲染。因此，确保合理组织和管理上下文的数据以避免性能问题。

## React 中的 hooks 和 memorizedState 是什么关系?

在 React 中，**Hooks** 和 **MemorizedState** 都与组件的状态管理和性能优化有关，但它们的作用和实现方式不同。

### **Hooks**

Hooks 是 React 16.8 引入的一组 API，使函数组件能够拥有状态和副作用管理的能力，之前这些特性只有在类组件中才可以使用。常用的 Hooks 包括：

- **`useState`**：用于在函数组件中添加状态。
- **`useEffect`**：用于处理副作用，如数据获取和订阅。
- **`useContext`**：用于在组件树中共享状态。
- **`useReducer`**：用于处理更复杂的状态逻辑。
- **`useMemo`** 和 **`useCallback`**：用于性能优化，避免不必要的重新渲染。

### **MemorizedState**

**MemorizedState** 是 React 内部的一种实现机制，用于优化组件的性能。它是 React 在内部管理组件状态时使用的一种状态存储方式，尤其是与 Hooks 的实现密切相关。

- **在 React 中，`useState` 和 `useReducer` 的实现依赖于 MemorizedState**：当你调用 `useState` 或 `useReducer` 时，React 会为每个组件实例创建一个 `MemorizedState` 对象来存储状态。这些状态在组件重新渲染时会被保留，确保组件的状态在生命周期中保持一致。
- **`MemorizedState` 的作用是优化性能**：它帮助 React 追踪状态的变化，并在组件重新渲染时有效地管理和更新状态。

### **Hooks 与 MemorizedState 的关系**

1. **状态管理**：Hooks（如 `useState` 和 `useReducer`）允许你在函数组件中管理状态。它们背后使用了 MemorizedState 来存储和管理这些状态。
2. **性能优化**：
   - **`useMemo` 和 `useCallback`**：这些 Hooks 依赖于 MemorizedState 来缓存计算结果和函数，从而避免不必要的重新计算和重新渲染。
   - **MemorizedState 的缓存机制**：React 使用 MemorizedState 来缓存组件的状态和计算结果，这与 `useMemo` 和 `useCallback` 的功能类似，但在更底层的实现中起作用。
3. **内部实现**：
   - **`useState` 和 `useReducer`**：当调用这些 Hooks 时，React 内部会创建一个 MemorizedState 对象来存储状态值。
   - **性能优化 Hooks**：`useMemo` 和 `useCallback` 使用 MemorizedState 来存储缓存的计算结果或函数引用，从而避免每次渲染时重新计算。

## React 中，怎么给 children 添加额外的属性？

- **React.cloneElement**：用于在渲染过程中动态地为 `children` 添加属性。
- **Context API**：用于全局传递数据或配置，适合多个嵌套组件。
- **通过 Props 传递**：显式地将额外的属性作为 prop 传递给子组件。

## React 中，构建组件的方式有哪些？

在 React 中，组件可以通过函数组件、类组件、高阶组件、组合组件、Render Props 和自定义 Hook 等多种方式构建。选择合适的组件构建方式，可以提高代码的可读性、复用性和维护性。函数组件与 Hooks 是现代 React 推荐的主要开发方式。

## React 是怎么渲染出页面的？

React 渲染页面的过程主要包括以下几个步骤：

### **1. 创建虚拟 DOM**

- **组件定义**：当你定义一个组件并调用 `render` 方法时，React 会根据组件的 JSX 结构创建一个虚拟 DOM。这是一个轻量级的 JavaScript 对象，描述了 UI 的结构。

### **2. 渲染到真实 DOM**

- **初始渲染**：在组件首次渲染时，React 会将虚拟 DOM 转换为实际的 DOM 元素，并将其插入到页面中。通常是通过 `ReactDOM.render()` 方法完成的。

```
import ReactDOM from 'react-dom';

ReactDOM.render(<MyComponent />, document.getElementById('root'));
```

### **3. 组件更新**

- **状态或属性变化**：当组件的状态（state）或属性（props）发生变化时，React 会重新调用组件的 `render` 方法，生成新的虚拟 DOM。

### **4. Diff 算法**

- **比较新旧虚拟 DOM**：React 使用高效的 Diff 算法对比新旧虚拟 DOM，以找到需要更新的部分。这个过程称为“调和”（reconciliation）。

### **5. 更新真实 DOM**

- **最小化 DOM 操作**：根据 Diff 算法的结果，React 会计算出最小的 DOM 更新操作，只对那些发生变化的部分进行实际更新，而不是重新渲染整个页面。

### **6. 生命周期方法**

- **调用生命周期方法**：在渲染过程中，React 会调用组件的生命周期方法，例如 `componentDidMount`、`componentDidUpdate` 等，以允许开发者在不同的渲染阶段执行特定的逻辑。

### **7. 批处理更新**

- **批量更新**：在事件处理时，React 会将多个状态更新合并为一次渲染，减少不必要的 DOM 操作，提高性能。

### **8. 异步渲染**

- **并发渲染**：从 React 16 开始，React 支持异步渲染，可以在不阻塞主线程的情况下进行 UI 更新，以提升用户体验。

## React 中，如何实现类似于 Vue-router 提供的路由守卫？

在 React 中实现类似 Vue-router 的路由守卫，常见的方式包括使用 `useEffect` 钩子、封装高阶组件、利用 React Router 的 `<Outlet />` 组件进行中间件式守卫、在路由配置中实现守卫逻辑，或者通过全局状态管理工具（如 Redux 或 Context）进行守卫。

## 为什么 react 组件中， 都需要声明 `import React from 'react';`

- **React 16 及以下**：在使用 JSX 时必须导入 `React`，因为 JSX 语法最终会被转换为 `React.createElement()` 调用。
- **React 17 及以上**：如果启用了新的 JSX 转换方式（默认启用），则不再需要显式导入 `React`，Babel 会自动处理。

尽管在 React 17 之后你可以省略 `import React from 'react';`，但很多项目仍然保持兼容性，尤其是较老的项目，可能仍然需要保留这个导入语句。

## 在 React 项目中， 是否可以不用 react-router， 使用浏览器原生 history 路由来组织页面路由？

在 React 项目中，**可以不用 `react-router`**，直接使用浏览器原生的 **`history`** API 来组织页面路由。实际上，`react-router` 本质上也是基于浏览器的 `history` API 实现的路由功能，它提供了一个封装好的、更易于使用的路由管理工具。

### 使用浏览器原生 `history` API 进行路由管理

React 提供了 `history` API 作为浏览器的原生路由系统，包含了 `window.history` 相关方法（如 `pushState`, `replaceState`, `popState` 等）。你可以通过这些 API 手动实现路由的控制，并结合 React 状态管理来更新页面视图。

以下是使用原生 `history` API 管理路由的基本步骤：

### 1. **创建路由管理逻辑**

使用原生 `history` API，你需要自己处理 URL 的变化、浏览器历史栈的管理以及与 React 组件的匹配。

#### 示例代码：

```jsx
import React, { useState, useEffect } from 'react';

// 简单的路由管理器
function useHistory() {
  const [location, setLocation] = useState(window.location.pathname);

  useEffect(() => {
    // 监听浏览器的历史变化
    const handlePopState = () => {
      setLocation(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const push = (path) => {
    window.history.pushState(null, '', path);
    setLocation(path);  // 更新当前路径
  };

  const replace = (path) => {
    window.history.replaceState(null, '', path);
    setLocation(path);  // 更新当前路径
  };

  return { location, push, replace };
}

const Route = ({ path, component }) => {
  return window.location.pathname === path ? component : null;
};

// 主应用组件
function App() {
  const { location, push } = useHistory();

  return (
    <div>
      <nav>
        <button onClick={() => push('/')}>Home</button>
        <button onClick={() => push('/about')}>About</button>
      </nav>

      <div>
        <Route path="/" component={<div>Home Page</div>} />
        <Route path="/about" component={<div>About Page</div>} />
      </div>
    </div>
  );
}

export default App;
```

### 2. **解释代码**

- `useHistory` 是自定义 Hook，用来管理路由的变化和浏览器的历史记录。
- `window.history.pushState` 用来修改浏览器的 URL，而不刷新页面。它会向历史记录栈中添加一个新的记录。
- `window.history.replaceState` 用来替换当前的 URL，而不新增历史记录。
- 通过监听 `popstate` 事件来处理浏览器后退、前进操作，确保页面和历史状态同步。
- `Route` 组件根据当前的 `window.location.pathname` 来判断是否匹配当前路由并渲染对应的内容。

### 3. **优缺点分析**

#### 优点：

- **控制性更强**：使用原生的 `history` API，你完全控制路由的行为，可以根据需求自由设计路由逻辑。
- **依赖较少**：不需要额外安装第三方路由库（如 `react-router`），减少了项目的依赖。
- **更细粒度的控制**：可以在路由变更时执行自定义逻辑，比如路由过渡动画、权限控制等。

#### 缺点：

- **代码复杂度较高**：需要自己处理路由匹配、页面切换、浏览器历史栈管理等逻辑，容易出现重复代码和潜在的 bug。
- **缺少功能**：像 `react-router` 提供的路由嵌套、动态路由、参数提取、重定向等功能需要你自己实现。
- **性能优化问题**：手动管理路由时，需要自己优化性能，尤其是与 React 组件的渲染结合时，可能需要更多的工作来确保视图的高效更新。

### 4. **与 `react-router` 的比较**

`react-router` 提供了大量现成的功能，如路由嵌套、重定向、动态路由匹配、路由守卫等，这些都是你使用原生 `history` API 时需要自己实现的。如果你的应用比较简单，不需要复杂的路由功能，使用原生 `history` API 是完全可行的。

但对于大型应用，`react-router` 提供了更加简洁、可扩展的路由管理方式，能大大减少开发成本，并且有广泛的社区支持。

### 5. **何时选择原生 `history` API**

你可以选择使用原生 `history` API 的情况包括：

- 应用的路由需求简单，不需要复杂的路由嵌套、动态路由、权限控制等功能。
- 希望减少第三方库的依赖，或者希望自己对路由的行为进行更细粒度的控制。
- 学习或实践如何在前端实现路由。

## react-router 和原生路由有什么区别？

| **特点**            | **`react-router`**                | **原生路由 (`history` API)**              |
| ------------------- | --------------------------------- | ----------------------------------------- |
| **功能复杂度**      | 高，提供完整的路由功能            | 低，只有基础的路由控制                    |
| **使用便捷性**      | 高，开箱即用，支持嵌套路由等      | 低，需要手动实现很多功能                  |
| **代码量**          | 少，简洁易用                      | 多，手动管理路由和视图渲染                |
| **扩展性与灵活性**  | 强，适用于复杂的项目              | 弱，适用于简单场景                        |
| **与 React 的集成** | 完全集成，使用 React 组件和 hooks | 手动集成，需要手动管理组件更新和 URL 状态 |
| **适用场景**        | 中大型应用，复杂路由需求          | 小型应用，简单路由需求                    |

### 结论：

- 对于中大型应用，或者需要复杂路由管理的场景，**`react-router`** 提供了更加完整和高效的解决方案。
- 对于小型应用，或者当你想完全控制路由逻辑时，使用 **原生 `history` API** 会更加灵活、简洁。

## React 为什么要自己实现调度器， 而不是直接使用 requestIdleCallback ？

- **优先级控制**：React 需要精确控制任务优先级，`requestIdleCallback` 无法满足这一需求。
- **中断与抢占**：React 需要中断低优先级任务，确保高优先级任务优先执行，而 `requestIdleCallback` 无法做到这一点。
- **跨浏览器兼容性**：React 自定义调度器支持更广泛的浏览器，避免依赖不被所有浏览器支持的 `requestIdleCallback`。
- **性能优化**：React 调度器能更好地进行能效和性能优化，避免不必要的任务执行。
- **任务灵活性**：React 需要处理复杂的任务调度，而 `requestIdleCallback` 只是一个简单的空闲时间回调，无法满足 React 的复杂需求。

## React 19 有哪些新特性？

React 19 于 2024 年底正式发布，带来了多项重要更新：

**1. Actions（表单动作）：**

React 19 支持将函数直接传递给 `<form action>`、`<button formAction>` 等属性，简化异步表单处理。配合 `useTransition`，可以自动处理 pending 状态和错误。

```jsx
function UpdateName() {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) setError(error);
      else redirect("/path");
    });
  };

  return (
    <form action={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit" disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

**2. 新的 Hook：**

- **`use`**：用于读取 Promise 或 Context。`use` 可以在条件语句中调用（其他 Hook 不能）。

```jsx
import { use } from 'react';

function Message({ messagePromise }) {
  const message = use(messagePromise); // 等待 Promise
  return <p>{message}</p>;
}
```

- **`useFormStatus`**：获取表单提交状态。
- **`useActionState`**：管理表单状态（原 `useFormState`）。
- **`useOptimistic`**：实现乐观更新。

```jsx
function ThumbsUpButton() {
  const [optimisticCount, addOptimistic] = useOptimistic(
    count,
    (state, newCount) => state + newCount
  );
  return (
    <button onClick={async () => {
      addOptimistic(1);
      await sendThumbsUp();
    }}>
      {optimisticCount}
    </button>
  );
}
```

**3. 新的 API：**

- **`ref` 作为 prop**：函数组件不再需要 `forwardRef` 即可直接接收 `ref` 作为 props。

```jsx
// React 19：ref 可直接作为 prop
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

- **`<Context>` 作为 Provider**：不再需要 `<Context.Provider>`，直接使用 `<Context>`。

```jsx
<ThemeContext value="dark">
  <App />
</ThemeContext>
```

- **Document Metadata**：原生支持渲染 `<title>`、`<meta>`、`<link>` 等到 `<head>` 中，自动去重。
- **Asset Loading**：`preload`、`preinit`、`prefetchDNS`、`preconnect` 等 API 用于优化资源加载。

**4. Server Components 稳定：** React Server Components（RSC）正式稳定，允许在服务端渲染组件，减少客户端 JavaScript 包体积。

**5. ref 清理函数：** `ref` 回调函数现在可以返回清理函数（类似 `useEffect`）。

```jsx
<div ref={(element) => {
  console.log('mounted', element);
  return () => console.log('unmounted');
}} />
```

**6. 改进的错误信息：** React 19 移除了错误日志中的堆栈跟踪，改为显示组件堆栈，更易于定位问题。

**总结：** React 19 主要简化了表单处理（Actions）、异步数据处理（use）、乐观更新（useOptimistic），并移除了 `forwardRef`、`Context.Provider` 等模板代码，提升了开发体验。

## React 中，如何避免使用 context 时， 引起整个挂载节点树的重新渲染

1. **分离 Context**：减少依赖的组件范围。
2. **使用 React.memo**：避免无关组件重渲染。
3. **使用选择器**：只订阅需要的 `context` 部分值。借助外部库（如 react-context-selector）实现细粒度选择器，只订阅 context 的部分值，而不是整个 context 对象。
4. **嵌套 Provider**：限制影响范围。对于大型项目，可以将 context 的范围限制到尽可能小的组件子树。
5. **直接传递 Props**：绕过 `context` 带来的渲染问题。

## React 的循环渲染中，为什么不推荐使用 index 作为元素的 key？

- 使用 `index` 作为 `key` 会引发 **性能问题** 和 **UI 或状态混乱**，不适用于动态列表。
- 推荐使用能唯一标识列表项的数据（如 `id`），在无法提供唯一标识的情况下，需谨慎使用 `index` 作为 `key`。

## 子组件是一个 Portal，发生点击事件能冒泡到父组件吗？

React 的 Portal 通过 React 的 context 和事件冒泡的机制工作。

在理解这个问题之前，首先要了解一些基本知识：

1. **React Context**：React 使用 context 来存储组件树的一些信息，比如事件处理程序。当组件使用 Portal 时，Portal 在 React 内部仍然保持在父组件树中，即使在 DOM 上渲染到其他地方。也就是说，Portal 的 context 依然从其父组件继承而来。
2. **DOM 事件冒泡**：DOM 中的事件（例如点击事件）通常会从触发事件的元素开始，然后逐步向上冒泡到父元素，直到 document 元素。在这个过程中，事件会按照 DOM 树的层级一层层地向上传递。
3. **React 的事件代理**：React 使用事件代理模式将所有事件都代理到顶层（`document` 或者 `root` DOM 节点）进行处理。这意味着当在子组件中触发一个事件时，无论子组件是否使用了 Portal，React 都会将事件传递到其父组件，然后逐级往上冒泡，直到到达代理事件的顶层。

在 React 中，当一个子组件使用 Portal 将其内容渲染到其他 DOM 节点时，尽管在 DOM 结构上子组件不再是父组件的直接子节点，但在 React 的组件树中，子组件仍然是父组件的子节点。这意味着 React 在监听和处理事件时，会沿着组件树的路径（而不是 DOM 树的路径）冒泡事件。因此，子组件中触发的事件仍然会冒泡到父组件。

总结：Portal 在 DOM 结构上将子组件渲染到其他位置，但在 React 的组件树中，它仍然是父组件的子组件。这使得事件可以从子组件沿着组件树冒泡到父组件。

## 为什么 react 需要 fiber 架构，而 Vue 却不需要？

React引入Fiber架构的主要原因是为了实现更好的异步渲染和更高效的任务调度。Fiber架构使得React能够更细粒度地控制和中断渲染过程，以便更好地响应用户交互、实现懒加载等功能。Vue在设计上采用了不同的策略，因此并不需要类似于Fiber的架构。

以下是一些原因解释为什么React选择了Fiber架构，而Vue没有类似的架构：

1. **异步渲染和任务优先级：** React的Fiber架构使得实现异步渲染和任务优先级变得更加容易。这对于复杂的用户界面和大规模应用中的性能优化非常重要。React可以通过中断和恢复渲染过程，根据任务的优先级调度渲染工作，从而更好地响应用户输入和满足实时性要求。
2. **更好的中断和恢复机制：** Fiber架构提供了一种更灵活的中断和恢复机制，允许React在渲染过程中暂停、中断，然后根据优先级恢复。这使得React能够更好地处理复杂的渲染逻辑，并在需要时放弃低优先级的工作。
3. **增量更新：** Fiber允许React实现增量更新，即只更新变化的部分而不必重新渲染整个组件树。这对于提高渲染性能和减少不必要的工作非常有帮助。

Vue在设计上采用了一种不同的响应式系统和渲染机制，不需要像React那样进行复杂的中断和任务调度。Vue的设计目标可能更注重简洁性和开发体验，而React的目标之一是提供更灵活和强大的性能优化工具。每个框架在设计上都有权衡和取舍，选择适合其目标和使用场景的策略。

## react 和 react-dom 是什么关系？

`react` 和 `react-dom` 是 React 库的两个主要部分，它们分别负责处理不同的事务。它们之间的关系可以理解为：

1. **`react`：** 这是 React 库的核心部分，包含了 React 的核心功能，如组件、状态、生命周期等。它提供了构建用户界面所需的基本构建块。当你编写 React 组件时，你实际上是在使用 `react` 包。
2. **`react-dom`：** 这是 React 专门为 DOM 环境提供的包，它包含了与浏览器 DOM 相关的功能。`react-dom` 提供了用于在浏览器中渲染 React 组件的方法，包括 `ReactDOM.render`。在 Web 开发中，`react-dom` 被用于将 React 应用渲染到浏览器的 DOM 中。

基本上，`react` 和 `react-dom` 是为了分离 React 的核心功能，以便更好地处理不同的环境和平台。这种分离使得 React 更加灵活，可以适应不同的渲染目标，而不仅仅局限于浏览器环境。

## useMemo 和 useCallback 有什么区别？

- `useMemo` 主要用于缓存计算结果，适用于任何需要缓存值的场景。
- `useCallback` 主要用于缓存回调函数，适用于需要传递给子组件的事件处理函数，以避免不必要的重新渲染。

## 如果在 useEffect 的第一个参数中 return 了一个函数，那么第二个参数分别传空数组和传依赖数组，该函数分别是在什么时候执行？

在 React 中，当 useEffect 第一个参数中返回一个函数时，这个函数会在组件卸载时执行。当传递空数组 [] 时，useEffect 只会在组件挂载和卸载时调用一次，因此返回的函数也只会在组件卸载时执行一次。

```
useEffect(() => {
  // 在挂载时执行

  return () => {
    // 在卸载时执行
  }
}, []);
```

当传递依赖数组时，useEffect 会在组件挂载和依赖项更新时调用，因此返回的函数也会随着组件更新而执行。每次组件重新渲染时都会检查依赖项列表是否有变化，如果有变化则重新执行 useEffect，并在执行新的 useEffect 前先执行上一个 useEffect 返回的函数（如果存在）。

```
useEffect(() => {
  // 在挂载、依赖列表变化及卸载时执行

  return () => {
    // 在下一次 useEffect 执行前执行
  }
}, [dep1, dep2]);
```

需要注意，这个函数的作用通常是清除 effect 留下的副作用，例如取消定时器、取消订阅等等。在函数中应该清理掉之前设置的任何 effect，在组件卸载时避免不必要的内存泄漏和资源浪费。

## 怎么判断一个对象是否是 React 元素？

可以使用 `React.isValidElement()` 方法进行判断。

## React 和 Vue 在技术层面有哪些区别？

React 和 Vue 是当前流行的前端框架，它们在技术层面有以下区别：

- **组件化方式**：React 采用组件化，组件封装了状态和行为，共享状态树。Vue 组件也有自己的状态，数据和行为绑定更简单。
- **数据驱动**：React 使用单向数据流，从父组件到子组件，数据交互更复杂。Vue 采用双向数据绑定，数据交互更简洁。
- **模板语法**：React 使用 JSX，结合 HTML 和 JavaScript，编写组件更直观。Vue 使用模板语法，支持表达式和指令，可读性和维护性更高。
- **生命周期**：React 生命周期分为初始化、更新、卸载三个阶段。Vue 生命周期包括创建、挂载、更新、销毁等八个阶段。
- **状态管理**：React 通常使用 Redux 或 MobX 管理状态。Vue 则使用 Vuex 管理共享状态。
- **性能优化**：React 使用虚拟 DOM 优化渲染性能。Vue 使用模板编译和响应式系统，并提供懒加载和缓存等技术。

