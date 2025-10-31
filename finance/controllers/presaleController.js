const Joi = require('joi');
const PresalePlan = require('../models/presaleModel');

// 4.1 创建预售计划
exports.createPresalePlan = async (req, res) => {
  try {
    // 参数校验
    const schema = Joi.object({
      category_id: Joi.number().integer().required().messages({
        'any.required': '农产品分类ID为必填项',
        'number.integer': '农产品分类ID必须为整数'
      }),
      product_name: Joi.string().min(2).max(100).required().messages({
        'any.required': '产品名称为必填项',
        'string.min': '产品名称至少2个字符',
        'string.max': '产品名称最多100个字符'
      }),
      plant_date: Joi.date().required().messages({
        'any.required': '种植日期为必填项',
        'date.base': '种植日期格式不正确'
      }),
      expected_harvest_date: Joi.date().greater(Joi.ref('plant_date')).required().messages({
        'any.required': '预计收获日期为必填项',
        'date.base': '预计收获日期格式不正确',
        'date.greater': '预计收获日期必须晚于种植日期'
      }),
      total_yield_quantity: Joi.number().positive().required().messages({
        'any.required': '总产量为必填项',
        'number.positive': '总产量必须为正数'
      }),
      presale_unit_price: Joi.number().positive().required().messages({
        'any.required': '预售单价为必填项',
        'number.positive': '预售单价必须为正数'
      }),
      deposit_ratio: Joi.number().min(0.1).max(1).required().messages({
        'any.required': '定金比例为必填项',
        'number.min': '定金比例不能低于10%',
        'number.max': '定金比例不能超过100%'
      })
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ code: 400, message: error.details[0].message });
    }

    // 获取当前农户ID
    const farmerId = req.user.userId;

    // 创建预售计划
    const newPlan = await PresalePlan.create({
      farmer_id: farmerId,
      category_id: value.category_id,
      product_name: value.product_name,
      plant_date: value.plant_date,
      expected_harvest_date: value.expected_harvest_date,
      total_yield_quantity: value.total_yield_quantity,
      presale_unit_price: value.presale_unit_price,
      deposit_ratio: value.deposit_ratio,
      presale_status: 1 // 1=待审核
    });

    return res.status(201).json({
      code: 201,
      message: '预售计划已提交，等待平台审核。',
      data: {
        plan_id: newPlan.plan_id,
        presale_status: newPlan.presale_status
      }
    });
  } catch (error) {
    console.error('创建预售计划失败：', error);
    return res.status(500).json({
      code: 500,
      message: '服务器异常，创建预售计划失败'
    });
  }
};

// 4.2 获取我的预售计划列表
exports.getMyPresalePlans = async (req, res) => {
  try {
    const farmerId = req.user.userId;

    // 查询当前农户的所有预售计划
    const plans = await PresalePlan.findAll({
      where: { farmer_id: farmerId },
      attributes: [
        'plan_id', 'product_name', 'total_yield_quantity',
        'presale_unit_price', 'deposit_ratio', 'presale_status',
        'plant_date', 'expected_harvest_date', 'create_time'
      ],
      order: [['create_time', 'DESC']]
    });

    // 格式化响应数据
    const formattedData = plans.map(plan => ({
      plan_id: plan.plan_id,
      product_name: plan.product_name,
      total_yield_quantity: plan.total_yield_quantity,
      presale_unit_price: plan.presale_unit_price,
      deposit_ratio: plan.deposit_ratio,
      presale_status: plan.presale_status,
      plant_date: plan.plant_date.toISOString().split('T')[0], // 只返回日期部分
      expected_harvest_date: plan.expected_harvest_date.toISOString().split('T')[0],
      create_time: plan.create_time.toISOString()
    }));

    return res.status(200).json({
      code: 200,
      message: '查询成功。',
      data: formattedData
    });
  } catch (error) {
    console.error('获取预售计划列表失败：', error);
    return res.status(500).json({
      code: 500,
      message: '服务器异常，获取预售计划列表失败'
    });
  }
};

// 4.3 获取预售计划详情
exports.getPresalePlanDetail = async (req, res) => {
  try {
    const { plan_id } = req.params;
    
    if (isNaN(plan_id)) {
      return res.status(400).json({ code: 400, message: '预售计划ID必须为有效数字' });
    }

    // 查询预售计划详情
    const plan = await PresalePlan.findByPk(plan_id);
    if (!plan) {
      return res.status(404).json({ code: 404, message: '未找到该预售计划' });
    }

    // 格式化响应数据
    const responseData = {
      plan_id: plan.plan_id,
      farmer_id: plan.farmer_id,
      category_id: plan.category_id,
      product_name: plan.product_name,
      plant_date: plan.plant_date.toISOString().split('T')[0],
      expected_harvest_date: plan.expected_harvest_date.toISOString().split('T')[0],
      total_yield_quantity: plan.total_yield_quantity,
      presale_unit_price: plan.presale_unit_price,
      deposit_ratio: plan.deposit_ratio,
      presale_status: plan.presale_status,
      create_time: plan.create_time.toISOString()
    };

    return res.status(200).json({
      code: 200,
      message: '查询成功。',
      data: responseData
    });
  } catch (error) {
    console.error('获取预售计划详情失败：', error);
    return res.status(500).json({
      code: 500,
      message: '服务器异常，获取预售计划详情失败'
    });
  }
};