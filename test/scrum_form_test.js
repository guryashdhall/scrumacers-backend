const validate_standup_form=require("../src/validation/validate_scrum_form");
var assert = require('assert');
require('dotenv').config()
const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();

chai.use(chaiHttp);

describe("Testing of Scrum form fucntionality", () => {
  before(function (done) {
    if (app.isDbConnected) { 
      process.nextTick(done)
    } else {
      app.on('ready', () => done());
    }
  })
    beforeEach(() => {
      data = {
       q1 : "I completed all the api's for dev",
       q2 : "I will look into the design paramters",
       q3 : "Waiting for frontend team to integrate my api's",
       blocker : 2
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
    it("Testing for standup form submission", (done) => {
      chai.request(app).post('/api/user/dailyStandUpForm').set('Authorization',`Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
      .send(data).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eqls("Form Submitted Successfully");
        done();
      })
    })
    it("Testing for fetch standup form", (done) => {
      chai.request(app).get('/api/user/fetchStandUpForm').set('Authorization',`Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eqls("Form fetched Successfully");
        done();
      })
    })
  })