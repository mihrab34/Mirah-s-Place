require("./appModel");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  phone_number: String, 
  password: String,
  role: {type: String, default: "user"}
});

module.exports = mongoose.model("User", UserSchema);
