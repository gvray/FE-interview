# 快速开始

```
npm add -g @nestjs/cli
```

 ```
 nest new nest-admin --package-manager pnpm --skip-git
 ```

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
│   ├── roles/            # 角色模块
│   └── permissions/      # 权限模块
├── shared/               # 共享模块
│   ├── constants/        # 常量定义
│   ├── dtos/            # 数据传输对象
│   ├── interfaces/       # 接口定义
│   └── utils/           # 工具函数
├── prisma/              # Prisma 相关
│   ├── migrations/      # 数据库迁移文件
│   └── schema.prisma    # Prisma Schema
└── main.ts             # 应用程序入口文件

# 根目录其他文件
├── .env                # 环境变量
├── .env.development   # 开发环境变量
├── .env.production    # 生产环境变量
├── .eslintrc.js      # ESLint 配置
├── .prettierrc       # Prettier 配置
├── nest-cli.json     # NestJS CLI 配置
├── package.json      # 项目依赖
├── tsconfig.json     # TypeScript 配置
└── README.md         # 项目文档
```

```
src/
├── application/          # 应用层，处理业务逻辑
│   ├── auth/            # 认证相关
│   │   ├── commands/    # 命令（写操作）
│   │   ├── queries/     # 查询（读操作）
│   │   └── dtos/        # 数据传输对象
│   ├── user/
│   ├── role/
│   └── permission/
│
├── domain/              # 领域层，核心业务逻辑
│   ├── entities/        # 领域实体
│   ├── repositories/    # 仓储接口
│   ├── services/        # 领域服务
│   └── events/         # 领域事件
│
├── infrastructure/      # 基础设施层
│   ├── config/         # 配置
│   │   ├── database/
│   │   ├── cache/
│   │   └── queue/
│   ├── persistence/    # 持久化
│   │   ├── prisma/     # Prisma 配置和模型
│   │   └── repositories/  # 仓储实现
│   ├── common/         # 通用功能
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── middlewares/
│   └── utils/          # 工具类
│
├── interfaces/          # 接口层
│   ├── http/           # HTTP 接口
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   └── validations/
│   └── graphql/        # GraphQL 接口（如果需要）
│
├── shared/             # 共享模块
│   ├── constants/      # 常量定义
│   ├── types/         # 类型定义
│   └── enums/         # 枚举定义
│
└── main.ts            # 应用程序入口

# 项目根目录
├── docs/              # 项目文档
│   ├── api/          # API 文档
│   └── guides/       # 开发指南
├── test/             # 测试
│   ├── e2e/         # 端到端测试
│   └── unit/        # 单元测试
├── scripts/          # 构建、部署脚本
├── .env.example      # 环境变量示例
├── .env             # 本地环境变量
├── .env.test        # 测试环境变量
├── .env.production  # 生产环境变量
└── package.json
```