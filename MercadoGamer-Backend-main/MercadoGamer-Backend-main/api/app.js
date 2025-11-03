import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routes from './routes';
import multipart from 'connect-multiparty';
import moment from 'moment';
import mongoose from 'mongoose';

// get the reference of EventEmitter class of events module
require('dotenv').config();
const AWS = require('aws-sdk');

var events = require('events');

//create an object of EventEmitter class by using above reference
const em = new events.EventEmitter();
const cors = require('cors');

import settings from './config/settings';
import { getProductPriority, getSellerPoints } from './utils/productRating';

const ServerUtil = require('./utils/serverSocket');

const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();

const cert = fs.readFileSync('./certificate.crt');
const ca = fs.readFileSync('./ca_bundle.crt');
const key = fs.readFileSync('./private.key');

// Define garbage collector
if (global.gc) {
  setInterval(() => {
    global.gc();
  }, 30000);
}

// Define HttpError class
class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Define DbError class
class DbError extends Error {
  constructor(message, code) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

// (+) LIBRARIES

// Define lib
const lib = {};

// Define http error
lib.httpError = (status, message) => {
  // Define result
  let result = new Error();

  // Define result status
  result.status = status || 400;
  result.message = message;

  // Return result
  return result;
};

// Define db error
lib.dbError = (code, message) => {
  // Define result
  let result = new Error(message);

  // Define result status
  result.code = code || -1000;

  // Return result
  return result;
};

// Define lib jsonwebtoken
lib.jsonwebtoken = require('jsonwebtoken');

// Define lib crypto
lib.bcrypt = require('bcrypt');

// Define lib crypto
lib.crypto = require('crypto');

// Define lib uuid
lib.uuid = require('uuid');

// Define lib fs
lib.fs = require('fs');

// Define lib url
lib.url = require('url');

// Define lib moment
lib.moment = require('moment');

// Define lib password generator
lib.passwordGenerator = require('password-generator');

// Define lib nodeMailer
lib.nodemailer = require('nodemailer');

// Define lib cron
lib.cron = require('node-cron');

// Define lib trae
lib.trae = require('trae');

// Define lib mercado pago
lib.mercadopago = require('mercadopago');

// Define events
lib.events = require('events');
lib.eventEmitter = new lib.events.EventEmitter();

// Define lib utils
lib.utils = {
  // Define method
  // to normalize file name (the-name -> theName)
  normalizeFileName: (value) => {
    return value
      .replace(/\.js$/, '')
      .replace(/\./g, ' ')
      .replace(/_/g, ' ')
      .replace(/\W+(.)/g, function (match, chr) {
        return chr.toUpperCase();
      });
  },
};

// Define lib mongoose
lib.mongodb = {};
lib.mongodb.mongoose = require('mongoose');
lib.mongodb.plugins = [];
lib.mongodb.plugins.push(require('mongoose-unique-validator'));
lib.mongodb.plugins.push(require('@meanie/mongoose-to-json'));

// (-) LIBRARIES

let options = {
  cert: cert,
  ca: ca,
  key: key,
};
const server = http.createServer(app);
// const server = app.listen(settings.portHttps)
// https.createServer(options, app).listen(settings.portHttps);
// https.createServer(options, app).listen(settings.portHttps);
// https.createServer(options, app).listen(settings.portSIO);

app.use(function (req, res, next) {
  if (process.env.NODE_ENV && process.env.NODE_ENV == 'test') {
    req.settings = require('./test/config/settings');
  } else {
    req.settings = require('./config/settings');
  }
  return next();
});

// cache control error 304
app.disable('etag');

// CORS
var cors_origin = {
  origin: [
    'http://localhost:4200',
    'http://localhost:4300',
    'http://localhost:5001',
  ],
};
app.use(cors(cors_origin));
// app.use(cors());
app.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Origin',
    'http://localhost:4200',
    'http://localhost:4300'
  );
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Authorization, Accept, x-access-token, x-accepted-format'
  );
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

app.use(
  multipart({
    uploadDir: '/tmp/',
  })
);

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true,
  })
);

app.use(cookieParser());

// (+) DATABASE

global.database = {};
global.database.mongodb = lib.mongodb;

// (-) DATABASE

// (+) UTILS
global.utils = {};
global.utils.eventEmitter = em;
global.utils.twoFactor = require('../api/utils/twoFactor');
global.utils.emailTemplate = require('../api/utils/emailTemplate');
global.utils.mongooseFunctions = require('../api/utils/mongooseFunctions');
// global.utils.mathFunctions = require('../api/utils/mathFunctions')
// (-) UTILS

// (+) CRONS

// Define crons
let cronsLoad = {};
let cronsPath = __dirname + '/crons';
lib.fs.readdirSync(cronsPath).forEach((cronCode) => {
  let cronName = lib.utils.normalizeFileName(cronCode);
  let cronPath = cronsPath + '/' + cronCode;
  lib.fs.readdirSync(cronPath).forEach((cronFile) => {
    if (cronFile.match(/\.js$/)) {
      let methodName = lib.utils.normalizeFileName(cronFile);
      cronsLoad[cronName] = cronsLoad[cronName] || {};
      cronsLoad[cronName][methodName] = require(cronPath + '/' + cronFile);
    }
  });
});

// Verify crons
global.crons = {};
for (let h in cronsLoad) {
  global.crons[h] = {};
  global.crons[h].settings = settings;
  global.crons[h].modules = global.modules;
  global.crons[h].helpers = global.helpers;
  global.crons[h].lib = lib;
  for (let f in cronsLoad[h]) {
    if (cronsLoad[h][f] && typeof cronsLoad[h][f] == 'function') {
      try {
        global.crons[h][f] = {};
        global.crons[h][f].name = `${h}.${f}`;
        global.crons[h][f].function = cronsLoad[h][f](
          global.crons[h],
          global.crons[h][f].name
        );
        global.crons[h][f].task = lib.cron.schedule(
          global.crons[h].period,
          global.crons[h][f].function,
          {
            scheduled: global.crons[h].enabled,
            timezone: 'America/Buenos_Aires',
          }
        );
        console.info('Cron "' + global.crons[h][f].name);
        console.info('Cron "' + h + '.' + f + '" loaded');
      } catch (error) {
        console.error('Cron "' + h + '.' + f + '" not loaded');
        console.error(error);
      }
    }
  }
}
// (-) CRONS

// (+) HELPERS

// Define helpers
let helpersLoad = {};
let helpersPath = __dirname + '/helpers';
lib.fs.readdirSync(helpersPath).forEach((helperCode) => {
  let helperName = lib.utils.normalizeFileName(helperCode);
  let helperPath = helpersPath + '/' + helperCode;
  lib.fs.readdirSync(helperPath).forEach((helperFile) => {
    if (helperFile.match(/\.js$/)) {
      let methodName = lib.utils.normalizeFileName(helperFile);
      helpersLoad[helperName] = helpersLoad[helperName] || {};
      helpersLoad[helperName][methodName] = require(helperPath +
        '/' +
        helperFile);
    }
  });
});

// Verify helpers
global.helpers = {};
for (let h in helpersLoad) {
  global.helpers[h] = {};
  global.helpers[h].settings = settings;
  // global.helpers[h].server = server;
  global.helpers[h].router = express.Router();
  global.helpers[h].app = app;
  // global.helpers[h].db = db;
  global.helpers[h].lib = lib;
  for (let f in helpersLoad[h]) {
    if (helpersLoad[h][f] && typeof helpersLoad[h][f] == 'function') {
      try {
        global.helpers[h][f] = helpersLoad[h][f](global.helpers[h]);
        console.info('Helper "' + h + '.' + f + '" loaded');
      } catch (error) {
        console.error('Helper "' + h + '.' + t + '" not loaded');
        console.error(error);
      }
    }
  }
}

// (-) HELPERS

// (+) MODULES

// Define modules
let modulesLoad = {};
let modulesPath = __dirname + '/modules';
lib.fs.readdirSync(modulesPath).forEach((moduleCode) => {
  let moduleName = lib.utils.normalizeFileName(moduleCode);
  let modulePath = modulesPath + '/' + moduleCode;
  lib.fs.readdirSync(modulePath).forEach((moduleFile) => {
    if (moduleFile.match(/\.js$/)) {
      let methodName = lib.utils.normalizeFileName(moduleFile);
      modulesLoad[moduleName] = modulesLoad[moduleName] || {};
      modulesLoad[moduleName][methodName] = require(modulePath +
        '/' +
        moduleFile);
    }
  });
});

// Verify modules
global.modules = {};
for (let m in modulesLoad) {
  global.modules[m] = {};
  global.modules[m].settings = settings;
  // global.modules[m].server = server;
  global.modules[m].router = express.Router();
  global.modules[m].app = app;
  // global.modules[m].db = db;
  global.modules[m].lib = lib;
  for (let t in modulesLoad[m]) {
    if (modulesLoad[m][t] && typeof modulesLoad[m][t] == 'function') {
      try {
        modulesLoad[m][t](global.modules[m]);
        console.info('Module "' + m + '.' + t + '" loaded');
      } catch (error) {
        console.error('Module "' + m + '.' + t + '" not loaded');
        console.error(error);
      }
    }
  }
}

// Build models
for (let m in global.modules) {
  if (global.modules[m].schema) {
    for (let p of global.database.mongodb.plugins)
      global.modules[m].schema.plugin(p);
    global.modules[m].model = global.database.mongodb.mongoose.model(
      m,
      global.modules[m].schema
    );
  }
}

// Verify modules models events
for (let m in global.modules) {
  if (global.modules[m].model && global.modules[m].model.beforeExecuteLoad) {
    global.modules[m].model.beforeExecuteLoad();
  }
}

// Define api routes
for (let m in global.modules) {
  if (global.modules[m].router) {
    app.use('/api/' + m + '/', global.modules[m].router);
  }
}

// (-) MODULES

// (+) SOCKET IO

lib.socketio = require('socket.io');

const io = lib.socketio(server, {
  origins: '*:*',
});

global.checkout = {};
io.on('connection', function (socket) {
  console.log('connected');
  socket.on('user-login', (id) => {
    socket.join(id);
    console.log('joined user ' + id);
  });

  socket.on('enter-conversation', (conversation) => socket.join(conversation));

  socket.on('leave-conversation', (conversation) => socket.leave(conversation));

  socket.on('read-message', async (id) => {
    await global.modules.messages.model
      .findByIdAndUpdate(id, {
        read: true,
      })
      .catch((e) => console.log(e));
  });

  socket.on('test-socket', (a) => {
    io.in(a).emit('test-socket', 'recibido desde la api');
  });

  socket.on('new-message', async (payload) => {
    // console.log(payload);
    const message =
      (await global.helpers.chat
        .createMessage(payload)
        .catch((e) => console.log(e))) || {};

    const order = await global.modules.orders.model.findById(payload.order);
    const conversation = await global.modules.conversations.model.findById(
      message.conversation
    );

    const messagePopulated = await global.modules.messages.model
      .findById(message._id)
      .populate('author')
      .catch((e) => console.log(e));
    io.in(message.conversation).emit('refresh-messages', messagePopulated);

    const notifications = await global.modules.notifications.model
      .find({
        user: order.buyer,
        'payload.id': payload.order,
        action: 'newMessage',
      })
      .sort({ _id: -1 })
      .limit(1)
      .catch((e) => console.log(e));

    if (
      payload.author !== notifications[0]?.user.toString() &&
      conversation.referenceType === 'users'
    ) {
      if (notifications.length > 0) {
        const date = moment(new Date());
        const notification_date = moment(notifications[0]?.createdAt);
        const diff = date.diff(notification_date);

        if (diff > 600000) {
          const newMessageNotification =
            await global.modules.notifications.model
              .create({
                user: order.buyer,
                title: '¡IMPORTANTE! Tenes nuevos mensajes en tu compra.',
                description:
                  'El vendedor se contacto con vos por el chat para realizar la entrega del producto. Hace click en el enlace para ir al chat de la orden.',
                action: 'newMessage',
                payload: {
                  id: payload.order,
                },
              })
              .catch((e) => console.log(e));

          lib.eventEmitter.emit(
            'send-notification',
            newMessageNotification,
            order.buyer
          );
        } else {
          return;
        }
      } else {
        const newMessageNotification = await global.modules.notifications.model
          .create({
            user: order.buyer,
            title: '¡IMPORTANTE! Tenes nuevos mensajes en tu compra.',
            description:
              'El vendedor se contacto con vos por el chat para realizar la entrega del producto. Hace click en el enlace para ir al chat de la orden.',
            action: 'newMessage',
            payload: {
              id: payload.order,
            },
          })
          .catch((e) => console.log(e));

        lib.eventEmitter.emit(
          'send-notification',
          newMessageNotification,
          order.buyer
        );
      }
    } else {
      console.log('not send');
    }
  });

  socket.on('finish-order', async (review) => {
    if (review.roleReviewed === 'seller' || review.info === 'finishedByAdmin') {
      if (review.roleReviewed === 'seller') {
        await global.modules.reviews.model
          .create(review)
          .catch((e) => console.log(e));
      }

      const order = await global.modules.orders.model
        .findById(review.order)
        .populate('product')
        .catch((e) => console.log(e));

      const conversations = await global.modules.conversations.model
        .find({ reference: review.order, referenceType: { $ne: 'users' } })
        .catch((e) => console.log(e));

      const prevUserOrders = await global.modules.orders.model
        .find({ buyer: order.buyer, status: 'finished' })
        .catch((e) => console.log(e));

      for (const conversation of conversations) {
        io.in(conversation._id).emit(
          'order-finished',
          prevUserOrders.length ? true : false
        );
      }

      let description =
        'Tu compra finalizó debido a que transcurrieron los 3 días disponibles para realizar un reclamo.';

      if (review.info === 'finishedByAdmin') {
        description =
          'Tu compra finalizó debido a que fue finalizada por un administrador.';
      }

      const notification = await global.modules.notifications.model
        .create({
          user: order.buyer,
          title: 'Tu compra se completó',
          description,
          action: 'purchaseSuccess',
          payload: {
            id: order._id,
          },
        })
        .catch((e) => console.log(e));

      lib.eventEmitter.emit('send-notification', notification, order.buyer);

      const notificationSellerData = {
        user: order.seller,
        title: 'Nueva venta',
        description: 'Tenés una nueva venta realizada.',
        action: 'saleSuccess',
        payload: {
          id: order._id,
        },
      };

      const notificationSeller = await global.modules.notifications.model
        .create(notificationSellerData)
        .catch((e) => console.log(e));

      lib.eventEmitter.emit(
        'send-notification',
        notificationSeller,
        order.seller
      );

      const user = await global.modules.users.model
        .findById(review.qualified || order.seller)
        .catch((e) => console.log(e));

      if (user && order.status !== 'finished') {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          user.balance += order.sellerProfit;
          order.status = 'finished';
          const promises = [order.save(), user.save()];

          if (review.roleReviewed === 'seller') {
            promises.push(handleReview(review));
          }

          await Promise.all(promises);
          session.commitTransaction();
        } catch (e) {
          console.error(e);
          session.abortTransaction();
        }
      }
      io.in(review.qualifier).emit('finish-order', 'success');
    }
  });

  socket.on('cancel-order', async (orderId) => {
    const order = await global.modules.orders.model
      .findByIdAndUpdate(orderId, {
        status: 'cancelled',
        cancelDate: Date.now(),
      })
      .catch((e) => console.log(e));

    io.in(order.buyer).emit('order-cancelled');
    io.in(order.seller).emit('order-cancelled');

    if (order.discountCode)
      await global.modules.discountCodes.model
        .updateOne(
          { _id: order.discountCode },
          { $inc: { spent: -1, available: 1 } }
        )
        .catch((e) => console.log(e));

    await global.modules.stockProducts.model
      .updateOne(
        { _id: order.stockProduct },
        { status: 'available', order: null }
      )
      .catch((e) => console.log(e));

    await global.modules.products.model
      .updateOne({ _id: order.product }, { $inc: { stock: 1, sold: -1 } })
      .catch((e) => console.log(e));

    var buyerInfo;
    buyerInfo = await global.modules.users.model
      .findById(order.buyer)
      .catch((e) => console.log(e));

    var sellerInfo;
    sellerInfo = await global.modules.users.model
      .findById(order.seller)
      .catch((e) => console.log(e));

    await global.modules.users.model.updateOne(
      {
        _id: order.buyer,
      },
      {
        $set: {
          gift: buyerInfo.gift + order.giftUsed,
          balance: buyerInfo.balance + order.balanceUsed,
        },
      }
    );
  });

  socket.on('claim-order', async (issue) => {
    const order = await global.modules.orders.model
      .findByIdAndUpdate(issue.order, {
        status: 'complaint',
        claimDate: Date.now(),
      })
      .populate(['buyer', 'seller'])
      .catch((e) => console.log(e));

    io.in(order?.buyer._id).emit('order-claimed');

    await global.modules.issues.model
      .create(issue)
      .catch((e) => console.log(e));
    io.in(order?.seller._id).emit('order-claimed');

    /**
     *
     * - Usuario: Enviar mensaje al administrador
     * - Administrador: Enviar mensaje al usuario
     *
     */

    const motives = {
      mistake: 'Me equivoqué con la compra',
      undelivered: 'No se entregó el producto',
      notWorking: 'El producto no funciona o está vencido',
    };

    const buyerConversation =
      (await global.modules.conversations.model
        .findOne({ reference: issue.order, referenceType: 'buyer' })
        .catch((e) => console.log(e))) || {};

    const buyerMessage = await global.helpers.chat
      .createMessage({
        conversation: buyerConversation._id,
        body: `Motivo del reclamo: ${
          motives[issue.motive]
        }. Descripción del usuario: "${issue.description}"`,
        author: order?.buyer._id,
        authorName: order?.buyer.firstName + ' ' + order?.buyer.lastName,
      })
      .catch((e) => console.log(e));

    const buyerMessagePopulated = await global.modules.messages.model
      .findById(buyerMessage._id)
      .populate('author')
      .catch((e) => console.log(e));

    io.in(buyerMessage.conversation).emit(
      'refresh-messages',
      buyerMessagePopulated
    );

    const buyerNotification = await global.modules.notifications.model
      .create({
        user: null,
        title: buyerMessage.authorName,
        description: buyerMessage.body,
        action: 'newMessage',
        payload: {
          id: issue.order,
        },
      })
      .catch((e) => console.log(e));

    const sellerConversation = await global.modules.conversations.model
      .findOne({ reference: issue.order, referenceType: 'seller' })
      .catch((e) => console.log(e));

    const sellerMessage = await global.helpers.chat
      .createMessage({
        conversation: sellerConversation._id,
        body: `Has recibido un reclamo por el siguiente motivo: ${
          motives[issue.motive]
        }. Descripción del usuario: "${issue.description}"`,
        author: null,
        authorName: 'Administrador',
      })
      .catch((e) => console.log(e));

    io.in(sellerMessage.conversation).emit('refresh-messages', sellerMessage);

    const sellerNotification = await global.modules.notifications.model
      .create({
        user: order.seller._id,
        title: 'Tenes un nuevo reclamo',
        description: 'Hace click para revisar el reclamo abierto.',
        action: 'ClaimReceive',
        payload: {
          id: issue.order,
        },
      })
      .catch((e) => console.log(e));
    lib.eventEmitter.emit(
      'send-notification',
      sellerNotification,
      order.seller._id
    );
    // io.in(order.seller._id).emit('user-notification', sellerNotification);
  });

  socket.on('update-code', async (a) => {
    socket.broadcast.emit('reset-code', a);
  });

  socket.on('start-checkout', (id) => {
    global.checkout[id] = setTimeout(async () => {
      global.utils.mongooseFunctions.findManyAndPreRemove(
        global.modules.carts.model,
        { user: id }
      );
    }, 5 * 60 * 1000);
  });

  socket.on('stop-checkout-time', (id) => {
    clearTimeout(global.checkout[id]);
  });

  socket.on('get-checkout-time', async (id) => {
    io.in(id).emit('order-finished', prevUserOrders.length ? true : false);
  });

  socket.on('check-has-carts', async (id) => {
    const result = await global.modules.carts.model.find({ user: id });
    io.in(id).emit('check-has-carts', result?.length ? true : false);
  });
});

const handleReview = async (review) => {
  const qualified = await global.modules.users.model
    .findOne({ _id: review.qualified })
    .catch((e) => console.log(e));

  const prevQualificationTotal =
    qualified[review.roleReviewed + 'Qualification'] *
      qualified[review.roleReviewed + 'TotalQualifications'] +
    review.qualification;

  qualified[review.roleReviewed + 'Qualification'] =
    prevQualificationTotal /
    (qualified[review.roleReviewed + 'TotalQualifications'] + 1);

  qualified[review.roleReviewed + 'TotalQualifications']++;

  await qualified.save();

  if (review.roleReviewed !== 'seller') return;

  const products = await global.modules.products.model
    .find({ user: review.qualified, enabled: true, status: 'approved' })
    .catch((e) => console.log(e));

  const promises = products.map(async (product) => {
    product.priority = getProductPriority(product, qualifed);
    await product.save();
  });

  await Promise.allSettled(promises);
};

lib.eventEmitter.on('send-socket', (socketEvent, message, user) => {
  io.in(user).emit(socketEvent, message);
});
/**
 *                    Actualizar el usuario en la aplicacion
 *
 */
lib.eventEmitter.on('update-user', async (userId) => {
  const user = await global.modules.users.model
    .findOne({ _id: userId })
    .catch((e) => console.log(e));

  let completeUser = user.toJSON();

  completeUser.token = lib.jsonwebtoken.sign(
    completeUser,
    settings.token.secret
  );

  io.in(userId).emit('update-user', completeUser);
});

/**
 *                    MANDAR UNA NOTIFICACIÓN
 *
 * - Si es para un usuario en especifico
 * module.lib.eventEmitter.emit('send-notification', notification, user);
 *
 * - Si es para todos
 * module.lib.eventEmitter.emit('send-notification', notification);
 *
 */

lib.eventEmitter.on('send-notification', async (notification, user) => {
  user
    ? io.in(user).emit('user-notification', notification)
    : io.emit('user-notification', notification);

  if (
    user &&
    !notification.notMail &&
    !['saleSuccess'].includes(notification.action) &&
    notification.title
  ) {
    const sendUser = await global.modules.users.model.findById(user);

    global.helpers.mail
      .send({
        email: sendUser.emailAddress,
        html: global.utils.emailTemplate.notificationEmailTemplate(
          notification.title,
          notification.description,
          [('productRejected', 'productAccepted')].includes(notification.action)
            ? 'dashboard/inventory'
            : ['receiveSuccess', 'saleSuccess'].includes(notification.action)
            ? 'dashboard/sale'
            : ['productPaid', 'ClaimReceive', 'purchaseSuccess'].includes(
                notification.action
              )
            ? 'dashboard/order'
            : ['newMessage'].includes(notification.action)
            ? 'dashboard/order'
            : notification.action === 'answer'
            ? 'dashboard/qas'
            : notification.action === 'question'
            ? 'dashboard/question'
            : '',
          [('productRejected', 'productAccepted')].includes(notification.action)
            ? 'Ver productos'
            : notification.action === 'ClaimReceive'
            ? 'Ver reclamo'
            : ['receiveSuccess', 'saleSuccess'].includes(notification.action)
            ? 'Ver ventas'
            : ['newMessage'].includes(notification.action)
            ? 'Ver compra'
            : notification.action === 'answer'
            ? 'Ver pregunta'
            : notification.action === 'question'
            ? 'Ver pregunta'
            : ['productPaid', 'purchaseSuccess'].includes(notification.action)
            ? 'Ver compras'
            : 'Sin redireccion'
        ),
        subject: notification.title,
      })
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  }
});

app.set('socketio', io);

// (-) SOCKET IO

//EVENT EMIITER
lib.eventEmitter.on('checkPayment', async (orderId) => {
  setTimeout(async () => {
    const order = await global.modules.orders.model
      .findById(orderId)
      .catch((e) => console.log(e));

    if (!order || order.status !== 'pending') {
      return;
    } else {
      console.log('--------------');
    }

    // if (order.discountCode)
    //   await global.modules.discountCodes.model
    //     .updateOne(
    //       { _id: order.discountCode },
    //       { $inc: { spent: -1, available: 1 } }
    //     )
    //     .catch((e) => console.log(e));

    // await global.modules.stockProducts.model
    //   .updateOne(
    //     { _id: order.stockProduct },
    //     { status: 'available', order: null }
    //   )
    //   .catch((e) => console.log(e));

    // await global.modules.products.model
    //   .updateOne({ _id: order.product }, { $inc: { stock: 1, sold: -1 } })
    //   .catch((e) => console.log(e));

    // await global.modules.orders.model
    //   .deleteOne({ _id: orderId })
    //   .catch((e) => console.log(e));
  }, 1000 * 60 * 10);
});

/*
 * @static content
 * app.use('/speechToText', express.static(path.join(__dirname, './static/speechToText.html')));
 * app.use('/files', express.static(path.join(__dirname, './static/files/')));
 */
app.enable('trust proxy');
// app.use((req, res, next) => {
//   var host = req.headers.host
//   let validator = true
//   if (!/\d/.test(req.headers.host) && !req.headers.host.startsWith("www.")) { host = "www." + req.headers.host; validator = false }

//   (req.secure && validator) ? next() : res.redirect('https://' + host + req.url)
// })
app.use('/api', routes);

// app.use('/adm', express.static(path.join(__dirname, '../adm/dist/adm/')))

app.use('/files', express.static(path.join(__dirname, '../adm/files/')));

// app.use('/', express.static(path.join(__dirname, '../web/dist/adm/')))

app.get('/*', function (req, res) {
  const splitUrl = req.path.split('/');

  if (splitUrl[1] && splitUrl[1] == 'adm') {
    res.sendFile('index.html', { root: '../adm/dist/adm/' });
  } else {
    res.sendFile('index.html', { root: '../web/dist/adm/' });
  }

  // res.sendFile('index.html', { root: '../web/dist/adm/' })
});

app.use(function (error, req, res, next) {
  res.status(error.status).send({ message: error.message });
});

setTimeout(() => {
  ServerUtil.connect();
}, 4000);

export { app, server, io };
