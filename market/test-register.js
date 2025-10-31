// 测试注册功能的脚本
const axios = require('axios');

const baseURL = 'http://localhost:3001';

// 测试数据
const testUsers = [
  {
    user_name: 'nonghu_zhang3',
    password: 'securePassword123',
    real_name: '张三',
    user_type: 1,
    id_card: '410101199001011234',
    phone: '13800138000',
    email: 'zhang3@example.com'
  },
  {
    user_name: 'buyer_li4',
    password: 'password456',
    real_name: '李四',
    user_type: 2,
    id_card: '410101199002022345',
    phone: '13900139000',
    email: 'li4@example.com'
  }
];

async function testRegister() {
  console.log('开始测试用户注册功能...\n');

  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    console.log(`测试用户 ${i + 1}: ${user.user_name}`);
    
    try {
      const response = await axios.post(`${baseURL}/api/auth/register`, user);
      console.log('✅ 注册成功:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('❌ 注册失败:', error.response.data);
      } else {
        console.log('❌ 请求失败:', error.message);
      }
    }
    console.log('---');
  }

  // 测试重复注册
  console.log('测试重复注册...');
  try {
    const response = await axios.post(`${baseURL}/api/auth/register`, testUsers[0]);
    console.log('❌ 应该失败但成功了:', response.data);
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.log('✅ 正确拒绝重复注册:', error.response.data);
    } else {
      console.log('❌ 意外错误:', error.response?.data || error.message);
    }
  }
}

// 如果直接运行此文件
if (require.main === module) {
  testRegister().catch(console.error);
}

module.exports = { testRegister };