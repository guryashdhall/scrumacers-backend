const utilities = require("../src/utils/utilities");
var assert = require("assert");
const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();

chai.use(chaiHttp);

describe("Utilities Folder", () => {
  it("Assertion testing for throwError", () => {
    let message = "";
    let errorCode = "";
    assert.throws(function () {
      utilities.throwError(message, errorCode);
    }, /^Error: Something went wrong$/);
  });
  it("Assertion testing for throwError", () => {
    let message = "Fail";
    let errorCode = "";
    assert.throws(function () {
      utilities.throwError(message, errorCode);
    }, /^Error: Fail$/);
  });
});
