# prisma

# Prisma 常用命令与最佳实践

## 基础命令

### 初始化与设置
```bash
# 初始化 Prisma
npx prisma init

# 生成 Prisma Client
npx prisma generate

# 安装 Prisma Client
npm install @prisma/client
```

## 数据库操作命令

### 迁移相关
```bash
# 创建迁移（会生成 SQL 迁移文件）
npx prisma migrate dev --name init

# 部署迁移（生产环境使用）
npx prisma migrate deploy

# 重置数据库（删除所有数据并重新应用迁移）
npx prisma migrate reset
```

### 数据库查看与管理
```bash
# 启动 Prisma Studio（可视化数据库管理工具）
npx prisma studio

# 拉取数据库结构（从现有数据库生成 schema）
npx prisma db pull

# 推送 schema 更改到数据库（开发环境使用）
npx prisma db push
```

### 格式化与验证
```bash
# 格式化 schema 文件
npx prisma format

# 验证 schema 文件
npx prisma validate
```

### 数据填充 (Seed)
```bash
# 运行 seed 脚本
npx prisma db seed
```

#### 配置 Seed
1. 在 `package.json` 中添加 seed 配置：
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

2. 创建 seed 文件 `prisma/seed.ts`：
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 清理现有数据
  await prisma.user.deleteMany();
  
  // 创建基础数据
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      posts: {
        create: {
          title: 'Hello World',
          content: 'This is my first post!',
        },
      },
    },
  });

  // 批量创建数据
  const users = await prisma.user.createMany({
    data: [
      { email: 'bob@example.com', name: 'Bob' },
      { email: 'carol@example.com', name: 'Carol' },
    ],
  });

  console.log({ alice, users });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

#### Seed 使用技巧

1. **条件填充**
```typescript
async function seedUsers() {
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    // 只在没有用户时填充数据
    await prisma.user.createMany({
      data: [
        { email: 'admin@example.com', name: 'Admin', role: 'ADMIN' },
        { email: 'user@example.com', name: 'User', role: 'USER' },
      ],
    });
  }
}
```

2. **环境特定的 Seed**
```typescript
async function main() {
  if (process.env.NODE_ENV === 'development') {
    // 开发环境填充更多测试数据
    await seedDevelopmentData();
  } else {
    // 生产环境只填充必要的基础数据
    await seedProductionData();
  }
}
```

3. **关联数据填充**
```typescript
async function seedWithRelations() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      profile: {
        create: {
          bio: '测试用户简介',
          avatar: 'default.png',
        },
      },
      posts: {
        createMany: {
          data: [
            { title: '文章1', content: '内容1' },
            { title: '文章2', content: '内容2' },
          ],
        },
      },
    },
    include: {
      profile: true,
      posts: true,
    },
  });
}
```

4. **使用工厂函数**
```typescript
// 用户数据工厂
function createUserData(index: number) {
  return {
    email: `user${index}@example.com`,
    name: `User ${index}`,
    profile: {
      create: {
        bio: `用户 ${index} 的简介`,
      },
    },
  };
}

// 批量创建用户
async function seedManyUsers(count: number) {
  const users = Array.from({ length: count }, (_, i) => 
    createUserData(i + 1)
  );
  
  for (const userData of users) {
    await prisma.user.create({
      data: userData,
    });
  }
}
```

## 开发最佳实践

1. **数据库迁移流程**
   - 开发环境使用 `prisma migrate dev`
   - 测试环境使用 `prisma migrate reset`
   - 生产环境使用 `prisma migrate deploy`

2. **性能优化**
   - 使用 `select` 只获取需要的字段
   - 合理使用 `include` 避免 N+1 查询问题
   - 批量操作使用 `createMany`/`updateMany`
   - 适当使用索引提升查询性能

3. **数据安全**
   - 使用事务确保数据一致性
   - 设置适当的字段约束和验证
   - 使用环境变量管理数据库连接
   - 在生产环境谨慎使用 seed 功能

4. **开发工具使用**
   - 经常使用 `prisma studio` 查看数据
   - 使用 `prisma format` 保持 schema 格式统一
   - 定期验证 schema 确保正确性

5. **调试技巧**
   - 使用 Prisma 的调试日志
   ```typescript
   const prisma = new PrismaClient({
     log: ['query', 'info', 'warn', 'error'],
   });
   ```
   - 使用 `console.log` 查看生成的 SQL
   ```typescript
   prisma.$on('query', (e) => {
     console.log('Query: ' + e.query);
     console.log('Params: ' + e.params);
     console.log('Duration: ' + e.duration + 'ms');
   });
   ```

### Prisma vs TypeORM 主要区别

| 特点    | Prisma                                         | TypeORM                      |
| ----- | ---------------------------------------------- | ---------------------------- |
| 类型    | ORM + 自动生成客户端（Query Builder）                   | 传统 ORM，直接操作实体和仓库             |
| 设计理念  | Schema-first，先写 Prisma schema，自动生成代码           | Code-first，写实体类映射数据库         |
| 类型安全  | 类型极强，自动生成的客户端有完备 TS 类型                         | 类型支持较好，但需要手动维护实体类            |
| 数据库迁移 | 内置迁移机制（prisma migrate）                         | 迁移支持，但不如 Prisma 简单           |
| 查询构造  | 丰富的 API，链式调用，安全且直观                             | 支持 QueryBuilder 和 Repository |
| 社区和生态 | 越来越大，活跃且现代                                     | 老牌 ORM，社区稳定，兼容性好             |
| 支持数据库 | MySQL、PostgreSQL、SQLite、SQL Server、MongoDB（实验） | 多数主流关系数据库                    |

**简单总结**

- Prisma：更现代、更注重类型安全和开发体验，schema 定义清晰，自动生成操作数据库的客户端代码。
- TypeORM：更传统，实体类写在代码里，直接操作实体和仓库，适合习惯 ORM 传统写法的人。

