const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const qaController = require('../controllers/qaController');
const { validate, adoptBestAnswerSchema } = require('../utils/validation');

// 5.2 采纳最佳答案
router.post('/questions/:content_id/best-answer', 
  authMiddleware, 
  validate(adoptBestAnswerSchema), 
  qaController.adoptBestAnswer
);

// 5.3 取消最佳答案
router.delete('/questions/:content_id/best-answer', 
  authMiddleware, 
  qaController.cancelBestAnswer
);

module.exports = router;
