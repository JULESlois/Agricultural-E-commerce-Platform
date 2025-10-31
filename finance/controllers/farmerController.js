const Joi = require('joi');
const LoanType = require('../models/loanModel');
const FinancingApplication = require('../models/applicationModel');

// 1.1 获取贷款产品列表
exports.getLoanTypes = async (req, res) => {
  try {
    const loanTypes = await LoanType.findAll({
      attributes: [
        'loan_type_id', 'loan_type_name', 'loan_purpose',
        'min_loan_amount', 'max_loan_amount', 'min_loan_term',
        'max_loan_term', 'loan_term_type', 'min_interest_rate'
      ]
    });

    return res.status(200).json({
      code: 200,
      message: '查询成功。',
      data: loanTypes
    });
  } catch (error) {
    console.error('获取贷款列表失败：', error);
    return res.status(500).json({
      code: 500,
      message: '服务器异常，获取贷款列表失败'
    });
  }
};

// 1.2 获取贷款产品详情
exports.getLoanTypeDetail = async (req, res) => {
  try {
    // 参数校验（贷款类型ID必须为数字）
    const { loan_type_id } = req.params;
    if (isNaN(loan_type_id)) {
      return res.status(400).json({ code: 400, message: '贷款类型ID必须为有效数字' });
    }

    // 查询贷款详情
    const loanType = await LoanType.findByPk(loan_type_id);
    if (!loanType) {
      return res.status(404).json({ code: 404, message: '未找到该贷款产品' });
    }

    return res.status(200).json({
      code: 200,
      message: '查询成功。',
      data: loanType
    });
  } catch (error) {
    console.error('获取贷款详情失败：', error);
    return res.status(500).json({
      code: 500,
      message: '服务器异常，获取贷款详情失败'
    });
  }
};

// 1.3 创建融资申请（需农户鉴权）
exports.createApplication = async (req, res) => {
  try {
    // 1. 参数校验（使用 Joi 确保数据合法性）
    const schema = Joi.object({
      loan_type_id: Joi.number().integer().required().message('贷款类型ID为必填项'),
      apply_amount: Joi.number().precision(2).positive().required().message('申请金额必须为正数'),
      apply_term: Joi.number().integer().min(3).max(12).required().message('申请期限需在3-12个月之间'),
      loan_purpose_detail: Joi.string().min(10).required().message('贷款用途详情至少10个字符'),
      repayment_plan: Joi.string().min(10).required().message('还款计划至少10个字符'),
      bank_id: Joi.number().integer().required().message('银行ID为必填项'),
      material_urls: Joi.array().items(Joi.string().uri()).min(1).required().message('至少上传1个材料URL')
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ code: 400, message: error.details[0].message });
    }

    // 2. 获取当前农户ID（从鉴权中间件的 req.user 中获取）
    const farmerId = req.user.userId;

    // 3. 生成申请编号（格式：FIN+YYYYMMDD+8位随机数）
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    const applicationNo = `FIN${dateStr}${randomStr}`;

    // 4. 插入融资申请数据到数据库
    const newApplication = await FinancingApplication.create({
      application_no: applicationNo,
      farmer_id: farmerId,
      loan_type_id: value.loan_type_id,
      apply_amount: value.apply_amount,
      apply_term: value.apply_term,
      loan_purpose_detail: value.loan_purpose_detail,
      repayment_plan: value.repayment_plan,
      bank_id: value.bank_id,
      material_urls: JSON.stringify(value.material_urls), // 转为 JSON 字符串存储
      application_status: 1 // 初始状态：待信用评估
    });

    // 5. 返回成功响应
    return res.status(201).json({
      code: 201,
      message: '申请已提交，等待平台信用评估。',
      data: {
        application_id: newApplication.application_id,
        application_no: newApplication.application_no,
        application_status: newApplication.application_status
      }
    });
  } catch (error) {
    console.error('创建融资申请失败：', error);
    return res.status(500).json({
      code: 500,
      message: '服务器异常，创建融资申请失败'
    });
  }
};

// 1.4 获取我的融资申请列表（需农户鉴权）
exports.getMyApplications = async (req, res) => {
  try {
    const farmerId = req.user.userId;

    // 查询当前农户的所有申请（关联贷款类型名称）
    const applications = await FinancingApplication.findAll({
      where: { farmer_id: farmerId },
      include: [{
        model: LoanType,
        as: 'loanType',
        attributes: ['loan_type_name'] // 仅获取贷款类型名称
      }],
      attributes: [
        'application_id', 'application_no', 'apply_amount',
        'application_status', 'create_time'
      ],
      order: [['create_time', 'DESC']] // 按创建时间倒序
    });

    // 格式化响应数据
    const formattedData = applications.map(app => ({
      application_id: app.application_id,
      application_no: app.application_no,
      loan_type_name: app.loanType.loan_type_name,
      apply_amount: app.apply_amount,
      application_status: app.application_status,
      create_time: app.create_time.toISOString() // 转为 ISO 时间格式
    }));

    return res.status(200).json({
      code: 200,
      message: '查询成功。',
      data: formattedData
    });
  } catch (error) {
    console.error('获取我的申请列表失败：', error);
    return res.status(500).json({
      code: 500,
      message: '服务器异常，获取申请列表失败'
    });
  }
};

// 1.5 获取我的融资申请详情（需农户鉴权）
exports.getMyApplicationDetail = async (req, res) => {
  try {
    const { application_id } = req.params;
    const farmerId = req.user.userId;
    
    if (isNaN(application_id)) {
      return res.status(400).json({ code: 400, message: '申请ID必须为有效数字' });
    }

    // 查询申请详情，确保只能查看自己的申请
    const application = await FinancingApplication.findOne({
      where: { 
        application_id: application_id,
        farmer_id: farmerId 
      },
      include: [{
        model: LoanType,
        as: 'loanType',
        attributes: ['loan_type_name', 'loan_purpose']
      }]
    });

    if (!application) {
      return res.status(404).json({ code: 404, message: '未找到该融资申请' });
    }

    // 格式化响应数据
    const responseData = {
      application_id: application.application_id,
      application_no: application.application_no,
      loan_type_name: application.loanType.loan_type_name,
      apply_amount: application.apply_amount,
      apply_term: application.apply_term,
      loan_purpose_detail: application.loan_purpose_detail,
      repayment_plan: application.repayment_plan,
      material_urls: JSON.parse(application.material_urls || '[]'),
      application_status: application.application_status,
      approval_amount: application.approval_amount,
      approval_term: application.approval_term,
      interest_rate: application.interest_rate,
      approval_remark: application.approval_remark,
      disburse_amount: application.disburse_amount,
      create_time: application.create_time.toISOString(),
      approval_time: application.approval_time ? application.approval_time.toISOString() : null,
      disburse_time: application.disburse_time ? application.disburse_time.toISOString() : null
    };

    return res.status(200).json({
      code: 200,
      message: '查询成功。',
      data: responseData
    });
  } catch (error) {
    console.error('获取申请详情失败：', error);
    return res.status(500).json({
      code: 500,
      message: '服务器异常，获取申请详情失败'
    });
  }
};
