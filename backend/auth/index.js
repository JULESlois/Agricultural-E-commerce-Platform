const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const certRoutes = require('./routes/cert');

const app = express();
const PORT = process.env.PORT || 3002;

// 调试中间件 - 检查原始请求
app.use((req, res, next) => {
  console.log('=== 请求信息 ===');
  console.log(`${req.method} ${req.url}`);
  console.log('Content-Type:', req.get('Content-Type'));
  console.log('Content-Length:', req.get('Content-Length'));
  console.log('Headers:', req.headers);
  
  let rawBody = '';
  req.on('data', chunk => {
    rawBody += chunk.toString();
  });
  
  req.on('end', () => {
    console.log('Raw body:', rawBody);
    req.rawBody = rawBody;
  });
  
  next();
});

// Express JSON 解析中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 调试中间件 - 检查解析结果
app.use((req, res, next) => {
  console.log('解析后的body:', req.body);
  console.log('Body 类型:', typeof req.body);
  console.log('Body keys:', Object.keys(req.body));
  console.log('==================');
  next();
});

// 路由 - 按照特定性从高到低排序
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', certRoutes);

// 基础路由
app.get('/', (req, res) => {
  res.json({ 
    message: 'Auth Service API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// 测试路由
app.post('/test', (req, res) => {
  console.log('测试路由收到请求体:', req.body);
  res.json({ 
    message: '测试成功',
    receivedBody: req.body
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

module.exports = app;