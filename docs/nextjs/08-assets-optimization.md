---
sidebar_position: 9
title: 资源优化
sidebar_label: 资源优化
---
# 图片、字体与脚本优化

## 图片优化（next/image）
- 自动响应式与懒加载，减少带宽消耗。

```tsx
import Image from "next/image";
export default function Hero() {
  return (
    <Image
      src="https://images.example.com/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority
    />
  );
}
```

## 字体优化（next/font）
- 内联字体与可控子集，减少 FOUT。

```tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
export default function Page() {
  return <div className={inter.className}>文本</div>;
}
```

## 脚本加载（next/script）
- 控制加载策略，避免阻塞渲染。

```tsx
import Script from "next/script";
export default function Page() {
  return (
    <>
      <Script src="https://cdn.example.com/analytics.js" strategy="afterInteractive" />
    </>
  );
}
```

## 动态导入
- 按需加载客户端组件，降低初始 JS。

```tsx
"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("./Chart"), { ssr: false });
export default function Page() {
  return <Chart />;
}
```

## 推荐实践
- 为首屏关键图片使用 priority，其他图片保持懒加载。
- 使用 next/font 管理品牌字体，避免第三方阻塞。
- 为非关键脚本设置合理的加载策略（afterInteractive、lazyOnload）。 
