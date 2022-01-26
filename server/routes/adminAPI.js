const express = require("express");
const router = express.Router();
const moment = require("moment");
const Course = require("../models/course");
const Cohort = require("../models/cohort");
const Users = require("../models/user");
const Jobs = require("../models/job");
const Interviews = require("../models/interview");

router.get("/courses", async (req, res) => {
  const courses = await course
    .find({})
    .populate({
      path: "cohorts",
      populate: {
        path: "users",
        populate: {
          path: "jobs",
          populate: {
            path: "interviews"
          }
        }
      }
    })
    .exec(function (err, courses) {
      if (err) {
        console.log(err);
      }
      res.send(courses);
    });
});

router.get("/courses/names", async function (req, res) {
  let courses = await Course.find({}).populate({
    path: "cohorts",
    populate: {
      path: "users"
    }
  });

  console.log(courses);
  let data = [];
  courses.map((c) => {
    let course = { title: c.title };
    let studNum = 0,
      workingStudCount = 0;

    c.cohorts.map((cohort) => {
      studNum += cohort.users.length;
      cohort.users.map((s) => {
        if (s.status == "working") workingStudCount++;
      });
    });
    course["studNum"] = studNum;
    course["working"] = (workingStudCount / studNum) * 100;
    data.push(course);
  });

  res.send(data);
});

router.get("/courses/:courseName", (req, res) => {
  const { courseName } = req.params;
  if (!courseName) {
    res.status(400).send("missed id");
    return null;
  }
  Course.findOne({ title: courseName })
    .populate({
      path: "cohorts",
      populate: {
        path: "users"
      }
    })
    .exec(function (err, course) {
      if (err) {
        res.send({ error: err });
        return null;
      }
      res.send(course);
    });
});

router.post("/jobs", async function (req, res) {
  let tempJob = req.body;
  console.log(tempJob);
  let myDate = moment(tempJob.date).format("L");
  let newJob = new Jobs({
    title: tempJob.title,
    link: process.link,
    date: myDate,
    company: tempJob.company,
    status: "applied",
    interviews: []
  });
  newJob.save();

  await Users.findOneAndUpdate(
    { _id: tempJob.userId },
    {
      $push: { jobs: newJob }
    },
    { new: true }
  )
    .populate({
      path: "jobs"
    })
    .exec(function (err, user) {
      if (err) {
        console.log(err);
      }
      res.send(user);
    });
});

router.get("/jobs/:userId?", async function (req, res) {
  await Users.findById({ _id: req.params.userId })
    .populate({
      path: "jobs",
      populate: {
        path: "interviews"
      }
    })
    .exec(function (err, user) {
      res.send(user.jobs);
    });
});

router.get("/users/:userId", async function (req, res) {
  let userData = await Users.findById({ _id: req.params.userId }).exec(
    function (err, user) {
      if (err) {
        console.log(err);
      }
      res.send(user);
    }
  );
});

router.put("/users/password", async function (req, res) {
  let updatedPasswordData = req.body;
  let user = await users.findById({ _id: updatedPasswordData.userId });
  if (user.password != updatedPasswordData.currentPassword) {
    res.send({ error: "Current password not match the current password" });
    return;
  }
  await Users.findOneAndUpdate(
    { _id: updatedPasswordData.userId },
    {
      $set: {
        password: updatedPasswordData.newPassword
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

router.put("/users", async function (req, res) {
  let updatedUserData = req.body;
  let user = await Users.find({ _id: updatedUserData.userId });
  console.log(user);
  await Users.findOneAndUpdate(
    { _id: updatedUserData.userId },
    {
      $set: {
        name: updatedUserData.name || user.name,
        email: updatedUserData.email || user.email,
        phone: updatedUserData.phone || user.phone,
        city: updatedUserData.city || user.city,
        linkedin: updatedUserData.linkedin || user.linkedin,
        status: updatedUserData.status || user.status
      }
    },
    { new: true }
  ).exec(function (err, newUser) {
    if (err) {
      console.log(err);
    }
    res.send(newUser);
  });
});

module.exports = router;
