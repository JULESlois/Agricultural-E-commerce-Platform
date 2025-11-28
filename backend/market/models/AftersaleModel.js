const { pool } = require('../database');

class AftersaleModel {
  static async create(aftersaleData) {
    const { order_id, aftersale_type, apply_amount, reason, proof_images, apply_user } = aftersaleData;
    
    // 检查是否已存在售后申请
    const existQuery = 'SELECT aftersale_id FROM mall_order_aftersale WHERE order_id = $1';
    const existResult = await pool.query(existQuery, [order_id]);
    
    if (existResult.rows.length > 0) {
      throw new Error('该订单已存在售后申请');
    }

    const query = `
      INSERT INTO mall_order_aftersale (
        order_id, aftersale_type, apply_amount, reason, proof_images, apply_user
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING aftersale_id
    `;
    
    const result = await pool.query(query, [
      order_id, aftersale_type, apply_amount, reason, proof_images, apply_user
    ]);
    
    return result.rows[0];
  }

  static async review(aftersaleId, reviewData) {
    const { audit_user, audit_status, audit_remark } = reviewData;
    
    const query = `
      UPDATE mall_order_aftersale 
      SET audit_status = $1, audit_user = $2, audit_remark = $3, 
          audit_time = NOW(), update_time = NOW()
      WHERE aftersale_id = $4
      RETURNING aftersale_id
    `;
    
    const result = await pool.query(query, [
      audit_status, audit_user, audit_remark, aftersaleId
    ]);
    
    return result.rows[0];
  }
}

module.exports = AftersaleModel;