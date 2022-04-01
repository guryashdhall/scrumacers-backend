const validate_login = require('../validation/validateLogin');
const validate_standup_form = require('../validation/validate_scrum_form');
const validate_announcement = require('../validation/validateAnnouncement');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const validate_survey = require('../validation/validateSurvey');
const validate_email = require('../validation/general')
const util = require('../auth/util');
// Code that could be  used in future.
const create_employee = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);
    return res
      .status(200)
      .json({ data: { requestbody: req.body, password }, message: `signup functionality`, status: true });
  } catch (e) {
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
    await connection.query(`INSERT INTO scrum_form (team_id, employee_id, ques_1, ques_2, ques_3,blocker)
  values (${req.employee[0].team_id},${req.employee[0].emp_id}, "${req.body.q1}","${req.body.q2}",
  "${req.body.q3}",${req.body.blocker});`, async (err, data) => {
      if (err) {
        e.message = "something went wrong";
        e.status = 400;
        throw e;
      } else if (data.affectedRows) {
        const receiver = await connection.query(`select emp_id from employee 
        where team_id=${req.employee[0].team_id} and emp_id!=${req.employee[0].emp_id};`);

        // Inserting notifications if there are blockers for any one of the team member
        if (req.body.blocker > 0 && receiver.length) {
          let insertnotification = `insert into notification (notification_description, notification_sender, notification_receiver)
          values ("${req.employee[0].first_name} ${req.employee[0].last_name} has faced ${req.body.blocker} blockage", ${req.employee[0].emp_id},${receiver[0].emp_id})`
          for (i = 1; i < receiver.length; i++) {
            insertnotification += `,("${req.employee[0].first_name} ${req.employee[0].last_name} has faced ${req.body.blocker} blockage", ${req.employee[0].emp_id},${receiver[i].emp_id})`
          }
          insertnotification += `;`
          await connection.query(insertnotification, (err, result) => {
            if (err) {
              e.message = "something went wrong";
              e.status = 400;
              throw e;
            } else {
              return res.status(200).json({ data: true, message: "Form Submitted Successfully", status: true })
            }
          })
        } else {
          return res.status(200).json({ data: true, message: "Form Submitted Successfully", status: true })
        }
      }
      else {
        return res.status(400).json({ data: false, message: "Form not inserted", status: true })
      }
    })
  } catch (e) {
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
}

// To fetch the details of stand up form filled by an employee
const fetchStandupForm = async (req, res) => {
  let e = new Error()
  try {
    await connection.query(`SELECT * FROM scrum_form WHERE employee_id = ${req.employee[0].emp_id} 
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
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });

  }
}

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
    return res.status(400).json({ data: false, message: 'fail', status: false });
  }
};

// Code which helped verify authentication
const profile = async (req, res) => {
  try {
    await connection.query(`select e.*, et.type_name, t.team_name, t.team_description, t.team_leader, b.* from employee as e left join team as t
    on e.team_id=t.team_id 
    left join employee_type as et
    on e.emp_type=et.id
    left join employee_badge as eb
    on e.emp_id=eb.employee_id
    left join badge as b
    on eb.badge_id=b.id
    where e.emp_id=${req.employee[0].emp_id}`, (err, data) => {
      if (err) {
        let error = new Error("Error fetching employee profile");
        error.status = 400;
        throw error;
      }
      if (data.length) {
        var result = [];
        data.forEach(obj => {
          if (result[0]) {
            var exist_or_not = 0;
            var index;
            result.forEach((element, i) => {
              if (element.emp_id == obj.emp_id) {
                exist_or_not = 1;
                index = i
              }
            })
            if (exist_or_not == 0) {
              if (obj.id != null) {
                result.push({
                  "emp_id": obj.emp_id,
                  "first_name": obj.first_name,
                  "last_name": obj.last_name,
                  "email": obj.email,
                  "password": obj.password,
                  "team_id": obj.team_id,
                  "team_name": obj.team_name,
                  "team_description": obj.team_description,
                  "team_leader": obj.team_leader,
                  "number_of_leaves_left": obj.num_of_leaves,
                  "emp_type": obj.emp_type,
                  "emp_position": obj.type_name,
                  "badge_earned": [{
                    "badge_id": obj.id,
                    "badge_name": obj.name,
                    "badge_description": obj.description,
                    "received_at": obj.receieved_at
                  }]
                })
              } else {
                result.push({
                  "emp_id": obj.emp_id,
                  "first_name": obj.first_name,
                  "last_name": obj.last_name,
                  "email": obj.email,
                  "password": obj.password,
                  "team_id": obj.team_id,
                  "team_name": obj.team_name,
                  "team_description": obj.team_description,
                  "team_leader": obj.team_leader,
                  "number_of_leaves_left": obj.num_of_leaves,
                  "emp_type": obj.emp_type,
                  "emp_position": obj.type_name,
                  "badge_earned": [],
                })
              }
            } else {
              if (obj.id != null) {
                result[index]["badge_earned"].push({
                  "badge_id": obj.id,
                  "badge_name": obj.name,
                  "badge_description": obj.description,
                  "received_at": obj.receieved_at
                })
              }
            }
          } else {
            if (obj.id != null) {
              result.push({
                "emp_id": obj.emp_id,
                "first_name": obj.first_name,
                "last_name": obj.last_name,
                "email": obj.email,
                "password": obj.password,
                "team_id": obj.team_id,
                "team_name": obj.team_name,
                "team_description": obj.team_description,
                "team_leader": obj.team_leader,
                "number_of_leaves_left": obj.num_of_leaves,
                "emp_type": obj.emp_type,
                "emp_position": obj.type_name,
                "badge_earned": [{
                  "badge_id": obj.id,
                  "badge_name": obj.name,
                  "badge_description": obj.description,
                  "received_at": obj.receieved_at
                }],
              })
            } else {
              result.push({
                "emp_id": obj.emp_id,
                "first_name": obj.first_name,
                "last_name": obj.last_name,
                "email": obj.email,
                "password": obj.password,
                "team_id": obj.team_id,
                "team_name": obj.team_name,
                "team_description": obj.team_description,
                "team_leader": obj.team_leader,
                "number_of_leaves_left": obj.num_of_leaves,
                "emp_type": obj.emp_type,
                "emp_position": obj.type_name,
                "badge_earned": [],
              })
            }
          }
        })
        return res.status(200).json({
          result,
          message: "Data fetched",
          status: true
        })
      }
    })
  } catch (e) {
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
    return res.status(400).json({ data: false, message: "Request Failed", status: false })
  }
}

// To fetch the details of stand up form filled by an employee for Manager
const fetchStandupFormManager = async (req, res) => {
  let e = new Error()
  try {
    await connection.query(`SELECT * FROM  scrum_form WHERE team_id = ${req.employee[0].team_id} 
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
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });

  }
}

// Badges fetched by manager of all  employees
const fetchEmployeeBadges = async (req, res) => {
  let e = new Error()
  try {
    await connection.query(`select e.emp_id, e.first_name, e.last_name, eb.receieved_at, b.id, b.name, b.description 
    from employee as e left join employee_badge as eb
    on eb.employee_id=e.emp_id
    left join badge as b
    on eb.badge_id=b.id
    where e.team_id=${req.employee[0].team_id} and e.emp_id!=${req.employee[0].emp_id};`, async (err, data) => {
      if (err) {
        e.message = "something went wrong";
        e.status = 400;
        throw e;
      }
      await connection.query(`select * from badge`, (err, badge) => {
        if (err) {
          e.message = "something went wrong";
          e.status = 400;
          throw e;
        }
        var result = [];
        data.forEach(obj => {
          if (result[0]) {
            var exist_or_not = 0;
            var index;
            result.forEach((element, i) => {
              if (element.emp_id == obj.emp_id) {
                exist_or_not = 1;
                index = i
              }
            })
            if (exist_or_not == 0) {
              if (obj.id != null) {
                result.push({
                  "emp_id": obj.emp_id,
                  "first_name": obj.first_name,
                  "last_name": obj.last_name,
                  "selected_badge": [{
                    "badge_id": obj.id,
                    "badge_name": obj.name,
                    "badge_description": obj.description,
                    "received_at": obj.receieved_at
                  }],
                  "unselected_badge": []
                })
              } else {
                result.push({
                  "emp_id": obj.emp_id,
                  "first_name": obj.first_name,
                  "last_name": obj.last_name,
                  "selected_badge": [],
                  "unselected_badge": []
                })
              }
            } else {
              if (obj.id != null) {
                result[index]["selected_badge"].push({
                  "badge_id": obj.id,
                  "badge_name": obj.name,
                  "badge_description": obj.description,
                  "received_at": obj.receieved_at
                })
              }
            }
          } else {
            if (obj.id != null) {
              result.push({
                "emp_id": obj.emp_id,
                "first_name": obj.first_name,
                "last_name": obj.last_name,
                "selected_badge": [{
                  "badge_id": obj.id,
                  "badge_name": obj.name,
                  "badge_description": obj.description,
                  "received_at": obj.receieved_at
                }],
                "unselected_badge": []
              })
            } else {
              result.push({
                "emp_id": obj.emp_id,
                "first_name": obj.first_name,
                "last_name": obj.last_name,
                "selected_badge": [],
                "unselected_badge": []
              })
            }
          }
        })

        result.forEach((element) => {
          var temp_badge = badge
          element.selected_badge.forEach(i => {
            temp_badge.forEach(j => {
              if (i.badge_id == j.id) {
                temp_badge = temp_badge.filter(obj => obj.id != i.badge_id);
              }
            })
          })
          element.unselected_badge = temp_badge
        })
        return res.status(200).json(result);
      })
      return res.status(400).send("Something's not alright");
    })
  } catch (e) {
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
}


//Fetch Badges for an Employee
const fetchBadgeForEmployee = async (req, res) => {
  let e = new Error()
  try {
    await connection.query(`select e.emp_id, e.first_name, e.last_name, eb.receieved_at, b.id, b.name, b.description 
    from employee as e left join employee_badge as eb
    on eb.employee_id=e.emp_id
    left join badge as b
    on eb.badge_id=b.id
    where e.emp_id=${req.employee[0].emp_id};`, async (err, data) => {
      if (err) {
        e.message = "something went wrong";
        e.status = 400;
        throw e;
      }
      await connection.query(`select * from badge`, (err, badge) => {
        if (err) {
          e.message = "something went wrong";
          e.status = 400;
          throw e;
        }
        var result = [];
        data.forEach(obj => {
          if (result[0]) {
            var exist_or_not = 0;
            var index;
            result.forEach((element, i) => {
              if (element.emp_id == obj.emp_id) {
                exist_or_not = 1;
                index = i
              }
            })
            if (exist_or_not == 0) {
              if (obj.id != null) {
                result.push({
                  "emp_id": obj.emp_id,
                  "first_name": obj.first_name,
                  "last_name": obj.last_name,
                  "selected_badge": [{
                    "badge_id": obj.id,
                    "badge_name": obj.name,
                    "badge_description": obj.description,
                    "received_at": obj.receieved_at
                  }],
                  "unselected_badge": []
                })
              } else {
                result.push({
                  "emp_id": obj.emp_id,
                  "first_name": obj.first_name,
                  "last_name": obj.last_name,
                  "selected_badge": [],
                  "unselected_badge": []
                })
              }
            } else {
              if (obj.id != null) {
                result[index]["selected_badge"].push({
                  "badge_id": obj.id,
                  "badge_name": obj.name,
                  "badge_description": obj.description,
                  "received_at": obj.receieved_at
                })
              }
            }
          } else {
            if (obj.id != null) {
              result.push({
                "emp_id": obj.emp_id,
                "first_name": obj.first_name,
                "last_name": obj.last_name,
                "selected_badge": [{
                  "badge_id": obj.id,
                  "badge_name": obj.name,
                  "badge_description": obj.description,
                  "received_at": obj.receieved_at
                }],
                "unselected_badge": []
              })
            } else {
              result.push({
                "emp_id": obj.emp_id,
                "first_name": obj.first_name,
                "last_name": obj.last_name,
                "selected_badge": [],
                "unselected_badge": []
              })
            }
          }
        })

        result.forEach((element) => {
          var temp_badge = badge
          element.selected_badge.forEach(i => {
            temp_badge.forEach(j => {
              if (i.badge_id == j.id) {
                temp_badge = temp_badge.filter(obj => obj.id != i.badge_id);
              }
            })
          })
          element.unselected_badge = temp_badge
        })
        return res.status(200).json(result);
      })
      return res.status(400).send("Something's not alright");
    })
  } catch (e) {
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
}

// Update Badges for Employees
const updateEmployeeBadge = async (req, res) => {
  let e = new Error()
  try {
    await connection.query(`delete from employee_badge where employee_id=${req.body.emp_id};`
      , async (err, data) => {
        if (err) {
          e.message = "Something went wrong";
          e.status = 400;
          throw e;
        }
        if (req.body.badge_id.length) {
          var insert_badge_sql = `insert employee_badge (employee_id, badge_id) values (${req.body.emp_id}, ${req.body.badge_id[0]})`
          for (i = 1; i < req.body.badge_id.length; i++) {
            insert_badge_sql += `,(${req.body.emp_id}, ${req.body.badge_id[i]})`
          }
          insert_badge_sql += `;`
          await connection.query(insert_badge_sql, (err, data) => {
            if (err) {
              e.message = "something went wrong";
              e.status = 400;
              throw e;
            }
            if (data.affectedRows) {
              return res.status(200).json({ data: true, message: `Badges updated`, status: true });
            } else {
              return res.status(400).json({ data: false, message: `Badges didn't update`, status: false });
            }
          })
        } else {
          return res.status(200).json({ data: true, message: "Badges updated", status: true })
        }
      })
  } catch (e) {
    return res
      .status(400)
      .json({ data: false, message: `Fail`, status: false });
  }
}

// Fetch Data - Announcement Module
const fetchAnnouncements = async (req, res) => {
  let e = new Error()
  try {
    await connection.query(`select e.first_name, e.last_name, e.email, e.emp_type, et.type_name as 'employee_position',
      t.team_name, a.* from announcement as a left join employee as e
      on a.posted_by=e.emp_id
      left join team as t on e.team_id=t.team_id
      left join employee_type as et on e.emp_type=et.id
      order by created_at desc;`, (err, data) => {
      if (err) {
        e.message = "something went wrong";
        e.status = 400;
        throw e;
      }
      return res.status(200).json({ data, message: `announcements fetched`, status: true });
    })
  } catch (e) {
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
}

const postAnnouncement = async (req, res) => {
  let e = new Error()
  try {
    validate_announcement.validateAnnouncement(req.body);
    await connection.query(`insert announcement (title, description, posted_by) values
    ("${req.body.title}","${req.body.description}",${req.employee[0].emp_id});`, (err, data) => {
      if (err) {
        e.message = "something went wrong";
        e.status = 400;
        throw e;
      }
      if (data.affectedRows) {
        return res.status(200).json({ data: true, message: `announcement added`, status: true });
      } else {
        return res.status(400).json({ data: false, message: `announcement didn't update`, status: false });
      }
    })
  } catch (e) {
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
}

const deleteAnnouncement = async (req, res) => {
  let e = new Error()
  try {
    await connection.query(`delete from announcement where id=${req.body.post_id} and posted_by=${req.employee[0].emp_id};`,
      (err, data) => {
        if (err) {
          e.message = "Something went wrong";
          e.status = 400;
          throw e;
        }
        if (data.affectedRows) {
          return res.status(200).json({ data: true, message: `Announcement Deleted`, status: true });
        } else {
          return res.status(400).json({ data: false, message: `Couldn't delete announcement. Try again!`, status: false });
        }
      })
  } catch (e) {
    return res
      .status(400)
      .json({ data: false, message: `Something went wrong`, status: false });
  }
}

// Fetch Notifications
const fetchNotifications = async (req, res) => {
  let e = new Error();
  try {
    await connection.query(`select * from notification where notification_receiver=${req.employee[0].emp_id} 
      order by notification_sent_timestamp desc;`,
      (err, data) => {
        if (err) {
          e.message = "Something went wrong";
          e.status = 400;
          throw e;
        }
        return res.status(200).json({ data: data, message: `Notifications fetched`, status: true });
      }
    )
  } catch (e) {
    return res
      .status(400)
      .json({ data: false, message: `Something went wrong`, status: false });
  }
}

//Function to create survey form
const surveyform = async (req, res) => {
  let e = new Error()
  try {
    validate_survey.validateSurvey(req.body);
    await connection.query(`INSERT INTO survey_form (question_1,question_2,question_3,posted_by)
  values ("${req.body.q1}","${req.body.q2}","${req.body.q3}",${req.employee[0].emp_id});`,
      async (err, data) => {
        if (err) {
          e.message = "something went wrong";
          e.status = 400;
          throw e;
        }
        if (data.affectedRows) {
          const employees = await connection.query(`select e.emp_id from employee as e where 
        e.team_id=(select team_id from employee where employee.emp_id=${req.employee[0].emp_id}) 
        and e.emp_id!=${req.employee[0].emp_id};`)
          if (employees.length) {
            var insert_query = `insert into employee_survey (survey_id,employee_id) values (${data.insertId},${employees[0].emp_id})`;
            for (i = 1; i < employees.length; i++) {
              insert_query += `,(${data.insertId},${employees[i].emp_id})`;
            }
            insert_query += `;`;
            await connection.query(insert_query, (err, data) => {
              if (err) {
                e.message = "something went wrong";
                e.status = 400;
                throw e;
              }
              return res.status(200).json({ data: true, message: 'Survey added successfully', status: true });
            }
            )
          } else {
            return res.status(200).json({ data: true, message: 'Survey added successfully', status: true });
          }
        } else {
          return res.status(400)
            .json({ data: false, message: `Survey Questions were not added, Please try again !`, status: false });
        }
      })
  } catch (e) {
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
}

const forgetPassword = async (req, res) => {
  let e = new Error();
  try {
    if (!validate_email.validateEmail(req.body.email)) {
      return res.status(400).json({ data: false, message: "Invalid email", status: false })
    } else {
      await connection.query(`select * from employee where email="${req.body.email}"`, async (err, data) => {
        if (err) {
          e.message = "something went wrong";
          e.status = 400;
          throw e;
        } else if (data.length) {
          await connection.query('start transaction;');
          const new_password = util.passwordGenerator(10, 'aA#!');
          const salt = bcrypt.genSaltSync(10);
          const password = bcrypt.hashSync(new_password, salt);
          const result = await connection.query(
            `update employee set password = "${password}" where emp_id=${data[0].emp_id}`
          );
          if (result.affectedRows) {
            let send_data = {
              password: new_password,
              email: data[0]['email']
            };
            await util.sendEmailTemporaryPassword(send_data);
            await connection.query('commit;');
            return res.status(200).json({
              data: true,
              message: `Temporary password has been sent`,
              status: true,
            });
          } else {
            connection.query('rollback;')
            return res.status(400).json({
              data: false,
              message: `something went wrong`,
              status: false,
            });
          }
        } else {
          return res.status(400).json({ data: false, message: 'User does not exist', status: ture });
        }
      })
    }
  } catch (e) {
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
}
// Function for employees within a team to fill the survey form

const fillsurveyform = async (req, res) => {
  let e = new Error()
  try {
    await connection.query(`update employee_survey set answer_1 ="${req.body.answer_1}" ,
    answer_2 ="${req.body.answer_2}" , answer_3 ="${req.body.answer_3}",hasSubmitted =1,creation_timestamp=now()
    where survey_id = ${req.body.survey_id} and employee_id = ${req.employee[0].emp_id};`,
      (err, data) => {
        if (err) {
          e.message = "something went wrong";
          e.status = 400;
          throw e;
        }
        if (data.affectedRows) {
          return res.status(200).json({ data: true, message: `Survey was filled by the Employee`, status: true });
        } else {
          return res.status(400).json({ data: false, message: `Error updating survey, try again!`, status: false });
        }
      })
  } catch (e) {
    console.log(`Error: `, e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
}

module.exports = {
  login, create_employee, profile, leavesGet, leavesRequest, leavesRaised,
  leavesRequestsReceived, leavesApproveReject, dailystandupform,
  fetchStandupForm, fetchStandupFormManager, fetchEmployeeBadges, fetchBadgeForEmployee,
  fetchAnnouncements, postAnnouncement, deleteAnnouncement, updateEmployeeBadge, fetchNotifications,
  surveyform, forgetPassword,fillsurveyform
}
