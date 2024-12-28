const express = require("express")
const router = express.Router()

const userController = require("../controllers/user.controller")
const authmiddleware = require("../middlewares/auth.middleware")

const {body} = require("express-validator")


router.post("/register",[
    body("fullname.firstname").isLength({min:3}).withMessage("firstName minimum length is 3"),
    body("email").isEmail().withMessage("enter an valid email"),
    body("password").isLength({min:6}).withMessage('passowrd length atleast 6 ')
],userController.registerUser)

router.post("/login",[
    body("email").isEmail().withMessage("enter an valid email"),
    body("password").isLength({min:6}).withMessage('passowrd length atleast 6 ')
],userController.loginUser)

router.get("/getProfile",authmiddleware.authUser,userController.getProfile)
router.get("/logout",authmiddleware.authUser,userController.logoutUser)


module.exports = router;

