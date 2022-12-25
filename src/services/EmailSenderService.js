var nodemailer = require('nodemailer');
var connection = process.env.MAILURL;
var transporter = nodemailer.createTransport(connection);

function sendVerificationMail(email, token){
    var mailOptions = {
        from: '"Timo Wevelsiep - Anamnaid" <anamnaid@timowevelsiep.de>',
        to: email,
        subject: 'Verify your Anamnaid account!',
        text: 'Hey, \nplease click the following link to verify your Anamnaid account: http://localhost:3000/verify/?token_verification=' + token
    };
    transporter.sendMail(mailOptions, function(err, info){
        if (err) throw err;
        console.log('Message sent: ' + info.response);
    });
}

module.exports = { sendVerificationMail }