---
sidebar_position: 10
title: 认证与安全
sidebar_label: 认证与安全
---
# 身份认证与安全实践

## 认证模型选型
- 会话（Session/Cookie）：适合传统 Web 与中间件校验。
- 令牌（JWT）：适合多端与无状态 API。
- OAuth/OIDC：对接第三方身份提供商（如企业 SSO）。

## 会话示例（简化）
- 在 Route Handler 中读写 Cookie：

```ts
// app/api/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const ok = username === "admin" && password === "123456";
  if (!ok) return NextResponse.json({ error: "invalid" }, { status: 401 });

  const res = NextResponse.json({ success: true });
  res.cookies.set("token", "session-token", { httpOnly: true, secure: true, sameSite: "lax" });
  return res;
}
```

在服务端组件读取 Cookie：

```ts
// app/dashboard/page.tsx
import { cookies } from "next/headers";

export default async function Dashboard() {
  const token = cookies().get("token")?.value;
  if (!token) return <div>请先登录</div>;
  return <div>欢迎回来</div>;
}
```

## 常见安全措施
- 使用 HttpOnly Cookie 存储会话，防止 XSS 读取。
- 重要接口做 CSRF 防护与来源校验。
- 输入校验与输出转义，避免注入与脚本注入。
- 对错误信息进行泛化，避免泄露内部实现。

## 中间件权限前置
- 在 middleware.ts 中提前拦截受限路由。

## 第三方方案
- 可集成成熟的认证库（如 NextAuth 等），简化多身份提供商对接。

## 推荐实践
- 认证与授权逻辑尽量置于服务端（Edge/Server），减少暴露面。
- 使用安全默认值（secure、sameSite、httpOnly），统一封装会话管理。
- 将敏感信息放在服务端组件/Action 中处理，客户端仅做展示。 
