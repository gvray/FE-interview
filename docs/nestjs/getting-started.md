# NestJS 入门指南

## 项目介绍

NestJS 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的渐进式框架。它使用 TypeScript 构建，并结合了 OOP（面向对象编程）、FP（函数式编程）和 FRP（函数式响应式编程）的元素。

## 快速开始

### 环境准备
```bash
# 安装 NestJS CLI
pnpm add -g @nestjs/cli

# 创建新项目
nest new project-name --package-manager pnpm
```

### 项目运行

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run start:dev

# 生产模式
pnpm run start:prod

# 调试模式
pnpm run start:debug
```

### 测试命令
```bash
# 单元测试
pnpm run test

# 端到端测试
pnpm run test:e2e

# 测试覆盖率
pnpm run test:cov
```

## 项目结构

### 标准结构
```
src/
├── config/                 # 配置文件目录
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── swagger.config.ts
├── core/                   # 核心模块
│   ├── decorators/        # 自定义装饰器
│   ├── filters/           # 全局过滤器
│   ├── guards/            # 全局守卫
│   ├── interceptors/      # 全局拦截器
│   └── middlewares/       # 全局中间件
├── modules/               # 业务模块
│   ├── auth/             # 认证模块
│   ├── users/            # 用户模块
│   └── roles/            # 角色模块
├── shared/               # 共享模块
│   ├── constants/        # 常量定义
│   ├── dtos/            # 数据传输对象
│   ├── interfaces/       # 接口定义
│   └── utils/           # 工具函数
├── prisma/              # Prisma 相关
│   ├── migrations/      # 数据库迁移文件
│   └── schema.prisma    # Prisma Schema
└── main.ts             # 应用程序入口文件
```

### DDD架构（可选）
```
src/
├── application/          # 应用层
│   ├── auth/            # 认证相关
│   │   ├── commands/    # 命令（写操作）
│   │   ├── queries/     # 查询（读操作）
│   │   └── dtos/        # 数据传输对象
│   └── user/
├── domain/              # 领域层
│   ├── entities/        # 领域实体
│   ├── repositories/    # 仓储接口
│   ├── services/        # 领域服务
│   └── events/         # 领域事件
├── infrastructure/      # 基础设施层
│   ├── config/         # 配置
│   ├── persistence/    # 持久化
│   └── common/         # 通用功能
└── interfaces/          # 接口层
    ├── http/           # HTTP 接口
    └── graphql/        # GraphQL 接口
```

## 配置文件

### 项目配置文件
```
├── .env                # 环境变量
├── .env.development   # 开发环境变量
├── .env.production    # 生产环境变量
├── .eslintrc.js      # ESLint 配置
├── .prettierrc       # Prettier 配置
├── nest-cli.json     # NestJS CLI 配置
├── package.json      # 项目依赖
└── tsconfig.json     # TypeScript 配置
```

### 环境变量示例
```env
# 应用配置
APP_PORT=3000
APP_ENV=development

# 数据库配置
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# JWT配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 开发工具

### VS Code 调试配置
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "args": ["${workspaceFolder}/src/main.ts"],
      "runtimeArgs": ["--nolazy", "-r", "ts-node/register"],
      "sourceMaps": true,
      "cwd": "${workspaceRoot}",
      "envFile": "${workspaceFolder}/.env.development"
    }
  ]
}
```

### 推荐的 VS Code 插件
- ESLint
- Prettier
- REST Client
- Thunder Client
- Prisma
- Jest Runner

## 最佳实践

### 1. 模块开发规范
- 每个模块独立维护自己的路由、服务和控制器
- 使用依赖注入管理模块间关系
- 通过共享模块复用功能

### 2. 异常处理
```typescript
// 全局异常过滤器
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception instanceof Error ? exception.message : '服务器错误'
    });
  }
}
```

### 3. 请求验证
```typescript
// DTO 验证
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

### 4. 中间件使用
```typescript
// 日志中间件
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }
}
```

## 常见问题解决

### 1. 性能优化
- 使用 `@nestjs/cache-manager` 实现缓存
- 合理使用数据库索引
- 实现请求限流

### 2. 安全措施
- 使用 Helmet 中间件
- 实现 CORS 配置
- 使用 Rate Limiting
- 加密敏感数据

### 3. 部署注意事项
- 使用 PM2 进行进程管理
- 配置健康检查接口
- 实现优雅关闭
- 做好日志管理

## 有用链接

- [官方文档](https://docs.nestjs.com)
- [API 参考](https://docs.nestjs.com/api)
- [示例项目](https://github.com/nestjs/nest/tree/master/sample)
- [视频教程](https://courses.nestjs.com)
- [Discord 社区](https://discord.gg/G7Qnnhy)
