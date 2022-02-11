"use strict";

var _userFunctions = require("./user.functions.js");

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-undef */
var router = _express.default.Router();

router.post("/signup", _userFunctions.signup);
router.post("/login", _userFunctions.login);
module.exports = router;