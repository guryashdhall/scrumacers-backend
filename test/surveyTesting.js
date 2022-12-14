const validate_survey = require("../src/validation/validateSurvey");
var assert = require('assert');
require('dotenv').config()
const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { title } = require("process");
let should = chai.should();

describe("Testing of Survey fucntionality", () => {
  beforeEach(() => {
    data = {
      q1: "The team was able to complete all the tasks within time",
      q2: "The team can reduce the number of meetings by notifying the dependencies using the tool",
      q3: "We will complete the backend of Scrum Acers in the next sprint",
      survey_title: "Scrum Acers Survey 101",
      survey_id: 4
    }
  })

  it("Testing for empty survey title", () => {
    data.survey_title = ""
    assert.throws(function () { validate_survey.validateSurvey(data) }, /^Error: Survey Title cannot be empty$/);
  })

  it("Testing for empty q1", () => {
    data.q1 = ""
    assert.throws(function () { validate_survey.validateSurvey(data) }, /^Error: Question 1 cannot be empty$/);
  })

  it("Testing for Survey Form submission by Manager", (done) => {
    chai.request(app).post('/api/user/add-survey').set('Authorization', `Bearer ${process.env.MANAGER_TEST_TOKEN}`)
      .send(data).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eqls("Survey added successfully");
        done();
      })
  })

  it("Testing for Survey Form submission by Manager - sql failure", (done) => {
    data.q1='"Survey Failure'
    chai.request(app).post('/api/user/add-survey').set('Authorization', `Bearer ${process.env.MANAGER_TEST_TOKEN}`)
      .send(data).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("message").eqls("Some error occured");
        done();
      })
  })

  it("Testing if survey form is filled or not?", (done) => {
    data = {
      answer_1: "The team was able to complete all the tasks within time",
      answer_2: "The team can reduce the number of meetings by notifying the dependencies using the tool",
      answer_3: "We will complete the backend of Scrum Acers in the next sprint",
      survey_id: 2
    }
    chai.request(app).post('/api/user/fill-survey').set('Authorization', `Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
      .send(data).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eqls("Survey was filled by the Employee");
        done();
      })
  })

  it("Testing fill survey form - sql failure", (done) => {
    data.answer_1 = '"The team was able to complete all the tasks within time'
    chai.request(app).post('/api/user/fill-survey').set('Authorization', `Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
      .send(data).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("message").eqls("Some error occured");
        done();
      })
  })

  it("Testing for fetch survey form-employee", (done) => {
    chai.request(app).get('/api/user/fetch-survey-employee').set('Authorization', `Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eqls("Survey Details fetched");
        done();
      })
  })

  it("Testing for fetch survey form-manager", (done) => {
    chai.request(app).post('/api/user/fetch-survey-manager').set('Authorization', `Bearer ${process.env.MANAGER_TEST_TOKEN}`)
      .send(data).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eqls("Survey Details fetched for employees");
        done();
      })
  })
  it("Testing for fetch survey form-manager - sql failure", (done) => {
    data.survey_id = '"a';
    chai.request(app).post('/api/user/fetch-survey-manager').set('Authorization', `Bearer ${process.env.MANAGER_TEST_TOKEN}`)
      .send(data).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("message").eqls("Something went wrong");
        done();
      })
  })
  it("Testing for fetch survey list for manager", (done) => {
    chai.request(app).get('/api/user/fetch-survey-list-manager').set('Authorization', `Bearer ${process.env.MANAGER_TEST_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eqls("Survey List fetched");
        done();
      })
  })
})