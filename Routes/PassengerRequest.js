const express = require('express');
const { postRequest } = require('../Controllers/PassengerRequest');
const router = express.Router();

router.post('/passenger/request', postRequest);

module.exports = router;