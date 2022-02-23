const express = require('express');
// const db_connect = require('./database_connection');
var cors = require("cors");
var app = express();
app.use(express.json());
app.use(cors());
const util = require("util");
const {createDBConnection} = require("./database_connection")

const userroutes = require("./src/user/user.routes");

// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "assignment1",
//   port: "3306",
// });
// var db_credentials = {
//   host: "db-5308.cs.dal.ca",
//   user: "CSCI5308_7_DEVINT_USER",
//   password: "thu8oLahcoo3xao",
//   database: "CSCI5308_7_DEVINT",
//   port: "3306",
// }
// function connect(db_credentials) {
//   // try {
//     console.log("Hi");
//     new Promise(db_connect.dbConnection(db_credentials)).then((data) => {
//       console.log("cccc");
//       global.connection = data
//     }).catch((err) => {
//       console.log("does it work fine")
//     });

  //   console.log("bbb");
  // }
  // catch (e) {
  //   console.log("parvish");
  //   console.log(e)
  // }
// }

// connect(db_credentials);

let db_credentials={
  host: "db-5308.cs.dal.ca",
  user: "CSCI5308_7_DEVINT_USER",
  password: "thu8oLahcoo3xaok",
  database: "CSCI5308_7_DEVINT",
  port: "3306"
}

global.connection=createDBConnection(db_credentials)

//export const query = util.promisify(connection.query).bind(connection);

// module.exports = { query }

// connection.connect(function (err) {
//   if (err) {
//     return console.error("error: " + err.message);
//   }
//   console.log("Connected to the MySQL server.");
// });

app.use("/api/user", userroutes);

app.get('/', function (req, res) {
  res.send('Hello World!');
});
const port = process.env.PORT || 4000;
app.listen(port, function () {
  console.log('Scrum Acers Backend app listening on port ' + port);
});

module.exports = app;