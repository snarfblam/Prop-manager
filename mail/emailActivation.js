const appSettings = require('../appSettings');
const api_key = appSettings.getSetting('PRIVATE_KEY');
const DOMAIN = appSettings.getSetting('DOMAIN');
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: DOMAIN });
const sendMail = require('./sendMail');



var businessName = "132 Chapel St LLC"  //TODO: this should be updated from the settings tab or the .env file

sendInv = (usrData) => {
    var rootPath = appSettings.getSetting('urlPrefix') || 'http://localhost:3001/';
    var fullPath = require('url').resolve(rootPath, '/tenant/activate/' + usrData.activationCode);

    return sendMail({
        subject: `Welcome to ${businessName}`,
        body: `Hi ${usrData.fullname},

            Welcome to ${businessName}! We are happy that you are with us and we hope you are enjoying your office in downtown Portsmouth. You can communicate with us through the ${businessName} website. To get started using the website, you will need to activate your account by clicking the link below:

            ${fullPath}

            After activating your account you will be able to make rent payments and submit maintenance requests. Please let us know if you have any questions. 

            Thank you,
            ${businessName}`,
        to: usrData

    });
}

sendACHVerification = (usrData) => {
    var verifyUrl = require('url').resolve(appSettings.getSetting('urlPrefix'), '/tenant/verifyach/');
    return sendMail({
        to: usrData,
        subject: `ACH Verification for ${businessName}`,
        body: `Hi ${usrData.fullname},

            In 1-2 business days, you'll receive 2 small deposits from "${businessName}". Once you recieve them, enter them here at the link below:

            Link: ${verifyUrl}

            Thank you,
            ${businessName}`        
    });
}

module.exports = { sendInv: sendInv, sendACHVerification: sendACHVerification };