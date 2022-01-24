const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cohortSchema = new Schema({
    name: String,
    start_date: String,
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

const Cohort = mongoose.model("Cohort", cohortSchema)
module.exports = Cohort