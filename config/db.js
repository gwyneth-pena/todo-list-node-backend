const mysql = require("mysql");
require("dotenv").config();

const dbOptions = {
  host: process.env.dbHost,
  database: process.env.database,
  user: process.env.dbUser,
  password: process.env.dbPassword,
};

const db = mysql.createConnection(dbOptions);

db.connect((err) => {
  if (err) throw err;
  var sql1 =
    "CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, email VARCHAR(200), first_name VARCHAR(200), last_name VARCHAR(200), password VARCHAR(200), PRIMARY KEY (id));";

  addTable(sql1, "users");

  var sql2 =
    "CREATE TABLE IF NOT EXISTS tasks (id INT NOT NULL AUTO_INCREMENT, user_id INT, task VARCHAR(255), date_to_be_accomplished DATETIME, time_to_start VARCHAR(100), time_to_be_accomplished VARCHAR(100), completed BOOLEAN DEFAULT false, FOREIGN KEY (user_id) REFERENCES users(id), PRIMARY KEY (id));";

  addTable(sql2, "tasks");
});

const addTable = (sql, tableName) => {
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log(`table ${tableName.toUpperCase()} created`);
  });
};

module.exports = db;
