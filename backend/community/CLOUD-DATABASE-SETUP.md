# 云数据库配置指南

## 数据库信息

本项目使用云端 PostgreSQL 数据库，配置信息如下：

```
主机地址: 82.157.154.143
端口: 5432
数据库名: agri
用户名: agri_root
密码: agri_root
```

## 快速配置

### 1. 环境变量配置

`.env` 文件已配置为云数据库：

```env
PORT=3003
DB_HOST=82.157.154.143
DB_PORT=5432
DB_USER=agri_root
DB_PASSWORD=agri_root
DB_NAME=agri
JWT_SECRET=your_jwt_secret_key
```

### 2. 连接测试

使用 psql 命令行工具测试连接：

```bash
psql -h 82.157.154.143 -p 5432 -U agri_root -d agri
```

输入密码: `agri_root`

### 3. 初始化数据库表

```bash
# 方式一：使用 psql 命令
psql -h 82.157.154.143 -p 5432 -U agri_root -d agri -f database-schema-postgres.sql

# 方式二：在 psql 客户端中
psql -h 82.157.154.143 -p 5432 -U agri_root -d agri
\i database-schema-postgres.sql
```

### 4. 启动服务

```bash
npm run dev
```

## 云数据库特点

### 优势
1. **无需本地安装**: 不需要在本地安装 PostgreSQL
2. **远程访问**: 可以从任何地方访问数据库
3. **数据共享**: 团队成员可以共享同一个数据库
4. **备份管理**: 云服务商通常提供自动备份

### 注意事项
1. **网络依赖**: 需要稳定的网络连接
2. **访问控制**: 确保IP白名单配置正确
3. **安全性**: 生产环境建议修改默认密码
4. **延迟**: 网络延迟可能影响响应速度

## 常用操作

### 连接数据库
```bash
psql -h 82.157.154.143 -p 5432 -U agri_root -d agri
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
SELECT * FROM community_categories LIMIT 10;
```

### 退出
```sql
\q
```

## 使用 Node.js 连接

代码已在 `config/database.js` 中配置：

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: '82.157.154.143',
  port: 5432,
  user: 'agri_root',
  password: 'agri_root',
  database: 'agri',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## 数据库管理工具

推荐使用以下工具管理云数据库：

### 1. pgAdmin
- 下载: https://www.pgadmin.org/download/
- 配置连接:
  - Host: 82.157.154.143
  - Port: 5432
  - Database: agri
  - Username: agri_root
  - Password: agri_root

### 2. DBeaver
- 下载: https://dbeaver.io/download/
- 支持多种数据库
- 免费开源

### 3. DataGrip (JetBrains)
- 功能强大的数据库IDE
- 需要付费或使用试用版

### 4. VS Code 插件
- PostgreSQL (Chris Kolkman)
- 直接在 VS Code 中管理数据库

## 故障排查

### 问题1: 连接超时
**原因**: 
- 网络问题
- 防火墙阻止
- 云数据库未启动

**解决方案**:
```bash
# 测试网络连通性
ping 82.157.154.143

# 测试端口是否开放
telnet 82.157.154.143 5432
# 或使用 PowerShell
Test-NetConnection -ComputerName 82.157.154.143 -Port 5432
```

### 问题2: 认证失败
**原因**: 
- 用户名或密码错误
- IP未加入白名单

**解决方案**:
- 确认用户名: `agri_root`
- 确认密码: `agri_root`
- 联系数据库管理员添加IP白名单

### 问题3: 权限不足
**原因**: 
- 用户权限不够

**解决方案**:
```sql
-- 授予所有权限（需要超级用户执行）
GRANT ALL PRIVILEGES ON DATABASE agri TO agri_root;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO agri_root;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO agri_root;
```

### 问题4: 表已存在
**原因**: 
- 重复执行建表脚本

**解决方案**:
```sql
-- 删除所有社区模块表（谨慎操作！）
DROP TABLE IF EXISTS community_qa_relation CASCADE;
DROP TABLE IF EXISTS community_violations CASCADE;
DROP TABLE IF EXISTS community_reports CASCADE;
DROP TABLE IF EXISTS community_collects CASCADE;
DROP TABLE IF EXISTS community_likes CASCADE;
DROP TABLE IF EXISTS community_comments CASCADE;
DROP TABLE IF EXISTS community_content_tags CASCADE;
DROP TABLE IF EXISTS community_content CASCADE;
DROP TABLE IF EXISTS community_tags CASCADE;
DROP TABLE IF EXISTS community_categories CASCADE;
DROP TABLE IF EXISTS community_blacklist CASCADE;
DROP TABLE IF EXISTS community_follows CASCADE;

-- 然后重新执行建表脚本
\i database-schema-postgres.sql
```

## 性能优化

### 1. 连接池配置
已在 `config/database.js` 中配置连接池：
- 最大连接数: 10
- 空闲超时: 30秒
- 连接超时: 2秒

### 2. 查询优化
```sql
-- 查看慢查询
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- 分析查询计划
EXPLAIN ANALYZE SELECT * FROM community_content WHERE author_id = 1;
```

### 3. 索引优化
数据库脚本已包含必要的索引，如需添加：
```sql
CREATE INDEX idx_custom ON table_name(column_name);
```

## 备份与恢复

### 备份数据库
```bash
pg_dump -h 82.157.154.143 -p 5432 -U agri_root -d agri > backup_$(date +%Y%m%d).sql
```

### 恢复数据库
```bash
psql -h 82.157.154.143 -p 5432 -U agri_root -d agri < backup_20251107.sql
```

### 仅备份社区模块表
```bash
pg_dump -h 82.157.154.143 -p 5432 -U agri_root -d agri \
  -t community_follows \
  -t community_blacklist \
  -t community_categories \
  -t community_tags \
  -t community_content \
  -t community_content_tags \
  -t community_comments \
  -t community_likes \
  -t community_collects \
  -t community_reports \
  -t community_violations \
  -t community_qa_relation \
  > community_backup.sql
```

## 安全建议

1. **生产环境**: 修改默认密码
2. **IP白名单**: 限制访问IP范围
3. **SSL连接**: 启用SSL加密连接
4. **定期备份**: 设置自动备份计划
5. **监控告警**: 配置数据库监控和告警

## 监控数据库

### 查看连接数
```sql
SELECT count(*) FROM pg_stat_activity;
```

### 查看数据库大小
```sql
SELECT pg_size_pretty(pg_database_size('agri'));
```

### 查看表大小
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public' AND tablename LIKE 'community_%'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 查看活动查询
```sql
SELECT pid, usename, application_name, client_addr, state, query
FROM pg_stat_activity
WHERE datname = 'agri';
```

## 联系支持

如遇到数据库相关问题：
1. 检查网络连接
2. 查看错误日志
3. 参考本文档故障排查部分
4. 联系数据库管理员

## 相关文档

- [POSTGRESQL-SETUP.md](./POSTGRESQL-SETUP.md) - PostgreSQL 通用设置指南
- [POSTGRESQL-MIGRATION.md](./POSTGRESQL-MIGRATION.md) - MySQL 迁移指南
- [QUICK-START.md](./QUICK-START.md) - 快速启动指南
