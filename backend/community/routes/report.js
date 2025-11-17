const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const reportController = require('../controllers/reportController');

// 4.1 举报
router.post('/reports', authMiddleware, reportController.createReport);

// 4.2 (管理员)获取举报列表
router.get('/reports', authMiddleware, adminMiddleware, reportController.getReports);

// 4.3 (管理员)处理举报
router.post('/reports/:report_id/handle', authMiddleware, adminMiddleware, reportController.handleReport);

module.exports = router;
