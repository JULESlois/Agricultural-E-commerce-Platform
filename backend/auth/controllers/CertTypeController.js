const CertTypeModel = require('../models/CertTypeModel');
const Joi = require('joi');

class CertTypeController {
  static async getCertTypes(req, res) {
    try {
      const userType = req.user.userType;
      const certTypes = await CertTypeModel.findByUserType(userType);

      res.json({
        code: 200,
        message: '获取认证类型成功',
        data: certTypes
      });

    } catch (err) {
      console.error('获取认证类型失败:', err);
      res.status(500).json({
        code: 500,
        message: '获取认证类型失败',
        error: '服务器内部错误'
      });
    }
  }

  static async createCertType(req, res) {
    try {
      const schema = Joi.object({
        cert_type_code: Joi.string().max(30).required(),
        cert_type_name: Joi.string().max(50).required(),
        apply_user_type: Joi.number().integer().valid(1, 2, 3).required(),
        cert_level: Joi.number().integer().valid(1, 2).default(1),
        required_materials: Joi.array().items(Joi.string()).required(),
        optional_materials: Joi.array().items(Joi.string()).optional(),
        audit_cycle: Joi.string().max(50).default('1-2 个工作日')
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '创建失败',
          error: error.details[0].message
        });
      }

      const certType = await CertTypeModel.create({
        ...value,
        create_user: req.user.userId
      });

      res.status(201).json({
        code: 201,
        message: '创建认证类型成功',
        data: certType
      });

    } catch (err) {
      console.error('创建认证类型失败:', err);
      res.status(500).json({
        code: 500,
        message: '创建认证类型失败',
        error: '服务器内部错误'
      });
    }
  }
}

module.exports = CertTypeController;