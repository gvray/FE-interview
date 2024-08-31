---
sidebar_position: 6
title: Server Actions
sidebar_label: Server Actions
---
# Server Actions 与表单处理

## 核心概念
- Server Actions：在服务端执行的函数，简化表单与数据变更逻辑。
- 安全：代码仅在服务端运行，避免暴露敏感逻辑到客户端。
- 触发再验证：支持 revalidatePath/标签，自动刷新相关页面。

## 基本使用
1. 在服务端文件中定义带 "use server" 的函数。
2. 将组件中的 form 的 action 指向该函数。

```ts
"use server";
export async function createTodo(formData: FormData) {
  const title = formData.get("title") as string;
  // 写入数据库/调用后端
  await fetch("https://api.example.com/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
}
```

```tsx
// app/todos/page.tsx
import { createTodo } from "./actions";

export default async function Todos() {
  const res = await fetch("https://api.example.com/todos", { cache: "no-store" });
  const list = await res.json();
  return (
    <form action={createTodo}>
      <input name="title" placeholder="待办事项" />
      <button type="submit">添加</button>
      <ul>{list.map((t: any) => <li key={t.id}>{t.title}</li>)}</ul>
    </form>
  );
}
```

## 与状态库结合
- 在客户端组件中使用 useActionState 或 useFormStatus 显示提交状态。

```tsx
"use client";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? "提交中…" : "提交"}</button>;
}
```

## 触发页面再验证
- 在 Action 中使用 revalidatePath 或标签，保持数据一致性。

```ts
"use server";
import { revalidatePath } from "next/cache";

export async function removeTodo(id: string) {
  await fetch(`https://api.example.com/todos/${id}`, { method: "DELETE" });
  revalidatePath("/todos");
}
```

## 安全与校验
- 对输入做校验与清洗，防止注入与恶意数据。
- 使用 HttpOnly cookie 存储会话，避免在客户端脚本可读。
- 区分客户端展示组件与服务端敏感逻辑，遵循最小权限原则。

## 推荐实践
- 用 Server Actions 简化表单提交流程，替代冗余的 API 层样板。
- 与缓存/再验证配合，确保性能与一致性。
- 将复杂交互拆分为“服务端动作 + 轻量客户端控件”的组合。
