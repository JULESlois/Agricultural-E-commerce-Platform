const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// 导入各模块路由 - 修复financeRoutes的导入方式
const financeRoutes = require('./finance/index');
const communityRoutes = require('./community/index'); // 其他模块路由（需自行实现）
const marketRoutes = require('./market/index');

// 加载环境变量
dotenv.config();
const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

// 全局中间件
app.use(cors()); // 允许跨域
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析表单请求体

// 挂载各模块路由
app.use('/api', financeRoutes); // 融资服务路由（/api/...）
app.use('/api/community', communityRoutes); // 社区模块路由
app.use('/api/market', marketRoutes); // 市场模块路由

// 404 处理
app.use((req, res) => {
  res.status(404).json({ code: 404, message: '请求的接口不存在' });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('全局错误：', err);
  res.status(500).json({ code: 500, message: '服务器内部错误：' + err.message });
});

// 启动服务 (only if this file is run directly, not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`农业电商后端服务已启动，端口：${PORT}`);
  });
}

// Export the app for testing
module.exports = app;