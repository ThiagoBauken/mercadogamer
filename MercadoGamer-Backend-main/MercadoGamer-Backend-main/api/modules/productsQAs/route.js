'use strict';

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
  module.router.get('/', (req, res, next) => {
    global.helpers.database
      .find(req, res, module.model)
      .then((result) => {
        res.send(result);
      })
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
  module.router.post(
    '/',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      global.helpers.database
        .create(req, res, module.model)
        .then(async (result) => {
          const notification = await global.modules.notifications.model
            .create({
              user: req.body.seller,
              title: 'Recibiste una pregunta',
              description:
                'Un usuario realizó una pregunta sobre un producto tuyo, contesta lo antes posible para concretar la venta',
              action: 'question',
              payload: { id: result.data.product },
            })
            .catch((e) => console.log(e));

          module.lib.eventEmitter.emit(
            'send-notification',
            notification,
            req.body.seller
          );
          res.send(result);
        })
        .catch(next);
    }
  );

  /**
   * addAgain
   *
   */
  module.router.post(
    '/addAgain',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      const obj = req.body;
      delete obj.id;
      obj.product = obj.product.id;
      obj.seller = obj.seller.id;

      const result = await module.model.create(req.body);

      res.send(result);
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
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      global.helpers.database
        .update(req, res, module.model)
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
    '/answer/:id',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      global.helpers.database
        .update(req, res, module.model)
        .then(async (result) => {
          const notification = await global.modules.notifications.model
            .create({
              user: result.data.buyer,
              title: 'Respondieron tu pregunta',
              description: 'Tu pregunta ya ha sido respondida por el vendedor.',
              action: 'answer',
              payload: { id: result.data.product },
            })
            .catch((e) => console.log(e));

          module.lib.eventEmitter.emit(
            'send-notification',
            notification,
            result.data.buyer
          );
          res.send(result);
        })
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
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      try {
        const result = await module.model.findByIdAndRemove(req.params.id);
        res.send(result);
      } catch (error) {
        res.status(500).send(error);
      }
      // global.helpers.database
      //   .delete(req, res, module.model)
      //   .then((result) => res.send(result))
      //   .catch(next);
    }
  );
};
