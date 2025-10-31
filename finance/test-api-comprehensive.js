/**
 * 融资服务API综合测试脚本
 * 根据API文档要求测试所有接口
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// 测试用的Token（实际使用时需要通过登录接口获取）
const FARMER_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // 农户Token
const BANK_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';   // 银行Token

// 测试数据
const testData = {
  loanApplication: {
    loan_type_id: 1,
    apply_amount: 50000.00,
    apply_term: 6,
    loan_purpose_detail: "购买种子、化肥等农业生产资料，用于春季玉米种植",
    repayment_plan: "按月等额本息还款，预计每月还款8500元左右",
    bank_id: 1,
    material_urls: [
      "https://example.com/materials/id_card.jpg",
      "https://example.com/materials/land_certificate.pdf"
    ]
  },
  presalePlan: {
    category_id: 1,
    product_name: "有机玉米",
    plant_date: "2024-03-15",
    expected_harvest_date: "2024-09-15",
    total_yield_quantity: 5000.00,
    presale_unit_price: 4.50,
    deposit_ratio: 0.30
  },
  bankApproval: {
    approval_result: 1,
    approval_amount: 45000.00,
    approval_term: 6,
    interest_rate: 0.0435,
    approval_remark: "申请材料齐全，信用良好，批准放款"
  },
  bankDisburse: {
    disburse_amount: 45000.00,
    disburse_account: "6228480402564890018",
    disburse_remark: "已成功放款至申请人银行账户"
  }
};

// 测试函数
async function testAPI() {
  console.log('🚀 开始测试融资服务API...\n');

  try {
    // 1. 农户相关接口测试
    console.log('📋 1. 农户相关接口测试');
    
    // 1.1 获取贷款产品列表
    console.log('  1.1 获取贷款产品列表');
    const loanTypes = await axios.get(`${BASE_URL}/loan-types`);
    console.log('  ✅ 状态码:', loanTypes.status);
    console.log('  📄 响应:', JSON.stringify(loanTypes.data, null, 2));

    // 1.2 获取贷款产品详情
    console.log('\n  1.2 获取贷款产品详情');
    const loanTypeDetail = await axios.get(`${BASE_URL}/loan-types/1`);
    console.log('  ✅ 状态码:', loanTypeDetail.status);
    console.log('  📄 响应:', JSON.stringify(loanTypeDetail.data, null, 2));

    // 1.3 创建融资申请（需要农户Token）
    console.log('\n  1.3 创建融资申请');
    const createApp = await axios.post(
      `${BASE_URL}/farmer/financing/applications`,
      testData.loanApplication,
      { headers: { Authorization: FARMER_TOKEN } }
    );
    console.log('  ✅ 状态码:', createApp.status);
    console.log('  📄 响应:', JSON.stringify(createApp.data, null, 2));
    const applicationId = createApp.data.data.application_id;

    // 1.4 获取我的融资申请列表
    console.log('\n  1.4 获取我的融资申请列表');
    const myApps = await axios.get(
      `${BASE_URL}/farmer/financing/applications`,
      { headers: { Authorization: FARMER_TOKEN } }
    );
    console.log('  ✅ 状态码:', myApps.status);
    console.log('  📄 响应:', JSON.stringify(myApps.data, null, 2));

    // 1.5 获取我的融资申请详情
    console.log('\n  1.5 获取我的融资申请详情');
    const myAppDetail = await axios.get(
      `${BASE_URL}/farmer/financing/applications/${applicationId}`,
      { headers: { Authorization: FARMER_TOKEN } }
    );
    console.log('  ✅ 状态码:', myAppDetail.status);
    console.log('  📄 响应:', JSON.stringify(myAppDetail.data, null, 2));

    // 2. 内部接口测试
    console.log('\n📋 2. 内部接口测试');
    
    // 2.1 触发信用评估
    console.log('  2.1 触发信用评估');
    const triggerEval = await axios.post(`${BASE_URL}/internal/financing/applications/${applicationId}/evaluate`);
    console.log('  ✅ 状态码:', triggerEval.status);
    console.log('  📄 响应:', JSON.stringify(triggerEval.data, null, 2));

    // 2.2 接收评估结果
    console.log('\n  2.2 接收评估结果');
    const evalResult = await axios.post(`${BASE_URL}/internal/financing/credit-evaluations`, {
      application_id: applicationId,
      credit_score: 85,
      credit_level: "A级",
      score_detail: {
        "基础信息": 20,
        "经营状况": 25,
        "还款能力": 25,
        "信用记录": 15
      },
      evaluation_result: 1,
      evaluation_remark: "信用良好，具备还款能力",
      credit_report_url: "https://example.com/credit-reports/report_123.pdf"
    });
    console.log('  ✅ 状态码:', evalResult.status);
    console.log('  📄 响应:', JSON.stringify(evalResult.data, null, 2));

    // 3. 银行接口测试
    console.log('\n📋 3. 银行接口测试');
    
    // 3.1 获取待审批的申请列表
    console.log('  3.1 获取待审批的申请列表');
    const pendingApps = await axios.get(
      `${BASE_URL}/bank/financing/applications?status=2`,
      { headers: { Authorization: BANK_TOKEN } }
    );
    console.log('  ✅ 状态码:', pendingApps.status);
    console.log('  📄 响应:', JSON.stringify(pendingApps.data, null, 2));

    // 3.2 获取申请详情以供审批
    console.log('\n  3.2 获取申请详情以供审批');
    const appDetail = await axios.get(
      `${BASE_URL}/bank/financing/applications/${applicationId}`,
      { headers: { Authorization: BANK_TOKEN } }
    );
    console.log('  ✅ 状态码:', appDetail.status);
    console.log('  📄 响应:', JSON.stringify(appDetail.data, null, 2));

    // 3.3 提交审批结论
    console.log('\n  3.3 提交审批结论');
    const approval = await axios.post(
      `${BASE_URL}/bank/financing/applications/${applicationId}/review`,
      testData.bankApproval,
      { headers: { Authorization: BANK_TOKEN } }
    );
    console.log('  ✅ 状态码:', approval.status);
    console.log('  📄 响应:', JSON.stringify(approval.data, null, 2));

    // 3.4 确认放款
    console.log('\n  3.4 确认放款');
    const disburse = await axios.post(
      `${BASE_URL}/bank/financing/applications/${applicationId}/disburse`,
      testData.bankDisburse,
      { headers: { Authorization: BANK_TOKEN } }
    );
    console.log('  ✅ 状态码:', disburse.status);
    console.log('  📄 响应:', JSON.stringify(disburse.data, null, 2));

    // 4. 预售相关接口测试
    console.log('\n📋 4. 预售相关接口测试');
    
    // 4.1 创建预售计划
    console.log('  4.1 创建预售计划');
    const createPresale = await axios.post(
      `${BASE_URL}/farmer/presale/plans`,
      testData.presalePlan,
      { headers: { Authorization: FARMER_TOKEN } }
    );
    console.log('  ✅ 状态码:', createPresale.status);
    console.log('  📄 响应:', JSON.stringify(createPresale.data, null, 2));
    const planId = createPresale.data.data.plan_id;

    // 4.2 获取我的预售计划列表
    console.log('\n  4.2 获取我的预售计划列表');
    const myPlans = await axios.get(
      `${BASE_URL}/farmer/presale/plans`,
      { headers: { Authorization: FARMER_TOKEN } }
    );
    console.log('  ✅ 状态码:', myPlans.status);
    console.log('  📄 响应:', JSON.stringify(myPlans.data, null, 2));

    // 4.3 获取预售计划详情
    console.log('\n  4.3 获取预售计划详情');
    const planDetail = await axios.get(`${BASE_URL}/presale/plans/${planId}`);
    console.log('  ✅ 状态码:', planDetail.status);
    console.log('  📄 响应:', JSON.stringify(planDetail.data, null, 2));

    console.log('\n🎉 所有API测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('响应头:', error.response.headers);
    }
  }
}

// 运行测试
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI, testData };