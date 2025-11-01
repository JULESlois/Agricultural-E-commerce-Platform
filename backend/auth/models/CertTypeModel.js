const { pool } = require('../../market/database');

class CertTypeModel {
  static async findByUserType(userType) {
    const query = `
      SELECT cert_type_id, cert_type_code, cert_type_name, cert_level, 
             required_materials, optional_materials, audit_cycle
      FROM sys_cert_type 
      WHERE apply_user_type = $1 AND cert_type_status = 1
      ORDER BY sort, cert_type_id
    `;
    const result = await pool.query(query, [userType]);
    return result.rows;
  }

  static async create(certTypeData) {
    const {
      cert_type_code, cert_type_name, apply_user_type, cert_level,
      required_materials, optional_materials, audit_cycle, create_user
    } = certTypeData;

    const query = `
      INSERT INTO sys_cert_type (
        cert_type_code, cert_type_name, apply_user_type, cert_level,
        required_materials, optional_materials, audit_cycle, create_user
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING cert_type_id
    `;

    const values = [
      cert_type_code, cert_type_name, apply_user_type, cert_level,
      JSON.stringify(required_materials), JSON.stringify(optional_materials || []),
      audit_cycle, create_user
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = CertTypeModel;