// New: backend/help/controllers/csController.js (for customer support)

const pool = require('../config/db');
const { success, fail } = require('../utils/response');

// 1.1 管理员创建官方客服
const createOfficialCs = async (req, res) => {
    const { user_id, cs_type, cs_name, service_scope, work_time, max_session_count } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO cs_agents 
       (user_id, cs_type, cs_name, service_scope, work_time, max_session_count, create_time)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING cs_id`,
            [user_id, cs_type, cs_name, service_scope, work_time, max_session_count || 10]
        );
        success(res, 201, '官方客服创建成功。', { cs_id: result.rows[0].cs_id });
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 1.2 卖家创建店铺客服
const createSellerCs = async (req, res) => {
    const { user_id, cs_name, service_scope, work_time } = req.body;
    const seller_id = req.user.seller_id; // 假设 auth 有 seller_id

    try {
        await pool.query(
            `INSERT INTO cs_agents 
       (user_id, cs_type, cs_name, service_scope, work_time, seller_id, create_time)
       VALUES ($1, 2, $2, $3, $4, $5, NOW())`,
            [user_id, cs_name, service_scope, work_time, seller_id]
        );
        success(res, 201, '店铺客服创建成功。');
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 1.3 用户获取客服信息
const getCsInfo = async (req, res) => {
    const { type, seller_id } = req.query;

    let sql = `SELECT cs_id, cs_name, cs_avatar, online_status, work_time 
             FROM cs_agents WHERE online_status = 1`;
    const params = [];

    if (type === 'official') {
        sql += ' AND cs_type = 1';
    } else if (type === 'seller' && seller_id) {
        params.push(seller_id);
        sql += ' AND cs_type = 2 AND seller_id = $1';
    } else {
        return fail(res, 400, '参数错误');
    }

    sql += ' ORDER BY RANDOM() LIMIT 1'; // 随机分配可用客服

    try {
        const result = await pool.query(sql, params);
        if (result.rows.length === 0) return fail(res, 404, '无可用客服');
        success(res, 200, '查询成功。', result.rows[0]);
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 2.1 用户创建聊天会话
const createChatSession = async (req, res) => {
    const { cs_id, order_id } = req.body;
    const user_id = req.user.user_id;

    try {
        // 检查现有会话或创建新
        let session = await pool.query(
            `SELECT session_id, session_status FROM chat_sessions 
       WHERE user_id = $1 AND cs_id = $2 AND session_status = 1`,
            [user_id, cs_id]
        );

        if (session.rows.length > 0) {
            return success(res, 200, '会话已建立。', {
                session_id: session.rows[0].session_id,
                cs_name: (await pool.query(`SELECT cs_name FROM cs_agents WHERE cs_id = $1`, [cs_id])).rows[0].cs_name,
                session_status: session.rows[0].session_status
            });
        }

        const result = await pool.query(
            `INSERT INTO chat_sessions 
       (user_id, cs_id, order_id, session_id, session_status, create_time)
       VALUES ($1, $2, $3, 'SESSION'||to_char(NOW(),'YYYYMMDDHH')||lpad(nextval('chat_session_seq')::text,10,'0'), 1, NOW())
       RETURNING session_id, session_status`,
            [user_id, cs_id, order_id || null]
        );

        success(res, 201, '会话已建立。', {
            session_id: result.rows[0].session_id,
            cs_name: (await pool.query(`SELECT cs_name FROM cs_agents WHERE cs_id = $1`, [cs_id])).rows[0].cs_name,
            session_status: result.rows[0].session_status
        });
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 2.2 发送聊天消息
const sendChatMessage = async (req, res) => {
    const { session_id } = req.params;
    const { msg_type, msg_content } = req.body;
    const sender_type = req.user.role === 'user' ? 1 : 2; // 1用户,2客服
    const sender_id = req.user.role === 'user' ? req.user.user_id : req.user.cs_id;

    try {
        const result = await pool.query(
            `INSERT INTO chat_messages 
       (session_id, sender_type, sender_id, msg_type, msg_content, msg_time)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING msg_id`,
            [session_id, sender_type, sender_id, msg_type || 1, msg_content]
        );
        success(res, 201, '消息发送成功。', { msg_id: result.rows[0].msg_id });
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 2.3 获取聊天记录
const getChatMessages = async (req, res) => {
    const { session_id } = req.params;
    const { last_msg_id } = req.query;
    const limit = 20;

    let sql = `SELECT msg_id, sender_type, msg_type, msg_content, msg_time 
             FROM chat_messages WHERE session_id = $1`;
    const params = [session_id];

    if (last_msg_id) {
        params.push(last_msg_id);
        sql += ' AND msg_id < $2';
    }

    sql += ' ORDER BY msg_time DESC LIMIT ' + limit;

    try {
        const result = await pool.query(sql, params);
        success(res, 200, '查询成功。', result.rows.reverse()); // 倒序返回为正序
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 3.1 用户创建工单
const createWorkOrder = async (req, res) => {
    const { order_id, wo_type, wo_title, wo_content, wo_attachments } = req.body;
    const user_id = req.user.user_id;

    try {
        const result = await pool.query(
            `INSERT INTO work_orders 
       (user_id, order_id, wo_type, wo_title, wo_content, wo_attachments, wo_no, wo_status, create_time)
       VALUES ($1, $2, $3, $4, $5, $6, 'WO'||to_char(NOW(),'YYYYMMDD')||lpad(nextval('wo_seq')::text,10,'0'), 1, NOW())
       RETURNING wo_id, wo_no`,
            [user_id, order_id, wo_type, wo_title, wo_content, JSON.stringify(wo_attachments || [])]
        );
        success(res, 201, '工单提交成功，请等待客服处理。', { wo_id: result.rows[0].wo_id, wo_no: result.rows[0].wo_no });
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 3.2 客服处理工单
const handleWorkOrder = async (req, res) => {
    const { wo_id } = req.params;
    const { wo_status, handle_result } = req.body;
    const cs_id = req.user.cs_id;

    try {
        await pool.query(
            `UPDATE work_orders SET wo_status = $1, handle_result = $2, cs_id = $3, handle_time = NOW()
       WHERE wo_id = $4`,
            [wo_status, handle_result, cs_id, wo_id]
        );
        success(res, 200, '工单状态更新成功。');
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 3.3 获取工单详情
const getWorkOrderDetail = async (req, res) => {
    const { wo_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT w.*, c.cs_name, c.cs_id 
       FROM work_orders w LEFT JOIN cs_agents c ON w.cs_id = c.cs_id 
       WHERE w.wo_id = $1`,
            [wo_id]
        );
        if (result.rows.length === 0) return fail(res, 404, '工单不存在');
        success(res, 200, '查询成功。', result.rows[0]);
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 4.1 用户提交服务评价
const submitCsEvaluation = async (req, res) => {
    const { eval_type, wo_id, satisfaction_score, response_speed, professional_level, eval_content } = req.body;
    const user_id = req.user.user_id;

    try {
        const exist = await pool.query(
            `SELECT 1 FROM cs_evaluations WHERE user_id = $1 AND wo_id = $2`,
            [user_id, wo_id]
        );
        if (exist.rows.length > 0) return fail(res, 409, '提交失败。', '您已经评价过该工单。');

        await pool.query(
            `INSERT INTO cs_evaluations 
       (user_id, eval_type, wo_id, satisfaction_score, response_speed, professional_level, eval_content, eval_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
            [user_id, eval_type, wo_id, satisfaction_score, response_speed, professional_level, eval_content]
        );
        success(res, 201, '评价提交成功，感谢您的反馈。');
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

module.exports = {
    createOfficialCs,
    createSellerCs,
    getCsInfo,
    createChatSession,
    sendChatMessage,
    getChatMessages,
    createWorkOrder,
    handleWorkOrder,
    getWorkOrderDetail,
    submitCsEvaluation
};