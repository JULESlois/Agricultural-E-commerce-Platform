const express = require('express');
const router = express.Router();
const knowledgeController = require('../controllers/knowledge.controller');
const { authenticateUser, authenticateExpert } = require('../middleware/auth');

// 公开接口
router.get('/types/tree', knowledgeController.getKnowledgeTypesTree);
router.get('/articles', knowledgeController.getArticleList);
router.get('/articles/:article_id', knowledgeController.getArticleDetail);

// 需要用户认证的接口
router.post('/my/knowledge/collections', authenticateUser, knowledgeController.collectArticle);
router.delete('/my/knowledge/collections', authenticateUser, knowledgeController.uncollectArticle);

// 需要专家认证的接口
router.post('/experts/knowledge/articles', authenticateExpert, knowledgeController.createArticle);

module.exports = router;

// ============================================
// 7. routes/expert.routes.js
// ============================================
const expressRouter = require('express');
const expertRouter = expressRouter.Router();
const expertController = require('../controllers/expert.controller');
const auth = require('../middleware/auth');

// 用户接口
expertRouter.post('/experts/apply', auth.authenticateUser, expertController.applyExpert);
expertRouter.get('/experts', expertController.getExpertList);
expertRouter.post('/consult/demands', auth.authenticateUser, expertController.createConsultDemand);
expertRouter.post('/consult/records/:record_id/pay', auth.authenticateUser, expertController.payConsult);
expertRouter.post('/consult/records/:record_id/evaluate', auth.authenticateUser, expertController.evaluateConsult);

// 专家接口
expertRouter.post('/experts/consult/demands/:demand_id/accept', auth.authenticateExpert, expertController.acceptDemand);
expertRouter.post('/experts/consult/records/:record_id/complete', auth.authenticateExpert, expertController.completeConsult);

// 通用接口
expertRouter.post('/consult/records/:record_id/messages', auth.authenticateUser, expertController.sendConsultMessage);

module.exports = expertRouter;