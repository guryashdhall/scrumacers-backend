require('dotenv').config()
const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();

chai.use(chaiHttp);

describe("Testing of Badge Module", () => {
  before(function (done) {
    if (app.isDbConnected) { 
      process.nextTick(done)
    } else {
      app.on('ready', () => done());
    }
  });
  beforeEach(() => {
    data = {
      emp_id: 7,
      badge_id: [1, 2]
    }
  })


  it("Testing for insert/update badge", (done) => {

    chai.request(app).put('/api/user/update-employee-badges').set('Authorization', `Bearer ${process.env.MANAGER_TEST_TOKEN}`)
      .send(data).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eqls("Badges updated");
        done();
      })
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
})