const config = require("config")
const nodemailer = require('nodemailer');

const sender = config.get("sender_email");
const appPassword = config.get("app_password_gmail");


// connection to email server 
const transporter = nodemailer.createTransport({ 
    service: "gmail",
    auth: {
        user: sender,
        pass: appPassword            // genereate code through app password
    }
})

// send mail using nodemailer and link is firebase genereated
async function sendMail(toSend, verificationLink) {

    const mail = {
      from: sender,                                 // sender address
      to: toSend,                                   // list of receivers
      subject: "Verify your email",                 // Subject line
      html: `<h2> Follow this link to verify your email address.</h2>       
            <body> ${verificationLink} </body>
            <p> If you didn't ask to verify this address, you can ignore this email. </p>
            <p> Thanks </p> `,     
    };

    return await transporter.sendMail( mail );
}


module.exports.sendMail = sendMail;