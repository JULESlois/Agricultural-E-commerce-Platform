# PostgreSQL 迁移指南

## 概述

社区模块已从 MySQL 迁移到 PostgreSQL。本文档说明主要变更和迁移步骤。

## 主要变更

### 1. 数据库驱动
- **旧**: `mysql2` (^3.6.5)
- **新**: `pg` (^8.11.3)

### 2. SQL 语法差异

#### 自增主键
**MySQL**:
```sql
`id` INT AUTO_INCREMENT PRIMARY KEY
```

**PostgreSQL**:
```sql
id SERIAL PRIMARY KEY
```

#### 参数占位符
**MySQL**:
```sql
SELECT * FROM users WHERE id = ?
```

**PostgreSQL**:
```sql
SELECT * FROM users WHERE id = $1
```

#### 模糊查询
**MySQL**:
```sql
WHERE name LIKE ?  -- 区分大小写
```

**PostgreSQL**:
```sql
WHERE name ILIKE $1  -- 不区分大小写
```

#### 返回插入的ID
**MySQL**:
```javascript
const [result] = await connection.query('INSERT INTO ...');
const id = result.insertId;
```

**PostgreSQL**:
```javascript
const result = await client.query('INSERT INTO ... RETURNING id');
const id = result.rows[0].id;
```

#### 影响的行数
**MySQL**:
```javascript
const [result] = await connection.query('DELETE FROM ...');
const count = result.affectedRows;
```

**PostgreSQL**:
```javascript
const result = await client.query('DELETE FROM ...');
const count = result.rowCount;
```

#### 查询结果
**MySQL**:
```javascript
const [rows] = await connection.query('SELECT ...');
rows.forEach(row => console.log(row));
```

**PostgreSQL**:
```javascript
const result = await client.query('SELECT ...');
result.rows.forEach(row => console.log(row));
```

### 3. 连接管理

#### MySQL
```javascript
const connection = await db.getConnection();
try {
  // 操作
} finally {
  connection.release();
}
```

#### PostgreSQL
```javascript
const client = await db.connect();
try {
  // 操作
} finally {
  client.release();
}
```

### 4. 事务处理

#### MySQL
```javascript
await connection.beginTransaction();
try {
  // 操作
  await connection.commit();
} catch (error) {
  await connection.rollback();
}
```

#### PostgreSQL
```javascript
await client.query('BEGIN');
try {
  // 操作
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
}
```

### 5. 数据类型映射

| MySQL | PostgreSQL |
|-------|-----------|
| TINYINT | SMALLINT |
| INT | INTEGER |
| BIGINT | BIGINT |
| VARCHAR(n) | VARCHAR(n) |
| TEXT | TEXT |
| DECIMAL(m,n) | DECIMAL(m,n) |
| TIMESTAMP | TIMESTAMP |
| DATETIME | TIMESTAMP |

### 6. 触发器和自动更新

**MySQL**:
```sql
`update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**PostgreSQL**:
```sql
update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- 需要创建触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_time = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为表添加触发器
CREATE TRIGGER update_table_updated_at 
BEFORE UPDATE ON table_name
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 迁移步骤

### 1. 安装 PostgreSQL

**Windows**:
- 下载安装包: https://www.postgresql.org/download/windows/
- 运行安装程序，设置密码

**Linux**:
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

**macOS**:
```bash
brew install postgresql
brew services start postgresql
```

### 2. 创建数据库

```bash
# 登录 PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE agricultural_platform;

# 退出
\q
```

### 3. 更新依赖

```bash
cd backend/community
npm uninstall mysql2
npm install pg@^8.11.3
```

### 4. 更新环境变量

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

### 5. 执行数据库脚本

```bash
psql -U postgres -d agricultural_platform -f database-schema-postgres.sql
```

### 6. 验证迁移

启动服务：
```bash
npm run dev
```

测试API：
```bash
curl http://localhost:3003/
curl http://localhost:3003/api/community/categories/tree
```

## PostgreSQL 特性优势

1. **更强大的数据类型**: JSON, JSONB, Array, UUID等
2. **更好的并发控制**: MVCC机制
3. **完整的ACID支持**: 更可靠的事务处理
4. **强大的全文搜索**: 内置全文搜索功能
5. **更好的性能**: 复杂查询性能更优
6. **开源免费**: 完全开源，无商业限制

## 常见问题

### Q1: 如何查看 PostgreSQL 版本？
```bash
psql --version
```

### Q2: 如何重置 PostgreSQL 密码？
```bash
# 编辑 pg_hba.conf，将 md5 改为 trust
# 重启 PostgreSQL 服务
# 登录并修改密码
psql -U postgres
ALTER USER postgres PASSWORD 'new_password';
# 将 pg_hba.conf 改回 md5
# 重启服务
```

### Q3: 如何备份和恢复数据库？
```bash
# 备份
pg_dump -U postgres agricultural_platform > backup.sql

# 恢复
psql -U postgres agricultural_platform < backup.sql
```

### Q4: 如何查看所有表？
```bash
psql -U postgres -d agricultural_platform
\dt
```

### Q5: 如何查看表结构？
```bash
\d table_name
```

## 性能优化建议

1. **创建适当的索引**
   ```sql
   CREATE INDEX idx_content_author ON community_content(author_id);
   ```

2. **使用连接池**
   - 已在 `config/database.js` 中配置

3. **定期 VACUUM**
   ```sql
   VACUUM ANALYZE community_content;
   ```

4. **监控慢查询**
   ```sql
   -- 启用慢查询日志
   ALTER SYSTEM SET log_min_duration_statement = 1000;
   SELECT pg_reload_conf();
   ```

## 参考资源

- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [node-postgres 文档](https://node-postgres.com/)
- [PostgreSQL vs MySQL](https://www.postgresql.org/about/)
