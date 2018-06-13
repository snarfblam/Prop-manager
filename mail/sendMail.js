/**
 * Sends an email message to a tenant. Returns a promise.
 * @param {string} subject - Subject line of message
 * @param {(string | {text: string, html: string})} message - Text body of email, or object containing text and/or html representations of an email body.
 * @param {string | User} to - Recipient of message. Can either be a User model or a string containing an email address.
 * @param {string} from - Optional. Sender of message.
 * @returns {Promise<*>}
 */
function sendMail(subject, body, to, from) {
    var toUser = to;

    // Get email address from User model, if applicable
    if (to.email) to = to.email;

    var data = {
        from: from || (appSettings.getSetting('EMAILFROM') || 'admin@site.com'),
        to: to,
        subject: subject || (`A message from ${businessName}`),
    };

    // Text or html body
    if (body.text || body.html) {
        if (body.text) data.text = body.text;
        if (body.html) data.html = body.html;
    } else {
        data.text = body;
    }

    // Get rid of leading whitespace
    if (body.text) body.text = body.text.replace(/^\W+/gm, '');
    
    // Do the thing
    return new Promise((resolve, reject) => {
        mailgun.messages().send(data, function (error, body) {
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