const { pool } = require('../database');

class FollowModel {
  static async followSeller(userId, sellerId, followRemark) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 检查是否已关注
      const existQuery = `
        SELECT follow_id FROM mall_user_follow 
        WHERE user_id = $1 AND seller_id = $2 AND follow_status = 1
      `;
      const existResult = await client.query(existQuery, [userId, sellerId]);
      
      if (existResult.rows.length > 0) {
        throw new Error('您已关注该卖家');
      }

      // 获取卖家信息
      const sellerQuery = `
        SELECT u.real_name, f.farm_name 
        FROM sys_user u
        LEFT JOIN sys_user_farmer f ON u.user_id = f.user_id
        WHERE u.user_id = $1 AND u.user_type = 1
      `;
      const sellerResult = await client.query(sellerQuery, [sellerId]);
      
      if (sellerResult.rows.length === 0) {
        throw new Error('卖家不存在');
      }

      const seller = sellerResult.rows[0];
      const sellerName = seller.farm_name || seller.real_name;

      // 获取卖家货源数量
      const sourceCountQuery = `
        SELECT COUNT(*) FROM mall_farmer_source 
        WHERE user_id = $1 AND audit_status = 1 AND source_status = 1
      `;
      const sourceCountResult = await client.query(sourceCountQuery, [sellerId]);
      const sourceCount = parseInt(sourceCountResult.rows[0].count);

      // 检查是否曾经关注过（包括已取消的）
      const historyQuery = `
        SELECT follow_id FROM mall_user_follow 
        WHERE user_id = $1 AND seller_id = $2
      `;
      const historyResult = await client.query(historyQuery, [userId, sellerId]);
      
      let result;
      if (historyResult.rows.length > 0) {
        // 重新关注
        const updateQuery = `
          UPDATE mall_user_follow 
          SET follow_status = 1, follow_time = NOW(), cancel_time = NULL,
              seller_name = $3, source_count = $4, follow_remark = $5
          WHERE user_id = $1 AND seller_id = $2
          RETURNING follow_id
        `;
        result = await client.query(updateQuery, [
          userId, sellerId, sellerName, sourceCount, followRemark
        ]);
      } else {
        // 首次关注
        const insertQuery = `
          INSERT INTO mall_user_follow (
            user_id, seller_id, seller_name, source_count, follow_remark
          ) VALUES ($1, $2, $3, $4, $5)
          RETURNING follow_id
        `;
        result = await client.query(insertQuery, [
          userId, sellerId, sellerName, sourceCount, followRemark
        ]);
      }

      await client.query('COMMIT');
      return result.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async unfollowSeller(userId, sellerId) {
    const query = `
      UPDATE mall_user_follow 
      SET follow_status = 0, cancel_time = NOW()
      WHERE user_id = $1 AND seller_id = $2 AND follow_status = 1
      RETURNING follow_id
    `;
    const result = await pool.query(query, [userId, sellerId]);
    return result.rows[0];
  }

  static async findFollowedSellers(userId) {
    const query = `
      SELECT follow_id, seller_id, seller_name, source_count, avg_score, follow_time
      FROM mall_user_follow
      WHERE user_id = $1 AND follow_status = 1
      ORDER BY follow_time DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = FollowModel;