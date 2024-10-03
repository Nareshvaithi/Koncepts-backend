const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const app = express();
const PORT = 5555;

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

const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
};

app.post('/api/contact', async (req, res, next) => {
    try {
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

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Contact data received and email sent successfully!' });
    } catch (error) {
        next(error);
    }
});

app.post('/api/carrier', async (req, res, next) => {
    try {
        const carrierData = req.body;

        const mailOptions = {
            from: carrierData.Email,
            to: process.env.SMTP_MAIL,
            subject: 'New Carrier Form Submission',
            text: `
                FirstName: ${carrierData.FirstName}
                LastName: ${carrierData.LastName}
                Email: ${carrierData.Email}
                PhoneNumber: ${carrierData.PhoneNumber}
                CollegeName: ${carrierData.CollegeName}
                services: ${carrierData.datails.join(', ')}
                Department: ${carrierData.Department}
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Carrier data received and email sent successfully!' });
    } catch (error) {
        next(error);
    }
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
