# Prisma 命令

| **场景**   | **命令**                                                  | **作用 / 说明**                                                                 | **注意事项 / 常用场景**            |
| -------- | ------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------- |
| **本地开发** | `npx prisma generate`                                   | 根据 `schema.prisma` 生成/更新 Prisma Client                                      | schema 改动后必须执行             |
|          | `npx prisma migrate dev --name <migration_name>`        | 检测 schema 差异 → 生成迁移文件 → 执行 SQL → 更新 `_prisma_migrations` → 更新 Prisma Client | 每次本地改表/字段都用                |
|          | `npx prisma migrate reset`                              | 重置数据库：删除所有表 + `_prisma_migrations` → 按 migrations 文件夹重建 → 可执行 seed          | 清理脏数据或验证迁移                 |
|          | `npx prisma db push`                                    | 将 `schema.prisma` 推送到数据库（不生成迁移文件）                                           | 临时同步表结构，快速开发               |
|          | `npx prisma db pull`                                    | 从现有数据库拉取 schema 更新 `schema.prisma`                                          | 对接已有数据库                    |
|          | `npx prisma studio`                                     | 打开可视化数据管理界面                                                                 | 查看/编辑数据                    |
|          | `npx prisma migrate status`                             | 查看数据库与 migrations 文件夹差异                                                     | 确认同步情况                     |
|          | `npx prisma format`                                     | 格式化 `schema.prisma`                                                         | 保持 schema 规范               |
|          | `npx prisma validate`                                   | 校验 `schema.prisma` 语法                                                       | 检查语法或字段类型错误                |
|          | `npx prisma migrate resolve --applied <migration_name>` | 标记迁移为已执行                                                                    | 修复数据库迁移状态不一致               |
|          | `npx prisma migrate diff`                               | 对比两个数据库或 schema 的差异                                                         | 生成手动 SQL 或查看变动             |
| **生产部署** | `npx prisma migrate deploy`                             | 按 migrations 文件夹顺序执行 SQL，不生成新迁移                                             | 切勿使用 `dev`，生产库不能自动生成迁移     |
|          | `npx prisma generate`                                   | 生成/更新 Prisma Client                                                         | 部署前保证 Client 与最新 schema 同步 |
