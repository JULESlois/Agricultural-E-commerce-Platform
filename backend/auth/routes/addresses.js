const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/AddressController');
const authMiddleware = require('../middleware/authMiddleware');

// 应用JWT验证中间件
router.use(authMiddleware.verifyToken);

// 4.1 新增收货地址
router.post('/', AddressController.create);

// 4.2 获取用户地址列表
router.get('/', AddressController.getList);

// 4.3 修改收货地址
router.put('/:addressId', AddressController.update);

// 4.4 删除收货地址
router.delete('/:addressId', AddressController.delete);

// 4.5 设置默认收货地址
router.patch('/:addressId/default', AddressController.setDefault);

module.exports = router;