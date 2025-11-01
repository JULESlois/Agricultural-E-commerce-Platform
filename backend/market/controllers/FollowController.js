const FollowModel = require('../models/FollowModel');
const Joi = require('joi');

class FollowController {
  static async followSeller(req, res) {
    try {
      if (req.user.userType !== 2) {
        return res.status(403).json({
          code: 403,
          message: '只有买家用户才能关注卖家'
        });
      }

      const schema = Joi.object({
        seller_id: Joi.number().integer().required(),
        follow_remark: Joi.string().max(200).optional()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '关注失败',
          error: error.details[0].message
        });
      }

      const result = await FollowModel.followSeller(
        req.user.userId, 
        value.seller_id, 
        value.follow_remark
      );

      res.status(201).json({
        code: 201,
        message: '关注成功。',
        data: result
      });

    } catch (err) {
      console.error('关注卖家失败:', err);
      
      if (err.message.includes('已关注') || err.message.includes('不存在')) {
        return res.status(400).json({
          code: 400,
          message: '关注失败',
          error: err.message
        });
      }

      res.status(500).json({
        code: 500,
        message: '关注失败',
        error: '服务器内部错误'
      });
    }
  }

  static async unfollowSeller(req, res) {
    try {
      const sellerId = Number.parseInt(req.params.seller_id, 10);
      const result = await FollowModel.unfollowSeller(req.user.userId, sellerId);

      if (!result) {
        return res.status(404).json({
          code: 404,
          message: '未关注该卖家'
        });
      }

      res.status(204).send();

    } catch (err) {
      console.error('取消关注失败:', err);
      res.status(500).json({
        code: 500,
        message: '取消关注失败',
        error: '服务器内部错误'
      });
    }
  }

  static async getFollowedSellers(req, res) {
    try {
      const sellers = await FollowModel.findFollowedSellers(req.user.userId);

      res.json({
        code: 200,
        message: '查询成功。',
        data: sellers
      });

    } catch (err) {
      console.error('获取关注列表失败:', err);
      res.status(500).json({
        code: 500,
        message: '查询失败',
        error: '服务器内部错误'
      });
    }
  }
}

module.exports = FollowController;