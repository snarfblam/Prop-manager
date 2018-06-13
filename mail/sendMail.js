/**
 * Sends an email message to a tenant. Returns a promise.
 * @param {string} subject - Subject line of message
 * @param {(string | {text: string, html: string})} message - Text body of email, or object containing text and/or html representations of an email body.
 * @param {string | User} to - Recipient of message. Can either be a User model or a string containing an email address.
 * @param {string} from - Optional. Sender of message.
 * @returns {Promise<*>}
 */
function sendMail(subject, body, to, from) {
    // Compose parameters into an object. (Body to be processed later).
    var email = { subject: subject, to: to, from: from };
    var emailBody = body;

    // An object can be accepted instead of a traditional parameter list
    if (subject.subject && subject.body && subject.to) {
        var paramObj = subject;
        email = { subject: paramObj.subject, to: paramObj.to, from: paramObj.from };

        emailBody = subject.body;
    }

    // provide default values
    email.subject = email.subject || (`A message from ${businessName}`);
    email.from = email.from || (appSettings.getSetting('EMAILFROM') || 'admin@site.com');
    email.to = email.to.email || email.to; // get User.email when applicable

    // Body can be an object or a string
    if (emailBody.text || emailBody.html) {
        if (emailBody.text) email.text = emailBody.text;
        if (emailBody.html) email.html = emailBody.html;
    } else {
        email.text = emailBody;
    }

    // Get rid of leading whitespace
    if (email.text) email.text = email.text.replace(/^\W+/gm, '');
    
    // Do the thing
    return new Promise((resolve, reject) => {
        mailgun.messages().send(email, function (error, body) {
            if (error) {
                console.log(error, `Unable to send email to ${to}`);
                reject(error);
            } else {
                console.log(`email to ${usrData.activationCode} successfully sent to ${to}`);
                resolve(body);
            }
        });
    });
}

module.exports = sendMail;