const express = require('express');
const router = express.Router();
const {
    applyExpert, getExperts, createDemand,
    acceptDemand, sendMessage, completeConsult,
    payConsult,
    evaluateConsult
} = require('../controllers/consultController');
const auth = require('../middleware/auth');

router.post('/experts/apply', auth('user'), applyExpert);
router.get('/experts', getExperts);
router.post('/consult/demands', auth('user'), createDemand);
router.post('/experts/consult/demands/:demand_id/accept', auth('expert'), acceptDemand);
router.post('/consult/records/:record_id/messages', auth('any'), sendMessage);
router.post('/experts/consult/records/:record_id/complete', auth('expert'), completeConsult);
router.post('/consult/records/:record_id/pay', auth('user'), payConsult);
router.post('/consult/records/:record_id/evaluate', auth('user'), evaluateConsult);
module.exports = router;