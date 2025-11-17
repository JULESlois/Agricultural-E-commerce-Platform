const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const contentController = require('../controllers/contentController');

// 3.1 发布社区内容
router.post('/content', authMiddleware, contentController.createContent);

// 3.2 获取内容列表
router.get('/content', contentController.getContentList);

// 3.3 获取内容详情
router.get('/content/:content_id', contentController.getContentDetail);

// 3.4 发布评论
router.post('/content/:content_id/comments', authMiddleware, contentController.createComment);

// 3.5 点赞/取消点赞内容
router.post('/content/:content_id/like', authMiddleware, contentController.likeContent);
router.delete('/content/:content_id/like', authMiddleware, contentController.unlikeContent);

// 3.6 收藏/取消收藏内容
router.post('/content/:content_id/collect', authMiddleware, contentController.collectContent);
router.delete('/content/:content_id/collect', authMiddleware, contentController.uncollectContent);

module.exports = router;
