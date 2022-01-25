const express = require('express')
const router = express.Router()
const moment = require('moment')
const course = require('../models/course')
const Cohort = require('../models/cohort')
const users = require('../models/user')
const jobs = require('../models/job')
const interviews = require('../models/interview')

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

    await users.findOneAndUpdate({ _id: tempJob.userId }, {
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
    await users.find({ _id: req.params.userId }).populate({
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
    let userData = await users.findById({ _id: req.params.userId })
        .exec(function (err, user) {
            if (err) { console.log(err); }
            res.send(user)
        })
})

router.put('/users/password', async function (req, res) {
    let updatedPasswordData = req.body
    let user = await users.findById({ _id: updatedPasswordData.userId })
    if (user.password != updatedPasswordData.currentPassword) {
        res.send({ error: "Current password not match the current password" })
        return
    }
    await users.findOneAndUpdate({ _id: updatedPasswordData.userId }, {
        $set: {
            password: updatedPasswordData.newPassword
        }
    }, { new: true })
    .exec(function (err, updatedUser) {
        if (err) {
            res.send({error : "error updating password"});
        }
        res.send(updatedUser)
    })
})

router.put('/users', async function (req, res) {
    let updatedUserData = req.body
    let user = await users.find({ _id: updatedUserData.userId })
    console.log(user);
    await users.findOneAndUpdate({ _id: updatedUserData.userId }, {
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