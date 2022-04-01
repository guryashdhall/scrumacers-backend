/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
require('dotenv').config();

const isAuthenticated = (req, res, next) => {
  let token = req.get("Authorization");
  try {
    if (token) {
      // Remove Bearer from string
      token = token.slice(7);
      jwt.verify(token, "afgps7", async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            data: false,
            message: "Invalid Token...",
            status: false,
          });
        } else {
          req.decoded = decoded;
          await connection.query(
            `select * from employee where emp_id=${req.decoded.result.emp_id}`
            , (err, data) => {
              if (err) {
                err.Messaage = "something went wrong";
                err.status = 400;
                return new Error(err);
              }
              if (data[0]) {
                req.employee = data;
                next();
              }
              else {
                return res.status(404).json({
                  data: false,
                  message: `User not found`,
                  status: false,
                });
              }
            });
        }
      });
    } else {
      return res.status(401).json({
        data: false,
        message: "Access Denied! Unauthorized User",
        status: false,
      });
    }
  } catch (e) {
    return res.status(400).json({
      data: false,
      message: "fail",
      status: false,
    });
  }
};

module.exports = { isAuthenticated }