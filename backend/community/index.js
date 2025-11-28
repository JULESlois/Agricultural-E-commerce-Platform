/**
 * 社区模块主入口 - 重构版本
 * 使用 Sequelize ORM 和统一的架构
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 导入 Sequelize 配置和模型（关联关系已在 models/index.js 中设置）
const { sequelize } = require('./models');

// 导入路由
const followRoutes = require('./routes/follow');
const categoryRoutes = require('./routes/category');
const contentRoutes = require('./routes/content');
const reportRoutes = require('./routes/report');
const qaRoutes = require('./routes/qa');

// 导入中间件
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3003;  // 默认端口 3003

// 中间件
const corsOptions = {
  origin: true,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 健康检查
app.get('/', (req, res) => {
  res.json({ 
    message: 'Community Service API',
    status: 'running',
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL with Sequelize ORM'
  });
});

// 数据库健康检查
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 挂载路由
app.use('/api/community', followRoutes);
app.use('/api/community', categoryRoutes);
app.use('/api/community', contentRoutes);
app.use('/api/community', reportRoutes);
app.use('/api/community', qaRoutes);
app.use('/api/admin/community', reportRoutes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '请求的接口不存在'
  });
});

// 统一错误处理中间件（必须放在最后）
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  console.log(`✅ Community service running on port ${PORT}`);
  console.log(`📊 Using Sequelize ORM with PostgreSQL`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
