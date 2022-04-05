var router = require('express').Router();
const scrumFormFunctions = require('../services/scrumFormFunctions');
const authentication = require("../utils/authentication") // Middleware - Authenticator

router.post("/dailyStandUpForm", authentication.isAuthenticated, scrumFormFunctions.createStandUpForm);
router.get("/fetchStandupForm", authentication.isAuthenticated, scrumFormFunctions.fetchStandUpForm);
router.get("/fetchStandupFormManager", authentication.isAuthenticated, scrumFormFunctions.fetchStandUpFormManager);

module.exports = router;