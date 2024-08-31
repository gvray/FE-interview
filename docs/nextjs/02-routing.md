---
sidebar_position: 3
title: 路由与布局
sidebar_label: 路由与布局
---
# App Router 路由与布局

## 文件系统路由
- 路由段（segment）：app 下的每一级目录。
- 页面：page.tsx 对应目录的页面。
- 布局：layout.tsx 包裹该段所有子页面，实现稳定 UI。
- 示例结构：

```
app/
├─ layout.tsx
├─ page.tsx
├─ dashboard/
│  ├─ layout.tsx
│  └─ page.tsx        # /dashboard
└─ settings/
   └─ page.tsx        # /settings
```

## 动态路由
- 单段：app/users/[id]/page.tsx → /users/123
- 捕获全部：app/blog/[...slug]/page.tsx → /blog/a/b/c
- 可选捕获：app/docs/[[...slug]]/page.tsx → /docs 或 /docs/a/b

```tsx
// app/users/[id]/page.tsx
type Props = { params: { id: string } };
export default function UserPage({ params }: Props) {
  return <div>User: {params.id}</div>;
}
```

## 嵌套布局
- 任意路由段都可定义 layout.tsx。
- 通过 children 渲染其子层级。

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <aside>左侧导航</aside>
      <main>{children}</main>
    </section>
  );
}
```

## 并行与拦截路由（高级）
- 并行路由：使用命名插槽（@feed、@ads）并在布局中接收。
- 拦截路由：（.)、(..) 等前缀可在模态等场景复用页面。

## 链接与导航
- 客户端导航：

```tsx
import Link from "next/link";
export default function Nav() {
  return <Link href="/dashboard">进入 Dashboard</Link>;
}
```

- 命令式导航：

```tsx
"use client";
import { useRouter } from "next/navigation";
export default function GoButton() {
  const router = useRouter();
  return <button onClick={() => router.push("/settings")}>设置</button>;
}
```

## 元数据与 SEO
- 在任意段导出 metadata：

```tsx
export const metadata = {
  title: "用户列表",
  description: "展示所有用户",
};
```

## 路由处理程序（API）
- 在 app/api 下创建 route.ts 处理 GET/POST 等：

```ts
// app/api/hello/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello API" });
}
```

## 推荐实践
- 使用嵌套布局实现稳定框架（导航、侧边栏、页脚）。
- 将页面拆分为服务端/客户端组件，交互强的组件使用 use client。
- 按业务域组织路由，保持可读性与可维护性。
