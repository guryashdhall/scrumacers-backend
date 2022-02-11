/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
import { query } from "../index";

export const isAuthenticated = (req, res, next) => {
  let token = req.get("Authorization");
  try {
    if (token) {
      // Remove Bearer from string
      token = token.slice(7);
      jwt.verify(token, "nph101", async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            data: false,
            message: "Invalid Token...",
            status: false,
          });
        } else {
          req.decoded = decoded;
          const user = await query(
            `select * from user_info where id=${req.decoded.result.id}`
          );
          if (user[0]) {
            req.user = user;
            next();
          } else {
            return res.status(404).json({
              data: false,
              message: `User not found`,
              status: false,
            });
          }
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
    console.log(e);
    return res.status(400).json({
      data: false,
      message: "fail",
      status: false,
    });
  }
};

