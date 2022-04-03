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
    
    describe("Testing of Create Employee function", () => {
        before(() => {
        data = {
            first_name:"Aman",
            last_name:"Ryan",
            email: "amanryan@gmail.com",
            password: "amanryan3",
            emp_type:5,
            team_id:2
          }
        })
        it("Testing for create employee api", (done) => {
                    chai.request(app).post('/api/user/create-employee').set('Authorization',`Bearer ${process.env.HR_TEST_TOKEN}`)
            .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eqls("Employee created successfully");
                    done();
                })
        })

        it("Testing for create employee by unauthorized user", (done) => {
            chai.request(app).post('/api/user/create-employee').set('Authorization',`Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
    .send(data)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eqls("You are not authorized to create employee!");
            done();
        })
    })

    it("Testing for create employee if fields are missing", (done) => {
        data={}
        chai.request(app).post('/api/user/create-employee').set('Authorization',`Bearer ${process.env.HR_TEST_TOKEN}`)
.send(data)
    .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("message").eqls("Invalid data");
        done();
    })
})

it("Testing of delete employees functionality", (done) => {
    data={
        emp_id: 11
        }
    chai.request(app).put('/api/user/delete_employee').set('Authorization',`Bearer ${process.env.HR_TEST_TOKEN}`)
.send(data)
.end((err, res) => {
    res.should.have.status(400);
    res.body.should.have.property("message").eqls("Employee doesn't exist!");
    done();
})

})

it("Testing for delete  employee by unauthorized user", (done) => {
    data={
        emp_id: 11
        }
    chai.request(app).put('/api/user/delete_employee').set('Authorization',`Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
.send(data)
.end((err, res) => {
    res.should.have.status(400);
    res.body.should.have.property("message").eqls("You are not authorized to delete employees");
    done();
})
})

})
})