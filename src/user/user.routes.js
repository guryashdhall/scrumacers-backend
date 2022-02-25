const express = require('express');
var router = express.Router();
const functions = require('./user.functions');
const authentication = require("../auth/authentication") // To use function authentication.isAuthenticated

router.post("/signup", functions.create_employee);
router.post("/login", functions.login);
router.get("/profile", authentication.isAuthenticated, functions.profile);
router.get("/leavesInformation/:id", functions.leavesGet);
router.post("/dailyStandUpForm",authentication.isAuthenticated,functions.dailystandupform);
router.get("/fetchStandupForm",authentication.isAuthenticated,functions.fetchStandupForm);

module.exports = router;