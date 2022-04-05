var assert = require('assert');
require('dotenv').config()
const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();

chai.use(chaiHttp);

describe("Testing of notification fucntionality", () => {
    it("Testing for fetch notification for user", (done) => {
      chai.request(app).get('/api/user/fetch-notifications').set('Authorization',`Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eqls("Notifications fetched");
        done();
      })
    })
  })