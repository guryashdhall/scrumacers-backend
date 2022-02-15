const express = require('express');
const mysql = require('mysql');
const app = express();
const util = require("util");

const userroutes = require("./src/user/user.routes");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "assignment1",
  port: "3306",
});

global.connection = connection;

var query = util.promisify(connection.query).bind(connection);;

module.exports = { query }

connection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }
  console.log("Connected to the MySQL server.");
});

app.use("/api/user", userroutes);

app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});