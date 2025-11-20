// New: backend/help/routes/cs.js

const express = require('express');
const router = express.Router();
const {
    createOfficialCs, createSellerCs, getCsInfo,
    createChatSession, sendChatMessage, getChatMessages,
    createWorkOrder, handleWorkOrder, getWorkOrderDetail,
    submitCsEvaluation
} = require('../controllers/csController');
const auth = require('../middleware/auth');

// 客服基础
router.post('/admin/cs-agents', auth('admin'), createOfficialCs);
router.post('/seller/cs-agents', auth('seller'), createSellerCs);
router.get('/cs-info', getCsInfo); // 无 auth，按文档任何用户

// 聊天
router.post('/chat/sessions', auth('user'), createChatSession);
router.post('/chat/sessions/:session_id/messages', auth('any'), sendChatMessage);
router.get('/chat/sessions/:session_id/messages', auth('any'), getChatMessages);

// 工单
router.post('/work-orders', auth('user'), createWorkOrder);
router.patch('/cs/work-orders/:wo_id', auth('cs'), handleWorkOrder);
router.get('/work-orders/:wo_id', auth('any'), getWorkOrderDetail);

// 评价
router.post('/cs-evaluations', auth('user'), submitCsEvaluation);

module.exports = router;