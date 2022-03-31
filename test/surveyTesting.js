const validate_survey = require("../src/validation/validateSurvey");
var assert = require('assert');


describe("Testing of Survey fucntionality", () => {
    beforeEach(() => {
      data = {
       q1 : "The team was able to complete all the tasks within time",
       q2 : "The team can reduce the number of meetings by notifying the dependencies using the tool",
       q3 : "We will complete the backend of Scrum Acers in the next sprint"
      }
    })
    it("Testing for empty q1", () => {
      data.q1 = ""
      assert.throws(function() { validate_survey.validateSurvey(data) }, /^Error: Question 1 cannot be empty$/);
    })
  })