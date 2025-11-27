const express = require('express');
const router = express.Router();
const FarmerController = require('../controllers/FarmerController');
const authMiddleware = require('../middleware/authMiddleware');

// 公开路由（不需要登录）
router.get('/:farmer_id/info', FarmerController.getFarmerInfo);
router.get('/:farmer_id/products', FarmerController.getFarmerProducts);
router.get('/:farmer_id/stats', FarmerController.getFarmerStats);

// 需要登录的路由
router.use(authMiddleware.verifyToken);
router.put('/me', FarmerController.updateMe);
router.get('/:user_id', FarmerController.getFarmerInfo);

module.exports = router;