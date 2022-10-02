var nodemailer = require('nodemailer');
require('dotenv').config();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

var mailOptions = {
    from: process.env.MAIL_USER,
};
module.exports.sendMail = (toMail, subject, template) => {
    console.log(process.env.MAIL_USER)
    return new Promise((resolve, reject) => {
        transporter.sendMail({ ...mailOptions, to: toMail, subject, html: template }, function (error, info) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                resolve(info);
            }
        });
    })
}


