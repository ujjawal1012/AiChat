const userModel = require("../models/user.model");

const userSevices = require("../services/user.service");

const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blackListToken.model");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;

  const hashPassword = await userModel.hashPassword(password);

  const user = await userSevices.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    password: hashPassword,
    email,
  });

  const token = await user.generateAuthToken();
  console.log("🚀 ~ module.exports.registerUser= ~ token:", token);

  res.status(201).json({ token, user });
};

module.exports.loginUser = async (req, res, next) => {
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

  res.cookie("token", token);

  res.status(200).json({ token, user });
};

module.exports.getProfile = async (req, res, next) => {
  res.status(200).json({ user: req.user });
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.header("Authorization").split(" ")[1];
  blackListTokenModel.create({ token });
  res.status(200).json({ message: "logout successfully" });
};
