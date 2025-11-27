const express = require('express');
const router = express.Router();
const ActivityController = require('../controllers/ActivityController');
const authMiddleware = require('../middleware/authMiddleware');

// 公开路由
router.get('/activities', ActivityController.getActivityList);

// 管理员路由
router.post('/admin/activities', authMiddleware.verifyToken, ActivityController.createActivity);
router.get('/admin/activities/:activity_id', authMiddleware.verifyToken, ActivityController.getActivityDetail);

module.exports = router;