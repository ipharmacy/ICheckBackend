var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'help.fashionar@gmail.com',
    pass: 'esprit18'
  }
});

var mailOptions = {
  from: '',
  to: '',
  subject: '',
  text: ``
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});