const express = require('express');
const Authenticate = require('../Authenticate/authenticate');
const { registerDriver, updateDriver, getDriverData } = require('../Controllers/DriverController');
const router = express.Router();

router.post('/driver/register', registerDriver);
router.put('/driver/:userId', updateDriver)
router.get('/driver/:userId', Authenticate,getDriverData);

module.exports = router;