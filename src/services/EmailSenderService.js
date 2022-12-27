const nodemailer = require('nodemailer');
const connection = process.env.MAILURL;
const transporter = nodemailer.createTransport(connection);

function sendVerificationMail(email, token){
    let mailOptions = {
        from: `"Anamnaid" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Verify your Anamnaid account!',
        text: "Hey, \nplease click the following link to verify your Anamnaid account: " + process.env.SITE_URL + "/verify/?token_verification=" + token
    };
    transporter.sendMail(mailOptions, function(err, info){
        if (err) console.log(err);
    });
}

module.exports = { sendVerificationMail }