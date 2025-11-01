
**融资服务模块数据库表设计**

**第一部分：融资申请子系统相关表（2 张）**

**表 1：融资贷款类型表（financing_loan_type）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| loan_type_id | INT | 10  | PRIMARY KEY, AUTO_INCREMENT | 贷款类型 ID（自增主键） |
| loan_type_name | VARCHAR | 100 | NOT NULL, UNIQUE | 贷款类型名称（如 “种植周转贷”“农机购置贷”“农产品预售贷”） |
| loan_purpose | VARCHAR | 200 | NOT NULL | 贷款用途说明（如 “用于小麦种植期间化肥、农药采购资金周转”） |
| min_loan_amount | DECIMAL | 15,2 | NOT NULL | 最低贷款金额（元，如 “10000.00”） |
| max_loan_amount | DECIMAL | 15,2 | NOT NULL | 最高贷款金额（元，如 “500000.00”） |
| loan_term_type | TINYINT | 2   | NOT NULL | 期限类型：1 = 按天、2 = 按月、3 = 按季 |
| min_loan_term | INT | 10  | NOT NULL | 最短贷款期限（如 “3” 个月） |
| max_loan_term | INT | 10  | NOT NULL | 最长贷款期限（如 “12” 个月） |
| interest_rate_type | TINYINT | 2   | NOT NULL | 利率类型：1 = 固定利率、2 = 浮动利率 |
| min_interest_rate | DECIMAL | 5,4 | NOT NULL | 最低年利率（如 “0.0435” 即 4.35%） |
| max_interest_rate | DECIMAL | 5,4 | NOT NULL | 最高年利率（如 “0.065” 即 6.5%） |
| required_materials | VARCHAR | 500 | NOT NULL | 所需材料清单（如 “身份证，种植证明，银行流水，货源预估销量”，用逗号分隔） |
| applicable_objects | VARCHAR | 200 | NOT NULL | 适用对象（如 “种植规模≥50 亩的农户，经营满 1 年的合作社”） |
| support_banks | VARCHAR | 500 | NOT NULL | 支持银行（多个用逗号分隔，如 “中国农业银行，中国邮政储蓄银行，河南省农村信用社”） |
| status | TINYINT | 2   | NOT NULL DEFAULT 1 | 类型状态：0 = 停用（不再接受申请）、1 = 启用（可申请） |
| sort | INT | 4   | DEFAULT 0 | 排序权重（值越小越靠前，申请时优先展示） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**表 2：农户融资申请表（financing_application）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| application_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 申请 ID（自增主键） |
| application_no | VARCHAR | 32  | NOT NULL, UNIQUE | 申请编号（FIN + 年月日 + 8 位随机数，如 “FIN2025102712345678”） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 申请人 ID（关联sys_user.user_id，仅user_type=1农户） |
| loan_type_id | INT | 10  | NOT NULL, FOREIGN KEY | 贷款类型 ID（关联financing_loan_type.loan_type_id） |
| apply_amount | DECIMAL | 15,2 | NOT NULL | 申请金额（元，如 “100000.00”，需在类型上下限之间） |
| apply_term | INT | 10  | NOT NULL | 申请期限（如 “6” 个月，需在类型上下限之间） |
| apply_term_type | TINYINT | 2   | NOT NULL | 期限类型（与所选贷款类型一致：1 = 天、2 = 月、3 = 季） |
| loan_purpose_detail | VARCHAR | 500 | NOT NULL | 贷款用途详情（如 “用于 2025 年冬小麦种植，采购化肥 5 吨、农药 200kg”） |
| repayment_plan | VARCHAR | 500 | NOT NULL | 还款计划（如 “预计 2026 年 5 月小麦收获后，通过平台销售回款还款”） |
| source_id | BIGINT | 20  | FOREIGN KEY | 关联货源 ID（可选，如用已有货源预估销量作为还款保障，关联mall_farmer_source.source_id） |
| bank_id | INT | 10  | NOT NULL, FOREIGN KEY | 意向银行 ID（关联financing_bank.bank_id，从贷款类型支持银行中选择） |
| contact_phone | VARCHAR | 20  | NOT NULL | 联系电话（与sys_user.phone一致，用于银行沟通） |
| contact_address | VARCHAR | 200 | NOT NULL | 联系地址（与sys_user_farmer.plant_address一致） |
| material_urls | VARCHAR | 1000 | NOT NULL | 材料上传 URL（按贷款类型要求上传，多个用逗号分隔，如 “身份证正面，种植证明”） |
| application_status | TINYINT | 2   | NOT NULL DEFAULT 0 | 申请状态：0 = 待提交、1 = 待信用评估、2 = 待银行审批、3 = 审批通过、4 = 审批驳回、5 = 已放款、6 = 已取消 |
| cancel_time | DATETIME | \-  |     | 取消时间（application_status=6时必填） |
| cancel_reason | VARCHAR | 500 |     | 取消原因（application_status=6时必填，如 “资金需求已自行解决”） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 申请创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 申请更新时间（状态变更时更新） |

**第二部分：银行审批子系统相关表（2 张）**

**表 3：合作银行信息表（financing_bank）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| bank_id | INT | 10  | PRIMARY KEY, AUTO_INCREMENT | 银行 ID（自增主键） |
| bank_name | VARCHAR | 100 | NOT NULL, UNIQUE | 银行名称（如 “中国农业银行股份有限公司河南省分行”） |
| bank_short_name | VARCHAR | 50  | NOT NULL, UNIQUE | 银行简称（如 “农行河南分行”，用于前端展示） |
| bank_logo | VARCHAR | 200 |     | 银行 LOGO URL（前端展示用） |
| contact_department | VARCHAR | 100 | NOT NULL | 对接部门（如 “三农金融部”） |
| contact_person | VARCHAR | 50  | NOT NULL | 对接人姓名（银行负责审批的人员） |
| contact_phone | VARCHAR | 20  | NOT NULL | 对接人电话（平台与银行沟通用） |
| contact_email | VARCHAR | 100 |     | 对接人邮箱 |
| bank_province | VARCHAR | 50  | NOT NULL | 银行覆盖省份（如 “河南省”，仅受理该省份农户申请） |
| bank_city | VARCHAR | 50  |     | 银行覆盖城市（可选，如 “郑州市”，为空则覆盖全省） |
| supported_loan_types | VARCHAR | 200 | NOT NULL | 支持贷款类型 ID（多个用逗号分隔，关联financing_loan_type.loan_type_id） |
| approval_cycle | VARCHAR | 50  | NOT NULL | 审批周期（如 “3-5 个工作日”） |
| bank_status | TINYINT | 2   | NOT NULL DEFAULT 1 | 合作状态：0 = 暂停合作、1 = 正常合作 |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 合作开始时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 信息更新时间 |

**表 4：银行审批记录表（financing_bank_approval）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| approval_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 审批记录 ID（自增主键） |
| application_id | BIGINT | 20  | NOT NULL, FOREIGN KEY, UNIQUE | 关联申请 ID（financing_application.application_id，一对一） |
| bank_id | INT | 10  | NOT NULL, FOREIGN KEY | 关联银行 ID（financing_bank.bank_id） |
| approver_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 审批人 ID（关联sys_user.user_id，需银行角色账号，user_type=4） |
| approver_name | VARCHAR | 50  | NOT NULL | 审批人姓名（冗余存储，避免用户信息变更） |
| approval_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 审批时间 |
| approval_result | TINYINT | 2   | NOT NULL | 审批结果：1 = 通过、2 = 驳回 |
| approval_amount | DECIMAL | 15,2 |     | 审批金额（approval_result=1时必填，可小于申请金额，如 “80000.00”） |
| approval_term | INT | 10  |     | 审批期限（approval_result=1时必填，可小于申请期限，如 “6” 个月） |
| interest_rate | DECIMAL | 5,4 |     | 最终年利率（approval_result=1时必填，如 “0.052” 即 5.2%） |
| repayment_method | VARCHAR | 100 |     | 还款方式（approval_result=1时必填，如 “按月付息，到期还本”） |
| approval_remark | VARCHAR | 500 | NOT NULL | 审批意见（如 “申请材料齐全，信用良好，同意放款 8 万元”“种植规模不足，驳回申请”） |
| loan_contract_url | VARCHAR | 200 |     | 贷款合同 URL（approval_result=1时上传，供农户签署） |
| sign_time | DATETIME | \-  |     | 合同签署时间（农户签署后填写） |
| loan_time | DATETIME | \-  |     | 放款时间（application_status=5时必填） |
| loan_account | VARCHAR | 50  |     | 放款账户（农户收款账户，与sys_user_farmer.bank_card_no一致，AES 加密） |

**第三部分：信用评估子系统相关表（1 张）**

**表 5：农户信用评估表（financing_credit_evaluation）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| evaluation_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 评估 ID（自增主键） |
| application_id | BIGINT | 20  | NOT NULL, FOREIGN KEY, UNIQUE | 关联申请 ID（financing_application.application_id，一对一） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联农户 ID（sys_user.user_id，冗余存储） |
| evaluation_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 评估时间 |
| evaluation_type | TINYINT | 2   | NOT NULL DEFAULT 1 | 评估类型：1 = 系统自动评估、2 = 人工辅助评估 |
| evaluator_id | BIGINT | 20  | FOREIGN KEY | 评估人 ID（evaluation_type=2时必填，关联sys_user.user_id，管理员角色） |
| credit_score | INT | 3   | NOT NULL | 信用评分（0-100 分，如 “85” 分，评分模型输出结果） |
| credit_level | VARCHAR | 20  | NOT NULL | 信用等级（如 “A 级（80-100 分）”“B 级（60-79 分）”“C 级（<60 分）”） |
| score_detail | JSON | \-  | NOT NULL | 评分明细（各维度得分，如 “{‘经营年限’:20,‘种植规模’:15,‘平台交易’:30,‘征信记录’:20}”） |
| data_sources | VARCHAR | 500 | NOT NULL | 数据来源（如 “平台交易记录，农户经营信息，第三方征信数据，货源预估销量”） |
| evaluation_result | TINYINT | 2   | NOT NULL | 评估结果：1 = 通过（信用达标）、2 = 不通过（信用不达标） |
| evaluation_remark | VARCHAR | 500 |     | 评估备注（如 “经营年限 3 年，平台年交易额 50 万，信用良好”“存在逾期记录，信用不达标”） |
| credit_report_url | VARCHAR | 200 |     | 信用报告 URL（生成 PDF 报告，供银行审批参考） |
| report_generate_time | DATETIME | \-  |     | 报告生成时间 |

**第四部分：联合贷款人匹配功能相关表（1 张）**

**表 6：联合贷款人匹配表（financing_joint_loan_match）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| match_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 匹配 ID（自增主键） |
| main_application_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 主申请人申请 ID（发起联合贷款的农户，关联financing_application.application_id） |
| main_user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 主申请人 ID（关联sys_user.user_id） |
| joint_loan_amount | DECIMAL | 15,2 | NOT NULL | 联合贷款总金额（主申请人申请金额 + 联合申请人申请金额，如 “200000.00”） |
| match_status | TINYINT | 2   | NOT NULL DEFAULT 0 | 匹配状态：0 = 待匹配、1 = 匹配中、2 = 匹配完成、3 = 匹配失败 |

**第五部分：灵活还款，放款相关表（4张）**

**表 7：农产品预售计划表 (financing_presale_plan)**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| plan_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 计划 ID |
| plan_no | VARCHAR | 32  | NOT NULL, UNIQUE | 计划编号 (PRE + 年月日 + 8位随机数) |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 发布农户 ID (关联 sys_user) |
| category_id | INT | 10  | NOT NULL, FOREIGN KEY | 农产品品类 ID (关联 mall_product_category) |
| product_name | VARCHAR | 100 | NOT NULL | 预售产品名称 (如 “2026年春季有机番茄”) |
| plant_date | DATE | \-  | NOT NULL | 预计种植日期 |
| expected_harvest_date | DATE | \-  | NOT NULL | 预计收获日期 |
| total_yield_quantity | DECIMAL | 15,2 | NOT NULL | 预计总产量 (kg) |
| presale_unit_price | DECIMAL | 10,2 | NOT NULL | 预售单价 (元/kg，通常低于市场价) |
| deposit_ratio | DECIMAL | 5,2 | NOT NULL | 定金比例 (如 “0.3” 表示30%) |
| subscribed_quantity | DECIMAL | 15,2 | DEFAULT 0 | 已被预订数量 (kg) |
| plan_status | TINYINT | 2   | DEFAULT 0 | 计划状态: 0=草稿, 1=待审核, 2=预售中, 3=预售满额, 4=生产中, 5=已收获, 6=已完成, 7=已取消 |
| audit_status | TINYINT | 2   | DEFAULT 0 | 平台审核状态: 0=待审核, 1=通过, 2=驳回 |
| audit_remark | VARCHAR | 500 |     | 审核意见 |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**表 8：买家预售认购表 (financing_presale_subscription)**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| subscription_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 认购 ID |
| subscription_no | VARCHAR | 32  | NOT NULL, UNIQUE | 认购编号 (SUB + 年月日 + 8位随机数) |
| plan_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联预售计划 ID |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 认购买家 ID (关联 sys_user) |
| subscribed_quantity | DECIMAL | 15,2 | NOT NULL | 认购数量 (kg) |
| deposit_amount | DECIMAL | 15,2 | NOT NULL | 应付定金 (认购数量 \* 单价 \* 比例) |
| payment_status | TINYINT | 2   | DEFAULT 0 | 支付状态: 0=待支付, 1=已支付, 2=已退款 |
| payment_no | VARCHAR | 50  |     | 支付单号 (关联支付网关) |
| subscription_status | TINYINT | 2   | DEFAULT 1 | 认购状态: 1=有效, 0=已取消 |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 认购时间 |

**表 9：融资还款计划表 (financing_repayment_schedule)**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| schedule_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 计划 ID |
| application_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联融资申请 ID ( financing_application ) |
| term_number | INT | 10  | NOT NULL | 还款期数 (如 1, 2, 3...) |
| due_date | DATE | \-  | NOT NULL | 还款截止日期 |
| principal_due | DECIMAL | 15,2 | NOT NULL | 应还本金 |
| interest_due | DECIMAL | 15,2 | NOT NULL | 应还利息 |
| principal_paid | DECIMAL | 15,2 | DEFAULT 0 | 已还本金 |
| interest_paid | DECIMAL | 15,2 | DEFAULT 0 | 已还利息 |
| payment_status | TINYINT | 2   | DEFAULT 0 | 状态: 0=待还款, 1=已还款, 2=逾期, 3=已调整 |
| adjustment_request_id | BIGINT | 20  | FOREIGN KEY | 关联调整申请ID (若此期被调整) |

**表 10：还款计划调整申请表 (financing_repayment_adjustment_request)**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| request_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 申请 ID |
| application_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联融资申请 ID |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 申请农户 ID |
| request_reason | VARCHAR | 500 | NOT NULL | 申请原因 (如 “因天气影响，收获期延后一个月”) |
| proposed_plan_details | TEXT | \-  | NOT NULL | 建议调整方案 (如 “申请将第3、4期本金顺延至第5、6期偿还”) |
| request_status | TINYINT | 2   | DEFAULT 0 | 状态: 0=待银行审批, 1=已批准, 2=已驳回 |
| approver_id | BIGINT | 20  | FOREIGN KEY | 审批人 ID (银行角色用户) |
| approval_remark | VARCHAR | 500 |     | 审批意见 |
| approval_time | DATETIME | \-  |     | 审批时间 |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 申请时间 |