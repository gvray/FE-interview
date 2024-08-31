---
sidebar_position: 2
title: FAQ
sidebar_label: FAQ
---
# FAQ（常见问题，面向 Next.js 16+）

## Next.js 与 React 的关系是什么？
- Next.js 是构建在 React 之上的全栈框架，提供路由、渲染策略、API、优化与部署整合。
- 在 App Router 中默认使用 React Server Components，以服务端渲染优先降低客户端 JS。

## App Router 与 Pages Router 有何区别？必须迁移吗？
- App Router（app 目录）提供嵌套布局、并行/拦截路由、保留文件（error/loading/not-found）与更强的数据流能力。
- Pages Router（pages 目录）仍可用，但缺少上述能力。新项目推荐使用 App Router；老项目按需迁移。

## 在 Next.js 16+ 如何获取数据？
- 在服务端组件中直接使用 fetch。
- 通过 `next: { revalidate }` 与 cache 控制缓存与增量再生成。
- 客户端交互通过 Server Actions 或调用 Route Handlers（API）。
- Pages Router 中的 getStaticProps/getServerSideProps 只在 pages 目录可用；App Router 不再依赖它们。

## 如何选择 SSR、SSG、ISR、PPR？
- SSR：数据必须最新；适合个性化页面。
- SSG：数据稳定；适合文档/营销页。
- ISR：稳定但需定期更新；通过 revalidate 保持新鲜度。
- PPR：静态外壳 + 动态数据流式填充，首屏更快、体验更佳。

## 如何控制缓存与再验证？
- 在 fetch 中设置：

```ts
await fetch("https://api.example.com/list", {
  cache: "force-cache",
  next: { revalidate: 120 },
});
```

- 在页面/布局导出：

```ts
export const revalidate = 60;
```

## Server Actions 与 API 有何关系？
- Server Actions 用于表单与数据变更，逻辑在服务端执行，简化提交流程。
- Route Handlers 仍可用于 RESTful API，对外或多端调用更灵活。
- 两者可结合使用，提交后用 revalidatePath 刷新页面。

## 路由能力：动态、捕获、并行与拦截
- 动态段：[id] → /users/123
- 捕获所有：[...slug] → /blog/a/b/c
- 并行路由：使用命名插槽（@slot）在布局中接入多个区域。
- 拦截路由：用 (.)、(..) 前缀在模态等场景复用页面内容。

## 样式如何选择？
- CSS Modules、Tailwind、Styled Components 均可用。
- 全局样式在 app/globals.css 引入，组件级样式推荐模块化。
- 字体使用 next/font 管理，避免第三方阻塞。

## 错误与重定向如何处理？
- error.tsx/not-found.tsx 作为保留文件统一处理错误与 404。
- 使用 redirect()/notFound() 在服务端控制跳转与 404。

## 是否支持中间件与边缘运行？
- 支持。在 middleware.ts 中实现鉴权与路由决策，运行于 Edge。
- 使用 NextRequest/NextResponse 实现重写与重定向。

## 如何优化图片与脚本？
- 使用 next/image、next/font 与 next/script 控制资源加载。
- 客户端组件按需动态导入，减少初始 JS。

## 部署如何选择？
- Vercel：一键部署、边缘加速、预览环境。
- 自托管：使用 output: "standalone" 输出独立构建，并在容器/服务器运行。

## 常见性能优化建议
- 服务端组件优先，减少客户端 JS。
- 使用 PPR/流式渲染提升首屏与交互速度。
- 正确设置缓存与 revalidate，保持新鲜与性能平衡。

# FAQ?

## 什么是Next.js？它的特点是什么？

Next.js是一个用于React应用程序的轻量级框架，它使得构建服务器渲染和静态网站变得更加容易。它的主要特点包括：

- 自动代码分割：可以提高页面加载速度并降低应用程序的初始加载时间。
- 服务端渲染：使得网站在加载时快速展现给用户，可以提高搜索引擎优化和用户体验。
- 静态导出：可以将网站导出为静态HTML文件，使得网站可以更快地加载和提高SEO。
- 热更新：支持实时更新代码，使得开发过程更加高效。

## Next.js中的数据获取方法有哪些？

在Next.js中，可以使用以下方法来获取数据：

- getStaticProps：用于在构建时获取静态数据，将数据注入到组件的props中。
- getStaticPaths：用于生成静态页面的参数，通常与getStaticProps一起使用。
- getServerSideProps：用于在每个请求时获取数据，将数据注入到组件的props中。
- useSWR：用于在客户端渲染时获取数据，并进行缓存和重试。
- getInitialProps：用于在服务端渲染和客户端渲染时获取数据，但是在Next.js 10中已经被弃用。

## Next.js中的路由实现方式有哪些？

Next.js提供了两种路由实现方式：

- 文件系统路由：基于文件系统的路由方式，每个页面对应一个文件或目录。例如，/pages/index.js对应着/路径，/pages/about.js对应着/about路径。
- 动态路由：使用方括号来包含参数，例如，/pages/posts/[id].js对应着/posts/1路径和/posts/2路径。

## Next.js中如何实现代码分割？

Next.js可以使用以下方法来实现代码分割：

- 动态导入：使用import()动态导入模块，将模块与组件分离。这样可以将组件的关键代码拆分成独立的模块，并且只在需要时加载模块，减少初始加载时间。
- 预渲染：将页面在构建时预渲染成HTML，使得页面可以更快地加载和提高SEO。

## 如何在Next.js中配置webpack？

在Next.js中，可以通过在next.config.js文件中配置webpack来实现自定义webpack配置。例如，可以使用withWebpackBundleAnalyzer插件来分析webpack打包后的结果，使用withImages插件来支持图片导入，使用withTM插件来支持导入TypeScript模块等。同时，Next.js也提供了一些内置的配置选项，例如webpack5的支持和CSS模块的配置等。

## 如何在Next.js中使用样式？

在Next.js中，可以使用以下方式来使用样式：

- CSS模块：可以将样式文件命名为[filename].module.css，通过`import { styles } from './styles.module.css’`来导入，并通过`className={styles.button}`来使用样式。
- styled-jsx：可以在组件内部使用`<style jsx>`标签来定义样式，例如：

```
function Button() {
  return (
    <button className="button">
      Click me!
      <style jsx>{`
        .button {
          background-color: blue;
          color: white;
        }
      `}</style>
    </button>
  );
}
```

- 第三方CSS库：可以通过在_head.js文件中引入第三方CSS库来使用样式，例如：

```jsx
import Head from 'next/head';

function Layout({ children }) {
  return (
    <div>
      <Head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
      </Head>
      <div className="container">{children}</div>
    </div>
  );
}
```

## Next.js中如何处理错误？

在Next.js中，可以使用以下方式来处理错误：

- 自定义错误页面：可以创建pages/_error.js文件来自定义错误页面。
- 错误边界：可以通过创建ErrorBoundary组件来捕获和处理组件内部的错误。例如：

```
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

- 错误日志：可以使用第三方工具，例如Sentry来收集和记录错误日志。

## Next.js中的服务器渲染和客户端渲染有什么区别？

在Next.js中，服务器渲染和客户端渲染的主要区别在于：

- 服务器渲染：在服务器端生成HTML，并将其发送到浏览器。可以在应用程序加载时快速呈现内容，提高SEO和首次加载速度，但是每次页面更改都需要重新加载。
- 客户端渲染：在浏览器中使用JavaScript生成HTML。可以实现动态更新和交互，但是需要等待应用程序加载完成，增加了初始加载时间和首次渲染时间，并且可能会影响SEO。

## Next.js中如何实现缓存？

1. 静态导出（Static Exporting）：将网站导出为静态HTML文件，使得网站可以更快地加载和提高SEO。可以通过命令行工具或在next.config.js文件中配置实现静态导出。
2. getStaticProps 和 getServerSideProps：使用缓存和过期时间来减少服务器渲染时的负载和响应时间。可以通过配置revalidate选项来指定在多长时间内更新缓存，例如：

```
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();

  return {
    props: { data },
    revalidate: 60 // 1 minute
  };
}
```

这将在1分钟内缓存数据，并在下一次请求时重新验证和更新数据。

3. useSWR：使用缓存和重试机制来优化客户端渲染时的数据获取。useSWR是一个流行的第三方库，它通过在本地缓存中存储数据，并提供了可配置的重试机制来实现数据的缓存和更新，例如：

```
import useSWR from 'swr';

function Profile({ userId }) {
  const { data, error } = useSWR(`/api/user/${userId}`, fetcher);

  if (error) return <div>Failed to load user</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{data.name}</div>;
}
```

这将缓存数据，并自动更新数据，以便在请求失败时重试。

4. 缓存控制头（Cache-Control header）：可以通过设置Cache-Control头来指定缓存策略和缓存过期时间。例如：

```
export async function getServerSideProps({ res }) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');

  const data = await fetch('https://api.example.com/data');
  const dataJson = await data.json();

  return {
    props: { data: dataJson }
  };
}
```

这将在1秒内缓存数据，并在缓存过期时重新验证和更新数据。

## setImmediate 是微任务吗

不是，setImmediate 不是 JavaScript 中的微任务，而是一种浏览器之外、用于在 Node.js 中添加一个异步操作的API。在 Node.js 环境中，setImmediate 是一种宏任务（macrotask），它的执行优先级低于 process.nextTick()，但高于 setTimeout 和 setInterval。当 Node.js 中的事件循环执行到 check 阶段时，会检查 setImmediate 队列中是否有任务需要执行，如果有，则执行 setImmediate 中的任务。

需要注意的是，在浏览器中并不存在 setImmediate 这个API，但可以使用 message event 或者 setTimeout 0 来模拟实现其功能，将其添加到宏任务队列中，而不是微任务队列中。因此，在浏览器中，setImmediate 计划的任务会在当前宏任务执行结束之后，下一个宏任务执行之前执行。
