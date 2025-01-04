import express from "express";
import { registerUser, loginUser, getProfile, logoutUser,getAllUsers } from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { body } from "express-validator";

const router = express.Router();

router.post("/register", [
    body("email").isEmail().withMessage("enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage('password length at least 6')
], registerUser);

router.post("/login", [
    body("email").isEmail().withMessage("enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage('password length at least 6')
], loginUser);

router.get("/getProfile", authUser, getProfile);
router.get("/logout", authUser, logoutUser);
router.get("/all", authUser, getAllUsers);

export default router;
