const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const StatsController = require('../controllers/StatsController');
const { pool } = require('../database');

// 获取商品价格走势统计
router.get('/stats/price-trends', StatsController.getPriceTrends);

// 获取买家统计数据
router.get('/buyers/stats', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.user_id;
    
    // 查询订单统计
    const orderStats = await pool.query(`
      SELECT 
        COUNT(CASE WHEN order_status = 0 THEN 1 END) as pending_payment,
        COUNT(CASE WHEN order_status = 1 THEN 1 END) as pending_shipment,
        COUNT(CASE WHEN order_status = 2 THEN 1 END) as pending_receipt,
        COUNT(CASE WHEN order_status = 3 THEN 1 END) as completed
      FROM mall_order_main 
      WHERE buyer_id = $1
    `, [userId]);
    
    const stats = orderStats.rows[0] || {
      pending_payment: 0,
      pending_shipment: 0,
      pending_receipt: 0,
      completed: 0
    };
    
    res.json({
      code: 200,
      message: '查询成功',
      data: stats
    });
  } catch (error) {
    console.error('获取买家统计失败:', error);
    res.status(500).json({
      code: 500,
      message: '查询失败'
    });
  }
});

// 获取农户订单列表
router.get('/farmers/orders', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.user_id;
    const { page = 1, pageSize = 10, status } = req.query;
    
    let whereClause = 'WHERE seller_id = $1';
    let params = [userId];
    
    if (status !== undefined) {
      whereClause += ' AND order_status = $2';
      params.push(status);
    }
    
    const result = await pool.query(`
      SELECT 
        o.*,
        u.user_name as buyer_name,
        u.phone as buyer_phone
      FROM mall_order_main o
      JOIN sys_user u ON o.buyer_id = u.user_id
      ${whereClause}
      ORDER BY o.create_time DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `, [...params, pageSize, (page - 1) * pageSize]);
    
    res.json({
      code: 200,
      message: '查询成功',
      data: result.rows
    });
  } catch (error) {
    console.error('获取农户订单失败:', error);
    res.status(500).json({
      code: 500,
      message: '查询失败'
    });
  }
});

// 获取农户统计数据
router.get('/farmers/stats', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.user_id;
    
    // 查询商品和订单统计
    const [productStats, orderStats, salesStats] = await Promise.all([
      pool.query('SELECT COUNT(*) as total_products FROM mall_farmer_source WHERE user_id = $1 AND source_status = 1', [userId]),
      pool.query('SELECT COUNT(*) as pending_orders FROM mall_order_main WHERE seller_id = $1 AND order_status = 1', [userId]),
      pool.query(`
        SELECT 
          COALESCE(SUM(pay_amount), 0) as total_sales,
          COALESCE(SUM(CASE WHEN DATE_TRUNC('month', create_time) = DATE_TRUNC('month', CURRENT_DATE) THEN pay_amount ELSE 0 END), 0) as month_sales
        FROM mall_order_main 
        WHERE seller_id = $1 AND order_status >= 1
      `, [userId])
    ]);
    
    const stats = {
      total_products: parseInt(productStats.rows[0]?.total_products || 0),
      pending_orders: parseInt(orderStats.rows[0]?.pending_orders || 0),
      total_sales: parseFloat(salesStats.rows[0]?.total_sales || 0),
      month_sales: parseFloat(salesStats.rows[0]?.month_sales || 0)
    };
    
    res.json({
      code: 200,
      message: '查询成功',
      data: stats
    });
  } catch (error) {
    console.error('获取农户统计失败:', error);
    res.status(500).json({
      code: 500,
      message: '查询失败'
    });
  }
});

module.exports = router;