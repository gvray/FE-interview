# 常用命令

## 安装 CLI

```bash
npm install -g @nestjs/cli
```

## 项目相关

### 创建新项目
```bash
# 创建新项目
nest new project-name

# 使用特定包管理器
nest new project-name --package-manager npm
nest new project-name --package-manager yarn
nest new project-name --package-manager pnpm
```

### 运行项目
```bash
# 开发模式运行
npm run start

# 监听模式运行
npm run start:dev

# 生产模式运行
npm run start:prod
```

## 代码生成

### 生成模块
```bash
nest g module users
```

### 生成控制器
```bash
nest g controller users
nest g controller users/profile # 生成子目录控制器
```

### 生成服务
```bash
nest g service users
nest g service users/auth
```

### 生成资源（CRUD）
```bash
# 生成完整的 CRUD 资源
nest g resource users

# 选项：
# --no-spec 不生成测试文件
# --flat 不创建目录
nest g resource users --no-spec --flat
```

### 其他生成命令
```bash
# 生成中间件
nest g middleware logger

# 生成拦截器
nest g interceptor transform

# 生成管道
nest g pipe validation

# 生成守卫
nest g guard auth

# 生成装饰器
nest g decorator roles
```

## 构建与测试

### 构建项目
```bash
# 构建项目
npm run build

# 构建并监听变化
npm run build:watch
```

### 运行测试
```bash
# 运行单元测试
npm run test

# 监听模式运行测试
npm run test:watch

# 运行端到端测试
npm run test:e2e

# 测试覆盖率
npm run test:cov
```

## 调试命令

### 开发调试
```bash
# 使用 Node.js 调试器运行
npm run start:debug
```

### 其他实用命令
```bash
# 格式化代码
npm run format

# 运行 lint
npm run lint

# 自动修复 lint 问题
npm run lint:fix
```

## 最佳实践

1. **使用资源生成器**
   - 使用 `nest g resource` 快速生成完整的 CRUD 功能
   - 根据需要选择 REST API 或 GraphQL
   - 自动生成测试文件和类型定义

2. **开发流程建议**
   - 使用 `start:dev` 进行开发
   - 定期运行测试确保功能正常
   - 提交代码前运行 lint 和格式化

3. **调试技巧**
   - 使用 `start:debug` 配合 VS Code 调试
   - 设置断点进行调试
   - 查看详细的运行时信息

