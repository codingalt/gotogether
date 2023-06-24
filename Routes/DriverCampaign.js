const express = require('express');
const Authenticate = require('../Authenticate/authenticate');
const { postCampaign, getCampaignsByDriverId, getAllCampaigns, updateCampaignStatus, getCampaignsById, searchCampaigns } = require('../Controllers/DriverCampaign');
const router = express.Router();

router.post('/driver/campaign', Authenticate,postCampaign)
router.get('/driver/campaign/:driverId',Authenticate ,getCampaignsByDriverId)
router.get('/campaigns',Authenticate ,getAllCampaigns);
router.get('/campaign/:id',Authenticate ,getCampaignsById);
router.put('/campaign',Authenticate , updateCampaignStatus);
router.post("/campaigns/search", Authenticate, searchCampaigns);

module.exports = router;