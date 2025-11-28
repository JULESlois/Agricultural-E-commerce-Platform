const { pool } = require('../database');

class FarmerModel {
  static async createOrUpdate(userId, farmerData) {
    const {
      farm_name, contact_person, contact_phone, bank_card_no, bank_name, qualification
    } = farmerData;

    const query = `
      INSERT INTO sys_user_farmer (user_id, farm_name, contact_person, contact_phone, bank_card_no, bank_name, qualification)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        farm_name = EXCLUDED.farm_name,
        contact_person = EXCLUDED.contact_person,
        contact_phone = EXCLUDED.contact_phone,
        bank_card_no = EXCLUDED.bank_card_no,
        bank_name = EXCLUDED.bank_name,
        qualification = EXCLUDED.qualification,
        update_time = CURRENT_TIMESTAMP
      RETURNING farmer_id, user_id, farm_name, update_time
    `;

    const values = [userId, farm_name, contact_person, contact_phone, bank_card_no, bank_name, qualification];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId, isOwner = false) {
    let query;
    if (isOwner) {
      query = `
        SELECT farmer_id, user_id, farm_name, contact_person, contact_phone,
               CONCAT(SUBSTRING(bank_card_no, 1, 4), '...', SUBSTRING(bank_card_no, -4)) as bank_card_no,
               bank_name, qualification
        FROM sys_user_farmer WHERE user_id = $1
      `;
    } else {
      query = `
        SELECT user_id, farm_name, qualification
        FROM sys_user_farmer WHERE user_id = $1
      `;
    }
    
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = FarmerModel;