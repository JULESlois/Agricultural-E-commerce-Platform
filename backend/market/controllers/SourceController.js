const SourceModel = require('../models/SourceModel');
const Joi = require('joi');

class SourceController {
  static async createSource(req, res) {
    try {
      if (req.user.userType !== 1) {
        return res.status(403).json({
          code: 403,
          message: '只有农户用户才能发布货源'
        });
      }

      const schema = Joi.object({
        category_id: Joi.number().integer().required(),
        product_name: Joi.string().max(100).required(),
        product_spec: Joi.string().max(100).required(),
        origin: Joi.string().max(100).required(),
        harvest_date: Joi.date().required(),
        expire_date: Joi.date().optional(),
        total_quantity: Joi.number().precision(2).min(0).required(),
        unit_price: Joi.number().precision(2).min(0).required(),
        batch_price: Joi.number().precision(2).min(0).optional(),
        batch_quantity: Joi.number().precision(2).min(0).optional(),
        product_images: Joi.array().items(Joi.string()).required(),
        product_desc: Joi.string().required(),
        logistics_type: Joi.number().integer().valid(1, 2, 3).default(2),
        freight_rule: Joi.string().max(200).required(),
        min_order_quantity: Joi.number().precision(2).min(0).default(1000)
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '发布失败',
          error: error.details[0].message
        });
      }

      const result = await SourceModel.create(req.user.userId, value);

      res.status(201).json({
        code: 201,
        message: '货源发布成功，等待平台审核。',
        data: result
      });

    } catch (err) {
      console.error('发布货源失败:', err);
      res.status(500).json({
        code: 500,
        message: '发布失败',
        error: '服务器内部错误'
      });
    }
  }

  static async getSourceList(req, res) {
    try {
      const { category_id, keyword, sort = 'time_desc', page = 1 } = req.query;
      const pageSize = 20;

      const filters = {};
      if (category_id) filters.category_id = Number.parseInt(category_id, 10);
      if (keyword) filters.keyword = keyword;
      if (sort) filters.sort = sort;

      const result = await SourceModel.findList(filters, Number.parseInt(page, 10), pageSize);

      res.json({
        code: 200,
        message: '查询成功。',
        data: result
      });

    } catch (err) {
      console.error('获取货源列表失败:', err);
      res.status(500).json({
        code: 500,
        message: '查询失败',
        error: '服务器内部错误'
      });
    }
  }

  static async getSourceDetail(req, res) {
    try {
      const sourceId = Number.parseInt(req.params.source_id, 10);
      const source = await SourceModel.findById(sourceId);

      if (!source) {
        return res.status(404).json({
          code: 404,
          message: '货源不存在'
        });
      }

      res.json({
        code: 200,
        message: '查询成功。',
        data: source
      });

    } catch (err) {
      console.error('获取货源详情失败:', err);
      res.status(500).json({
        code: 500,
        message: '查询失败',
        error: '服务器内部错误'
      });
    }
  }

  static async auditSource(req, res) {
    try {
      const sourceId = Number.parseInt(req.params.source_id, 10);
      
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

      const result = await SourceModel.updateAuditStatus(
        sourceId, 
        value.audit_status, 
        req.user.userId, 
        value.audit_remark
      );

      if (!result) {
        return res.status(404).json({
          code: 404,
          message: '货源不存在'
        });
      }

      res.json({
        code: 200,
        message: '货源审核操作成功。'
      });

    } catch (err) {
      console.error('审核货源失败:', err);
      res.status(500).json({
        code: 500,
        message: '审核失败',
        error: '服务器内部错误'
      });
    }
  }

  static async createDemand(req, res) {
    try {
      if (req.user.userType !== 2) {
        return res.status(403).json({
          code: 403,
          message: '只有买家用户才能发布求购'
        });
      }

      const schema = Joi.object({
        category_id: Joi.number().integer().required(),
        product_name: Joi.string().max(100).required(),
        product_spec: Joi.string().max(100).required(),
        required_quantity: Joi.number().precision(2).min(0).required(),
        max_unit_price: Joi.number().precision(2).min(0).required(),
        delivery_address_id: Joi.number().integer().required(),
        latest_delivery_date: Joi.date().required(),
        payment_type: Joi.number().integer().valid(1, 2).default(1),
        demand_desc: Joi.string().max(500).optional()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '发布失败',
          error: error.details[0].message
        });
      }

      const result = await SourceModel.createDemand(req.user.userId, value);

      res.status(201).json({
        code: 201,
        message: '求购信息发布成功。',
        data: result
      });

    } catch (err) {
      console.error('发布求购失败:', err);
      res.status(500).json({
        code: 500,
        message: '发布失败',
        error: '服务器内部错误'
      });
    }
  }

  static async getDemandList(req, res) {
    try {
      const { category_id, page = 1 } = req.query;
      const pageSize = 20;

      const filters = {};
      if (category_id) filters.category_id = Number.parseInt(category_id, 10);

      const result = await SourceModel.findDemandList(filters, Number.parseInt(page, 10), pageSize);

      res.json({
        code: 200,
        message: '查询成功。',
        data: result
      });

    } catch (err) {
      console.error('获取求购列表失败:', err);
      res.status(500).json({
        code: 500,
        message: '查询失败',
        error: '服务器内部错误'
      });
    }
  }
}

module.exports = SourceController;