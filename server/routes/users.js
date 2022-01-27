const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async function (req, res) {
  const { name, email, password, phone, city, linkedin, status } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    res.status(400).send("User already registered.");
    return null;
  }

  user = new User({
    name,
    email,
    password,
    phone,
    city,
    linkedin,
    status,
    role: "student",
    jobs: []
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
