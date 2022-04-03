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

const leaveFunctions = {
    leavesGet,
    leavesRaised,
    leavesRequestsReceived,
    leavesApproveReject,
    leavesRequest
}

module.exports = leaveFunctions