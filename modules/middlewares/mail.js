const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host : 'smtp.mailtrap.io',
    port: 2525,
    secure : false,
    auth : {
        user : 'd8613c7411a88d',
        pass : '52a2930c11604b'
    }
})


module.exports = transporter;