const AftersaleModel = require('../models/AftersaleModel');
const OrderModel = require('../models/OrderModel');
const Joi = require('joi');

class AftersaleController {
  static async applyAftersale(req, res) {
    try {
      if (req.user.userType !== 2) {
        return res.status(403).json({
          code: 403,
          message: '只有买家用户才能申请售后'
        });
      }

      const orderId = req.params.order_id;
      
      // 检查订单是否存在且属于当前买家
      const order = await OrderModel.findById(orderId);
      if (!order || order.buyer_id !== req.user.userId) {
        return res.status(403).json({
          code: 403,
          message: '无权对此订单申请售后'
        });
      }

      if (order.order_status !== 4) {
        return res.status(400).json({
          code: 400,
          message: '只有已完成的订单才能申请售后'
        });
      }

      const schema = Joi.object({
        aftersale_type: Joi.number().integer().valid(1, 2).required(),
        apply_amount: Joi.number().precision(2).min(0).required(),
        reason: Joi.string().max(500).required(),
        proof_images: Joi.string().max(500).optional()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '申请失败',
          error: error.details[0].message
        });
      }

      const result = await AftersaleModel.create({
        order_id: orderId,
        apply_user: req.user.userId,
        ...value
      });

      res.status(201).json({
        code: 201,
        message: '售后申请已提交，等待平台审核。',
        data: result
      });

    } catch (err) {
      console.error('申请售后失败:', err);
      res.status(500).json({
        code: 500,
        message: '申请失败',
        error: '服务器内部错误'
      });
    }
  }

  static async reviewAftersale(req, res) {
    try {
      if (req.user.userType !== 3) {
        return res.status(403).json({
          code: 403,
          message: '只有管理员才能审核售后申请'
        });
      }

      const aftersaleId = req.params.aftersale_id;
      
      const schema = Joi.object({
        audit_status: Joi.number().integer().valid(1, 2).required(),
        audit_remark: Joi.string().max(500).optional()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '审核失败',
          error: error.details[0].message
        });
      }

      const result = await AftersaleModel.review(aftersaleId, {
        audit_user: req.user.userId,
        ...value
      });

      if (!result) {
        return res.status(404).json({
          code: 404,
          message: '售后申请不存在'
        });
      }

      res.json({
        code: 200,
        message: '售后审核操作成功。'
      });

    } catch (err) {
      console.error('审核售后失败:', err);
      res.status(500).json({
        code: 500,
        message: '审核失败',
        error: '服务器内部错误'
      });
    }
  }
}

module.exports = AftersaleController;