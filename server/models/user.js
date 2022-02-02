const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new Schema({
  name: String,
  email: String,
  emailToken: String,
  password: String,
  phone: String,
  city: String,
  linkedin: String,
  status: String,
  role: String,
  jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
  isVerified: Boolean
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, role: this.role, isVerified: this.isVerified },
    process.env.JWT_PRIVATE_KEY
  );
};

const User = mongoose.model("User", userSchema);

module.exports = User;
