const CertApplyModel = require('../models/CertApplyModel');
const CertMaterialModel = require('../models/CertMaterialModel');
const CertificationService = require('../services/CertificationService');
const Joi = require('joi');

class CertApplyController {
  static async createApplyDraft(req, res) {
    try {
      const schema = Joi.object({
        cert_type_id: Joi.number().integer().required()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '创建失败',
          error: error.details[0].message
        });
      }

      const userId = req.user.userId;
      const { cert_type_id } = value;

      const draft = await CertApplyModel.createDraft(userId, cert_type_id);

      res.status(201).json({
        code: 201,
        message: '创建申请草稿成功',
        data: draft
      });

    } catch (err) {
      console.error('创建申请草稿失败:', err);
      res.status(500).json({
        code: 500,
        message: '创建申请草稿失败',
        error: '服务器内部错误'
      });
    }
  }

  static async uploadMaterial(req, res) {
    try {
      const applyId = req.params.apply_id;
      const { material_type } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          code: 400,
          message: '请上传文件'
        });
      }

      // 验证申请是否属于当前用户
      const application = await CertApplyModel.findByUserAndId(req.user.userId, applyId);
      if (!application) {
        return res.status(404).json({
          code: 404,
          message: '申请不存在或无权限'
        });
      }

      const materialData = {
        apply_id: applyId,
        material_type,
        material_name: file.originalname,
        material_url: `/uploads/${file.filename}`,
        material_format: file.mimetype,
        material_size: file.size / 1024, // KB
        upload_user_id: req.user.userId
      };

      const material = await CertMaterialModel.create(materialData);

      res.json({
        code: 200,
        message: '上传材料成功',
        data: material
      });

    } catch (err) {
      console.error('上传材料失败:', err);
      res.status(500).json({
        code: 500,
        message: '上传材料失败',
        error: '服务器内部错误'
      });
    }
  }

  static async submitApplication(req, res) {
    try {
      const applyId = req.params.apply_id;
      const { apply_info } = req.body;

      await CertificationService.submit(applyId, req.user.userId, apply_info);

      res.json({
        code: 200,
        message: '提交申请成功'
      });

    } catch (err) {
      console.error('提交申请失败:', err);
      res.status(400).json({
        code: 400,
        message: '提交申请失败',
        error: err.message
      });
    }
  }

  static async getMyApplyList(req, res) {
    try {
      const userId = req.user.userId;
      const applications = await CertApplyModel.findByUserId(userId);

      res.json({
        code: 200,
        message: '获取申请列表成功',
        data: applications
      });

    } catch (err) {
      console.error('获取申请列表失败:', err);
      res.status(500).json({
        code: 500,
        message: '获取申请列表失败',
        error: '服务器内部错误'
      });
    }
  }
}

module.exports = CertApplyController;