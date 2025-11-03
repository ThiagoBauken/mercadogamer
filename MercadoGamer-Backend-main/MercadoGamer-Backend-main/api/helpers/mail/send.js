'use strict';

// Define module
module.exports = (helper) => {
  /**
   * Select
   *
   * @param {Object} params - Paramters
   * @return {Promise}
   */
  return (params) => {
    return new Promise((resolve, reject) => {
      try {
        let transporter = helper.lib.nodemailer.createTransport(
          global.helpers.database.settings.nodemailer.transporter
        );
        let mailOptions = {
          text: params.text,
          to: params.email,
        };

        mailOptions.from =
          global.helpers.database.settings.nodemailer.mailOptions.from;
        mailOptions.subject = params.subject;
        mailOptions.html = params.html;

        let successMessage = params.successMessage
          ? params.successMessage
          : 'Email enviado con éxito';

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log('error');
            reject(error);
          } else {
            resolve({ message: successMessage });
          }
        });
      } catch (error) {
        console.error('Helper "mail.send" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
