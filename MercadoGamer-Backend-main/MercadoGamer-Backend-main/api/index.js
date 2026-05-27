const mongoose = require('mongoose');
const Debug = require('debug');
const settings = require('./config/settings');
const { app, server, io } = require('./app');
// const { updateProductsRatings } = require('./scripts/updateProductRatings');
// const { imgTransform } = require('./scripts/img-transform');
// const { resetSellerProfit } = require('./scripts/reset-sellprofit');
// const { resetUserBalance } = require('./scripts/reset-balance');
// const { resetUserSMS } = require('./scripts/reset-usersms');
// const { resetOrderStatus } = require('./scripts/reset-orderstatus');
// const { resetProductType } = require('./scripts/product-type');
// const { changeRandomAvatars } = require('./scripts/avatar-change');
// const { resetUserhasVisitPage } = require('./scripts/reset-hasfirstvisitvendor');
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

    await mongoose.connect(mongoUri);

    console.log('✅ MongoDB connected successfully!');
  } catch (e) {
    console.error('❌ MongoDB connection error:', e.message);
    console.error('Stack trace:', e.stack);
    console.error('Environment vars:', {
      DATABASE_HOST: process.env.DATABASE_HOST || settings.database.host,
      DATABASE_NAME: process.env.DATABASE_NAME || settings.database.name,
      MONGO_USER: process.env.MONGO_USER ? '***set***' : 'not set',
      NODE_ENV: process.env.NODE_ENV
    });
    debug(e);
    // Em produção, tente iniciar o servidor mesmo sem MongoDB (para ver logs)
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  } finally {
    // HTTP + Socket.IO rodando juntos na porta 3000
    const PORT = process.env.PORT || 3000;
    const HOST = '0.0.0.0'; // Escutar em todas as interfaces (necessário para Docker)

    server.listen(PORT, HOST, async () => {
      console.log(`🚀 Server (HTTP + Socket.IO) listening on ${HOST}:${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
      console.log(`🔌 WebSocket: ws://localhost:${PORT}`);

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
  }
}

start();
