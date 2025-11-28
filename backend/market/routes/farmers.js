const express = require('express');
const router = express.Router();
const FarmerController = require('../controllers/FarmerController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyToken);

router.put('/me', FarmerController.updateMe);
router.get('/:user_id', FarmerController.getFarmerInfo);

module.exports = router;