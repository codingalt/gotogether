const express = require('express');
const Authenticate = require('../Authenticate/authenticate');
const { postRequest, approvePassengerRequest, getPassengerRequests, declineRequest } = require('../Controllers/PassengerRequest');
const router = express.Router();

router.post('/passenger/request', Authenticate,postRequest);
router.get("/passenger/request/:campaignId", Authenticate, getPassengerRequests);
router.post("/request/approve", Authenticate, approvePassengerRequest);
router.put("/request/decline/:requestId", Authenticate, declineRequest);

module.exports = router;