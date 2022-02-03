const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const mailService = require("../services/mailService");

router.post("/", auth, async (req, res) => {
  const { to, subject, text, html } = req.body;
  console.log("🚀 ~ file: mail.js ~ line 8 ~ router.post ~ req.body", req.body);

  const mailResult = await mailService.sendMail(to, subject, text, html);
  res.send(mailResult);
});

module.exports = router;
