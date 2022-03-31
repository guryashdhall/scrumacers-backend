const validate_announcement = require("../src/validation/validateAnnouncement");
var assert = require('assert');
const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();

chai.use(chaiHttp);

describe("Testing of Announcement Module fucntionality", () => {
    before(function (done) {
        if (app.isDbConnected) {
            process.nextTick(done)
        } else {
            app.on('ready', () => done());
        }
    });

    beforeEach(() => {
        data = {
            title: "I Introduce You, Team Scrum Acers",
            description: "Team Scrum Acers will build a platform to increase productivity"
        }
    })
    it("Testing for empty title", () => {
        data.title = ""
        assert.throws(function () { validate_announcement.validateAnnouncement(data) }, /^Error: Announcement Title can't be empty$/);
    })
    it("Testing for empty description", () => {
        data.description = ""
        assert.throws(function () { validate_announcement.validateAnnouncement(data) }, /^Error: Annnouncement Description can't be empty$/);
    })
    it("Testing for announcement fetch", (done) => {
        chai.request(app).get('/api/user/fetch-announcements').set('Authorization', `Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eqls("announcements fetched");
                done();
            })
    })
    it("Testing for insert announcement", (done) => {
        chai.request(app).post('/api/user/post-announcement').set('Authorization', `Bearer ${process.env.MANAGER_TEST_TOKEN}`)
            .send(data).end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eqls("announcement added");
                done();
            })
    })
    it("Testing for delete announcement", (done) => {
        chai.request(app).put('/api/user/delete-announcement').set('Authorization', `Bearer ${process.env.MANAGER_TEST_TOKEN}`)
            .send({post_id: 0}).end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property("message").eqls("Couldn't delete announcement. Try again!");
                done();
            })
    })
})