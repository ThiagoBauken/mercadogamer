import mongoose from 'mongoose';
import Debug from 'debug';
import settings from './config/settings';
import { app, server, io } from './app';
// import { updateProductsRatings } from './scripts/updateProductRatings';
// import { imgTransform } from './scripts/img-transform';
// import { resetSellerProfit } from './scripts/reset-sellprofit';
// import { resetUserBalance } from './scripts/reset-balance';
// import { resetUserSMS } from './scripts/reset-usersms';
// import { resetOrderStatus } from './scripts/reset-orderstatus';
// import { resetProductType } from './scripts/product-type';
// import { changeRandomAvatars } from './scripts/avatar-change';
// import { resetUserhasVisitPage } from './scripts/reset-hasfirstvisitvendor';
const http = require('http');

const debug = new Debug('api/index.js');
mongoose.plugin(require('@meanie/mongoose-to-json'));

async function start() {
  try {
    // Construir connection string com ou sem autenticação
    let mongoUri;
    const mongoUser = process.env.MONGO_USER;
    const mongoPass = process.env.MONGO_PASSWORD;

    if (mongoUser && mongoPass) {
      // Com autenticação
      mongoUri = `mongodb://${mongoUser}:${mongoPass}@${settings.database.host}/${settings.database.name}?authSource=admin`;
      console.log(`📡 Connecting to MongoDB with authentication: ${mongoUser}@${settings.database.host}`);
    } else {
      // Sem autenticação
      mongoUri = `mongodb://${settings.database.host}/${settings.database.name}`;
      console.log(`📡 Connecting to MongoDB without authentication: ${settings.database.host}`);
    }

    await mongoose.connect(
      mongoUri,
      { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true }
    );

    console.log('✅ MongoDB connected successfully!');
  } catch (e) {
    console.error('❌ MongoDB connection error:', e.message);
    debug(e);
  } finally {
    http.createServer(app).listen('3000');
    /*
    app.listen(settings.port, () => {
      debug(`servidor corriendo en puerto ${settings.port}`)
    });*/

    server.listen(process.env.SOCKET_PORT_SOI || settings.portSIO, async () => {
      debug(
        'server listening at env: ' +
          process.env.SOCKET_PORT_SOI +
          ' or settings ' +
          settings.portSIO
      );

      // await resetSellerProfit();
      // await resetUserBalance();
      // await resetUserSMS();
      // await resetOrderStatus();
      // await imgTransform();
      // await updateProductsRatings();
      // await resetProductType();
      // await changeRandomAvatars();
      // await resetUserhasVisitPage();
    });
    /*server.listen('3000');
    io.listen(server);

    console.log('HTTP and SocketIO listening to port 3000');*/
  }
}

start();
