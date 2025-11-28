const express = require('express');
const router = express.Router();
const FarmerController = require('../controllers/farmerController');

// 公开路由（不需要登录）
router.get('/farmers/:farmer_id', FarmerController.getFarmerInfo);
router.get('/farmers/:farmer_id/products', FarmerController.getFarmerProducts);
router.get('/farmers/:farmer_id/stats', FarmerController.getFarmerStats);

module.exports = router;
