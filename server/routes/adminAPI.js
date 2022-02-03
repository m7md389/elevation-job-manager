const express = require("express");
const router = express.Router();
const moment = require("moment");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const crypto = require("crypto");

const mailService = require("../services/mailService");

const Course = require("../models/course");
const Cohort = require("../models/cohort");
const Users = require("../models/user");
const Jobs = require("../models/job");
const Interviews = require("../models/interview");

router.post("/temp-users", async function (req, res) {
  const { name, email, password, phone, city, linkedin, status, cohortId } =
    req.body;

  let user = await Users.findOne({ email });
  if (user) {
    res.status(400).send({ error: "User already registered." });
    return null;
  }

  const emailToken = crypto.randomUUID();
  user = new Users({
    name,
    email,
    emailToken,
    password,
    phone,
    city,
    linkedin,
    status,
    isVerified: false,
    role: "student",
    jobs: [],
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();

  await mailService.sendVerificationEmail(req, user, emailToken);

  Cohort.findByIdAndUpdate(
    { _id: cohortId },
    { $push: { users: user } },
    { new: true }
  ).exec((error, result) => {
    if (error) {
    }
  });

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name"]));
});

router.get("/courses", async (req, res) => {
  const courses = Course.find({})
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
        res.status(400).send({ error: "error getting data" });
        return null;
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
              let selectedUser = {
                id: interview._id,
                name: user.name,
                course: course.title,
                email: user.email,
                phone: user.phone,
                date: interview.date,
                type: interview.type,
                user_id: user._id,
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

  const courses = Course.find({})
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
        res.status(400).send({ error: "error getting data" });
        return null;
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
    res.status(400).send({ error: "Missing ID" });
    return null;
  }
  Course.findOne({ title: courseName })
    .populate({
      path: "cohorts",
      populate: {
        path: "users",
      },
    })
    .exec(function (ex, course) {
      if (ex) {
        res.send({ error: ex });
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

  Users.findOneAndUpdate(
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
        res.status(400).send({ error: "error adding job" });
        return null;
      }
      res.send(user);
    });
});

router.put("/jobs", async function (req, res) {
  let tempJob = req.body;
  let myDate = moment(tempJob.date).format("L");
  let jobToEdit = await Jobs.findById({ _id: tempJob.jobId });

  Jobs.findOneAndUpdate(
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
        res.status(400).send({ error: "error updating job" });
        return null;
      }
      res.send(user);
    });
});

router.delete("/jobs", async function (req, res) {
  let jobId = req.body;
  await Jobs.findByIdAndDelete({ _id: jobId.jobId }).exec((ex, user) => {
    if (ex) {
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

  Jobs.findOneAndUpdate(
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
        res.status(400).send({ error: "error adding job" });
        return null;
      }
      res.send(job);
    });
});

router.post("/courses", async (req, res) => {
  let courseName = req.body.title;
  if (!courseName) {
    res.status(400).send({ error: "Missing Name" });
    return null;
  }

  let checkExist = await Course.find({ title: courseName });
  if (checkExist.length) {
    res.status(400).send({ error: "Course already Exist" });
    return null;
  }
  let newCourse = new Course({
    title: courseName,
    cohorts: [],
  });
  await newCourse.save();
  res.redirect("/courses/names");
});

router.delete("/courses", (req, res) => {
  let courseName = req.body.title;
  if (!courseName) {
    res.status(400).send({ error: "missed name" });
    return null;
  }

  Course.findOneAndDelete({ title: courseName }).exec((ex, result) => {
    if (ex) {
      res.status(400).send({ error: "missed name" });
      return null;
    }
  });
  res.end();
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
      res.status(400).send({ error: "error updating interview" });
      return null;
    }
    res.send(interView);
  });
});

router.delete("/jobs/Interviews", async function (req, res) {
  let interviewId = req.body;
  await Interviews.findByIdAndDelete({ _id: interviewId.interviewId }).exec(
    function (ex, interview) {
      if (ex) {
        res.send({ error: "error deleting Interview" });
      }
      res.send(interview);
    }
  );
});

router.get("/jobs/:userId?", function (req, res) {
  Users.findById({ _id: req.params.userId })
    .select("-password")
    .populate({
      path: "jobs",
      populate: {
        path: "interviews",
      },
    })
    .exec(function (ex, user) {
      res.send(user);
    });
});

router.get("/users/:userId", async function (req, res) {
  Users.findById({ _id: req.params.userId }).exec(function (err, user) {
    if (err) {
      res.status(400).send({ error: "error getting user" });
      return null;
    }
    res.send(user);
  });
});

router.put("/users", async function (req, res) {
  let updatedUserData = req.body;
  let user = await Users.find({ _id: updatedUserData.userId });
  Users.findOneAndUpdate(
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
      res.status(400).send({ error: "error updating user" });
      return null;
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

  Course.findByIdAndUpdate(
    { _id: cohortToAdd.courseId },
    {
      $push: {
        cohorts: newCohort,
      },
    },
    { new: true }
  ).exec(function (ex, newCohort) {
    if (ex) {
      res.send({ error: "can't add cohort" });
    }
    res.send(newCohort);
  });
});

router.delete("/courses/cohorts", async function (req, res) {
  let { cohortId } = req.body;
  Cohort.findByIdAndDelete({ _id: cohortId }).exec((err, deletedCohort) => {
    if (err) {
      res.send({ error: "can't delete Cohort" });
    }
    res.send(deletedCohort);
  });
});

router.put("/courses/cohorts", async function (req, res) {
  let { newName, newDate, courseId, cohortId } = req.body.data;
  let myDate = moment(newDate).format("L");
  Course.findById({ _id: courseId })
    .populate({
      path: "cohorts",
    })
    .exec((err, course) => {
      if (err) {
        res.status(400).send({ error: "Course not Exist" });
        return null;
      }
    });
  Cohort.findByIdAndUpdate(
    { _id: cohortId },
    {
      $set: {
        name: newName,
        start_date: myDate,
      },
    },
    { new: true }
  ).exec((err, updatedCohort) => {
    if (err) {
      res.send({ error: "can't update Cohort" });
      return null;
    }
    res.send(updatedCohort);
  });
});

router.put("/courses", async function (req, res) {
  let { title, newTitle } = req.body.data;
  let checkExist = await Course.find({ title: newTitle });
  if (checkExist.length > 0) {
    res.status(400).send({ error: "Course already Exist" });
    return null;
  }
  Course.findOneAndUpdate(
    { title: title },
    {
      $set: {
        title: newTitle,
      },
    },
    { new: true }
  ).exec(function (err, newCourse) {
    if (err) {
      res.status(400).send({ error: "Error updating course" });
    }
    res.send(newCourse);
  });
});

module.exports = router;
