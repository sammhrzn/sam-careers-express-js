require('dotenv').config();
const nodemailer = require('nodemailer');
const bodyparser = require('body-parser');;

const express = require('express');
const path = require('path');
const JOBS = require('./jobs');
const mustacheExpress = require('mustache-express');

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.get('/', (req, res) => {
    // res.send('Hello Sam!');
    // res.sendFile(path.join(__dirname, 'pages/index.html'));
    // res.render('index', { jobs: JOBS, companyName: "Jovian" });
    res.render('index', { jobs: JOBS, companyName: "Jovian" });
});

app.get('/jobs/:id', (req, res) => {
    console.log('req.params', req.params);
    const id = req.params.id;
    const matchedJob = JOBS.find(job => job.id.toString() === id);
    console.log('matchedJob', matchedJob);
    res.render('job', { job: matchedJob });
});


console.log(process.env.EMAIL_ID, process.env.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', //SMTP host
    port: 465,   //SMTP port
    secure: true, 
    auth: {
        user: process.env.EMÄIL_ID,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.post('/jobs/:id/apply', (req, res) => {
    // console.log(req.body);
    // res.send('Application received!');
    const { name, email, phone, dob, position, coverletter } = req.body;
    // console.log('name', name);

    const id = req.params.id;
    const matchedJob = JOBS.find(job => job.id.toString() === id);

    console.log('matchedJob', matchedJob);
    console.log('req.body', req.body);


    const mailOptions = {
        from: process.env.EMAIL_ID,
        to: process.env.EMAIL_ID, // Change this to the email you want to send to
        subject: `New Application for ${matchedJob.title}`,
        html: `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Date of Birth:</strong> ${dob}</p>
            <p><strong>Cover Letter:</strong> ${coverletter}</p>
         `
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).render('applied');
        } else {
        console.log('Email sent:', info.response);
        res.status(200).send('Email sent successfully!');
        }
    });

});


        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.log('Server running on https://localhost:${port}');
        });