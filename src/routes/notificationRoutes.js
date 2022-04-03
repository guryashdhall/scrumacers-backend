var router = require('express').Router();
const notificationFunctions = require('../services/notificationFunctions');
const authentication = require("../utils/authentication") // Middleware - Authenticator

router.get('/fetch-notifications',authentication.isAuthenticated, notificationFunctions.fetchNotifications);

module.exports = router;