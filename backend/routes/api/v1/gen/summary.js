const express = require('express');
const router = express.Router();
const placeController = require('../../../../controllers/summaryController');

router.post("/getSummary", placeController.getSummary);

module.exports = router;