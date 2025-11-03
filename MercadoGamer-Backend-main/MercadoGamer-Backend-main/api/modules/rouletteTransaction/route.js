'use strict';
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

  module.router.get('/', async (req, res, next) => {
    global.helpers.database
      .find(req, res, module.model)
      .then((result) => {
        res.send(result);
      })
      .catch(next);
  });

  module.router.get(
    '/today',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      try {
        const today = moment();
        const roulleteTransaction = await module.model.findOne({
          userId: req.user._id,
          createdAt: { $gte: moment(today.format('YYYY-MM-DD'), 'YYYY-MM-DD') },
        });
        res.send(roulleteTransaction);
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
      }
    }
  );

  module.router.get(
    '/check-can-play',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      try {
        const today = new Date(Date.now() - 8.64e7);
        const todayTransaction = await module.model.findOne({
          userId: req.user._id,
          createdAt: { $gte: today },
        });
        const response = {
          canPlay: todayTransaction ? false : true,
        };

        if (!response.canPlay) {
          const updatedUser = await global.modules.users.model
            .findOne({
              _id: req.user._id,
            })
            .select('_id extraRouletteDrop');

          response.extraDrop = updatedUser.extraRouletteDrop;
          response.createdAt = todayTransaction.createdAt;
        }

        res.send(response);
      } catch (error) {
        next(error);
      }
    }
  );
};
