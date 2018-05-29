require("dotenv").config();
var mailgun = require("mailgun-js");
var appSettings = require('../appSettings');

var api_key = process.env.PRIVATE_KEY;
var DOMAIN = process.env.DOMAIN_;

var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

sendInv = (usrData) => {
        var rootPath = appSettings.getSetting('urlPrefix') || 'http://localhost:3001/';
        var fullPath = require('url').resolve(rootPath, '/tenant/activate/' + usrData.activationCode);

        // console.log(usrData);
        var data = {
            from: 'barbarits@comcast.net',
            to: `${usrData.email}`,
            subject: 'Welcome to 132 Chapel',
            text: `Hi ${usrData.fullname},
Welcome to your new office space. We are happy that you are with us. Let us know if there is anything we can do.
You can communicate with us through the facility website. To get started using the website, you will need to visit the following page:

    Link: ${fullPath}

Visit this page to activate your account. I am sure you will find online access easy and useful and it
will facilitate efficient communication and transactions.
Thank you for joining us. We know you will be happy here.

Regards,
Clark McDermith,
Building Manager`
        };
        mailgun.messages().send(data, function (error, body) {
            if(error){
                console.log(`${error} Unable to send email to ${usrData.activationCode} @ ${usrData.email}`);
            } else {
                console.log(`email to ${usrData.activationCode} successfully sent to ${usrData.email}`);
            }
        });
    }

    sendACHVerification = (usrData) => {
        var verifyUrl = require('url').resolve(appSettings.getSetting('urlPrefix'), '/tenant/verifyach/');
        var data = {
            from: 'barbarits@comcast.net',
            to: `${usrData.email}`,
            subject: 'ACH Verification',
            text: `Hi ${usrData.fullname},
In 1-2 busniness days, you'll receive 2 small (Typicially less than a dollar) deposits from us. Once you recieve them, enter them here at the link below:

Link: ${verifyUrl}

Regards,
Clark McDermith,
Building Manager`
        }
        mailgun.messages().send(data, function (error, body) {
            if(error){
                console.log(`${error} Unable to send ACH Verification email to ${usrData.fullname}  @ ${usrData.email}`);
            } else {
                console.log(`ACH Verification email to ${usrData.fullname}  successfully sent to ${usrData.email}`);
            }
        });
    }

    

module.exports = { sendInv: sendInv, sendACHVerification: sendACHVerification };