const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require("jsonwebtoken")

const JWT_KEY = "PRIVATE_KEY!";

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    city: String,
    linkedin: String,
    status: String,
    role: String,
    jobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }]
})

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, role: this.role }, JWT_KEY);
}

const User = mongoose.model("User", userSchema)

module.exports = User