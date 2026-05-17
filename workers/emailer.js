const nodemailer = require("nodemailer");

async function sendMail(email,keyword) {
try{
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:"pv0971712@gmail.com",
      pass: "ailr ncex yzoh yqnq"
    }
  });

  const mailOptions = {
    from: "pv0971712@gmail.com",
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