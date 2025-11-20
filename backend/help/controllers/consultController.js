const pool = require('../config/db');
const { success, fail } = require('../utils/response');

// 2.1 申请成为专家（简化版）
const applyExpert = async (req, res) => {
    const {
        expert_name, expert_title, expert_field, work_experience,
        service_type, service_fee, cert_materials
    } = req.body;
    const user_id = req.user.user_id;

    try {
        await pool.query(
            `INSERT INTO expert_info 
       (user_id, expert_name, expert_title, expert_field, work_experience,
        service_type, service_fee, cert_materials, status, apply_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,0,NOW())`,
            [user_id, expert_name, expert_title, expert_field, work_experience,
                service_type, service_fee, JSON.stringify(cert_materials)]
        );
        success(res, 201, '专家入驻申请已提交，等待平台审核。');
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 2.2 获取专家列表
const getExperts = async (req, res) => {
    const { field } = req.query;
    let sql = `
    SELECT expert_id, expert_name, expert_avatar, expert_title,
           expert_field, service_count, avg_score
    FROM expert_info WHERE status = 1`; // 已认证
    const params = [];

    if (field) {
        params.push(`%${field}%`);
        sql += ` AND expert_field ILIKE $1`;
    }

    sql += ' ORDER BY avg_score DESC, service_count DESC LIMIT 50';

    try {
        const result = await pool.query(sql, params);
        success(res, 200, '查询成功。', result.rows);
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 2.3 发布咨询需求
const createDemand = async (req, res) => {
    const {
        demand_title, demand_field, demand_desc, demand_attachments,
        expected_expert_id, consult_type, budget
    } = req.body;
    const user_id = req.user.user_id;

    try {
        const result = await pool.query(
            `INSERT INTO expert_consult_demand
       (user_id, demand_title, demand_field, demand_desc, demand_attachments,
        expected_expert_id, consult_type, budget, status, create_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,0,NOW())
       RETURNING demand_id,
                 'CON'||to_char(NOW(),'YYYYMMDD')||lpad(demand_id::text,8,'0') as demand_no`,
            [user_id, demand_title, demand_field, demand_desc,
                JSON.stringify(demand_attachments || []), expected_expert_id,
                consult_type || 1, budget || 0]
        );

        const row = result.rows[0];

        // 简单推荐文章（示例：关键词匹配）
        const recommendRes = await pool.query(`
      SELECT article_id::text FROM expert_knowledge_article
      WHERE status = 1 AND (article_title ILIKE $1 OR tags ILIKE $1)
      LIMIT 5
    `, [`%${demand_title.split(' ')[0]}%`]);

        const recommend_article_ids = recommendRes.rows.map(r => r.article_id);

        success(res, 201, '咨询需求发布成功，等待专家接单。', {
            demand_id: row.demand_id,
            demand_no: row.demand_no,
            recommend_article_ids
        });
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 2.4 专家接单
const acceptDemand = async (req, res) => {
    const { demand_id } = req.params;
    const expert_id = req.user.expert_id;

    try {
        const demand = await pool.query(
            `SELECT * FROM expert_consult_demand WHERE demand_id = $1 AND status = 0 FOR UPDATE`,
            [demand_id]
        );
        if (demand.rows.length === 0) return fail(res, 404, '需求不存在或已被接单');

        const result = await pool.query(
            `INSERT INTO expert_consult_record
       (demand_id, expert_id, user_id, consult_no, status, create_time)
       VALUES ($1, $2, (SELECT user_id FROM expert_consult_demand WHERE demand_id=$1),
               'REC'||to_char(NOW(),'YYYYMMDD')||lpad(nextval('consult_record_seq')::text,8,'0'),
               1, NOW())
       RETURNING record_id, consult_no`,
            [demand_id, expert_id]
        );

        await pool.query(`UPDATE expert_consult_demand SET status = 1, expert_id = $1 WHERE demand_id = $2`,
            [expert_id, demand_id]);

        const row = result.rows[0];
        success(res, 200, '接单成功，请尽快与用户开始咨询。', {
            record_id: row.record_id,
            consult_no: row.consult_no
        });
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 2.5 发送咨询消息（REST 版）
const sendMessage = async (req, res) => {
    const { record_id } = req.params;
    const { message_text } = req.body;
    const sender_id = req.user.role === 'expert' ? req.user.expert_id : req.user.user_id;
    const sender_type = req.user.role === 'expert' ? 2 : 1;

    try {
        await pool.query(
            `INSERT INTO expert_consult_message
       (record_id, sender_type, sender_id, message_text, send_time)
       VALUES ($1, $2, $3, $4, NOW())`,
            [record_id, sender_type, sender_id, message_text]
        );
        success(res, 201, '消息发送成功。');
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 2.6 专家完成咨询
const completeConsult = async (req, res) => {
    const { record_id } = req.params;
    const { consult_result, related_article_id } = req.body;
    const expert_id = req.user.expert_id;

    try {
        await pool.query(
            `UPDATE expert_consult_record
       SET status = 4, consult_result = $1, related_article_id = $2, complete_time = NOW()
       WHERE record_id = $1 AND expert_id = $2 AND status = 1`,
            [record_id, consult_result, related_article_id || null, expert_id]
        );
        success(res, 200, '咨询已完成。', { record_id, consult_status: 4 });
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};
// 2.7 用户支付咨询费用
const payConsult = async (req, res) => {
    const { record_id } = req.params;
    const user_id = req.user.user_id;

    try {
        const record = await pool.query(
            `SELECT * FROM expert_consult_record WHERE record_id = $1 AND user_id = $2 AND status = 4 AND pay_status = 0`,
            [record_id, user_id]
        );
        if (record.rows.length === 0) return fail(res, 404, '记录不存在或已支付');

        // 模拟生成支付负载（实际集成支付网关如 Stripe 或 Alipay）
        const payment_gateway_payload = {
            amount: record.rows[0].budget || 50.00, // 假设从 demand 取 budget
            order_id: `PAY${record.rows[0].consult_no}`,
            gateway: 'example_gateway',
            url: 'https://pay.example.com/initiate'
        };

        // 更新支付状态（实际在回调中更新）
        // await pool.query(`UPDATE expert_consult_record SET pay_status = 1 WHERE record_id = $1`, [record_id]);

        success(res, 200, '支付请求已生成。', { payment_gateway_payload });
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 2.8 用户评价咨询服务
const evaluateConsult = async (req, res) => {
    const { record_id } = req.params;
    const { eval_score, service_attitude, professional_level, response_speed, eval_content } = req.body;
    const user_id = req.user.user_id;

    try {
        const record = await pool.query(
            `SELECT * FROM expert_consult_record WHERE record_id = $1 AND user_id = $2 AND status = 4`,
            [record_id, user_id]
        );
        if (record.rows.length === 0) return fail(res, 404, '记录不存在或未完成');

        const existEval = await pool.query(
            `SELECT 1 FROM expert_consult_evaluation WHERE record_id = $1`,
            [record_id]
        );
        if (existEval.rows.length > 0) return fail(res, 409, '提交失败。', '您已经评价过该咨询。');

        await pool.query(
            `INSERT INTO expert_consult_evaluation
       (record_id, eval_score, service_attitude, professional_level, response_speed, eval_content, eval_time)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [record_id, eval_score, service_attitude, professional_level, response_speed, eval_content]
        );

        // 更新专家平均分（示例）
        await pool.query(`
      UPDATE expert_info SET avg_score = (
        SELECT AVG(eval_score) FROM expert_consult_evaluation e
        JOIN expert_consult_record r ON e.record_id = r.record_id WHERE r.expert_id = $1
      ) WHERE expert_id = (SELECT expert_id FROM expert_consult_record WHERE record_id = $2)
    `, [record.rows[0].expert_id, record_id]);

        success(res, 201, '评价成功，感谢您的反馈。');
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

module.exports = {
    applyExpert,
    getExperts,
    createDemand,
    acceptDemand,
    sendMessage,
    completeConsult,
    payConsult,
    evaluateConsult
};