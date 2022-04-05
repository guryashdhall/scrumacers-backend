require('dotenv').config()
const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();

chai.use(chaiHttp);

describe("Testing of Employee Hours Module", () => {
    it("Testing for get api to fetch employee hours", (done) => {
        chai.request(app).get('/api/user/fetch-employee-hours').set('Authorization', `Bearer ${process.env.MANAGER_TEST_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })
})