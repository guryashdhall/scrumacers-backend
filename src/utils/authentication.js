const jwt = require("jsonwebtoken");
require('dotenv').config();
const utilities = require('../utils/utilities');

const isAuthenticated = (req, res, next) => {
  let token = req.get("Authorization");
  try {
    if (token) {
      // Remove Bearer from string
      token = token.slice(7);
      jwt.verify(token, "afgps7", async (err, decoded) => {
        if (err) {
          return utilities.sendErrorResponse(res,"Invalid Token...",401);
        } else {
          req.decoded = decoded;
          return fetchEmployeeDetails(req,res,next);
        }
      });
    } else {
      return utilities.sendErrorResponse(res,"Access Denied! Unauthorized User",401);
    }
  } catch (e) {
    return utilities.sendErrorResponse(res,"Request Failed",400);
  }
};

const fetchEmployeeDetails=async function(req,res,next){
  await connection.query(
    `select * from employee where emp_id=${req.decoded.result.emp_id}`
    , (err2, data) => {
      if (err2) {
        err2.messaage = "something went wrong";
        err2.status = 400;
        return new Error(err2);
      }
      else{
        if (data[0]) {
          req.employee = data;
          next();
        }
        else {
          return utilities.sendErrorResponse(res,`User not found`,404);
        }
      }              
    });
}

module.exports = { isAuthenticated }