const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// 2.1 获取帖子类别树
router.get('/categories/tree', categoryController.getCategoryTree);

// 2.2 搜索标签
router.get('/tags', categoryController.searchTags);

module.exports = router;
