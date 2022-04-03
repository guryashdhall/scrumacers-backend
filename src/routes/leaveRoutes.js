var router = require('express').Router();
const leaveFunctions = require('../services/leaveFunctions');
const authentication = require("../utils/authentication") // Middleware - Authenticator

router.get("/leavesInformation", authentication.isAuthenticated, leaveFunctions.leavesGet);
router.get("/leavesRaised", authentication.isAuthenticated, leaveFunctions.leavesRaised);
router.post("/leaveRequest", authentication.isAuthenticated, leaveFunctions.leavesRequest);
router.get("/leavesRequestsReceived", authentication.isAuthenticated, leaveFunctions.leavesRequestsReceived);
router.put("/leavesApproveReject", authentication.isAuthenticated, leaveFunctions.leavesApproveReject);

module.exports = router;