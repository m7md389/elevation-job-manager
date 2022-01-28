const express = require("express");
const router = express.Router();
const moment = require("moment");
const Course = require("../models/course");
const Cohort = require("../models/cohort");
const Users = require("../models/user");
const Jobs = require("../models/job");
const Interviews = require("../models/interview");

router.get("/courses", async (req, res) => {
  const courses = await Course.find({})
    .populate({
      path: "cohorts",
      populate: {
        path: "users",
        populate: {
          path: "jobs",
          populate: {
            path: "interviews",
          },
        },
      },
    })
    .exec(function (err, courses) {
      if (err) {
        console.log(err);
      }
      res.send(courses);
    });
});

const findInterviewsInRange = async (sDate, eDate, courses) => {
  let users = [];
  var endDate = moment(eDate);
  var startDate = moment(sDate);
  endDate.set({ hour: 23, minute: 59, second: 59, millisecond: 59 });
  startDate.set({
    hour: 23,
    minute: 59,
    second: 59,
    millisecond: 59,
    day: moment(sDate).day() - 1,
  });
  await courses.forEach((course) => {
    course.cohorts.forEach((cohort) => {
      cohort.users.forEach((user) => {
        user.jobs.forEach((job) => {
          job.interviews.forEach((interview) => {
            if (moment(interview.date).isBetween(startDate, endDate)) {
              console.log(
                "between: " +
                  moment(interview.date).format("DD/MM/YYYY , h:mm:ss") +
                  " start: " +
                  startDate.format("DD/MM/YYYY , h:mm:ss") +
                  " end: " +
                  endDate.format("DD/MM/YYYY , h:mm:ss")
              );
              let selectedUser = {
                id: user._id,
                name: user.name,
                course: course.title,
                email: user.email,
                phone: user.phone,
                date: interview.date,
                type: interview.type,
              };
              users.push(selectedUser);
            }
          });
        });
      });
    });
  });
  return users;
};

router.get("/courses/:startDate/:endDate", async (req, res) => {
  let startDate = req.params.startDate;
  let endDate = req.params.endDate;

  const courses = await Course.find({})
    .populate({
      path: "cohorts",
      populate: {
        path: "users",
        populate: {
          path: "jobs",
          populate: {
            path: "interviews",
          },
        },
      },
    })
    .exec(async function (err, courses) {
      let data;
      if (err) {
        console.log(err);
      } else {
        data = await findInterviewsInRange(startDate, endDate, courses);
      }
      res.send(data);
    });
});

router.get("/courses/names", async function (req, res) {
  let courses = await Course.find({}).populate({
    path: "cohorts",
    populate: {
      path: "users",
    },
  });
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
        path: "users",
      },
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
  let myDate = moment(tempJob.date).format("L");
  let newJob = new Jobs({
    title: tempJob.title,
    link: tempJob.link,
    date: myDate,
    company: tempJob.company,
    status: tempJob.status,
    interviews: [],
  });
  newJob.save();

  await Users.findOneAndUpdate(
    { _id: tempJob.userId },
    {
      $push: { jobs: newJob },
    },
    { new: true }
  )
    .populate({
      path: "jobs",
    })
    .exec(function (err, user) {
      if (err) {
        console.log(err);
      }
      res.send(user);
    });
});

router.put("/jobs", async function (req, res) {
  let tempJob = req.body;
  let myDate = moment(tempJob.date).format("L");
  let jobToEdit = await Jobs.findById({ _id: tempJob.jobId });

  await Jobs.findOneAndUpdate(
    { _id: tempJob.jobId },
    {
      $set: {
        title: tempJob.title || jobToEdit.title,
        link: tempJob.link || jobToEdit.link,
        date: myDate,
        status: tempJob.status || jobToEdit.status,
        company: tempJob.company || jobToEdit.company,
        status: tempJob.status || jobToEdit.status,
      },
    },
    { new: true }
  )
    .populate({
      path: "jobs",
    })
    .exec(function (err, user) {
      if (err) {
        console.log(err);
      }
      res.send(user);
    });
});

router.delete("/jobs", async function (req, res) {
  let jobId = req.body;
  await Jobs.findByIdAndDelete({ _id: jobId.jobId }).exec((err, user) => {
    if (err) {
      res.send({ error: "error deleting Job" });
    }
    res.send(user);
  });
});

router.post("/jobs/Interviews", async function (req, res) {
  let tempInterview = req.body;
  let myDate = moment(tempInterview.date).format("L");
  let newInterview = new Interviews({
    description: tempInterview.description,
    type: tempInterview.type,
    status: tempInterview.status,
    date: myDate,
    link: tempInterview.link,
  });
  newInterview.save();

  await Jobs.findOneAndUpdate(
    { _id: tempInterview.jobId },
    {
      $push: { interviews: newInterview },
    },
    { new: true }
  )
    .populate({
      path: "interviews",
    })
    .exec(function (err, job) {
      if (err) {
        console.log(err);
      }
      res.send(job);
    });
});

router.post("/courses", async (req, res) => {
  let courseName = req.body.title;
  if (!courseName) {
    res.status(400).send("missed name");
    return null;
  }

  let newCourse = new Course({
    title: courseName,
  });
  await newCourse.save();
  res.redirect("/courses/names");
});

router.put("/jobs/Interviews", async function (req, res) {
  let tempInterview = req.body;
  let myDate = moment(tempInterview.date).format("L");
  let interview = await Interviews.findById({ _id: tempInterview.interviewId });
  await Interviews.findOneAndUpdate(
    { _id: tempInterview.interviewId },
    {
      $set: {
        description: tempInterview.description || interview.description,
        type: tempInterview.type || interview.type,
        date: myDate,
        status: tempInterview.status || interview.status,
        link: tempInterview.link || interview.link,
      },
    },
    { new: true }
  ).exec(function (err, interView) {
    if (err) {
      console.log(err);
    }
    res.send(interView);
  });
});

router.delete("/jobs/Interviews", async function (req, res) {
  let interviewId = req.body;
  await Interviews.findByIdAndDelete({ _id: interviewId.interviewId }).exec(
    function (err, interview) {
      if (err) {
        res.send({ error: "error deleting Interview" });
      }
      res.send(interview);
    }
  );
});

router.get("/jobs/:userId?", async function (req, res) {
  await Users.findById({ _id: req.params.userId })
    .populate({
      path: "jobs",
      populate: {
        path: "interviews",
      },
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
        password: updatedPasswordData.newPassword,
      },
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
  await Users.findOneAndUpdate(
    { _id: updatedUserData.userId },
    {
      $set: {
        name: updatedUserData.name || user.name,
        email: updatedUserData.email || user.email,
        phone: updatedUserData.phone || user.phone,
        city: updatedUserData.city || user.city,
        linkedin: updatedUserData.linkedin || user.linkedin,
        status: updatedUserData.status || user.status,
      },
    },
    { new: true }
  ).exec(function (err, newUser) {
    if (err) {
      console.log(err);
    }
    res.send(newUser);
  });
});

router.post("/users", async function (req, res) {
  router.post("/login", async function (req, res) {
    const { name, password } = req.body;
    const user = await Users.find({ name, password });
  });
});

router.post("/courses/cohort", async (req, res) => {
  let cohortToAdd = req.body;
  if (!cohortToAdd.courseId) {
    res.status(400).send({ error: "Cant find course" });
    return null;
  }

  let myDate = moment(cohortToAdd.start_date).format("L");
  let newCohort = new Cohort({
    name: cohortToAdd.name,
    start_date: myDate,
    users: [],
  });

  newCohort.save();

  await Course.findByIdAndUpdate(
    { _id: cohortToAdd.courseId },
    {
      $push: {
        cohorts: newCohort,
      },
    },
    { new: true }
  ).exec(function (err, newCohort) {
    if (err) {
      res.send({ error: "can't add cohort" });
    }
    res.send(newCohort);
  });
});

module.exports = router;
