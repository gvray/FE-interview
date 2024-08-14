---
sidebar_position: 5
---

# Flex布局

Flex 是Flexible Box 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。

布局的传统解决方案，基于盒状模型，依赖 display 属性 + position 属性 + float
属性。它对于那些特殊布局非常不方便，比如，垂直居中就不容易实现。

容器的属性：

```css
/* flex-direction：决定主轴的方向（即子 item 的排列方法） */
.box {
    flex-direction: row | row-reverse | column | column-reverse;
}
/* flex-wrap：决定换行规则 */
.box{
    flex-wrap: nowrap | wrap | wrap-reverse;
}
/* flex-flow：flex-flow 属性是 flex-direction 和 flex-wrap 属性的复合属性。 */
.box {
    flex-flow: <flex-direction> || <flex-wrap>;
}
/* justify-content：对其方式，水平主轴对齐方式
align-items：对齐方式，竖直轴线方向 */
```

项目的属性（元素的属性）：

- order 属性：定义项目的排列顺序，顺序越小，排列越靠前，默认为 0

- flex-grow 属性：定义项目的放大比例，即使存在空间，也不会放大
- flex-shrink 属性：定义了项目的缩小比例，当空间不足的情况下会等比例的缩小，如果定义个 item 的 flow-shrink 为 0，则为不缩小
- flex-basis 属性：定义了在分配多余的空间，项目占据的空间。
- flex：是 flex-grow 和 flex-shrink、flex-basis 的简写，默认值为 0 1 auto。
- align-self：允许单个项目与其他项目不一样的对齐方式，可以覆盖 align-items，默认属性为 auto，表示继承父元素的 align-items比如说，用 flex 实现圣杯布局

[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

[Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

## FAQ？

### ”flex: auto;“是什么意思？

`flex` 是**复合属性**，是`flex-grow`,`flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`，后两个属性可选。

- flex-grow 属性定义项目的放大比例，默认为0，即如果存在剩余空间也不放大
- flex-shrink 属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小
- flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间（相当于我们设置的width）

而 `flex: auto;` 是 `flex:1 1 auto;` 的简写，即元素尺寸可以弹性增大，也可以弹性变小，具有十足的弹性，但在尺寸不足时会优先最大化内容尺寸。

再介绍下使用场景：

当希望元素充分利用剩余空间，但是各自的尺寸按照各自内容进行分配的时候，适合使用 `flex:auto`。

`flex:auto` 多用于内容固定，或者内容可控的布局场景，例如导航数量不固定，每个导航文字数量也不固定的导航效果就适合使用 `flex:auto` 效果来实现，
