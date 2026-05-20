const nodemailer = require("nodemailer");

async function sendMail(email,keyword) {
try{
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:process.env.EMAIL_USER ,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER ,
    to: email,
    subject: "Hello",
    text: ` Keyword found: ${keyword}`
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Email sent:", info.response);
  return true;
} catch (error) {
  console.error("Error sending email:", error);
  return false;
}
}

module.exports = { sendMail };