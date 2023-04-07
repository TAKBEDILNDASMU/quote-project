// require the package
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");

// require the user model
const User = require("./models/userSchema");

// require all routes
const authRoute = require("./routes/auth");
const quoteRoute = require("./routes/quote");

// run your express app
const app = express();

// view engine
app.set("view engine", "ejs");

// body-parser, cookie parser, and express static
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// passport initialize and session
app.use(passport.initialize());
app.use(passport.session());

// serialize and deserialize user in database
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// define passport strategies
const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy(User.authenticate()));

// database connection
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log("database connected"))
  .catch((e) => console.log(e));

// use all route that we require
app.use(authRoute);
app.use(quoteRoute);

// run the server
app.listen(3500, () => console.log("Server up and running on port 3500"));
