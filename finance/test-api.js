const axios = require('axios');

// 测试API接口的基本功能
const BASE_URL = 'http://localhost:3000/api';

// 测试获取贷款产品列表
async function testGetLoanTypes() {
  try {
    console.log('测试获取贷款产品列表...');
    const response = await axios.get(`${BASE_URL}/loan-types`);
    console.log('✅ 获取贷款产品列表成功:', response.data);
  } catch (error) {
    console.log('❌ 获取贷款产品列表失败:', error.response?.data || error.message);
  }
}

// 测试获取贷款产品详情
async function testGetLoanTypeDetail() {
  try {
    console.log('测试获取贷款产品详情...');
    const response = await axios.get(`${BASE_URL}/loan-types/1`);
    console.log('✅ 获取贷款产品详情成功:', response.data);
  } catch (error) {
    console.log('❌ 获取贷款产品详情失败:', error.response?.data || error.message);
  }
}

// 测试银行接口（需要Token）
async function testBankAPI() {
  try {
    console.log('测试银行接口...');
    // 注意：这里需要有效的银行Token
    const token = 'your-bank-token-here';
    const response = await axios.get(`${BASE_URL}/bank/financing/applications?status=2`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ 银行接口测试成功:', response.data);
  } catch (error) {
    console.log('❌ 银行接口测试失败:', error.response?.data || error.message);
  }
}

// 运行测试
async function runTests() {
  console.log('开始API测试...\n');
  
  await testGetLoanTypes();
  console.log('');
  
  await testGetLoanTypeDetail();
  console.log('');
  
  await testBankAPI();
  console.log('');
  
  console.log('API测试完成！');
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  runTests();
}

module.exports = {
  testGetLoanTypes,
  testGetLoanTypeDetail,
  testBankAPI,
  runTests
};