import { Router } from "express";
import { body } from "express-validator";
import {
  addUserToProjectController,
  createProjectController,
  getallProjectsController,
  getProjectByIdController,
} from "../controllers/project.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/create",
  authUser,
  body("name").isString({ min: 3 }).withMessage("name is required"),
  createProjectController
);

router.get("/all", authUser, getallProjectsController);

router.put(
  "/add-user",
  authUser,
  body("projectId").isString().withMessage("projectId must be a string"),
  addUserToProjectController
);
body("users")
  .isArray()
  .withMessage("users must be an array")
  .custom((users) => {
    return users.every((user) => typeof user === "string");
  })
  .withMessage("each user must be a string");

router.get("/get-project/:projectId", authUser, getProjectByIdController);

export default router;
