const axios = require('axios');

// 测试配置
const BASE_URL = 'http://localhost:3000/api';
let buyerToken = '';
let farmerToken = '';
let adminToken = '';

// 测试数据
const testData = {
  orderId: '',
  invoiceId: ''
};

async function testOrderAPIs() {
  console.log('开始测试订单与履约 API...\n');

  try {
    // 1. 测试创建订单 (需要买家token)
    console.log('1. 测试创建订单...');
    const createOrderResponse = await axios.post(`${BASE_URL}/orders`, {
      source_id: 10001,
      quantity: 2000.00,
      receiver_address_id: 123,
      user_coupon_id: 5001,
      order_remark: "请使用防水包装"
    }, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    
    testData.orderId = createOrderResponse.data.data.order_id;
    console.log('✓ 创建订单成功:', createOrderResponse.data);

    // 2. 测试获取订单列表
    console.log('\n2. 测试获取订单列表...');
    const orderListResponse = await axios.get(`${BASE_URL}/orders?status=1`, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✓ 获取订单列表成功:', orderListResponse.data);

    // 3. 测试获取订单详情
    console.log('\n3. 测试获取订单详情...');
    const orderDetailResponse = await axios.get(`${BASE_URL}/orders/${testData.orderId}`, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✓ 获取订单详情成功:', orderDetailResponse.data);

    // 4. 测试支付订单
    console.log('\n4. 测试支付订单...');
    const payOrderResponse = await axios.post(`${BASE_URL}/orders/${testData.orderId}/pay`, {
      payment_method: "WECHAT_PAY"
    }, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✓ 支付订单成功:', payOrderResponse.data);

    // 5. 测试卖家发货 (需要农户token)
    console.log('\n5. 测试卖家发货...');
    const shipOrderResponse = await axios.post(`${BASE_URL}/farmer/orders/${testData.orderId}/ship`, {
      delivery_type: 2,
      logistics_company: "德邦物流",
      logistics_no: "DB123456789"
    }, {
      headers: { Authorization: `Bearer ${farmerToken}` }
    });
    console.log('✓ 卖家发货成功:', shipOrderResponse.data);

    // 6. 测试买家确认收货
    console.log('\n6. 测试买家确认收货...');
    const confirmReceiptResponse = await axios.post(`${BASE_URL}/buyer/orders/${testData.orderId}/confirm-receipt`, {}, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✓ 买家确认收货成功:', confirmReceiptResponse.data);

    // 7. 测试申请发票
    console.log('\n7. 测试申请发票...');
    const applyInvoiceResponse = await axios.post(`${BASE_URL}/orders/${testData.orderId}/invoice/apply`, {
      invoice_type: 2,
      invoice_title: "美味果蔬超市",
      taxpayer_id: "91410100MA12345678",
      delivery_way: 1
    }, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✓ 申请发票成功:', applyInvoiceResponse.data);

    // 8. 测试管理员更新发票状态 (需要管理员token)
    console.log('\n8. 测试管理员更新发票状态...');
    const updateInvoiceResponse = await axios.patch(`${BASE_URL}/admin/invoices/1`, {
      invoice_status: 2,
      invoice_no: "INV20251110000001",
      invoice_url: "https://.../invoice/INV20251110000001.pdf"
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ 管理员更新发票状态成功:', updateInvoiceResponse.data);

    console.log('\n🎉 所有订单API测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
  }
}

// 运行测试
if (require.main === module) {
  console.log('请先设置有效的token，然后运行测试');
  console.log('buyerToken:', buyerToken || '未设置');
  console.log('farmerToken:', farmerToken || '未设置');
  console.log('adminToken:', adminToken || '未设置');
  
  if (buyerToken && farmerToken && adminToken) {
    testOrderAPIs();
  } else {
    console.log('\n请在代码中设置有效的token后再运行测试');
  }
}

module.exports = { testOrderAPIs };