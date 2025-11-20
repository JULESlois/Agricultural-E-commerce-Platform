const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const reportController = require('../controllers/reportController');
const { validate, createReportSchema, handleReportSchema } = require('../utils/validation');

// 4.1 举报
router.post('/reports', 
  authMiddleware, 
  validate(createReportSchema), 
  reportController.createReport
);

// 4.2 (管理员)获取举报列表
router.get('/reports', 
  authMiddleware, 
  reportController.getReports
);

// 4.3 (管理员)处理举报
router.post('/reports/:report_id/handle', 
  authMiddleware, 
  validate(handleReportSchema), 
  reportController.handleReport
);

module.exports = router;
