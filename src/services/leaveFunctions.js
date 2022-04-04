const utilities = require("../utils/utilities");

const leavesGet = async (req, res) => {
  try {
    await connection.query(
      `select emp_id as team_leader_emp_id, first_name,last_name,email from employee where emp_id=(select team_leader from employee a,team b where emp_id=${req.employee[0].emp_id} and a.team_id=b.team_id);`,
      (err, data) => {
        return leavesCommon(1, res, err, data, "Error fetching employee's leader", "Data fetched", "No team leader information found");
      }
    );
  } catch (e) {
    return utilities.sendErrorResponse(res, "Request Failed", 400);
  }
};

const leavesCommon = function (temp, res, err, data, errMsg, success, err2Msg) {
  try {
    if (err) {
      utilities.throwError(errMsg, 400);
    } else {
      if ((temp == 1 && data.length) || (temp == 2 && data.affectedRows)) {
        return utilities.sendSuccessResponse(res, data, success);
      } else {
        return utilities.sendErrorResponse(res, err2Msg, 400);
      }
    }
  } catch (e) {
    return utilities.sendErrorResponse(res, "Some error occured", 400);
  }
}

const leavesRaised = async (req, res) => {
  try {
    await connection.query(
      `select l.*,e.first_name as manager_first_name,e.last_name as manager_last_name
      from leave_information as l
      left join employee  as e
      on l.manager_id =e.emp_id where l.employee_id=${req.employee[0].emp_id} order by leave_apply_date desc`,
      (err, data) => {
        try {
          if (err) {
            utilities.throwError("Error fetching employee's leaves", 400);
          }
          else {
            if (data.length) {
              return utilities.sendSuccessResponse(res, data, "Data fetched");
            } else {
              return utilities.sendErrorResponse(res, "No leave requests found", 400);
            }
          }
        } catch (e) {
          return utilities.sendErrorResponse(res, "Some error occured", 400);
        }
      }
    );
  } catch (e) {
    return utilities.sendErrorResponse(res, "Request Failed", 400);
  }
};

const leavesRequestsReceived = async (req, res) => {
  try {
    await connection.query(
      `select l.leave_id, l.employee_id, e.first_name as employee_first_name, e.last_name as employee_last_name, l.leave_desc, l.manager_id, l.leave_start_date,
      l.leave_end_date, l.status, l.leave_apply_date, t.team_name
      from leave_information as l left join employee as e on l.employee_id=e.emp_id
      left join team as t on e.team_id=t.team_id where l.manager_id=${req.employee[0].emp_id} order by leave_apply_date desc`,
      (err, data) => {
        try {
          if (err) {
            utilities.throwError("Error fetching employees leave requests", 400);
          } else {
            if (data.length) {
              return utilities.sendSuccessResponse(res, data, "Data fetched");
            } else {
              return utilities.sendErrorResponse(res, "No leave approval requests found", 400);
            }
          }
        } catch (e) {
          return utilities.sendErrorResponse(res, "Some error occured", 400);
        }
      }
    );
  } catch (e) {
    return utilities.sendErrorResponse(res, "Request Failed", 400);
  }
};

const leavesApproveReject = async (req, res) => {
  try {
    await connection.query(
      `update leave_information set status='${req.body.status}' where leave_id='${req.body.leaveId}'`,
      async (err, data) => {
        try {
          if (err) {
            utilities.throwError(`Error updating leave id ${req.body.leaveId}`, 400);
          } else {
            if (data.affectedRows) {
              return await returnBadgeOutput(req, res);
            } else {
              return utilities.sendErrorResponse(res, "Leave Id not found", 400);
            }
          }
        } catch (e) {
          return utilities.sendErrorResponse(res, "Some error occured", 400);
        }
      }
    );
  } catch (e) {
    return utilities.sendErrorResponse(res, "Request Failed", 400);
  }
};

const leavesRequest = async (req, res) => {
  try {
    await connection.query(
      `insert into leave_information values(null,${req.body.emp_id},${req.body.manager_id},'${req.body.leaveDesc}','${req.body.start_date}','${req.body.end_date}',DEFAULT,DEFAULT);`,
      (err, data) => {
        return leavesCommon(2, res, err, data, "Failed to raise leave request", data.affectedRows + " rows inserted", "Failed to raise leave request");
      }
    );
  } catch (e) {
    return utilities.sendErrorResponse(res, "Request Failed", 400);
  }
};

const returnBadgeOutput = async (req, res) => {
  req.body.leave_start_date = req.body.leave_start_date.replaceAll(
    "-",
    "/"
  );
  req.body.leave_end_date = req.body.leave_end_date.replaceAll(
    "-",
    "/"
  );
  let date = new Date(req.body.leave_start_date);
  let date2 = new Date(req.body.leave_end_date);
  let days = (date2.getTime() - date.getTime()) / (1000 * 3600 * 24);
  if (req.body.status === "approved") {
    return updateApprovedLeave(days, req, res);
  } else {
    if (data.affectedRows) {
      return utilities.sendSuccessResponse(res, data, "Data Updated");
    } else {
      return utilities.sendErrorResponse(res, "Failed to find leave id", 400);
    }
  }
}

const updateApprovedLeave = async (days, req, res) => {
  await connection.query(
    `update employee set num_of_leaves=num_of_leaves-${days} where emp_id='${req.body.employee_id}';`,
    (err2, data2) => {
      try {
        if (err2) {
          utilities.throwError("Failed to deduct employee's leaves", 400);
        } else {
          if (data2.affectedRows) {
            return utilities.sendSuccessResponse(res, data2, "Data Updated");
          } else {
            return utilities.sendErrorResponse(res, "Failed to find employee", 400);
          }
        }
      } catch (e) {
        return utilities.sendErrorResponse(res, "Some error occured", 400);
      }
    }
  );
}

const leaveFunctions = {
  leavesGet,
  leavesRaised,
  leavesRequestsReceived,
  leavesApproveReject,
  leavesRequest,
};

module.exports = leaveFunctions;