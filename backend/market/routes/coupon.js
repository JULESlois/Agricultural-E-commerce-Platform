const express = require('express');
const router = express.Router();
const CouponController = require('../controllers/CouponController');
const authMiddleware = require('../middleware/authMiddleware');

// 公开路由
router.get('/coupons/claimable', CouponController.getAvailableCoupons);

// 需要认证的路由
router.post('/my-coupons/claim', authMiddleware.verifyToken, CouponController.claimCoupon);
router.get('/my-coupons', authMiddleware.verifyToken, CouponController.getMyCoupons);

// 管理员路由
router.post('/admin/coupon-rules', authMiddleware.verifyToken, CouponController.createCouponRule);
router.get('/admin/coupon-logs', authMiddleware.verifyToken, CouponController.getCouponLogs);

module.exports = router;