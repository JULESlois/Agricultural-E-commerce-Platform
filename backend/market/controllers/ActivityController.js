const ActivityModel = require('../models/ActivityModel');
const Joi = require('joi');

class ActivityController {
  static async getActivityList(req, res) {
    try {
      const activities = await ActivityModel.findActiveList();

      res.json({
        code: 200,
        message: '获取活动列表成功。',
        data: activities
      });

    } catch (err) {
      console.error('获取活动列表失败:', err);
      res.status(500).json({
        code: 500,
        message: '获取失败',
        error: '服务器内部错误'
      });
    }
  }

  static async createActivity(req, res) {
    try {
      if (req.user.userType !== 3) {
        return res.status(403).json({
          code: 403,
          message: '只有管理员才能创建活动'
        });
      }

      const schema = Joi.object({
        activity_name: Joi.string().max(100).required(),
        activity_type: Joi.number().integer().valid(1, 2).required(),
        start_time: Joi.date().required(),
        end_time: Joi.date().required(),
        discount_rule: Joi.string().max(500).required(),
        apply_category_ids: Joi.string().max(200).optional()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '创建失败',
          error: error.details[0].message
        });
      }

      const result = await ActivityModel.create(value, req.user.userId);

      res.status(201).json({
        code: 201,
        message: '折扣活动创建成功。',
        data: result
      });

    } catch (err) {
      console.error('创建活动失败:', err);
      res.status(500).json({
        code: 500,
        message: '创建失败',
        error: '服务器内部错误'
      });
    }
  }

  static async getActivityDetail(req, res) {
    try {
      const activityId = Number.parseInt(req.params.activity_id, 10);
      const activity = await ActivityModel.findById(activityId);

      if (!activity) {
        return res.status(404).json({
          code: 404,
          message: '活动不存在'
        });
      }

      res.json({
        code: 200,
        message: '获取活动详情成功。',
        data: activity
      });

    } catch (err) {
      console.error('获取活动详情失败:', err);
      res.status(500).json({
        code: 500,
        message: '获取失败',
        error: '服务器内部错误'
      });
    }
  }
}

module.exports = ActivityController;