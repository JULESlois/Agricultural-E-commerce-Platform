const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/StatsController');

router.get('/stats/price-trends', StatsController.getPriceTrends);

module.exports = router;