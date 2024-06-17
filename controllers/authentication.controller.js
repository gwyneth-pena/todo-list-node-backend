const { userModel } = require("../models/users.model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");

function sendEmailConfirmation(body) {
  var emailTransporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "gwenpenadev@gmail.com",
      pass: "iloveYOUJESUS143",
    },
  });

  emailTransporter.sendMail(
    {
      from: "Gwyneth Pena <gwenpenadev@gmail.com>",
      to: body.email,
      subject: `Welcome to Plan It: Personal To-Do List!`,
      html: `<h3 style="color:#66B386;">Hi ${body.first_name} ${body.last_name}!</h3>
              <p >You are now registed to Plan It: Personal To-Do List.</p>
              <br>
              <p>Thank you so much for signing up! We hope that you will tackle all your tasks. We are with you on this journey towards productivity.</p>
              <br>
              <p>"The secret of getting ahead is getting started."- Mark Twain</p>
              <br>
              <p> If you have any concerns,suggestions or inquiries,
              please reply or send me an email at <a href='mailto:gwenpenadev@gmail.com'>gwenpenadev@gmail.com</a>.
              </p>
        `,
    },
    (err, info) => {
      if (err) {
        console.log(err);
      }
    }
  );
}

exports.signUp = async (req, res) => {
  const errors = validationResult(req);
  if (errors.errors.length > 0) {
    res.status(400).json(errors);
    return;
  }

  var userToBeAdded = await userModel.addUser(req.body);

  if (userToBeAdded.msg.error) {
    res.status(400).json({
      msg: { existingEmailError: userToBeAdded.msg.error },
      data: req.body,
    });
  } else {
    sendEmailConfirmation(req.body);
    res.status(201).json({ msg: userToBeAdded.msg });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  const userLoginObject = req.body;
  const privateKey = process.env.privateKey;

  if (errors.errors.length > 0) {
    res.status(400).json(errors);
  }

  try {
    const dbUserEmail = await userModel.getEmailAndCheckForMatch(
      userLoginObject.email
    );

    if (dbUserEmail !== undefined) {
      const dbPassword = await userModel.getPasswordFromDb(dbUserEmail);

      var matched = await bcrypt.compare(userLoginObject.password, dbPassword);

      if (matched) {
        var userIdFromDb = await userModel.getUserId(dbUserEmail);

        var token = jwt.sign({ user_id: userIdFromDb }, privateKey, {
          expiresIn: "1h",
        });
        res.status(200).json({ token, userIdFromDb });
      } else {
        res
          .status(400)
          .json({ msg: { loginError: "Wrong email or password." } });
      }
    } else {
      res.status(400).json({ msg: { loginError: "Wrong email or password." } });
    }
  } catch (err) {
    throw err;
  }
};

exports.getCurrentUser = async (req, res) => {
  var user = await userModel.getCurrentUser(req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400).json({ msg: "User doesn't exist." });
  }
};
