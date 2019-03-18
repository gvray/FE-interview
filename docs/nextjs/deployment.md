---
sidebar_position: 11
title: 部署与运维
sidebar_label: 部署与运维
---
# 部署与运维（Vercel/自托管）

## Vercel 部署
- 连接仓库，一键部署，默认开启边缘网络与缓存策略。
- 环境变量在 Vercel 控制台配置，按环境区分。
- 利用预览环境（Preview）进行 PR 验证与回归测试。

## 自托管（Node 运行）
- 生成可独立运行的构建：

```js
// next.config.js
module.exports = { output: "standalone" };
```

构建并运行：

```bash
npm run build
npm run start
```

## Docker 示例
简化容器化部署：

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
```

## 监控与日志
- 使用 instrumentation.ts 注册 APM/错误上报。
- 按环境区分日志级别与采样率，避免噪声。

## 推荐实践
- 优先使用托管平台（如 Vercel）享受边缘加速与原生集成。
- 在自托管环境开启 output: "standalone"，简化部署体积。
- 完善环境配置与监控，确保稳定性与可观测性。 
