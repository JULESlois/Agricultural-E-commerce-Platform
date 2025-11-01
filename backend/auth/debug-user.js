const { pool } = require('../market/database');
const bcrypt = require('bcrypt');

async function debugUser() {
  try {
    // 1. 检查数据库连接
    console.log('=== 检查数据库连接 ===');
    const testQuery = await pool.query('SELECT NOW()');
    console.log('数据库连接正常:', testQuery.rows[0]);

    // 2. 查看所有用户
    console.log('\n=== 查看所有用户 ===');
    const allUsers = await pool.query('SELECT user_id, user_name, user_type, user_status FROM sys_user');
    console.log('用户列表:', allUsers.rows);

    // 3. 查找管理员用户
    console.log('\n=== 查找管理员用户 ===');
    const adminUsers = await pool.query('SELECT user_id, user_name, user_type, user_status FROM sys_user WHERE user_type = 3');
    console.log('管理员用户:', adminUsers.rows);

    // 4. 测试特定用户名查找
    const testUsername = 'admin'; // 替换为你要测试的用户名
    console.log(`\n=== 测试查找用户: ${testUsername} ===`);
    const userResult = await pool.query('SELECT user_id, user_name, password, user_type FROM sys_user WHERE user_name = $1', [testUsername]);
    
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      console.log('找到用户:', {
        user_id: user.user_id,
        user_name: user.user_name,
        user_type: user.user_type,
        password_hash: user.password.substring(0, 20) + '...' // 只显示密码哈希的前20个字符
      });

      // 5. 测试密码验证
      const testPassword = 'admin123'; // 替换为你要测试的密码
      console.log(`\n=== 测试密码验证: ${testPassword} ===`);
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log('密码验证结果:', isValid);
      
    } else {
      console.log('未找到该用户');
    }

  } catch (error) {
    console.error('调试过程中出错:', error);
  } finally {
    process.exit();
  }
}

debugUser();