const express = require('express');
const router = express.Router();
const AftersaleController = require('../controllers/AftersaleController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyToken);

router.post('/orders/:order_id/aftersale/apply', AftersaleController.applyAftersale);
router.post('/admin/aftersale/:aftersale_id/review', AftersaleController.reviewAftersale);

module.exports = router;