const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// 应用JWT验证中间件
router.use(authMiddleware.verifyToken);

// 获取当前用户信息
router.get('/me', userController.getMe);

// 更新当前用户信息
router.put('/me', userController.updateMe);

module.exports = router;