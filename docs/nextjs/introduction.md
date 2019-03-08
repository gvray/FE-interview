---
sidebar_position: 2
title: Next.js 入门
sidebar_label: 入门
---
# Next.js 入门与项目结构

## 为什么选择 Next.js
- 全栈能力：同一项目内完成页面、服务端逻辑、API、认证与部署。
- App Router：基于文件系统的现代路由，天然支持嵌套布局与数据流。
- React Server Components：服务端渲染默认优先，降低客户端 JS 体积。
- 多种渲染策略：SSR、SSG、ISR、PPR（部分预渲染）按需组合。
- 性能优化内置：图片、字体、脚本优化与渐进式数据流。

## 快速创建项目
- 创建项目

```bash
npm create next-app@latest my-app
cd my-app
npm run dev
```

- 常用脚本
  - 开发：npm run dev
  - 构建：npm run build
  - 生产：npm run start

## 标准目录结构（App Router）
```
my-app/
├─ app/                   # 路由与页面（推荐）
│  ├─ layout.tsx          # 根布局（可嵌套）
│  ├─ page.tsx            # 根页面
│  ├─ dashboard/
│  │  ├─ layout.tsx      # 子布局
│  │  └─ page.tsx        # /dashboard 页面
│  ├─ api/               # Route Handlers（API）
│  │  └─ hello/route.ts  # GET/POST 等
│  └─ favicon.ico
├─ public/                # 静态资源
├─ styles/                # 全局样式
├─ next.config.js         # 配置
└─ package.json
```

最小页面示例：

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

// app/page.tsx
export default async function Home() {
  return <h1>Hello Next.js 16+</h1>;
}
```

## App Router 关键概念
- 路由即文件夹：每个目录代表一个路由段（segment）。
- 页面文件：page.tsx 定义该路由的主页面。
- 布局文件：layout.tsx 可层层嵌套，实现稳定 UI 框架。
- 动态路由：使用 [id]、[...slug]、[[...optional]] 等。
- 元数据：在任意路由段导出 metadata 或配置 SEO。
- 数据获取：在组件中直接使用 fetch（默认服务端执行）。

## 与 Pages Router 的差异
- App Router 默认使用 React Server Components，减少客户端负载。
- 数据请求不再依赖 getStaticProps/getServerSideProps（仍可在 pages 目录使用）。
- 更强的嵌套布局与并行/拦截路由能力。

## 项目约定与最佳实践
- 使用 TypeScript：更易维护与重构。
- 按领域组织目录：如 app/(auth)/login、app/(marketing)/page。
- 将客户端交互组件置于 use client 文件中，避免不必要的客户端 JS。
- 利用缓存与 revalidate 控制数据新鲜度与性能。

## 下一步
- 路由与布局：[App Router 路由与布局](./02-routing.md)
- 渲染与数据：[渲染模式与数据获取](./03-rendering.md)
