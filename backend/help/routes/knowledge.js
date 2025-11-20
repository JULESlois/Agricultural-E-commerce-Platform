const express = require('express');
const router = express.Router();
const {
    getKnowledgeTypeTree,
    createArticle,
    getArticleList,
    getArticleDetail,
    toggleCollect
} = require('../controllers/knowledgeController');
const auth = require('../middleware/auth');

// 1.1
router.get('/types/tree', getKnowledgeTypeTree);

// 1.2 需要专家身份
router.post('/experts/knowledge/articles', auth('expert'), createArticle);

// 1.3
router.get('/articles', getArticleList);

// 1.4
router.get('/articles/:article_id', getArticleDetail);

// 1.5 收藏用 POST，取消用 DELETE（这里统一用 POST 按文档）
router.post('/my/knowledge/collections', auth('user'), toggleCollect);
router.delete('/my/knowledge/collections', auth('user'), toggleCollect);

module.exports = router;