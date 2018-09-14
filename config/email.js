var nodemailer = require('nodemailer'); //Send emails
var config = require('./config.js'); //Configuration

//Configure mail
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mail.email,
        pass: config.mail.password
    }
});

module.exports = {
    sendTextEmail: function(email, subject, body) {
        var mailOptions = {
            from: config.mail.email,
            to: email,
            subject: subject,
            text: body
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log('Email '+ error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },
    sendHtmlEmail: function(email, subject, body) {
        var mailOptions = {
            from: config.mail.email,
            to: email,
            subject: subject,
            html: body
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log('Email '+ error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
};