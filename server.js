const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 5000;
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, 
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

app.post('/api/contact', (req, res) => {
    const contactData = req.body;

    const mailOptions = {
        from: contactData.email, 
        to: process.env.SMTP_MAIL, 
        subject: 'New Contact Form Submission',
        text: `
            name: ${contactData.name}
            PhoneNumber: ${contactData.PhoneNumber}
            email: ${contactData.email}
            country: ${contactData.country}
            budget: ${contactData.budget}
            services: ${contactData.services.join(', ')}
            projectDetails: ${contactData.projectDetails}
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email.' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Contact data received and email sent successfully!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
