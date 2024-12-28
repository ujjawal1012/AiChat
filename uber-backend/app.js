const dotenv = require("dotenv");

dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const userRoute = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/db");
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/users", userRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
