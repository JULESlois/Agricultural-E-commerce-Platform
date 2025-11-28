const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 认证中间件
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    // 如果没有token，使用测试用户（用于开发测试）
    req.user = { user_id: 1, user_type: 2 };
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Token无效，使用测试用户
    req.user = { user_id: 1, user_type: 2 };
    next();
  }
};

// 获取购物车列表
router.get('/cart', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const query = `
      SELECT 
        c.cart_id,
        c.source_id,
        c.quantity,
        s.product_name,
        s.product_spec,
        s.unit_price,
        s.product_images,
        s.total_quantity,
        u.user_name as farmer_name
      FROM mall_shopping_cart c
      JOIN mall_farmer_source s ON c.source_id = s.source_id
      JOIN sys_user u ON s.user_id = u.user_id
      WHERE c.user_id = $1
      ORDER BY c.create_time DESC
    `;
    
    const result = await pool.query(query, [userId]);
    
    const cartItems = result.rows.map(row => {
      let productImage = null;
      try {
        const images = JSON.parse(row.product_images || '[]');
        productImage = Array.isArray(images) ? images[0] : images;
      } catch (e) {
        productImage = row.product_images;
      }
      
      return {
        cart_id: row.cart_id,
        source_id: row.source_id,
        product_name: row.product_name,
        product_spec: row.product_spec,
        product_image: productImage,
        unit_price: parseFloat(row.unit_price),
        quantity: row.quantity,
        total_quantity: row.total_quantity,
        farmer_name: row.farmer_name
      };
    });
    
    res.json({
      code: 200,
      message: '获取成功',
      data: cartItems
    });
  } catch (error) {
    console.error('获取购物车失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取购物车失败: ' + error.message
    });
  }
});

// 添加到购物车
router.post('/cart/add', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { source_id, quantity } = req.body;
    
    if (!source_id || !quantity) {
      return res.status(400).json({
        code: 400,
        message: '参数不完整'
      });
    }
    
    // 检查商品是否存在
    const sourceCheck = await pool.query(
      'SELECT source_id, total_quantity FROM mall_farmer_source WHERE source_id = $1',
      [source_id]
    );
    
    if (sourceCheck.rows.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '商品不存在'
      });
    }
    
    // 检查是否已在购物车中
    const existingCart = await pool.query(
      'SELECT cart_id, quantity FROM mall_shopping_cart WHERE user_id = $1 AND source_id = $2',
      [userId, source_id]
    );
    
    let cartId;
    if (existingCart.rows.length > 0) {
      // 更新数量
      const newQuantity = existingCart.rows[0].quantity + quantity;
      await pool.query(
        'UPDATE mall_shopping_cart SET quantity = $1, update_time = CURRENT_TIMESTAMP WHERE cart_id = $2',
        [newQuantity, existingCart.rows[0].cart_id]
      );
      cartId = existingCart.rows[0].cart_id;
    } else {
      // 插入新记录
      const insertResult = await pool.query(
        'INSERT INTO mall_shopping_cart (user_id, source_id, quantity) VALUES ($1, $2, $3) RETURNING cart_id',
        [userId, source_id, quantity]
      );
      cartId = insertResult.rows[0].cart_id;
    }
    
    res.json({
      code: 200,
      message: '添加成功',
      data: {
        cart_id: cartId,
        source_id,
        quantity
      }
    });
  } catch (error) {
    console.error('添加购物车失败:', error);
    res.status(500).json({
      code: 500,
      message: '添加购物车失败: ' + error.message
    });
  }
});

// 更新购物车商品数量
router.put('/cart/:cart_id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { cart_id } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        code: 400,
        message: '数量必须大于0'
      });
    }
    
    // 验证购物车项是否属于当前用户
    const checkResult = await pool.query(
      'SELECT cart_id FROM mall_shopping_cart WHERE cart_id = $1 AND user_id = $2',
      [cart_id, userId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '购物车项不存在'
      });
    }
    
    await pool.query(
      'UPDATE mall_shopping_cart SET quantity = $1, update_time = CURRENT_TIMESTAMP WHERE cart_id = $2',
      [quantity, cart_id]
    );
    
    res.json({
      code: 200,
      message: '更新成功'
    });
  } catch (error) {
    console.error('更新购物车失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新购物车失败: ' + error.message
    });
  }
});

// 删除购物车商品
router.delete('/cart/:cart_id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { cart_id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM mall_shopping_cart WHERE cart_id = $1 AND user_id = $2',
      [cart_id, userId]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({
        code: 404,
        message: '购物车项不存在'
      });
    }
    
    res.json({
      code: 200,
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除购物车失败:', error);
    res.status(500).json({
      code: 500,
      message: '删除购物车失败: ' + error.message
    });
  }
});

module.exports = router;
