---
sidebar_position: 10
---

# CSS类命名模式

以下列举了几个比较常用的

### BEM (Block Element Modifier)

BEM通过将CSS类名分为块、元素、修饰符三个部分，来组织和管理CSS的命名，避免重复和冲突的问题，同时增加了可读性和可维护性。

例如，一个页面上有一个card组件，组成部分包括card-header、card-body和card-footer。使用BEM命名可以为每个组件分别加上对应的CSS类名，例如:

```
<div class="card">
  <div class="card__header"></div>
  <div class="card__body"></div>
  <div class="card__footer"></div>
</div>
```

### OOCSS (Object Oriented CSS)

OOCSS的主要思想是将样式代码抽象出来，形成可重用和独立的模块，以达到更好的可维护性和代码重用性的目标。

例如，一个具有圆角边框的按钮组件可以分解为一个样式对象，然后在同一页面中重复使用：

```
.button {
  border-radius: 4px;
  border: 2px solid #eee;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: bold;
}

.button--primary {
  background-color: #2d8fe7;
  color: #fff;
}

.button--secondary {
  background-color: #fff;
  color: #2d8fe7;
}

.button--warning {
  background-color: #F06769;
  color: #fff;
}
```

### Atomic CSS

Atomic CSS的命名约定是基于元素属性，通过单个类名组合样式，从而实现具有用途性的样式，并且能够快速和灵活地编写样式。

例如，我们可以使用一个带有内边距、边框、字体大小和颜色的样式对象来创建一个带有16px内边距的红色按钮：

```
<button class="pa-2 border b--red f3">Click Me</button>
```

### CSS-in-JS

CSS-in-JS是将CSS代码和JavaScript结合，利用JavaScript的语法编写样式。

例如，使用Styled-components构建一个button组件：

```
import styled from 'styled-components';

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  background: #2d8fe7;
  color: #fff;

  &:hover {
    background: #fff;
    color: #2d8fe7;
    border: 2px solid #2d8fe7;
  }
`;

const Example = () => {
  return <Button>Click Me</Button>;
};
```

参考：

[CSS Methodologies](https://2020.stateofcss.com/en-US/technologies/methodologies/)
