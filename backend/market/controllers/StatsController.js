const StatsModel = require('../models/StatsModel');
const Joi = require('joi');

class StatsController {
  static async getPriceTrends(req, res) {
    try {
      const schema = Joi.object({
        category_id: Joi.number().integer().required(),
        start_date: Joi.date().iso().required(),
        end_date: Joi.date().iso().min(Joi.ref('start_date')).required()
      });

      const { error, value } = schema.validate(req.query);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '查询失败',
          error: error.details[0].message
        });
      }

      const result = await StatsModel.getPriceTrends(
        value.category_id,
        value.start_date,
        value.end_date
      );

      res.json({
        code: 200,
        message: '查询成功。',
        data: result
      });

    } catch (err) {
      console.error('获取价格走势失败:', err);
      res.status(500).json({
        code: 500,
        message: '查询失败',
        error: '服务器内部错误'
      });
    }
  }
}

module.exports = StatsController;