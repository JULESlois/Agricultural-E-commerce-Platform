const { pool } = require('../database');

class OrderModel {
  static async create(orderData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000000)}`;
      const itemNo = `ITM${Date.now()}${Math.floor(Math.random() * 1000000)}`;

      const {
        buyer_id, seller_id, source_id, quantity, unit_price, total_amount,
        discount_amount, freight_amount, pay_amount, delivery_type, receiver_address_id, 
        order_remark, user_coupon_id
      } = orderData;

      // 插入订单主表
      const orderQuery = `
        INSERT INTO mall_order_main (
          order_id, buyer_id, seller_id, source_id, order_type, order_status,
          payment_status, delivery_status, total_quantity, unit_price, total_amount,
          discount_amount, freight_amount, pay_amount, delivery_type, receiver_address_id, order_remark
        ) VALUES ($1, $2, $3, $4, 1, 0, 0, 0, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING order_id
      `;

      await client.query(orderQuery, [
        orderId, buyer_id, seller_id, source_id, quantity, unit_price,
        total_amount, discount_amount, freight_amount, pay_amount, delivery_type, receiver_address_id, order_remark
      ]);

      // 如果使用了优惠券，更新优惠券状态
      if (user_coupon_id) {
        await client.query(
          'UPDATE mall_user_coupon SET use_status = 1, use_time = NOW(), order_id = $1 WHERE user_coupon_id = $2',
          [orderId, user_coupon_id]
        );
      }

      // 更新货源库存
      await client.query(
        'UPDATE mall_farmer_source SET surplus_quantity = surplus_quantity - $1 WHERE source_id = $2',
        [quantity, source_id]
      );

      // 插入订单明细表
      const itemQuery = `
        INSERT INTO mall_order_item (
          order_id, item_no, source_id, product_name, product_spec, item_quantity,
          unit_price, item_amount, discount_amount, freight_amount, item_pay_amount
        ) SELECT $1, $2, $3, product_name, product_spec, $4, $5, $6, $7, $8, $9
        FROM mall_farmer_source WHERE source_id = $3
      `;

      await client.query(itemQuery, [
        orderId, itemNo, source_id, quantity, unit_price, total_amount, discount_amount, freight_amount, pay_amount
      ]);

      await client.query('COMMIT');
      return { order_id: orderId, pay_amount };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByUser(userId, userType, status = null, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    let whereClause = userType === 'buyer' ? 'WHERE o.buyer_id = $1' : 'WHERE o.seller_id = $1';
    const values = [userId];
    let paramCount = 2;

    if (status !== null && status !== undefined && status !== 'undefined') {
      whereClause += ` AND o.order_status = $${paramCount}`;
      values.push(parseInt(status));
      paramCount++;
    }

    const query = `
      SELECT o.order_id, o.order_status, o.pay_amount, o.create_time,
             ${userType === 'buyer' ? 'COALESCE(f.farm_name, u_seller.real_name) as seller_name' : 'u_buyer.real_name as buyer_name'},
             array_agg(json_build_object('product_name', i.product_name, 'item_quantity', i.item_quantity)) as items
      FROM mall_order_main o
      LEFT JOIN mall_order_item i ON o.order_id = i.order_id
      ${userType === 'buyer' ? 
        'LEFT JOIN sys_user_farmer f ON o.seller_id = f.user_id LEFT JOIN sys_user u_seller ON o.seller_id = u_seller.user_id' : 
        'LEFT JOIN sys_user u_buyer ON o.buyer_id = u_buyer.user_id'
      }
      ${whereClause}
      GROUP BY o.order_id, o.order_status, o.pay_amount, o.create_time, ${userType === 'buyer' ? 'f.farm_name, u_seller.real_name' : 'u_buyer.real_name'}
      ORDER BY o.create_time DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    values.push(pageSize, offset);

    const result = await pool.query(query, values);
    return result.rows.map(row => ({
      order_id: row.order_id,
      order_status: row.order_status,
      pay_amount: row.pay_amount,
      [userType === 'buyer' ? 'seller_name' : 'buyer_name']: row[userType === 'buyer' ? 'seller_name' : 'buyer_name'],
      items: row.items.filter(item => item.product_name) // 过滤空值
    }));
  }

  static async findById(orderId) {
    const query = `
      SELECT o.*, a.receiver, a.phone, 
             CONCAT(a.province, a.city, a.county, a.detail_address) as full_address
      FROM mall_order_main o
      LEFT JOIN sys_user_address a ON o.receiver_address_id = a.address_id
      WHERE o.order_id = $1
    `;
    const orderResult = await pool.query(query, [orderId]);

    if (orderResult.rows.length === 0) return null;

    const itemQuery = `SELECT * FROM mall_order_item WHERE order_id = $1`;
    const itemResult = await pool.query(itemQuery, [orderId]);

    return {
      ...orderResult.rows[0],
      items: itemResult.rows,
      receiver_info: {
        receiver: orderResult.rows[0].receiver,
        phone: orderResult.rows[0].phone,
        full_address: orderResult.rows[0].full_address
      }
    };
  }

  static async updatePayment(orderId, paymentData) {
    const { payment_type, payment_no } = paymentData;
    const query = `
      UPDATE mall_order_main 
      SET payment_status = 1, payment_type = $1, payment_no = $2, payment_time = NOW(),
          order_status = 1, update_time = NOW()
      WHERE order_id = $3
      RETURNING order_id
    `;
    const result = await pool.query(query, [payment_type, payment_no, orderId]);
    return result.rows[0];
  }

  static async updateShipping(orderId, shippingData) {
    const { delivery_type, logistics_company, logistics_no } = shippingData;
    const query = `
      UPDATE mall_order_main 
      SET delivery_status = 1, logistics_company = $1, logistics_no = $2, 
          delivery_time = NOW(), order_status = 2, update_time = NOW()
      WHERE order_id = $3
      RETURNING order_id
    `;
    const result = await pool.query(query, [logistics_company, logistics_no, orderId]);
    return result.rows[0];
  }

  static async confirmReceipt(orderId) {
    const query = `
      UPDATE mall_order_main 
      SET delivery_status = 3, receive_time = NOW(), order_status = 4, update_time = NOW()
      WHERE order_id = $1
      RETURNING order_id
    `;
    const result = await pool.query(query, [orderId]);
    return result.rows[0];
  }

  static async applyInvoice(orderId, userId, invoiceData) {
    const { invoice_type, invoice_title, taxpayer_id, delivery_way } = invoiceData;
    
    // 获取订单信息计算发票金额
    const orderQuery = 'SELECT pay_amount FROM mall_order_main WHERE order_id = $1';
    const orderResult = await pool.query(orderQuery, [orderId]);
    const payAmount = orderResult.rows[0]?.pay_amount || 0;
    const taxAmount = payAmount * 0.13;
    const invoiceNo = `INV${Date.now()}${Math.floor(Math.random() * 1000000)}`;
    
    const query = `
      INSERT INTO mall_order_invoice (
        invoice_no, order_id, buyer_id, invoice_type, invoice_title, taxpayer_id, 
        invoice_amount, tax_rate, tax_amount, invoice_content, delivery_way, create_user,
        apply_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 0.13, $8, '农产品销售', $9, $3, NOW())
      RETURNING invoice_id
    `;
    
    const result = await pool.query(query, [
      invoiceNo, orderId, userId, invoice_type, invoice_title, taxpayer_id, 
      payAmount, taxAmount, delivery_way
    ]);
    return result.rows[0];
  }

  static async updateInvoiceStatus(invoiceId, updateData) {
    const { invoice_status, invoice_no, invoice_url } = updateData;
    
    let query = `
      UPDATE mall_order_invoice 
      SET invoice_status = $1, update_time = NOW()
    `;
    const values = [invoice_status];
    let paramCount = 2;

    if (invoice_no) {
      query += `, invoice_no = $${paramCount}`;
      values.push(invoice_no);
      paramCount++;
    }

    if (invoice_url) {
      query += `, invoice_url = $${paramCount}`;
      values.push(invoice_url);
      paramCount++;
    }

    if (invoice_status === 2) {
      query += `, issue_time = NOW()`;
    }

    query += ` WHERE invoice_id = $${paramCount} RETURNING invoice_id`;
    values.push(invoiceId);

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async calculateCouponDiscount(userCouponId, userId, orderAmount) {
    const query = `
      SELECT uc.*, cr.coupon_type, cr.face_value, cr.discount_rate, 
             cr.min_use_amount, cr.max_discount_amount
      FROM mall_user_coupon uc
      JOIN mall_coupon_rule cr ON uc.rule_id = cr.rule_id
      WHERE uc.user_coupon_id = $1 AND uc.user_id = $2 
        AND uc.use_status = 0 AND uc.valid_end_time > NOW()
    `;
    
    const result = await pool.query(query, [userCouponId, userId]);
    if (result.rows.length === 0) return 0;
    
    const coupon = result.rows[0];
    
    // 检查最低使用金额
    if (orderAmount < coupon.min_use_amount) return 0;
    
    let discount = 0;
    if (coupon.coupon_type === 1) { // 满减券
      discount = coupon.face_value;
    } else if (coupon.coupon_type === 2) { // 折扣券
      discount = orderAmount * (1 - coupon.discount_rate / 100);
      if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
        discount = coupon.max_discount_amount;
      }
    }
    
    return Math.min(discount, orderAmount);
  }
}

module.exports = OrderModel;
