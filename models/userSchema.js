// import all the package that we need
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// Create the user schema
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter your username"],
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
});

// hash password useing passport-local-mongoose plugin
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Users", UserSchema);
