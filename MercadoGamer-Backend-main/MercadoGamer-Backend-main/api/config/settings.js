import path from 'path';

const settings = {
  token: {
    secret: 'ts$s38*jsjmjnT1',
    expires: '1d', // expires in 24 hours
    noexpires: '100y', // expires in 100 years
  },
  crypto: {
    saltRounds: 12,
    key: '4A614E645267556B',
  },
  baseUrl: process.env.BASE_URL || 'http://localhost',
  uploadDir: process.env.UPLOAD_DIR || '/tmp',
  files: {
    path: process.env.IMAGES_DIR || '../adm/files',
  },
  // imagesDir  : process.env.IMAGES_DIR || '../adm/files/',
  url: function () {
    return this.baseUrl + ':' + this.port;
  },
  path: path.normalize(path.join(__dirname, '..')),
  port: process.env.NODE_PORT || 80,
  portHttps: process.env.NODE_PORT_HTTPS || 443,
  portSIO: process.env.NODE_PORT_SIO || 10111,
  database: {
    logging: 'console.log',
    timezone: '-03:00',
    host: process.env.DATABASE_HOST || 'localhost:27017',
    name: process.env.DATABASE_NAME || 'mercadogamer',
    itemsPerPage: 24,
  },
  mp: {
    env: 'prod', //dev
    prod: {
      accessToken:
        'APP_USR-1805524568759154-092115-4801c039468cfe45d81add4bb59eeff8-811907353',
    },
    dev: {
      accessToken:
        'TEST-1805524568759154-092115-ce28899d0ecb8359f22119144f1600ca-811907353',
    },
    success_back_url: 'https://www.mercadogamer.com/purchase',
    url: 'https://api.mercadopago.com/v1',
    urlIpn: 'https://www.mercadogamer.com/api/mp/ipnv2',
  },
  invoiceIsProduction: true,
  businessRules: {},
  nodemailer: {
    transporter: {
      host: process.env.SMTP_HOST || 'mailhog',
      secure: process.env.SMTP_SECURE === 'true' || false,
      port: parseInt(process.env.SMTP_PORT || '1025'),
      auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      } : undefined,
      tls: {
        rejectUnauthorized: false
      }
    },
    mailOptions: {
      from: process.env.SMTP_FROM || 'no-reply@mercadogamer.com',
      subject: 'Mercado Gamer: Recuperacion de contraseña',
    },
  },
  twoFactor: {
    verifyToken: 'XDQXYCP5AC6FA32FQXDGJSPBIDYNKK5W',
  },
  // AWS SMS desativado - usar Twilio se necessário
  // awsSms: {
  //   AWS_ASSESS_KEY_ID: 'REMOVED_FOR_SECURITY',
  //   AWS_SECRET_ASSESS_KEY_ID: 'REMOVED_FOR_SECURITY',
  //   AWS_REGION: 'us-east-2',
  // },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },
};

module.exports = settings;
