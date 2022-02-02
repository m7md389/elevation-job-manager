const express = require("express");
const api = require("./routes/adminAPI");
const auth = require("./routes/auth");
const courses = require("./routes/courses");
const cohorts = require("./routes/cohorts");
const users = require("./routes/users");
const jobs = require("./routes/jobs");
const mail = require("./routes/mail");
const interviews = require("./routes/interviews");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const path = require("path");
app.use(cookieParser());
mongoose.connect(process.env.MONGODB_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "node_modules")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  next();
});

app.use(cors());
app.use("/api/auth", auth);
// app.use('/api/courses', courses);
app.use("/api/cohorts", cohorts);
app.use("/api/users", users);
app.use("/api/mail", mail);
// app.use('/api/jobs', jobs);
// app.use('/api/interviews', interviews);
app.use("/api", api);

app.listen(process.env.PORT, function () {
  console.log("server is listening");
});
