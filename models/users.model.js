const db = require("../config/db");
const bcrypt = require("bcryptjs");

module.exports.userModel = class UserModel {
  constructor() {}

  static checkIfEmailExistsOrNot(email) {
    const promise = new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE email=? ",
        [email],
        (err, results) => {
          if (err) {
            console.log(err);
            reject(true);
          }
          if (results) {
            if (results.length > 0) {
              reject(true);
            }
            resolve(false);
          }
        }
      );
    })
      .then((success) => {
        return success;
      })
      .catch((err) => {
        return err;
      });

    return promise;
  }

  static async addUser(userObject) {
    if (await this.checkIfEmailExistsOrNot(userObject.email)) {
      return { msg: { error: "Email already exists.Try another one." } };
    }

    const hashedPassword = bcrypt.hashSync(userObject.password, 12);
    db.query(
      "INSERT INTO users (email,password,first_name,last_name) VALUES(?,?,?,?)",
      [
        userObject.email,
        hashedPassword,
        userObject.first_name,
        userObject.last_name,
      ]
    );
    return { msg: "User added!" };
  }

  static getEmailAndCheckForMatch(email) {
    const promise = new Promise((resolve, reject) => {
      db.query("SELECT * from users WHERE email=?", [email], (err, results) => {
        if (err) {
          reject("Email does not exist.");
        } else if (results.length > 0) {
          resolve(results[0].email);
        } else {
          reject();
        }
      });
    })
      .then((success) => {
        return success;
      })
      .catch((err) => {
        return err;
      });

    return promise;
  }

  static getCurrentUser(id) {
    const promise = new Promise((resolve, reject) => {
      db.query("SELECT * from users WHERE id=?", [id], (err, results) => {
        if (err) {
          reject("User does not exist.");
        }
        if (results.length) {
          resolve({
            userName: {
              first_name: results[0].first_name,
              last_name: results[0].last_name,
            },
          });
        } else {
          reject();
        }
      });
    })
      .then((success) => {
        return success;
      })
      .catch((err) => {
        return err;
      });

    return promise;
  }

  static getPasswordFromDb(email) {
    const promise = new Promise((resolve, reject) => {
      db.query(
        "SELECT password from users WHERE email=?",
        [email],
        (err, results) => {
          if (err) {
            reject("There is an error");
          }
          if (results) {
            resolve(results[0].password);
          }
        }
      );
    })
      .then((success) => {
        return success;
      })
      .catch((err) => {
        return err;
      });

    return promise;
  }

  static getUserId(email) {
    const promise = new Promise((resolve, reject) => {
      db.query(
        "SELECT id from users WHERE email=?",
        [email],
        (err, results) => {
          if (err) {
            reject("There is an error.");
          }
          if (results.length > 0) {
            resolve(results[0].id);
          }
        }
      );
    })
      .then((success) => {
        return success;
      })
      .catch((err) => {
        return err;
      });

    return promise;
  }
};
