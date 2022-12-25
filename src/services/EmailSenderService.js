var nodemailer = require('nodemailer');
var connection = process.env.MAILURL;
var transporter = nodemailer.createTransport(connection);

function sendVerificationMail(email, token){
    var mailOptions = {
        from: '"Timo Wevelsiep - Anamnaid" <anamnaid@timowevelsiep.de>',
        to: email,
        subject: 'Verify your Anamnaid account!',
        text: "Hey, \nplease click the following link to verify your Anamnaid account: " + process.env.SITE_URL + "/verify/?token_verification=" + token
    };
    transporter.sendMail(mailOptions, function(err, info){
        if (err) console.log(err);
    });
}

module.exports = { sendVerificationMail }