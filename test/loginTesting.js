const validate_login=require("../src/validation/validateLogin");
var assert = require('assert');

describe("Testing of user data", () => {
    beforeEach(() => {
      data = {
        email: "jackryan@gmail.com",
        password: "jackryan3"
      }
    })
    it("Testing for empty email by user", () => {
      data.email = ""
      assert.throws(function() { validate_login.validateLogin(data) }, /^Error: Email is empty$/);
      // expect(function () { validate_login.validateLogin(data) }).toThrow(new Error("Email is invalid"));
    })
    it("Testing for invalid email by user", () => {
      data.email = "dvgmail.com"
      assert.throws(function() { validate_login.validateLogin(data) }, /^Error: Email is invalid$/);
    })
    it("Testing in case user keeps password empty", () => {
      data.password = ""
      assert.throws(function() { validate_login.validateLogin(data) }, /^Error: Password is empty$/);
    })
    it("Testing for required password length", () => {
      data.password = "abc"
      assert.throws(function() { validate_login.validateLogin(data) }, /^Error: Password length should be atleast 4$/);
    })
  })