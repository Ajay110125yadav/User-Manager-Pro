const nodemailer = require("nodemailer");

const sendEmail = async (req, res) => {
  // USE ENV VARS: EMAIL_HOST (OPTIONAL), EMAIL_PORT, EMAIL_USER, EMAIL_PASS, FROM_EMAIL
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smpt.gmail.com",
    port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  const mailOptions = {
    from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  const info = await transfer.sendMail(mailOptions);
  return info;
}

module.exports = sendEmail;