const express = require('express');
const cors = require('cors');
require('dotenv').config();

const followRoutes = require('./routes/follow');
const categoryRoutes = require('./routes/category');
const contentRoutes = require('./routes/content');
const reportRoutes = require('./routes/report');
const qaRoutes = require('./routes/qa');

const app = express();
const PORT = process.env.PORT || 3003;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 路由
app.use('/api/community', followRoutes);
app.use('/api/community', categoryRoutes);
app.use('/api/community', contentRoutes);
app.use('/api/community', reportRoutes);
app.use('/api/community', qaRoutes);
app.use('/api/admin/community', reportRoutes);

// 健康检查
app.get('/', (req, res) => {
  res.json({ 
    message: 'Community Service API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    code: err.status || 500,
    message: err.message || '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Community service running on port ${PORT}`);
});

module.exports = app;
