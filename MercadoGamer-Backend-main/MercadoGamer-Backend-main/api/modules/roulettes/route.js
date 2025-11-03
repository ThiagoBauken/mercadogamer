'use strict';

const { hasIn, result, values } = require('lodash');
const moment = require('moment');
// Define module
module.exports = (module) => {
  /**
   * Find
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */

  module.router.get(
    '/',
    global.helpers.security.auth(['administrator', 'user']),
    (req, res, next) => {
      global.helpers.database
        .find(req, res, module.model)
        .then((result) => res.send(result))
        .catch(next);
    }
  );

  /**
   * FindById
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */

  module.router.get(
    '/getAmount',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      if (req.user._id) {
        var userLastRouleteeTransaction =
          await global.modules.rouletteTransaction.model
            .find({
              userId: req.user._id,
            })
            .limit(1)
            .sort({ _id: -1 })
            .then((items) => items[0])
            .catch((e) => {
              console.log(e);
            });

        const cannotPlay =
          userLastRouleteeTransaction &&
          moment().diff(
            moment(userLastRouleteeTransaction.createdAt),
            'days'
          ) === 0;

        const user = await global.modules.users.model.findById(req.user._id);
        const usedExtraDrop = cannotPlay && user?.extraRouletteDrop > 0;

        if (cannotPlay && user?.extraRouletteDrop === 0) {
          return res.status(500).send({ message: 'Too many request' });
        }

        var amountValues = await module.model.find().catch((e) => {
          console.log(e);
        });

        if (!amountValues) {
          return res.status(500).send({ message: 'Maltrato involuntario' });
        } else {
          if (usedExtraDrop) {
            const referredUser = await global.modules.users.model
              .findOne({
                referredBy: user._id,
                referrerUsedTheDrop: false,
              })
              .sort({ createdAt: -1 });
            referredUser.referrerUsedTheDrop = true;
            await referredUser.save();

            user.extraRouletteDrop--;
          }

          var values = [];

          for (var amount of amountValues) {
            for (var i = 0; i < amount.percent * 10; i++) {
              values.push(amount.amount);
            }
          }

          for (var i = 0; i < 1000 - values.length; i++) {
            values.push(0);
          }

          var new_values = JSON.parse(JSON.stringify(values));
          var roullete_value =
            new_values[Math.floor(Math.random() * new_values.length)];

          var roullete_result = await global.modules.rouletteTransaction.model
            .create({ userId: req.user._id, roullete: roullete_value })
            .catch((e) => {
              console.log(e);
            });

          user.gift += roullete_value;

          var get_roullete = await global.modules.rouletteTransaction.model
            .find({
              createdAt: { $gt: new Date() },
              roullete: roullete_value,
            })
            .catch((e) => {
              console.log(e);
            });

          if (!get_roullete) {
            res.status(500).send({ message: 'Maltrato involuntario' });
            return;
          } else {
            var selected_roullete = await module.model
              .find({
                amount: `${roullete_value}`,
              })
              .catch((e) => {
                console.log(e);
              });

            if (get_roullete.length == selected_roullete[0]?.drop) {
              for (var i = 0; i < values.length; i++) {
                if (new_values[i] === roullete_value) new_values[i] = 0;
              }
            }

            // console.log(`${roullete_value}`);
            res.send(`${roullete_value}`);
          }

          if (!user.firstRoulettePlay) {
            user.firstRoulettePlay = true;
          }
          await user.save();
        }
      } else {
        res
          .status(500)
          .send({ message: 'Debles cumplir todos los requisitos para jugar.' });
        return;
      }
    }
  );
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
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      global.helpers.database
        .create(req, res, module.model)
        .then((result) => {
          res.send(result);
        })
        .catch(next);
    }
  );
};
