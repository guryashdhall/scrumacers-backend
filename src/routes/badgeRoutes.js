var router = require('express').Router();
const badgeFunctions = require('../services/badgeFunctions');
const authentication = require("../utils/authentication") // Middleware - Authenticator

router.get('/fetch-badge-for-employee', authentication.isAuthenticated, badgeFunctions.fetchBadgeForEmployee);
router.get('/fetch-employee-badges', authentication.isAuthenticated, badgeFunctions.fetchEmployeeBadges);
router.put('/update-employee-badges', authentication.isAuthenticated, badgeFunctions.updateEmployeeBadge);

module.exports = router;