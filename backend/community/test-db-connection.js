/**
 * 简单的数据库连接测试
 */

const sequelize = require('./config/sequelize');

async function testConnection() {
  try {
    console.log('🔍 测试数据库连接...\n');
    
    await sequelize.authenticate();
    
    console.log('✅ 数据库连接成功！\n');
    
    // 测试简单查询
    const [results] = await sequelize.query('SELECT NOW() as current_time');
    console.log('📅 数据库时间:', results[0].current_time);
    
    // 测试表是否存在
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'community_%'
      ORDER BY table_name
    `);
    
    console.log('\n📋 社区相关表:');
    tables.forEach(t => console.log('   -', t.table_name));
    
    console.log('\n🎉 数据库连接测试完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    console.error('\n详细错误:', error);
    process.exit(1);
  }
}

testConnection();