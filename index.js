const express = require('express');
var cors = require("cors");
const { createDBConnection } = require("./database_connection")
const userroutes = require("./src/user/user.routes");
require('dotenv').config();
var app = express();

app.use(express.json());

const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

// Setting up Database Credentials based on Environment
let db_credentials = {}

if (process.env.NODE_ENV === 'development') {
  db_credentials = {
    host: "db-5308.cs.dal.ca",
    user: process.env.DATABASE_DEV_USERNAME,
    password: process.env.DATABASE_DEV_PASSWORD,
    database: process.env.DATABASE_DEV_DATABASE,
    port: "3306"
  }
}

if (process.env.NODE_ENV === 'testing') {
  db_credentials = {
    host: "db-5308.cs.dal.ca",
    user: process.env.DATABASE_TEST_USERNAME,
    password: process.env.DATABASE_TEST_PASSWORD,
    database: process.env.DATABASE_TEST_DATABASE,
    port: "3306"
  }
}

// Routes
app.use("/api/user", userroutes);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

const port = process.env.PORT || 4000;

// Create DB connection before listening on a port
createDBConnection(db_credentials).then(()=>{
  app.emit('ready')
  app.listen(port, function () {
    console.log('Scrum Acers Backend app listening on port ' + port);
  });
})