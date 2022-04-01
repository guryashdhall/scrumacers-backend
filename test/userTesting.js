var assert = require('assert');
require('dotenv').config()
const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();

describe("Testing of Profile Module", () => {
    it("Testing for fetch user profile", (done) => {
        chai.request(app).get('/api/user/profile').set('Authorization', `Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eqls("Data fetched");
                done();
            })
    })
})

describe("Testing of Signup Module", () => {
    it("Testing for signup api", (done) => {
        chai.request(app).post('/api/user/signup').send({password:'abcabc'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eqls("signup functionality");
                done();
            })
    })
})