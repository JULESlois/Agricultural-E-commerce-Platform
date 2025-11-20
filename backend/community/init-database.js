/**
 * 初始化数据库表
 * 运行: node init-db.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function initDatabase() {
  console.log('=================================');
  console.log('初始化数据库表');
  console.log('=================================');
  console.log(`数据库: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
  console.log('=================================\n');

  const client = await pool.connect();
  
  try {
    // 读取 SQL 文件
    const sqlFile = path.join(__dirname, 'database-schema-postgres.sql');
    console.log('读取 SQL 文件:', sqlFile);
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('开始执行 SQL 脚本...\n');
    
    // 执行 SQL
    await client.query(sql);
    
    console.log('✓ 数据库表创建成功！\n');
    
    // 验证表
    const tables = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename LIKE 'community_%'
      ORDER BY tablename
    `);
    
    console.log(`✓ 成功创建 ${tables.rows.length} 个表:`);
    tables.rows.forEach(row => {
      console.log(`  - ${row.tablename}`);
    });
    
    // 检查示例数据
    const categories = await client.query('SELECT COUNT(*) FROM community_categories');
    const tags = await client.query('SELECT COUNT(*) FROM community_tags');
    
    console.log('\n✓ 示例数据:');
    console.log(`  - 分类: ${categories.rows[0].count} 条`);
    console.log(`  - 标签: ${tags.rows[0].count} 条`);
    
    console.log('\n=================================');
    console.log('✓ 数据库初始化完成！');
    console.log('=================================');
    
  } catch (error) {
    console.error('\n✗ 初始化失败！');
    console.error('错误信息:', error.message);
    console.error('\n详细错误:');
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase();
