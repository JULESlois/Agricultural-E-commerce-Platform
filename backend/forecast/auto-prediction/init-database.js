const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 创建数据库连接池
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('开始初始化数据库...');
    
    // 读取SQL文件
    const sqlFile = path.join(__dirname, 'database-schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // 执行SQL
    await client.query(sql);
    
    console.log('✓ 数据库表创建成功');
    console.log('✓ 索引创建成功');
    console.log('数据库初始化完成！');
    
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// 执行初始化
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { initDatabase };
