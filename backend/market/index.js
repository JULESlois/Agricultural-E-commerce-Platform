require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool, testConnection } = require('./database');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const farmerRoutes = require('./routes/farmers');
const buyerRoutes = require('./routes/buyers');
const addressRoutes = require('./routes/addresses');
const sourceRoutes = require('./routes/source');
const orderRoutes = require('./routes/order');
const couponRoutes = require('./routes/coupon');
const followRoutes = require('./routes/follow');
const footprintRoutes = require('./routes/footprint');
const aftersaleRoutes = require('./routes/aftersale');
const collectionRoutes = require('./routes/collection');
const statsRoutes = require('./routes/stats');
const categoryRoutes = require('./routes/category');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
const corsOptions = {
  origin: true,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', authRoutes); // 认证路由
app.use('/api', cartRoutes); // 购物车路由
app.use('/api', statsRoutes); // 统计路由（必须在buyers/farmers之前）
app.use('/api/farmers', farmerRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api', sourceRoutes);
app.use('/api', orderRoutes);
app.use('/api', couponRoutes);
app.use('/api', followRoutes);
app.use('/api', footprintRoutes);
app.use('/api', aftersaleRoutes);
app.use('/api', collectionRoutes);
app.use('/api', categoryRoutes);
app.use('/api', require('./routes/activity'));

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
    const isConnLimit = err?.code === '53300' || /remaining connection slots/.test(err?.message || '');
    console.error('查询产品数据失败:', err);
    // 降级为空列表，避免前端页面崩溃
    res.status(200).json({
      success: true,
      data: [],
      message: isConnLimit ? '服务繁忙，暂时返回空列表' : '暂时无数据'
    });
  }
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  const isConnLimit = err?.code === '53300' || /remaining connection slots/.test(err?.message || '');
  const status = isConnLimit ? 503 : 500;
  const message = isConnLimit ? '服务繁忙，请稍后重试' : '服务器内部错误';
  res.status(status).json({ code: status, message });
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
