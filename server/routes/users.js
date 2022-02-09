const express = require("express");
const router = express.Router();

const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const User = require("../models/user");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.put("/verify/:emailToken", async (req, res) => {
  const { emailToken } = req.params;
  if (!emailToken) return res.send({ error: "No email token provided." });

  const user = await User.findOne({ emailToken }).exec();
  if (!user) return res.send({ error: "Not valid link." });
  User.findByIdAndUpdate(
    { _id: user._id },
    { $set: { isVerified: true } }
  ).exec((err, result) => {
    if (err) {
      return res.send({ error: err.message });
    }
    res.send({ msg: "User verified successfully." });
  });
});

router.post("/", async function (req, res) {
  const { name, email, password, phone, city, linkedin, status, cohortId } =
    req.body;

  let user = await User.findOne({ email });
  if (user) {
    res.send({ error: "User already registered." });
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
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.post("/admin", auth, admin, async function (req, res) {
  const { name, email, password } = req.body;

  let admin = await User.findOne({ email });
  if (admin) {
    res.send({ error: "User already registered." });
    return null;
  }

  admin = new User({
    name,
    email,
    password,
    role: "admin"
  });

  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(password, salt);
  await admin.save();

  res.send({ msg: "Admin added successfully" });
});

router.put("/password", async function (req, res) {
  const { userId, currentPassword, newPassword } = req.body;
  let user = await User.findById({ _id: userId });
  const validPassword = await bcrypt.compare(currentPassword, user.password);
  if (!validPassword) {
    return res.send({
      error: "Current password not match the current password"
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  User.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        password: hashedPassword
      }
    },
    { new: true }
  ).exec(function (err, updatedUser) {
    if (err) {
      res.send({ error: "error updating password" });
    }
    res.send(updatedUser);
  });
});

module.exports = router;
