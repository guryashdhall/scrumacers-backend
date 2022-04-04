const validate_survey = require('../validation/validateSurvey');
const utilities = require('../utils/utilities');
//Function to create survey form
const createSurvey = async (req, res) => {
    try {
        validate_survey.validateSurvey(req.body);
        await connection.query(`INSERT INTO survey_form (survey_title,question_1,question_2,question_3,posted_by)
    values ("${req.body.survey_title}","${req.body.q1}","${req.body.q2}","${req.body.q3}",${req.employee[0].emp_id});`,
            async (err, data) => {
                try{
                    if (err) {
                        utilities.throwError("something went wrong", 400);
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
                                    utilities.throwError("something went wrong", 400);
                                }
                                return utilities.sendSuccessResponse(res, data, `Survey added successfully`);
                            }
                            )
                        } else {
                            return utilities.sendSuccessResponse(res, data, `Survey added successfully`);
                        }
                    } else {
                        return utilities.sendErrorResponse(res, "Survey Questions were not added, Please try again !", 400);
                    }
                }
                catch (e) {
                    return utilities.sendErrorResponse(res, "Some error occured", 400);
                }   
            })
    } catch (e) {
        return utilities.sendErrorResponse(res, "fail", 400);
    }
}

// Function for employees within a team to fill the survey form

const fillSurveyForm = async (req, res) => {
    try {
        await connection.query(`update employee_survey set answer_1 ="${req.body.answer_1}" ,
      answer_2 ="${req.body.answer_2}" , answer_3 ="${req.body.answer_3}",hasSubmitted =1,creation_timestamp=now()
      where survey_id = ${req.body.survey_id} and employee_id = ${req.employee[0].emp_id};`,
            (err, data) => {
                try{
                    if (err) {
                        utilities.throwError("something went wrong", 400);
                    }
                    if (data.affectedRows) {
                        return utilities.sendSuccessResponse(res, data, `Survey was filled by the Employee`);
                    } else {
                        return utilities.sendErrorResponse(res, "Error updating survey, try again!", 400);
                    }
                }
                catch (e) {
                    return utilities.sendErrorResponse(res, "Some error occured", 400);
                }
            })
    } catch (e) {
        return utilities.sendErrorResponse(res, "fail", 400);
    }
}


// Fetch Survey details for Employee
const fetchSurveyEmployee = async (req, res) => {
    try {
        await connection.query(`select s.*,employee_teamlead.first_name , employee_teamlead.last_name,
      es.hasSubmitted 
      FROM survey_form as s
      left join employee_survey as es
      on s.survey_id=es.survey_id	
      left join employee as e
      on es.employee_id =e.emp_id
      left join team as t
      on t.team_id =e.team_id
      left join employee as employee_teamlead
      on employee_teamlead.emp_id = s.posted_by
       WHERE s.posted_by = t.team_leader
       and es.hasSubmitted =0
       and s.start_date < now() 
       and s.end_date>now()
       and es.employee_id = ${req.employee[0].emp_id};`,
            (err, data) => {
                try{
                    if (err) {
                        utilities.throwError("something went wrong", 400);
                                    }
                     return utilities.sendSuccessResponse(res, data, `Survey Details fetched`);      
                }
                catch (e) {
                    return utilities.sendErrorResponse(res, "Something went wrong", 400);
                }       
            }
        )
    } catch (e) {
        return utilities.sendErrorResponse(res, "Something went wrong", 400);
    }
}

// Fetch Survey details for Manager
const fetchSurveyManager = async (req, res) => {
    try {
        await connection.query(`select es.*,s.*,e.first_name as employee_firstname,e.last_name as employee_lastname
      from employee_survey  as es
      left join survey_form as s
      on s.survey_id =es.survey_id
      left join employee as e
      on es.employee_id =e.emp_id
      WHERE es.hasSubmitted =1
      and s.posted_by =${req.employee[0].emp_id} and es.survey_id=${req.body.survey_id};`,
            (err, data) => {
                try{
                    if (err) {
                        utilities.throwError("something went wrong", 400);
                    }
                    return utilities.sendSuccessResponse(res, data, `Survey Details fetched for employees`); 
                }
                catch (e) {
                    return utilities.sendErrorResponse(res, "Something went wrong", 400);
                } 
            }
        )
    } catch (e) {
        return utilities.sendErrorResponse(res, "Something went wrong", 400);
    }
}

// Fetch Survey details for Manager to get list of surveys
const fetchSurveyListManager = async (req, res) => {
    try {
        await connection.query(`select * from survey_form
      where posted_by =${req.employee[0].emp_id};`,
            (err, data) => {
                try{
                    if (err) {
                        utilities.throwError("something went wrong", 400);
                    }
                    return utilities.sendSuccessResponse(res, data, `Survey List fetched`); 
                }
                catch (e) {
                    return utilities.sendErrorResponse(res, "Something went wrong", 400);
                }  
            }
        )
    } catch (e) {
        return utilities.sendErrorResponse(res, "Something went wrong", 400);
    }
}

const surveyFunctions = {
    createSurvey,
    fillSurveyForm,
    fetchSurveyEmployee,
    fetchSurveyListManager,
    fetchSurveyManager
}

module.exports = surveyFunctions;