const express = require('express');
const router = express.Router();
const BuyerController = require('../controllers/BuyerController');
const authMiddleware = require('../middleware/authMiddleware');

// 应用JWT验证中间件
router.use(authMiddleware.verifyToken);

// 3.1 创建/更新买家扩展信息
router.put('/me', BuyerController.updateMe);

// 获取买家扩展信息
router.get('/:userId', BuyerController.getBuyerInfo);

module.exports = router;