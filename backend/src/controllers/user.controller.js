import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

//  LOGIN
export const login = async (req, res) => {
  const { username, password } = req.body;

  // check empty fields
  if (!username || !password) {
    return res.status(400).json({
      message: "Please provide username and password",
    });
  }

  try {
    // find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "User not found",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // generate token
    const token= jwt.sign(
      {id : user._id},
      process.env.JWT_SECRET,
      {expiresIn : "1d"}
    );

    return res.status(httpStatus.OK).json({
      token: token,
      message: "Login successful",
    });

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

//  REGISTER
export const Register = async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({
      message: "Please provide all fields",
    });
  }

  try {
    // check existing user
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(httpStatus.CONFLICT).json({
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(httpStatus.CREATED).json({
      message: "User registered successfully",
    });

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};