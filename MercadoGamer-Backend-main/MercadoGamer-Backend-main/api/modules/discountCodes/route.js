'use strict';

const commonSocket = require('../../utils/serverSocket.js');

const { socket } = commonSocket;
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
    global.helpers.security.auth(['administrator']),
    (req, res, next) => {
      global.helpers.database
        .find(req, res, module.model)
        .then((result) => {
          res.send(result);
        })
        .catch(next);
    }
  );

  /**
   * Check
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  // module.router.get(
  //   '/check/:code',
  //   global.helpers.security.auth(['administrator', 'user']),
  //   async (req, res, next) => {
  //     const discountCode = await module.model
  //       .findOne({
  //         enabled: true,
  //         code: req.params.code,
  //         country: req.user.country,
  //         $or: [{ available: { $gt: 0 } }, { infinite: true }],
  //       })
  //       .catch(next);

  //     if (!discountCode)
  //       return res
  //         .status(400)
  //         .send({ message: 'Código de descuento incorrecto.' });

  //     const previousOrderWithDiscountCode = await global.modules.orders.model
  //       .findOne({ buyer: req.user.id, discountCode: discountCode._id })
  //       .catch(next);

  //     if (previousOrderWithDiscountCode)
  //       return res
  //         .status(400)
  //         .send({ message: 'Ya has usado este código de descuento.' });
  //     console.log(discountCode);
  //     const getDiscount = await global.modules.users.model.updateOne(
  //       { _id: req.user._id },
  //       { gift: discountCode.value }
  //     );
  //     res.send({ data: discountCode });
  //   }
  // );

  module.router.get(
    '/check/:code',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      let user = await global.modules.users.model.findById(req.user._id);

      const discountCode = await module.model
        .findOne({
          enabled: true,
          code: req.params.code,
          country: req.user.country,
          $or: [{ available: { $gt: 0 } }, { infinite: true }],
        })
        .catch(next);

      if (!discountCode)
        return res
          .status(400)
          .send({ message: 'Código de descuento incorrecto.' });

      // check discount code used
      if (
        Array.isArray(user.discountCodes) &&
        user.discountCodes.includes(discountCode._id)
      )
        return res
          .status(400)
          .send({ message: 'No se puede usar el mismo código dos veces' });

      // add gift balance of user table

      user.gift += discountCode.value;
      if (!Array.isArray(user.discountCodes)) user.discountCodes = [];
      user.discountCodes.push(discountCode._id);
      await user.save();
      // disable the discountCode

      let updateResult;
      let spentUser;
      if (discountCode.total != '0') {
        const leftCount = discountCode.available - 1;
        discountCode.spent += 1;
        if (leftCount == '0') {
          discountCode.enabled = false;
          updateResult = await discountCode.save();
        } else {
          discountCode.available = leftCount;
          updateResult = await discountCode.save();
        }

        res.send({ data: user });
        if (updateResult.ok == '1') {
          socket.emit('update-code', 'success');
        }
      } else if (discountCode.total == '0') {
        spentUser = discountCode.spent + 1;
        updateResult = await discountCode.save();
        res.send({ data: user });

        if (updateResult.ok == '1') {
          socket.emit('update-code', 'success');
        }
      }
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
    '/:id',
    global.helpers.security.auth(['administrator']),
    (req, res, next) => {
      global.helpers.database
        .findById(req, res, module.model)
        .then((result) => {
          res.send(result);
        })
        .catch(next);
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
