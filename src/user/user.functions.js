const validate_login = require('../validation/validateLogin');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// Code that could be  used in future.
const create_employee = async (req, res) => {
  try {
    console.log("Signup functionality!")
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);
    return res
      .status(200)
      .json({ data: { requestbody: req.body, password }, message: `signup functionality`, status: true });
  } catch (e) {
    console.log(`Error: `, e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};

// const login = async (req, res) => {
//   const { isValid, errorMessage } = validate_login.validateLogin(req.body);
//   if (!isValid) {
//     return res
//       .status(400)
//       .json({ message: "fail", status: false, error: errorMessage });
//   }
//   try {
//     console.log("Conn: ", connection)
//     console.log(typeof connection.query)
//     await connection.query('SELECT * FROM assignment1.book;', (err, data) => {
//       if (err) throw new Error(err);
//       return res.status(200).json({ 'auth': true, 'data': data });
//     });
//     // if (result) {
//     //   console.log("Result: ", result)
//     //   return res
//     //     .status(200)
//     //     .json({ data: result[0], message: `Login functionality`, status: true });

//     // }
//     // console.log(result)
//     // return res.status(400).json({ data: false, message: "Fail", status: false })
//   } catch (e) {
//     console.log(e);
//     return res
//       .status(400)
//       .json({ data: false, message: `fail`, status: false });
//   }
// };


// Login functionality
const login = async (req, res) => {
  try {
    validate_login.validateLogin(req.body);
    await connection.query(`select emp_id,email,password FROM employee where email='${req.body.email}';`, async (err, data) => {
      if (err) {
        return res.status(400).json({
          data: false,
          message: err,
          status: false
        })
      }
      if (data.length) {
        const passwordCompare = bcrypt.compareSync(req.body.password, data[0].password);
        if (passwordCompare) {
          let auth_token = "";
          auth_token = jwt.sign({ result: { emp_id: data[0].emp_id } }, "afgps7", {
            expiresIn: "10h",
          });
          await connection.query(`update employee set authentication_token='${auth_token}' where emp_id='${data[0].emp_id}';`, (err, data1) => {
            if (err) {
              let error = new Error("something went wrong");
              error.status = 400;
              throw error;
            };
            if (data1.affectedRows) {
              return res.status(200).json({
                data: true,
                message: "login successfully",
                token: auth_token,
                status: true,
                usertype: data[0].emp_type
              });
            }
            return res.status(400).json({
              data: false,
              message: "something went wrong",
              status: false,
            });
          });
        }
      }
    });
  } catch (e) {
    console.log(e);
    return res.json({ "error_status": e.status, "error_message": e.message })
  }
};

// Code which helped verify authentication
const profile = async (req, res) => {
  try {
    await connection.query(`select * from  employee where emp_id=${req.employee[0].emp_id}`, (err, data) => {
      if (err) {
        let error = new Error("Error fetching employee profile");
        error.status = 400;
        throw error;
      }
      if (data.length) {
        return res.status(200).json({
          data,
          message: "Data fetched",
          status: true
        })
      }
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ data: false, message: "fail", status: false })
  }
}

const leavesGet = async (req, res) => {
  try {
    await connection.query(`select emp_id as team_leader_emp_id, first_name,last_name,email from employee where emp_id=(select team_leader from employee a,team b where emp_id=${req.employee[0].emp_id} and a.team_id=b.team_id);`, (err, data) => {
      if (err) {
        let error = new Error("Error fetching employee's leader");
        error.status = 400;
        throw error;
      }
      else if (data.length) {
        return res.status(200).json({
          data,
          message: "Data fetched",
          status: true
        })
      }
      else {
        return res.status(400).json({
          data: false,
          message: 'No team leader information found',
          status: true
        })
      }
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ data: false, message: "Request Failed", status: false })
  }
}

const leavesRaised = async (req,res) => {
  try {
    await connection.query(`select * from leave_information where employee_id=${req.employee[0].emp_id}`, (err, data) => {
      if (err) {
        let error = new Error("Error fetching employee's leaves");
        error.status = 400;
        throw error;
      }
      else if (data.length) {
        return res.status(200).json({
          data,
          message: "Data fetched",
          status: true
        })
      }
      else {
        return res.status(400).json({
          data: false,
          message: 'No leave requests found',
          status: true
        })
      }
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ data: false, message: "Request Failed", status: false })
  }
}

const leavesRequestsReceived = async (req,res) => {
  try {
    await connection.query(`select * from leave_information where manager_id=${req.employee[0].emp_id}`, (err, data) => {
      if (err) {
        let error = new Error("Error fetching employees leave requests");
        error.status = 400;
        throw error;
      }
      else if (data.length) {
        return res.status(200).json({
          data,
          message: "Data fetched",
          status: true
        })
      }
      else {
        return res.status(400).json({
          data: false,
          message: 'No leave requests found',
          status: true
        })
      }
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ data: false, message: "Request Failed", status: false })
  }
}

const leavesApproveReject = async (req,res) => {
  try {
    await connection.query(`update leave_information set status='${req.body.status}' where leave_id='${req.body.leaveId}'`, (err, data) => {
      if (err) {
        let error = new Error(`Error updating leave id ${req.body.leaveId}`);
        error.status = 400;
        throw error;
      }
      else if (data.affectedRows) {
        return res.status(200).json({
          data,
          message: "Data Updated",
          status: true
        })
      }
      else {
        return res.status(400).json({
          data: false,
          message: 'Leave Id not found',
          status: true
        })
      }
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ data: false, message: "Request Failed", status: false })
  }
}

const leavesRequest = async (req, res) => {
  try {
    await connection.query(`insert into leave_information values(null,${req.body.emp_id},${req.body.manager_id},'${req.body.leaveDesc}','${req.body.start_date}','${req.body.end_date}');`, (err, data) => {
      if (err) {
        let error = new Error("Failed to raise leave request");
        error.status = 400;
        throw error;
      }
      else if (data.affectedRows) {
        return res.status(200).json({
          data,
          message: data.affectedRows+" rows inserted",
          status: true
        })
      }
      else {
        return res.status(400).json({
          data: false,
          message: 'Failed to raise leave request',
          status: true
        })
      }
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ data: false, message: "Request Failed", status: false })
  }
}

module.exports = { login, create_employee, profile, leavesGet, leavesRequest , leavesRaised, leavesRequestsReceived, leavesApproveReject}