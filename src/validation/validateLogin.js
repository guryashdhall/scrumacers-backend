const general_val=require('./general');
function validateLogin(data){
    let error=new Error();
    error.status=400;
    if(data.email=="" || data.email==" "){
        error.message="Email is empty";
        throw error;
    } else if(!general_val.validateEmail(data.email)){
        error.message="Email is invalid";
        throw error;
    } else if(data.password=="" || data.password==" "){
        error.message="Password is empty";
        throw error;
    } else if(data.password.length<=4){
        error.message="Password length should be atleast 4";
        throw error;
    } 
}

module.exports = {validateLogin}