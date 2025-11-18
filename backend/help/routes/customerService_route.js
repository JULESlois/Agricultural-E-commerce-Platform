const routerExpress = require('express');
const csRouter = routerExpress.Router();
const csController = require('../controllers/customer-service.controller');
const authMiddleware = require('../middleware/auth');

// 公开接口
csRouter.get('/cs-info', csController.getCSInfo);

// 管理员接口
csRouter.post('/admin/cs-agents', authMiddleware.authenticateAdmin, csController.createOfficialCS);

// 卖家接口
csRouter.post('/seller/cs-agents', authMiddleware.authenticateUser, csController.createSellerCS);

// 用户接口
csRouter.post('/chat/sessions', authMiddleware.authenticateUser, csController.createChatSession);
csRouter.post('/chat/sessions/:session_id/messages', authMiddleware.authenticateUser, csController.sendChatMessage);
csRouter.get('/chat/sessions/:session_id/messages', authMiddleware.authenticateUser, csController.getChatMessages);
csRouter.post('/work-orders', authMiddleware.authenticateUser, csController.createWorkOrder);
csRouter.get('/work-orders/:wo_id', authMiddleware.authenticateUser, csController.getWorkOrderDetail);
csRouter.post('/cs-evaluations', authMiddleware.authenticateUser, csController.submitCSEvaluation);

// 客服接口
csRouter.patch('/cs/work-orders/:wo_id', authMiddleware.authenticateCS, csController.handleWorkOrder);

module.exports = csRouter;