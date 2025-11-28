const express = require('express');
const router = express.Router();
const FollowController = require('../controllers/FollowController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyToken);

router.post('/my/follows', FollowController.followSeller);
router.delete('/my/follows/:seller_id', FollowController.unfollowSeller);
router.get('/my/follows', FollowController.getFollowedSellers);

module.exports = router;