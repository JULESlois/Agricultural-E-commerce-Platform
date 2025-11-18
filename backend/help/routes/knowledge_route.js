const express = require('express');
const router = express.Router();
const knowledgeController = require('../controllers/knowledge.controller');
const { authenticateUser, authenticateExpert } = require('../middleware/auth');

// 公开接口
router.get('/types/tree', knowledgeController.getKnowledgeTypesTree);
router.get('/articles', knowledgeController.getArticleList);
router.get('/articles/:article_id', knowledgeController.getArticleDetail);

// 需要认证的接口
router.post('/my/knowledge/collections', authenticateUser, knowledgeController.collectArticle);
router.delete('/my/knowledge/collections', authenticateUser, knowledgeController.uncollectArticle);

// 专家接口
router.post('/experts/knowledge/articles', authenticateExpert, knowledgeController.createArticle);

module.exports = router;