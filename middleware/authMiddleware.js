require("dotenv").config();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// for protecting routes if user doesn't have correct jwt, they will redirected to login page
module.exports.protect_route = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_TOKEN, (err, decodedToken) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

// for persisting the user if they already logged in, they can't go to register or login page
module.exports.auth_user = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_TOKEN, (err, decodedToken) => {
      if (err) {
        next();
      } else {
        res.redirect("/quote");
      }
    });
  } else {
    next();
  }
};
