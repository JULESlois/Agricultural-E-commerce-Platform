const { DataTypes } = require('sequelize'); // Add this import
const sequelize = require('./config/db');
const LoanType = require('./models/loanModel').default;
const FinancingApplication = require('./models/applicationModel').default;
const CreditEvaluation = require('./models/creditModel').default;
const PresalePlan = require('./models/presaleModel');
const setupAssociations = require('./models/associations').default;

// 初始化数据库表结构并插入测试数据
const initDatabase = async () => {
  try {
    // 设置模型关联
    setupAssociations();
    
    // 同步所有模型到数据库（创建表结构）
    console.log('正在创建数据库表结构...');
    
    // 单独同步每个模型，以确保所有表都被创建
    await LoanType.sync({ force: true });
    await FinancingApplication.sync({ force: true });
    await CreditEvaluation.sync({ force: true });
    await PresalePlan.sync({ force: true });
    
    console.log('数据库表结构创建成功！');
    
    // 插入测试数据（从 sample-data.sql 提取的逻辑）
    const loanTypes = await LoanType.bulkCreate([
      {
        loan_type_name: '种植周转贷',
        loan_purpose: '用于农作物种植过程中的资金周转，包括种子、化肥、农药等生产资料采购',
        min_loan_amount: 5000.00,
        max_loan_amount: 100000.00,
        min_loan_term: 3,
        max_loan_term: 12,
        loan_term_type: 2,
        min_interest_rate: 0.0435,
        required_materials: '身份证,土地承包经营权证,种植计划书,收入证明',
        support_banks: '农业银行,农商银行,邮储银行'
      },
      {
        loan_type_name: '设备采购贷',
        loan_purpose: '用于购买农业生产设备、机械等固定资产',
        min_loan_amount: 10000.00,
        max_loan_amount: 500000.00,
        min_loan_term: 6,
        max_loan_term: 36,
        loan_term_type: 2,
        min_interest_rate: 0.0485,
        required_materials: '身份证,设备采购合同,经营许可证,财务报表',
        support_banks: '农业银行,建设银行'
      },
      {
        loan_type_name: '养殖周转贷',
        loan_purpose: '用于畜禽养殖过程中的饲料采购、疫苗防疫等流动资金需求',
        min_loan_amount: 8000.00,
        max_loan_amount: 200000.00,
        min_loan_term: 6,
        max_loan_term: 24,
        loan_term_type: 2,
        min_interest_rate: 0.0465,
        required_materials: '身份证,养殖许可证,养殖场地证明,销售合同',
        support_banks: '农商银行,邮储银行'
      }
    ]);
    
    // 插入融资申请测试数据
    const applications = await FinancingApplication.bulkCreate([
      {
        application_no: 'FIN202501011234567',
        farmer_id: 1001,
        loan_type_id: 1,
        apply_amount: 50000.00,
        apply_term: 6,
        loan_purpose_detail: '计划种植100亩玉米，需要购买种子、化肥、农药等生产资料',
        repayment_plan: '预计6个月后玉米收获，销售收入约8万元，扣除成本后可偿还贷款',
        bank_id: 1,
        material_urls: JSON.stringify(["https://example.com/id_card.jpg", "https://example.com/land_cert.jpg"]),
        application_status: 2
      }
    ]);
    
    // 插入信用评估测试数据
    await CreditEvaluation.bulkCreate([
      {
        application_id: 1,
        credit_score: 85,
        credit_level: 'A级',
        score_detail: {"基础信息": 25, "经营状况": 30, "信用记录": 30},
        evaluation_result: 1,
        evaluation_remark: '申请人信用状况良好，经营稳定，具备还款能力',
        credit_report_url: 'https://example.com/credit_report_1.pdf'
      }
    ]);
    
    // 插入预售计划测试数据
    await PresalePlan.bulkCreate([
      {
        farmer_id: 1001,
        category_id: 101,
        product_name: '有机玉米',
        plant_date: '2025-03-15',
        expected_harvest_date: '2025-09-15',
        total_yield_quantity: 5000.00,
        presale_unit_price: 4.50,
        deposit_ratio: 0.30,
        presale_status: 2
      }
    ]);
    
    console.log('所有测试数据插入成功！');
    await sequelize.close();
  } catch (error) {
    console.error('数据库初始化失败：', error);
    process.exit(1);
  }
};

// 执行初始化
initDatabase();