const CertApplyModel = require('../models/CertApplyModel');
const CertMaterialModel = require('../models/CertMaterialModel');
const CertificationService = require('../services/CertificationService');
const Joi = require('joi');

class CertAdminController {
  static async getPendingApplyList(req, res) {
    try {
      const { status = 1, page = 1, pageSize = 10 } = req.query;
      
      const result = await CertApplyModel.findPendingList(
        Number.parseInt(status, 10),
        Number.parseInt(page, 10),
        Number.parseInt(pageSize, 10)
      );

      res.json({
        code: 200,
        message: '获取待审核列表成功',
        data: {
          applications: result.rows,
          pagination: {
            total: result.count,
            totalPages: result.totalPages,
            currentPage: result.currentPage,
            pageSize: Number.parseInt(pageSize, 10)
          }
        }
      });

    } catch (err) {
      console.error('获取待审核列表失败:', err);
      res.status(500).json({
        code: 500,
        message: '获取待审核列表失败',
        error: '服务器内部错误'
      });
    }
  }

  static async getApplyDetail(req, res) {
    try {
      const applyId = req.params.apply_id;
      
      const application = await CertApplyModel.findDetailById(applyId);
      if (!application) {
        return res.status(404).json({
          code: 404,
          message: '申请不存在'
        });
      }

      const materials = await CertMaterialModel.findByApplyId(applyId);

      res.json({
        code: 200,
        message: '获取申请详情成功',
        data: {
          application,
          materials
        }
      });

    } catch (err) {
      console.error('获取申请详情失败:', err);
      res.status(500).json({
        code: 500,
        message: '获取申请详情失败',
        error: '服务器内部错误'
      });
    }
  }

  static async approveApplication(req, res) {
    try {
      const applyId = req.params.apply_id;
      
      const schema = Joi.object({
        audit_remark: Joi.string().max(500).optional(),
        cert_expire_time: Joi.date().optional()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '审核失败',
          error: error.details[0].message
        });
      }

      await CertificationService.approve(
        applyId,
        req.user,
        value.audit_remark,
        value.cert_expire_time
      );

      res.json({
        code: 200,
        message: '审核通过成功'
      });

    } catch (err) {
      console.error('审核通过失败:', err);
      res.status(400).json({
        code: 400,
        message: '审核通过失败',
        error: err.message
      });
    }
  }

  static async rejectApplication(req, res) {
    try {
      const applyId = req.params.apply_id;
      
      const schema = Joi.object({
        reject_reason_type: Joi.number().integer().valid(1, 2, 3, 4).required(),
        audit_remark: Joi.string().max(500).required()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          code: 400,
          message: '驳回失败',
          error: error.details[0].message
        });
      }

      await CertificationService.reject(
        applyId,
        req.user,
        value.reject_reason_type,
        value.audit_remark
      );

      res.json({
        code: 200,
        message: '驳回申请成功'
      });

    } catch (err) {
      console.error('驳回申请失败:', err);
      res.status(400).json({
        code: 400,
        message: '驳回申请失败',
        error: err.message
      });
    }
  }
}

module.exports = CertAdminController;