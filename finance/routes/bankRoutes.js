const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');
const { auth } = require('../middleware/auth');

// 3.1 获取待审批的申请列表（API文档3.1）
// Endpoint: /api/bank/financing/applications?status=2，HTTP方法：GET
router.get('/applications', auth('bank'), bankController.getPendingApplications);

// 3.2 获取申请详情以供审批（API文档3.2）
// Endpoint: /api/bank/financing/applications/{application_id}，HTTP方法：GET
router.get('/applications/:application_id', auth('bank'), bankController.getApplicationDetail);

// 3.3 提交审批结论（API文档3.3）
// Endpoint: /api/bank/financing/applications/{application_id}/review，HTTP方法：POST
router.post('/applications/:application_id/review', auth('bank'), bankController.submitApprovalResult);

// 3.4 确认放款（API文档3.4）
// Endpoint: /api/bank/financing/applications/{application_id}/disburse，HTTP方法：POST
router.post('/applications/:application_id/disburse', auth('bank'), bankController.confirmDisburse);

module.exports = router;