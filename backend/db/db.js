import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://ujjawal1012004:dZIyEQ6dC51ZNQu3@aichatcluster.t56z0.mongodb.net/AiChat');
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failures
  }
};

export default connectDB;
