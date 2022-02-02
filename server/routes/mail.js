const express = require("express");
const router = express.Router();
const mail = require("../services/mailService");

router.post("/", auth, async (req, res) => {
  const { to, subject, text, html } = req.body;
  const mailResult = await mail.sendMail(to, subject, text, html);
  res.send(mailResult);
});
