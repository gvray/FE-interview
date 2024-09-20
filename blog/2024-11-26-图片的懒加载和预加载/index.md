---
slug: 图片的懒加载和预加载
title: 图片的懒加载和预加载
authors: [gavin]
tags: [图片加载]
---

# 图片的懒加载和预加载

图片的懒加载（Lazy Loading）和预加载（Preloading）是两种优化网页加载性能的技术，分别针对不同的场景。

---

## **懒加载 (Lazy Loading)**

懒加载是一种按需加载资源的技术，图片只有在用户即将看到它时（如滚动到视口范围内）才加载，而非页面初始渲染时就加载所有图片。

## **实现方式**
1. **HTML 属性 `loading="lazy"`**  
   从 HTML5 开始，`<img>` 标签支持原生的 `loading` 属性：  
   ```html
   <img src="example.jpg" alt="example" loading="lazy" />
   ```
   - 浏览器会在图片即将进入视口前自动加载。

2. **Intersection Observer**  
   如果需要支持更复杂的场景或兼容性（如旧版浏览器），可以使用 JavaScript 的 Intersection Observer API：
   ```javascript
   const images = document.querySelectorAll('img[data-src]');
   const observer = new IntersectionObserver((entries, obs) => {
       entries.forEach(entry => {
           if (entry.isIntersecting) {
               const img = entry.target;
               img.src = img.dataset.src;
               obs.unobserve(img);
           }
       });
   });

   images.forEach(img => observer.observe(img));
   ```
   在 HTML 中：
   ```html
   <img data-src="example.jpg" alt="example" />
   ```

## **优点**
- **减少首屏加载时间**：只加载视口内的图片，加快页面初始渲染速度。
- **节省带宽**：未进入视口的图片不会被加载。

## **缺点**
- **SEO 影响**：对 SEO 不友好的懒加载可能导致搜索引擎抓取不到图片。
- **兼容性**：老旧浏览器可能不支持，需要提供回退方案。

---

## **预加载 (Preloading)**

预加载是提前加载将来需要的资源，以缩短首屏交互时间。下面从定义、实现方式与适用场景几个方面展开。

## **定义**  
预加载是在资源实际需要之前提前加载，以确保资源在需要时立即可用，减少延迟。

## **实现方式**
1. **`<link>` 标签的 `rel="preload"`**  
   用于告诉浏览器优先加载某些资源：
   ```html
   <link rel="preload" href="example.jpg" as="image" />
   ```

2. **JavaScript 动态加载**  
   使用 JavaScript 创建 Image 对象来预加载图片：
   ```javascript
   const img = new Image();
   img.src = 'example.jpg';
   ```

3. **CSS 的背景图预加载**  
   使用 `@font-face` 或 `background-image` 提前加载图片资源：
   ```css
   .preload {
       background-image: url('example.jpg');
       visibility: hidden;
   }
   ```

## **优点**
- **提升用户体验**：资源提前加载，减少交互时的等待时间。
- **适用于关键资源**：如页面首屏大图或重要交互图片。

## **缺点**
- **增加初始加载时间**：预加载会增加初始的网络请求，可能导致首屏渲染变慢。
- **带宽浪费**：如果资源未被实际使用，可能浪费用户带宽。

---

## **懒加载 vs. 预加载**

| 特性       | 懒加载                  | 预加载                  |
|------------|-------------------------|-------------------------|
| **目的**   | 减少首屏加载压力，节省带宽 | 减少资源加载延迟        |
| **触发时机**| 用户需要时（滚动到视口）| 页面加载时提前加载      |
| **适用场景**| 非首屏图片或次要资源     | 首屏关键资源或未来会使用的资源 |
| **缺点**   | 可能影响 SEO 和兼容性    | 增加初始网络请求负担    |

---

## **综合应用**  
在实际开发中，可以将懒加载和预加载结合使用。例如：
- 对首屏的关键资源（如 Hero 图片）使用预加载。
- 对非首屏的次要图片使用懒加载，减少加载压力。

:::tip
- 预加载：提前加载图片，当用户需要查看时可直接从本地缓存中渲染。
- 懒加载：懒加载的主要目的是作为服务器前端的优化，减少请求数或延迟请求数。
- 两种技术的本质：两者的行为是相反的，一个是提前加载，一个是迟缓甚至不加载。
- 懒加载对服务器前端有一定的缓解压力作用，预加载则会增加服务器前端压力。
:::
