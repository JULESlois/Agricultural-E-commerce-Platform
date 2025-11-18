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

// 通用接口（用户或专家）
expertRouter.post('/consult/records/:record_id/messages', auth.authenticateUser, expertController.sendConsultMessage);

module.exports = expertRouter;