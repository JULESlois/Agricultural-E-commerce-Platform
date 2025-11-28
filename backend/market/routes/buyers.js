const express = require('express');
const router = express.Router();
const BuyerController = require('../controllers/BuyerController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyToken);

router.put('/me', BuyerController.updateMe);
router.get('/:user_id', BuyerController.getBuyerInfo);

module.exports = router;