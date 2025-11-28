const { pool } = require('../database');

class FarmerModel {
  static async findById(userId) {
    const query = `
      SELECT u.user_id, u.user_name, u.phone, u.real_name,
             f.farm_name, f.contact_person, f.contact_phone,
             f.qualification as description
      FROM sys_user u
      LEFT JOIN sys_user_farmer f ON u.user_id = f.user_id
      WHERE u.user_id = $1 AND u.user_type = 1
    `;
    
    const result = await pool.query(query, [userId]);
    if (result.rows[0]) {
      const farmer = result.rows[0];
      // 添加默认值
      farmer.origin = '未提供';
      return farmer;
    }
    return null;
  }

  static async findProductsByFarmer(userId, page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;
    
    const query = `
      SELECT s.source_id, s.product_name, s.product_spec, s.unit_price, 
             s.total_quantity, s.surplus_quantity, s.product_images, s.is_discount
      FROM mall_farmer_source s
      WHERE s.user_id = $1 AND s.audit_status = 1 AND s.source_status = 1
      ORDER BY s.create_time DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [userId, pageSize, offset]);
    
    return result.rows.map(row => {
      let mainImage = null;
      try {
        const images = JSON.parse(row.product_images || '[]');
        mainImage = Array.isArray(images) ? images[0] : images;
      } catch (e) {
        mainImage = row.product_images;
      }
      return {
        ...row,
        main_image: mainImage
      };
    });
  }

  static async getStats(userId) {
    const query = `
      SELECT 
        COUNT(DISTINCT s.source_id) as product_count,
        COUNT(DISTINCT o.order_id) as order_count,
        COALESCE(SUM(o.pay_amount), 0) as total_sales
      FROM sys_user u
      LEFT JOIN mall_farmer_source s ON u.user_id = s.user_id AND s.audit_status = 1
      LEFT JOIN mall_order_main o ON u.user_id = o.seller_id AND o.order_status IN (2, 4)
      WHERE u.user_id = $1
      GROUP BY u.user_id
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows[0] || { product_count: 0, order_count: 0, total_sales: 0 };
  }
}

module.exports = FarmerModel;
