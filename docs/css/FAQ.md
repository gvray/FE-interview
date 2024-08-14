---
sidebar_position: 2
---
# FAQ?

## 画一条0.5px的线

1. 采用meta viewport的方式

   1px像素线条 ：

   ```html
   <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=0">
   ```

   0.5像素线条：

   ```html
   <meta name="viewport" content="width=device-width,initial-scale=0.5,user-scalable=0">
   ```

2. 采用 border-image的方式
   首先需要自己制作一个0.5像素的线条作为线条背景图片。

   ```css
   p{ border-width: 0 0 1px 0; border-image: imageUrl 2 0 round; }
   ```

3. 采用transform: scale()的方式 推荐

   ```css
   transform: scaleY(0.5);
   transform-origin: 50% 100%;
   ```

## link标签和import标签的区别

1. 本质区别：link是html的一个标签，除了导入css文件外，还可以定义其他事物，而import是css的法则，只供给css加载文件
2. DOM：DOM可以控制文档中的所有元素，可以插入link修改样式，不可以操作import
3. 权重优先级：link的修改样式的优先级高于import
4. 加载顺序：link导入的css文件随着页面加载而加载，import等到页面加载完毕，再加载
5. 兼容性：link作为html标签没有兼容性问题，而import不兼容ie5及以下

## visibility opacity display

**visibility=hidden, opacity=0，display:none**

- opacity=0，该元素隐藏起来了，但不会改变页面布局，并且，如果该元素已经绑定一些事件，如 click 事件，那么点击该区域，也能触发点击事件的

- visibility=hidden，该元素隐藏起来了，但不会改变页面布局，但是不会触发该元素已经绑定的事件

- display=none，把元素隐藏起来，并且会改变页面布局，可以理解成在页面中把该元素删除掉一样。

## 双边距重叠问题（外边距折叠）

多个相邻（兄弟或者父子关系）普通流的块元素垂直方向 marigin 会重叠

**折叠的结果为：**

>两个相邻的外边距都是正数时，折叠结果是它们两者之间较大的值。
>两个相邻的外边距都是负数时，折叠结果是两者绝对值的较大值。
>两个外边距一正一负时，折叠结果是两者的相加的和。

## position属性比较

**固定定位 fixed：**

元素的位置相对于浏览器窗口是固定位置，即使窗口是滚动的它也不会移动。Fixed 定位使元素的位置与文档流无关，因此不占据空间。 Fixed 定位的元素和其他元素重叠。

**相对定位 relative：**

如果对一个元素进行相对定位，它将出现在它所在的位置上。然后，可以通过设置垂直或水平位置，让这个元素“相对于”它的起点进行移动。 在使用相对定位时，无论是否进行移动，元素仍然占据原来的空间。因此，移动元素会导致它覆盖其它框。

**绝对定位 absolute：**

绝对定位的元素的位置相对于最近的已定位父元素，如果元素没有已定位的父元素，那么它的位置相对于`<html>`。 absolute 定位使元素的位置与文档流无关，因此不占据空间。 absolute 定位的元素和其他元素重叠。

**粘性定位 sticky：**

元素先按照普通文档流定位，然后相对于该元素在流中的 flow root（BFC）和containing block（最近的块级祖先元素）定位。而后，元素定位表现为在跨越特定阈值前为相对定位，之后为固定定位。

**默认定位 Static：**

默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right 或者z-index 声明）。

**inherit:**

规定应该从父元素继承 position 属性的值。

## 浮动清除

**方法一：使用带 clear 属性的空元素**

在浮动元素后使用一个空元素如`<div class="clear"></div>`，并在 CSS 中赋予.clear`{clear:both;}`属性即可清理浮动。亦可使用`<br class="clear" />`或`<hrclass="clear" />`来进行清理。

**方法二：使用 CSS 的 overflow 属性**

给浮动元素的容器添加 overflow:hidden;或 overflow:auto;可以清除浮动，另外在IE6 中还需要触发 hasLayout ，例如为父元素设置容器宽高或设置 zoom:1。在添加 overflow 属性后，浮动元素又回到了容器层，把容器高度撑起，达到了清理浮动的效果。

**方法三：给浮动的元素的容器添加浮动**

给浮动元素的容器也添加上浮动属性即可清除内部浮动，但是这样会使其整体浮动，影响布局，不推荐使用。

**方法四：使用邻接元素处理**

什么都不做，给浮动元素后面的元素添加 clear 属性。

**方法五：使用 CSS 的:after 伪元素**

结合:after 伪元素（注意这不是伪类，而是伪元素，代表一个元素之后最近的元素）和 IEhack ，可以完美兼容当前主流的各大浏览器，这里的 IEhack 指的是触发hasLayout。

给浮动元素的容器添加一个 clearfix 的 class，然后给这个 class 添加一个:after 伪元素实现元素末尾添加一个看不见的块元素（Block element）清理浮动。

## 怎么样让一个元素消失，讲讲

1. display:none;

把元素隐藏起来，并且会改变页面布局，可以理解成在页面中把该元素删除掉。当display设置为none，任何对该元素直接的用户交互操作都不可能生效。

1. visibility:hidden;

该元素隐藏起来了，不会改变页面布局，仍占据原有空间，但不会触发该元素已经绑定的事件。

2. opacity:0;filter:alpha(opacity=0);

该元素隐藏起来了，但不会改变页面布局，并且，如果该元素已经绑定一些事件，如click事件，那么点击该区域，也能触发点击事件的它只是一种视觉隐藏，将元素变得透明。元素本身依旧占用它的位置。

3. z-index:-1000;

将元素隐藏不占据空间，会改变页面布局，不能进行交互事件

4. position:absolute;top:-1000px;left:-1000px;

 这个方法是通过将left和top的值设的很大，让元素定位到浏览器外面。不占据空间，不能点击
将定位方式设置为relative或者fixed然后将其定位到浏览器外面可以达到同样的效果，区别在于使用relative定位仍会占有原有的空间，而使用absolute以及fixed定位不占据空间

5. transform:rotateY(90deg);

使用3d旋转，使元素隐藏，旋转x轴也可以达到同样的效果，要注意的是，css3 3D转换元素进行使用的时候，必须给父元素添加transform-style:preserve-3d;perspective:1000px;用于提供3D空间，以及设置景深

6. transform: scale(0,0)

通过缩放达到元素消失的视觉效果，元素仍占据空间

7. width:0;height:0;overflow:hidden;

## display：table和本身的table有什么区别

Display:table 和本身 table 是相对应的，区别在于，display：table 的 css 声明能够让一个 html 元素和它的子节点像 table 元素一样，使用基于表格的 css 布局，是我们能够轻松定义一个单元格的边界，背景等样式，而不会产生因为使用了 table 那样的制表标签导致的语义化问题。

之所以现在逐渐淘汰了 table 系表格元素，是因为用 div+css 编写出来的文件比用table 边写出来的文件小，而且 table 必须在页面完全加载后才显示，div 则是逐行显示，table 的嵌套性太多，没有 div 简洁.

## 伪元素选择器与伪类选择器的区别

| 特性                    | 伪元素选择器 (`::before`, `::after`, etc.)    | 伪类选择器 (`:hover`, `:focus`, etc.)    |
|-------------------------|--------------------------------------------|----------------------------------------|
| 目标                     | 用于选择 **元素的某一部分** 或 **虚拟内容** | 用于选择 **元素的特定状态**               |
| 创建新元素                | 可以通过 `content` 属性创建虚拟内容         | 不创建新元素，只影响现有元素的状态        |
| 用法                     | `::before`, `::after`, `::first-letter` 等 | `:hover`, `:focus`, `:nth-child` 等     |
| 是否响应用户交互          | 不直接响应用户交互（除非结合其他伪类使用）   | 通常用于响应用户交互（如点击、悬停、焦点） |
| 适用场景                  | 添加装饰性内容，修改元素的部分展示             | 样式化元素在不同状态下的外观（如悬停、聚焦等）|

## :where() 和 :is() 函数的区别

这两个函数的区别在于 :where() 函数的优先级总是零，则 :is() 函数的优先级取决于其最特定参数的优先级。

## link 和@import 的区别

`<link>` 和 `@import` 都是用来引入外部资源（如样式表）的方法，但它们之间有一些重要的区别：

1. **引入位置：**
   - `<link>`：通常位于 HTML 文档的 `<head>` 部分，用于在页面加载时同时加载外部资源。
   - `@import`：必须写在 CSS 文件中，用于在加载 CSS 时加载其他 CSS 文件。

2. **加载时间：**
   - `<link>`：在页面加载时同时加载外部资源，不会阻塞页面的渲染。
   - `@import`：在 CSS 文件加载时才会加载其他 CSS 文件，可能会导致页面渲染被阻塞。

3. **浏览器兼容性：**
   - `<link>`：广泛支持，适用于所有现代浏览器。
   - `@import`：旧版本的浏览器可能不支持，特别是 IE5-IE9。

4. **权重：**
   - `<link>`：外部样式表的权重高于页面上的其他样式。
   - `@import`：`@import` 的样式权重低于页面上的其他样式。

5. **JavaScript 操作：**
   - `<link>`：可以通过 JavaScript 动态地添加或移除 `<link>` 元素。
   - `@import`：由于是 CSS 规则，不能通过 JavaScript 动态添加或移除。

6. **性能：**
   - `<link>`：并行加载外部资源，可以提高页面加载速度。
   - `@import`：串行加载，可能影响页面加载性能。

7. **用法：**
   - `<link>`：用于引入样式表、字体等外部资源。
   - `@import`：用于在一个 CSS 文件中引入其他 CSS 文件。

总的来说，推荐使用 `<link>` 来引入外部样式表，尤其是对于页面的主要样式表。而 `@import` 主要在特殊情况下使用，比如在已有的样式表中引入一些辅助的样式。

## 对CSS Sprites（CSS 精灵）的理解

CSSSprites（精灵图），将一个页面涉及到的所有图片都包含到一张 大图中去，然后利用 CSS 的 background-image，background-repeat， background-position 属性的组合进行背景定位。

**优点：**

利用 CSS Sprites 能很好地减少网页的 http 请求，从而大大提高了 页面的性能，这是 CSS Sprites 最大的优点； CSS Sprites 能减少图片的字节，把 3 张图片合并成 1 张图片的字节 总是小于这 3 张图片的字节总和。

**缺点：**

在图片合并时，要把多张图片有序的、合理的合并成一张图片，还要 留好足够的空间，防止板块内出现不必要的背景。在宽屏及高分辨率 下的自适应页面，如果背景不够宽，很容易出现背景断裂； CSSSprites 在开发的时候相对来说有点麻烦，需要借助 photoshop 或其他工具来对每个背景单元测量其准确的位置。

**维护方面：**

CSS Sprites 在维护的时候比较麻烦，页面背景有少许改 动时，就要改这张合并的图片，无需改的地方尽量不要动，这样避免 改动更多的 CSS，如果在原来的地方放不下，又只能（最好）往下加 图片，这样图片的字节就增加了，还要改动 CSS。

## 常见的 CSS 布局单位

当涉及到CSS布局时，以下是一些常见的单位，以及它们的用法和示例：

1. **像素（px）**：
   - 用法：固定尺寸，常用于精确布局。
   - 示例：`width: 200px;`

2. **百分比（%）**：
   - 用法：相对于父元素的尺寸进行布局，用于响应式设计。
   - 示例：`width: 50%;`

3. **视窗宽度单位（vw）**：
   - 用法：相对于浏览器窗口宽度的百分比单位，用于响应式布局。
   - 示例：`font-size: 5vw;`

4. **视窗高度单位（vh）**：
   - 用法：相对于浏览器窗口高度的百分比单位，用于响应式布局。
   - 示例：`height: 50vh;`

5. **根元素字体大小单位（rem）**：
   - 用法：相对于根元素字体大小，用于创建响应式布局。
   - 示例：`font-size: 1.5rem;`

6. **字符宽度单位（ch）**：
   - 用法：相对于字符 "0" 的宽度，通常用于等宽字体的布局。
   - 示例：`width: 20ch;`

7. **最小宽度单位（min-width）**：
   - 用法：设置元素的最小宽度，以确保不小于指定的值。
   - 示例：`min-width: 300px;`

8. **最大宽度单位（max-width）**：
   - 用法：设置元素的最大宽度，以确保不超过指定的值。
   - 示例：`max-width: 800px;`

9. **相对字体单位（em）**：
   - 用法：相对于元素的字体大小，用于创建与字体相关的布局。
   - 示例：`font-size: 1.2em;`

10. **行高单位（line-height）**：
    - 用法：通常可以使用数字或百分比来设置行高，以垂直居中文本。
    - 示例：`line-height: 1.5;` 或 `line-height: 150%;`


## 如何解决 1px 问题？

1px问题是指在高分辨率的设备上，以1个物理像素绘制的边框或线条在屏幕上看起来过于细微或模糊的现象。这个问题在移动设备上特别常见。为了解决1px问题，可以考虑以下几种方法：

1. **使用`border`属性绘制边框：** 直接使用`border`属性绘制边框，而不是使用`width`和`height`来绘制，因为`border`属性可以在不同分辨率的设备上自动调整。

   ```css
   .element {
     border: 1px solid #000;
   }
   ```

2. **使用`transform: scale()`：** 可以使用CSS的`transform`属性对元素进行缩放来解决1px问题。通过将元素缩小，然后再放大，可以使边框看起来更加清晰。

   ```css
   .element {
     transform: scale(0.5);
     transform-origin: left top;
   }
   ```

   这里的`scale(0.5)`将元素缩小一半，然后通过`transform-origin`属性将变换的原点设置为左上角。

3. **使用伪元素::after或::before：** 可以使用伪元素来创建额外的元素，然后对其进行缩放，以实现1px效果。

   ```css
   .element::before {
     content: "";
     position: absolute;
     top: 0;
     left: 0;
     width: 200%; /* 或者其他倍数 */
     height: 200%; /* 或者其他倍数 */
     border: 1px solid #000;
     transform: scale(0.5);
     transform-origin: left top;
   }
   ```

4. **使用特定的CSS框架或工具：** 有一些专门解决1px问题的CSS框架和工具，如`border.css`、`border-loader`等。这些工具可以自动处理1px问题，让开发更加方便。

5. **使用像素单位：** 在某些情况下，如果您可以接受在高分辨率设备上显示略粗的线条，可以直接使用像素单位（px）绘制边框。

## em/px/rem/vh/vw区别?

px：绝对单位，页面按精确像素展示

em：相对单位，基准点为父节点字体的大小，如果自身定义了font-size按自身来计算，整个页面内1em不是一个固定的值

rem：相对单位，相对的只是HTML根元素font-size的值

vw，就是根据窗口的宽度，分成100等份，100vw就表示满宽，同理，vh则为窗口的高度vh、vw：主要用于页面视口大小布局，在页面布局上更加方便简单

## 什么是响应式设计？响应式设计的基本原理是什么？如何做？

响应式网站设计是一种网络页面设计布局，页面的设计与开发应当根据用户行为以及设备环境(系统平台、屏幕尺寸、屏幕定向等)进行相应的响应和调整

响应式设计的基本原理：通过媒体查询检测不同的设备屏幕尺寸做处理，为了处理移动端，页面头部必须有meta声明viewport

实现响应式布局的方式有如下：1、媒体查询 2、百分比 3、vw/vh 4、rem

媒体查询语法：

```css
@mediascreen (min-width: 375px) and (max-width: 600px) {
  body {
    font-size: 18px;
  }
}
```

响应式布局优点：1、面对不同分辨率设备灵活性强2、能够快捷解决多设备显示适应问题

缺点：

1、仅适用布局、信息、框架并不复杂的部门类型网站

2、兼容各种设备工作量大，效率低下

## 如何使用css完成视差滚动效果?

视差滚动（Parallax Scrolling）是指多层背景以不同的速度移动，形成立体的运动效果，带来非常出色的视觉体验

可以使用transform:translate3D来实现

transform:css3 属性，可以对元素进行变换(2d/3d)，包括平移 translate,旋转 rotate,缩放 scale,

perspective:css3 属性，当元素涉及 3d 变换时，perspective 可以定义我们眼睛看到的 3d 立体效果，即空间感

这种方式实现视觉差动的原理如下：

1、容器设置上 transform-style: preserve-3d 和 perspective: xpx，那么处于这个容器的子元素就将位于3D空间中，

2、子元素设置不同的 transform: translateZ()，这个时候，不同元素在 3D Z轴方向距离屏幕（我们的眼睛）的距离也就不一样

3、滚动滚动条，由于子元素设置了不同的 transform: translateZ()，那么他们滚动的上下距离 translateY 相对屏幕（我们的眼睛），也是不一样的，这就达到了滚动视差的效果

## 让Chrome支持小于12px的文字方式有哪些？区别？

1、zoom

zoom的字面意思是“变焦”，可以改变页面上元素的尺寸，属于真实尺寸

其支持的类型有：

zoom:50%，表示缩小到原来的一半

zoom:0.5，表示缩小到原来的一半

2、-webkit-transform:scale()

针对chrome浏览器,加webkit前缀，用transform:scale()这个属性进行放缩

3、-webkit-text-size-adjust:none

该属性用来设定文字大小是否根据设备(浏览器)来自动调整显示大小

## gap 属性是用来设置什么的？

gap 是用于设置 grid 和 flex 布局中元素之间的间距属性，简化了元素间距的管理。

## 浏览器如何解析css选择器？

从右往左解析CSS选择器

## PostCSS 是什么，有什么作用？

PostCSS 是一个功能强大的 CSS 处理工具，通过灵活的插件机制，可以进行 CSS 预处理、自动添加前缀、优化压缩、支持未来 CSS 功能等。它的插件生态系统极其丰富，使得 PostCSS 可以根据项目需求进行高度定制，成为现代前端构建流程中的重要工具。

## 如何避免全局样式污染？

- 模块化 CSS：使用 CSS Modules、Styled Components 或 Scoping 技术确保样式仅限于当前组件。
- BEM 命名规范：通过规范的命名方式，减少样式冲突。
- Shadow DOM 或 Web Components：通过 Web Components 封装样式，避免污染。
- CSS 预处理器：通过嵌套和模块化管理样式，减少全局污染。
- 避免通用选择器和滥用 !important：提高选择器的精确性，减少全局样式影响。

## object-fit 用法

**object-fit** 属性用于控制图片或内嵌内容（如 `<img>、<video>、<object>`等）如何填充其容器。

**可用值**

- fill: 默认值，内容会被拉伸以填充整个容器。
- contain: 内容会被缩放以适应容器，保持宽高比，可能会有空白区域。
- cover: 内容会被缩放以覆盖整个容器，保持宽高比，可能会被裁剪。
- none: 内容保持原始尺寸，不进行缩放。
- scale-down: 内容会被缩放，但不会超过其原始尺寸。

**考察重点**

- **理解**：`object-fit` 属性的不同值及其效果。
- **应用**：在实际项目中根据需求选择合适的 `object-fit` 值，确保内容的显示效果。

## position: fixed 一定是相对于浏览器窗口进行定位吗？

不一定。

position:fixed;的元素会被移出正常文档流，并不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置，元素的位置在屏幕滚动时不会改变。fixed 属性会创建新的层叠上下文。

当元素祖先的 transform, perspective 或 filter 属性非 none 时，容器由视口改为该祖先。

## z-index属性在什么情况下会失效？

| **问题**                                       | **原因**                             | **解决方案**                             |
| ---------------------------------------------- | ------------------------------------ | ---------------------------------------- |
| `position: static`                             | `z-index` 对 `static` 无效           | 设置 `position: relative/absolute/fixed` |
| 父元素创建了新层叠上下文                       | `opacity < 1`、`transform`、`filter` | 取消影响 `z-index` 的属性，或提升子元素  |
| `z-index` 无法超越父层叠上下文                 | `z-index` 受限于父级                 | 调整 `z-index` 逻辑或提升子元素层级      |
| `position: fixed` 层级问题                     | `fixed` 元素优先级较高               | 重新设计层级或调整 `position`            |
| `position: sticky` 在 Safari 下 `z-index` 失效 | 受 `overflow: hidden` 影响           | 确保无 `overflow` 干扰                   |

这些 `z-index` 失效的情况在 **前端 UI 开发中很常见**，特别是在 **模态框、悬浮导航、弹窗、层叠菜单** 等场景中，调试时需要 **结合层叠上下文（stacking context）** 分析 `z-index` 的行为！🚀

## CSSOM树和DOM树是同时解析的吗？

浏览器会下下载HTML解析页面生成DOM树，遇到CSS标签就开始解析CSS，这个过程不会阻塞，但是如果遇到了JS脚本，此时假如CSSOM还没有构建完，需要等待CSSOM构建完，再去执行JS脚本，然后再执行DOM解析，此时会阻塞。

## html和css中的图片加载与渲染规则是什么样的？

Web浏览器先会把获取到的HTML代码解析成一个DOM树，HTML中的每个标签都是DOM树中的一个节点，包括`display: none`隐藏的标签，还有JavaScript动态添加的元素等。

浏览器会获取到所有样式，并会把所有样式解析成样式规则，在解析的过程中会去掉浏览器不能识别的样式。

浏览器将会把DOM树和样式规则组合在一起（DOM元素和样式规则匹配）后将会合建一个渲染树（Render Tree），渲染树类似于DOM树，但两者别还是很大的：

渲染树能识别样式，渲染树中每个节点（NODE）都有自己的样式，而且渲染树不包含隐藏的节点（比如display:none的节点，还有`</head>`内的一些节点），因为这些节点不会用于渲染，也不会影响节点的渲染，因此不会包含到渲染树中。一旦渲染树构建完毕后，浏览器就可以根据渲染树来绘制页面了。

简单的归纳就是浏览器渲染Web页面大约会经过六个过程：

- 解析HTML，构成DOM树
- 解析加载的样式，构建样式规则树
- 加载JavaScript，执行JavaScript代码
- DOM树和样式规则树进行匹配，构成渲染树
- 计算元素位置进行页面布局
- 绘制页面，最终在浏览器中呈现

是不是会感觉这个和我们图像加载渲染没啥关系一样，事实并非如此，因为img、picture或者background-image都是DOM树或样式规则中的一部分，那么咱们套用进来，图片加载和渲染的时机有可能是下面这样：

- 解析HTML时，如果遇到img或picture标签，将会加载图片
- 解析加载的样式，遇到background-image时，并不会加载图片，而会构建样式规则树
- 加载JavaScript，执行JavaScript代码，如果代码中有创建img元素之类，会添加到DOM树中；如查有添加background-image规则，将会添加到样式规则树中
- DOM树和样式规则匹配时构建渲染树，如果DOM树节点匹配到样式规则中的backgorund-image，则会加载背景图片
- 计算元素（图片）位置进行布局
- 开始渲染图片，浏览器将呈现渲染出来的图片

上面套用浏览器渲染页面的机制，但图片加载与渲染还是有一定的规则。因为，页面中不是所有的`<img>`（或picture）元素引入的图片和background-image引入的背景图片都会加载的。那么就引发出新问题了，什么时候会真正的加载，加载规则又是什么？

先概括一点：

> Web页面中不是所有的图片都会加载和渲染！

我们可以归纳为：

- `<img>`、`<picture>`和设置background-image的元素遇到display:none时，图片会加载，但不会渲染。
- `<img>`、`<picture>`和设置background-image的元素祖先元素设置display:none时，background-image不会渲染也不会加载，而img和picture引入的图片不会渲染但会加载
- `<img>`、`<picture>`和background-image引入相同路径相同图片文件名时，图片只会加载一次
- 样式文件中background-image引入的图片，如果匹配不到DOM元素，图片不会加载
- 伪类引入的background-image，比如:hover，只有当伪类被触发时，图片才会加载


## 元素竖向的百分比设定是相对于容器的高度吗？

当按百分比设定一个元素的宽度时，它是相对于父容器的宽度计算的，但是，对于一些表示竖向距离的属性，例如 padding-top , padding-bottom , margin-top , margin-bottom 等，当按百分比设定它们时，依据的也是父容器的宽度，而不是高度。

## 设备像素、css像素、设备独立像素、dpr、ppi 之间有什么区别？

设备像素、CSS 像素、设备独立像素 (DIP)、设备像素比 (DPR) 和每英寸像素密度 (PPI) 是与屏幕分辨率和显示质量相关的概念。它们之间的区别如下：

- **设备像素**：设备像素是物理屏幕上的最小可见单元，用于实际渲染图像或文本。它表示硬件像素点的数量，通常用于描述屏幕的分辨率。设备像素的数量确定了屏幕的细节和清晰度。
- **CSS 像素**：CSS 像素是在 Web 开发中使用的抽象单位，用于定义网页上的布局和样式。它是一个相对单位，不直接对应物理屏幕上的像素。CSS 像素可以通过缩放和变换来适应不同的设备和分辨率。
- **设备独立像素 (DIP)**：设备独立像素是一种逻辑像素单位，用于将 CSS 像素与实际渲染的设备像素进行关联。DIP 可以看作是在 CSS 像素与设备像素之间建立了一个转换层。在标准的 96 DPI（dots per inch）的情况下，1 DIP 等于 1 CSS 像素。
- **设备像素比 (DPR)**：设备像素比是设备的物理像素与 CSS 像素之间的比例关系。它表示在一个 CSS 像素中有多少个设备像素。例如，如果设备像素比为 2，那么 1 CSS 像素将对应 2 个设备像素。DPR 可以用来判断屏幕的高清程度，即 Retina 屏幕。
- **每英寸像素密度 (PPI)**：每英寸像素密度表示屏幕上每英寸区域内的像素数量。它是一个描述屏幕分辨率的物理指标。更高的 PPI 值通常意味着更高的像素密度和更细腻的图像显示。

总结：

- 设备像素是物理屏幕上的最小可见单元。
- CSS 像素是 Web 开发中使用的抽象单位，用于布局和样式。
- 设备独立像素是逻辑像素单位，建立了 CSS 像素与设备像素之间的转换关系。
- 设备像素比是设备的物理像素与 CSS 像素之间的比例关系。
- 每英寸像素密度表示屏幕上每英寸区域内的像素数量，反映了屏幕的分辨率和显示质量。

## 如何画一个三角形

CSS 画三角形的核心原理是把一个**宽高为 0** 的盒子的边框变粗，利用相邻边框交界处的斜切效果，把不需要的三条边设为透明，只留一条可见。

**1. 基础三角形（实心）**

```css
.triangle {
  width: 0;
  height: 0;
  border: 50px solid transparent;
  border-bottom-color: red;  /* 只保留底边颜色 */
  /* border-left-color / border-right-color / border-top-color 控制方向 */
}
```

- `border-bottom-color` 显示 → 三角形朝上
- `border-top-color` 显示 → 朝下
- `border-right-color` 显示 → 朝左
- `border-left-color` 显示 → 朝右

**2. 直角三角形**

```css
.triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-bottom: 50px solid red;
}
```

**3. 用 `clip-path`（现代方案，更直观）**

```css
.triangle {
  width: 100px;
  height: 100px;
  background: red;
  clip-path: polygon(50% 0, 100% 100%, 0 100%);  /* 三个顶点 */
}
```

**4. 用 `transform: rotate` 旋转一个伪元素**

```css
.triangle::after {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 50px solid red;
  transform: rotate(45deg);
}
```

**5. 用 SVG / Canvas**

```html
<svg width="100" height="100">
  <polygon points="50,0 100,100 0,100" fill="red" />
</svg>
```

```js
const ctx = canvas.getContext('2d')
ctx.beginPath()
ctx.moveTo(50, 0)
ctx.lineTo(100, 100)
ctx.lineTo(0, 100)
ctx.closePath()
ctx.fillStyle = 'red'
ctx.fill()
```

**6. 用渐变（兼容性最好，可缩放）**

```css
.triangle {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, red 50%, transparent 50%);
}
```

实际项目优先使用 `border` 方案（简单稳定）或 `clip-path`（语义清晰），需要矢量可缩放则用 SVG。

