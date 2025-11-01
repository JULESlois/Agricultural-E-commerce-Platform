const fetch = require('node-fetch');

// 配置
const BASE_URL = 'http://localhost:3002';
let authToken = '';

// 1. 先登录获取token
async function login() {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login_identifier: 'your_username', // 替换为实际用户名
        password: 'your_password'          // 替换为实际密码
      })
    });

    const result = await response.json();
    
    if (result.code === 200) {
      authToken = result.data.token;
      console.log('登录成功，获取到token:', authToken);
      return true;
    } else {
      console.error('登录失败:', result.message);
      return false;
    }
  } catch (error) {
    console.error('登录请求失败:', error);
    return false;
  }
}

// 2. 使用token测试需要认证的API
async function testAuthenticatedAPI() {
  if (!authToken) {
    console.error('没有token，请先登录');
    return;
  }

  try {
    // 测试获取待审核列表 (需要管理员权限)
    const response = await fetch(`${BASE_URL}/api/cert/admin/pending`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    console.log('API测试结果:', result);

  } catch (error) {
    console.error('API请求失败:', error);
  }
}

// 3. 测试用户信息API
async function testUserInfo() {
  if (!authToken) {
    console.error('没有token，请先登录');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    console.log('用户信息:', result);

  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
}

// 执行测试
async function runTests() {
  console.log('开始测试...');
  
  // 先登录
  const loginSuccess = await login();
  
  if (loginSuccess) {
    console.log('\n--- 测试需要认证的API ---');
    await testAuthenticatedAPI();
    
    console.log('\n--- 测试用户信息API ---');
    await testUserInfo();
  }
}

// 如果直接运行此文件
if (require.main === module) {
  runTests();
}

module.exports = {
  login,
  testAuthenticatedAPI,
  testUserInfo,
  getToken: () => authToken
};