"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signup = exports.login = void 0;

var _validateLogin = require("../Validation/validateLogin");

var _validateSignUp = require("../Validation/validateSignUp");

const signup = async (req, res) => {
  const {
    validationError,
    isValid
  } = (0, _validateSignUp.validateSignUp)(req.body);

  if (!isValid) {
    return res.status(200).json({
      message: "fail",
      status: false,
      error: validationError
    });
  }

  try {
    console.log("Signup functionality!");
  } catch (e) {
    console.log(`Error: `, e);
    return res.status(400).json({
      data: false,
      message: `fail`,
      status: false
    });
  }
};

exports.signup = signup;

const login = async (req, res) => {
  const {
    validationError,
    isValid
  } = (0, _validateLogin.validateLogin)(req.body);

  if (!isValid) {
    return res.status(400).json({
      message: "fail",
      status: false,
      error: validationError
    });
  }

  try {
    console.log("Login functionality");
    return res.status(200).json({
      data: true,
      message: `Login functionality`,
      status: true
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      data: false,
      message: `fail`,
      status: false
    });
  }
};

exports.login = login;