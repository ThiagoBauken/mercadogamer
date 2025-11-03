'use strict';

const { InvoiceService } = require('../../helpers/createInvoice/invoice');

const invoiceService = new InvoiceService();

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
   * With Payment Methods
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get(
    '/paymentMethods/:id',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      var withdrawals;
      const withdrawBalance = req.user.balance;
      if (!withdrawBalance) {
        // return res.status(404).send({
        //   message:
        //     "Ya tiene su publicación gratuita creada, intente otra opción",
        // });
      } else {
        withdrawals = await module.model
          .find({ user: req.params.id })
          .populate('paymentMethod')
          .sort({ updatedAt: -1 })
          .catch(next);
      }

      const paymentMethods = await global.modules.paymentMethods.model
        .find({ user: req.params.id, enabled: true })
        .catch(next);
      res.send({ data: { withdrawals, paymentMethods } });
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
    global.helpers.security.auth(['administrator', 'user']),
    (req, res, next) => {
      global.helpers.database
        .findById(req, res, module.model)
        .then((result) => res.send(result))
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
  const hasRequiredData = (user) => {
    return (
      user.firstName &&
      user.lastName &&
      user.emailAddress &&
      user.phoneNumber &&
      user.city &&
      user.province &&
      user.address &&
      user.postalCode
    );
  };

  module.router.post(
    '/create',
    global.helpers.security.auth(['user']),
    async (req, res, next) => {
      const { user: userInfo } = req;
      try {
        const user = await global.modules.users.model.findOne({
          _id: userInfo._id,
        });

        if (!hasRequiredData(user)) {
          res
            .status(400)
            .send(
              'Debes completar los datos en "Mi perfil" antes de retirar dinero'
            );
          return;
        }

        const leanUser = await global.modules.users.model
          .findOne({
            _id: userInfo._id,
          })
          .lean();

        if (user.balance <= 0) {
          res
            .status(400)
            .send('El usuario no tiene balance para hacer un retiro.');
          return;
        }

        const orders = await global.modules.orders.model.find({
          seller: user._id,
          status: 'finished',
          withdrawal: null,
        });

        const withdrawal = await module.model.create({
          ...req.body,
          amount: user.balance,
          user: user._id,
        });

        await Promise.allSettled(
          orders.map(async (o) => {
            o.withdrawal = withdrawal._id;
            await o.save();
          })
        );

        /*
          Disabled for now

          await invoiceService.createWithdrawInvoice(
            leanUser,
            leanUser.balance,
            req.body.taxId,
            withdrawal
          );
        */

        user.balance = 0;
        await user.save();
        req.user.balance = 0;

        res.send({ data: { withdrawal, balance: 0 } });
      } catch (e) {
        console.error(e);
        res.status(500).send();
      }
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
    global.helpers.security.auth(['user']),
    async (req, res, next) => {
      try {
        const result = await global.helpers.database.update(
          req,
          res,
          module.model
        );
        res.send(result.data);
      } catch (error) {
        res.status(400).send({ message: error.message });
      }
    }
  );

  /**
   * Pay
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put(
    '/pay/:id',
    global.helpers.security.auth(['administrator']),
    async (req, res, next) => {
      await module.model
        .updateOne({ _id: req.params.id }, { status: 'paid' })
        .catch(next);

      res.send({ data: { status: 'paid' } });
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
