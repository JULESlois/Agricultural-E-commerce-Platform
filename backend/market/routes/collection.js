const express = require('express');
const router = express.Router();
const CollectionController = require('../controllers/CollectionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyToken);

router.post('/my/collections', CollectionController.addCollection);
router.delete('/my/collections/:collection_id', CollectionController.removeCollection);
router.get('/my/collections', CollectionController.getCollections);

module.exports = router;