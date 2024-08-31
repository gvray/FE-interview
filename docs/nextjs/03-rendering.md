---
sidebar_position: 4
title: 渲染与数据
sidebar_label: 渲染与数据
---
# 渲染模式与数据获取

## 服务端组件与客户端组件
- 服务端组件（RSC）：默认在服务端渲染，不携带客户端 JS，性能更好。
- 客户端组件：在文件首行加入 "use client"，用于事件与交互。

```tsx
// 服务端组件（默认）
export default async function Page() {
  const data = await fetch("https://api.example.com").then(r => r.json());
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

// 客户端组件
"use client";
export function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

## 渲染策略
- SSR（服务端渲染）：请求时生成 HTML，适合需要新鲜数据的页面。
- SSG（静态生成）：构建时生成 HTML，适合内容稳定的页面。
- ISR（增量静态再生成）：静态页面按间隔重新验证并更新。
- PPR（部分预渲染）：预渲染静态外壳，动态数据以流方式增量填充。

## 增量静态再生成（ISR）
- 在路由段或页面中设置 revalidate：

```ts
// app/products/page.tsx
export const revalidate = 60; // 秒
export default async function Products() {
  const res = await fetch("https://api.example.com/products", { next: { revalidate: 60 } });
  const list = await res.json();
  return <ul>{list.map((p: any) => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

## 动态路由的静态生成
- 提供预生成参数：

```ts
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const slugs = await fetch("https://api.example.com/blog-slugs").then(r => r.json());
  return slugs.map((slug: string) => ({ slug }));
}
```

## 控制动态与静态行为
- 通过 dynamic 指定渲染策略：

```ts
export const dynamic = "force-static";   // 强制静态
// 或
export const dynamic = "force-dynamic";  // 强制动态（禁用缓存）
```

## PPR（部分预渲染）思路
- 页面分为静态外壳与动态数据区块。
- 静态部分在构建或边缘预渲染，动态部分通过流（streaming）逐步填充。
- 优势：首屏快速、交互快，同时保留动态能力。

## 错误与状态处理
- notFound()：返回 404
- redirect()：服务端重定向到特定路由
- 通过 reserved error.js/not-found.js 统一处理。

```ts
import { notFound, redirect } from "next/navigation";
export default async function Page({ params }: { params: { id: string } }) {
  const res = await fetch(`https://api.example.com/item/${params.id}`, { cache: "no-store" });
  if (res.status === 404) notFound();
  const item = await res.json();
  if (!item.active) redirect("/items");
  return <div>{item.name}</div>;
}
```

## 推荐实践
- 默认使用服务端组件与 fetch（带缓存控制），仅在需要交互时使用客户端组件。
- 为动态路由提供 generateStaticParams，提高预渲染与 SEO。
- 正确设置 revalidate，平衡数据新鲜度与性能。
