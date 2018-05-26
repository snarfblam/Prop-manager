require("dotenv").config();
var mailgun = require("mailgun-js");

var api_key = process.env.PRIVATE_KEY;
var DOMAIN = process.env.DOMAIN_;

var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

    sendInv= (usrData) => {
        // console.log(usrData);
        var data = {
            from: 'barbarits@comcast.net',
            to: `${usrData.email}`,
            subject: 'Welcome to 132 Chapel',
            text: `Hi ${usrData.fullname},
Welcome to your new office space. We are happy that you are with us. Let us know if there is anything we can do.
You can communicate with us through the facility website. To get started using the website, you will need to following
activation code to gain access:
    UUID: ${usrData.activationCode}
Use this code when requested during initial login. I am sure you will find online access easy and useful and it
will facilitate efficient communication and transactions.
Thank you for joining us. We know you will be happy here.

Regards,
Clark McDermith,
Building Manager`
        };
        mailgun.messages().send(data, function (error, body) {
            if(error){
                console.log(`${error} Unable to send email to ${usrData.activationCode} @ ${usrData.email}`);
            }else{
                console.log(`email to ${usrData.activationCode} successfully sent to ${usrData.email}`);
            }
        });
    }


module.exports = { sendInv: sendInv };