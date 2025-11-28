const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyToken);

router.post('/orders', OrderController.createOrder);
router.get('/orders', OrderController.getOrderList);
router.get('/orders/:order_id', OrderController.getOrderDetail);
router.post('/orders/:order_id/pay', OrderController.payOrder);
router.post('/farmer/orders/:order_id/ship', OrderController.shipOrder);
router.post('/buyer/orders/:order_id/confirm-receipt', OrderController.confirmReceipt);
router.post('/orders/:order_id/invoice/apply', OrderController.applyInvoice);
router.patch('/admin/invoices/:invoice_id', OrderController.updateInvoiceStatus);

module.exports = router;