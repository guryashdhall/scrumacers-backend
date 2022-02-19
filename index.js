const express = require('express');
const mysql = require('mysql');
var cors = require("cors");
var app = express();
app.use(express.json());
app.use(cors());
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
const port=process.env.PORT || 4000;
app.listen(port, function () {
  console.log('Scrum Acers Backend app listening on port '+port);
});

module.exports=app;