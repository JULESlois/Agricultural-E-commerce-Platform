// 导入必要的模块
const express = require('express');
const router = express.Router();
const farmerRoutes = require('./routes/farmerRoutes');
const internalRoutes = require('./routes/internalRoutes');
const bankRoutes = require('./routes/bankRoutes');
const presaleRoutes = require('./routes/presaleRoutes');

// 设置模型关联关系
const setupAssociations = require('./models/associations');
setupAssociations();

// 挂载子路由
router.use('/', farmerRoutes); // 农户相关路由（/api/...）
router.use('/internal/financing', internalRoutes); // 内部接口（/api/internal/financing/...）
router.use('/bank/financing', bankRoutes); // 银行接口（/api/bank/financing/...）
router.use('/', presaleRoutes); // 预售相关路由（/api/...）

module.exports = router;