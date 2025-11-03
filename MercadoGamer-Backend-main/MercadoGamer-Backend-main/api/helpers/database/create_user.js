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
  return (req, res, model) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userInfo = req.body;

        // Check if another user exists

        const otherUser = await model.findOne({
          $or: [
            { username: userInfo.username },
            { emailAddress: userInfo.emailAddress },
          ],
        });
        if (otherUser) {
          res
            .status(400)
            .send('Ya existe un usuario con ese nombre de usuario');
          return;
        }

        const countryObj = await global.modules.countries.model.findOne({
          name: userInfo.country,
        });

        if (!countryObj) {
          res
            .status(500)
            .send('Ocurrio un error. Vuelva a intentar o intente mas tarde.');
        }

        userInfo.country = countryObj._id;

        // Hash password
        userInfo.password = helper.lib.bcrypt.hashSync(
          req.body.password,
          helper.settings.crypto.saltRounds
        );

        await model
          .create(userInfo)
          .then((result) => {
            // Create token
            let data = result.toJSON();
            data.token = helper.lib.jsonwebtoken.sign(
              data,
              helper.settings.token.secret
            );

            resolve({ data });
          })
          .catch((error) => {
            console.log(error);
            let message = error.message || 'Ocurrio un error inesperado';

            if (error.errors.dni && error.errors.dni.kind == 'unique')
              message = 'DNI duplicado';
            if (error.errors.username && error.errors.username.kind == 'unique')
              message = 'Nombre de usuario duplicado';
            if (
              error.errors.emailAddress &&
              error.errors.emailAddress.kind == 'unique'
            )
              message = 'Email duplicado';

            if (
              error.name &&
              error.code &&
              error.name === 'MongoError' &&
              error.code === 11000
            ) {
              let msg = String(error.message);
              if (msg.includes('dni')) message = 'DNI duplicado';
              else if (msg.includes('usename')) message = 'Email duplicado';
              else if (msg.includes('email')) message = 'Email duplicado';
              else message = 'Clave duplicada';
            }

            reject(helper.lib.httpError(404, message));
          });
      } catch (error) {
        console.error('Helper "database.createUser" response error');
        console.error(error);
        reject(error);
      }
    });
  };
  // return (req, res, model) => {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       // Hash password
  //       req.body.password = helper.lib.bcrypt.hashSync(
  //         req.body.password,
  //         helper.settings.crypto.saltRounds
  //       );
  //       const two_factor = global.utils.twoFactor.verificationTwoFactor(
  //         req.body.twoFactor
  //       );
  //       if (!two_factor) {
  //         reject(helper.lib.httpError(500, 'Por favor verifique el código.'));
  //       } else {
  //         model
  //           .create(req.body)
  //           .then((result) => {
  //             // Create token
  //             let data = result.toJSON();
  //             data.token = helper.lib.jsonwebtoken.sign(
  //               data,
  //               helper.settings.token.secret
  //             );

  //             resolve({ data });
  //           })
  //           .catch((error) => {
  //             console.log(error);
  //             let message = error.message || 'Ocurrio un error inesperado';

  //             if (error.errors.dni && error.errors.dni.kind == 'unique')
  //               message = 'DNI duplicado';
  //             if (
  //               error.errors.username &&
  //               error.errors.username.kind == 'unique'
  //             )
  //               message = 'Nombre de usuario duplicado';
  //             if (
  //               error.errors.emailAddress &&
  //               error.errors.emailAddress.kind == 'unique'
  //             )
  //               message = 'Email duplicado';

  //             if (
  //               error.name &&
  //               error.code &&
  //               error.name === 'MongoError' &&
  //               error.code === 11000
  //             ) {
  //               let msg = String(error.message);
  //               if (msg.includes('dni')) message = 'DNI duplicado';
  //               else if (msg.includes('usename')) message = 'Email duplicado';
  //               else if (msg.includes('email')) message = 'Email duplicado';
  //               else message = 'Clave duplicada';
  //             }

  //             reject(helper.lib.httpError(404, message));
  //           });
  //       }
  //     } catch (error) {
  //       console.error('Helper "database.createUser" response error');
  //       console.error(error);
  //       reject(error);
  //     }
  //   });
  // };
};
