import { config } from "dotenv";
config();
import express, { json, urlencoded } from "express";
const app = express();
import cors from "cors";
import morgan from "morgan";
import userRoute from "./routes/user.routes.js";
import projectRoute from "./routes/project.routes.js";
import aiRoute from './routes/ai.routes.js'
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
connectDB();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/users", userRoute);
app.use("/projects", projectRoute);
app.use('/ai',aiRoute)

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
