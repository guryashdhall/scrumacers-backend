const utilities={}

utilities.throwError=function(message,errorCode){
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

utilities.sendErrorResponse=function(res,message,errorCode){
    return res.status(errorCode).json({ data: false, message: message, status: false });
}

utilities.sendSuccessResponse=function(res,data,message){
    return res.status(200).json({ data, message: message, status: true });
}

utilities.sendSuccessJSONResponse=function(res,data){
    return res.status(200).json(data);
}

module.exports=utilities;