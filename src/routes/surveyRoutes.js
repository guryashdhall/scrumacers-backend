var router = require('express').Router();
const surveyFunctions = require('../services/surveyFunctions');
const authentication = require("../utils/authentication") // Middleware - Authenticator

router.post('/add-survey',authentication.isAuthenticated, surveyFunctions.createSurvey);
router.post('/fill-survey',authentication.isAuthenticated, surveyFunctions.fillSurveyForm);
router.get('/fetch-survey-employee',authentication.isAuthenticated, surveyFunctions.fetchSurveyEmployee);
router.post('/fetch-survey-manager',authentication.isAuthenticated, surveyFunctions.fetchSurveyManager);
router.get('/fetch-survey-list-manager',authentication.isAuthenticated, surveyFunctions.fetchSurveyListManager);

module.exports = router;