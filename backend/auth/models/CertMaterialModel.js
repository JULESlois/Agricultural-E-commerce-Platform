const { pool } = require('../../market/database');

class CertMaterialModel {
  static async create(materialData) {
    const {
      apply_id, material_type, material_name, material_url,
      material_format, material_size, upload_user_id
    } = materialData;

    const query = `
      INSERT INTO sys_user_cert_material (
        apply_id, material_type, material_name, material_url,
        material_format, material_size, upload_user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (apply_id, material_type) 
      DO UPDATE SET 
        material_name = EXCLUDED.material_name,
        material_url = EXCLUDED.material_url,
        material_format = EXCLUDED.material_format,
        material_size = EXCLUDED.material_size,
        upload_time = NOW()
      RETURNING material_id, material_url
    `;

    const values = [
      apply_id, material_type, material_name, material_url,
      material_format, material_size, upload_user_id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByApplyId(applyId) {
    const query = `
      SELECT material_id, material_type, material_name, material_url,
             material_format, material_size, upload_time
      FROM sys_user_cert_material
      WHERE apply_id = $1 AND material_status = 1
      ORDER BY upload_time DESC
    `;
    const result = await pool.query(query, [applyId]);
    return result.rows;
  }

  static async checkRequiredMaterials(applyId, requiredMaterials) {
    const query = `
      SELECT material_type
      FROM sys_user_cert_material
      WHERE apply_id = $1 AND material_status = 1
    `;
    const result = await pool.query(query, [applyId]);
    const uploadedTypes = result.rows.map(row => row.material_type);
    
    const missingMaterials = requiredMaterials.filter(
      material => !uploadedTypes.includes(material)
    );
    
    return {
      isComplete: missingMaterials.length === 0,
      missingMaterials
    };
  }
}

module.exports = CertMaterialModel;