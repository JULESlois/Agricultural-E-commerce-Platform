const express = require('express');
const router = express.Router();
const internalController = require('../controllers/internalController');

// 2.1 触发信用评估
router.post('/applications/:application_id/evaluate', internalController.triggerCreditEvaluate);

// 2.2 接收评估结果
router.post('/credit-evaluations', internalController.receiveEvaluationResult);

module.exports = router;