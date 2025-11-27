const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/AddressController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyToken);

router.post('/', AddressController.create);
router.get('/', AddressController.getList);
router.put('/:address_id', AddressController.update);
router.delete('/:address_id', AddressController.delete);
router.patch('/:address_id/default', AddressController.setDefault);

module.exports = router;