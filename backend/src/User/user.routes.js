/* eslint-disable no-undef */
import {
  signup,
  login, 
} from "./user.functions.js";
import express from "express";

var router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
