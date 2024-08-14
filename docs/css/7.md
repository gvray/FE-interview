---
sidebar_position: 9
---

# css选择器及优先级

## 选择器优先级

先不讨论多个选择器嵌套的情况

css优先级: !important>行间样式> id选择器(#myid)>属性选择器(a\[rel="external"\])&&伪类选择器(a:hover, li:nth-child)&&类选择器(.myclass)>元素选择器

具体：

```
行内样式:优先级1000
ID选择器:优先级0100
类选择器/属性选择器/伪类选择器（0010）
元素选择器/伪元素选择器（0001）
关系选择器/通配符选择器（0000）
```

注意：! important:优先级最大10000 (用了后就不能修改慎用)

带!important 标记的样式属性优先级最高； 样式表的来源相同时：!important> 行内样式>ID选择器 > 类选择器 > 标签 > 通配符 > 继承 > 浏览器默认属性

具体例子：

```
span 优先级1
div span 优先级1+1
div:first-child == 1+10
.p1 span 优先级10+1.
#divI span 优先级100+1
```

## 1.基础选择器

### 1.1. ID选择器

ID选择器使用 "#" 号加ID名称xx来表示，用来选择HTML 中的id="xxx"的DOM元素

```
<div id="page">我是id选择器</div>
```

当我们想给这个元素应用样式时候

```css
#page{
    color:#fff;
    background:#000;
}
```

### 1.2. 类选择器

类选择器我们是用 “.” 加上claa名称来表示,用来选择HTML中的class="xx"的DOM元素。

```stata
    <li class="list-item">1</li>
    <li class="list-item">2</li>
    <li class="list-item">3</li>
```

把样式加到每一条元素，使用类选择器

```dsconfig
.list-item{
   color:red;
   font-size:16px 
}
```

### 1.3. 通配符选择器

> 通配符选择器使用 * 来选择页面里面的所有元素

```css
*{
    margin:0;
    padding:0;
}
```

由于通配符选择器要把样式覆盖到所有的元素上,因此它的效率不会高。

### 1.4. 标签选择器

标签选择器就是选中HTML中某一种类的标签，直接使用HTML中的标签名作为肖泽强的名称

```css
li{
    font-size:20px;
}
```

> Tips 标签选择器通常用来重置某些标签的样式,标签选择器的效率也不是很高

### 1.5. 属性选择器

属性选择器通过DOM的属性来选择DOM节点，属性选择器用括号"[]"包裹，如下

```css
a[href]{
    color:red;
}
```

属性选择器有如下几种形式

- [attr] 用来选择带有attr属性的元素
- [attr=xxx] 用来选择attr属性等于xxx的元素,如选择文本输入框

```
<input type="text" value="hello"/>>

//css
input[type=text]{
    color:red;
}
```

> 这个选择器要注意,xxx和HTML中的属性值必须完全相等才会生效

```
<input class="input text" type="text" value="hello"/>>

//css
input[class="input text"]{
    color:red;
}
```

- [attr~=xxx] 这个选择器中间用了~=,选择属性值包含xx

```
<input class="input text" type="text" value="hello"/>>

//css
input[class~=input]{
    color:red;
}
```

- [attr|xxx] 这个选择器是用来选择为xxx或者xxx- 开头的元素，使用如下

```
   <div class="article">1</div>
   <div class="article-tile">2</div>
   <div class="article-content">3</div>
   <div class="article_footer">4</div>

   div[class|=article]{
       color:red
   }
```

上面会有article开头的生效，但对第四条不会生效

- [attr^=xxx]，这个选择器会匹配xxx开头,实际就是用正则去匹配属性值,只要是xxx开头就行

如果把选择器改成 div[class^=artice] 那么都会选中了

- [attr$=xxx] 这个选择器用正则匹配属性以XXX结尾的元素
- [attr*=xxx] 这个选择器用正则匹配的方法来选择属性值中包含XXX字符的所有元素。

## 2. 组合选择器

### 2.1. 后代选择器

后代选择器是用空格分隔多个选择器组合,它的作用是在A选择器的后代中找到B选择器所指的元素，如:

```
<div class="page">
    <div class="acr">
        <p>我是随便写的</p>
    </div>
    <p>我也是随便写的</p>
</div>

.page p {
     color: gold;
     font-size: 20px;
   }
```

### 2.2. 子元素选择器

子元素选择器和后代选择器类似，不过子元素只找子元素,不会把所有的后代都找一遍

```css
.page >p{
    color:red
}
```

### 2.3. 相邻兄弟选择器

相邻兄弟选择器是用来选取某个元素紧邻的兄弟元素,它的语法是"选择器A + 选择器B"

```css
h1+p{
    margin-top:20px;
    color:black;
}
```

### 2.4. 通用兄弟选择器

通用兄弟选择器和相邻兄弟选择器很相似,它的语法是"选择器A ~ 选择器B"，会匹配选择器A后面所有符合选择器B的元素

```css
H1~P{
    color:red
}
```

### 2.5. 交集选择器

交集选择器是为了找两个或多个选择器的交集,用法就是把两个选择器放在一起,法语"选择器A选择器B"

```dsconfig
.list-item.active{
    color:red;
    font-size:20px
}
```

### 2.6. 并集选择器

并集选择器是为了合并类型的样式,可以是选择器不用单样式相同的CSS语法块合并。并集选择器就是用多个逗号分隔多个选择器,如"选择器A,选择器B"

```css
H1,H2,P{
    margin:0;
    padding:0;
}
```

## 3. 伪类和伪元素选择器

### 3.1. 标记状态的伪类

- :link 选取未访问过的超链接
- :visited 选取访问过的连接
- :hover 选取鼠标悬浮的元素
- :active 选取点中的元素
- :focus 选取获取焦点的元素

### 3.2. 筛选功能的伪类

- :empty 选取没有子元素的元素
- :checked 选取勾选状态下的input 元素  只对 radio 和checkbox 有效
- :disabled 选取禁用的表单元素
- :first-child 选取当前选择器下的第一个元素
- :last-child 选取当前选择器下的最后一个元素
- :nth-child(an+b) 选取指定位置的元素,参数支持an+b的形势.比如 li:nth(2n+1),就可以选取li元素序号是2的整数倍+1的所有元素,也就是1,3,5,7,9序号的li元素
- :nth-last-child(an+b) 和上面类似,不过从后面选取.
- :only-child 选取元素唯一的子元素,如果元素的父元素只有它一个子元素就会生效,如果还有其他的兄弟元素,则不生效
- :only-of-type 选取唯一的某个元素类型。如果元素的父元素只有它一个当前类型的子元素就会生效。

### 3.3. 伪元素选择器

伪元素选择器是用来香元素设置某种特殊效果.伪元素选择器并不是真实的DOM元素,所以称之伪元素.常用的如下:

- ::first-line 为元素的第一行使用样式
- ::first-letter 为某个元素的首字母或第一个文字使用样式
- ::before 在某个元素之前插入内容
- ::after 在某个元素之后插入内容
- ::selection 对光标选中的元素添加样式

```
1.伪元素构造的元素是虚拟的,所以不能使用js去操作

2.first-line和first-letter不使用于内联样式,在内联样式中都会失效

3.如果同时使用了 befor 和first-letter. 第一个内容要从before中算起,如果before 中第一个为非文本内容,那first-letter也会作用到这个非文本内容上,但不会生效。

4.在CSS3 中规定, 伪类用一个冒号 (:) 表示, 伪元素用两个冒号 (::)来表示
```

## 属性的继承

### 可继承属性

- 字体系列属性：font-family、font-weight、font-size、font-style
- 文本系列属性：text-indent、text-align、line-height、direction、color
- 元素可见性visibility等

### 无继承属性

display

文本属性：vertical-align、text-decoration、

背景属性、盒子模型的属性、定位属性等
