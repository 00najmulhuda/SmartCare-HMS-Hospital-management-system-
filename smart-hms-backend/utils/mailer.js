const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// verify connection
transporter.verify((err, success) => {
  if (err) {
    console.log("⚠️ Mailer verification failed:", err.message);
  } else {
    console.log("📧 Mailer connected successfully");
  }
});

module.exports = transporter;
