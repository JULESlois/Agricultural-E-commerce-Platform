const express = require('express');
const cors = require('cors');
require('dotenv').config();

const knowledgeRoutes = require('./routes/knowledge.routes');
const expertRoutes = require('./routes/expert.routes');

const app = express();

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 请求日志
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// 路由注册
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api', expertRoutes);

// 健康检查
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: '知识库与专家咨询服务'
    });
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
    console.log(`========================================`);
    console.log(`知识库与专家咨询服务已启动`);
    console.log(`服务器运行在端口: ${PORT}`);
    console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
    console.log(`时间: ${new Date().toLocaleString('zh-CN')}`);
    console.log(`========================================`);
});