const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const followController = require('../controllers/followController');

// 1.1 关注用户
router.post('/follows', authMiddleware, followController.followUser);

// 1.2 取消关注用户
router.delete('/follows/:followed_id', authMiddleware, followController.unfollowUser);

// 1.3 获取用户关注列表
router.get('/users/:user_id/following', followController.getFollowing);

// 1.4 获取用户粉丝列表
router.get('/users/:user_id/followers', followController.getFollowers);

// 1.5 拉黑用户
router.post('/blacklist', authMiddleware, followController.blacklistUser);

// 1.6 移除黑名单
router.delete('/blacklist/:blacked_user_id', authMiddleware, followController.removeBlacklist);

module.exports = router;
