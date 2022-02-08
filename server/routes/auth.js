const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.post("/", async function (req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.send({ error: "Invalid email or password." });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.send({ error: "Invalid email or password." });

  if (!user.isVerified) return res.send({ error: "Non verified account." });

  const token = user.generateAuthToken();

  res.send(token);
});

module.exports = router;
