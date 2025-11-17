const { Report, Violation, Content, Comment, sequelize } = require('../models');
const { success, error: errorResponse } = require('../utils/response');
const { Op } = require('sequelize');

// 生成举报编号
const generateReportNo = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `REP${year}${month}${day}${random}`;
};

// 4.1 举报
exports.createReport = async (req, res, next) => {
  try {
    const { 
      report_type, 
      report_obj_id, 
      report_reason, 
      report_detail, 
      report_evidence, 
      is_anonymous 
    } = req.body;
    const reporter_id = req.user.user_id;
    const report_no = generateReportNo();

    await Report.create({
      report_no,
      reporter_id,
      report_type,
      report_obj_id,
      report_reason,
      report_detail,
      report_evidence,
      is_anonymous: is_anonymous ? 1 : 0,
      audit_status: 0
    });

    success(res, null, '举报已提交，平台将尽快处理。', 201);
  } catch (err) {
    next(err);
  }
};

// 4.2 (管理员)获取举报列表
exports.getReports = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status !== undefined) {
      where.audit_status = parseInt(status);
    }

    const reports = await Report.findAll({
      where,
      attributes: [
        'report_id',
        'report_no',
        'report_type',
        'report_obj_id',
        'report_reason',
        'create_time'
      ],
      order: [['create_time', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // 获取被举报对象的名称
    const data = await Promise.all(reports.map(async (report) => {
      let report_obj_name = null;
      
      if (report.report_type === 1) {
        // 内容
        const content = await Content.findByPk(report.report_obj_id, {
          attributes: ['content_title']
        });
        report_obj_name = content ? content.content_title : null;
      } else if (report.report_type === 2) {
        // 评论
        const comment = await Comment.findByPk(report.report_obj_id, {
          attributes: ['comment_text']
        });
        report_obj_name = comment ? comment.comment_text : null;
      }

      return {
        ...report.toJSON(),
        report_obj_name
      };
    }));

    success(res, data, '查询成功。');
  } catch (err) {
    next(err);
  }
};

// 4.3 (管理员)处理举报
exports.handleReport = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { report_id } = req.params;
    const { audit_result, audit_remark, violation } = req.body;
    const auditor_id = req.user.user_id;

    // 更新举报状态
    const audit_status = audit_result === 'approve' ? 1 : 2;
    const report = await Report.findByPk(report_id, { transaction });

    if (!report) {
      await transaction.rollback();
      return errorResponse(res, '举报记录不存在', 404);
    }

    report.audit_status = audit_status;
    report.auditor_id = auditor_id;
    report.audit_time = new Date();
    report.audit_remark = audit_remark;
    await report.save({ transaction });

    // 如果立案，创建违规记录
    if (audit_result === 'approve' && violation) {
      await Violation.create({
        report_id,
        violator_id: report.reporter_id,
        violation_type: report.report_type,
        violation_obj_id: report.report_obj_id,
        handle_measure: violation.handle_measure,
        handle_remark: violation.handle_remark,
        handler_id: auditor_id
      }, { transaction });

      // 根据处理措施执行相应操作
      if (violation.handle_measure === 1) {
        // 删除内容
        if (report.report_type === 1) {
          await Content.update(
            { is_deleted: 1 },
            { where: { content_id: report.report_obj_id }, transaction }
          );
        } else if (report.report_type === 2) {
          await Comment.update(
            { is_deleted: 1 },
            { where: { comment_id: report.report_obj_id }, transaction }
          );
        }
      }
    }

    await transaction.commit();
    success(res, null, '举报处理完成。');
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

module.exports = exports;
