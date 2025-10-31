const express = require('express');
const router = express.Router();
const { pool, testConnection } = require('./database');
const authRoutes = require('./routes/auth');

// 测试数据库连接
// 注意：这个测试应该只在模块初始化时运行一次
// 但在实际使用中，可能需要移到更合适的位置
// 因为每次导入这个模块都会执行一次测试
// testConnection();

// 挂载子路由
router.use('/auth', authRoutes);

// 基础路由
router.get('/', (req, res) => {
  res.json({ 
    message: 'Market Service API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// 健康检查路由
router.get('/health', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: err.message
    });
  }
});

// 示例市场数据路由
router.get('/products', async (req, res) => {
  try {
    const client = await pool.connect();
    // 这里可以根据实际数据库表结构调整查询
    const result = await client.query('SELECT * FROM products LIMIT 10');
    client.release();
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('查询产品数据失败:', err);
    res.status(500).json({
      success: false,
      error: '获取产品数据失败'
    });
  }
});

module.exports = router;