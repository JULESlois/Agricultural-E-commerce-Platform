# PostgreSQL 社区模块设置指南

## 快速开始

### 1. 安装 PostgreSQL

确保已安装 PostgreSQL 12 或更高版本。

### 2. 创建数据库

```bash
# 使用 psql 命令行工具
psql -U postgres

# 在 psql 中执行
CREATE DATABASE agricultural_platform;
\q
```

### 3. 安装依赖

```bash
cd backend/community
npm install
```

### 4. 配置环境变量

复制 `.env.example` 为 `.env`：
```bash
copy .env.example .env
```

编辑 `.env` 文件：
```env
PORT=3003
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=agricultural_platform
JWT_SECRET=your_jwt_secret_key
```

### 5. 初始化数据库表

```bash
psql -U postgres -d agricultural_platform -f database-schema-postgres.sql
```

### 6. 启动服务

```bash
npm run dev
```

## 数据库表结构

社区模块包含以下12张表：

1. **community_follows** - 关注关系表
2. **community_blacklist** - 黑名单表
3. **community_categories** - 内容分类表
4. **community_tags** - 标签表
5. **community_content** - 内容主表
6. **community_content_tags** - 内容标签关联表
7. **community_comments** - 评论表
8. **community_likes** - 点赞表
9. **community_collects** - 收藏表
10. **community_reports** - 举报表
11. **community_violations** - 违规记录表
12. **community_qa_relation** - 问答关系表

## PostgreSQL 特性

### 1. SERIAL 自增主键

PostgreSQL 使用 `SERIAL` 类型实现自增主键：
```sql
CREATE TABLE example (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);
```

### 2. 参数化查询

使用 `$1, $2, $3` 作为参数占位符：
```javascript
const result = await client.query(
  'SELECT * FROM users WHERE id = $1 AND name = $2',
  [userId, userName]
);
```

### 3. RETURNING 子句

插入数据时返回生成的ID：
```javascript
const result = await client.query(
  'INSERT INTO users (name) VALUES ($1) RETURNING id',
  [name]
);
const newId = result.rows[0].id;
```

### 4. 事务处理

```javascript
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO ...');
  await client.query('UPDATE ...');
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}
```

### 5. 触发器自动更新时间

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_time = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_table_updated_at 
BEFORE UPDATE ON table_name
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 常用 PostgreSQL 命令

### 连接数据库
```bash
psql -U postgres -d agricultural_platform
```

### 查看所有表
```sql
\dt
```

### 查看表结构
```sql
\d community_content
```

### 查看表数据
```sql
SELECT * FROM community_categories;
```

### 查看索引
```sql
\di
```

### 查看触发器
```sql
\dS
```

### 退出
```sql
\q
```

## 性能优化

### 1. 创建索引

数据库脚本已包含必要的索引，如需额外索引：
```sql
CREATE INDEX idx_custom ON table_name(column_name);
```

### 2. 分析表
```sql
ANALYZE community_content;
```

### 3. 清理表
```sql
VACUUM community_content;
```

### 4. 查看查询计划
```sql
EXPLAIN ANALYZE SELECT * FROM community_content WHERE author_id = 1;
```

## 备份与恢复

### 备份单个数据库
```bash
pg_dump -U postgres agricultural_platform > backup.sql
```

### 备份所有数据库
```bash
pg_dumpall -U postgres > all_backup.sql
```

### 恢复数据库
```bash
psql -U postgres agricultural_platform < backup.sql
```

## 监控与维护

### 查看活动连接
```sql
SELECT * FROM pg_stat_activity;
```

### 查看数据库大小
```sql
SELECT pg_size_pretty(pg_database_size('agricultural_platform'));
```

### 查看表大小
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 查看慢查询
```sql
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

## 故障排查

### 连接失败
1. 检查 PostgreSQL 服务是否运行
   ```bash
   # Windows
   services.msc
   
   # Linux
   sudo systemctl status postgresql
   ```

2. 检查端口是否正确（默认5432）
3. 检查 `pg_hba.conf` 配置
4. 检查防火墙设置

### 权限问题
```sql
-- 授予所有权限
GRANT ALL PRIVILEGES ON DATABASE agricultural_platform TO postgres;

-- 授予表权限
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;

-- 授予序列权限
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
```

### 密码认证失败
编辑 `pg_hba.conf` 文件，确保有以下配置：
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                md5
host    all             all             127.0.0.1/32            md5
```

## 开发建议

1. **使用连接池**: 已在 `config/database.js` 中配置
2. **参数化查询**: 防止 SQL 注入
3. **事务处理**: 确保数据一致性
4. **错误处理**: 捕获并记录所有数据库错误
5. **索引优化**: 为常用查询字段创建索引
6. **定期维护**: 定期执行 VACUUM 和 ANALYZE

## 参考文档

- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [node-postgres 文档](https://node-postgres.com/)
- [PostgreSQL 教程](https://www.postgresqltutorial.com/)
