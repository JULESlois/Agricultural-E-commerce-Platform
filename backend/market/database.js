const { Pool } = require('pg');
const dbConfig = require('./dbconfig.json');

// 创建数据库连接池
const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.db,
  user: dbConfig.user,
  password: dbConfig.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 测试数据库连接
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('数据库连接成功');
    client.release();
  } catch (err) {
    console.error('数据库连接失败:', err);
  }
}

module.exports = { pool, testConnection };