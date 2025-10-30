-- 插入贷款类型数据
INSERT INTO financing_loan_type (loan_type_name, loan_purpose, min_loan_amount, max_loan_amount, loan_term_type, min_loan_term, max_loan_term, interest_rate_type, min_interest_rate, max_interest_rate, required_materials, applicable_objects, support_banks, status, sort, create_time, update_time) VALUES
('种植周转贷', '用于小麦种植期间化肥、农药采购资金周转', 10000.00, 500000.00, 2, 3, 12, 1, 0.0435, 0.065, '身份证,种植证明,银行流水', '种植规模≥50亩的农户', '中国农业银行,中国邮政储蓄银行', 1, 1, NOW(), NOW()),
('农机购置贷', '用于购买农业机械设备', 50000.00, 1000000.00, 2, 6, 36, 1, 0.045, 0.07, '身份证,购机合同,银行流水', '经营满1年的农户或合作社', '中国农业银行,河南省农村信用社', 1, 2, NOW(), NOW()),
('农产品预售贷', '基于农产品预售订单的融资', 20000.00, 800000.00, 2, 1, 12, 1, 0.04, 0.06, '身份证,预售合同,种植证明', '有预售订单的农户', '中国邮政储蓄银行,河南省农村信用社', 1, 3, NOW(), NOW())
ON CONFLICT (loan_type_name) DO NOTHING;

-- 插入银行信息数据
INSERT INTO financing_bank (bank_name, bank_short_name, contact_department, contact_person, contact_phone, bank_province, supported_loan_types, approval_cycle, bank_status, create_time, update_time) VALUES
('中国农业银行股份有限公司河南省分行', '农行河南分行', '三农金融部', '李经理', '0371-12345678', '河南省', '1,2,3', '3-5个工作日', 1, NOW(), NOW()),
('中国邮政储蓄银行股份有限公司河南省分行', '邮储银行河南分行', '三农金融事业部', '王经理', '0371-87654321', '河南省', '1,3', '2-3个工作日', 1, NOW(), NOW()),
('河南省农村信用社联合社', '河南农信社', '农户金融部', '张经理', '0371-11223344', '河南省', '2,3', '1-2个工作日', 1, NOW(), NOW())
ON CONFLICT (bank_name) DO NOTHING;