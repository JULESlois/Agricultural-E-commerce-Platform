const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const authMiddleware = require('../middleware/authMiddleware');

// 公开路由
router.get('/categories/tree', CategoryController.getCategoryTree);

// 管理员路由
router.post('/admin/categories', authMiddleware.verifyToken, CategoryController.createCategory);

module.exports = router;