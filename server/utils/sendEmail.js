import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define the email options
  const mailOptions = {
    from: `"Lumina AI Coach" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
