require("dotenv").config();
const nodemailer = require("nodemailer");

const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars"); // Template engine to compile HTML with variables

const verifyEmail = (email, token) => {
  // Import the Nodemailer library

  const templatePath = path.join(__dirname, "template.hbs");
  const templateSource = fs.readFileSync(templatePath, "utf-8");
  const template = handlebars.compile(templateSource);

  const sendToHTML = template({
    token: encodeURIComponent(token),
    verified: `http://localhost:5173/verify/${encodeURIComponent(token)}`,
  });

  // Create a transporter object
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // use false for STARTTLS; true for SSL on port 465
    auth: {
      user: process.env.USER_NAME,
      pass: process.env.USER_PASSWORD,
    },
  });

  // Configure the mailoptions object
  const mailOptions = {
    from: process.env.USER_NAME,
    to: email,
    subject: "Sending Email using Node.js",
    text: "That was easy!",
    html: sendToHTML,
  };

  // Send the email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};

module.exports = verifyEmail;
