'use strict';

// Define module
module.exports = (helper) => {
  /**
   * Select
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (filter, model) => {
    return new Promise((resolve, reject) => {
      try {
        let transporter = helper.lib.nodemailer.createTransport(
          global.helpers.database.settings.nodemailer.transporter
        );
        model.findOne(filter).then(async (result) => {
          if (result) {
            let data = result.toJSON();
            const token = helper.lib.jsonwebtoken.sign(
              data,
              helper.settings.token.secret
            );
            let mailOptions = {
              from: global.helpers.database.settings.nodemailer.mailOptions
                .from,
              to: result.emailAddress,
              html: global.utils.emailTemplate.recoveryPasswordEmailTemplate(
                `<a href='https://www.mercadogamer.com/reset-password/${token}' style="background: #F78A0E;border-radius: 25px; font-size: 14px; padding: 14px 40px; color:#111217; font-style: normal; font-weight: 600; text-decoration: none; font-family:'Montserrat', sans-serif;" target='_blank'>Restablecer contraseña</a>`
              ),
              subject:
                global.helpers.database.settings.nodemailer.mailOptions.subject,
            };

            transporter.sendMail(mailOptions, (error, info) =>
              error
                ? reject(error)
                : resolve({
                    message:
                      'Se ha enviado la nueva contraseña a su mail satisfactoriamente',
                  })
            );
          } else reject({ message: 'Usuario no existe' });
        });
      } catch (error) {
        console.error('Helper "database.recoveryPassword" response error');
        console.error(error);
        reject(error);
      }
    });
  };
};
