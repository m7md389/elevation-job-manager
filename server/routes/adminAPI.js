const express = require('express')
const router = express.Router()
const moment = require('moment')
const Course = require('../models/course')
const Cohort = require('../models/cohort')
const Users = require('../models/user')
const Jobs = require('../models/job')
const Interviews = require('../models/interview')

router.get('/courses', async (req, res) => {
    const courses = await Course.find({}).populate({
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
    let myDate = moment(tempJob.date).format('l')
    let newJob = new Jobs({
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

router.get('/jobs', async function (req, res) {
    let userJobs = await Users.find({ _id: req.body.userId }).populate({
        path: 'jobs',
        populate: {
            path: 'interviews'
        }
    })
        .exec(function (err, user) {
            res.send(user[0].jobs)
        })

})

// router.get('/transactions', async (req, res) => {
//     let result = await Transaction.find({})
//     res.send(result)
// })


// router.delete('/transaction', async (req, res) => {
//     let id = req.body.id
//     let result = await Transaction.findByIdAndDelete(id)
//     console.log(result);

//     // res.redirect(307, '/transactions')
//     res.send(await Transaction.find({}))
// })

// router.get('/group', async (req, res) => {
//     let result = await Transaction.aggregate(
//         [
//             {
//                 $group:
//                 {
//                     _id: "$category", sum: { $sum: "$amount" }
//                 }
//             }
//         ]
//     )

//     res.send(result)
// })


// router.get('/sum', async (req, res) => {
//     let result = await Transaction.aggregate(
//         [
//             {
//                 $group:
//                 {
//                     _id: null, balance: { $sum: "$amount" }
//                 }
//             }
//         ]
//     )

//     res.send(result)
// })


module.exports = router