const FootprintModel = require('../models/FootprintModel');
const Joi = require('joi');

class FootprintController {
  static async getFootprints(req, res) {
    try {
      const schema = Joi.object({
        type: Joi.number().integer().valid(1, 2).required(),
        page: Joi.number().integer().min(1).default(1),
        pageSize: Joi.number().integer().min(1).max(100).default(20)
      });

      const { error, value } = schema.validate(req.query);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '查询失败',
          error: error.details[0].message
        });
      }

      const result = await FootprintModel.findByUser(
        req.user.userId,
        value.type,
        value.page,
        value.pageSize
      );

      res.json({
        code: 200,
        message: '查询成功。',
        data: result
      });

    } catch (err) {
      console.error('获取浏览足迹失败:', err);
      res.status(500).json({
        code: 500,
        message: '查询失败',
        error: '服务器内部错误'
      });
    }
  }

  static async deleteFootprints(req, res) {
    try {
      const schema = Joi.object({
        footprint_ids: Joi.array().items(Joi.number().integer()).min(1).required()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '删除失败',
          error: error.details[0].message
        });
      }

      await FootprintModel.deleteByIds(req.user.userId, value.footprint_ids);
      res.status(204).send();

    } catch (err) {
      console.error('删除浏览足迹失败:', err);
      res.status(500).json({
        code: 500,
        message: '删除失败',
        error: '服务器内部错误'
      });
    }
  }
}

module.exports = FootprintController;