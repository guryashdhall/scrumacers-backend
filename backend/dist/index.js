"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = void 0;

var _express = _interopRequireDefault(require("express"));

var _mysql = _interopRequireDefault(require("mysql"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-undef */
// import * as api from './apifunctions.js'
const util = require("util");

var cors = require("cors");

var app = (0, _express.default)();
app.use(_express.default.json());
app.use(cors());

require("dotenv").config();

const userroutes = require("./User/user.routes");

var connection = _mysql.default.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "DbName",
  port: "3306"
});

global.connection = connection;
connection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});
const query = util.promisify(connection.query).bind(connection);
exports.query = query;
app.use("/api/user", userroutes);
app.listen(3400, err => {
  if (err) {
    return console.log("Error: " + err);
  }

  console.log(`Server is listening on port 3400`);
});