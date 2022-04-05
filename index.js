const express = require('express');
var cors = require("cors");
const { createDBConnection } = require("./database_connection");
const userRoutes = require("./src/routes/userRoutes");
const surveyRoutes = require("./src/routes/surveyRoutes");
const scrumFormRoutes = require("./src/routes/scrumFormRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const leaveRoutes = require("./src/routes/leaveRoutes");
const badgeRoutes = require("./src/routes/badgeRoutes");
const announcementRoutes = require("./src/routes/announcementRoutes");

require('dotenv').config();
var app = express();

app.use(express.json());

const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Setting up Database Credentials based on Environment
let db_credentials = {}

if (process.env.NODE_ENV === 'production') {
  db_credentials = {
    host: "db-5308.cs.dal.ca",
    user: process.env.DATABASE_PRODUCTION_USERNAME,
    password: process.env.DATABASE_PRODUCTION_PASSWORD,
    database: process.env.DATABASE_PRODUCTION_DATABASE,
    port: "3306",
    multipleStatements: true
  }
}

if (process.env.NODE_ENV === 'development') {
  db_credentials = {
    host: "db-5308.cs.dal.ca",
    user: process.env.DATABASE_DEV_USERNAME,
    password: process.env.DATABASE_DEV_PASSWORD,
    database: process.env.DATABASE_DEV_DATABASE,
    port: "3306",
    multipleStatements: true
  }
}

if (process.env.NODE_ENV === 'testing') {
  db_credentials = {
    host: "db-5308.cs.dal.ca",
    user: process.env.DATABASE_TEST_USERNAME,
    password: process.env.DATABASE_TEST_PASSWORD,
    database: process.env.DATABASE_TEST_DATABASE,
    port: "3306",
    multipleStatements: true
  }
}

// Routes
app.use("/api/user", userRoutes);
app.use("/api/user", surveyRoutes);
app.use("/api/user", scrumFormRoutes);
app.use("/api/user", notificationRoutes);
app.use("/api/user", leaveRoutes);
app.use("/api/user", badgeRoutes);
app.use("/api/user", announcementRoutes);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

const port = process.env.PORT || 4000;

// Create DB connection before listening on a port
createDBConnection(db_credentials).then(() => {
  app.emit('ready')
  app.isDbConnected = true
  app.listen(port, function () {
    console.log('Scrum Acers Backend app listening on port ' + port);
  });
}).catch((err) => {
  console.log("Error occured while creating DB connection " + err.message)
})

module.exports = app;