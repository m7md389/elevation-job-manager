const express = require('express')
const router = express.Router()
// const Transaction = require('../models/transactions')

router.get('/transaction', async (req, res) => {
    
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