'use strict';

const moment = require('moment');

// Define schema
module.exports = (module) => {
  /**
   * Schema
   */
  module.schema = new global.database.mongodb.mongoose.Schema(
    {
      id: { type: String },
      status: {
        type: String,
        enum: [
          'pending',
          'paid',      // legado — equivale a 'held' no novo fluxo (mantido por compat)
          'held',      // novo: pagamento confirmado, dinheiro em escrow aguardando releaseScheduledAt
          'released',  // novo: escrow liberado pro vendedor (balance incrementado)
          'cancelled',
          'finished',  // alias antigo de 'released' — mantido por compat com queries existentes
          'returned',
          'complaint', // disputa aberta — pausa release até resolução
        ],
        default: 'pending',
        index: true,
      },
      claimDate: { type: Date },
      paidDate: { type: Date },
      cancelDate: { type: Date },
      returnedDate: { type: Date },

      // ── ESCROW (P0.2) ────────────────────────────────────────────────
      // Fluxo: pagamento confirmado → status=held + heldAt + releaseScheduledAt
      // Cron release-escrow roda 1x/hora e libera quando releaseScheduledAt <= now
      // e não há complaint/disputa aberta.
      heldAt: { type: Date },
      releaseScheduledAt: { type: Date, index: true },
      releasedAt: { type: Date },
      holdDays: { type: Number, default: 3 }, // dias entre held → released
      escrowAmount: { type: Number }, // = sellerProfit no momento do hold (R$)
      releaseBlocked: { type: Boolean, default: false }, // true = disputa aberta, não liberar
      paymentMethod: {
        type: String,
        enum: ['mercadoPago', 'giftbalance'],
        default: 'mercadoPago',
      },
      discountCode: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'discountCodes',
      },
      stockProduct: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'stockProducts',
        required: true,
      },
      product: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
      buyer: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      seller: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      withdrawal: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'withdrawals',
      },
      currency: {
        type: String,
        enum: ['ARS'],
        default: 'ARS',
      },
      giftUsed: { type: Number },
      balanceUsed: { type: Number },
      emailAddress: { type: String },
      firstName: { type: String },
      lastName: { type: String },
      postalCode: { type: Number },
      phoneNumber: { type: Number },
      address: { type: String },
      processingFee: { type: Number },
      productPrice: { type: Number },
      country: {
        type: global.database.mongodb.mongoose.Schema.Types.ObjectId,
        ref: 'countries',
      },
      pricePaid: { type: Number },
      sellerProfit: { type: Number },
      discountCodePrice: { type: Number },
      toUSD: { type: Number },
      number: { type: Number },
      initPoint: { type: Object },
      firstSale: { type: Boolean },
      paymentId: {
        type: String,
      },
      publicationType: {
        type: String,
        enum: ['free', 'normal', 'pro'],
      },
      invoiceId: { type: String },
      reimbursed: {
        type: Boolean,
        default: false,
      },
      identification: {
        type: String,
      },
      city: {
        type: String,
      },
      province: {
        type: String,
      },
    },
    { timestamps: true }
  );

  /*
    module.schema.pre('save', (order) => {
      if (order.reimbursed && order.status !== 'cancelled') {
        throw new Error('An error can be reimbursed only if it is cancelled');
      }
    });
  */

  module.schema.post('validate', async (order) => {
    if (!order.number || order.number == 0) {
      let counter = await global.modules.counters.model.findOneAndUpdate(
        { name: 'orders' },
        { $inc: { sequence: 1 } },
        { returnNewDocument: true }
      );

      if (counter && counter.sequence == 1)
        counter = await global.modules.counters.model.findOneAndUpdate(
          { name: 'orders' },
          { $inc: { sequence: 1 } },
          { returnNewDocument: true }
        );

      if (!counter)
        counter = await global.modules.counters.model.create({
          name: 'orders',
          sequence: 1,
        });

      order.number = String(counter.sequence);
    }
  });

  // ⚠️ REMOVIDO: hook post('find') que fazia release lazy em cada query.
  // Era anti-pattern: efeito colateral em leitura, sem garantia de execução, sem rate-limit.
  // Substituído por crons/escrow/release-escrow.js que roda a cada hora.
  // Mantido o trecho original comentado abaixo por referência histórica.
  /*
  module.schema.post('find', async (orders) => {
    const now = moment();
    for (let order of orders) {
      if (!order.claimDate && order.status === 'paid' && order.paidDate) {
        const finishData = moment(order.paidDate).add({ days: 3 });
        if (finishData < now) {
          order.status = 'finished';
          order.save();
          await global.modules.users.model.updateOne(
            {
              _id:
                typeof order.seller === 'object'
                  ? order.seller._id
                  : order.seller,
            },
            {
              $inc: { balance: order.sellerProfit },
            }
          );
          // const notification = await global.modules.notifications.model
          //   .create({
          //     user: order.buyer,
          //     title: 'Tu compra se completó',
          //     description:
          //       'Tu compra finalizó debido a que transcurrieron los 3 días disponibles para realizar un reclamo.',
          //     action: 'purchaseSuccess',
          //     payload: {
          //       id: order._id,
          //     },
          //   })
          //   .catch((e) => console.log(e));
          // module.lib.eventEmitter.emit(
          //   'send-notification',
          //   notification,
          //   order.buyer
          // );
          // const notificationSeller = await global.modules.notifications.model
          //   .create({
          //     user: order.seller,
          //     title: '¡Tu venta se concretó!',
          //     description:
          //       'El comprador indicó que recibió el producto, tu dinero ya esta en tu balance para retirar.',
          //     action: 'saleSuccess',
          //     payload: {
          //       id: order._id,
          //     },
          //   })
          //   .catch((e) => console.log(e));
          // module.lib.eventEmitter.emit(
          //   'send-notification',
          //   notificationSeller,
          //   order.seller
          // );
        }
      }
    }
  });
  */ // ← fim do bloco comentado (substituído por crons/escrow/release-escrow.js)
};
