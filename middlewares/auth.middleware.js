const jwt = require("jsonwebtoken");
require("dotenv").config();
const privateKey = process.env.privateKey;

module.exports = (req, res, next) => {
  var authorizationToken = req.headers.authorization.split(" ")[1];
  try {
    jwt.verify(authorizationToken, privateKey);

    next();
  } catch (err) {
    res
      .status(401)
      .json({ msg: { unauthorizedAccessError: "Access Denied!" } });
    return;
  }
};
