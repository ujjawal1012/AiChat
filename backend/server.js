import { createServer } from "http";
import app from "./app.js";
const server = createServer(app);
const PORT = process.env.PORT || 3000;
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import projectModel from "./models/project.model.js";
import userModel from "./models/user.model.js";
import { generateContent } from "./services/ai.service.js";

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers?.authorization?.split(" ")[1];
  console.log("🚀 ~ io.use ~ token:", token);
  const projectId = socket.handshake.query.projectId;
  if (!token) {
    return next(new Error("unauthorized"));
  }
  console.log("🚀 ~ io.use ~ projectId:", projectId);

  if (!projectId) {
    return next(new Error("projectId is required"));
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return next(new Error("Invalid projectId"));
  }

  socket.project = await projectModel.findById(projectId);
  console.log("🚀 ~ io.use ~ socket.project:", socket.project);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🚀 ~ io.use ~ decoded:", decoded);
    if (!decoded) {
      return next(new Error("unauthorized"));
    }
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error("unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.join(socket.project?._id.toString());
  socket.on("project-message", async (data) => {
    data.sender = await userModel.findOne({ _id: data.sender }).lean();

    const message = data?.message;
    const aiIsMentioned = message.slice(0, 3) === "@ai";
    console.log("🚀 ~ socket.on ~ aiIsMentioned:", aiIsMentioned);
    socket.broadcast
      .to(socket.project._id.toString())
      .emit("project-message", data);
    if (aiIsMentioned) {
      const prompt = message.replace("@ai", "");
      const result = await generateContent(prompt);
      io.to(socket.project?._id.toString()).emit("project-message", {
        message: result,
        sender: { _id: "ai", email: "ai" },
      });
    }
    console.log("🚀 ~ io.on ~ data:", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.leave(socket.project?._id.toString());
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
