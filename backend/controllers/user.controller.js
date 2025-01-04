import userModel from "../models/user.model.js";
import { createUser, getAllUser } from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";

export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({ email });
  if (isUserAlreadyExist) {
    return res.status(400).json({ message: "user already exist" });
  }

  const hashPassword = await userModel.hashPassword(password);

  const user = await createUser({
    password: hashPassword,
    email,
  });

  const token = await user.generateAuthToken();

  delete user._doc.password;
  console.log("🚀 ~ module.exports.registerUser= ~ token:", token);

  res.status(201).json({ token, user });
};

export const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");
  console.log("🚀 ~ module.exports.loginUser= ~ user:", user);

  if (!user) {
    return res.status(404).json({ message: "invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(404).json({ message: "invalid email or password" });
  }

  const token = await user.generateAuthToken();
  delete user._doc.password;

  res.cookie("token", token);

  res.status(200).json({ token, user });
};

export const getProfile = async (req, res, next) => {
  res.status(200).json({ user: req.user });
};

export const logoutUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    redisClient.set(token, "logout", "EX", 60 * 60 * 24);

    res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getAllUsers = async function (req, res, next) {
  try {
    const loggedInUser = await userModel.findOne({
      email: req.user.email,
    });

    const allUsers = await getAllUser({ userId: loggedInUser });

    res.status(200).json({ users: allUsers });
  } catch (error) {
    console.error("🚀 ~ getAllUser ~ Error:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
