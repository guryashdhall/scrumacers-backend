const validate_login = require('../validation/validateLogin');
const validate_standup_form = require('../validation/validate_scrum_form');
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

//Function to create daily stand up form
const dailystandupform = async (req, res) => {
  let e = new Error()
  try {
    validate_standup_form.validate_scrum_form(req.body);
    await connection.query(`INSERT INTO  CSCI5308_7_DEVINT.scrum_form (team_id, employee_id, ques_1, ques_2, ques_3)
  values(${req.employee[0].team_id},${req.employee[0].emp_id}, "${req.body.q1}","${req.body.q2}",
  "${req.body.q3}");`, (err, data) => {
      if (err) {
        e.message = "something went wrong";
        e.status = 400;
        throw e;
      } else if (data.affectedRows) {
        console.log(data);
        return res.status(200).json({ data: true, message: "Form Submitted Successfully", status: true })
      }
      else {
        return res.status(400).json({ data: false, message: "Form not inserted", status: true })
      }
    })


  } catch (e) {
    console.log(`Error: `, e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });

  }
}

// To fetch the details of stand up form filled by an employee
const fetchStandupForm = async (req, res) => {
  let e = new Error()
  try {
    await connection.query(`SELECT * FROM  CSCI5308_7_DEVINT.scrum_form WHERE employee_id = ${req.employee[0].emp_id} 
  and DATE(creation_timestamp) = CURDATE();`, (err, data) => {
      if (err) {
        e.message = "something went wrong";
        e.status = 400;
        throw e;
      } else if (data.length) {
        console.log(data);
        return res.status(200).json({ data, message: "Form fetched Successfully", status: true })
      }
      else {
        return res.status(400).json({ data: false, message: "Form not found for today", status: true })
      }
    })


  } catch (e) {
    console.log(`Error: `, e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });

  }
}

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
    await connection.query(`select * FROM employee where email='${req.body.email}';`, async (err, data) => {
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
              return res.status(400).json({
                data: false,
                message: err,
                status: false
              })
            };
            if (data1.affectedRows) {
              return res.status(200).json({
                data,
                message: "login successfully",
                token: auth_token,
                status: true,
                usertype: data[0].emp_type
              });
            }
            return res.status(400).json({
              data: false,
              message: "Data not updated in DB",
              status: true,
            });
          });
        }
        return res.status(400).json({
          data: false,
          message: "Invalid password",
          status: false
        })
      }
      return res.status(400).json({ message: "Employee not found", status: false, data: false });
    });
  } catch (e) {
    console.log(e);
    // return res.json({ "error_status": e.status, "error_message": e.message })
    return res.status(400).json({ data: false, message: 'fail', status: false });
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

const leavesRaised = async (req, res) => {
  try {
    await connection.query(`select l.*,e.first_name as manager_first_name,e.last_name as manager_last_name
    from leave_information as l
    left join employee  as e
    on l.manager_id =e.emp_id where l.employee_id=${req.employee[0].emp_id} order by leave_apply_date desc`, (err, data) => {
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

const leavesRequestsReceived = async (req, res) => {
  try {
    await connection.query(`select l.leave_id, l.employee_id, e.first_name as employee_first_name, e.last_name as employee_last_name, l.leave_desc, l.manager_id, l.leave_start_date,
    l.leave_end_date, l.status, l.leave_apply_date, t.team_name
    from leave_information as l left join employee as e on l.employee_id=e.emp_id
    left join team as t on e.team_id=t.team_id where l.manager_id=${req.employee[0].emp_id} order by leave_apply_date desc`, (err, data) => {
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
          message: 'No leave approval requests found',
          status: true
        })
      }
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ data: false, message: "Request Failed", status: false })
  }
}

const leavesApproveReject = async (req, res) => {
  try {
    await connection.query(`update leave_information set status='${req.body.status}' where leave_id='${req.body.leaveId}'`, async (err, data) => {
      if (err) {
        let error = new Error(`Error updating leave id ${req.body.leaveId}`);
        error.status = 400;
        throw error;
      }
      else if (data.affectedRows) {
        req.body.leave_start_date = req.body.leave_start_date.replaceAll("-", "/")
        req.body.leave_end_date = req.body.leave_end_date.replaceAll("-", "/")
        let date = new Date(req.body.leave_start_date)
        let date2 = new Date(req.body.leave_end_date)
        let days = (date2.getTime() - date.getTime()) / (1000 * 3600 * 24)
        if (req.body.status === 'approved') {
          await connection.query(`update employee set num_of_leaves=num_of_leaves-${days} where emp_id='${req.body.employee_id}';`, (err2, data2) => {
            if (err2) {
              console.log(err2)
              let error = new Error("Failed to deduct employee's leaves");
              error.status = 400;
              throw error;
            }
            else if (data2.affectedRows) {
              return res.status(200).json({
                data2,
                message: "Data Updated",
                status: true
              })
            }
            else {
              return res.status(400).json({
                data: false,
                message: 'Failed to find employee',
                status: true
              })
            }
          })
        }
        else {
          if (data.affectedRows) {
            return res.status(200).json({
              data,
              message: "Data Updated",
              status: true
            })
          }
          else {
            return res.status(400).json({
              data: false,
              message: 'Failed to find leave id',
              status: true
            })
          }
        }
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
    await connection.query(`insert into leave_information values(null,${req.body.emp_id},${req.body.manager_id},'${req.body.leaveDesc}','${req.body.start_date}','${req.body.end_date}',DEFAULT,DEFAULT);`, (err, data) => {
      if (err) {
        let error = new Error("Failed to raise leave request");
        error.status = 400;
        throw error;
      }
      else if (data.affectedRows) {
        return res.status(200).json({
          data,
          message: data.affectedRows + " rows inserted",
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

// To fetch the details of stand up form filled by an employee for Manager
const fetchStandupFormManager = async (req, res) => {
  let e = new Error()
  try {
    await connection.query(`SELECT * FROM  CSCI5308_7_DEVINT.scrum_form WHERE team_id = ${req.employee[0].team_id} 
  and DATE(creation_timestamp) = CURDATE();`, (err, data) => {
      if (err) {
        e.message = "something went wrong";
        e.status = 400;
        throw e;
      } else if (data.length) {
        return res.status(200).json({ data, message: "Form fetched Successfully", status: true })
      }
      else {
        return res.status(400).json({ data: false, message: "Form not found for today", status: true })
      }
    })
  } catch (e) {
    console.log(`Error: `, e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });

  }
}

module.exports = { login, create_employee, profile, leavesGet, leavesRequest, leavesRaised, leavesRequestsReceived, leavesApproveReject, dailystandupform, fetchStandupForm, fetchStandupFormManager }
