const validate_login = require("../src/validation/validateLogin");
var assert = require('assert');
const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();

chai.use(chaiHttp);

describe("POST api/user/login", () => {
  before(function (done) {
    if (app.isDbConnected) { 
      process.nextTick(done)
    } else {
      app.on('ready', () => done());
    }
  })
  beforeEach(() => {
    data = {
      email: "jackryan@gmail.com",
      password: "jackryan3"
    }
  })

  it("Testing for empty email by user", () => {
    data.email = ""
    assert.throws(function () { validate_login.validateLogin(data) }, /^Error: Email is empty$/);
  })
  it("Testing for invalid email by user", () => {
    data.email = "dvgmail.com"
    assert.throws(function () { validate_login.validateLogin(data) }, /^Error: Email is invalid$/);
  })
  it("Testing in case user keeps password empty", () => {
    data.password = ""
    assert.throws(function () { validate_login.validateLogin(data) }, /^Error: Password is empty$/);
  })
  it("Testing for required password length", () => {
    data.password = "abc"
    assert.throws(function () { validate_login.validateLogin(data) }, /^Error: Password length should be atleast 8$/);
  })
  it("Testing for wrong user/employee", (done) => {
    data.email = "a@gmail.com";
    chai.request(app).post('/api/user/login').send(data).end((err, res) => {
      res.should.have.status(400);
      res.body.should.have.property("message").eqls("Employee not found");
      done();
    })
  })
  it("Testing for wrong password", (done) => {
    data.password = "jackryan2";
    chai.request(app).post('/api/user/login').send(data).end((err, res) => {
      res.should.have.status(400);
      res.body.should.have.property("message").eqls("Invalid password");
      done();
    })
  })
})