const { validationResult } = require("express-validator");
const { taskModel } = require("../models/tasks.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const privateKey = process.env.privateKey;

exports.addTask = (req, res) => {
  var errors = validationResult(req);
  if (errors.errors.length > 0) {
    res.status(400).send(errors.errors);
  } else {
    var msg = taskModel.addTask(req.body);
    res.send(msg);
  }
};

exports.getTasks = async (req, res) => {
  var authorizationToken = req.headers.authorization.split(" ")[1];
  var verified = jwt.verify(authorizationToken, privateKey);
  if (verified) {
    var taskList = await taskModel.getTasks(verified.user_id);
    res.status(200).json({ taskList, user_id: verified.user_id });
  } else {
    res
      .status(401)
      .json({ msg: { unauthorizedAccessError: "Access Denied!" } });
  }
};

exports.updateCompleted = async (req, res) => {
  var existingTask = await taskModel.checkTask(req.body.id);
  if (existingTask.length > 0) {
    var updated = taskModel.updateCompleted(req.body);
    res.status(200).json(updated);
  } else {
    res.status(400).json({ error: { msg: "Task doesn't exist!" } });
  }
};

exports.deleteTask = async (req, res) => {
  var existingTask = await taskModel.checkTask(req.params.id);
  if (existingTask.length > 0) {
    taskModel.deleteTask(req.params.id);
    res.status(200).json({ msg: "Task deleted." });
  } else {
    res.status(400).json({ error: { msg: "Task doesn't exist!" } });
  }
};

exports.updateTask = async (req, res) => {
  var existingTask = await taskModel.checkTask(req.body.id);
  if (existingTask.length > 0) {
    var updated = taskModel.updateTask(req.body);
    res.status(200).json(updated);
  } else {
    res.status(400).json({ error: { msg: "Task doesn't exist!" } });
  }
};
