const utilities = require("../utils/utilities");

// Badges fetched by manager of all  employees
const fetchEmployeeBadges = async (req, res) => {
    try {
        await connection.query(`select e.emp_id, e.first_name, e.last_name, eb.receieved_at, b.id, b.name, b.description 
      from employee as e left join employee_badge as eb
      on eb.employee_id=e.emp_id
      left join badge as b
      on eb.badge_id=b.id
      where e.team_id=${req.employee[0].team_id} and e.emp_id!=${req.employee[0].emp_id} ORDER BY e.emp_id;`, async (err, data) => {
          try{
            if (err) {
                utilities.throwError("something went wrong",400); 
            }
            else{
                await connection.query(`select * from badge`, (err, badge) => {
                    try{
                        if (err) {
                            utilities.throwError("something went wrong",400); 
                        }
                        else{
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
                            return utilities.sendSuccessJSONResponse(res,result);                     
                        } 
                    } catch(e){
                        return utilities.sendErrorResponse(res,"Some error occured",400);
                    }                                       
                })
                return utilities.sendErrorResponse(res,"Something's not alright",400);
            }   
          } catch(e) {
            return utilities.sendErrorResponse(res,"Some error occured",400);
          }                     
        })
    } catch (e) {
        return utilities.sendErrorResponse(res,"Request Failed",400);
    }
}


//Fetch Badges for an Employee
const fetchBadgeForEmployee = async (req, res) => {
    try {
        await connection.query(`select e.emp_id, e.first_name, e.last_name, eb.receieved_at, b.id, b.name, b.description 
      from employee as e left join employee_badge as eb
      on eb.employee_id=e.emp_id
      left join badge as b
      on eb.badge_id=b.id
      where e.emp_id=${req.employee[0].emp_id};`, async (err, data) => {
            if (err) {
                utilities.throwError("something went wrong",400); 
            }
            else{
                await connection.query(`select * from badge`, (err, badge) => {
                    if (err) {
                        utilities.throwError("something went wrong",400); 
                    }
                    else{
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
                        return utilities.sendSuccessJSONResponse(res,result);
                    }                    
                })
                return res.sendErrorResponse(res,"Something's not alright",400);
            }            
        })
    } catch (e) {
        return utilities.sendErrorResponse(res,"Request Failed",400);
    }
}

// Update Badges for Employees
const updateEmployeeBadge = async (req, res) => {
    try {
        await connection.query(`delete from employee_badge where employee_id=${req.body.emp_id};`
            , async (err, data) => {
                try{
                    if (err) {
                        utilities.throwError("something went wrong",400); 
                    }
                    else{
                        if (req.body.badge_id.length) {
                            var insert_badge_sql = `insert employee_badge (employee_id, badge_id) values (${req.body.emp_id}, ${req.body.badge_id[0]})`
                            for (i = 1; i < req.body.badge_id.length; i++) {
                                insert_badge_sql += `,(${req.body.emp_id}, ${req.body.badge_id[i]})`
                            }
                            insert_badge_sql += `;`
                            await connection.query(insert_badge_sql, (err, data) => {
                                if (err) {
                                    utilities.throwError("something went wrong",400); 
                                }
                                else{
                                    if (data.affectedRows) {
                                        return utilities.sendSuccessResponse(res,data,"Badges updated")
                                    } else {
                                        return utilities.sendErrorResponse(res,"Badges didn't update",400);
                                    }
                                }                                
                            })
                        } else {
                            return utilities.sendSuccessResponse(res,data,"Badges updated")
                        }
                    } 
                } catch(e) {
                    return utilities.sendErrorResponse(res,"Some error occured",400);
                }                               
            })
    } catch (e) {
        return utilities.sendErrorResponse(res,"Request Failed",400);
    }
}

const badgeFunctions = {
    fetchBadgeForEmployee,
    fetchEmployeeBadges,
    updateEmployeeBadge
}

module.exports = badgeFunctions