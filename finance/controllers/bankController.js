const Joi = require('joi');
const FinancingApplication = require('../models/applicationModel');
const CreditEvaluation = require('../models/creditModel');
const LoanType = require('../models/loanModel');


// 3.1 获取待审批的申请列表
exports.getPendingApplications = async (req, res) => {
  try {
    const { status } = req.query;
    // 仅允许查询"待银行审批"（状态码 2）的申请
    if (status !== '2') {
      return res.status(400).json({ code: 400, message: '仅支持查询状态为"待银行审批"的申请' });
    }

    // 查询待审批申请（关联贷款类型和信用分数）
    const applications = await FinancingApplication.findAll({
      where: { application_status: 2 },
      include: [
        { model: LoanType, as: 'loanType', attributes: ['loan_type_name'] },
        { model: CreditEvaluation, as: 'creditEvaluation', attributes: ['credit_score'] }
      ],
      attributes: [
        'application_id', 'application_no', 'apply_amount',
        'apply_term', 'create_time'
      ]
    });

    // 格式化响应
    const formattedData = applications.map(app => ({
      application_id: app.application_id,
      application_no: app.application_no,
      loan_type_name: app.loanType.loan_type_name,
      apply_amount: app.apply_amount,
      apply_term: app.apply_term,
      credit_score: app.creditEvaluation?.credit_score || 0,
      create_time: app.create_time.toISOString()
    }));

    return res.status(200).json({
      code: 200,
      message: '查询成功。',
      data: formattedData
    });
  } catch (error) {
    console.error('获取待审批列表失败：', error);
    return res.status(500).json({ code: 500, message: '服务器异常，获取审批列表失败' });
  }
};

// 3.2 获取申请详情以供审批
exports.getApplicationDetail = async (req, res) => {
  try {
    const { application_id } = req.params;
    
    if (isNaN(application_id)) {
      return res.status(400).json({ code: 400, message: '申请ID必须为有效数字' });
    }

    // 查询申请详情，包含关联的信用评估和贷款类型信息
    const application = await FinancingApplication.findByPk(application_id, {
      include: [
        { 
          model: LoanType, 
          as: 'loanType',
          attributes: ['loan_type_name', 'loan_purpose', 'min_interest_rate']
        },
        { 
          model: CreditEvaluation, 
          as: 'creditEvaluation',
          attributes: ['credit_score', 'credit_level', 'evaluation_remark', 'credit_report_url', 'score_detail']
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ code: 404, message: '未找到该融资申请' });
    }

    // 格式化响应数据
    const responseData = {
      application_info: {
        application_id: application.application_id,
        application_no: application.application_no,
        farmer_id: application.farmer_id,
        loan_type_id: application.loan_type_id,
        loan_type_name: application.loanType?.loan_type_name,
        apply_amount: application.apply_amount,
        apply_term: application.apply_term,
        loan_purpose_detail: application.loan_purpose_detail,
        repayment_plan: application.repayment_plan,
        bank_id: application.bank_id,
        material_urls: JSON.parse(application.material_urls || '[]'),
        application_status: application.application_status,
        create_time: application.create_time.toISOString()
      },
      credit_evaluation: application.creditEvaluation ? {
        credit_score: application.creditEvaluation.credit_score,
        credit_level: application.creditEvaluation.credit_level,
        evaluation_remark: application.creditEvaluation.evaluation_remark,
        credit_report_url: application.creditEvaluation.credit_report_url,
        score_detail: application.creditEvaluation.score_detail
      } : null,
      user_info: {
        farmer_id: application.farmer_id
        // 这里应该关联用户表获取更多用户信息，暂时简化
      }
    };

    return res.status(200).json({
      code: 200,
      message: '查询成功。',
      data: responseData
    });
  } catch (error) {
    console.error('获取申请详情失败：', error);
    return res.status(500).json({ code: 500, message: '获取申请详情失败：' + error.message });
  }
};

// 3.3 提交审批结论
exports.submitApprovalResult = async (req, res) => {
  try {
    const { application_id } = req.params;
    
    // 参数校验
    const schema = Joi.object({
      approval_result: Joi.number().integer().valid(1, 0).required().messages({
        'any.required': '审批结果为必填项',
        'any.only': '审批结果只能为1（通过）或0（驳回）'
      }),
      approval_amount: Joi.when('approval_result', {
        is: 1,
        then: Joi.number().positive().required().messages({
          'any.required': '审批通过时批准金额为必填项',
          'number.positive': '批准金额必须为正数'
        }),
        otherwise: Joi.optional()
      }),
      approval_term: Joi.when('approval_result', {
        is: 1,
        then: Joi.number().integer().min(1).required().messages({
          'any.required': '审批通过时批准期限为必填项',
          'number.min': '批准期限至少为1个月'
        }),
        otherwise: Joi.optional()
      }),
      interest_rate: Joi.when('approval_result', {
        is: 1,
        then: Joi.number().positive().required().messages({
          'any.required': '审批通过时利率为必填项',
          'number.positive': '利率必须为正数'
        }),
        otherwise: Joi.optional()
      }),
      approval_remark: Joi.string().min(5).required().messages({
        'any.required': '审批备注为必填项',
        'string.min': '审批备注至少5个字符'
      })
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ code: 400, message: error.details[0].message });
    }

    // 验证申请是否存在且状态正确
    const application = await FinancingApplication.findByPk(application_id);
    if (!application) {
      return res.status(404).json({ code: 404, message: '未找到该融资申请' });
    }

    if (application.application_status !== 2) {
      return res.status(400).json({ code: 400, message: '该申请当前状态不允许审批' });
    }

    // 更新申请状态和审批信息
    const updateData = {
      application_status: value.approval_result === 1 ? 3 : 5, // 3=审批通过，5=已驳回
      approval_result: value.approval_result,
      approval_remark: value.approval_remark,
      approval_time: new Date()
    };

    if (value.approval_result === 1) {
      updateData.approval_amount = value.approval_amount;
      updateData.approval_term = value.approval_term;
      updateData.interest_rate = value.interest_rate;
    }

    await application.update(updateData);

    return res.status(200).json({
      code: 200,
      message: value.approval_result === 1 ? '审批通过，等待放款。' : '审批已驳回。'
    });
  } catch (error) {
    console.error('提交审批结论失败：', error);
    return res.status(500).json({ code: 500, message: '提交审批结论失败：' + error.message });
  }
};

// 3.4 确认放款
exports.confirmDisburse = async (req, res) => {
  try {
    const { application_id } = req.params;
    
    // 参数校验
    const schema = Joi.object({
      disburse_amount: Joi.number().positive().required().messages({
        'any.required': '放款金额为必填项',
        'number.positive': '放款金额必须为正数'
      }),
      disburse_account: Joi.string().min(10).required().messages({
        'any.required': '放款账户为必填项',
        'string.min': '放款账户至少10个字符'
      }),
      disburse_remark: Joi.string().optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ code: 400, message: error.details[0].message });
    }

    // 验证申请是否存在且状态正确
    const application = await FinancingApplication.findByPk(application_id);
    if (!application) {
      return res.status(404).json({ code: 404, message: '未找到该融资申请' });
    }

    if (application.application_status !== 3) {
      return res.status(400).json({ code: 400, message: '该申请当前状态不允许放款' });
    }

    // 更新申请状态为已放款
    await application.update({
      application_status: 4, // 4=已放款
      disburse_amount: value.disburse_amount,
      disburse_account: value.disburse_account,
      disburse_remark: value.disburse_remark,
      disburse_time: new Date()
    });

    return res.status(200).json({
      code: 200,
      message: '放款确认成功。'
    });
  } catch (error) {
    console.error('确认放款失败：', error);
    return res.status(500).json({ code: 500, message: '确认放款失败：' + error.message });
  }
};
// 新增：查询农户信用报告
exports.getFarmerCreditReport = async (req, res) => {
  try {
    const { farmer_id } = req.params;
    
    if (isNaN(farmer_id)) {
      return res.status(400).json({ code: 400, message: '农户ID必须为有效数字' });
    }

    // 模拟查询信用报告
    return res.status(200).json({
      code: 200,
      message: '查询成功',
      report: {
        farmer_id: parseInt(farmer_id),
        credit_score: 680,
        credit_level: '良好',
        evaluation_date: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('查询农户信用报告失败：', error);
    return res.status(500).json({ code: 500, message: '服务器异常，查询信用报告失败' });
  }
};