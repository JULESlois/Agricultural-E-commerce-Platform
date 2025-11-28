const { pool } = require('../database');

class AddressModel {
  static async create(userId, addressData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const {
        address_name, receiver, phone, province, city, county,
        detail_address, is_default, postal_code
      } = addressData;

      if (is_default) {
        await client.query('UPDATE sys_user_address SET is_default = 0 WHERE user_id = $1', [userId]);
      }

      const query = `
        INSERT INTO sys_user_address (
          user_id, address_name, receiver, phone, province, city, county,
          detail_address, is_default, postal_code
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING address_id
      `;

      const values = [
        userId, address_name, receiver, phone, province, city, county,
        detail_address, is_default ? 1 : 0, postal_code
      ];

      const result = await client.query(query, values);
      await client.query('COMMIT');
      return result.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByUserId(userId) {
    const query = `
      SELECT address_id, address_name, receiver, phone,
             CONCAT(province, city, county, detail_address) as full_address,
             is_default
      FROM sys_user_address 
      WHERE user_id = $1 
      ORDER BY is_default DESC, create_time DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async update(userId, addressId, updates) {
    const fields = [];
    const values = [userId, addressId];
    let paramCount = 3;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) return null;
    fields.push('update_time = NOW()');

    const query = `
      UPDATE sys_user_address 
      SET ${fields.join(', ')}
      WHERE user_id = $1 AND address_id = $2
      RETURNING address_id
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(userId, addressId) {
    const query = `
      DELETE FROM sys_user_address 
      WHERE user_id = $1 AND address_id = $2
      RETURNING address_id
    `;
    const result = await pool.query(query, [userId, addressId]);
    return result.rows[0];
  }

  static async setDefault(userId, addressId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query('UPDATE sys_user_address SET is_default = 0 WHERE user_id = $1', [userId]);

      const result = await client.query(
        'UPDATE sys_user_address SET is_default = 1 WHERE user_id = $1 AND address_id = $2 RETURNING address_id',
        [userId, addressId]
      );

      await client.query('COMMIT');
      return result.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = AddressModel;