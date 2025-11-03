'use strict';

const { conforms } = require('lodash');
const mongoose = require('mongoose');
const { use } = require('../../routes');
const { sendSmsToPhone } = require('../../utils/sms');

const checkPhone = (phoneNumber) => {
  return /^(\+54|\+55|\+56|\+598)/g.test(phoneNumber);
};

// Define module
module.exports = (module) => {
  /**
   * Send sms
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get(
    '/sendSms',
    global.helpers.security.auth(['user']),
    async (req, res, next) => {
      try {
        if (checkPhone(req.user.phoneNumber)) {
          const two_factor = global.utils.twoFactor.generateTwoFactor(
            req.user.username
          );
          console.log({ two_factor });
          // global.helpers.mail
          //   .send({
          //     email: req.user.emailAddress,
          //     html: global.utils.emailTemplate.twoFactorHtml(two_factor.token),
          //     subject: 'Verificación en 2 pasos',
          //   })
          //   .then((res) => console.log(res))
          //   .catch((error) => console.log(error));

          sendSmsToPhone(
            req.user.phoneNumber,
            `[Mercado Gamer] Código 2FA: ${two_factor.token}. Si no fuiste vos contacta al soporte. Nunca te solicitaremos este dato, no lo compartas.`
          );
          res.send(true);
        } else {
          throw new Error('No puedo enviar sms a tu teléfono');
        }
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * Send sms
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get(
    '/sendSms/:phoneNumber',
    global.helpers.security.auth(['user']),
    async (req, res, next) => {
      try {
        if (!checkPhone(req.params.phoneNumber)) {
          res.status(400).send('El número de teléfono es incorrecto.');
          return;
        }

        const hasPhoneNmber =
          req.params.phoneNumber &&
          (await module.model.findOne({ phoneNumber: req.params.phoneNumber }));

        if (
          !hasPhoneNmber &&
          JSON.stringify(hasPhoneNmber?._id) !== JSON.stringify(req.user?._id)
        ) {
          let user = await module.model.findByIdAndUpdate(req.user._id, {
            phoneNumber: req.params.phoneNumber,
          });
          const two_factor = global.utils.twoFactor.generateTwoFactor(
            req.params.phoneNumber
          );
          console.log('get two_factor=>', two_factor);
          sendSmsToPhone(
            req.params.phoneNumber,
            `[Mercado Gamer] Código 2FA: ${two_factor.token}. Si no fuiste vos contacta al soporte. Nunca te solicitaremos este dato, no lo compartas.`
          );
        } else {
          if (
            hasPhoneNmber &&
            JSON.stringify(hasPhoneNmber?._id) !== JSON.stringify(req.user?._id)
          ) {
            res
              .status(400)
              .send(
                'Este numero de telefono ya esta vinculado con otro usuario'
              );
            return;
          } else if (
            hasPhoneNmber &&
            JSON.stringify(hasPhoneNmber?._id) === JSON.stringify(req.user?._id)
          ) {
            const two_factor = global.utils.twoFactor.generateTwoFactor(
              req.params.phoneNumber
            );
            console.log('get two_factor=>', two_factor);
            sendSmsToPhone(
              req.params.phoneNumber,
              `[Mercado Gamer] Código 2FA: ${two_factor.token}. Si no fuiste vos contacta al soporte. Nunca te solicitaremos este dato, no lo compartas.`
            );
          } else {
            res.status(400).send('Número de teléfono incorrecto');
            return;
          }
        }

        res.send(true);
      } catch (error) {
        console.log({ error });
        next(error);
      }
    }
  );

  /**
   * Find
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get(
    '/',
    global.helpers.security.auth(['administrator', 'user']),
    (req, res, next) => {
      global.helpers.database
        .find(req, res, module.model)
        .then((result) => {
          res.send(result);
        })
        .catch(next);
    }
  );

  /**
   * Profile
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/profile/:id', async (req, res, next) => {
    const filters = JSON.parse(req.query._filters);

    const products = await global.modules.products.model
      .find({
        status: 'approved',
        enabled: true,
        user: req.params.id,
        ...filters.extraProductsFilter,
      })
      .sort({ priority: 1 })
      .populate(['platform'])
      .catch(next);

    const productsCount = await global.modules.products.model.count({
      status: 'approved',
      user: req.params.id,
      ...filters.extraProductsFilter,
    });

    // const productsPages = Math.ceil(productsCount / productsPerPage);

    const user = await module.model.findById(req.params.id).catch(next);

    const userOrders = await global.modules.orders.model
      .find({ buyer: req.params.id })
      .catch(next);

    const finishedSales = (
      await global.modules.orders.model.find({
        seller: req.params.id,
        status: 'finished',
      })
    ).length;

    const orders = {
      pending: 0,
      paid: 0,
      cancelled: 0,
      finished: 0,
      returned: 0,
      complaint: 0,
    };

    for (const order of userOrders) orders[order.status] += 1;

    orders.pending += orders.paid;
    orders.cancelled += orders.returned;

    delete orders.paid;
    delete orders.returned;

    const userReviewsFilter = {
      roleReviewed: 'user',
      qualified: req.params.id,
    };

    if (filters.userQualification)
      userReviewsFilter.qualification = filters.userQualification.qualification;

    const userReviews = await global.modules.reviews.model
      .find(userReviewsFilter)
      .populate('qualifier')
      .catch(next);

    const sellerReviewsFilter = {
      roleReviewed: 'seller',
      qualified: req.params.id,
    };

    if (filters.sellerQualification)
      sellerReviewsFilter.qualification =
        filters.sellerQualification.qualification;

    const sellerReviews = await global.modules.reviews.model
      .find(sellerReviewsFilter)
      .populate('qualifier')
      .catch(next);

    const categories = await global.modules.categories.model
      .find({ enabled: true })
      .catch(next);

    res.send({
      user,
      products,
      userReviews,
      sellerReviews,
      categories,
      productsPages: 0,
      orders,
      finishedSales,
    });
  });

  module.router.get(
    '/userReferrals/:id',
    global.helpers.security.auth(['user']),
    async (req, res, next) => {
      const users = await global.modules.users.model
        .find({
          referredBy: req.user._id,
        })
        .select([
          '_id',
          'username',
          'firstRoulettePlay',
          'verificationSms',
          'referrerUsedTheDrop',
          'picture',
        ])
        .sort({ updatedAt: -1 });

      res.send(users);
    }
  );

  /**
   * FindById
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get(
    '/:id',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      let user;
      try {
        user = await module.model.findById(req.params.id);
        // if (user) {
        //   const orders = await global.modules.orders.model.find({
        //     seller: user._id,
        //     status: 'finished',
        //     withdrawal: null,
        //   });
        //   let balance = 0;
        //   orders.forEach((order) => {
        //     balance += order.sellerProfit;
        //     if (order.firstSale) balance += 1000;
        //   });
        //   user.balance = balance;
        //   user.save();
        // }
      } catch (error) {
        console.log(error);
      }

      res.send({
        data: user,
      });
    }
  );

  /**
   * Create
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  // module.router.post('/', async (req, res, next) => {
  //   console.log(req);
  //   const hasPhoneNmber =
  //     req.body.phoneNumber &&
  //     (await module.model.findOne({ phoneNumber: req.body.phoneNumber }));
  //   if (!hasPhoneNmber) {
  //     global.helpers.database
  //       .createUser(req, res, module.model)
  //       .then((result) => {
  //         res.send(result);
  //       })
  //       .catch(next);
  //   } else {
  //     res.status(500).send({ message: 'Este número de teléfono utilizado.' });
  //   }
  // });

  module.router.post('/', async (req, res, next) => {
    const { username } = req.body;

    const avatars = [
      'avatars/api_1qb2a8f5-cad6-40dc-b482-633b847890b1.webp',
      'avatars/api_2wb2a8f5-cad6-40dc-b482-633b847890ba.webp',
      'avatars/api_4eb2a8f5-cad6-40dc-b482-633b8478903c.webp',
      'avatars/api_53b2a8f5-cad6-40dc-b482-633b8478900o.webp',
      'avatars/api_4fb2a8f5-cad6-40dc-b482-633b847890p9.webp',
      'avatars/api_9rb2a8f5-cad6-40dc-b482-633b84789025.webp',
      'avatars/api_54b2a8f5-cad6-40dc-b482-633b847890dc.webp',
      'avatars/api_t6b2a8f5-cad6-40dc-b482-633b847890t4.webp',
      'avatars/api_q1b2a8f5-cad6-40dc-b482-633b847890a1.webp',
      'avatars/api_c3b2a8f5-cad6-40dc-b482-633b847890c3.webp',
      'avatars/api_g2b2a8f5-cad6-40dc-b482-633b847890g2.webp',
    ];
    var randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    req.body.picture = randomAvatar;

    if (!username || username.length === 0 || username.length > 20) {
      res
        .status(400)
        .send('El nombre de usuario debe tener entre 0 y 20 caracteres');
      return;
    }

    global.helpers.database
      .createUser(req, res, module.model)
      .then((result) => {
        res.send(result);
      })
      .catch(next);
  });

  /**
   * Login
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post('/login', (req, res, next) => {
    global.helpers.database
      .login(req, res, module.model)
      .then((result) => {
        if (!result.data.enabled) {
          next(module.lib.httpError(404, 'Usuario deshabilitado'));
        } else {
          res.send(
            // result.data.verificationSms
            //   ? {
            //       token: result.data.token,
            //       phoneNumber: result.data.phoneNumber,
            //       verificationSms: result.data.verificationSms,
            //     }
            //   : result.data
            { ...result.data, password: undefined, roles: undefined }
          );
        }
      })
      .catch(next);
  });

  /**
   * Update
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put(
    '/',
    global.helpers.security.auth(['user']),
    async (req, res, next) => {
      try {
        const { username } = req.body;

        if (
          'username' in req.body &&
          (!username || username.length === 0 || username.length > 20)
        ) {
          res
            .status(400)
            .send('El nombre de usuario debe tener entre 0 y 20 caracteres');
          return;
        }

        const phoneUser = await module.model.findOne({
          phoneNumber: req.body.phoneNumber,
        });
        const hasPhoneNmber =
          req.body.phoneNumber && phoneUser && req.user._id === phoneUser._id;
        if (!hasPhoneNmber) {
          let user = await module.model.findByIdAndUpdate(
            req.user._id,
            req.body,
            {
              new: true,
            }
          );
          res.send(user);
        } else {
          res
            .status(500)
            .send({ message: 'Este número de teléfono utilizado.' });
        }
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );

  /**
   * Change password
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put('/changePassword', async (req, res, next) => {
    try {
      const { password, confirmPassword, token } = req.body;
      const userByToken = module.lib.jsonwebtoken.verify(
        token,
        module.settings.token.secret
      );
      const user = await module.model.findById(userByToken.id);
      if (user) {
        if (password === confirmPassword) {
          user.password = module.lib.bcrypt.hashSync(
            password,
            module.settings.crypto.saltRounds
          );
          await user.save();
          res.send({ success: true });
        } else {
          res
            .status(400)
            .send({ message: 'Por favor, confirme su contraseña.' });
        }
      } else {
        res.status(400).send({ message: 'No se encuentra token' });
      }
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  });

  /**
   * Update
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put(
    '/:id',
    global.helpers.security.auth(['administrator', 'user']),
    (req, res, next) => {
      global.helpers.database
        .updateUser(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );

  /**
   * Change Phone
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put(
    '/changePhone/:id',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      try {
        const user = await module.model.findById(req.user.id);
        user.phoneNumber = req.body.phoneNumber;
        await user.save();
        res.send(user);
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * Recovery Password by user
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post('/recoveryPassword/:username', (req, res, next) => {
    global.helpers.database
      .recoveryPassword({ emailAddress: req.params.username }, module.model)
      .then((result) => {
        res.send(result);
      })
      .catch(next);
  });
  /**
   * Delete
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.delete(
    '/:id',
    global.helpers.security.auth(['administrator']),
    (req, res, next) => {
      global.helpers.database
        .delete(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );

  /**
   * CheckEmail
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/checkEmail/:email', async (req, res, next) => {
    const result = await module.model.findOne({
      emailAddress: {
        $regex: new RegExp(req.params.email),
        $options: 'i',
      },
    });
    res.send(result ? false : true);
  });

  /**
   * Check user name
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/checkName/:username', async (req, res, next) => {
    const result = await module.model.findOne({
      username: req.params.username,
    });

    res.send(result ? false : true);
  });

  /**
   * Check user name
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post(
    '/confirmSms',
    global.helpers.security.auth(['user']),
    async (req, res, next) => {
      const { sms } = req.body;
      const two_factor = global.utils.twoFactor.verificationTwoFactor(sms);

      if (two_factor !== null) {
        let user = await module.model.findByIdAndUpdate(req.user._id, {
          verificationSms: true,
        });
      }

      if (two_factor && req.user && req.user.referredBy) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          const referrer = await global.modules.users.model.findOne({
            _id: req.user.referredBy,
          });
          referrer.extraRouletteDrop++;
          req.user.verificationSms = true;

          await Promise.all([req.user.save(), referrer.save()]);

          session.commitTransaction();
        } catch (e) {
          console.error(e);
          session.abortTransaction();
        }
      }

      res.send(two_factor ? req.user : false);
    }
  );
};
