const express = require('express');
var router = express.Router();
const functions = require('./user.functions');
const authentication = require("../auth/authentication") // To use function authentication.isAuthenticated

router.post("/signup", functions.create_employee);
router.post("/login", functions.login);
router.get("/profile", authentication.isAuthenticated, functions.profile);
router.post("/dailyStandUpForm", authentication.isAuthenticated, functions.dailystandupform);
router.get("/fetchStandupForm", authentication.isAuthenticated, functions.fetchStandupForm);
router.get("/leavesInformation", authentication.isAuthenticated, functions.leavesGet);
router.get("/leavesRaised", authentication.isAuthenticated, functions.leavesRaised);
router.post("/leaveRequest", authentication.isAuthenticated, functions.leavesRequest);
router.get("/leavesRequestsReceived", authentication.isAuthenticated, functions.leavesRequestsReceived);
router.put("/leavesApproveReject", authentication.isAuthenticated, functions.leavesApproveReject);
router.get("/fetchStandupFormManager", authentication.isAuthenticated, functions.fetchStandupFormManager);

module.exports = router;