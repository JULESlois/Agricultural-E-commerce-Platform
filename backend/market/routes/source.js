const express = require('express');
const router = express.Router();
const SourceController = require('../controllers/SourceController');
const authMiddleware = require('../middleware/authMiddleware');

// 公开路由
router.get('/sources', SourceController.getSourceList);
router.get('/sources/:source_id', SourceController.getSourceDetail);
router.get('/demands', SourceController.getDemandList);

// 需要认证的路由
router.post('/farmer/sources', authMiddleware.verifyToken, SourceController.createSource);
router.post('/buyer/demands', authMiddleware.verifyToken, SourceController.createDemand);
router.patch('/admin/sources/:source_id/audit', authMiddleware.verifyToken, SourceController.auditSource);

module.exports = router;