const twofactor = require('node-2fa');
const settings = require('../config/settings');

export const generateTwoFactor = (account) => {
  const newSecret = twofactor.generateSecret({
    name: 'MercadoApp',
    account,
  });

  return twofactor.generateToken(settings.twoFactor.verifyToken);
};

export const verificationTwoFactor = (sms) => {
  return twofactor.verifyToken(settings.twoFactor.verifyToken, sms);
};
