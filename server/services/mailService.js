const nodemailer = require("nodemailer");
require("dotenv").config();

const CLIENT_URI = "localhost:3000";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS
  }
});

const sendMail = async (to, subject, text, html) => {
  const message = { from: process.env.AUTH_EMAIL, to, subject, text, html };
  const res = await transporter.sendMail(message);
  if (res.err) return { error: err };
  return { msg: "Email sent: " + res };
};

const sendVerificationEmail = async (req, user, emailToken) => {
  const mailSubject = "Confirm Your Account";
  const verificationLink = `http://${CLIENT_URI}/verify-user?emailToken=${emailToken}`;
  const mailText = `
    Hello ${user.name},

    Glad to have you on board.

    Please confirm your email address by clicking the link below:

    ${verificationLink}
    `;
  const mailHTML = `
  <h1>Hello ${user.name},</h1>
  <p>Glad to have you on board.</p>
  <p>Please confirm your email address by clicking the link below:</p>
  <a href=${verificationLink}>Verify your account</a>
  `;

  const result = await sendMail(user.email, mailSubject, mailText, mailHTML);

  return { result };
};

const sendJobNotification = async (studentMail, job) => {
  const mailSubject = "You received job suggest from Elevation";
  const mailText = `
  Title: ${job.title || " "}

  Company: ${job.company || " "}
  
  Description: ${job.description || " "}
  
  Link: ${job.link}
  `;
  const mailHTML = `
  <h4>Title: ${job.title || " "}</h4>

  <h5>Company: ${job.company || " "} </h5>

  <h5>Description: </h5>
  <p>${job.description || " "}</p>
  
  <h5>Link: <a href="${job.link || " "}"> Job Link </a></h5>
  `;

  const result = await sendMail(studentMail, mailSubject, mailText, mailHTML);

  return { result };
};

module.exports = { sendMail, sendVerificationEmail, sendJobNotification };
