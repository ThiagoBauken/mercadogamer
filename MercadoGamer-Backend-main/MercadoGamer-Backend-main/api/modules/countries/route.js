'use strict';

const axios = require('axios');

// Define module
module.exports = (module) => {
  module.router.get('/updateCurrencies', async (req, res, next) => {
    try {
      console.log('Updating currencies');

      // USDC-AR
      await axios
        .get('https://criptoya.com/api/usdc/ars/1')
        .then(async ({ data }) => {
          const keys = ['buenbit', 'ripio', 'lemoncash', 'belo'];
          const amount = keys.length;
          const sum = keys.map((key) => data[key].ask).reduce((a, b) => a + b);

          const toUSD = 1 / (sum / amount);

          if (toUSD) {
            await global.modules.countries.model.updateOne(
              { currency: 'ARS' },
              { toUSD }
            );
          }

          console.log('USD price updated');
          res.status(200).send();
        });
    } catch (error) {
      console.error('Cron "currencies.get_currencies" response error:', error);
      res.status(500).send();
    }
  });

  /**
   * Find
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/', (req, res, next) => {
    global.helpers.database
      .find(req, res, module.model)
      .then((result) => res.send(result))
      .catch(next);
  });

  /**
   * FindById
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/:id', (req, res, next) => {
    global.helpers.database
      .findById(req, res, module.model)
      .then((result) => {
        res.send(result);
      })
      .catch(next);
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
    global.helpers.security.auth(['administrator']),
    async (req, res, next) => {
      global.helpers.database
        .create(req, res, module.model)
        .then((result) => {
          res.send(result);
        })
        .catch(next);
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
    global.helpers.security.auth(['administrator']),
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
    global.helpers.security.auth(['administrator']),
    (req, res, next) => {
      global.helpers.database
        .delete(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );
};
