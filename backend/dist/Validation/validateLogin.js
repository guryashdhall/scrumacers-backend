"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateLogin = void 0;

const validateLogin = data => {
  var isValid = false;
  var validationError = "";
  isValid = true;
  return {
    validationError,
    isValid
  };
};

exports.validateLogin = validateLogin;