const axios = require('axios');

const baseURL = 'http://localhost:3001';

// 测试各种验证情况
const testCases = [
  {
    name: '用户名太短',
    data: {
      user_name: 'ab',
      password: 'password123',
      real_name: '测试',
      user_type: 1,
      id_card: '410101199001011234',
      phone: '13800138000'
    },
    expectedError: '用户名至少3个字符'
  },
  {
    name: '密码太短',
    data: {
      user_name: 'testuser',
      password: '123',
      real_name: '测试',
      user_type: 1,
      id_card: '410101199001011234',
      phone: '13800138000'
    },
    expectedError: '密码至少6个字符'
  },
  {
    name: '无效的用户类型',
    data: {
      user_name: 'testuser2',
      password: 'password123',
      real_name: '测试',
      user_type: 5,
      id_card: '410101199001011234',
      phone: '13800138000'
    },
    expectedError: '用户类型只能是1(农户)或2(买家)'
  },
  {
    name: '无效的身份证号',
    data: {
      user_name: 'testuser3',
      password: 'password123',
      real_name: '测试',
      user_type: 1,
      id_card: '123456789',
      phone: '13800138000'
    },
    expectedError: '身份证号格式不正确'
  },
  {
    name: '无效的手机号',
    data: {
      user_name: 'testuser4',
      password: 'password123',
      real_name: '测试',
      user_type: 1,
      id_card: '410101199001011234',
      phone: '12345678901'
    },
    expectedError: '手机号格式不正确'
  },
  {
    name: '无效的邮箱',
    data: {
      user_name: 'testuser5',
      password: 'password123',
      real_name: '测试',
      user_type: 1,
      id_card: '410101199001011234',
      phone: '13800138000',
      email: 'invalid-email'
    },
    expectedError: '邮箱格式不正确'
  }
];

async function testValidation() {
  console.log('开始测试输入验证...\n');

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`测试 ${i + 1}: ${testCase.name}`);
    
    try {
      const response = await axios.post(`${baseURL}/api/auth/register`, testCase.data);
      console.log('❌ 应该失败但成功了:', response.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error;
        if (errorMessage.includes(testCase.expectedError) || errorMessage === testCase.expectedError) {
          console.log('✅ 正确拒绝:', errorMessage);
        } else {
          console.log('⚠️  错误信息不匹配:');
          console.log('  期望:', testCase.expectedError);
          console.log('  实际:', errorMessage);
        }
      } else {
        console.log('❌ 意外错误:', error.response?.data || error.message);
      }
    }
    console.log('---');
  }
}

testValidation().catch(console.error);