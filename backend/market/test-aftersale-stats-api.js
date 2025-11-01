const axios = require('axios');

// 测试配置
const BASE_URL = 'http://localhost:3000/api';
let buyerToken = '';
let adminToken = '';

async function testAftersaleStatsAPIs() {
  console.log('开始测试售后与统计 API...\n');

  try {
    // 1. 测试申请售后
    console.log('1. 测试申请售后...');
    const applyAftersaleResponse = await axios.post(`${BASE_URL}/orders/ORD20251110000001/aftersale/apply`, {
      aftersale_type: 1,
      apply_amount: 500.00,
      reason: "部分小麦有发霉迹象，申请部分退款。",
      proof_images: "[\"https://.../proof1.jpg\", \"https://.../proof2.jpg\"]"
    }, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✓ 申请售后成功:', applyAftersaleResponse.data);

    // 2. 测试管理员审核售后
    console.log('\n2. 测试管理员审核售后...');
    const reviewAftersaleResponse = await axios.post(`${BASE_URL}/admin/aftersale/601/review`, {
      audit_status: 1,
      audit_remark: "情况属实，同意退款申请。"
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ 管理员审核售后成功:', reviewAftersaleResponse.data);

    // 3. 测试添加收藏
    console.log('\n3. 测试添加收藏...');
    const addCollectionResponse = await axios.post(`${BASE_URL}/my/collections`, {
      collection_type: 1,
      source_id: 10001
    }, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✓ 添加收藏成功:', addCollectionResponse.data);

    // 4. 测试获取收藏列表
    console.log('\n4. 测试获取收藏列表...');
    const collectionsResponse = await axios.get(`${BASE_URL}/my/collections?type=1`, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✓ 获取收藏列表成功:', collectionsResponse.data);

    // 5. 测试取消收藏
    console.log('\n5. 测试取消收藏...');
    const removeCollectionResponse = await axios.delete(`${BASE_URL}/my/collections/701`, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✓ 取消收藏成功，状态码:', removeCollectionResponse.status);

    // 6. 测试获取价格走势
    console.log('\n6. 测试获取价格走势...');
    const priceTrendsResponse = await axios.get(`${BASE_URL}/stats/price-trends?category_id=101&start_date=2025-09-01&end_date=2025-09-30`);
    console.log('✓ 获取价格走势成功:', priceTrendsResponse.data);

    console.log('\n🎉 所有售后与统计API测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
  }
}

// 运行测试
if (require.main === module) {
  console.log('请先设置有效的token，然后运行测试');
  console.log('buyerToken:', buyerToken || '未设置');
  console.log('adminToken:', adminToken || '未设置');
  
  if (buyerToken && adminToken) {
    testAftersaleStatsAPIs();
  } else {
    console.log('\n请在代码中设置有效的token后再运行测试');
  }
}

module.exports = { testAftersaleStatsAPIs };