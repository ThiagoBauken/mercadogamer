const twofactor = require('node-2fa');
const settings = require('../config/settings');

const generateTwoFactor = (account) => {
  const newSecret = twofactor.generateSecret({
    name: 'MercadoApp',
    account,
  });

  return twofactor.generateToken(settings.twoFactor.verifyToken);
};

const verificationTwoFactor = (sms) => {
  return twofactor.verifyToken(settings.twoFactor.verifyToken, sms);
};

module.exports = { generateTwoFactor, verificationTwoFactor };
