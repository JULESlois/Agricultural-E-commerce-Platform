const express = require('express');
const router = express.Router();
const { register } = require('../controllers/authController');

// 用户注册
router.post('/register', register);

module.exports = router;