const AddressModel = require('../models/AddressModel');
const Joi = require('joi');

class AddressController {
  static async create(req, res) {
    try {
      const schema = Joi.object({
        address_name: Joi.string().max(50).required(),
        receiver: Joi.string().max(50).required(),
        phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required(),
        province: Joi.string().max(50).required(),
        city: Joi.string().max(50).required(),
        county: Joi.string().max(50).required(),
        detail_address: Joi.string().max(200).required(),
        is_default: Joi.boolean().default(false),
        postal_code: Joi.string().max(20).optional()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '添加失败',
          error: error.details[0].message
        });
      }

      const result = await AddressModel.create(req.user.userId, value);

      res.status(201).json({
        code: 201,
        message: '地址添加成功。',
        data: result
      });

    } catch (err) {
      console.error('添加地址失败:', err);
      res.status(500).json({
        code: 500,
        message: '添加失败',
        error: '服务器内部错误'
      });
    }
  }

  static async getList(req, res) {
    try {
      const addresses = await AddressModel.findByUserId(req.user.userId);

      res.json({
        code: 200,
        message: '获取地址列表成功。',
        data: addresses
      });

    } catch (err) {
      console.error('获取地址列表失败:', err);
      res.status(500).json({
        code: 500,
        message: '获取失败',
        error: '服务器内部错误'
      });
    }
  }

  static async update(req, res) {
    try {
      const addressId = Number.parseInt(req.params.address_id, 10);
      
      const schema = Joi.object({
        address_name: Joi.string().max(50).optional(),
        receiver: Joi.string().max(50).optional(),
        phone: Joi.string().pattern(/^1[3-9]\d{9}$/).optional(),
        province: Joi.string().max(50).optional(),
        city: Joi.string().max(50).optional(),
        county: Joi.string().max(50).optional(),
        detail_address: Joi.string().max(200).optional(),
        postal_code: Joi.string().max(20).optional()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '修改失败',
          error: error.details[0].message
        });
      }

      const result = await AddressModel.update(req.user.userId, addressId, value);
      if (!result) {
        return res.status(404).json({
          code: 404,
          message: '地址不存在或无权修改'
        });
      }

      res.json({
        code: 200,
        message: '地址修改成功。'
      });

    } catch (err) {
      console.error('修改地址失败:', err);
      res.status(500).json({
        code: 500,
        message: '修改失败',
        error: '服务器内部错误'
      });
    }
  }

  static async delete(req, res) {
    try {
      const addressId = Number.parseInt(req.params.address_id, 10);
      
      const result = await AddressModel.delete(req.user.userId, addressId);
      if (!result) {
        return res.status(404).json({
          code: 404,
          message: '删除失败。',
          error: `地址 '${addressId}' 不存在或您无权删除。`
        });
      }

      res.status(204).send();

    } catch (err) {
      console.error('删除地址失败:', err);
      res.status(500).json({
        code: 500,
        message: '删除失败',
        error: '服务器内部错误'
      });
    }
  }

  static async setDefault(req, res) {
    try {
      const addressId = Number.parseInt(req.params.address_id, 10);
      
      const result = await AddressModel.setDefault(req.user.userId, addressId);
      if (!result) {
        return res.status(404).json({
          code: 404,
          message: '地址不存在或无权操作'
        });
      }

      res.json({
        code: 200,
        message: '默认地址设置成功。'
      });

    } catch (err) {
      console.error('设置默认地址失败:', err);
      res.status(500).json({
        code: 500,
        message: '设置失败',
        error: '服务器内部错误'
      });
    }
  }
}

module.exports = AddressController;