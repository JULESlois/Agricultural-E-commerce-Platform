const dbPool = require('../config/database');
const { successResponse: success, errorResponse: error } = require('../utils/response');

// 5.1 申请成为专家
exports.applyExpert = async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();

        const {
            expert_name,
            expert_title,
            expert_field,
            education_bg,
            work_experience,
            achievement,
            service_type,
            service_fee,
            service_duration,
            response_time,
            cert_materials
        } = req.body;

        const user_id = req.user.user_id;

        // 检查是否已申请
        const existingResult = await connection.query(
            'SELECT * FROM expert_info WHERE user_id = $1',
            [user_id]
        );

        if (existingResult.rows.length > 0) {
            await connection.rollback();
            return error(res, 409, '您已提交过专家申请');
        }

        await connection.query(`
      INSERT INTO expert_info (
        user_id, expert_name, expert_title, expert_field,
        education_bg, work_experience, achievement,
        service_type, service_fee, service_duration, response_time,
        cert_materials, audit_status, expert_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 0, 1)
    `, [
            user_id, expert_name, expert_title, expert_field,
            education_bg, work_experience, achievement,
            service_type, service_fee, service_duration, response_time,
            cert_materials
        ]);

        await connection.commit();
        return success(res, 201, '专家入驻申请已提交，等待平台审核。');
    } catch (err) {
        await connection.rollback();
        console.error('申请专家失败:', err);
        return error(res, 500, '服务器错误');
    } finally {
        connection.release();
    }
};

// 5.2 筛选专家列表
exports.getExpertList = async (req, res) => {
    try {
        const { field, page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;

        let whereClause = 'WHERE audit_status = 1 AND expert_status = 1';
        let params = [];
        let paramIndex = 1;

        if (field) {
            whereClause += ` AND expert_field ILIKE $${paramIndex++}`;
            params.push(`%${field}%`);
        }

        params.push(parseInt(pageSize), offset);

        const result = await dbPool.query(`
      SELECT 
        expert_id,
        expert_name,
        expert_avatar,
        expert_title,
        expert_field,
        service_type,
        service_fee,
        service_count,
        avg_score,
        knowledge_count,
        knowledge_view_count
      FROM expert_info
      ${whereClause}
      ORDER BY avg_score DESC, service_count DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, params);

        return success(res, 200, '查询成功。', result.rows);
    } catch (err) {
        console.error('获取专家列表失败:', err);
        return error(res, 500, '服务器错误');
    }
};

// 5.3 用户发布咨询需求
exports.createConsultDemand = async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();

        const {
            demand_title,
            demand_field,
            demand_type,
            demand_desc,
            demand_attachments,
            expected_expert,
            consult_type,
            budget
        } = req.body;

        const user_id = req.user.user_id;
        const demand_no = `CON${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

        // 推荐相关文章
        const searchPattern = `%${demand_field}%`;
        const recommendResult = await connection.query(`
      SELECT article_id FROM expert_knowledge_article
      WHERE audit_status = 1 AND article_status != 0
        AND (article_title ILIKE $1 OR tags ILIKE $2 OR article_summary ILIKE $3)
      ORDER BY view_count DESC
      LIMIT 3
    `, [searchPattern, searchPattern, searchPattern]);

        const recommend_article_ids = recommendResult.rows.map(a => a.article_id).join(',');

        const result = await connection.query(`
      INSERT INTO expert_consult_demand (
        demand_no, user_id, demand_title, demand_field, demand_type,
        demand_desc, demand_attachments, expected_expert,
        consult_type, budget, demand_status, recommend_article_ids
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 1, $11)
      RETURNING demand_id
    `, [
            demand_no, user_id, demand_title, demand_field, demand_type,
            demand_desc, demand_attachments, expected_expert,
            consult_type, budget, recommend_article_ids
        ]);

        await connection.commit();

        return success(res, 201, '咨询需求发布成功，等待专家接单。', {
            demand_id: result.rows[0].demand_id,
            demand_no: demand_no,
            recommend_article_ids: recommend_article_ids ? recommend_article_ids.split(',') : []
        });
    } catch (err) {
        await connection.rollback();
        console.error('发布咨询需求失败:', err);
        return error(res, 500, '服务器错误');
    } finally {
        connection.release();
    }
};

// 5.4 专家接单
exports.acceptDemand = async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();

        const { demand_id } = req.params;
        const expert_id = req.expert.expert_id;

        // 检查需求状态
        const demandsResult = await connection.query(
            'SELECT * FROM expert_consult_demand WHERE demand_id = $1 AND demand_status IN (1, 2)',
            [demand_id]
        );

        if (demandsResult.rows.length === 0) {
            await connection.rollback();
            return error(res, 404, '需求不存在或已被接单');
        }

        const demand = demandsResult.rows[0];

        // 如果指定了专家,检查是否匹配
        if (demand.expected_expert && demand.expected_expert !== expert_id) {
            await connection.rollback();
            return error(res, 403, '该需求指定了其他专家');
        }

        // 生成咨询记录编号
        const consult_no = `REC${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

        // 创建咨询记录
        const recordResult = await connection.query(`
      INSERT INTO expert_consult_record (
        consult_no, demand_id, user_id, expert_id,
        consult_type, consult_start_time, consult_end_time,
        consult_duration, consult_result, consult_status
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), 0, '', 3)
      RETURNING record_id
    `, [consult_no, demand_id, demand.user_id, expert_id, demand.consult_type]);

        // 更新需求状态
        await connection.query(
            'UPDATE expert_consult_demand SET demand_status = 3, match_expert_id = $1 WHERE demand_id = $2',
            [expert_id, demand_id]
        );

        await connection.commit();

        return success(res, 200, '接单成功，请尽快与用户开始咨询。', {
            record_id: recordResult.rows[0].record_id,
            consult_no: consult_no
        });
    } catch (err) {
        await connection.rollback();
        console.error('接单失败:', err);
        return error(res, 500, '服务器错误');
    } finally {
        connection.release();
    }
};

// 5.5 发送咨询消息
exports.sendConsultMessage = async (req, res) => {
    try {
        const { record_id } = req.params;
        const { message_text } = req.body;

        // 更新咨询内容
        await dbPool.query(`
      UPDATE expert_consult_record 
      SET consult_content = COALESCE(consult_content, '') || $1 || E'\n'
      WHERE record_id = $2
    `, [message_text, record_id]);

        return success(res, 201, '消息发送成功。');
    } catch (err) {
        console.error('发送消息失败:', err);
        return error(res, 500, '服务器错误');
    }
};

// 5.6 专家完成咨询
exports.completeConsult = async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();

        const { record_id } = req.params;
        const { consult_result, related_article_id } = req.body;
        const expert_id = req.expert.expert_id;

        // 验证记录归属
        const recordsResult = await connection.query(
            'SELECT * FROM expert_consult_record WHERE record_id = $1 AND expert_id = $2',
            [record_id, expert_id]
        );

        if (recordsResult.rows.length === 0) {
            await connection.rollback();
            return error(res, 404, '咨询记录不存在');
        }

        // 更新咨询记录
        await connection.query(`
      UPDATE expert_consult_record 
      SET consult_status = 4, 
          consult_result = $1, 
          consult_end_time = NOW(),
          consult_duration = EXTRACT(EPOCH FROM (NOW() - consult_start_time))/60,
          related_article_id = $2
      WHERE record_id = $3
    `, [consult_result, related_article_id, record_id]);

        // 更新需求状态
        await connection.query(
            'UPDATE expert_consult_demand SET demand_status = 4 WHERE demand_id = $1',
            [recordsResult.rows[0].demand_id]
        );

        await connection.commit();

        return success(res, 200, '咨询已完成。', {
            record_id: parseInt(record_id),
            consult_status: 4
        });
    } catch (err) {
        await connection.rollback();
        console.error('完成咨询失败:', err);
        return error(res, 500, '服务器错误');
    } finally {
        connection.release();
    }
};

// 5.7 支付咨询费用
exports.payConsult = async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();

        const { record_id } = req.params;
        const user_id = req.user.user_id;

        const recordsResult = await connection.query(
            'SELECT * FROM expert_consult_record WHERE record_id = $1 AND user_id = $2 AND consult_status = 4',
            [record_id, user_id]
        );

        if (recordsResult.rows.length === 0) {
            await connection.rollback();
            return error(res, 404, '咨询记录不存在或状态不正确');
        }

        // 这里应该集成实际的支付网关
        const paymentPayload = {
            order_id: `PAY${Date.now()}`,
            amount: recordsResult.rows[0].service_fee || 0,
        };

        // 模拟支付成功,更新状态
        await connection.query(
            'UPDATE expert_consult_record SET payment_status = 1, payment_time = NOW() WHERE record_id = $1',
            [record_id]
        );

        await connection.commit();

        return success(res, 200, '支付请求已生成。', {
            payment_gateway_payload: paymentPayload
        });
    } catch (err) {
        await connection.rollback();
        console.error('支付失败:', err);
        return error(res, 500, '服务器错误');
    } finally {
        connection.release();
    }
};
