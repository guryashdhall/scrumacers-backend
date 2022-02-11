import { validateLogin } from "../Validation/validateLogin";
import {
  validateSignUp,
} from "../Validation/validateSignUp";


export const signup = async (req, res) => {
  const { validationError, isValid } = validateSignUp(req.body);
  if (!isValid) {
    return res
      .status(200)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
    console.log("Signup functionality!")
      
  } catch (e) {
    console.log(`Error: `, e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};



export const login = async (req, res) => {
  const { validationError, isValid } = validateLogin(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "fail", status: false, error: validationError });
  }
  try {
   console.log("Login functionality")
   return res
      .status(200)
      .json({ data: true, message: `Login functionality`, status: true });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ data: false, message: `fail`, status: false });
  }
};



