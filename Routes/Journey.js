const express = require('express');
const { startJourney } = require('../Controllers/Journey');
const router = express.Router();

router.post('/journey', startJourney)

module.exports = router;