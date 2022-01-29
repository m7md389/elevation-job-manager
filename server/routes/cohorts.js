const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const Cohort = require("../models/cohort");

router.get("/", (req, res) => {
  Course.find({})
    .populate({ path: "cohorts" })
    .exec(function (err, courses) {
      if (err) {
        res.send("err");
      }
      res.send(courses);
    });
});

module.exports = router;
