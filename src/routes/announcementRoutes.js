var router = require('express').Router();
const announcementFunctions = require('../services/announcementFunctions');
const authentication = require("../utils/authentication") // Middleware - Authenticator

router.get('/fetch-announcements', authentication.isAuthenticated, announcementFunctions.fetchAnnouncements);
router.post('/post-announcement', authentication.isAuthenticated, announcementFunctions.postAnnouncement);
router.put('/delete-announcement', authentication.isAuthenticated, announcementFunctions.deleteAnnouncement);

module.exports = router;