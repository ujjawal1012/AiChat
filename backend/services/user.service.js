import userModel from "../models/user.model.js";

export const createUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("All fields are required");
  }

  const user = await userModel.create({
    email,
    password,
  });

  return user;
};

export const getAllUser = async function ({ userId }) {
  if (!userId) {
    return new Error("userId is required");
  }
  try {
    const allUser = await userModel.find({ _id: { $ne: userId } });
    return allUser;
  } catch (error) {
    console.error("🚀 ~ getAllUser ~ Error:", error.message);
    throw new Error("Failed to fetch users");
  }
};
