'use strict';

// Define cron
module.exports = (cron) => {
  cron.enabled = true;

  cron.period = '0 0 0 * * *';

  /**
   *
   * @param {Object} params - Object
   * @return {Promise}
   */
  return async () => {
    try {
      console.log('Running CRON');

      // USDC-AR

      const axios = require('axios');

      await axios
        .get('https://criptoya.com/api/usdc/ars/1')
        .then(async ({ data }) => {
          const keys = ['buenbit', 'ripio', 'lemoncash', 'belo'];
          const amount = keys.length;
          const sum = keys.map((key) => data[key].ask).reduce((a, b) => a + b);

          const toUSD = 1 / (sum / amount);

          if (toUSD)
            await global.modules.countries.model.updateOne(
              { currency: 'ARS' },
              { toUSD }
            );

          console.log('USD price updated');
        });
    } catch (error) {
      console.error('Cron "currencies.get_currencies" response error:', error);
    }
  };
};
