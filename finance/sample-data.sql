-- 插入示例贷款产品数据
INSERT INTO financing_loan_types (
  loan_type_name, loan_purpose, min_loan_amount, max_loan_amount,
  min_loan_term, max_loan_term, loan_term_type, min_interest_rate,
  required_materials, support_banks
) VALUES 
(
  '种植周转贷',
  '用于农作物种植过程中的资金周转，包括种子、化肥、农药等生产资料采购',
  5000.00,
  100000.00,
  3,
  12,
  2,
  0.0435,
  '身份证,土地承包经营权证,种植计划书,收入证明',
  '农业银行,农商银行,邮储银行'
),
(
  '设备采购贷',
  '用于购买农业生产设备、机械等固定资产',
  10000.00,
  500000.00,
  6,
  36,
  2,
  0.0485,
  '身份证,设备采购合同,经营许可证,财务报表',
  '农业银行,建设银行'
),
(
  '养殖周转贷',
  '用于畜禽养殖过程中的饲料采购、疫苗防疫等流动资金需求',
  8000.00,
  200000.00,
  6,
  24,
  2,
  0.0465,
  '身份证,养殖许可证,养殖场地证明,销售合同',
  '农商银行,邮储银行'
);

-- 插入示例融资申请数据（用于测试）
INSERT INTO financing_applications (
  application_no, farmer_id, loan_type_id, apply_amount, apply_term,
  loan_purpose_detail, repayment_plan, bank_id, material_urls, application_status
) VALUES 
(
  'FIN202501011234567',
  1001,
  1,
  50000.00,
  6,
  '计划种植100亩玉米，需要购买种子、化肥、农药等生产资料',
  '预计6个月后玉米收获，销售收入约8万元，扣除成本后可偿还贷款',
  1,
  '["https://example.com/id_card.jpg", "https://example.com/land_cert.jpg"]',
  2
);

-- 插入示例信用评估数据
INSERT INTO financing_credit_evaluations (
  application_id, credit_score, credit_level, score_detail, evaluation_result,
  evaluation_remark, credit_report_url
) VALUES 
(
  1,
  85,
  'A级',
  '{"基础信息": 25, "经营状况": 30, "信用记录": 30}',
  1,
  '申请人信用状况良好，经营稳定，具备还款能力',
  'https://example.com/credit_report_1.pdf'
);

-- 插入示例预售计划数据
INSERT INTO presale_plans (
  farmer_id, category_id, product_name, plant_date, expected_harvest_date,
  total_yield_quantity, presale_unit_price, deposit_ratio, presale_status
) VALUES 
(
  1001,
  101,
  '有机玉米',
  '2025-03-15',
  '2025-09-15',
  5000.00,
  4.50,
  0.30,
  2
),
(
  1001,
  102,
  '绿色大豆',
  '2025-04-01',
  '2025-10-01',
  3000.00,
  6.80,
  0.25,
  1
);