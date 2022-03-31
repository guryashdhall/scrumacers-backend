const mysql = require("promise-mysql");

function createDBConnection(db_data) {
  return mysql.createConnection(db_data).then((conn)=>{
     console.log("Connected to database succesfully");
     global.connection=conn;    
  }).catch((err)=>{      
      throw err;
  })
}


module.exports = { createDBConnection };
