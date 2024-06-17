const db = require("../config/db");

module.exports.taskModel = class TaskModel {
  constructor() {}

  static addTask(body) {
    db.query(
      "INSERT into tasks (user_id,task,time_to_be_accomplished,date_to_be_accomplished,time_to_start,completed) values(?,?,?,?,?,?)",
      [
        body.user_id,
        body.task,
        body.time_to_be_accomplished,
        body.date_to_be_accomplished,
        body.time_to_start,
        body.completed,
      ]
    );
    return { msg: "Task added!" };
  }

  static getTasks(userId) {
    var promise = new Promise((resolve, reject) => {
      db.query(
        "SELECT * from tasks where user_id=?",
        [userId],
        (err, results) => {
          if (results) {
            resolve(results);
          } else if (err) {
            reject({ msg: { error: "There is an error." } });
          }
        }
      );
    });

    return promise;
  }

  static deleteTask(task) {
    var promise = new Promise((resolve, reject) => {
      db.query(
        "DELETE  from tasks where id=?",
        [task],

        (err) => {
          return reject({ msg: { error: "There is an error." } });
        }
      );

      return resolve({ msg: "Task deleted!" });
    });

    return promise;
  }

  static updateTask(updatedTask) {
    db.query(
      "UPDATE tasks SET task=?,time_to_be_accomplished=?,date_to_be_accomplished=?,time_to_start=? where id=?",
      [
        updatedTask.task,
        updatedTask.time_to_be_accomplished,
        updatedTask.date_to_be_accomplished,
        updatedTask.time_to_start,
        updatedTask.id,
      ]
    );
    return { msg: "Task updated!" };
  }

  static updateCompleted(values) {
    db.query("UPDATE tasks SET completed=? where id=?", [
      values.completed,
      values.id,
    ]);
    return { msg: "Task updated!" };
  }

  static checkTask(id) {
    var promise = new Promise((resolve, reject) => {
      db.query("SELECT * from tasks where id=?", [id], (err, results) => {
        if (results) {
          resolve(results);
        } else if (err) {
          reject({ msg: { error: "There is an error." } });
        }
      });
    });

    return promise;
  }
};
