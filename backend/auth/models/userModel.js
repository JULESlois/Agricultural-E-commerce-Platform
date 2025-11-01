const { pool } = require('../../market/database');

class UserModel {
  static async create(userData) {
    const { user_name, password, real_name, user_type, id_card, phone, email } = userData;
    const query = `
      INSERT INTO sys_user (user_name, password, real_name, user_type, id_card, phone, email, user_status, cert_status, create_time, update_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING user_id, user_name, real_name, user_type, phone, email, user_status, cert_status
    `;
    const values = [user_name, password, real_name, user_type, id_card, phone, email || null, 2, 0];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByIdentifier(identifier) {
    const query = `
      SELECT user_id, user_name, password, real_name, user_type, phone, email, user_status, cert_status, last_login_time
      FROM sys_user WHERE user_name = $1 OR phone = $1
    `;
    const result = await pool.query(query, [identifier]);
    return result.rows[0];
  }

  static async findById(userId) {
    const query = `
      SELECT user_id, user_name, real_name, user_type, 
             CONCAT(SUBSTRING(phone, 1, 3), '****', SUBSTRING(phone, 8)) as phone,
             email, avatar, user_status, cert_status, create_time
      FROM sys_user WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  static async update(userId, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const key of Object.keys(updates)) {
      if (updates[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    }

    if (fields.length === 0) return null;
    fields.push(`update_time = NOW()`);
    values.push(userId);

    const query = `UPDATE sys_user SET ${fields.join(', ')} WHERE user_id = $${paramCount} RETURNING user_id`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateLastLogin(userId) {
    await pool.query('UPDATE sys_user SET last_login_time = NOW() WHERE user_id = $1', [userId]);
  }

  static async checkExists(field, value) {
    const result = await pool.query(`SELECT user_id FROM sys_user WHERE ${field} = $1`, [value]);
    return result.rows.length > 0;
  }

  static async findAndCountAll(filters = {}, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    let whereClause = 'WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.user_type) {
      whereClause += ` AND user_type = $${paramCount}`;
      values.push(filters.user_type);
      paramCount++;
    }
    if (filters.user_status !== undefined) {
      whereClause += ` AND user_status = $${paramCount}`;
      values.push(filters.user_status);
      paramCount++;
    }

    const countResult = await pool.query(`SELECT COUNT(*) FROM sys_user ${whereClause}`, values);
    const total = Number.parseInt(countResult.rows[0].count);

    const dataQuery = `
      SELECT user_id, user_name, real_name, user_type, phone, email, user_status, cert_status, create_time, last_login_time
      FROM sys_user ${whereClause} ORDER BY create_time DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    values.push(pageSize, offset);
    const dataResult = await pool.query(dataQuery, values);

    return {
      rows: dataResult.rows,
      count: total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page
    };
  }
}

module.exports = UserModel;