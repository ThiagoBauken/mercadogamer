'use strict';
const admDashboard = require('./admDashboardInfo');
const ObjectId = require('mongoose').Types.ObjectId;

// Define module
module.exports = (module) => {
  module.router.use('/adminDashboard', admDashboard);
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
    async (req, res, next) => {
      try {
        const result = await global.helpers.database.find(
          req,
          res,
          module.model
        );

        const messages = await global.modules.messages.model
          .find({
            author: req.user.id,
            read: false,
          })
          .populate({
            path: 'conversation',
            match: {
              users: req.user._id,
              referenceType: 'users',
            },
          });

        if (Array.isArray(result.data)) {
          for (let item of result.data) {
            if (
              typeof item.stockProduct === 'object' &&
              typeof item.product === 'object' &&
              item.stockProduct?.retirementType === 'automatic'
            ) {
              const KEY =
                module.settings.crypto.key +
                item.product?._id +
                item.product?.user;
              try {
                if (item.stockProduct?.code) {
                  const temp = item.stockProduct.code.split(':');
                  const IV = Buffer.from(temp[0], 'hex');
                  const decipher = module.lib.crypto.createDecipheriv(
                    'aes-256-cbc',
                    Buffer.from(KEY, 'hex'),
                    IV
                  );

                  let decrypted = decipher.update(temp[1], 'hex', 'utf8');
                  decrypted += decipher.final('utf8');
                  item.stockProduct._doc.code = decrypted;
                }
                item.product._doc.stockProduct = item.stockProduct;
              } catch (error) {
                console.log(error);
              }
            }

            item._doc.hasUnreadMessage = !!messages.find(
              (message) =>
                `${message.conversation?.reference}` === `${item._id}`
            );
          }
        }

        res.send(result);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );

  /**
   * Get User Record
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get(
    '/userRecord/:user',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      let result = await global.helpers.database
        .find(req, res, module.model)
        .catch(next);

      result.data = {
        counters: {
          game: 0,
          giftCard: 0,
          item: 0,
          coin: 0,
          pack: 0,
        },
        items: result.data,
      };

      const orders = await module.model
        .find({ buyer: req.params.user })
        .populate('product')
        .catch(next);
      for (const order of orders)
        order.product && result.data.counters[order.product.type]++;

      res.send(result);
    }
  );

  module.router.get(
    '/userAnalytics',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res) => {
      const id = req.user.id || req.user._id;

      console.log(id);

      const pipeline = [
        {
          $match: {
            seller: new ObjectId(id),
          },
        },
        {
          $group: {
            _id: 0,
            sellerProfit: {
              $sum: '$sellerProfit',
            },
            complaint: {
              $sum: {
                $cond: [{ $eq: ['$status', 'complaint'] }, 1, 0],
              },
            },
            pending: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $eq: ['$status', 'pending'] },
                      { $eq: ['$status', 'paid'] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ];

      const data = (await global.modules.orders.model.aggregate(pipeline))[0];

      if (data) {
        delete data._id;
      }

      res.send(data);
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
    (req, res, next) => {
      global.helpers.database
        .findById(req, res, module.model)
        .then((result) => {
          res.send(result);
        })
        .catch(next);
    }
  );

  /**
   * Get Order With Conversations
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get(
    '/chats/:id',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      const order = await module.model
        .findById(req.params.id)
        .populate(['stockProduct', 'product', 'seller', 'buyer'])
        .catch(next);
      if (
        req.user._id.toString() !== order.seller?._id.toString() &&
        req.user._id.toString() !== order.buyer?._id.toString() &&
        !req.user.roles.includes('administrator')
      )
        return res
          .status(401)
          .send({ message: 'Su usuario no forma parte de esta venta.' });

      if (order.stockProduct?.retirementType === 'automatic') {
        const KEY =
          module.settings.crypto.key + order?.product?._id + order?.seller?._id;

        const textParts =
          order.stockProduct.code && order.stockProduct.code.split(':');
        if (textParts) {
          const IV = Buffer.from(textParts.shift(), 'hex');

          const encryptedCode = textParts.shift();

          const decipher = module.lib.crypto.createDecipheriv(
            'aes-256-cbc',
            Buffer.from(KEY, 'hex'),
            IV
          );

          order.stockProduct.code =
            decipher.update(encryptedCode, 'hex', 'utf-8') +
            decipher.final('utf-8').toString('utf-8');
        }
      }

      const usersConversation =
        (await global.modules.conversations.model
          .findOne({ reference: req.params.id, referenceType: 'users' })
          .catch(next)) || {};

      const usersConversationMessages = await global.modules.messages.model
        .find({ conversation: usersConversation._id })
        .populate('author')
        .catch(next);

      if (req.user.roles.includes('administrator')) {
        const sellerConversation =
          (await global.modules.conversations.model
            .findOne({
              reference: req.params.id,
              users: order.seller._id,
              referenceType: 'seller',
            })
            .catch(next)) || {};

        const buyerConversation =
          (await global.modules.conversations.model
            .findOne({
              reference: req.params.id,
              users: order.buyer._id,
              referenceType: 'buyer',
            })
            .catch(next)) || {};

        const sellerConversationMessages = await global.modules.messages.model
          .find({ conversation: sellerConversation._id })
          .populate('author')
          .catch(next);

        const buyerConversationMessages = await global.modules.messages.model
          .find({ conversation: buyerConversation._id })
          .populate('author')
          .catch(next);

        res.send({
          data: {
            order,
            usersConversation,
            sellerConversation,
            sellerConversationMessages,
            usersConversationMessages,
            buyerConversation,
            buyerConversationMessages,
          },
        });
      } else {
        const adminConversation =
          (await global.modules.conversations.model
            .findOne({
              reference: req.params.id,
              users: req.user._id.toString(),
              referenceType: { $ne: 'users' },
            })
            .catch(next)) || {};

        const adminConversationMessages = await global.modules.messages.model
          .find({ conversation: adminConversation._id })
          .populate('author')
          .catch(next);

        res.send({
          data: {
            order,
            usersConversation,
            adminConversation,
            adminConversationMessages,
            usersConversationMessages,
          },
        });
      }
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
  module.router.post(
    '/',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      global.helpers.database
        .create(req, res, module.model)
        .then(async (result) => {
          // const notification = await global.modules.notifications.model
          //   .create({
          //     user: result.data?.seller,
          //     title: 'El producto ha sido vendido.',
          //     description:
          //       'Tu producto ya se encuentra a la venta en el mercado.',
          //     action: 'productPaid',
          //     payload: { id: result.data?._id },
          //   })
          //   .catch((e) => {
          //     res.status(404).send({ message: 'Ocurrio un error inesperado' });
          //   });
          // module.lib.eventEmitter.emit(
          //   'send-notification',
          //   notification,
          //   productData.user
          // );
          res.send(result);
        })
        .catch(next);
    }
  );

  /**
   * Save
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */

  module.router.post(
    '/save',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      const product = await global.modules.products.model
        .findById(req.body.product)
        .catch(next);

      const country = await global.modules.countries.model
        .findById(req.body.country)
        .catch(next);

      const users = await global.modules.users.model
        .findById(req.user._id)
        .catch(next);

      // let totalPriceInLocalCurrency =
      //   req.body.processingFee +
      //   (product.discount ? product.priceWithDiscount : product.price) /
      //     country.toUSD;
      let stockProduct;
      stockProduct = await global.modules.stockProducts.model
        .findOne({ product: req.body.product, status: 'available' })
        .catch(next);

      if (!stockProduct)
        return res
          .status(400)
          .send({ message: 'Este producto no tiene stock disponible.' });

      var totalPaidPrice;
      totalPaidPrice =
        product.price / country.toUSD + req.body.processingFee / country.toUSD;

      if (users.gift >= totalPaidPrice) {
        const seller = await global.modules.users.model
          .findById(req.body.seller)
          .populate('country')
          .catch((e) => console.log(e));

        // -------------- create new order -----------
        var processFee;
        processFee = req.body.processingFee / country.toUSD;
        req.body.stockProduct = stockProduct._id;
        req.body.pricePaid = totalPaidPrice;
        req.body.toUSD = country.toUSD;
        req.body.sellerProfit = product.sellerProfit / country.toUSD;
        req.body.status = 'paid';

        if (req.body.paymentMethod == 'select') {
          req.body.paymentMethod = 'giftbalance';
        }

        let currentDate = new Date();
        req.body.paidDate = currentDate;

        const order = await module.model.create(req.body).catch(next);

        // ------------- stock and sold -------------
        await global.modules.products.model
          .updateOne(
            { _id: req.body.product },
            { $inc: { stock: -1, sold: 1 } }
          )
          .catch(next);

        // -------------- gift balance reset --------------
        let currentGift = req.user.gift - order.pricePaid;
        await global.modules.users.model
          .updateOne({ _id: req.body.buyer }, { $set: { gift: currentGift } })
          .catch(next);

        // ----------- stock status -------------------
        let currentProduct;
        currentProduct = await global.modules.products.model
          .findById(req.body.product)
          .catch(next);

        if (stockProduct.code == null && currentProduct.stock == 0) {
          await global.modules.stockProducts.model
            .updateOne(
              { product: currentProduct._id },
              { $set: { status: 'sold', order: order._id } }
            )
            .catch(next);
        }

        if (stockProduct.code != null) {
          await global.modules.stockProducts.model
            .updateOne(
              { _id: stockProduct._id },
              { $set: { status: 'sold', order: order._id } }
            )
            .catch(next);
        }

        let userUpdate = {};
        if (!req.user.firstName) userUpdate.firstName = req.body.firstName;
        if (!req.user.lastName) userUpdate.lastName = req.body.lastName;
        if (!req.user.emailAddress)
          userUpdate.emailAddress = req.body.emailAddress;
        if (!req.user.phoneNumber)
          userUpdate.phoneNumber = req.body.phoneNumber;
        if (!req.user.address) userUpdate.address = req.body.address;
        if (!req.user.postalCode) userUpdate.postalCode = req.body.postalCode;
        await global.modules.users.model
          .updateOne({ _id: req.body.buyer }, userUpdate)
          .catch(next);
        res.send({ data: order._id });
        // --------------------------------- Borrar cuando esté funcionando Mercado Pago --------------------------------- //
        const notification = global.modules.notifications.model.create({
          user: order.buyer,
          title: 'Tu compra ya esta en proceso',
          description:
            'Tu pago llego con éxito, ya puedes acceder a tu compra.',
          action: 'productPaid',
          payload: {
            id: order._id,
          },
        });
        module.lib.eventEmitter.emit(
          'send-notification',
          notification,
          order.buyer
        );
        const notificationSeller = global.modules.notifications.model.create({
          user: order.seller,
          title: '¡Felicitaciones! Recibiste una venta',
          description:
            'Un usuario acaba de comprar uno de tus productos,hace click para ver la orden.',
          action: 'receiveSuccess',
          payload: {
            id: order._id,
          },
        });
        module.lib.eventEmitter.emit(
          'send-notification',
          notificationSeller,
          order.buyer
        );
        const conversations = [
          {
            referenceType: 'users',
            reference: order._id,
            users: [order.buyer, order.seller],
          },
          {
            referenceType: 'buyer',
            reference: order._id,
            users: [order.buyer],
          },
          {
            referenceType: 'seller',
            reference: order._id,
            users: [order.seller],
          },
        ];

        for (const conversation of conversations)
          await global.modules.conversations.model
            .create(conversation)
            .catch(next);

        const addedConversations = await global.modules.conversations.model
          .findOne({
            reference: order._id,
            referenceType: 'users',
          })
          .catch((e) => console.log(e));

        const adminmessage = await global.helpers.chat
          .createMessage({
            conversation: addedConversations._id,
            body: `Tu pago ha sido aceptado, gracias por comprar en Mercado Gamer,  ahora estamos acá para ayudarte.
            
            No cierres la compra hasta haber recibido el producto. Si el vendedor solicita cerrar la compra para entregar el producto, abrí un reclamo.

            <span class="important">¡IMPORTANTE!</span> No se pueden compartir datos de contacto de ninguna red social, en caso de hacerlo ambos usuarios corren riesgo de ser vetados permanentemente del sitio web.`,
            author: null,
            authorName: 'Administrador',
          })
          .catch((e) => console.log(e));
      } else {
        return res
          .status(400)
          .send({ message: 'El saldo de regalo no es suficiente.' });
      }
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
  module.router.post(
    '/pay',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      const product = await global.modules.products.model
        .findById(req.body.product)
        .catch(next);
      const country = await global.modules.countries.model
        .findById(req.body.country)
        .catch(next);

      let totalPriceInLocalCurrency =
        (req.body.processingFee + product.price) / country.toUSD;
      // (product.discount ? product.priceWithDiscount : product.price) /
      //   country.toUSD;
      var stockProduct;
      stockProduct = await global.modules.stockProducts.model
        .findOne({ product: req.body.product, status: 'available' })
        .catch(next);

      if (!stockProduct)
        return res
          .status(400)
          .send({ message: 'Este producto no tiene stock disponible.' });

      if (req.body.discountCode) {
        const discountCode = await global.modules.discountCodes.model
          .findOne({
            _id: req.body.discountCode,
            enabled: true,
            $or: [{ available: { $gt: 0 } }, { infinite: true }],
          })
          .catch(next);

        if (!discountCode)
          return res
            .status(400)
            .send({ message: 'Código de descuento incorrecto.' });

        const previousOrderWithDiscountCode = await global.modules.orders.model
          .findOne({ buyer: req.body.buyer, discountCode: discountCode._id })
          .catch(next);

        if (previousOrderWithDiscountCode)
          return res
            .status(400)
            .send({ message: 'Ya has usado este código de descuento.' });

        await global.modules.discountCodes.model
          .updateOne(
            { _id: discountCode._id },
            { $inc: { spent: 1, available: -1 } }
          )
          .catch(next);
        const totalPriceInLocalCurrencyPrev = totalPriceInLocalCurrency;

        totalPriceInLocalCurrency =
          discountCode.type === 'percentage'
            ? totalPriceInLocalCurrency -
              (totalPriceInLocalCurrency / 100) * discountCode.value
            : totalPriceInLocalCurrency - discountCode.value;

        req.body.discountCodePrice =
          totalPriceInLocalCurrencyPrev - totalPriceInLocalCurrency;
      }

      const seller = await global.modules.users.model
        .findById(req.body.seller)
        .populate('country')
        .catch((e) => console.log(e));

      req.body.stockProduct = stockProduct._id;
      req.body.pricePaid = totalPriceInLocalCurrency;
      req.body.toUSD = country.toUSD;
      req.body.sellerProfit = product.sellerProfit / seller.country.toUSD;

      var order;
      order = await module.model.create(req.body).catch(next);
      // --------------------------------- Descomentar cuando esté funcionando Mercado Pago --------------------------------- //
      var preference;
      if (req.body.balancePay == false) {
        // console.log('this is only mercadoPago ');
        preference = {
          externalReference: JSON.stringify(order._id),
          title: 'Mercado Gamer',
          description: 'Compra de ' + product.name,
          unitPrice: order.pricePaid,
          quantity: 1,
        };
      } else {
        // console.log('this is a gift and mercadopago');
        preference = {
          externalReference: JSON.stringify(order._id),
          title: 'Mercado Gamer',
          description: 'Compra de ' + product.name,
          unitPrice: order.pricePaid - req.user.gift,
          quantity: 1,
        };
      }
      const payment = await global.helpers.mp.createPreference(preference);

      res.send({ data: payment.init_point });

      await module.model
        .updateOne({ _id: order._id }, { initPoint: preference })
        .catch(next);

      let userUpdate = {};

      if (!req.user.firstName) userUpdate.firstName = req.body.firstName;
      if (!req.user.lastName) userUpdate.lastName = req.body.lastName;
      if (!req.user.emailAddress)
        userUpdate.emailAddress = req.body.emailAddress;
      if (!req.user.phoneNumber) userUpdate.phoneNumber = req.body.phoneNumber;
      if (!req.user.address) userUpdate.address = req.body.address;
      if (!req.user.postalCode) userUpdate.postalCode = req.body.postalCode;

      await global.modules.users.model
        .updateOne({ _id: req.body.buyer }, userUpdate)
        .catch(next);

      // --------------------------------- Borrar cuando esté funcionando Mercado Pago --------------------------------- //
    }
  );

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
    async (req, res, next) => {
      global.helpers.database
        .update(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );

  /**
   * Complain
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put(
    '/complain/:id',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      await module.model
        .updateOne(
          { _id: req.params.id },
          { status: 'complaint', claimDate: Date.now() }
        )
        .catch(next);

      const issue = await global.modules.issues.model
        .create(req.body)
        .catch(next);

      res.send({ data: issue });
    }
  );

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
};
