require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const { verify } = require("crypto");

const otpEmail = (email, token, otp, otpExpiry) => {
  try {
    const templatePath = path.join(__dirname, "templateOTP.hbs");

    // Check if the template file exists
    if (!fs.existsSync(templatePath)) {
      console.error("Email template not found at:", templatePath);
      return;
    }

    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = handlebars.compile(templateSource);

    const sendToHTML = template({
      token: encodeURIComponent(token),
      otp: otp,
      otpExpiry: otpExpiry.toLocaleString(), // Make it readable
      otpVerifyLink: `http://localhost:8000/api/reset-password?token=${encodeURIComponent(
        token
      )}`,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_NAME,
        pass: process.env.USER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.USER_NAME,
      to: email,
      subject: "Your OTP Verification Code",
      text: `Your OTP is ${otp}, it expires at ${otpExpiry.toLocaleString()}`,
      html: sendToHTML,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error.message);
      } else {
        console.log("Email sent successfully:", info.response);
      }
    });
  } catch (err) {
    console.error("Unexpected error in otpEmail:", err.message);
  }
};

module.exports = otpEmail;
