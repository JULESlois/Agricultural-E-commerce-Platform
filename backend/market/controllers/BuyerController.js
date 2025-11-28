const BuyerModel = require('../models/BuyerModel');
const Joi = require('joi');

class BuyerController {
  static async updateMe(req, res) {
    try {
      if (req.user.userType !== 2) {
        return res.status(403).json({
          code: 403,
          message: '操作失败。',
          error: '只有买家用户才能更新此信息。'
        });
      }

      const schema = Joi.object({
        buyer_type: Joi.number().integer().valid(1, 2).optional(),
        company_name: Joi.string().max(100).optional(),
        company_address: Joi.string().max(200).optional(),
        taxpayer_id: Joi.string().max(50).optional(),
        purchase_scope: Joi.string().max(200).required(),
        monthly_purchase: Joi.number().precision(2).optional(),
        preferred_payment: Joi.number().integer().valid(1, 2).default(1),
        preferred_logistics: Joi.string().max(200).optional()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '更新失败',
          error: error.details[0].message
        });
      }

      if (value.buyer_type === 2 && (!value.company_name || !value.taxpayer_id)) {
        return res.status(400).json({
          code: 400,
          message: '更新失败。',
          error: '企业买家必须提供企业名称和纳税人识别号。'
        });
      }

      const result = await BuyerModel.createOrUpdate(req.user.userId, value);

      res.json({
        code: 200,
        message: '买家信息更新成功。',
        data: result
      });

    } catch (err) {
      console.error('更新买家信息失败:', err);
      res.status(500).json({
        code: 500,
        message: '更新失败',
        error: '服务器内部错误'
      });
    }
  }

  static async getBuyerInfo(req, res) {
    try {
      const userId = Number.parseInt(req.params.user_id, 10);
      const buyer = await BuyerModel.findByUserId(userId);
      
      if (!buyer) {
        return res.status(404).json({
          code: 404,
          message: '买家信息不存在'
        });
      }

      res.json({
        code: 200,
        message: '获取买家信息成功。',
        data: buyer
      });

    } catch (err) {
      console.error('获取买家信息失败:', err);
      res.status(500).json({
        code: 500,
        message: '获取失败',
        error: '服务器内部错误'
      });
    }
  }
}

module.exports = BuyerController;