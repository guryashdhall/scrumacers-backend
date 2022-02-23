const mysql = require("promise-mysql");

function createDBConnection(db_data) {
  return mysql.createConnection(db_data).then((conn)=>{
     console.log("Connected to database succesfully");
     global.connection=conn;
    //  return conn;
  }).catch((err)=>{
      let error=new Error("Error connecting to database");
      error.status=400;
      throw error;
  })
}


module.exports = { createDBConnection };
