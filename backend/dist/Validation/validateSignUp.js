"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateSignUp = void 0;

const validateSignUp = data => {
  var isValid = false;
  var validationError = "";
  isValid = true;
  return {
    validationError,
    isValid
  };
};

exports.validateSignUp = validateSignUp;