const validate_announcement = require("../src/validation/validateAnnouncement");
var assert = require('assert');


describe("Testing of Announcement Module fucntionality", () => {
    beforeEach(() => {
        data = {
            title: "I Introduce You, Team Scrum Acers",
            description: "Team Scrum Acers will build a platform to increase productivity"
        }
    })
    it("Testing for empty title", () => {
        data.title = ""
        assert.throws(function () { validate_announcement.validateAnnouncement(data) }, /^Error: Title cannot be empty$/);
    })
    it("Testing for empty description", () => {
        data.description = ""
        assert.throws(function () {  validate_announcement.validateAnnouncement(data) }, /^Error: Description cannot be empty$/);
    })
})