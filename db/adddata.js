const mongoose = require("mongoose");
const user = require("../server/models/user");
const Job = require("../server/models/job");
const interview = require("../server/models/interview");
const Cohort = require("../server/models/cohort");
const Course = require("../server/models/course");
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/elevationJobManager",
  { useNewUrlParser: true }
);

const coursesData = require("./courses.json");
const User = require("../server/models/user");

const Admin = {
  name: "ofri",
  email: "ofri@mykcloud.com",
  password: "ofri123",
  phone: "0599555700 ",
  city: "unknown",
  linkedin: "https://www.linkedin.com/in/ofri-meir-weizman/",
  status: "",
  role: "admin",
  jobs: [],
};
const addMockAdmin = function (Admin) {
  const tempUser = new user({
    name: Admin.name,
    email: Admin.email,
    password: Admin.password,
    phone: Admin.phone,
    city: Admin.city,
    linkedin: Admin.linkedin,
    status: Admin.status,
    role: Admin.role,
    jobs: [],
  });
  tempUser.save();
};

const addMockData = function () {
  let cohortsArray = [];
  let usersArray = [];
  let jobsArray = [];

  coursesData.forEach((course) => {
    course.cohorts.forEach((cohort) => {
      cohort.users.forEach((user) => {
        user.jobs.forEach((job) => {
          jobsArray.push(addInterviews(job));
        });
        usersArray.push(addJobs(user, jobsArray));
        jobsArray = [];
      });
      cohortsArray.push(addUsers(cohort, usersArray));
      usersArray = [];
    });
    addCourse(course, cohortsArray);
    cohortsArray = [];
  });
  addMockAdmin(Admin);
};

const addInterviews = function (job) {
  let tempArray = [];
  job.interviews.forEach((interviewObj) => {
    const tempInterview = new interview({
      description: interviewObj.description,
      type: interviewObj.type,
      status: interviewObj.status,
      date: interviewObj.date,
      link: interviewObj.link,
    });
    tempInterview.save();
    tempArray.push(tempInterview);
  });
  const tempJob = new Job({
    title: job.title,
    link: job.link,
    date: job.date,
    company: job.company,
    status: job.status,
    interviews: tempArray,
  });
  tempJob.save();
  return tempJob;
};

const addJobs = function (user, jobData) {
  const tempUser = new User({
    name: user.name,
    email: user.email,
    password: user.password,
    phone: user.phone,
    city: user.city,
    linkedin: user.linkedin,
    status: user.status,
    role: 'student',
    jobs: jobData,
  });
  tempUser.save();
  return tempUser;
};

const addUsers = function (cohort, usersData) {
  const tempCohort = new Cohort({
    name: cohort.name,
    start_date: cohort.start_date,
    users: usersData,
  });
  tempCohort.save();
  return tempCohort;
};

const addCourse = function (course, cohortsArray) {
  const tempCourse = new Course({
    title: course.title,
    cohorts: cohortsArray,
  });
  tempCourse.save();
};

addMockData();
