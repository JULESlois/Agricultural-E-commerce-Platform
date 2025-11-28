const { pool } = require('../database');

class SourceModel {
  static async create(userId, sourceData) {
    const {
      category_id, product_name, product_spec, origin, harvest_date, expire_date,
      total_quantity, unit_price, batch_price, batch_quantity, product_images,
      product_desc, logistics_type, freight_rule, min_order_quantity
    } = sourceData;

    const sourceNo = `SRC${Date.now()}${Math.floor(Math.random() * 1000000)}`;

    const query = `
      INSERT INTO mall_farmer_source (
        user_id, category_id, source_no, product_name, product_spec, origin,
        harvest_date, expire_date, total_quantity, surplus_quantity, unit_price,
        batch_price, batch_quantity, product_images, product_desc, logistics_type,
        freight_rule, min_order_quantity, audit_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, $10, $11, $12, $13, $14, $15, $16, $17, 0)
      RETURNING source_id, source_no, audit_status
    `;

    const values = [
      userId, category_id, sourceNo, product_name, product_spec, origin,
      harvest_date, expire_date, total_quantity, unit_price, batch_price,
      batch_quantity, JSON.stringify(product_images), product_desc,
      logistics_type, freight_rule, min_order_quantity
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findList(filters = {}, page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;
    let whereClause = 'WHERE s.audit_status = 1 AND s.source_status = 1';
    const values = [];
    let paramCount = 1;

    if (filters.category_id) {
      whereClause += ` AND s.category_id = $${paramCount}`;
      values.push(filters.category_id);
      paramCount++;
    }

    if (filters.keyword) {
      whereClause += ` AND s.product_name ILIKE $${paramCount}`;
      values.push(`%${filters.keyword}%`);
      paramCount++;
    }

    const countQuery = `SELECT COUNT(*) FROM mall_farmer_source s ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    let orderBy = 'ORDER BY s.create_time DESC';
    if (filters.sort === 'price_asc') orderBy = 'ORDER BY s.unit_price ASC';
    if (filters.sort === 'price_desc') orderBy = 'ORDER BY s.unit_price DESC';

    const dataQuery = `
      SELECT s.source_id, s.product_name, s.origin, s.unit_price, s.min_order_quantity,
             s.product_images, s.is_discount, f.farm_name
      FROM mall_farmer_source s
      LEFT JOIN sys_user_farmer f ON s.user_id = f.user_id
      ${whereClause} ${orderBy}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    values.push(pageSize, offset);

    const dataResult = await pool.query(dataQuery, values);

    return {
      total,
      list: dataResult.rows.map(row => ({
        ...row,
        main_image: JSON.parse(row.product_images || '[]')[0] || null
      }))
    };
  }

  static async findById(sourceId) {
    const query = `
      SELECT s.*, c.category_name, f.farm_name, u.real_name, u.cert_status
      FROM mall_farmer_source s
      LEFT JOIN mall_product_category c ON s.category_id = c.category_id
      LEFT JOIN sys_user_farmer f ON s.user_id = f.user_id
      LEFT JOIN sys_user u ON s.user_id = u.user_id
      WHERE s.source_id = $1
    `;
    const result = await pool.query(query, [sourceId]);
    
    if (result.rows[0]) {
      const source = result.rows[0];
      source.product_images = JSON.parse(source.product_images || '[]');
      source.seller_info = {
        user_id: source.user_id,
        farm_name: source.farm_name,
        cert_status: source.cert_status
      };
    }
    
    return result.rows[0];
  }

  static async updateAuditStatus(sourceId, auditStatus, auditUser, auditRemark) {
    const query = `
      UPDATE mall_farmer_source 
      SET audit_status = $1, audit_user = $2, audit_time = NOW(), audit_remark = $3
      WHERE source_id = $4
      RETURNING source_id
    `;
    const result = await pool.query(query, [auditStatus, auditUser, auditRemark, sourceId]);
    return result.rows[0];
  }

  static async createDemand(userId, demandData) {
    const {
      category_id, product_name, product_spec, required_quantity,
      max_unit_price, delivery_address_id, latest_delivery_date,
      payment_type, demand_desc
    } = demandData;

    const demandNo = `DEM${Date.now()}${Math.floor(Math.random() * 1000000)}`;

    const query = `
      INSERT INTO mall_buyer_demand (
        user_id, category_id, demand_no, product_name, product_spec,
        required_quantity, max_unit_price, delivery_address_id,
        latest_delivery_date, payment_type, demand_desc, demand_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 1)
      RETURNING demand_id, demand_no
    `;

    const values = [
      userId, category_id, demandNo, product_name, product_spec,
      required_quantity, max_unit_price, delivery_address_id,
      latest_delivery_date, payment_type, demand_desc
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findDemandList(filters = {}, page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;
    let whereClause = 'WHERE d.demand_status = 1';
    const values = [];
    let paramCount = 1;

    if (filters.category_id) {
      whereClause += ` AND d.category_id = $${paramCount}`;
      values.push(filters.category_id);
      paramCount++;
    }

    const countQuery = `SELECT COUNT(*) FROM mall_buyer_demand d ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    const dataQuery = `
      SELECT d.demand_id, d.product_name, d.required_quantity, d.max_unit_price,
             d.latest_delivery_date, a.city as delivery_city
      FROM mall_buyer_demand d
      LEFT JOIN sys_user_address a ON d.delivery_address_id = a.address_id
      ${whereClause}
      ORDER BY d.create_time DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    values.push(pageSize, offset);

    const dataResult = await pool.query(dataQuery, values);

    return {
      total,
      list: dataResult.rows
    };
  }
}

module.exports = SourceModel;