---
sidebar_position: 4
---

# transition和animation的区别

1. transition是一个过渡的效果，没有中间状态，需要设置触发事件（如hover等）才能执行；

2. animation是一个动画的效果，有多个中间帧，可以在任意一个中间帧设置状态，不需要设置触发事件就能执行。

**transform**

首先要注意的是transform属性是静态属性，只要写进style里就会直接显示生效，不会出现动画过程
通过使用transform属性，能够对元素进行移动（translate）、缩放（scale）、旋转（rotate）、翻转（skew），更多详细参数可以参考CSS3 transform 属性

| 区别                   | transition                    | animation                             |
| ---------------------- | ----------------------------- | ------------------------------------- |
| 是否能自动执行         | 不能，需要事件触发，比如hover | 能                                    |
| 能否重复发生           | 不能，除非在一次触发          | 能                                    |
| 能否包含多个状态       | 不能，只有开始和结束状态      | 能，比如从0% 到100%，任意指定过渡状态 |
| 能否暂停               | 不能，一次性                  | 能，比如hover事件触发暂停             |
| 能否定义速度曲线       | 能                            | 能                                    |
| 能否定义某个属性值过渡 | 能                            | 能                                    |

## transition（过渡、转变的意思）

transition 属性是一个简写属性，用于设置四个过渡属性：

1. transition-property：设置过渡效果的属性名称（默认值是all

2. transition-duration：设置过渡完成所需要的时间（默认值是0

3. transition-timing-function：设置过渡速度效果曲线（默认值是ease

4. transition-delay：设置过渡的开始时间（默认值是0

语法：transition: property duration timing-function delay;
注意：这里transition-duration是必须要填的，不填默认为是0，没有过渡效果。

| 值       | 描述          |
| ---------------------------- | ------------------------------------------------------------ |
| transition-property       | 需要过渡的属性，也可以是all，不能用block，none等             |
| transition-duration       | 指定从一个属性到另一个属性过渡所要花费的时间。默认值为0，为0时，表示变化是瞬时的，看不到过渡效果 |
| transiton-timing-function | 就是过渡的动画类型。可用的类型有liner（匀速）、ease-in(减速)、ease-out（加速）ease-in-out（先加速再减速）、cubic-bezier：三次贝塞尔曲线，可以定制 |
| transition-delay          | 指定检测到过渡行为之后延迟一定时间后才开始进行执行           |

```css
.box {
    border-style: solid;
    border-width: 1px;
    display: block;
    width: 100px;
    height: 100px;
    background-color: #0000FF;
    -webkit-transition:width 2s, height 2s,
        background-color 2s, -webkit-transform 2s;
    transition:width 2s, height 2s, background-color 2s, transform 2s;
}
.box:hover {
    background-color: #FFCCCC;
    width:200px;
    height:200px;
    -webkit-transform:rotate(180deg);
    transform:rotate(180deg);
}

```

## animation（动画、活力的意思）

animation 属性也是一个简写属性，用于设置六个动画属性：

1. animation-name：设置绑定到选择器的@keyframem名称（默认值是none

2. animation-duration：设置完成动画所花费的时间（默认值是0

3. animation-timing-function：设置动画的速度曲线（默认值是ease

4. animation-delay：设置动画延迟几秒开始（默认值是0

5. animation-iteration-count：设置动画播放的次数（默认值是1

6. animation-direction：设置时候轮流反向播放动画（默认值是normal

语法：animation: name duration timing-function delay iteration-count direction;

注意：这里animation-duration是必须要填的，不填默认是0，就不会播放动画了。

| 属性                      | 描述                                                         |
| ------------------------- | ------------------------------------------------------------ |
| animation-name            | 用来调用@keyframes定义好的动画，与@keyframes定义的动画名称一致 |
| animation-duration        | 规定动画完成一个周期所花费的秒或毫秒。默认是 0               |
| animation-timing-function | 速度曲线，和transition-timing-function一样，可用的类型有liner（匀速）、ease-in(减速)、ease-out（加速）ease-in-out（先加速再减速）、cubic-bezier：三次贝塞尔曲线，可以定制 |
| animation-delay           | 规定动画何时开始，默认是 0                                   |
| animation-iteration-count | 规定动画被播放的次数。默认是 1                               |
| animation-direction       | normal 默认值，如果设置为normal时，动画每次循环都是向前（即按顺序）播放，alternate（轮流），动画播放在第偶数次向前播放，第奇数次向反方向播放（animation-iteration-count取值大于1时设置有效） |
| animation-play-state      | running，可以通过该值将暂停的动画重新播放，这里的重新播放不是从元素动画的开始播放，而是从暂停的那个位置开始播放，paused，暂停播放 。注意: Internet Explorer 9 及更早 IE 版本不支持 animation-play-state 属性。|
| animation-fill-mode       | 默认情况下，动画结束后，元素的样式将回到起始状态，animation-fill-mode属性可以控制动画结束后元素的样式。主要具有四个属性值：none（默认，回到动画没开始时的状态。），forwards（动画结束后动画停留在结束状态），backwords（动画回到第一帧的状态），both（根据animation-direction轮流应用forwards和backwards规则） |

```css
.polling_message {
  color: white;
  float: left;
  margin-right: 2%;
}

.view_port {
  background-color: black;
  height: 25px;
  width: 100%;
  overflow: hidden;
}

.cylon_eye {
  background-color: red;
  background-image: linear-gradient(to right,
      rgba(0, 0, 0, .9) 25%,
      rgba(0, 0, 0, .1) 50%,
      rgba(0, 0, 0, .9) 75%);
  color: white;
  height: 100%;
  width: 20%;

  -webkit-animation: 4s linear 0s infinite alternate move_eye;
          animation: 4s linear 0s infinite alternate move_eye;
}

@-webkit-keyframes move_eye { from { margin-left: -20%; } to { margin-left: 100%; }  }
        @keyframes move_eye { from { margin-left: -20%; } to { margin-left: 100%; }  }
```
