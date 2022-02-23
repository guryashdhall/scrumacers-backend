const express = require('express');
var router = express.Router();
const functions = require('./user.functions');
const authentication = require("../auth/authentication") // To use function authentication.isAuthenticated

router.post("/signup", functions.signup);
router.post("/login", functions.login);

module.exports = router;