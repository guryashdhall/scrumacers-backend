require('dotenv').config()
const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();

chai.use(chaiHttp);

describe("Testing of Badge Module", () => {

  beforeEach(() => {
    data = {
      emp_id: 7,
      badge_id: [1, 2]
    }
  })
  it("Testing for insert/update badge without badge", (done) => {
    data.badge_id = []
    chai.request(app).put('/api/user/update-employee-badges').set('Authorization', `Bearer ${process.env.MANAGER_TEST_TOKEN}`)
      .send(data).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eqls("Badges updated");
        done();
      })
  })
  it("Testing for insert/update badge", (done) => {
    chai.request(app).put('/api/user/update-employee-badges').set('Authorization', `Bearer ${process.env.MANAGER_TEST_TOKEN}`)
      .send(data).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eqls("Badges updated");
        done();
      })
  })
  it("Testing for insert/update badge", (done) => {
    data.badge_id= ["abc","def"]
    chai.request(app).put('/api/user/update-employee-badges').set('Authorization', `Bearer ${process.env.MANAGER_TEST_TOKEN}`)
      .send(data).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("message").eqls("Insert employee badges SQL Failure");
        done();
      })
  })
  it("Testing for get api for employee badge", (done) => {
    chai.request(app).get('/api/user/fetch-badge-for-employee').set('Authorization', `Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      })
  })
  it("Testing for get api to fetch badges of employee for manager", (done) => {
    chai.request(app).get('/api/user/fetch-employee-badges').set('Authorization', `Bearer ${process.env.MANAGER_TEST_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      })
  })
})