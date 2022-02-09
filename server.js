const express = require("express");
const api = require("./server/routes/adminAPI");
const auth = require("./server/routes/auth");
const courses = require("./server/routes/courses");
const cohorts = require("./server/routes/cohorts");
const users = require("./server/routes/users");
// const mail = require("./server/routes/mail");
const interviews = require("./server/routes/interviews");
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

// app.use(express.static(path.join(__dirname, 'build')));

app.use(cors());
app.use("/api/auth", auth);
app.use("/api/cohorts", cohorts);
app.use("/api/users", users);
app.use("/api", api);


// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.listen(process.env.PORT || '3001' , function () {
  console.log("server is listening");
});
