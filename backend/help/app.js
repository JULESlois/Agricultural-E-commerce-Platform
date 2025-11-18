const express = require('express');
const cors = require('cors');
require('dotenv').config();

const knowledgeRoutes = require('./routes/knowledge_route');
const expertRoutes = require('./routes/expert_route');
const customerServiceRoutes = require('./routes/customerService_route');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// 路由注册
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api', expertRoutes);
app.use('/api', customerServiceRoutes);

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        code: 404,
        message: '请求的资源不存在'
    });
});

// 全局错误处理
app.use((err, req, res, next) => {
    console.error('全局错误:', err);
    res.status(500).json({
        code: 500,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
    console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;