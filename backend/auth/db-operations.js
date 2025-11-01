const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// 数据库配置
const pool = new Pool({
  host: '82.157.154.143',
  port: 5432,
  database: 'agri',
  user: 'agri_root',
  password: 'agri_root'
});

// 创建管理员用户
async function createAdmin() {
  try {
    console.log('正在创建管理员用户...');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const query = `
      INSERT INTO sys_user (user_name, password, real_name, user_type, id_card, phone, user_status, cert_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_name) DO UPDATE SET
        password = EXCLUDED.password,
        user_type = EXCLUDED.user_type,
        user_status = EXCLUDED.user_status
      RETURNING user_id, user_name, user_type
    `;
    
    const result = await pool.query(query, [
      'admin',           // 用户名
      hashedPassword,    // 加密密码
      '系统管理员',       // 真实姓名
      3,                // 用户类型：3=管理员
      '110101199001011234', // 身份证号
      '23800138000',    // 手机号
      1,                // 用户状态：1=正常
      0                 // 认证状态：0=未认证
    ]);
    
    console.log('管理员创建成功:', result.rows[0]);
    console.log('登录信息:');
    console.log('用户名: admin');
    console.log('密码: admin123');
    
  } catch (error) {
    console.error('创建管理员失败:', error.message);
  }
}

// 查看所有用户
async function listUsers() {
  try {
    const result = await pool.query(`
      SELECT user_id, user_name, real_name, user_type, user_status, create_time 
      FROM sys_user 
      ORDER BY user_id
    `);
    
    console.log('=== 用户列表 ===');
    result.rows.forEach(user => {
      const userTypeText = user.user_type === 1 ? '农户' : user.user_type === 2 ? '买家' : '管理员';
      const statusText = user.user_status === 1 ? '正常' : '待审核';
      console.log(`ID: ${user.user_id}, 用户名: ${user.user_name}, 姓名: ${user.real_name}, 类型: ${userTypeText}, 状态: ${statusText}`);
    });
    
  } catch (error) {
    console.error('查询用户失败:', error.message);
  }
}

// 删除用户
async function deleteUser(username) {
  try {
    const result = await pool.query('DELETE FROM sys_user WHERE user_name = $1 RETURNING user_name', [username]);
    
    if (result.rows.length > 0) {
      console.log(`用户 ${username} 删除成功`);
    } else {
      console.log(`用户 ${username} 不存在`);
    }
    
  } catch (error) {
    console.error('删除用户失败:', error.message);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  try {
    switch (command) {
      case 'create-admin':
        await createAdmin();
        break;
      case 'list':
        await listUsers();
        break;
      case 'delete':
        if (!args[1]) {
          console.log('请提供要删除的用户名: node db-operations.js delete username');
          break;
        }
        await deleteUser(args[1]);
        break;
      default:
        console.log('可用命令:');
        console.log('  node db-operations.js create-admin  # 创建管理员');
        console.log('  node db-operations.js list          # 查看所有用户');
        console.log('  node db-operations.js delete <用户名> # 删除用户');
    }
  } catch (error) {
    console.error('操作失败:', error.message);
  } finally {
    await pool.end();
  }
}

main();