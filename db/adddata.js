const mongoose = require('mongoose')
const user = require('../server/models/user')
const job = require('../server/models/job')
const interview = require('../server/models/interview')
const Cohort = require('../server/models/cohort')
const Course = require('../server/models/course')
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/elevationJobManager', { useNewUrlParser: true })

const coursesData = require("./courses.json")

const Admin = {
    name: "ofri",
    email: "ofri@mykcloud.com",
    password: "ofri123",
    phone: "0599555700 ",
    city: "unknown",
    linkedin: "https://www.linkedin.com/in/ofri-meir-weizman/",
    status: "",
    role: "admin",
    jobs: []
}
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
        jobs: []
    })
    tempUser.save()
}

const addMockData = function () {
    let cohortsArray = []
    let usersArray = []
    let jobsArray = []
    let interviewsArray = []

    coursesData.forEach(course => {
        course.cohorts.forEach(cohort => {
            cohort.users.forEach(user => {
                user.jobs.forEach(job => {
                    interviewsArray = addInterviews(job.interviews)
                })
                jobsArray = addJobs(user.jobs, interviewsArray)
            })
            usersArray = addUsers(cohort.users, jobsArray)
        })
        cohortsArray = addCohorts(course.cohorts, usersArray)
        addCourse(course.title, cohortsArray)
    });
    addMockAdmin(Admin)
}

const addUsers = function (userData, jobsArray) {
    let tempUsers = []
    userData.forEach(userObj => {
        const tempUser = new user({
            name: userObj.name,
            email: userObj.email,
            password: userObj.password,
            phone: userObj.phone,
            city: userObj.city,
            linkedin: userObj.linkedin,
            status: userObj.status,
            role: userObj.role,
            jobs: jobsArray
        })
        tempUser.save()
        tempUsers.push(tempUser)
    })
    return tempUsers
}

const addJobs = function (jobData, interviewsArray) {
    let tempJobs = []
    jobData.forEach(jobObj => {
        const tempJob = new job({
            title: jobObj.title,
            link: jobObj.link,
            date: jobObj.date,
            company: jobObj.company,
            status: jobObj.status,
            interviews: interviewsArray
        })
        tempJob.save()
        tempJobs.push(tempJob)
    })
    return tempJobs
}

const addInterviews = function (interviewData) {
    let tempArray = []
    interviewData.forEach(interviewObj => {
        const tempInterview = new interview({
            description: interviewObj.description,
            type: interviewObj.type,
            status: interviewObj.status,
            date: interviewObj.date,
            link: interviewObj.link
        })
        tempInterview.save()
        tempArray.push(tempInterview)
    })
    return tempArray
}

const addCourse = function (courseTitle, cohortsArray) {
    const tempCourse = new Course({
        title: courseTitle,
        cohorts: cohortsArray
    })
    tempCourse.save()
}

const addCohorts = function (cohortsData, usersArray) {
    let tempCohorts = []
    cohortsData.forEach(cohort => {
        const tempCohort = new Cohort({
            name: cohort.name,
            start_date: cohort.start_date,
            users: usersArray
        })
        tempCohort.save()
        tempCohorts.push(tempCohort)
    })
    return tempCohorts
}

addMockData()