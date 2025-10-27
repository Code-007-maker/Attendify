import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendTeacherWelcomeEmail = async (toEmail, name, password) => {
  const mailOptions = {
    from: `"Smart Attendance System" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Welcome to Smart Attendance System 🎓",
    html: `
      <h3>Hello ${name},</h3>
      <p>Welcome to the Smart Attendance System!</p>
      <p>Your account has been created successfully. Below are your login credentials:</p>
      <ul>
        <li><b>Email:</b> ${toEmail}</li>
        <li><b>Password:</b> ${password}</li>
      </ul>
      <p>Please change your password after your first login.</p>
      <p>Regards,<br>Admin Team<br><b>Smart Attendance System</b></p>
    `
  };

  await transporter.sendMail(mailOptions);
};
