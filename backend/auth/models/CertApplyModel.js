const { pool } = require('../../market/database');

class CertApplyModel {
  static async createDraft(userId, certTypeId) {
    const applyNo = `CERT${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const query = `
      INSERT INTO sys_user_cert_apply (apply_no, user_id, cert_type_id, cert_type_code, apply_info, apply_status)
      SELECT $1, $2, $3, cert_type_code, '{}', 0
      FROM sys_cert_type WHERE cert_type_id = $3
      RETURNING apply_id, apply_no
    `;

    const result = await pool.query(query, [applyNo, userId, certTypeId]);
    return result.rows[0];
  }

  static async findByUserAndId(userId, applyId) {
    const query = `
      SELECT * FROM sys_user_cert_apply 
      WHERE apply_id = $1 AND user_id = $2
    `;
    const result = await pool.query(query, [applyId, userId]);
    return result.rows[0];
  }

  static async updateStatus(applyId, status, additionalData = {}) {
    const fields = ['apply_status = $2', 'update_time = NOW()'];
    const values = [applyId, status];
    let paramCount = 3;

    for (const [key, value] of Object.entries(additionalData)) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }

    const query = `
      UPDATE sys_user_cert_apply 
      SET ${fields.join(', ')}
      WHERE apply_id = $1
      RETURNING apply_id
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT sca.*, sct.cert_type_name
      FROM sys_user_cert_apply sca
      LEFT JOIN sys_cert_type sct ON sca.cert_type_id = sct.cert_type_id
      WHERE sca.user_id = $1
      ORDER BY sca.create_time DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findPendingList(status = 1, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    
    const countQuery = `
      SELECT COUNT(*) FROM sys_user_cert_apply WHERE apply_status = $1
    `;
    const countResult = await pool.query(countQuery, [status]);
    const total = parseInt(countResult.rows[0].count);

    const dataQuery = `
      SELECT sca.*, sct.cert_type_name, su.real_name, su.user_name
      FROM sys_user_cert_apply sca
      LEFT JOIN sys_cert_type sct ON sca.cert_type_id = sct.cert_type_id
      LEFT JOIN sys_user su ON sca.user_id = su.user_id
      WHERE sca.apply_status = $1
      ORDER BY sca.create_time DESC
      LIMIT $2 OFFSET $3
    `;
    const dataResult = await pool.query(dataQuery, [status, pageSize, offset]);

    return {
      rows: dataResult.rows,
      count: total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page
    };
  }

  static async findDetailById(applyId) {
    const query = `
      SELECT sca.*, sct.cert_type_name, sct.required_materials, sct.optional_materials,
             su.real_name, su.user_name, su.phone
      FROM sys_user_cert_apply sca
      LEFT JOIN sys_cert_type sct ON sca.cert_type_id = sct.cert_type_id
      LEFT JOIN sys_user su ON sca.user_id = su.user_id
      WHERE sca.apply_id = $1
    `;
    const result = await pool.query(query, [applyId]);
    return result.rows[0];
  }
}

module.exports = CertApplyModel;