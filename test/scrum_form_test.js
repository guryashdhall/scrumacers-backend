const validate_standup_form=require("../src/validation/validate_scrum_form");
var assert = require('assert');

describe("Testing of Scrum form fucntionality", () => {
    beforeEach(() => {
      data = {
       q1 : "I completed all the api's for dev",
       q2 : "I will look into the design paramters",
       q3 : "Waiting for frontend team to integrate my api's"
      }
    })
    it("Testing for empty q1", () => {
      data.q1 = ""
      assert.throws(function() { validate_standup_form.validate_scrum_form(data) }, /^Error: Question 1 cannot be empty$/);
    })
    it("Testing for empty q2", () => {
      data.q2 = ""
      assert.throws(function() { validate_standup_form.validate_scrum_form(data) }, /^Error: Question 2 cannot be empty$/);
    })
  })