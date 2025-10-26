const express = require('express');
const { pool, testConnection } = require('./database');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', authRoutes);

// 测试数据库连接
testConnection();

// 基础路由
app.get('/', (req, res) => {
  res.json({ 
    message: 'Market Service API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// 健康检查路由
app.get('/health', async (req, res) => {
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
app.get('/api/market/products', async (req, res) => {
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

// 启动服务器
app.listen(PORT, () => {
  console.log(`Market service running on port ${PORT}`);
});

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('正在关闭服务器...');
  await pool.end();
  process.exit(0);
});