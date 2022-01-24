const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
    name: String,
    cohorts: [{ type: Schema.Types.ObjectId, ref: 'Cohort' }]
})

const Course = mongoose.model("Course", courseSchema)
module.exports = Course