const { Pool } = require('pg');
const dbConfig = require('./dbconfig.json');

// 创建数据库连接池
const pool = new Pool({
  host: process.env.PG_HOST || dbConfig.host,
  port: Number(process.env.PG_PORT || dbConfig.port),
  database: process.env.PG_DB || dbConfig.db,
  user: process.env.PG_USER || dbConfig.user,
  password: process.env.PG_PASSWORD || dbConfig.password,
  max: Number(process.env.PG_POOL_MAX || 5),
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS || 10000),
  connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT_MS || 2000),
  application_name: process.env.PG_APP_NAME || 'agri-platform-node',
  allowExitOnIdle: true,
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
