---
sidebar_position: 5
title: 缓存与 ISR
sidebar_label: 缓存与 ISR
---
# fetch 缓存与增量静态再生成

## 在组件中直接使用 fetch
- 服务端组件中直接 await fetch，默认走服务端。
- 客户端组件中应通过 API 或 Server Actions 间接获取。

```ts
export default async function Page() {
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

## 缓存控制
- cache 选项：
  - "force-cache"：默认缓存（可与 ISR 搭配）
  - "no-store"：禁用缓存（每次请求都新鲜）
- next 选项：
  - `next: { revalidate: 秒数 }`：设置再验证间隔

```ts
await fetch("https://api.example.com/list", {
  cache: "force-cache",
  next: { revalidate: 120 },
});

await fetch("https://api.example.com/detail/1", {
  cache: "no-store",
});
```

## 在路由段设置 revalidate
- 在页面级或布局级导出 revalidate：

```ts
export const revalidate = 60; // 60 秒重新验证
```

## 结合 Server Actions 触发再验证
- 提交后通过 revalidatePath 或标签实现刷新：

```ts
"use server";
import { revalidatePath } from "next/cache";

export async function createItem(formData: FormData) {
  const name = formData.get("name") as string;
  await fetch("https://api.example.com/items", {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: { "Content-Type": "application/json" },
  });
  revalidatePath("/items");
}
```

```tsx
// app/items/page.tsx
import { createItem } from "./actions";

export default async function Items() {
  const res = await fetch("https://api.example.com/items", { next: { revalidate: 60 } });
  const items = await res.json();
  return (
    <form action={createItem}>
      <input name="name" placeholder="新条目" />
      <button type="submit">创建</button>
      <ul>{items.map((i: any) => <li key={i.id}>{i.name}</li>)}</ul>
    </form>
  );
}
```

## 错误处理与状态
- 使用 try/catch 包裹网络请求，必要时返回备用 UI。
- 对 404 使用 notFound()，对重定向使用 redirect()。

## 推荐实践
- 数据默认走服务端 fetch，并设置恰当的缓存与再验证策略。
- 客户端交互通过 Server Actions 改变数据，并触发 revalidatePath。
- 仅在确需最新数据时使用 cache: "no-store"，谨慎对性能影响。
