---
sidebar_position: 3
---

# css盒模型

就是用来装页面上的元素的矩形区域。CSS 中的盒子模型包括 IE 盒子模型和标准的 W3C 盒子模型。

box-sizing(有 3 个值哦)：border-box, padding-box, content-box.

- 标准盒子模型: content-box, width = content
- 替代（IE）盒模型: border-box, width = content + padding + border。默认浏览器会使用标准模型。如果需要使用替代模型，您可以通过为其设置 box-sizing: border-box 来实现。
- box-sizing:padding-box,这个属性值的宽度包含了左右padding+width,已经删除。

也很好理解性记忆，包含什么，width 就从什么开始算起。
