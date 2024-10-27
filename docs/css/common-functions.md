---
sidebar_position: 16
---

# Css 常用函数

1. **颜色函数**：
   - `rgb()` 和 `rgba()`：

     ```css
     background-color: rgb(255, 0, 0); /* 红色 */
     color: rgba(0, 128, 0, 0.5); /* 半透明的绿色 */
     ```

   - `hsl()` 和 `hsla()`：

     ```css
     background-color: hsl(120, 100%, 50%); /* 绿色 */
     color: hsla(240, 100%, 50%, 0.5); /* 半透明的蓝色 */
     ```

2. **数学函数** (`calc()`)：

   ```css
   width: calc(50% - 20px); /* 宽度减去20像素 */
   ```

3. **字符串函数** (`attr()`)：
   HTML：

   ```html
   <div data-text="Hello, World">...</div>
   ```

   CSS：

   ```css
   content: attr(data-text); /* 将元素的data-text属性的值插入到content中 */
   ```

4. **边框函数** (`border-radius` 和 `box-shadow`)：

   ```css
   border-radius: 10px; /* 设置边框圆角半径为10像素 */
   box-shadow: 3px 3px 5px 0px rgba(0, 0, 0, 0.5); /* 添加阴影效果 */
   ```

5. **变量函数** (`var()`)：

   ```css
   :root {
     --primary-color: #007bff;
   }

   .button {
     background-color: var(--primary-color); /* 使用自定义颜色变量 */
   }
   ```

6. **渐变函数** (`linear-gradient()` 和 `radial-gradient()`)：

   ```css
   background: linear-gradient(to right, #ff0000, #00ff00); /* 创建水平线性渐变 */
   background: radial-gradient(circle, #ff0000, #00ff00); /* 创建径向渐变 */
   ```

7. **动画函数** (`animation`)：

   ```css
   @keyframes slide {
     0% {
       transform: translateX(0);
     }
     100% {
       transform: translateX(100%);
     }
   }

   .slide-in {
     animation: slide 2s ease-in-out infinite; /* 应用名为slide的动画 */
   }
   ```

这些案例展示了不同的CSS函数在实际样式中的用法，以及如何通过函数来创建各种效果和动画。根据你的具体需求，可以选择适当的函数来实现所需的样式。
