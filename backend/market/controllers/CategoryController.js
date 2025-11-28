const CategoryModel = require('../models/CategoryModel');
const Joi = require('joi');

class CategoryController {
  static async getCategoryTree(req, res) {
    try {
      const categories = await CategoryModel.findTree();

      res.json({
        code: 200,
        message: '获取品类树成功。',
        data: categories
      });

    } catch (err) {
      console.error('获取品类树失败:', err);
      res.status(500).json({
        code: 500,
        message: '获取失败',
        error: '服务器内部错误'
      });
    }
  }

  static async createCategory(req, res) {
    try {
      const schema = Joi.object({
        parent_id: Joi.number().integer().default(0),
        category_name: Joi.string().max(50).required(),
        category_code: Joi.string().max(30).required(),
        category_icon: Joi.string().max(200).optional(),
        sort: Joi.number().integer().default(0),
        status: Joi.number().integer().valid(0, 1).default(1)
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '创建失败',
          error: error.details[0].message
        });
      }

      const result = await CategoryModel.create(value);

      res.status(201).json({
        code: 201,
        message: '品类创建成功。',
        data: result
      });

    } catch (err) {
      console.error('创建品类失败:', err);
      res.status(500).json({
        code: 500,
        message: '创建失败',
        error: '服务器内部错误'
      });
    }
  }
}

module.exports = CategoryController;