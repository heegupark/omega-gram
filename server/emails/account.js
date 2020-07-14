const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = email => {
  sgMail.send({
    to: email,
    from: 'omegathrone@omegathrone.com',
    subject: 'Thanks for joining in omega gram!',
    text: 'Welcome to the omega gram!. \n\n It is really great to have you here. Let me know how you get along with the app. \nFrom now on, you can enjoy omega gram for good!!! \n\n Best regards, \n www.heegu.net'
  });
};

const sendCancelationEmail = email => {
  sgMail.send({
    to: email,
    from: 'omegathrone@omegathrone.com',
    subject: 'Sorry to see you go!',
    text: 'Goodbye. I hope to see you back sometime soon.'
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};
