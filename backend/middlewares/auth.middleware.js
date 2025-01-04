import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "unauthorized Access" });
  }

  const isblacklisted = await redisClient.get(token);

  if (isblacklisted) {
    res.cookie("token", "");
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
