const { pool } = require('./database');
const { decrypt } = require('./utils/crypto');

async function verifyData() {
  const client = await pool.connect();
  
  try {
    console.log('验证注册的用户数据...\n');
    
    // 查询所有用户
    const result = await client.query(`
      SELECT user_id, user_name, real_name, user_type, id_card, phone, email, 
             user_status, cert_status, create_time
      FROM sys_user 
      ORDER BY user_id DESC 
      LIMIT 5
    `);
    
    console.log('最近注册的用户:');
    result.rows.forEach(user => {
      console.log(`\n用户ID: ${user.user_id}`);
      console.log(`用户名: ${user.user_name}`);
      console.log(`真实姓名: ${user.real_name}`);
      console.log(`用户类型: ${user.user_type === 1 ? '农户' : user.user_type === 2 ? '买家' : '管理员'}`);
      console.log(`手机号: ${user.phone}`);
      console.log(`邮箱: ${user.email || '未填写'}`);
      console.log(`账号状态: ${user.user_status === 1 ? '正常' : user.user_status === 2 ? '待审核' : '禁用'}`);
      console.log(`认证状态: ${user.cert_status === 1 ? '已认证' : '未认证'}`);
      console.log(`注册时间: ${user.create_time}`);
      
      // 尝试解密身份证号（仅显示前6位和后4位）
      try {
        const decryptedIdCard = decrypt(user.id_card);
        const maskedIdCard = decryptedIdCard.substring(0, 6) + '********' + decryptedIdCard.substring(14);
        console.log(`身份证号: ${maskedIdCard}`);
      } catch (err) {
        console.log(`身份证号: [加密存储]`);
      }
    });
    
  } catch (err) {
    console.error('❌ 验证失败:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

verifyData();