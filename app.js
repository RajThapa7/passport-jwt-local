const express = require("express");
const app = express();
require("dotenv").config();

const User = require("./models/user");
const accountController = require("./controllers/accountController");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const passport = require("passport");
const bcrypt = require("bcrypt");

app.use(bodyParser.urlencoded({ extended: false }));

const mongoose = require("mongoose");

passport.use(
  new LocalStrategy(async function verify(username, password, done) {
    await User.findOne({ username: username })
      .then((user) => {
        if (!user)
          return done(null, false, { message: "No user with that email" });
        if (bcrypt.compareSync(password, user.password)) {
          return done(null, user);
        } else return done(null, false, { message: "wrong password" });
      })
      .catch((err) => {
        done(err);
      });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});

app.use(passport.initialize());
require("./middleware/auth.js")();

app.get("/", (req, res) => {
  res.send("Introduction JWT Auth");
});
app.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  accountController.profile
);
app.post(
  "/login",
  passport.authenticate("local", {
    session: false,
  }),
  accountController.login
);
app.post("/register", accountController.register);

mongoose.connect(process.env.DB_URI).then(() => {
  console.log("Database connected successfully");
  app.listen(4000, () => {
    console.log("Server started.");
  });
});
