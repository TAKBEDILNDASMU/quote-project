// import all package
require("dotenv").config();
const jwt = require("jsonwebtoken");
const passport = require("passport");

// import user schema
const User = require("../models/userSchema");

// function for creating token with jwt
const maxAge = 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN, {
    expiresIn: maxAge,
  });
};

// controller that render register.ejs
module.exports.get_register = (req, res) => {
  res.render("register");
};

// controller that render login.ejs
module.exports.get_login = (req, res) => {
  res.render("login");
};

// controller that render home.ejs
module.exports.get_home = (req, res) => {
  res.render("home");
};

// controller that make a post request for registering user into database
module.exports.post_register = async (req, res) => {
  try {
    // create new user to database
    const { username, password, name } = req.body;
    const user = await User.register(new User({ username, name }), password);

    // create token and save to the user's browser
    const token = createToken(user._id);
    res.cookie("jwt", token, { maxAge: maxAge * 1000, httpOnly: true });
    res.status(201).json({ user: user.id });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

module.exports.post_login = async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    res.json({ success: false, message: "Email was not given!" });
  } else if (!password) {
    res.json({ success: false, message: "Password was not given !" });
  } else {
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        res.json({ err });
      } else {
        if (!user) {
          res.json({ success: false, message: "Email or password don't match" });
        } else {
          const token = createToken(user._id);
          res.cookie("jwt", token, { maxAge: maxAge * 1000, httpOnly: true });
          res.status(200).json({ user: user.id });
        }
      }
    })(req, res);
  }
};

// for log out user
module.exports.get_logout = (req, res) => {
  // replace jwt
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
};
