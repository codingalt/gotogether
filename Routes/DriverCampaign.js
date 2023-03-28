const express = require('express');
const Authenticate = require('../Authenticate/authenticate');
const { postCampaign, getCampaignsByDriverId, getAllCampaigns } = require('../Controllers/DriverCampaign');
const router = express.Router();

router.post('/driver/campaign', Authenticate,postCampaign)
router.get('/driver/campaign/:driverId',Authenticate ,getCampaignsByDriverId)
router.get('/campaigns',Authenticate ,getAllCampaigns)

module.exports = router;