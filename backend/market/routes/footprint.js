const express = require('express');
const router = express.Router();
const FootprintController = require('../controllers/FootprintController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyToken);

router.get('/my/footprints', FootprintController.getFootprints);
router.delete('/my/footprints', FootprintController.deleteFootprints);

module.exports = router;