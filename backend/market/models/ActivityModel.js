const { pool } = require('../database');

class ActivityModel {
  static async findActiveList() {
    const query = `
      SELECT activity_id, activity_no, activity_name, activity_type, 
             end_time, discount_rule
      FROM mall_discount_activity 
      WHERE activity_status = 1 AND end_time > CURRENT_TIMESTAMP
      ORDER BY create_time DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async create(activityData, createUser = 1) {
    const {
      activity_name, activity_type, start_time, end_time,
      discount_rule, apply_category_ids
    } = activityData;

    const activityNo = `DIS${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 1000000)}`;

    const query = `
      INSERT INTO mall_discount_activity (
        activity_no, activity_name, activity_type, start_time, end_time,
        discount_rule, apply_category_ids, activity_status, create_user
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8)
      RETURNING activity_id
    `;

    const values = [
      activityNo, activity_name, activity_type, start_time, end_time,
      discount_rule, apply_category_ids, createUser
    ];

    const result = await pool.query(query, values);
    return { activity_id: result.rows[0].activity_id };
  }

  static async findById(activityId) {
    const query = `
      SELECT activity_id, activity_no, activity_name, activity_status,
             total_source_count, total_order_count, total_sales_amount
      FROM mall_discount_activity 
      WHERE activity_id = $1
    `;
    const result = await pool.query(query, [activityId]);
    return result.rows[0];
  }
}

module.exports = ActivityModel;