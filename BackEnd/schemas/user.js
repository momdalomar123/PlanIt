const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "The password must be 8 characters or longer"],
  },
  style: {
    profilePicture: {
      type: String,
      default: "",
    },
  },
});
module.exports = mongoose.model("User", userSchema);
