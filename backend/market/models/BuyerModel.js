const { pool } = require('../database');

class BuyerModel {
  static async createOrUpdate(userId, buyerData) {
    const {
      buyer_type, company_name, company_address, taxpayer_id, purchase_scope,
      monthly_purchase, preferred_payment, preferred_logistics
    } = buyerData;

    const query = `
      INSERT INTO sys_user_buyer (
        user_id, buyer_type, company_name, company_address, taxpayer_id,
        purchase_scope, monthly_purchase, preferred_payment, preferred_logistics
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        buyer_type = EXCLUDED.buyer_type,
        company_name = EXCLUDED.company_name,
        company_address = EXCLUDED.company_address,
        taxpayer_id = EXCLUDED.taxpayer_id,
        purchase_scope = EXCLUDED.purchase_scope,
        monthly_purchase = EXCLUDED.monthly_purchase,
        preferred_payment = EXCLUDED.preferred_payment,
        preferred_logistics = EXCLUDED.preferred_logistics,
        update_time = CURRENT_TIMESTAMP
      RETURNING buyer_id, user_id, company_name, update_time
    `;

    const values = [
      userId, buyer_type, company_name, company_address, taxpayer_id,
      purchase_scope, monthly_purchase, preferred_payment, preferred_logistics
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT buyer_id, user_id, buyer_type, company_name, company_address,
             taxpayer_id, purchase_scope, monthly_purchase, preferred_payment, preferred_logistics
      FROM sys_user_buyer WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = BuyerModel;