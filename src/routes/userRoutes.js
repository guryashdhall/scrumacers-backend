var router = require('express').Router();
const userFunctions = require('../services/userFunctions');
const authentication = require("../utils/authentication") // Middleware - Authenticator

router.post("/login", userFunctions.login);
router.put("/logout", authentication.isAuthenticated, userFunctions.logout);

router.post("/create-employee", authentication.isAuthenticated, userFunctions.create_employee);
router.get("/fetch_all_employees", authentication.isAuthenticated, userFunctions.fetch_all_employees);
router.put("/delete_employee", authentication.isAuthenticated, userFunctions.delete_employee);

router.get("/profile", authentication.isAuthenticated, userFunctions.profile);

router.put('/forget-password', userFunctions.forgetPassword);
router.put('/change-password', authentication.isAuthenticated, userFunctions.changePassword);

router.get('/fetch-employee-hours', authentication.isAuthenticated, userFunctions.fetchEmployeeHours);

module.exports = router;