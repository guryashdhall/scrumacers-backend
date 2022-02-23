const request = require("supertest");
const app = require("../index");
const validate_login=require("../src/validation/validateLogin");
var assert = require('assert');

describe("GET /", () => {
  it("respond with Hello World", (done) => {
    request(app).get("/").expect("Hello World!", done);
  });
});