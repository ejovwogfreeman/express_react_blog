const nodemailer = require("nodemailer");

// Configure the email transport with Gmail's SMTP settings explicitly
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Gmail SMTP server
  port: 587, // TLS port for Gmail
  auth: {
    user: process.env.EMAIL, // Your Gmail address
    pass: process.env.EMAIL_PASS, // App password generated from Google
  },
});

function sendEmail(to, subject, message) {
  const mailOptions = {
    from: "Ejovwo Godbless (ejovwogfreeman007@gmail.com)", // Sender address
    to: to, // Recipient email address
    subject: subject, // Subject line
    html: message, // HTML body
  };

  return transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log("Email sent: ", info.response);
      return info;
    })
    .catch((err) => {
      console.error("Failed to send email:", err);
      throw err; // Propagate the error for the caller to handle
    });
}

function sendRegistrationEmail(to, username) {
  const subject = "Welcome to Our Platform!";
  const message = `
        <h1>Welcome, ${username}!</h1>
        <p>Thank you for registering on our platform. We're excited to have you onboard!</p>
        <p>Please <a href='http://localhost:8000/api/users/verify-account/${to}'>click here</a> to verify your account or click here http://localhost:8000/api/users/verify-account/${to}</p>
        <p>Enjoy your experience with us.</p>
    `;
  return sendEmail(to, subject, message);
}

function sendLoginNotificationEmail(to) {
  const subject = "Login Notification";
  const message = `
        <h1>Login Alert</h1>
        <p>We noticed a login to your account. If this was you, no action is required. Otherwise, please secure your account immediately.</p>
    `;
  return sendEmail(to, subject, message);
}

function sendResetPasswordEmail(to, resetLink) {
  const subject = "Password Reset Request";
  const message = `
        <h1>Reset Your Password</h1>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
    `;
  return sendEmail(to, subject, message);
}

// Export only the functions that need to be used externally
module.exports = {
  sendRegistrationEmail,
  sendLoginNotificationEmail,
  sendResetPasswordEmail,
};
