const axios = require('axios');

// 测试配置
const BASE_URL = 'http://localhost:3000/api';
let buyerToken = '';
let farmerToken = '';

async function testUserBehaviorAPIs() {
  console.log('开始测试用户行为 API...\n');

  try {
    // 1. 测试获取浏览足迹
    console.log('1. 测试获取浏览足迹...');
    const footprintsResponse = await axios.get(`${BASE_URL}/my/footprints?type=1&page=1&pageSize=20`, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✓ 获取浏览足迹成功:', footprintsResponse.data);

    // 2. 测试删除浏览足迹
    console.log('\n2. 测试删除浏览足迹...');
    const deleteFootprintsResponse = await axios.delete(`${BASE_URL}/my/footprints`, {
      data: {
        footprint_ids: [3001, 3002]
      },
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✓ 删除浏览足迹成功，状态码:', deleteFootprintsResponse.status);

    // 3. 测试关注卖家
    console.log('\n3. 测试关注卖家...');
    const followResponse = await axios.post(`${BASE_URL}/my/follows`, {
      seller_id: 1001,
      follow_remark: "优质小麦卖家"
    }, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✓ 关注卖家成功:', followResponse.data);

    // 4. 测试获取关注列表
    console.log('\n4. 测试获取关注列表...');
    const followListResponse = await axios.get(`${BASE_URL}/my/follows`, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✓ 获取关注列表成功:', followListResponse.data);

    // 5. 测试取消关注
    console.log('\n5. 测试取消关注...');
    const unfollowResponse = await axios.delete(`${BASE_URL}/my/follows/1001`, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✓ 取消关注成功，状态码:', unfollowResponse.status);

    console.log('\n🎉 所有用户行为API测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
  }
}

// 运行测试
if (require.main === module) {
  console.log('请先设置有效的token，然后运行测试');
  console.log('buyerToken:', buyerToken || '未设置');
  console.log('farmerToken:', farmerToken || '未设置');
  
  if (buyerToken) {
    testUserBehaviorAPIs();
  } else {
    console.log('\n请在代码中设置有效的buyerToken后再运行测试');
  }
}

module.exports = { testUserBehaviorAPIs };