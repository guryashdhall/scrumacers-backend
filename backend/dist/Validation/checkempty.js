"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notEmpty = notEmpty;
exports.notUndefined = notUndefined;
exports.validateEmail = validateEmail;
exports.validateURL = validateURL;

var _ = _interopRequireWildcard(require("lodash"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Variable is not Empty
function notEmpty(val) {
  if (_.isNumber(val)) {
    //Number Validation
    if (val !== null && val !== undefined) {
      return true;
    } else {
      return false;
    }
  } else if (_.isString(val)) {
    //String Validation
    if (!_.isEmpty(val) && val !== null && val !== undefined) {
      return true;
    } else {
      return false;
    }
  } else if (_.isObject(val)) {
    //Object Validation
    if (!_.isEmpty(val) && val !== null && val !== undefined) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function notUndefined(val) {
  if (_.isNumber(val)) {
    //Number Validation
    if (val !== undefined) {
      return true;
    } else {
      return false;
    }
  } else if (_.isString(val)) {
    //String Validation
    if (val !== undefined) {
      return true;
    } else {
      return false;
    }
  } else if (_.isObject(val)) {
    //Object Validation
    if (val !== undefined) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
} // Validate Email Format.


function validateEmail(val) {
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(val);
} // Validate URL Format


function validateURL(val) {
  var urlPattern = /^(?:(?:https?):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  return urlPattern.test(val);
}