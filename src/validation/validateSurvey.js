const validateSurvey = (data) => {
    let error = new Error();
    error.status = 400;
    console.log(data)
    if (!data.q1.length || data.q1 == " ") {
        error.message = "Question 1 cannot be empty";
        throw error;
    }

}
module.exports = { validateSurvey };