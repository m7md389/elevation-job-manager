const express = require("express");
const router = express.Router();
const moment = require("moment");
const Job = require("../models/job");
const mailService = require("../services/mailService");

// ../api/jobs/notifications
router.post("/notifications", async (req, res) => {});

module.exports = router;
