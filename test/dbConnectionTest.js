var assert = require("assert");
var {createDBConnection} = require("../database_connection");

describe("Testing of DB", () => {
  beforeEach(() => {
    data = {
      host: "db-5308.cs.dal.ca",
      user: "CSCI5308_7_TEST",
      password: "thu8oLahcoo3xaok",
      database: "CSCI5308_7_TEST",
      port: "3306",
    };
  });
  it("Testing for wrong db credentials", () => {
    data.password = "444";
    return createDBConnection(data).catch((err)=>{
        assert.throws(function() { throw err }, Error("Error connecting to database"));
    })
  });
});
