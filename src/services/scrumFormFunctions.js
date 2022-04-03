const validate_standup_form = require('../validation/validate_scrum_form');

//Function to create daily stand up form
const createStandUpForm = async (req, res) => {
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
const fetchStandUpForm = async (req, res) => {
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

// To fetch the details of stand up form filled by an employee for Manager
const fetchStandUpFormManager = async (req, res) => {
    let e = new Error()
    try {
        await connection.query(`SELECT form_id,a.team_id,team_name,employee_id,first_name,last_name,ques_1,ques_2,ques_3,blocker,creation_timestamp
        FROM  scrum_form a,team b, employee c 
        WHERE a.team_id = ${req.employee[0].team_id} 
        and a.team_id=b.team_id and a.employee_id=c.emp_id
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

const scrumFormFunctions = {
    createStandUpForm,
    fetchStandUpForm,
    fetchStandUpFormManager
}

module.exports = scrumFormFunctions