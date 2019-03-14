---
sidebar_position: 7
title: 中间件与 Edge
sidebar_label: 中间件与 Edge
---
# 中间件与 Edge Runtime

## 中间件是什么
- 在请求到达路由前执行的函数，适合做鉴权、A/B 实验、重写/重定向等。
- 运行在边缘（Edge）环境，延迟更低。

## 基本使用
在项目根目录创建 middleware.ts：

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("token");
  if (!isLoggedIn && req.nextUrl.pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

## 重写与重定向
- 重写（rewrite）：更换实际响应来源而不改变 URL。
- 重定向（redirect）：改变用户可见的 URL。

```ts
// 重写示例
const url = new URL("/beta", req.url);
return NextResponse.rewrite(url);
```

## 读取请求上下文
- cookies：req.cookies.get("key")
- headers：req.headers.get("x-header")
- 地理信息：req.geo（在支持的环境下）

## Edge Runtime 注意事项
- 运行环境与 Node.js 略有差异，避免使用不支持的 Node API。
- 更适合轻量逻辑与快速路由决策，重任务放在服务端/后端。

## 推荐实践
- 用中间件进行权限前置判断与安全过滤。
- 在边缘进行 A/B 实验与区域路由分发，提升体验。
- 保持中间件快速、无阻塞，避免引入慢操作。 
