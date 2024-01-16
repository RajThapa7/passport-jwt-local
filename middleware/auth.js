var User = require("../models/user");
var passport = require("passport");
var passportJWT = require("passport-jwt");
var config = require("../config.js");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;

var params = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

module.exports = function () {
  var strategy = new Strategy(params, async function (payload, done) {
    try {
      if (payload.expire <= Date.now()) {
        return done(new Error("TokenExpired"), null);
      }
      const user = await User.findById(payload.id);
      return done(null, user);
    } catch (error) {
      return done(new Error("UserNotFound"), null);
    }
  });

  passport.use(strategy);

  return {
    initialize: function () {
      return passport.initialize();
    },
  };
};
