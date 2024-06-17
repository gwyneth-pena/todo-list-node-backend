const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const taskController = require("../controllers/tasks.controller");

router.post(
  "/add",
  [
    body("task").trim().notEmpty(),
    body("date_to_be_accomplished").trim().notEmpty(),
    body("time_to_be_accomplished").trim().notEmpty(),
    body("user_id").trim().notEmpty(),
    body("time_to_start").trim().notEmpty(),
    body("completed").notEmpty(),
  ],
  taskController.addTask
);

router.delete("/delete/:id", taskController.deleteTask);

router.patch("/update", taskController.updateTask);

router.patch("/updateCompleted", taskController.updateCompleted);

router.get("/", taskController.getTasks);

module.exports = router;
