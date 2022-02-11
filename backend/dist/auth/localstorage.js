"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localStorage = void 0;

var _nodeLocalstorage = require("node-localstorage");

const localStorage = new _nodeLocalstorage.LocalStorage('./scratch');
exports.localStorage = localStorage;