'use strict';

// Define module
module.exports = (module, model) => {
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
   * add product for Homepage
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
      let product = await global.modules.products.model
        .findById(req.body.product_id)
        .catch(next);
      let productForHome = await module.model.find({
        sectionId: req.body.section_id,
        orderId: req.body.order_id,
      });

      if (product.enabled == true) {
        if (productForHome.length > 0) {
          productForHome[0].product = product._id;
          productForHome[0].save();
        } else {
          productForHome = await module.model
            .create({
              sectionId: req.body.section_id,
              orderId: req.body.order_id,
              product: product._id,
            })
            .catch(next);
        }

        res.send({
          data: {
            ...productForHome[0],
            product,
          },
        });
      } else {
        res
          .status(404)
          .send({ message: 'Este producto es insostenible actualmente.' });
      }
    }
  );
};
