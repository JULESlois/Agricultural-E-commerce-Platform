const CollectionModel = require('../models/CollectionModel');
const Joi = require('joi');

class CollectionController {
  static async addCollection(req, res) {
    try {
      const schema = Joi.object({
        collection_type: Joi.number().integer().valid(1, 2).required(),
        source_id: Joi.number().integer().when('collection_type', { is: 1, then: Joi.required() }),
        demand_id: Joi.number().integer().when('collection_type', { is: 2, then: Joi.required() })
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '收藏失败',
          error: error.details[0].message
        });
      }

      const result = await CollectionModel.create(req.user.userId, value);

      res.status(201).json({
        code: 201,
        message: '收藏成功。',
        data: result
      });

    } catch (err) {
      console.error('添加收藏失败:', err);
      
      if (err.message.includes('已收藏') || err.message.includes('不存在')) {
        return res.status(400).json({
          code: 400,
          message: '收藏失败',
          error: err.message
        });
      }

      res.status(500).json({
        code: 500,
        message: '收藏失败',
        error: '服务器内部错误'
      });
    }
  }

  static async removeCollection(req, res) {
    try {
      const collectionId = Number.parseInt(req.params.collection_id, 10);
      const result = await CollectionModel.remove(req.user.userId, collectionId);

      if (!result) {
        return res.status(404).json({
          code: 404,
          message: '收藏不存在'
        });
      }

      res.status(204).send();

    } catch (err) {
      console.error('取消收藏失败:', err);
      res.status(500).json({
        code: 500,
        message: '取消收藏失败',
        error: '服务器内部错误'
      });
    }
  }

  static async getCollections(req, res) {
    try {
      const { type } = req.query;
      const collectionType = type ? Number.parseInt(type, 10) : null;

      const collections = await CollectionModel.findByUser(req.user.userId, collectionType);

      res.json({
        code: 200,
        message: '查询成功。',
        data: collections
      });

    } catch (err) {
      console.error('获取收藏列表失败:', err);
      res.status(500).json({
        code: 500,
        message: '查询失败',
        error: '服务器内部错误'
      });
    }
  }
}

module.exports = CollectionController;