const express = require("express");
const router = express.Router();
const authController = require("../controllers/authentication.controller");
const { body } = require("express-validator");
const { userModel } = require("../models/users.model");

router.post(
  "/signup",
  [
    body("email").trim().isEmail().normalizeEmail().notEmpty(),
    body("first_name").trim().notEmpty(),
    body("last_name").trim().notEmpty(),
    body("password").trim().notEmpty().isLength({ min: 7 }),
    body("confirm_password")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation not successful.");
        }
        return true;
      })
      .isLength({ min: 7 }),
  ],
  authController.signUp
);

router.post(
  "/login",
  [
    body("email").notEmpty().trim().normalizeEmail(),
    body("password").notEmpty().trim(),
  ],
  authController.login
);

router.get("/currentUser/:id", authController.getCurrentUser);

module.exports = router;
