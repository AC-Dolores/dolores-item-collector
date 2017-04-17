const request = require('request');
const config = require('../config.json');

const FROM = 'alert@dolores.com';
const To = 'mail@aaronchen.cn';
const MAIL_SERVER = 'http://api.sendcloud.net/apiv2/mail/send';

const sendMail = message => new Promise((resolve, reject) => {
  request.post({
    url: MAIL_SERVER,
    form: {
      apiUser: config.mailUser || '',
      apiKey: config.mailApiKey || '',
      from: FROM,
      fromName: 'dolores',
      to: To,
      subject: message.subject,
      html: message.body,
    },
  }, (error, response) => {
    if (error) {
      reject(error);
    } else if (response.statusCode >= 300) {
      reject(response.body);
    } else {
      resolve(response.body);
    }
  });
});

module.exports = {
  sendMail,
};
