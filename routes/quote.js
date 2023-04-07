const express = require("express");
const router = express.Router();

// import the quote schema
const Quote = require("../models/quoteSchema");

// import all controller that needed
const { get_home } = require("../controllers/authController");

// import all middleware that needed
const { protect_route, auth_user } = require("../middleware/authMiddleware");

router.get("/", auth_user, (req, res) => {
  res.render("home", { endPoint: "home" });
});

router.get("/quote", async (req, res) => {
  // variable for validating if the user is logged or not, so we can provide the information to the frontend
  const token = req.cookies.jwt;

  // get all the quote from the database so we can display it
  const quotes = await Quote.find();
  res.render("quote", { quotes, isAuth: token, endPoint: "quote" });
});

router.get("/submit", protect_route, (req, res) => {
  res.render("submit", { endPoint: "submit" });
});

router.post("/submit", async (req, res) => {
  try {
    const quote = new Quote({
      quote: req.body.quote,
      bgColor: req.body.bgColor.substring(1),
    });
    const saveQuote = await quote.save();
    res.status(201).json({ saveQuote, success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
});

router.post("/quotes/like", async (req, res) => {
  try {
    // find the quote and than update the like attribute
    const post = await Quote.findById(req.body.likesBtn);
    const update = await post.updateOne({ likes: post.likes + 1 });
    res.redirect("/quote");
  } catch (err) {
    res.json({ err });
  }
});

module.exports = router;
