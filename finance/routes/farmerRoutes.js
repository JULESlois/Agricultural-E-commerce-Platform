const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const { auth } = require('../middleware/auth');

// 1.1 获取贷款产品列表（公开接口，无需鉴权）
router.get('/loan-types', farmerController.getLoanTypes);

// 1.2 获取贷款产品详情（公开接口）
router.get('/loan-types/:loan_type_id', farmerController.getLoanTypeDetail);

// 1.3 创建融资申请（需农户鉴权）
router.post('/farmer/financing/applications', auth('farmer'), farmerController.createApplication);

// 1.4 获取我的融资申请列表（需农户鉴权）
router.get('/farmer/financing/applications', auth('farmer'), farmerController.getMyApplications);

// 1.5 获取我的融资申请详情（需农户鉴权）
router.get('/farmer/financing/applications/:application_id', auth('farmer'), farmerController.getMyApplicationDetail);

module.exports = router;