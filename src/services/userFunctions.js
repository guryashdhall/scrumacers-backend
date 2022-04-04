const validate_login = require('../validation/validateLogin');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const validate_email = require('../validation/general')
const helper = require('../utils/helper');
const utilities = require('../utils/utilities');

// Login functionality for all users
const login = async (req, res) => {
    try {
        validate_login.validateLogin(req.body);
        await connection.query(`select * FROM employee where email='${req.body.email}';`, async (err, data) => {
            try{
                if (err) {
                    return utilities.sendErrorResponse(res, "Some error occured", 400);
                }
                else{
                    if (data.length) {
                        const passwordCompare = bcrypt.compareSync(req.body.password, data[0].password);
                        if (passwordCompare) {
                            let auth_token = "";
                            auth_token = jwt.sign({ result: { emp_id: data[0].emp_id } }, "afgps7", {
                                expiresIn: "10h",
                            });
                            await connection.query(`start transaction;`);
                            await connection.query(`update employee set authentication_token='${auth_token}' where emp_id='${data[0].emp_id}';`,
                                async (err2, data1) => {
                                    if (err2) {
                                        return utilities.sendErrorResponse(res, "Some error occured", 400);
                                    }
                                    else{
                                        if (data1.affectedRows) {
                                            const previous_day = await connection.query(`select * from hours_tracking where emp_id=${data[0].emp_id} and working_date=DATE_SUB(current_date(), INTERVAL 1 DAY);`)
                                            if (previous_day.length && previous_day[0].status === "Checked In") {
                                                await connection.query(`update hours_tracking set duration=360 and status="Checked Out" where emp_id=${data[0].emp_id} and working_date=DATE_SUB(current_date(), INTERVAL 1 DAY);`)
                                            }
                                            const today = await connection.query(`select * from hours_tracking where emp_id=${data[0].emp_id} and working_date=CURRENT_DATE();`)
                                            if (today.length) {
                                                await connection.query(`update hours_tracking set status="Checked In" where emp_id=${data[0].emp_id} and working_date=CURRENT_DATE();`)
                                            } else {
                                                await connection.query(`insert into hours_tracking (emp_id, status) values (${data[0].emp_id},"Checked In")`)
                                            }
                                            await connection.query("commit;");
                                            return res.status(200).json({
                                                data,
                                                message: "login successfully",
                                                token: auth_token,
                                                status: true,
                                                usertype: data[0].emp_type
                                            });
                                        }
                                        else{
                                            return utilities.sendErrorResponse(res, "Data not updated in DB", 400);
                                        }
                                    }                                
                                });
                        }
                        else{
                            return utilities.sendErrorResponse(res, "Invalid password", 400);
                        }                        
                    }
                    else{
                        return utilities.sendErrorResponse(res, "Employee not found", 400);
                    }
                    
                }
            } catch(e) {
                return utilities.sendErrorResponse(res, "Something went wrong", 400);
            }
                        
        });
    } catch (e) {
        return utilities.sendErrorResponse(res, "Request failed", 400);
    }
};

// Logout Functionality for all users
const logout = async (req, res) => {
    try {
        await connection.query(`update hours_tracking set 
      duration=duration+${req.body.duration}, status="Checked Out" 
      where emp_id=${req.employee[0].emp_id} and working_date = current_date()`, (err, data) => {
          try{
            if (err) {
                utilities.throwError("Error fetching employee profile", 400);
            }
            else{
                if (data.affectedRows) {
                    return utilities.sendSuccessResponse(res, data, "Logout successful");
                } else {
                    return utilities.sendErrorResponse(res, "Something went wrong", 400);
                }
            }    
          } catch(e) {
            return utilities.sendErrorResponse(res, "Something went wrong", 400);
          }
        })
    }
    catch (e) {
        return utilities.sendErrorResponse(res, "Request failed", 400);
    }
}

// Employee with position of HR, Admin or Manager only can add/create new employees
const create_employee = async (req, res) => {
    try {
        let condition = (req.body.first_name !== "" && req.body.last_name !== "" && req.body.email_id !== "" && req.body.password !== "" && req.body.emp_type !== "" && req.body.team_id !== "");
        if ([1, 2, 3].indexOf(req.employee[0].emp_type) !== -1 && condition && Object.keys(req.body).length !== 0) {
            const salt = bcrypt.genSaltSync(10);
            const password = bcrypt.hashSync(req.body.password, salt);
            let query = `insert into employee values(null,"${req.body.first_name}","${req.body.last_name}","${req.body.email_id}","${password}","","${req.body.emp_type}",10,sysdate(),"${req.body.team_id}");`
            await connection.query(query,
                (err, data) => {
                    try {
                        if (err) {
                            utilities.throwError("Something went wrong", 400);
                        }
                        else {
                            if (data.affectedRows) {
                                return utilities.sendSuccessResponse(res, data, `Employee created successfully`);
                            } else {
                                return utilities.sendErrorResponse(res, "Couldn't create employee. Try again later!", 400);
                            }
                        }
                    } catch (e) {
                        return utilities.sendErrorResponse(res, e.message, 400);
                    }

                })
        }
        else if (!condition || Object.keys(req.body).length === 0) {
            utilities.throwError("Invalid data", 400);
        }
        else {
            utilities.throwError("You are not authorized to create employee!", 400);
        }
    } catch (e) {
        return utilities.sendErrorResponse(res, e.message, 400);
    }
};

// Fetch all employees in the organization for HR, Admin or Manager
const fetch_all_employees = async (req, res) => {
    try {
        if ([1, 2, 3].indexOf(req.employee[0].emp_type) !== -1) {
            let query = `select emp_id,first_name,last_name,email,emp_type,num_of_leaves,joining_datetime,team_id,type_name from employee a,`
                + `employee_type b where a.emp_type=b.id and a.emp_id<>"${req.employee[0].emp_id}" and a.emp_type>"${req.employee[0].emp_type}"`
                + ` order by emp_id;`
            await connection.query(query,
                (err, data) => {
                    try {
                        if (err) {
                            utilities.throwError("Something went wrong", 400);
                        }
                        else {
                            if (data.length) {
                                return utilities.sendSuccessResponse(res, data, `Employees fetched successfully`);
                            }
                            else {
                                return utilities.sendErrorResponse(res, "Couldn't fetch employees!", 400);
                            }
                        }
                    } catch (e) {
                        return utilities.sendErrorResponse(res, "Request failed", 400);
                    }
                })
        }
        else {
            utilities.throwError("You are not authorized to access employee records", 400);
        }
    } catch (e) {
        return utilities.sendErrorResponse(res, e.message, 400);
    }
};

// Delete/Remove employee for HR, Manager or Admin 
const delete_employee = async (req, res) => {
    try {
        if ([1, 2, 3].indexOf(req.employee[0].emp_type) !== -1) {
            let query = `SET FOREIGN_KEY_CHECKS=0; delete from employee where emp_id="${req.body.emp_id}"; delete from leave_information where employee_id="${req.body.emp_id}"; delete from employee_badge where employee_id="${req.body.emp_id}";`
            await connection.query(query,
                (err, data) => {
                    try {
                        if (err) {
                            utilities.throwError("Something went wrong", 400);
                        }
                        else {
                            if (data[1].affectedRows) {
                                return utilities.sendSuccessResponse(res, data, `Employee deleted successfully`);
                            }
                            else {
                                return utilities.sendErrorResponse(res, "Employee doesn't exist!", 400);
                            }
                        }
                    } catch (e) {
                        return utilities.sendErrorResponse(res, e.message, 400);
                    }

                })
        }
        else {
            utilities.throwError("You are not authorized to delete employees", 400);
        }
    } catch (e) {
        return utilities.sendErrorResponse(res, e.message, 400);
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
            try{
                if (err) {
                    utilities.throwError("Error fetching employee profile", 400);
                }
                else{
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
                        return utilities.sendSuccessResponse(res, result, "Data fetched");
                    }   
                }
            } catch (e) {
                return utilities.sendErrorResponse(res, e.message, 400);
            }            
        })
    } catch (e) {
        return utilities.sendErrorResponse(res, "Request Failed", 400);
    }
}

// Function for forgot password functionality
const forgetPassword = async (req, res) => {
    try {
        if (!validate_email.validateEmail(req.body.email)) {
            return res.status(400).json({ data: false, message: "Invalid email", status: false })
        } else {
            await connection.query(`select * from employee where email="${req.body.email}"`, async (err, data) => {
                try{
                    if (err) {
                        utilities.throwError("something went wrong", 400);
                    } else if (data.length) {
                        await connection.query('start transaction;');
                        const new_password = helper.passwordGenerator(10, 'aA#!');
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
                            await helper.sendEmailTemporaryPassword(send_data);
                            await connection.query('commit;');
                            return utilities.sendSuccessResponse(res, result, "Temporary password has been sent to your email");
                        } else {
                            connection.query('rollback;')
                            return utilities.sendErrorResponse(res, "something went wrong", 400);
                        }
                    } else {
                        return utilities.sendErrorResponse(res, "User does not exist", 400);
                    }
                } catch (e) {
                    return utilities.sendErrorResponse(res, e.message, 400);
                }                  
            })
        }
    } catch (e) {
        return utilities.sendErrorResponse(res, "Request failed", 400);
    }
}

const changePassword = async (req, res) => {
    try {
        const result = await bcrypt.compare(req.body.old_password, req.employee[0].password);
        if (result) {
            const salt = bcrypt.genSaltSync(10);
            const password = bcrypt.hashSync(req.body.new_password, salt);
            await connection.query(`update employee set password="${password}" where emp_id=${req.employee[0].emp_id}`, (err, data) => {
                try{
                    if (err) {
                        utilities.throwError("Something went wrong", 400);
                    } else if (data.affectedRows) {
                        return utilities.sendSuccessResponse(res, data, "Password updated");
                    } else {
                        return utilities.sendErrorResponse(res, "something went wrong", 400);
                    }
                } catch(e){
                    return utilities.sendErrorResponse(res, e.message, 400);
                }                
            })
        } else {
            return utilities.sendSuccessResponse(res, {data:false}, "The entered old password is incorrect");
        }
    } catch (e) {
        return utilities.sendErrorResponse(res, "Request failed", 400);
    }
}

const fetchEmployeeHours = async (req, res) => {
    try {
        await connection.query(`select hours_tracking.emp_id, employee.first_name,employee.last_name, date_format(working_date,"%Y-%m-%d") as "working_date",
       SEC_TO_TIME(duration*60) as duration, status from hours_tracking left join employee
      on hours_tracking.emp_id=employee.emp_id 
      where hours_tracking.emp_id in 
      (select employee.emp_id from employee where team_id=${req.employee[0].team_id} and employee.emp_id!=${req.employee[0].emp_id})
      and working_date>DATE_SUB(current_date(), INTERVAL 21 DAY)
      order by working_date desc;`, (err, data) => {
          try{
            if (err) {
                e.message = "Something went wrong";
                e.status = 400;
                throw e;
            } else if (data.length) {
                var result = []
                data.forEach(obj => {
                    if (result.length) {
                        var exist_or_not = 0;
                        var index;
                        result.forEach((element, i) => {
                            if (element.date == obj.working_date) {
                                exist_or_not = 1;
                                index = i
                            }
                        })
                        if (exist_or_not) {
                            result[index].employee_track.push({
                                emp_id: obj.emp_id,
                                first_name: obj.first_name,
                                last_name: obj.last_name,
                                duration: obj.duration
                            })
                        } else {
                            result.push({
                                date: obj.working_date,
                                employee_track: [{
                                    emp_id: obj.emp_id,
                                    first_name: obj.first_name,
                                    last_name: obj.last_name,
                                    duration: obj.duration
                                }]
                            })
                        }
                    } else {
                        result.push({
                            date: obj.working_date,
                            employee_track: [{
                                emp_id: obj.emp_id,
                                first_name: obj.first_name,
                                last_name: obj.last_name,
                                duration: obj.duration
                            }]
                        })
                    }
                })
                return utilities.sendSuccessResponse(res,result,"Hours tracking fetched")
            } else {
                return utilities.sendSuccessJSONResponse(data,{ data: [], message: "No Employee's Tracking Hour Found In Last 3 Weeks", status: true })
            }
          } catch(e) {
            return utilities.sendErrorResponse(res, e.message, 400);
          }            
        })
    } catch (e) {
        return utilities.sendErrorResponse(res, "Request failed", 400);
    }
}

const userFunctions = {
    login,
    logout,
    create_employee,
    fetch_all_employees,
    delete_employee,
    profile,
    forgetPassword,
    changePassword,
    fetchEmployeeHours
}

module.exports = userFunctions