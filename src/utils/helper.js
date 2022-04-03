const nodemailer = require("nodemailer");
const htmlTemplateFunctions=require('./htmlTemplateFunctions');
const passwordGenerator = (length, chars) => {
    var mask = ''
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz'
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (chars.indexOf('#') > -1) mask += '0123456789'
    if (chars.indexOf('!') > -1) mask += '@#$'
    var result = ''
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)]
    return result
}

async function wrapedSendMail(mailOptions) {
    return new Promise((resolve) => {
      let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "scrumacers.team@gmail.com",
          pass: "scrumiscool@1",
        },
      });
      
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          resolve(false); // or use rejcet(false) but then you will have to handle errors
        } else {
          resolve(true);
        }
      });
    });
  }

  const sendEmailTemporaryPassword = async (data) => {
    try {
      var html_body = htmlTemplateFunctions.sendTemporaryPassword(data);
      var mailOptions = {
        to: data.email,
        subject: `Temporary Password Created`,
        text: `Temporary Password has been created! Use this to login now: ${data.password}`,
        html: html_body, // html body
      };
      let result = await wrapedSendMail(mailOptions);
      return result;
    } catch (e) {
      console.log(e);
    }
  };



module.exports = { passwordGenerator, sendEmailTemporaryPassword }