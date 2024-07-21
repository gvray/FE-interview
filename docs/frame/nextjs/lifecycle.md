---
title: 渲染与请求生命周期
sidebar_label: 生命周期
sidebar_position: 13
---
# 生命周期

模块初始化、依赖注入、拦截器、过滤器、守卫等完整执行过程。

------

## 🧩 一、启动阶段（应用初始化阶段）

```latex
bootstrap()                  ← main.ts 入口文件
   │
   ├─> 创建 NestApplication 实例
   │
   ├─> 解析 AppModule 中的 imports / providers / controllers
   │      │
   │      ├─> imports: 加载其他模块（递归解析）
   │      ├─> providers: 注册依赖（注入容器）
   │      └─> controllers: 创建路由控制器
   │
   ├─> 执行各模块的 onModuleInit()
   │
   ├─> 执行各模块的 onApplicationBootstrap()
   │
   └─> 应用开始监听端口 (app.listen)
```

------

## 🚦 二、请求阶段（单次请求的执行流程）

当有一个请求进入时，NestJS 会按照以下顺序执行：

```latex
请求进来
│
├── 全局中间件（Middleware）
│
├── 守卫（Guards）        ← 校验是否允许进入，比如 JWT 验证
│
├── 拦截器 before (Interceptors - before)
│       ↓
│       控制器 (Controller)
│           ↓
│           服务层 (Service)
│       ↑
│   拦截器 after (Interceptors - after)
│
├── 异常过滤器 (Filters) ← 捕获执行链中抛出的异常
│
└── 响应给客户端
```

------

## ⚙️ 三、模块生命周期钩子（Module Lifecycle Hooks）

| 生命周期钩子                  | 所在接口                    | 触发时机             | 常用场景               |
| ----------------------------- | --------------------------- | -------------------- | ---------------------- |
| `onModuleInit()`              | `OnModuleInit`              | 模块依赖解析完成后   | 初始化连接池、加载缓存 |
| `onApplicationBootstrap()`    | `OnApplicationBootstrap`    | 整个应用初始化完成后 | 启动后的一些准备工作   |
| `onModuleDestroy()`           | `OnModuleDestroy`           | 应用关闭时           | 模块销毁时清理资源     |
| `beforeApplicationShutdown()` | `BeforeApplicationShutdown` | 关闭前执行（可异步） | 优雅关闭数据库连接     |
| `onApplicationShutdown()`     | `OnApplicationShutdown`     | 应用完全关闭         | 清理临时文件、日志等   |

------

## 🔄 四、Provider 生命周期钩子（类级别）

每个 `@Injectable()` 的类也可以实现类似钩子：

| 生命周期钩子              | 触发时机             |
| ------------------------- | -------------------- |
| `onModuleInit()`          | 当所在模块被初始化时 |
| `onApplicationShutdown()` | 应用关闭时调用       |

例如一个数据库服务 `PrismaService` 就常常实现这两个：

```typescript
export class PrismaService implements OnModuleInit, OnApplicationShutdown {
  async onModuleInit() {
    await this.$connect();
  }
  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
```

------

## 🧠 五、拦截器 / 守卫 / 过滤器 生命周期顺序

```latex
1️⃣ 全局守卫（APP_GUARD）
2️⃣ 控制器守卫
3️⃣ 路由守卫
4️⃣ 全局拦截器（APP_INTERCEPTOR）
5️⃣ 控制器拦截器
6️⃣ 路由拦截器
7️⃣ 执行控制器方法
8️⃣ 捕获异常 → 全局过滤器（APP_FILTER）
```

------

## 📊 六、整体执行时序图（汇总版）

```latex
bootstrap()
 ├─ AppModule 初始化
 │    ├─ imports -> 加载依赖模块
 │    ├─ providers -> 注册服务
 │    ├─ controllers -> 注册控制器
 │    └─ onModuleInit()
 │
 ├─ 全部模块加载完
 │    └─ onApplicationBootstrap()
 │
 ├─> app.listen()
 │
 ▼
=== 请求进入 ===
 ├─ Middleware
 ├─ Guard
 ├─ Interceptor (before)
 ├─ Controller
 ├─ Service
 ├─ Interceptor (after)
 ├─ ExceptionFilter (if error)
 └─ 返回响应
```

------

## 🧩 七、应用关闭阶段

```latex
app.close()
 ├─ beforeApplicationShutdown()
 ├─ onModuleDestroy()
 ├─ onApplicationShutdown()
 └─ 进程退出
```

# 请求处理生命周期的流程图示

请求进入 HTTP 服务

​        │

​        ▼

┌─────────────────────┐

│  1. 中间件 (Middleware)  │  -- 请求预处理，类似 Express，路由匹配前执行

└─────────────────────┘

​        │

​        ▼

┌─────────────────────┐

│  2. 路由匹配 (Router)    │  -- 根据请求路径和方法匹配 Controller 和方法

└─────────────────────┘

​        │

​        ▼

┌───────────────────────────┐

│  3. 守卫 (Guard)             │  -- 权限验证，控制请求是否继续，类似“前置通知”

│      - canActivate()         │

└───────────────────────────┘

​        │

​        ▼

┌───────────────────────────┐

│  4. 管道 (Pipe)               │  -- 参数验证和转换，作用于请求参数（Body, Query, Params）

│      - transform()           │

│      - validate()            │

└───────────────────────────┘

​        │

​        ▼

┌───────────────────────────┐

│  5. 拦截器 (Interceptor)       │  -- 环绕通知（Around Advice），前置和后置操作

│      - 请求前操作             │

│      - 调用 Controller 方法     │

│      - 请求后操作（包装响应）   │

└───────────────────────────┘

​        │

​        ▼

┌───────────────────────────┐

│  6. 控制器方法 (Controller)     │  -- 业务逻辑处理，返回结果或抛异常

└───────────────────────────┘

​        │

​        ▼

┌───────────────────────────┐

│  7. 异常过滤器 (Exception Filter) │  -- 捕获并处理控制器或管道抛出的异常

│      - catch()               │

│      - 格式化错误响应          │

└───────────────────────────┘

​        │

​        ▼

┌───────────────────────────┐

│  8. 发送响应给客户端             │

└───────────────────────────┘
