// const validate_survey = require("../src/validation/validateSurvey");
var assert = require('assert');
require('dotenv').config()
const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();

describe("Testing of Leave Management Module", () => {
    it("Testing to fetch team leader information in leavesget api", (done) => {
        chai.request(app).get('/api/user/leavesInformation').set('Authorization', `Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eqls("Data fetched");
                done();
            })
    })
    it("Testing to fetch information of leave requests raised by employee", (done) => {
        chai.request(app).get('/api/user/leavesRaised').set('Authorization', `Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eqls("Data fetched");
                done();
            })
    })
    it("Testing to fetch information of leave requests raised by employee for manager", (done) => {
        chai.request(app).get('/api/user/leavesRequestsReceived').set('Authorization', `Bearer ${process.env.MANAGER_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eqls("Data fetched");
                done();
            })
    })
    it("Testing to check whether leave request can be posted", (done) => {
        let data = {
            manager_id: 4,
            emp_id: 7,
            start_date: "2022-03-05",
            end_date: "2022-03-07",
            leaveDesc: "Sickness"
        }
        chai.request(app).post('/api/user/leaveRequest').set('Authorization', `Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
            .send(data).end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eqls("1 rows inserted");
                done();
            })
    })
    it("Testing to check leave request approval", (done) => {
        let data = {
            status: "Approved",
            leave_id: 0
        }
        chai.request(app).put('/api/user/leavesApproveReject').set('Authorization', `Bearer ${process.env.MANAGER_TEST_TOKEN}`)
            .send(data).end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property("message").eqls("Leave Id not found");
                done();
            })
    })
})