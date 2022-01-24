const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    city: String,
    linkedin: String,
    status: String,
    role: String,
    jobs: [{ type: Schema.Types.ObjectId, ref: 'job' }]
})

const User = mongoose.model("User", userSchema)
module.exports = User