const { pool } = require('../database');

class CouponModel {
  static async findAvailableRules() {
    const query = `
      SELECT rule_id, coupon_name, coupon_type, face_value, discount_rate,
             min_use_amount, max_discount_amount, valid_start_time, valid_end_time,
             (total_quantity - used_quantity) as remaining_quantity
      FROM mall_coupon_rule
      WHERE status = 1 AND obtain_type = 1 
        AND valid_start_time <= CURRENT_TIMESTAMP AND valid_end_time >= CURRENT_TIMESTAMP
        AND used_quantity < total_quantity
      ORDER BY create_time DESC
    `;
    const result = await pool.query(query);
    return result.rows.map(row => ({
      ...row,
      valid_period: `${row.valid_start_time.toISOString().split('T')[0]} 至 ${row.valid_end_time.toISOString().split('T')[0]}`
    }));
  }

  static async claimCoupon(userId, ruleId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 检查规则是否有效
      const ruleQuery = `
        SELECT * FROM mall_coupon_rule 
        WHERE rule_id = $1 AND status = 1 AND obtain_type = 1
          AND valid_start_time <= NOW() AND valid_end_time >= NOW()
          AND used_quantity < total_quantity
      `;
      const ruleResult = await client.query(ruleQuery, [ruleId]);
      
      if (ruleResult.rows.length === 0) {
        throw new Error('优惠券不存在或已失效');
      }

      const rule = ruleResult.rows[0];

      // 检查用户领取限制
      const userCountQuery = `
        SELECT COUNT(*) FROM mall_user_coupon 
        WHERE user_id = $1 AND rule_id = $2
      `;
      const userCountResult = await client.query(userCountQuery, [userId, ruleId]);
      
      if (parseInt(userCountResult.rows[0].count) >= rule.obtain_limit) {
        throw new Error('您已达到该优惠券的领取上限。');
      }

      // 生成优惠券
      const couponNo = `CPN${Date.now()}${Math.floor(Math.random() * 100000000)}`;
      const insertQuery = `
        INSERT INTO mall_user_coupon (
          rule_id, user_id, coupon_no, valid_start_time, valid_end_time
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING user_coupon_id, coupon_no
      `;
      
      const insertResult = await client.query(insertQuery, [
        ruleId, userId, couponNo, rule.valid_start_time, rule.valid_end_time
      ]);

      // 更新已使用数量
      await client.query(
        'UPDATE mall_coupon_rule SET used_quantity = used_quantity + 1 WHERE rule_id = $1',
        [ruleId]
      );

      // 记录日志
      await client.query(`
        INSERT INTO mall_coupon_log (user_coupon_id, user_id, operate_type, operate_desc)
        VALUES ($1, $2, 1, '用户领取优惠券')
      `, [insertResult.rows[0].user_coupon_id, userId]);

      await client.query('COMMIT');
      return insertResult.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findUserCoupons(userId, status = 0) {
    const query = `
      SELECT uc.user_coupon_id, uc.coupon_no, uc.use_status, uc.valid_start_time, uc.valid_end_time,
             cr.coupon_name, cr.coupon_type, cr.face_value, cr.discount_rate, cr.min_use_amount, cr.max_discount_amount
      FROM mall_user_coupon uc
      LEFT JOIN mall_coupon_rule cr ON uc.rule_id = cr.rule_id
      WHERE uc.user_id = $1 AND uc.use_status = $2
      ORDER BY uc.obtain_time DESC
    `;
    const result = await pool.query(query, [userId, status]);
    
    return result.rows.map(row => ({
      ...row,
      description: row.coupon_type === 1 
        ? `满${row.min_use_amount}元可用` 
        : `全场通用，最高可抵扣${row.max_discount_amount}元`
    }));
  }

  static async createRule(ruleData, createUser = 1) {
    const {
      coupon_type, coupon_name, face_value, min_use_amount,
      valid_start_time, valid_end_time, total_quantity, obtain_limit, obtain_type
    } = ruleData;

    const query = `
      INSERT INTO mall_coupon_rule (
        coupon_type, coupon_name, face_value, min_use_amount,
        valid_start_time, valid_end_time, total_quantity, obtain_limit, obtain_type, status, create_user
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1, $10)
      RETURNING rule_id
    `;

    const values = [
      coupon_type, coupon_name, face_value, min_use_amount,
      valid_start_time, valid_end_time, total_quantity, obtain_limit, obtain_type, createUser
    ];

    const result = await pool.query(query, values);
    return { rule_id: result.rows[0].rule_id };
  }

  static async findLogs(filters) {
    let query = `
      SELECT log_id, operate_type, operate_time, operate_desc
      FROM mall_coupon_log
      WHERE 1=1
    `;
    const values = [];
    let paramIndex = 1;

    if (filters.user_coupon_id) {
      query += ` AND user_coupon_id = $${paramIndex++}`;
      values.push(filters.user_coupon_id);
    }
    if (filters.order_id) {
      query += ` AND order_id = $${paramIndex++}`;
      values.push(filters.order_id);
    }
    if (filters.user_id) {
      query += ` AND user_id = $${paramIndex++}`;
      values.push(filters.user_id);
    }

    query += ' ORDER BY operate_time DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }
}

module.exports = CouponModel;