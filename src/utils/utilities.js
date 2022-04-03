const utilities={}

utilities.throwError=new function(message,errorCode){
    let e = new Error()
    if(message==""){
        e.message = "Something went wrong";
    }
    else{
        e.message = message;
    }
    if(errorCode==""){
        e.status = 400;
    }
    else{
        e.status = errorCode;
    }
    throw e;
}

utilities.sendErrorResponse=new function(message,errorCode){
    return res.status(errorCode).json({ data: false, message: message, status: false });
}


module.exports=utilities;