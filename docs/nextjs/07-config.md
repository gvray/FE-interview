---
sidebar_position: 8
title: 配置与环境变量
sidebar_label: 配置与环境变量
---
# 配置与环境变量 next.config

## next.config.js
常见配置示例：

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.example.com" },
    ],
  },
  redirects: async () => [
    { source: "/old", destination: "/new", permanent: true },
  ],
  rewrites: async () => [
    { source: "/docs/:path*", destination: "https://docs.example.com/:path*" },
  ],
  experimental: {
    // 根据需要开启实验特性
  },
};
module.exports = nextConfig;
```

## 环境变量
- .env.local：本地开发
- .env.production：生产环境
- 约定：
  - NEXT_PUBLIC_ 前缀的变量可在客户端读取。
  - 其他变量仅在服务端可用。

```env
NEXT_PUBLIC_API_BASE=https://api.example.com
SECRET_KEY=xxxx
```

## 构建输出与自托管
- 输出独立可运行的构建：

```js
// next.config.js
module.exports = {
  output: "standalone",
};
```

## 监控与埋点
- 使用 instrumentation.ts 统一初始化监控：

```ts
// instrumentation.ts
export async function register() {
  // 初始化 APM/错误上报/性能指标
}
```

## 推荐实践
- 将环境变量分类管理，敏感信息仅服务端读取。
- 使用 standalone 输出简化容器与自托管部署。
- 在 experimental 下谨慎启用实验能力，关注版本说明。 
