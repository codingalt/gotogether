const express = require('express');
const Authenticate = require('../Authenticate/authenticate');
const { postRequest } = require('../Controllers/PassengerRequest');
const router = express.Router();

router.post('/passenger/request', Authenticate,postRequest);

module.exports = router;