import mongoose from "mongoose";
import projectModel from "../models/project.model.js";
import userModel from "../models/user.model.js";
import {
  createProject,
  getAllProjectByUserID,
  addUsersToProject,
  getProjectById,
} from "../services/project.service.js";
import { validationResult } from "express-validator";

export const createProjectController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  const { name } = req.body;

  try {
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    if (!loggedInUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userId = loggedInUser._id;

    const newProject = await createProject({ name, userId });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: newProject,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while creating the project",
    });
  }
};

export const getallProjectsController = async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    console.log("🚀 ~ getallProjectsController ~ loggedInUser:", loggedInUser);
    const allUserProjects = await getAllProjectByUserID(loggedInUser._id);

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      projects: allUserProjects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching projects",
    });
  }
};

export const addUserToProjectController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const { projectId, users } = req.body;

    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const project = await addUsersToProject({
      projectId,
      users,
      userId: loggedInUser._id,
    });

    return res.status(200).json({
      success: true,
      message: "User added to project successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while adding user to project",
    });
  }
};

export const getProjectByIdController = async (req, res) => {
  const { projectId } = req.params;
  console.log("🚀 ~ getProjectByIdController ~ projectId:", projectId);
  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "projectId is required",
    });
  }
  try {
    const project = await getProjectById({ projectId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching project",
    });
  }
};
