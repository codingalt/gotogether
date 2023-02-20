const express = require('express');
const { postCampaign, getCampaignsByDriverId, getAllCampaigns } = require('../Controllers/DriverCampaign');
const router = express.Router();

router.post('/driver/campaign', postCampaign)
router.get('/driver/campaign/:driverId', getCampaignsByDriverId)
router.get('/campaigns', getAllCampaigns)

module.exports = router;