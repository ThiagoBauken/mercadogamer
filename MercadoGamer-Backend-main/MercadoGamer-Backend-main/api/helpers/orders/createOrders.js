const mongoose = require('mongoose');
const {
  getSellerPoints,
  getProductPriority,
} = require('../../utils/productRating');
const { InvoiceService } = require('../createInvoice/invoice');

const invoiceService = new InvoiceService();

const createInvoice = async (orderBuilder, product, order) => {
  try {
    await invoiceService.createInvoice(orderBuilder, product, order);
  } catch (e) {
    console.error(e);
  }
};

module.exports = (helper) => {
  return async (pendingOrders, paidWithBalance, eventEmitter, paymentId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { balanceUsedUSD, user: userIdOrObj } = pendingOrders;

      const user = await global.modules.users.model.findOne({
        _id:
          typeof userIdOrObj === 'string'
            ? userIdOrObj
            : userIdOrObj._id || userIdOrObj.id,
      });

      if (balanceUsedUSD && balanceUsedUSD > 0) {
        const country = await global.modules.countries.model.findOne({
          _id: user.country,
        });

        let balance = balanceUsedUSD / country.toUSD;

        if (balance > user.balance + user.gift) {
          throw new Error(
            `More balance is being used that the one available - ${balance} - ${
              user.balance + user.gift
            } - ${user._id}`
          );
        }

        if (user.gift > balance) {
          user.gift -= balance;
          balance = 0;
        } else {
          balance -= user.gift;
          user.gift = 0;
        }

        if (balance > 0) {
          if (user.balance > balance) {
            user.balance -= balance;
          } else {
            user.balance = 0;
          }
        }

        await user.save();
      }

      const ordersIds = [];

      if (pendingOrders.carts.length > 0) {
        await global.modules.orderids.model.deleteMany({
          user: pendingOrders.user,
        });

        for (let pOrder of pendingOrders.carts) {
          const { cartId, orderBuilder } = pOrder;

          const order = new global.modules.orders.model(orderBuilder);
          order.status = 'paid';
          order.paidDate = new Date();
          order.isNew = true; // THIS INDICATES THAT THE DOCUMENT IS NEW AND HAS TO BE INSERTED

          if (paymentId) {
            order.paymentId = paymentId;
          }

          await order.save();
          ordersIds.push(order._id);

          await global.modules.orderids.model.create({
            order: order._id,
            user: order.buyer,
          });

          const product = await global.modules.products.model.findOne({
            _id: orderBuilder.product,
          });

          if (!paidWithBalance) {
            createInvoice(orderBuilder, product, order);
          }

          product.stock--;
          product.sold++;

          const stockProduct = await global.modules.stockProducts.model.findOne(
            {
              _id: orderBuilder.stockProduct,
              status: 'available',
            }
          );

          if (stockProduct?.code || product.stock === 0) {
            stockProduct.status = 'sold';
            stockProduct.order = order._id;
            await stockProduct.save();
          }
          await global.modules.carts.model.deleteOne({ _id: cartId });

          // Create notifications and chat

          const notification = await global.modules.notifications.model.create({
            user: order.buyer,
            title: 'Tu compra fue realizada',
            description:
              'Tu pago llego con éxito, ya puedes acceder a tu compra.',
            action: 'productPaid',
            payload: {
              id: order._id,
            },
          });
          eventEmitter.emit('send-notification', notification, order.buyer);
          const notificationSeller =
            await global.modules.notifications.model.create({
              user: order.seller,
              title: 'Nueva venta',
              description: 'Tenés una nueva venta realizada.',
              action: 'receiveSuccess',
              payload: {
                id: order._id,
              },
            });
          eventEmitter.emit(
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
            await global.modules.conversations.model.create(conversation);

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

          // If the user buys 2 items of the same product we would be doing this twice
          // Not the best but it is what we can do now

          const seller = await global.modules.users.model.findOne({
            _id: order.seller,
          });
          product.priority = getProductPriority(product, seller);

          await product.save();
        }
      }

      if (!paidWithBalance) {
        await global.modules.pendingOrders.model.updateOne(
          {
            _id: pendingOrders._id,
          },
          {
            orders: ordersIds,
          }
        );
      }

      await global.modules.carts.model.deleteMany({
        user: pendingOrders.carts[0].orderBuilder.buyer,
      });

      session.commitTransaction();
    } catch (e) {
      console.error(e);
      session.abortTransaction();
    }
  };
};
