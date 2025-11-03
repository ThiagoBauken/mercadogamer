'use strict';

const { InvoiceService } = require('../../helpers/createInvoice/invoice');

const invoiceService = new InvoiceService();

// Define module
module.exports = (module) => {
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
    global.helpers.security.auth(['user']),
    async (req, res, next) => {
      // req._filtersExtra = { user: req.user._id };
      req.query.user = req.user._id;
      try {
        const carts = await global.helpers.database.find(
          req,
          res,
          module.model
        );
        if (Array.isArray(carts.data)) {
          for (let item of carts.data) {
            const stockProduct =
              await global.modules.stockProducts.model.findOne({
                product: item.product._id,
                status: 'available',
              });
            item.product._doc.stockProduct = stockProduct;
          }
        }
        res.send(carts);
      } catch (error) {
        next(error);
      }
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
  module.router.get('/:id', async (req, res, next) => {
    try {
      const cart = await global.helpers.database.findById(
        req,
        res,
        module.model
      );
      res.send(cart.data);
    } catch (error) {
      next(error);
    }
  });

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
    global.helpers.security.auth(['user']),
    async (req, res, next) => {
      try {
        const { product, count } = req.body;

        let selected_product = await global.modules.products.model.findById(
          product
        );

        if (
          selected_product.status !== 'approved' ||
          !selected_product.enabled
        ) {
          res.status(400).send({
            message: 'Este producto esta inhabilitado',
          });
          return;
        }

        if (`${selected_product.user}` === `${req.user._id}`) {
          res.status(400).send({
            message: 'No puede agregar sus propios productos al carrito',
          });
          return;
        } else {
          let cart = await module.model.findOne({
            user: req.user._id,
            product,
          });
          if (cart) {
            res
              .status(400)
              .send({ message: 'Ya tienes este producto en tu carrito.' });
            return;
          } else {
            cart = await module.model.create({
              user: req.user._id,
              product,
              count: count || 1,
            });
          }
          module.lib.eventEmitter.emit(
            'send-socket',
            'check-has-carts',
            true,
            req.user._id
          );
          res.send(cart);
        }
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );

  /* 
    WARNING: THIS ROUTE IS DEPRECATED
  */
  module.router.post(
    '/pay',
    global.helpers.security.auth(['user']),
    async (req, res, next) => {
      try {
        const { balance, userInfo } = req.body;
        const country = await global.modules.countries.model.findById(
          req.user.country
        );

        let _balance = balance / country?.toUSD;

        const getProductPrice = (product) =>
          product.discount ? product.priceWithDiscount : product.price;

        const getProcessingFee = (cart) =>
          (getProductPrice(cart.product) / country?.toUSD / 100) * 4;

        const response = { success: 0, failed: 0 };
        const pendings = [];
        let unitPrice = 0;
        //let totalPrice = 0;

        await global.modules.orderids.model.deleteMany();

        const createOrder = async (cart, userInfo) => {
          for (let i = 0; i < cart.count; i++) {
            try {
              const orderInfo = { ...userInfo };
              const stockProduct =
                await global.modules.stockProducts.model.findOne({
                  product: cart.product._id,
                  status: 'available',
                });
              if (!stockProduct) {
                response.failed++;
                return;
              }
              orderInfo.product = cart.product._id;
              orderInfo.stockProduct = stockProduct._id;
              const pricePaid =
                cart.product.price / country?.toUSD + getProcessingFee(cart);

              orderInfo.pricePaid =
                _balance >= pricePaid ? 0 : pricePaid - _balance;

              orderInfo.status = _balance >= pricePaid ? 'paid' : 'pending';
              orderInfo.paymentMethod =
                _balance >= pricePaid ? 'giftbalance' : 'mercadoPago';
              _balance -= pricePaid;
              orderInfo.toUSD = country.toUSD;
              orderInfo.sellerProfit =
                cart.product.sellerProfit / country.toUSD;
              orderInfo.paidDate = new Date();
              orderInfo.buyer = req.user._id;
              orderInfo.seller = cart.product.user;
              orderInfo.processingFee = getProcessingFee(cart);
              const order = await global.modules.orders.model.create(orderInfo);

              const ordered_id = order._id;
              await global.modules.orderids.model.create({
                order: ordered_id,
                user: req.user._id,
              });

              const product = await global.modules.products.model.findOne({
                _id: order.product,
              });
              // product.stock--;
              // product.sold++;
              // await product.save();

              // if (product.stock === 0 || stockProduct.code) {
              //   stockProduct.status = 'sold';
              //   stockProduct.order = order._id;
              //   await stockProduct.save();
              // }

              orderInfo.paymentMethod === 'mercadoPago' &&
                pendings.push(order._id);

              unitPrice += orderInfo.pricePaid;
              //totalPrice += orderInfo.pricePaid;
              if (userInfo.discountCode) {
                const discountCode = await global.modules.discountCodes.model
                  .findOne({
                    _id: userInfo.discountCode,
                    enabled: true,
                    $or: [{ available: { $gt: 0 } }, { infinite: true }],
                  })
                  .catch(next);

                if (!discountCode)
                  res
                    .status(400)
                    .send({ message: 'Código de descuento incorrecto.' });

                const previousOrderWithDiscountCode =
                  await global.modules.orders.model
                    .findOne({
                      buyer: userInfo.buyer,
                      discountCode: discountCode._id,
                    })
                    .catch(next);

                if (previousOrderWithDiscountCode)
                  res.status(400).send({
                    message: 'Ya has usado este código de descuento.',
                  });

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
              // await module.model.deleteOne(cart);
              // create notification and conversation
              if (order.paymentMethod === 'giftbalance') {
                product.stock--;
                product.sold++;
                await product.save();

                if (product.stock === 0 || stockProduct.code) {
                  stockProduct.status = 'sold';
                  stockProduct.order = order._id;
                  await stockProduct.save();
                }

                await module.model.deleteOne(cart);
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
                const notificationSeller =
                  global.modules.notifications.model.create({
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
                  order.seller
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

                const addedConversations =
                  await global.modules.conversations.model
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
              }
              response.success++;
            } catch (error) {
              response.failed++;
              console.log(error);
            }
          }
        };

        let carts = await module.model.find().populate(['product']);

        for (let cart of carts) {
          await createOrder(cart, userInfo);
        }

        const rest_gift = req.user.gift - balance / country.toUSD;
        await global.modules.users.model
          .updateOne({ _id: req.user.id }, { gift: rest_gift })
          .catch((e) => console.error(e));

        let init_point = '';
        if (unitPrice) {
          const preference = {
            externalReference: JSON.stringify(pendings.join(',')),
            title: 'Mercado Gamer',
            description: 'Compra de products',
            //unitPrice: totalPrice + 25,
            unitPrice,
            quantity: 1,
          };

          const payment = await global.helpers.mp.createPreference(preference);
          init_point = payment.init_point;
          //init_point = payment.sandbox_init_point;
        }

        res.send({ data: init_point, status: response });
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );

  const verifyOrder = async (orderBuilder) => {
    // Check that the order can be created, but do not save it

    const order = new global.modules.orders.model(orderBuilder);
    order.status = 'paid';
    order.paidDate = new Date();
    order.isNew = true;
    await order.validate();
  };

  module.router.post(
    '/payv2',
    global.helpers.security.auth(['user']),
    async (req, res, next) => {
      const carts = await module.model
        .find({
          user: req.user._id,
        })
        .populate('product');
      const { userInfo } = await global.modules.users.model.findById(
        req.user._id
      );

      const { balance } = req.body;

      const country = await global.modules.countries.model.findById(
        req.user.country
      );

      const user = await global.modules.users.model.findOne({
        _id: req.user._id,
      });

      // Chequear que toda esta info este en USD
      if (balance / country.toUSD > user.balance + user.gift) {
        res.status(400).send('No tienes suficiente balance.');
        return;
      }

      let transactionBalanceLeftUSD = balance;

      let unitPrice = 0;
      const externalReference = {
        user,
        balanceUsedUSD: balance,
        carts: [],
      };

      const getProductPrice = (product) =>
        product.discount && product.priceWithDiscount
          ? product.priceWithDiscount
          : product.price;
      /*let discountCode;
      let discountCodeVal;
      if (userInfo.discountCode) {
        discountCode = await global.modules.discountCodes.model.findOne({
          _id: userInfo.discountCode,
          enabled: true,
          $or: [{ available: { $gt: 0 } }, { infinite: true }],
        });

        if (!discountCode) {
          res.status(400).send({ message: 'Código de descuento incorrecto.' });
          return;
        }

        const previousOrderWithDiscountCode =
          await global.modules.orders.model.findOne({
            buyer: userInfo.buyer,
            discountCode: discountCode._id,
          });

        if (previousOrderWithDiscountCode) {
          res.status(400).send({
            message: 'Ya has usado este código de descuento.',
          });
          return;
        }

        await global.modules.discountCodes.model.updateOne(
          { _id: discountCode._id },
          { $inc: { spent: 1, available: -1 } }
        );
        discountCodeVal = discountCode.value;
      }*/

      const itemsAmount = carts.map((c) => c.count).reduce((a, b) => a + b);

      for (let cart of carts) {
        const productPrice = getProductPrice(cart.product);
        const processingFee =
          productPrice * 0.04 +
          (country.processingFee / itemsAmount) * country.toUSD;
        const totalPrice = productPrice + processingFee;
        const stockProduct = await global.modules.stockProducts.model.find({
          status: 'available',
          product: cart.product._id,
        });

        if (!cart.product.alegraId) {
          invoiceService.createProduct(cart.product);
        }

        if (cart.product.stock < cart.count) {
          res.status(400).send('No hay suficiente stock.');
          return;
        }

        const totalGiftUsed =
          balance >= user.gift * country.toUSD
            ? user.gift * country.toUSD
            : balance;
        const totalBalanceUsed =
          balance - totalGiftUsed >= user.balance * country.toUSD
            ? user.balance * country.toUSD
            : balance - totalGiftUsed;

        for (let i = 0; i < cart.count; i++) {
          /*let discountCodePrice;
          let discountApplied = false;

          if (discountCode && discountCodeVal > 0) {
            let prevPrice = totalPrice;
            if (discountCode.type === 'percentage') {
              totalPrice = (totalPrice / 100) * discountCode.value;
            } else {
              if (totalPrice >= discountCodeVal) {
                totalPrice -= discountCodeVal;
                discountCodeVal = 0;
              } else {
                totalPrice = 0;
                discountCodeVal -= totalPrice;
              }
            }
            discountCodePrice = prevPrice - totalPrice;
            discountApplied = true;
          }*/

          const retirementType = stockProduct[0]?.retirementType;
          const pricePaid =
            transactionBalanceLeftUSD >= totalPrice
              ? 0
              : totalPrice - transactionBalanceLeftUSD;

          const balanceData = {
            giftUsed: 0,
            balanceUsed: 0,
          };

          const calc = transactionBalanceLeftUSD - totalBalanceUsed;
          const remainingGift = calc > 0 ? calc : 0;
          const remainingBalance =
            transactionBalanceLeftUSD > totalBalanceUsed
              ? totalBalanceUsed
              : transactionBalanceLeftUSD;

          if (remainingGift > totalPrice) {
            balanceData.giftUsed = totalPrice;
          } else {
            if (remainingGift > 0) {
              balanceData.giftUsed = remainingGift;
            }

            if (remainingBalance > 0) {
              if (remainingBalance > totalPrice - balanceData.giftUsed) {
                balanceData.balanceUsed = totalPrice - balance.giftUsed;
              } else {
                balanceData.balanceUsed = remainingBalance;
              }
            }
          }

          // Saved in ARS just for consistency
          balanceData.giftUsed = balanceData.giftUsed / country.toUSD;
          balanceData.balanceUsed = balanceData.balanceUsed / country.toUSD;
          // console.log('error===>', userInfo);
          const ref = {
            cart_id: cart._id,
            orderBuilder: {
              ...userInfo,
              ...balanceData,
              product: cart.product._id,
              stockProduct:
                retirementType === 'automatic'
                  ? stockProduct[i]._id
                  : stockProduct[0]._id,
              pricePaid: pricePaid / country.toUSD,
              paymentMethod:
                transactionBalanceLeftUSD >= totalPrice
                  ? 'giftbalance'
                  : 'mercadoPago',
              productPrice: productPrice / country.toUSD,
              toUSD: country.toUSD,
              sellerProfit: cart.product.sellerProfit / country.toUSD,
              processingFee: processingFee / country.toUSD,
              buyer: req.user._id,
              seller: cart.product.user,
              publicationType: cart.product.publicationType,
            },
          };

          /*if (discountApplied) {
            ref.discountCodePrice = discountCodePrice;
            ref.discountCode = discountCode._id;
          }*/

          if (transactionBalanceLeftUSD > totalPrice) {
            transactionBalanceLeftUSD -= totalPrice;
          } else {
            unitPrice += totalPrice - transactionBalanceLeftUSD;
            transactionBalanceLeftUSD = 0;
          }

          externalReference.carts.push(ref);
        }
      }

      const priceWithFees = externalReference.carts
        .map((c) => c.productPrice + c.processingFee)
        .reduce((a, b) => a + b);

      if (
        Math.abs(priceWithFees - externalReference.balanceUsedUSD - unitPrice) >
        1
      ) {
        res.status(400).send('Error al pagar los carritos.');
        return;
      }

      if (priceWithFees < balance) {
        res
          .status(400)
          .send(
            'No puedes utilizar mas balance que lo que sale la transaccion.'
          );
        return;
      }

      // Transform unit price to ARS
      unitPrice = unitPrice / country.toUSD;
      // ********* Invoice and verify  start ******** //
      // try {
      //   await Promise.all(
      //     externalReference.carts.map(({ orderBuilder }) =>
      //       verifyOrder(orderBuilder)
      //     )
      //   );
      // } catch (e) {
      //   console.error(e);
      //   res.status(400).send();
      //   return;
      // }

      // try {
      //   // All of them have the same user data, so we just have to get the first one
      //   const { orderBuilder } = externalReference.carts[0];
      //   console.log(orderBuilder);
      //   await invoiceService.syncClient(orderBuilder);
      // } catch (e) {
      //   console.error(e);
      //   res.status(400).send();
      //   return;
      // }
      // ********* Invoice and verify  end ******** //

      // Floating point precision does not really allow us to do an exact comparison
      if (unitPrice < 5 && unitPrice >= 0) {
        await global.helpers.orders.createOrders(
          externalReference,
          true,
          module.lib.eventEmitter
        );

        res.send({
          data: '/purchase',
          status: { success: externalReference.carts.length, failed: 0 },
        });
      } else {
        const pendingOrder = await global.modules.pendingOrders.model.create(
          externalReference
        );

        const preference = {
          externalReference: pendingOrder._id,
          title: 'Mercado Gamer',
          description: 'Compra de products',
          unitPrice,
          quantity: 1,
        };
        const payment = await global.helpers.mp.createPreference(preference);

        res.send({
          data: payment.init_point,
          status: { success: 0, failed: 0 },
        });
      }
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
    global.helpers.security.auth(['user']),
    async (req, res, next) => {
      global.helpers.database
        .update(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
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
    global.helpers.security.auth(['user']),
    (req, res, next) => {
      global.helpers.database
        .delete(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );
};
