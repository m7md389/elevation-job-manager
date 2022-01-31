const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const Cohort = require("../models/cohort");



router.get("/courses/:id", async (req, res) => {
  let userId = req.params.id;
  console.log(userId);

  await Course.find()
    .populate({
      path: "cohorts",
      populate: {
        path: "users",
      },
    })
    .exec(function (err, courses) {
      if (err) {
        console.log(err);
      }

      let userInfo;
      courses.forEach((course) => {
        course.cohorts.forEach((cohort) => {
          cohort.users.forEach((user) => {
            if (user._id == userId) {
              userInfo = {
                course: course.title,
                cohort: cohort.name,
              };
            }
          });
        });
      });
      if (userInfo) res.send(userInfo);
      else res.send({ error: "user id not found" });
    });
});

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
