const CouponModel = require('../models/CouponModel');
const Joi = require('joi');

class CouponController {
  static async getAvailableCoupons(req, res) {
    try {
      const coupons = await CouponModel.findAvailableRules();

      res.json({
        code: 200,
        message: '查询成功。',
        data: coupons
      });

    } catch (err) {
      console.error('获取可领取优惠券失败:', err);
      res.status(500).json({
        code: 500,
        message: '查询失败',
        error: '服务器内部错误'
      });
    }
  }

  static async claimCoupon(req, res) {
    try {
      const schema = Joi.object({
        rule_id: Joi.number().integer().required()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '领取失败',
          error: error.details[0].message
        });
      }

      const result = await CouponModel.claimCoupon(req.user.userId, value.rule_id);

      res.json({
        code: 200,
        message: '优惠券领取成功！',
        data: result
      });

    } catch (err) {
      console.error('领取优惠券失败:', err);
      
      if (err.message.includes('已达到') || err.message.includes('不存在') || err.message.includes('失效')) {
        return res.status(409).json({
          code: 409,
          message: '领取失败。',
          error: err.message
        });
      }

      res.status(500).json({
        code: 500,
        message: '领取失败',
        error: '服务器内部错误'
      });
    }
  }

  static async getMyCoupons(req, res) {
    try {
      const { status = 0 } = req.query;
      const coupons = await CouponModel.findUserCoupons(req.user.userId, Number.parseInt(status, 10));

      res.json({
        code: 200,
        message: '查询成功。',
        data: coupons
      });

    } catch (err) {
      console.error('获取我的优惠券失败:', err);
      res.status(500).json({
        code: 500,
        message: '查询失败',
        error: '服务器内部错误'
      });
    }
  }

  static async createCouponRule(req, res) {
    try {
      if (req.user.userType !== 3) {
        return res.status(403).json({
          code: 403,
          message: '只有管理员才能创建优惠券规则'
        });
      }

      const schema = Joi.object({
        coupon_type: Joi.number().integer().valid(1, 2).required(),
        coupon_name: Joi.string().max(100).required(),
        face_value: Joi.number().precision(2).optional(),
        min_use_amount: Joi.number().precision(2).default(0),
        valid_start_time: Joi.date().required(),
        valid_end_time: Joi.date().required(),
        total_quantity: Joi.number().integer().required(),
        obtain_limit: Joi.number().integer().default(1),
        obtain_type: Joi.number().integer().valid(1, 2).default(1)
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '创建失败',
          error: error.details[0].message
        });
      }

      const result = await CouponModel.createRule(value, req.user.userId);

      res.status(201).json({
        code: 201,
        message: '优惠券规则创建成功。',
        data: result
      });

    } catch (err) {
      console.error('创建优惠券规则失败:', err);
      res.status(500).json({
        code: 500,
        message: '创建失败',
        error: '服务器内部错误'
      });
    }
  }

  static async getCouponLogs(req, res) {
    try {
      if (req.user.userType !== 3) {
        return res.status(403).json({
          code: 403,
          message: '只有管理员才能查询优惠券日志'
        });
      }

      const { user_coupon_id, order_id, user_id } = req.query;
      const logs = await CouponModel.findLogs({ user_coupon_id, order_id, user_id });

      res.json({
        code: 200,
        message: '查询日志成功。',
        data: logs
      });

    } catch (err) {
      console.error('查询优惠券日志失败:', err);
      res.status(500).json({
        code: 500,
        message: '查询失败',
        error: '服务器内部错误'
      });
    }
  }
}

module.exports = CouponController;