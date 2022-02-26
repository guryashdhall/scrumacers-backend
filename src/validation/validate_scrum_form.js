const validate_scrum_form = (data) => {
    let error = new Error();
    error.status = 400;
    console.log(data)
    if (!data.q1.length || data.q1 == " ") {
        error.message = "Question 1 cannot be empty";
        throw error;
    }
    else if (!data.q2.length || data.q2 == " ") {
        error.message = "Question 2 cannot be empty";
        throw error;
    }

}
module.exports = { validate_scrum_form };