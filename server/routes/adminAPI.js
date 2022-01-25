const express = require('express')
const router = express.Router()
const moment = require('moment')
const Course = require('../models/course')
const Cohort = require('../models/cohort')
const Users = require('../models/user')
const Jobs = require('../models/job')
const Interviews = require('../models/interview')

router.get('/courses', async (req, res) => {

    const courses = await course.find({}).populate({
        path: 'cohorts',
        populate: {
            path: 'users',
            populate: {
                path: 'jobs',
                populate: {
                    path: 'interviews'
                }
            }
        }
    })
        .exec(function (err, courses) {
            if (err) {
                console.log(err);
            }
            res.send(courses)
        });
})

router.get('/courses/:courseId', (req, res) => {
    const { courseId } = req.params;
    if (!courseId) {
        res.status(400).send("missed id");
        return null;
    }
    Course.findById({ _id: courseId }).populate({
        path: 'cohorts',
        populate: {
            path: 'users'
        }
    })
        .exec(function (err, course) {
            if (err) {
                res.send({ error: err });
                return null;
            }
            res.send(course);
        });
})

router.post('/jobs', async function (req, res) {
    let tempJob = req.body
    let myDate = moment(tempJob.date).format('L')
    let newJob = new jobs({
        title: tempJob.title,
        link: process.link,
        date: myDate,
        company: tempJob.company,
        status: tempJob.status,
        interviews: []
    })
    newJob.save()

    await Users.findOneAndUpdate({ _id: tempJob.userId }, {
        $push: { jobs: newJob },
    }, { new: true })
        .populate({
            path: 'jobs'
        })
        .exec(function (err, user) {
            if (err) {
                console.log(err);
            }
            res.send(user)
        })
})

router.get('/jobs/:userId?', async function (req, res) {
    await Users.find({ _id: req.params.userId }).populate({
        path: 'jobs',
        populate: {
            path: 'interviews'
        }
    })
        .exec(function (err, user) {
            res.send(user[0].jobs)
        })
})

router.get('/users/:userId', async function (req, res) {
    let userData = await Users.findById({ _id: req.params.userId })
        .exec(function (err, user) {
            if (err) { console.log(err); }
            res.send(user)
        })
})

router.put('/users/password', async function (req, res) {
    let updatedPasswordData = req.body
    let user = await Users.findById({ _id: updatedPasswordData.userId })
    if (user.password != updatedPasswordData.password) {
        res.send({ err: "Current password not match the current password" })
        return
    }
    await Users.findOneAndUpdate({ _id: updatedPasswordData.userId }, {
        $set: {
            password: updatedPasswordData.newPassword
        }
    }, { new: true })
        .exec(function (err, updatedUser) {
            if (err) {
                console.log(err);
            }
            res.send(updatedUser)
        })
})

router.put('/users', async function (req, res) {
    let updatedUserData = req.body
    let user = await Users.find({ _id: updatedUserData.userId })
    console.log(user);
    await Users.findOneAndUpdate({ _id: updatedUserData.userId }, {
        $set: {
            name: updatedUserData.name || user.name,
            email: updatedUserData.email || user.email,
            phone: updatedUserData.phone || user.phone,
            city: updatedUserData.city || user.city,
            linkedin: updatedUserData.linkedin || user.linkedin,
            status: updatedUserData.status || user.status
        }
    }, { new: true })
        .exec(function (err, newUser) {
            if (err) {
                console.log(err);
            }
            res.send(newUser)
        })
})

module.exports = router