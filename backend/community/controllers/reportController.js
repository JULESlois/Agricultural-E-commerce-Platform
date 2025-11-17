const db = require('../config/database');

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
exports.createReport = async (req, res) => {
  const client = await db.connect();
  try {
    const { report_type, report_obj_id, report_reason, report_detail, report_evidence, is_anonymous } = req.body;
    const reporter_id = req.user.user_id;
    const report_no = generateReportNo();

    await client.query(
      `INSERT INTO community_reports 
      (report_no, reporter_id, report_type, report_obj_id, report_reason, report_detail, report_evidence, is_anonymous, audit_status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0)`,
      [report_no, reporter_id, report_type, report_obj_id, report_reason, report_detail, report_evidence, is_anonymous ? 1 : 0]
    );

    res.status(201).json({
      code: 201,
      message: '举报已提交，平台将尽快处理。'
    });
  } catch (error) {
    console.error('提交举报失败:', error);
    res.status(500).json({
      code: 500,
      message: '提交失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 4.2 (管理员)获取举报列表
exports.getReports = async (req, res) => {
  const client = await db.connect();
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '1=1';
    const params = [];
    let paramIndex = 1;

    if (status !== undefined) {
      whereClause += ` AND r.audit_status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    params.push(parseInt(limit));
    params.push(parseInt(offset));

    const reports = await client.query(
      `SELECT 
        r.report_id,
        r.report_no,
        r.report_type,
        r.report_obj_id,
        r.report_reason,
        r.create_time,
        CASE 
          WHEN r.report_type = 1 THEN (SELECT content_title FROM community_content WHERE content_id = r.report_obj_id)
          WHEN r.report_type = 2 THEN (SELECT comment_text FROM community_comments WHERE comment_id = r.report_obj_id)
          ELSE NULL
        END as report_obj_name
      FROM community_reports r
      WHERE ${whereClause}
      ORDER BY r.create_time DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    res.json({
      code: 200,
      message: '查询成功。',
      data: reports.rows
    });
  } catch (error) {
    console.error('获取举报列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '查询失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 4.3 (管理员)处理举报
exports.handleReport = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const { report_id } = req.params;
    const { audit_result, audit_remark, violation } = req.body;
    const auditor_id = req.user.user_id;

    // 更新举报状态
    const audit_status = audit_result === 'approve' ? 1 : 2;
    await client.query(
      `UPDATE community_reports 
      SET audit_status = $1, auditor_id = $2, audit_time = NOW(), audit_remark = $3
      WHERE report_id = $4`,
      [audit_status, auditor_id, audit_remark, report_id]
    );

    // 如果立案，创建违规记录
    if (audit_result === 'approve' && violation) {
      const report = await client.query(
        'SELECT * FROM community_reports WHERE report_id = $1',
        [report_id]
      );

      if (report.rows.length > 0) {
        const reportData = report.rows[0];
        
        await client.query(
          `INSERT INTO community_violations 
          (report_id, violator_id, violation_type, violation_obj_id, handle_measure, handle_remark, handler_id) 
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            report_id,
            reportData.reporter_id,
            reportData.report_type,
            reportData.report_obj_id,
            violation.handle_measure,
            violation.handle_remark,
            auditor_id
          ]
        );

        // 根据处理措施执行相应操作
        if (violation.handle_measure === 1) {
          // 删除内容
          if (reportData.report_type === 1) {
            await client.query(
              'UPDATE community_content SET is_deleted = 1 WHERE content_id = $1',
              [reportData.report_obj_id]
            );
          } else if (reportData.report_type === 2) {
            await client.query(
              'UPDATE community_comments SET is_deleted = 1 WHERE comment_id = $1',
              [reportData.report_obj_id]
            );
          }
        }
      }
    }

    await client.query('COMMIT');

    res.json({
      code: 200,
      message: '举报处理完成。'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('处理举报失败:', error);
    res.status(500).json({
      code: 500,
      message: '处理失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};
