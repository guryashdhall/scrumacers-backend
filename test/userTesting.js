var assert = require("assert");
require("dotenv").config();
const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();

describe("Testing of Profile Module", () => {
  it("Testing for fetch user profile", (done) => {
    chai
      .request(app)
      .get("/api/user/profile")
      .set("Authorization", `Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eqls("Data fetched");
        done();
      });
  });
});

describe("Testing of Signup Module", () => {
  describe("Testing of Create Employee function", () => {
    before(() => {
      data = {
        first_name: "Aman",
        last_name: "Ryan",
        email: "amanryan@gmail.com",
        password: "amanryan3",
        emp_type: 5,
        team_id: 2,
      };
    });
    it("Testing for create employee api", (done) => {
      chai
        .request(app)
        .post("/api/user/create-employee")
        .set("Authorization", `Bearer ${process.env.HR_TEST_TOKEN}`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property("message")
            .eqls("Employee created successfully");
          done();
        });
    });

    it("Testing for create employee api", (done) => {
      data.first_name='"Aman'
      chai
        .request(app)
        .post("/api/user/create-employee")
        .set("Authorization", `Bearer ${process.env.HR_TEST_TOKEN}`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property("message")
            .eqls("Create employee SQL Failure");
          done();
        });
    });

    it("Testing for create employee by unauthorized user", (done) => {
      chai
        .request(app)
        .post("/api/user/create-employee")
        .set("Authorization", `Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property("message")
            .eqls("You are not authorized to create employee!");
          done();
        });
    });

    it("Testing for create employee if fields are missing", (done) => {
      data = {};
      chai
        .request(app)
        .post("/api/user/create-employee")
        .set("Authorization", `Bearer ${process.env.HR_TEST_TOKEN}`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("message").eqls("Invalid data");
          done();
        });
    });

    it("Testing of delete employees functionality", (done) => {
      data = {
        emp_id: 11,
      };
      chai
        .request(app)
        .put("/api/user/delete_employee")
        .set("Authorization", `Bearer ${process.env.HR_TEST_TOKEN}`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property("message")
            .eqls("Employee doesn't exist!");
          done();
        });
    });

    it("Testing of delete employees functionality - sql failure", (done) => {
      data = {
        emp_id: '"1',
      };
      chai
        .request(app)
        .put("/api/user/delete_employee")
        .set("Authorization", `Bearer ${process.env.HR_TEST_TOKEN}`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property("message")
            .eqls("Delete employee SQL Failure");
          done();
        });
    });

    it("Testing for delete  employee by unauthorized user", (done) => {
      data = {
        emp_id: 11,
      };
      chai
        .request(app)
        .put("/api/user/delete_employee")
        .set("Authorization", `Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property("message")
            .eqls("You are not authorized to delete employees");
          done();
        });
    });

    it("Testing for fetch all employees functionality", (done) => {
      chai
        .request(app)
        .get("/api/user/fetch_all_employees")
        .set("Authorization", `Bearer ${process.env.HR_TEST_TOKEN}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property("message")
            .eqls("Employees fetched successfully");
          done();
        });
    });

    it("Testing for fetching employee info by unauthorized user", (done) => {
      data = {
        emp_id: 11,
      };
      chai
        .request(app)
        .get("/api/user/fetch_all_employees")
        .set("Authorization", `Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property("message")
            .eqls("You are not authorized to access employee records");
          done();
        });
    });
  });
});

describe("testing for Password Updating APIs", () => {
  it("Testing for forget password - Invalid email", (done) => {
    data = {
      email: "emmabrygmail.com",
    };
    chai
      .request(app)
      .put("/api/user/forget-password")
      .send(data)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("message").eqls("Invalid email");
        done();
      });
  });

  it("Testing for forget password - Wrong email", (done) => {
    data = {
      email: "sukarang9@gmail.com",
    };
    chai
      .request(app)
      .put("/api/user/forget-password")
      .send(data)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("message").eqls("User does not exist");
        done();
      });
  });

  it("Testing for forget password - Correct Data", (done) => {
    data = {
      email: "elonmusk@gmail.com",
    };
    chai
      .request(app)
      .put("/api/user/forget-password")
      .send(data)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eqls("Temporary password has been sent to your email");
        done();
      });
  });

  it("Testing for change password", (done) => {
    data = {
      old_password: "emmabryan5",
      new_password: "emmabryan5",
    };
    chai
      .request(app)
      .put("/api/user/change-password")
      .set("Authorization", `Bearer ${process.env.EMPLOYEE_TEST_TOKEN}`)
      .send(data)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message").eqls("Password updated");
        done();
      });
  });
});
