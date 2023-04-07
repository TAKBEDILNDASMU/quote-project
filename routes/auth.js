// import all package
const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const passport = require("passport");

// import all controller
const { get_login, get_register, post_login, post_register, get_logout } = require("../controllers/authController");

// import all middleware
const { auth_user } = require("../middleware/authMiddleware");

// create passport local strategy
passport.use(User.createStrategy());

// serialize and deserialize user
passport.serializeUser(function (user, done) {
  process.nextTick(function () {
    done(null, user);
  });
});
passport.deserializeUser(function (user, done) {
  process.nextTick(function () {
    return done(null, user);
  });
});

// get and post auth route using controller we imported above

router.get("/register", auth_user, get_register);

router.get("/login", auth_user, get_login);

router.post("/register", post_register);

router.post("/login", post_login);

router.get("/logout", get_logout);

module.exports = router;
