const FarmerModel = require('../models/FarmerModel');
const Joi = require('joi');

class FarmerController {
  static async updateMe(req, res) {
    try {
      if (req.user.userType !== 1) {
        return res.status(403).json({
          code: 403,
          message: '操作失败。',
          error: '只有农户用户才能更新此信息。'
        });
      }

      const schema = Joi.object({
        farm_name: Joi.string().max(100).optional(),
        contact_person: Joi.string().max(50).optional(),
        contact_phone: Joi.string().pattern(/^1[3-9]\d{9}$/).optional(),
        bank_card_no: Joi.string().max(200).optional(),
        bank_name: Joi.string().max(100).optional(),
        qualification: Joi.string().max(1000).optional()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '更新失败',
          error: error.details[0].message
        });
      }

      const result = await FarmerModel.createOrUpdate(req.user.userId, value);

      res.json({
        code: 200,
        message: '农户信息更新成功。',
        data: result
      });

    } catch (err) {
      console.error('更新农户信息失败:', err);
      res.status(500).json({
        code: 500,
        message: '更新失败',
        error: '服务器内部错误'
      });
    }
  }

  static async getFarmerInfo(req, res) {
    try {
      const userId = Number.parseInt(req.params.user_id, 10);
      const isOwner = req.user && req.user.userId === userId;
      const isAdmin = req.user && req.user.userType === 3;

      const farmer = await FarmerModel.findByUserId(userId, isOwner || isAdmin);
      
      if (!farmer) {
        return res.status(404).json({
          code: 404,
          message: '农户信息不存在'
        });
      }

      res.json({
        code: 200,
        message: '获取农户信息成功。',
        data: farmer
      });

    } catch (err) {
      console.error('获取农户信息失败:', err);
      res.status(500).json({
        code: 500,
        message: '获取失败',
        error: '服务器内部错误'
      });
    }
  }
}

module.exports = FarmerController;