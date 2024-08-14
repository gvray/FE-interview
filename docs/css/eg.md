# Css 常用技巧

## 用css实现一个硬币旋转的效果哪些方法

[旋转coin](https://codepen.io/GavinBirkhoff/pen/JjayBeg)

## 多行元素的文本省略号

```css
/* 单行文本溢出显示省略号 */
.div1 p{
    white-space: nowrap; /* 文本超过容器最大宽度不换行(若文本自动显示在一行则不需要这个属性) */
    overflow: hidden;  /* 本文超出容器最大宽度的部分不显示 */
    text-overflow: ellipsis;  /* 文本超出容器最大宽度时显示三个点 */
}
/* 多行文本溢出显示省略符 */
.div2 p{
    word-break: break-word; /* 文本默认显示在一行时，需要添加该属性，让超出的文本换行 */
    overflow:hidden;
    display:-webkit-box; /* 让容器变成一个弹性伸缩盒子 */
    -webkit-line-clamp:2;  /* 最大显示的文本行数 */
    -webkit-box-orient:vertical;  /* 设置或检索伸缩盒对象的子元素纵向排列  */
}
```

## CSS画正方体，三角形

三角形

```
#triangle-up{
    width:0;
    height:0;
    border-left:50px solid transparent;
    border-right:50px solid transparent;
    border-bottom:100px solid red;
}

#triangle{
    width:0;
    height:0;
    border-top:50px solid blue;
    border-right:50px solid red;
    border-bottom:50px solid green;
    border-left:50px solid yellow;
}
```

[爆炸正方体](https://codepen.io/GavinBirkhoff/pen/eYLEjEK)

[正方体](https://codepen.io/GavinBirkhoff/pen/KKxvBZZ)

## 清除浮动的方式有哪几种？

清除浮动是为了解决浮动元素引起的父元素高度塌陷问题。以下是几种清除浮动的常见方式：

1. **使用空的块级元素清除浮动（Empty Block Method）：**
   - 在浮动元素后面插入一个空的块级元素，并对其应用`clear`属性。

   ```html
   <div style="clear: both;"></div>
   ```

   或者使用CSS类：

   ```css
   .clearfix::after {
     content: "";
     display: table;
     clear: both;
   }
   ```

   然后将这个类应用于需要清除浮动的容器元素：

   ```html
   <div class="clearfix">
     <!-- 浮动元素在这里 -->
   </div>
   ```

2. **使用伪元素清除浮动（:after伪元素）：**
   - 利用`:after`伪元素创建一个空元素，应用`clear`属性。

   ```css
   .clearfix::after {
     content: "";
     display: table;
     clear: both;
   }
   ```

   然后将这个类应用于需要清除浮动的容器元素。

3. **使用父元素触发BFC（Block Formatting Context）：**
   - 通过给父元素应用`overflow: hidden;` 或 `overflow: auto;` 触发BFC，来清除浮动。

   ```css
   .clearfix {
     overflow: hidden;
   }
   ```

   或者：

   ```css
   .clearfix {
     overflow: auto;
   }
   ```

   注意：这种方法会触发BFC，可能会影响盒模型和布局。

4. **使用清除浮动的类（clearfix class）：**
   - 使用专门设计的清除浮动的类，通常被称为clearfix类，其中包含适当的样式规则，如第一种方法中的样式。

   ```css
   .clearfix::after {
     content: "";
     display: table;
     clear: both;
   }
   ```

   然后将这个类应用于需要清除浮动的容器元素。

## 如何从html元素继承box-sizing？

在大多数情况下我们在设置元素的 border 和 padding 并不希望改变元素的 width,height值，这个时候我们就可以为该元素设置 box-sizing:border-box;。

如果不希望每次都重写一遍，而是希望他是继承而来的，那么我们可以使用如下代码：

```css
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}
```

这样的好处在于他不会覆盖其他组件的 box-sizing 值，又无需为每一个元素重复设置 box-sizing:border-box;