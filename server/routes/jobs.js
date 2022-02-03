const express = require("express");
const router = express.Router();
const mailService = require("../services/mailService");

// ../api/jobs/notifications
router.post("/notifications", async (req, res) => {
  mailService.sendJobNotification();
});

module.exports = router;
