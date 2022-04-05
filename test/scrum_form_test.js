const validate_standup_form=require("../src/validation/validate_scrum_form");
var assert = require('assert');
require('dotenv').config()
const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();

chai.use(chaiHttp);

describe("Testing of Scrum form fucntionality", () => {
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
    it("Testing for standup form submission - sql failure", (done) => {
      data.q1='"abcadeda'
      chai.request(app).post('/api/user/dailyStandUpForm').set('Authorization',`Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
      .send(data).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("message").eqls("Some error occured");
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
    it("Testing for fetch standup form for manager", (done) => {
      chai.request(app).get('/api/user/fetchStandupFormManager').set('Authorization',`Bearer ${process.env.MANAGER_TEST_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eqls("Form fetched Successfully");
        done();
      })
    }) 
    it("Testing for authorization in fetch standup form for manager", (done) => {
      chai.request(app).get('/api/user/fetchStandupFormManager')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property("message").eqls("Access Denied! Unauthorized User");
        done();
      })
    }) 
    it("Testing for invalid token in fetch standup form for manager", (done) => {
      chai.request(app).get('/api/user/fetchStandupFormManager').set("Authorization","Bearer acacanksvdkvskvs")
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property("message").eqls("Invalid Token...");
        done();
      })
    }) 
  })