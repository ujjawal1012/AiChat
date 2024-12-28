const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "unauthorized Access" });
  }

  const isblackListed = await userModel.findOne({ token: token });

  if (isblackListed) {
    return res.status(401).json({ message: "unauthorized Access" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "unauthorized Access" });
  }
};
