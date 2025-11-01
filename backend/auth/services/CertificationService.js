const { pool } = require('../../market/database');
const CertApplyModel = require('../models/CertApplyModel');
const CertMaterialModel = require('../models/CertMaterialModel');
const UserModel = require('../models/UserModel');

class CertificationService {
  static async submit(applyId, userId, applyInfo) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const application = await CertApplyModel.findByUserAndId(userId, applyId);
      if (!application) {
        throw new Error('申请不存在或无权限');
      }
      if (application.apply_status !== 0) {
        throw new Error('申请状态不正确');
      }

      const certTypeQuery = `SELECT required_materials FROM sys_cert_type WHERE cert_type_id = $1`;
      const certTypeResult = await client.query(certTypeQuery, [application.cert_type_id]);
      const requiredMaterials = JSON.parse(certTypeResult.rows[0].required_materials);

      const materialCheck = await CertMaterialModel.checkRequiredMaterials(applyId, requiredMaterials);
      if (!materialCheck.isComplete) {
        throw new Error(`缺少必需材料: ${materialCheck.missingMaterials.join(', ')}`);
      }

      await CertApplyModel.updateStatus(applyId, 1, {
        apply_info: JSON.stringify(applyInfo),
        apply_time: new Date()
      });

      await client.query('COMMIT');
      return { success: true };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async approve(applyId, adminUser, remark, expireTime) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const application = await CertApplyModel.findDetailById(applyId);
      if (!application || application.apply_status !== 1) {
        throw new Error('申请不存在或状态不正确');
      }

      await CertApplyModel.updateStatus(applyId, 2, {
        audit_user_id: adminUser.userId,
        audit_time: new Date(),
        audit_remark: remark,
        cert_effect_time: new Date(),
        cert_expire_time: expireTime
      });

      await UserModel.update(application.user_id, { cert_status: 1 });

      await client.query('COMMIT');
      return { success: true };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async reject(applyId, adminUser, reasonType, remark) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const application = await CertApplyModel.findDetailById(applyId);
      if (!application || application.apply_status !== 1) {
        throw new Error('申请不存在或状态不正确');
      }

      await CertApplyModel.updateStatus(applyId, 3, {
        audit_user_id: adminUser.userId,
        audit_time: new Date(),
        audit_remark: remark,
        reject_reason_type: reasonType
      });

      await client.query('COMMIT');
      return { success: true };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = CertificationService;