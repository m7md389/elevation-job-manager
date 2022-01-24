const express = require('express')
const router = express.Router()
// const Transaction = require('../models/transactions')
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
    let myDate = moment(tempJob.date).format('l')
    let user = await users.find({ _id: tempJob.id })
    let newJob = new jobs({
        title: tempJob.title,
        link: process.link,
        date: myDate,
        company: tempJob.company,
        status: tempJob.status,
        interviews: [],
    })
    newJob.save()

    await Student.findOneAndUpdate({ name: req.params.studentName }, {
        $push: { Processes: newProcess },
        $set: { ProcessesCounter: counter }
    }, { new: true })
        .populate({
            path: 'Processes',
            populate: {
                path: 'Interviews'
            }
        })
        .exec(function (err, students) {
            res.send(students)

        })
})

router.get('/jobs', async function (req, res) {
    let userJobs = await users.find({ _id: req.body.userId }).populate({
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