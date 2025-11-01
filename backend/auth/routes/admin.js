const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// 应用JWT验证中间件 和 管理员权限检查中间件
router.use(authMiddleware.verifyToken);
router.use(authMiddleware.isAdmin);

// 1.5. (管理员)获取用户列表
// GET /api/admin/users 
router.get('/users', adminController.getUserList);

// 1.6. (管理员)更新用户状态/认证
// PATCH /api/admin/users/:id/status 
// (注意：API文档中 Endpoint 缺少 :id 占位符，这里已补全)
router.patch('/users/:id/status', adminController.updateUserStatus);

module.exports = router;