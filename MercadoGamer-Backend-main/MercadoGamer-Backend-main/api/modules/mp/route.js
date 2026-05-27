'use strict';

const { InvoiceService } = require('../../helpers/createInvoice/invoice');

// Define module
module.exports = (module) => {
  /**
   * Create init point
   *
   * Migrated from mercadopago v1 to v2.
   *   Before: module.lib.mercadopago.configure({...}); module.lib.mercadopago.preferences.create(payload)
   *   After:  new MercadoPagoConfig({...}); new Preference(client).create({ body: payload })
   *
   * Response format preserved: res.json({ data: response.init_point })
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post('/initPoint', (req, res, next) => {
    const { MercadoPagoConfig, Preference } = module.lib.mercadopago;

    const client = new MercadoPagoConfig({
      accessToken: module.settings.mp[module.settings.mp.env].accessToken,
    });

    const preferenceClient = new Preference(client);

    const preferenceBody = {
      external_reference: req.body.externalReference.toString(),
      notification_url: module.settings.mp.urlIpn,
      items: [
        {
          title: req.body.title,
          description: req.body.description,
          unit_price: req.body.unitPrice,
          quantity: req.body.quantity,
        },
      ],
    };

    preferenceClient
      .create({ body: preferenceBody })
      .then(function (response) {
        // v2 returns the object directly (no .body wrapper)
        res.status(200).json({ data: response.init_point });
      })
      .catch(function (error) {
        res.status(400).json({
          error: error.message || 'No se puede obtener el link de pago',
        });
      });
  });

  /**
   * Create init point
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post('/testemitter', (req, res, next) => {
    global.utils.eventEmitter.emit('checkPayment', { somedata: '123123213' });
  });

  /**
   * ipn
   *
   * WARNING: THIS ROUTE IS DEPRECATED
   *
   * Migrated from mercadopago v1 to v2.
   *   Before: module.lib.mercadopago.payment.get(id) -> payment.body.status / payment.body.external_reference
   *   After:  new Payment(client).get({ id }) -> response object directly (no .body wrapper)
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post('/ipn', async (req, res, next) => {
    const { MercadoPagoConfig, Payment } = module.lib.mercadopago;

    const client = new MercadoPagoConfig({
      accessToken: module.settings.mp[module.settings.mp.env].accessToken,
    });

    const paymentClient = new Payment(client);

    if (!req.body.type) {
      res.sendStatus(200);
      return;
    }

    try {
      if (req.body.type === 'payment') {
        // v2: get({ id }) — response is direct object, no .body wrapper
        const paymentData = await paymentClient
          .get({ id: req.body.data.id })
          .catch(next);

        if (paymentData.status == 'approved') {
          let buyer,
            ids = [];
          const orders = JSON.parse(paymentData.external_reference).split(',');
          for (const orderId of orders) {
            console.log(orderId);
            const order = await global.modules.orders.model
              .findById(orderId)
              .populate('product');
            order.status = 'paid';
            order.paidDate = Date.now();
            order.save();
            console.log(order);

            await global.modules.users.model
              .updateOne({ _id: order.buyer }, { gift: '0' })
              .catch(next);
            buyer = order.buyer;

            ids.push(order._id);
            var currentProduct;
            currentProduct = await global.modules.products.model
              .findById(order.product)
              .catch(next);
            currentProduct.stock--;
            currentProduct.sold++;
            await currentProduct.save();
            var stockProduct;
            stockProduct = await global.modules.stockProducts.model
              .findOne({ product: order.product, status: 'available' })
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
                body: `Tu pago ha sido aceptado, gracias por comprar en Mercado Gamer, ahora estamos acá para ayudarte.

              No cierres la compra hasta haber recibido el producto. Si el vendedor solicita cerrar la compra para entregar el producto, abrí un reclamo.

              <span class="important">¡IMPORTANTE!</span> No se pueden compartir datos de contacto de ninguna red social, en caso de hacerlo ambos usuarios corren riesgo de ser vetados permanentemente del sitio web.`,
                author: null,
                authorName: 'Administrador',
              })
              .catch((e) => console.log(e));

            const notification =
              await global.modules.notifications.model.create({
                user: buyer,
                title: '¡Tu compra ya esta en proceso!',
                description:
                  'Tu pago llego con éxito, ya puedes acceder a tu compra.',
                action: 'productPaid',
                payload: {
                  id: ids.join(', '),
                },
              });

            module.lib.eventEmitter.emit(
              'send-notification',
              notification,
              order.buyer
            );
          }
        } else {
          // this is wrong
          const order = await global.modules.orders.model
            .findById(JSON.parse(paymentData.external_reference))
            .populate(['product', 'buyer'])
            .catch(next);

          const adminNotification =
            await global.modules.notifications.model.create({
              title: 'Pago rechazado',
              description: 'Compra rechazada de @' + order.buyer.username,
              action: 'productRejected',
              payload: {
                id: order.product._id,
              },
            });
        }
      }
    } catch (e) {
      console.error(e);
    }

    res.sendStatus(200);
  });

  module.router.post('/ipnv2', async (req, res, next) => {
    if (!req.body.type) {
      res.sendStatus(200);
      return;
    }

    if (
      req.body &&
      (req.body.action === 'payment.created' ||
        req.body.action === 'payment.updated')
    ) {
      const { MercadoPagoConfig, Payment } = module.lib.mercadopago;

      const client = new MercadoPagoConfig({
        accessToken: module.settings.mp[module.settings.mp.env].accessToken,
      });

      const paymentClient = new Payment(client);

      // v2: get({ id }) — response is direct object, no .body / .response wrappers
      const paymentData = await paymentClient
        .get({ id: req.body.data.id })
        .catch((e) => console.error(e));

      if (paymentData && paymentData.status === 'approved') {
        const pendingOrders = await global.modules.pendingOrders.model
          .findOne({
            _id: paymentData.external_reference,
            orders: [],
          })
          .populate('user')
          .lean();

        if (pendingOrders) {
          await global.helpers.orders.createOrders(
            pendingOrders,
            false,
            module.lib.eventEmitter,
            paymentData.id
          );
        }
      }
    }

    res.sendStatus(200);
  });
};

// in_process
// approved
