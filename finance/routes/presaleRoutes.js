const express = require('express');
const router = express.Router();
const presaleController = require('../controllers/presaleController');
const { auth } = require('../middleware/auth');

// 4.1 创建预售计划（需农户鉴权）
router.post('/farmer/presale/plans', auth('farmer'), presaleController.createPresalePlan);

// 4.2 获取我的预售计划列表（需农户鉴权）
router.get('/farmer/presale/plans', auth('farmer'), presaleController.getMyPresalePlans);

// 4.3 获取预售计划详情（公开接口）
router.get('/presale/plans/:plan_id', presaleController.getPresalePlanDetail);

module.exports = router;