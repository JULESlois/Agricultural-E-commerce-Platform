const { pool } = require('../database');

class FootprintModel {
  static async findByUser(userId, viewType, page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;
    
    // 获取总数
    const countQuery = `
      SELECT COUNT(*) FROM mall_user_footprint 
      WHERE user_id = $1 AND view_type = $2 AND is_deleted = 0
    `;
    const countResult = await pool.query(countQuery, [userId, viewType]);
    const total = parseInt(countResult.rows[0].count);

    // 获取列表
    const listQuery = `
      SELECT footprint_id, view_obj_id, view_obj_name, view_time
      FROM mall_user_footprint
      WHERE user_id = $1 AND view_type = $2 AND is_deleted = 0
      ORDER BY view_time DESC
      LIMIT $3 OFFSET $4
    `;
    const listResult = await pool.query(listQuery, [userId, viewType, pageSize, offset]);

    return {
      total,
      list: listResult.rows
    };
  }

  static async deleteByIds(userId, footprintIds) {
    const query = `
      UPDATE mall_user_footprint 
      SET is_deleted = 1, delete_time = NOW()
      WHERE user_id = $1 AND footprint_id = ANY($2::bigint[])
    `;
    await pool.query(query, [userId, footprintIds]);
  }

  static async create(userId, viewType, viewObjId, viewObjName, viewDuration = 0, viewIp = null, viewDevice = null) {
    const query = `
      INSERT INTO mall_user_footprint (
        user_id, view_type, view_obj_id, view_obj_name, view_duration, view_ip, view_device
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING footprint_id
    `;
    const result = await pool.query(query, [
      userId, viewType, viewObjId, viewObjName, viewDuration, viewIp, viewDevice
    ]);
    return result.rows[0];
  }
}

module.exports = FootprintModel;