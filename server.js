const express = require("express");
const app = express();
require("dotenv").config();

const cors = require("cors");
const usersRoute = require("./routes/user.authenticate.route");
const tasksRoute = require("./routes/tasks.route");
const authMiddleware = require("./middlewares/auth.middleware");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT,POST,DELETE,GET,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");
  next();
});

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`listening on ${process.env.PORT}`);
});

app.use("/users", usersRoute);
app.use("/tasks", authMiddleware, tasksRoute);
