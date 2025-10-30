**API文档 （融资服务）**

**第一部分：融资申请 API (农户用户)**

**1.1. 获取贷款产品列表**

**功能**: 农户用户查看当前所有可申请的贷款类型。

**HTTP 方法**: GET

**Endpoint**: /api/financing/loan-types

**响应 (Output)**:

**成功 (HTTP 200 OK)**:

Plain Text  
{  
"code": 200,  
"message": "查询成功。",  
"data": \[  
{  
"loan_type_id": 1,  
"loan_type_name": "种植周转贷",  
"loan_purpose": "用于小麦种植期间化肥、农药采购资金周转",  
"min_loan_amount": "10000.00",  
"max_loan_amount": "500000.00",  
"min_loan_term": 3,  
"max_loan_term": 12,  
"loan_term_type": 2, // 2 = 按月"min_interest_rate": "0.0435"  
}  
\]  
}

**1.2. 获取贷款产品详情**

**功能**: 查看某个特定贷款产品的详细要求，如所需材料、支持银行等。

**HTTP 方法**: GET

**Endpoint**: /api/financing/loan-types/{loan_type_id}

**响应 (Output)**:

**成功 (HTTP 200 OK)**:

Plain Text  
{  
"code": 200,  
"message": "查询成功。",  
"data": {  
"loan_type_id": 1,  
"loan_type_name": "种植周转贷",  
// ... (financing_loan_type 表的所有字段)"required_materials": "身份证,种植证明,银行流水",  
"support_banks": "中国农业银行,中国邮政储蓄银行"  
}  
}

**1.3. 创建融资申请**

**功能**: 农户用户选择一个贷款产品并发起一个新的融资申请。

**HTTP 方法**: POST

**Endpoint**: /api/farmer/financing/applications

**请求 (Input)**:

**Headers**: Authorization: Bearer {farmer_token}

**Body**:

Plain Text  
{  
"loan_type_id": 1,  
"apply_amount": "100000.00",  
"apply_term": 6,  
"loan_purpose_detail": "用于2025年冬小麦种植，采购化肥5吨、农药200kg",  
"repayment_plan": "预计2026年5月小麦收获后，通过平台销售回款还款",  
"bank_id": 101,  
"material_urls": "\[\\"https://.../id_card.jpg\\", \\"https://.../proof.pdf\\"\]"  
}

**响应 (Output)**:

**成功 (HTTP 201 Created)**:

Plain Text  
{  
"code": 201,  
"message": "申请已提交，等待平台信用评估。",  
"data": {  
"application_id": 501,  
"application_no": "FIN2025102712345678",  
"application_status": 1 // 1 = 待信用评估  
}  
}

**1.4. 获取我的融资申请列表**

**功能**: 农户查看自己所有的融资申请及其当前状态。

**HTTP 方法**: GET

**Endpoint**: /api/farmer/financing/applications

**响应 (Output)**:

**成功 (HTTP 200 OK)**:

Plain Text  
{  
"code": 200,  
"message": "查询成功。",  
"data": \[  
{  
"application_id": 501,  
"application_no": "FIN2025102712345678",  
"loan_type_name": "种植周转贷",  
"apply_amount": "100000.00",  
"application_status": 2, // 2 = 待银行审批"create_time": "2025-10-27T10:00:00Z"  
}  
\]  
}

**第二部分：信用评估 API (平台内部)**

**2.1. 触发信用评估**

**功能**: (内部API) 在农户提交申请后，系统自动或由管理员手动触发对该申请的信用评估。

**HTTP 方法**: POST

**Endpoint**: /api/internal/financing/applications/{application_id}/evaluate

**响应 (Output)**:

**成功 (HTTP 202 Accepted)**:

Plain Text  
{  
"code": 202,  
"message": "信用评估任务已启动。"  
}

**2.2. 接收评估结果**

**功能**: (内部API) 信用评估系统完成评估后，调用此API将结果写回数据库。

**HTTP 方法**: POST

**Endpoint**: /api/internal/financing/credit-evaluations

**请求 (Input)**:

**Body**:

Plain Text  
{  
"application_id": 501,  
"credit_score": 85,  
"credit_level": "A级",  
"score_detail": "{\\"经营年限\\":20, \\"平台交易\\":30, ...}",  
"evaluation_result": 1, // 1 = 通过"evaluation_remark": "信用良好",  
"credit_report_url": "https://.../report.pdf"  
}

**响应 (Output)**:

**成功 (HTTP 200 OK)**:

Plain Text  
{  
"code": 200,  
"message": "评估结果已记录，申请状态已更新为“待银行审批”。"  
}

**第三部分：银行审批 API (银行用户)**

**3.1. 获取待审批的申请列表**

**功能**: 银行审批人员登录后，查看分配给本银行且通过了信用评估的贷款申请。

**HTTP 方法**: GET

**Endpoint**: /api/bank/financing/applications?status=2

**请求 (Input)**:

**Headers**: Authorization: Bearer {bank_user_token}

**响应 (Output)**:

**成功 (HTTP 200 OK)**:

Plain Text  
{  
"code": 200,  
"message": "查询成功。",  
"data": \[  
{  
"application_id": 501,  
"application_no": "FIN2025102712345678",  
"applicant_name": "张三", // 关联sys_user.real_name"loan_type_name": "种植周转贷",  
"apply_amount": "100000.00",  
"apply_term": 6,  
"credit_score": 85  
}  
\]  
}

**3.2. 获取申请详情以供审批**

**功能**: 银行审批人员查看申请的全部详情，包括用户提交的材料和平台的信用报告。

**HTTP 方法**: GET

**Endpoint**: /api/bank/financing/applications/{application_id}

**响应 (Output)**:

**成功 (HTTP 200 OK)**:

Plain Text  
{  
"code": 200,  
"message": "查询成功。",  
"data": {  
"application_info": { /\* financing_application 的所有信息 \*/ },  
"credit_evaluation": {  
"credit_score": 85,  
"credit_level": "A级",  
"evaluation_remark": "信用良好",  
"credit_report_url": "https://.../report.pdf"  
},  
"user_info": { /\* 申请人的基础信息 \*/ }  
}  
}

**3.3. 提交审批结论**

**功能**: 银行审批人员提交审批结果（通过或驳回）。

**HTTP 方法**: POST

**Endpoint**: /api/bank/financing/applications/{application_id}/review

**请求 (Input)**:

**Headers**: Authorization: Bearer {bank_user_token}

**Body** (示例: 审批通过):

Plain Text  
{  
"approval_result": 1, // 1 = 通过"approval_amount": "80000.00",  
"approval_term": 6,  
"interest_rate": "0.052",  
"repayment_method": "按月付息，到期还本",  
"approval_remark": "申请人信用良好，同意放款8万元。",  
"loan_contract_url": "https://.../contract_template.pdf"  
}

**响应 (Output)**:

**成功 (HTTP 200 OK)**:

Plain Text  
{  
"code": 200,  
"message": "审批结论已提交，申请状态已更新为“审批通过”。"  
}

**3.4. 确认放款**

**功能**: 银行在完成线下放款后，在系统中标记该笔申请为“已放款”。

**HTTP 方法**: POST

**Endpoint**: /api/bank/financing/applications/{application_id}/disburse

**请求 (Input)**:

**Headers**: Authorization: Bearer {bank_user_token}

**Body**:

Plain Text  
{  
"loan_time": "2025-11-05T15:00:00Z"  
}

**响应 (Output)**:

**成功 (HTTP 200 OK)**:

Plain Text  
{  
"code": 200,  
"message": "放款状态更新成功。"  
}

**第四部分：预售计划与认购 API**

**4.1. 创建农产品预售计划**

**功能**: 农户创建一个新的农产品预售计划。

**HTTP 方法**: POST

**Endpoint**: /api/farmer/presale-plans

**请求 (Input)**:

Plain Text  
{  
"category_id": 101,  
"product_name": "2026年春季中牟大蒜",  
"plant_date": "2025-10-15",  
"expected_harvest_date": "2026-05-20",  
"total_yield_quantity": 50000.00,  
"presale_unit_price": 4.50,  
"deposit_ratio": 0.3  
}

**响应 (Output)**:

**成功 (HTTP 201 Created)**: {"code": 201, "message": "预售计划已提交，等待平台审核。", "data": {"plan_id": 1}}

**4.2. 查看预售农产品**

**功能**: 买家查看当前所有处于“预售中”的计划。

**HTTP 方法**: GET

**Endpoint**: /api/presale-plans

**响应 (Output)**:

**成功 (HTTP 200 OK)**:

Plain Text  
{  
"code": 200, "message": "查询成功。",  
"data": \[  
{  
"plan_id": 1, "product_name": "2026年春季中牟大蒜",  
"presale_unit_price": "4.50", "deposit_ratio": "0.3",  
"progress": "40%" // (subscribed_quantity / total_yield_quantity)  
}  
\]  
}

**4.3.预售农产品下单**

**功能**: 买家对一个预售计划下单，并支付定金。

**HTTP 方法**: POST

**Endpoint**: /api/buyer/presale-subscriptions

**请求 (Input)**:

Plain Text  
{  
"plan_id": 1,  
"subscribed_quantity": 1000.00  
}

**响应 (Output)**:

**成功 (HTTP 201 Created)**: {"code": 201, "message": "认购成功，请支付定金。", "data": {"subscription_id": 101, "deposit_amount": "1350.00", "payment_info": {...}}}

**第五部分：融资与还款调整 API**

**5.1.生成预售还款计划表**

**功能**: 当一个预售计划“预售满额”或达到一定条件后，系统自动将所有买家定金汇总，为农户创建一笔“预售融资”类型的 financing_application 记录，并生成初始的 financing_repayment_schedule。

**触发方式**: 内部事件驱动，无直接API。

**功能**: 农户查看某笔贷款的详细还款时间表。

**HTTP 方法**: GET

**Endpoint**: /api/farmer/financing/applications/{application_id}/repayment-schedule

**响应 (Output)**:

**成功 (HTTP 200 OK)**:

Plain Text  
{  
"code": 200, "message": "查询成功。",  
"data": \[  
{"term_number": 1, "due_date": "2026-03-31", "principal_due": "0.00", "interest_due": "150.00", "payment_status": 0},  
{"term_number": 2, "due_date": "2026-04-30", "principal_due": "0.00", "interest_due": "150.00", "payment_status": 0},  
{"term_number": 3, "due_date": "2026-05-31", "principal_due": "20000.00", "interest_due": "150.00", "payment_status": 0}  
\]  
}

**5.2.申请调整还款计划**

**功能**: 农户对一笔还款中的贷款，发起还款计划调整申请。

**HTTP 方法**: POST

**Endpoint**: /api/farmer/repayment-adjustment-requests

**请求 (Input)**:

Plain Text  
{  
"application_id": 505,  
"request_reason": "因遭遇倒春寒，预计收获期延后20天，申请将5月到期的本金顺延至6月。",  
"proposed_plan_details": "将第3期20000元本金，平均分配至第4、5、6期偿还。"  
}

**响应 (Output)**:

**成功 (HTTP 201 Created)**: {"code": 201, "message": "调整申请已提交，等待银行审批。"}

**5.3.审批还款计划变更**

**功能**: 银行审批人员审核农户提交的还款计划调整申请。

**HTTP 方法**: POST

**Endpoint**: /api/bank/repayment-adjustment-requests/{request_id}/review

**请求 (Input)**:

Plain Text  
{  
"request_status": 1, // 1=批准, 2=驳回"approval_remark": "情况属实，批准该调整申请。系统将自动更新还款计划。"  
}

**响应 (Output)**:

**成功 (HTTP 200 OK)**: {"code": 200, "message": "审批完成。"}