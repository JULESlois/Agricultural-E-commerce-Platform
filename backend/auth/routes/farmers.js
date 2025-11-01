const express = require('express');
const router = express.Router();
const FarmerController = require('../controllers/FarmerController');
const authMiddleware = require('../middleware/authMiddleware');

// 应用JWT验证中间件
router.use(authMiddleware.verifyToken);

// 2.1 创建/更新农户扩展信息
router.put('/me', FarmerController.updateMe);

// 2.2 获取农户扩展信息
router.get('/:userId', FarmerController.getFarmerInfo);

module.exports = router;