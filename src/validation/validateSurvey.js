const validateSurvey = (data) => {
    let error = new Error();
    error.status = 400;
    if (!data.survey_title.length || data.survey_title == " ") {
        error.message = "Survey Title cannot be empty";
        throw error;
    }
    if (!data.q1.length || data.q1 == " ") {
        error.message = "Question 1 cannot be empty";
        throw error;
    }
    

}
module.exports = { validateSurvey };