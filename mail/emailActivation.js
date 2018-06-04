require("dotenv").config();
var mailgun = require("mailgun-js");
var appSettings = require('../appSettings');

var api_key = process.env.PRIVATE_KEY;
var DOMAIN = process.env.DOMAIN_;

var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

sendInv = (usrData) => {
        var rootPath = appSettings.getSetting('urlPrefix') || 'http://localhost:3001/';
        var fullPath = require('url').resolve(rootPath, '/tenant/activate/' + usrData.activationCode);
        var data = {
            from: process.env.EMAILFROM || 'noreply@132chapelst.com',
            to: `${usrData.email}`,
            subject: 'Welcome to 132 Chapel St.',
            text: `Hi ${usrData.fullname},

            Welcome to 132 Chapel St! We are happy that you are with us and we hope you are enjoying your office in downtown Portsmouth. You can communicate with us through the 132 Chapel St website. To get started using the website, you will need to activate your account by clicking the link below:

            ${fullPath}

            After activating your account you will be able to make rent payments and submit maintenance requests. Please let us know if you have any questions. 

            Thank you,
            132 Chapel St LLC`
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
            from: process.env.EMAILFROM || 'admin@site.com',
            to: `${usrData.email}`,
            subject: 'ACH Verification',
            text: `Hi ${usrData.fullname},

            In 1-2 busniness days, you'll receive 2 small deposits from "132 Chapel St. LLC". Once you recieve them, enter them here at the link below:

            Link: ${verifyUrl}

            Thank you,
            132 Chapel St LLC`
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