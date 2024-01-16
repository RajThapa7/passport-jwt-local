const User = require("../models/user");
const config = require("../config.js");
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt");

exports.login = async function (req, res) {
  try {
    const user = await User.findOne({ username: req.body.username });
    const payload = {
      id: user._id,
      expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
    };

    var token = jwt.encode(payload, config.jwtSecret);

    res.json({ token: token, msg: "logged in successfully" });
  } catch (error) {
    console.log(error);
  }
};

exports.register = async function (req, res) {
  try {
    const user = await User.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
      email: req.body.email,
    });
    res.json({ user, msg: "Successfully created" });
  } catch (error) {
    console.log(error);
  }
};

exports.profile = function (req, res) {
  res.json({
    message: "You made it to the secured profile",
    user: req.user,
  });
};
