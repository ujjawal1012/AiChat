import mongoose from "mongoose";
import projectModel from "../models/project.model.js";

export const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error("name are required");
  }

  if (!userId) {
    throw new Error("name are required");
  }

  let project;
  try {
    project = await projectModel.create({
      name,
      users: [userId],
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Project name already exists");
    }
    throw error;
  }

  return project;
};

export const getAllProjectByUserID = async (userId) => {
  console.log("🚀 ~ getAllProjectByUserID ~ userId:", userId);

  if (!userId) {
    throw new Error("userId is required");
  }

  try {
    // Fetch projects associated with the userId
    const allUserProjects = await projectModel.find({ users: userId });
    console.log(
      "🚀 ~ getAllProjectByUserID ~ allUserProjects:",
      allUserProjects
    );
    return allUserProjects;
  } catch (error) {
    console.error("🚀 ~ getAllProjectByUserID ~ Error:", error.message);
    throw new Error("Failed to fetch projects");
  }
};

export const addUsersToProject = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error("projectId is required");
  }

  if (!users || !users.length) {
    throw new Error("users are required");
  }
  // Check if projectId is a valid mongoose ObjectId
  // Validate if projectId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid projectId");
  }

  // Validate if all elements in the users array are valid ObjectIds
  for (const user of users) {
    if (!mongoose.Types.ObjectId.isValid(user)) {
      throw new Error(`Invalid userId: ${user}`);
    }
  }

  if (!userId) {
    throw new Error("userId is required");
  }

  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  const project = await projectModel.findOne({ _id: projectId, users: userId });

  if (!project) {
    throw new Error("user not belongs to this project");
  }

  const updatedProject = await projectModel.findOneAndUpdate(
    { _id: projectId },
    { $addToSet: { users: { $each: users } } },
    { new: true }
  );

  return updatedProject;
};

export const getProjectById = async ({projectId}) => {
  if (!projectId) {
    throw new Error("projectId is required");
  }
  
  console.log("🚀 ~ getProjectById ~ projectId:", projectId)
  const project = await projectModel
  .findOne({
    _id: projectId,
  })
  .populate("users");
  console.log("🚀 ~ getProjectById ~ project:", project)

  return project;
};
