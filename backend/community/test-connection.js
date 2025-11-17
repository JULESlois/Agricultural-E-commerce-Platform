/**
 * 测试云数据库连接
 * 运行: node test-connection.js
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function testConnection() {
  console.log('=================================');
  console.log('测试云数据库连接');
  console.log('=================================');
  console.log(`主机: ${process.env.DB_HOST}`);
  console.log(`端口: ${process.env.DB_PORT}`);
  console.log(`数据库: ${process.env.DB_NAME}`);
  console.log(`用户: ${process.env.DB_USER}`);
  console.log('=================================\n');

  try {
    console.log('正在连接数据库...');
    const client = await pool.connect();
    console.log('✓ 数据库连接成功！\n');

    // 测试查询
    console.log('执行测试查询...');
    const result = await client.query('SELECT version()');
    console.log('✓ 查询成功！');
    console.log(`PostgreSQL 版本: ${result.rows[0].version}\n`);

    // 检查社区模块表是否存在
    console.log('检查社区模块表...');
    const tables = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename LIKE 'community_%'
      ORDER BY tablename
    `);

    if (tables.rows.length > 0) {
      console.log(`✓ 找到 ${tables.rows.length} 个社区模块表:`);
      tables.rows.forEach(row => {
        console.log(`  - ${row.tablename}`);
      });
    } else {
      console.log('⚠ 未找到社区模块表，请执行 database-schema-postgres.sql');
    }

    // 测试示例数据
    if (tables.rows.length > 0) {
      console.log('\n检查示例数据...');
      const categories = await client.query('SELECT COUNT(*) FROM community_categories');
      const tags = await client.query('SELECT COUNT(*) FROM community_tags');
      
      console.log(`✓ 分类数量: ${categories.rows[0].count}`);
      console.log(`✓ 标签数量: ${tags.rows[0].count}`);
    }

    client.release();
    console.log('\n=================================');
    console.log('✓ 所有测试通过！');
    console.log('=================================');
    
  } catch (error) {
    console.error('\n✗ 连接失败！');
    console.error('错误信息:', error.message);
    console.error('\n请检查:');
    console.error('1. 网络连接是否正常');
    console.error('2. .env 文件配置是否正确');
    console.error('3. 云数据库是否允许您的IP访问');
    console.error('4. 数据库服务是否正常运行');
    console.error('\n详细错误:');
    console.error(error);
  } finally {
    await pool.end();
    process.exit();
  }
}

testConnection();
