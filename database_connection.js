const mysql=require('mysql')

const db_credentials={
    host: "db-5308.cs.dal.ca",
    user: "CSCI5308_7_DEVINT_USER",
    password: "thu8oLahcoo3xaok",
    database: "CSCI5308_7_DEVINT",
    port: "3306",
}

const conn = mysql.createConnection(db_credentials);

conn.connect((err)=>{
    if(err){
        console.log(err)
    }
    console.log("Connected to database succesfully")
    return conn;
})

module.exports=conn