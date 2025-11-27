const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const CollectionController = require('../controllers/CollectionController');
const { pool } = require('../database');

// 收藏商品
router.post('/collections', verifyToken, CollectionController.addCollection);

// 取消收藏
router.delete('/collections/:collection_id', verifyToken, CollectionController.removeCollection);

// 获取收藏列表
router.get('/collections', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.user_id;
    
    const result = await pool.query(`
      SELECT 
        c.collection_id,
        c.source_id,
        c.create_time,
        s.product_name,
        s.product_spec,
        s.unit_price,
        s.product_images
      FROM mall_user_collection c
      JOIN mall_farmer_source s ON c.source_id = s.source_id
      WHERE c.user_id = $1 AND c.is_valid = 1
      ORDER BY c.create_time DESC
    `, [userId]);
    
    const collections = result.rows.map(row => {
      let main_image = null;
      try {
        const images = JSON.parse(row.product_images || '[]');
        main_image = Array.isArray(images) ? images[0] : images;
      } catch (e) {
        main_image = row.product_images;
      }
      
      return {
        collection_id: row.collection_id,
        source_id: row.source_id,
        product_name: row.product_name,
        product_spec: row.product_spec,
        unit_price: parseFloat(row.unit_price),
        main_image,
        create_time: row.create_time
      };
    });
    
    res.json({
      code: 200,
      message: '查询成功',
      data: collections
    });
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '查询失败'
    });
  }
});

// 获取我的收藏（别名）
router.get('/favorites', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.user_id;
    
    const result = await pool.query(`
      SELECT 
        c.collection_id,
        c.source_id,
        c.create_time,
        s.product_name,
        s.product_spec,
        s.unit_price,
        s.product_images
      FROM mall_user_collection c
      JOIN mall_farmer_source s ON c.source_id = s.source_id
      WHERE c.user_id = $1 AND c.is_valid = 1
      ORDER BY c.create_time DESC
    `, [userId]);
    
    const collections = result.rows.map(row => {
      let main_image = null;
      try {
        const images = JSON.parse(row.product_images || '[]');
        main_image = Array.isArray(images) ? images[0] : images;
      } catch (e) {
        main_image = row.product_images;
      }
      
      return {
        collection_id: row.collection_id,
        source_id: row.source_id,
        product_name: row.product_name,
        product_spec: row.product_spec,
        unit_price: parseFloat(row.unit_price),
        main_image,
        create_time: row.create_time
      };
    });
    
    res.json({
      code: 200,
      message: '查询成功',
      data: collections
    });
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '查询失败'
    });
  }
});

module.exports = router;