'use strict';

const {
  getSellerPoints,
  getProductPriority,
} = require('../../utils/productRating');

// Define module
module.exports = async (module) => {
  /**
   * loadProductContents
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/loadProductContents', async (req, res, next) => {
    let platforms = await global.modules.platforms.model
      .find({ enabled: true })
      .exec();

    let categories = await global.modules.categories.model
      .find({ enabled: true })
      .exec();

    let games = await global.modules.games.model.find({ enabled: true }).exec();

    let stockproducts = await global.modules.stockProducts.model
      .find({ status: 'available' })
      .exec();
    const codes = stockproducts
      .map((item) => item.code)
      .filter((item) => !!item);

    let data = { categories, platforms, games, stockproducts };

    res.send(data);
  });

  module.router.get('/getCounts', async (req, res, next) => {
    try {
      const products = await module.model.find({
        enabled: true,
        status: 'approved',
        stock: { $gt: 0 },
      });
      const counts = {
        platform: {},
        category: {},
        type: {},
      };
      const keys = Object.keys(counts);
      products.forEach((product) => {
        keys.forEach((key) => {
          const data = product[key];
          if (!counts[key]?.[data]) counts[key][data] = 0;
          counts[key][data]++;
        });
      });
      res.send(counts);
    } catch (error) {
      next(error);
    }
  });

  module.router.get('/getRecommendProducts/:id', async (req, res, next) => {
    try {
      const products = await global.modules.products.model
        .findById(req.params.id)
        .populate(['platform', 'game', 'category'])
        .catch((e) => console.log(e));
      let recommendProducts;
      if (products.game === null) {
        recommendProducts = await global.modules.products.model
          .find({
            $and: [
              {
                $or: [
                  { platform: products?.platform._id },
                  { type: products.type },
                ],
              },
              {
                $and: [
                  { enabled: true },
                  { status: 'approved' },
                  { stock: { $gt: 0 } },
                ],
              },
            ],
          })
          .catch((e) => console.log(e));
      } else {
        recommendProducts = await global.modules.products.model
          .find({
            $and: [
              {
                $or: [
                  { platform: products?.platform._id },
                  { game: products?.game?._id },
                  { type: products.type },
                ],
              },
              {
                $and: [
                  { enabled: true },
                  { status: 'approved' },
                  { stock: { $gt: 0 } },
                ],
              },
            ],
          })
          .catch((e) => console.log(e));
      }

      res.send(recommendProducts);
    } catch (error) {
      next(error);
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
  module.router.get('/', async (req, res, next) => {
    const filters = JSON.parse(req.query._filters);
    const deliveryFilter = req.query._delivery
      ? JSON.parse(req.query._delivery)
      : undefined;

    const searchWord = filters.name?.$regex;

    if (searchWord) {
      const current_keywords = await global.modules.searchfilters.model
        .find()
        .catch(next);

      const filter_keywords = current_keywords.map((item) => item.keywords);

      if (filter_keywords.includes(searchWord)) {
        await global.modules.searchfilters.model
          .updateOne({ keywords: searchWord }, { $inc: { count: +1 } })
          .catch(next);
      } else {
        await global.modules.searchfilters.model
          .create({ keywords: searchWord })
          .catch(next);
      }
    }

    // Right now the only delivery filter is the one to only select automatic delivery products
    if (deliveryFilter) {
      const sort = JSON.parse(req.query._sort);
      const sortKey = Object.keys(sort);

      const pipelineBase = [
        {
          $match: {
            status: 'available',
            retirementType: 'automatic',
          },
        },
        {
          $group: {
            _id: '$product',
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $unwind: '$product',
        },
        {
          $replaceRoot: {
            newRoot: '$product',
          },
        },
        {
          $match: {
            status: 'approved',
            enabled: true,
            stock: { $gt: 0 },
          },
        },
        {
          $addFields: {
            stockProduct: {
              retirementType: 'automatic',
            },
          },
        },
      ];

      if (sort && sortKey[0]) {
        pipelineBase.push({
          $sort: {
            [sortKey[0]]: sort[sortKey[0]],
          },
        });
      }

      const page = Number(req.query._page) || 1;
      const perPage = Number(req.query._perPage) || 16;

      /*
        It is weird to do (page - 1) * perPage, but it is done this way so we keep it consistent
        with the functions in the databaseUtils helper
      */
      const pipeline = [
        ...pipelineBase,
        {
          $skip: (page - 1) * perPage,
        },
        {
          $limit: perPage,
        },
        {
          $set: {
            id: '$_id',
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ];

      const result = await global.modules.stockProducts.model.aggregate(
        pipeline
      );
      res.send({
        data: result,
      });
      return;
    }

    try {
      const result = await global.helpers.database.find(req, res, module.model);
      if (Array.isArray(result.data)) {
        let stockProduct;
        for (let item of result.data) {
          stockProduct = await global.modules.stockProducts.model.findOne({
            product: item._id,
          });

          item._doc && (item._doc.stockProduct = stockProduct);
        }

        if (deliveryFilter)
          result.data = result.data.filter((item) => {
            if (!item._doc?.stockProduct || !item._doc.stock) return false;

            return deliveryFilter.includes(
              item._doc.stockProduct?.retirementType
            );
          });
      }

      res.send(result);
    } catch (error) {
      next(error);
    }
  });

  module.router.get('/maxProductPrice', async (req, res, next) => {
    const product = await global.modules.products.model
      .findOne({ enabled: true, status: 'approved', stock: { $gt: 0 } })
      .sort({
        price: -1,
      });

    res.send({ price: product.price });
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
    global.helpers.security.auth(['administrator', 'user', 'non-login']),
    async (req, res, next) => {
      try {
        const result = await global.helpers.database.findById(
          req,
          res,
          module.model
        );

        const stockProduct = await global.modules.stockProducts.model.find({
          product: req.params.id,
          status: 'available',
        });

        if (
          stockProduct[0] &&
          stockProduct[0].retirementType === 'coordinated'
        ) {
          if (result.data._doc) {
            result.data._doc && (result.data._doc.stockProduct = stockProduct);
          } else {
            result.data && (result.data.stockProduct = stockProduct);
          }
        } else {
          const productId = req.params.id;
          const userId =
            result.data.status === 'rejected'
              ? result.data.user
              : result.data.user._id;

          const KEY = module.settings.crypto.key + productId + userId;

          for (let i = 0; i < stockProduct.length; i++) {
            if (stockProduct[i].code) {
              const temp = stockProduct[i].code.split(':');
              const IV = Buffer.from(temp[0], 'hex');
              const decipher = module.lib.crypto.createDecipheriv(
                'aes-256-cbc',
                Buffer.from(KEY, 'hex'),
                IV
              );

              let decrypted = decipher.update(temp[1], 'hex', 'utf8');
              decrypted += decipher.final('utf8');
              stockProduct[i]._doc.code = decrypted;
            }
          }

          if (result.data.status == 'rejected') {
            const rejectedMessages =
              await global.modules.rejectmessages.model.find({
                product: result.data.id,
              });

            result.data.rejectedmessages = rejectedMessages;
            result.data.stockProduct = JSON.parse(JSON.stringify(stockProduct));
          } else {
            result.data._doc.stockProduct = stockProduct;
          }
        }
        // console.log(result);
        res.send(result);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );

  /**
   * Create new product
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post(
    '/createNewProduct',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      try {
        if (req.body.stock > 1000) {
          res.status(400).send('El limite de stock de un producto es 999');
          return;
        }
        let user = await global.modules.users.model
          .findById(req.user._id)
          .catch(next);

        if (req.body.publicationType === 'free') {
          if (user.hasFirstSale) {
            res
              .status(400)
              .send(
                'Ya tiene su publicación gratuita creada, intente otra opción'
              );
            return;
          }

          if (
            (req.body.code && req.body.code.length > 1) ||
            (req.body.stock && req.body.stock > 1)
          ) {
            res
              .status(400)
              .send('Las publicaciones gratuitas solo pueden tener 1 de stock');
            return;
          }
        }

        req.body.user = req.user._id;

        const product = await global.modules.products.model
          .create(req.body)
          .catch((e) => {
            res.status(400).send({ message: 'Ocurrio un error inesperado' });
          });

        product.priority = getProductPriority(product, user);
        await product.save();

        let retirementType = req.body.retirementType;

        const KEY = module.settings.crypto.key + product?._id + user?._id;
        const IV = module.lib.crypto.randomBytes(16);
        const filter_code = req.body.code;

        if (retirementType === 'coordinated') {
          await global.modules.stockProducts.model.create({
            retirementType,
            code: null,
            product: product?._id,
          });
        } else {
          let codes = filter_code.filter((code) => code);

          for (let i = 0; i < codes.length; i++) {
            const cipher = module.lib.crypto.createCipheriv(
              'aes-256-cbc',
              Buffer.from(KEY, 'hex'),
              IV
            );
            const code = codes[i]
              ? IV.toString('hex') +
                ':' +
                (cipher.update(codes[i], 'utf-8', 'hex') + cipher.final('hex'))
              : null;
            await global.modules.stockProducts.model
              .create({ retirementType, code, product: product._id })
              .catch((e) => {});
          }
          await global.modules.products.model.updateOne(
            { _id: product?._id },
            { stock: codes.length }
          );
        }
        if (!user.hasFirstSale) {
          await global.modules.users.model
            .updateOne({ id: req.body.user }, { hasFirstSale: true })
            .catch(next);

          module.lib.eventEmitter.emit('update-user', user?._id);
        }

        res.send({});
      } catch (e) {
        console.error(e);
        res.status(500).send();
      }
    }
  );

  // /**
  //    * Create new product
  //    *
  //    * @param {Object} req - Request
  //    * @param {Object} res - Response
  //    * @param {Object} next - Next
  //    * @return {void}
  //    */
  // module.router.post('/', global.helpers.security.auth(['administrator', 'user']), async (req, res, next) => {

  //   global.helpers.database.create(req, res, module.model).then((result) => {

  //     res.send(result);
  //   })
  //     .catch(next);
  // });
  /**
   * Handle Enable
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put(
    '/handleEnable/:id',
    global.helpers.security.auth(['administrator']),
    async (req, res, next) => {
      const product = await module.model
        .findOne({ _id: req.params.id })
        .populate('user');
      product.enabled = req.body.enabled;

      if (req.body.enabled && Boolean(req.body.enabled)) {
        const sellerAverage = getSellerPoints(product.user);
        product.priority = getProductPriority(product, sellerAverage);
      }

      await product.save();

      res.send({ data: { enabled: req.body.enabled } });
    }
  );

  /**
   * Handle Enable
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put(
    '/approve/:id',
    global.helpers.security.auth(['administrator']),
    async (req, res, next) => {
      const product = await module.model
        .findOne({ _id: req.params.id })
        .populate('user');
      product.status = 'approved';

      product.priority = getProductPriority(product, product.user);

      await product.save();

      res.send({ data: { status: 'approved' } });
    }
  );

  /**
   * Handle Enable
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.put(
    '/reject/:id',
    global.helpers.security.auth(['administrator']),
    async (req, res, next) => {
      await module.model
        .updateOne({ _id: req.params.id }, { status: 'rejected' })
        .catch(next);
      const currentMessages = await global.modules.rejectmessages.model
        .find({ product: req.params.id })
        .catch(next);
      if (currentMessages) {
        await global.modules.rejectmessages.model
          .remove({ product: req.params.id })
          .catch(next);
      }
      const receiveMessage = req.body;

      for (let i = 0; i < receiveMessage.message.length; i++) {
        await global.modules.rejectmessages.model
          .create({
            body: receiveMessage.message[i],
            user: req.user._id,
            product: req.params.id,
          })
          .catch((e) => {
            res.status(404).send({ message: 'Ocurrio un error inesperado' });
          });
      }

      const updatedProduct = await module.model
        .findById(req.params.id)

        .catch((e) => {
          console.log(e);
        });

      const notification = await global.modules.notifications.model
        .create({
          user: updatedProduct.user,
          title: 'Tu producto fue rechazado',
          description:
            'Hacé click para ver y corregir los errores de tu producto.',
          action: 'productRejected',
          payload: { id: updatedProduct._id },
        })
        .catch((e) => {
          res.status(404).send({ message: 'Ocurrio un error inesperado' });
        });

      module.lib.eventEmitter.emit(
        'send-notification',
        notification,
        updatedProduct.user
      );
      res.send({ data: { status: 'rejected' } });
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
      try {
        if (req.body.stock > 1000) {
          res.status(400).send('El limite de stock de un producto es 999');
          return;
        }
        // Check that the product is valid as update checks are disabled in mongoose
        const checks = [
          [req.body.name, 'El producto debe tener un nombre'],
          [req.body.description, 'El producto debe tener una descripcion'],
          [req.body.category, 'El producto debe tener una tipo asignado'],
          [req.body.platform, 'El producto debe tener una plataforma asginada'],
          [req.body.category, 'El producto debe tener una categoria asignada'],
          [
            req.body.retirementType,
            'El producto debe tener un tipo de entrega asignada',
          ],
        ];

        for (let [field, message] of checks) {
          if (!field || field.length === 0) {
            res.status(400).send(message);
            return;
          }
        }

        if (req.body.retirementType === 'coordinated' && req.body.stock < 0) {
          req.body.stock = 0;
        }

        if (req.body.price <= 0) {
          res
            .status(400)
            .send('El precio de un producto debe ser mayor que $0');
          return;
        }

        if (req.body.publicationType === 'free') {
          const other = await global.modules.products.model.findOne({
            publicationType: 'free',
            user: req.user._id,
            _id: { $ne: req.params.id },
          });

          if (other) {
            res
              .status(400)
              .send('Ya tenes un producto con publicacion gratuita');
            return;
          }

          const order = await global.modules.orders.model.findOne({
            product: req.params.id,
          });

          if (order) {
            res
              .status(400)
              .send(
                'No puedes modificar una publicacion gratuita que ya fue vendida'
              );
            return;
          }

          if (
            (req.body.code && req.body.code.length > 1) ||
            (req.body.stock && req.body.stock > 1)
          ) {
            res
              .status(400)
              .send('Las publicaciones gratuitas solo pueden tener 1 de stock');
            return;
          }
        }

        // Do stuff now

        const product = await module.model.findByIdAndUpdate(req.params.id, {
          ...req.body,
          status: 'pending',
        });

        let stockProduct = await global.modules.stockProducts.model
          .findOne({
            product: req.params.id,
            status: 'available',
          })
          .catch(next);

        await global.modules.rejectmessages.model.deleteMany({
          product: req.params.id,
        });

        if (req.body.retirementType === 'automatic') {
          const user = req.user;
          const KEY = module.settings.crypto.key + req.params.id + user._id;
          const IV = module.lib.crypto.randomBytes(16);
          const codesArr = req.body.code;

          // Do some checks first

          if (codesArr.length !== [...new Set(codesArr)].length) {
            throw new Error('Duplicated codes found');
          }

          // This has to be reworked but it is what we can do for now
          if (Array.isArray(codesArr)) {
            const docs = [];

            for (let i = 0; i < codesArr.length; i++) {
              const cipher = module.lib.crypto.createCipheriv(
                'aes-256-cbc',
                Buffer.from(KEY, 'hex'),
                IV
              );
              const code = codesArr[i]
                ? IV.toString('hex') +
                  ':' +
                  (cipher.update(codesArr[i], 'utf-8', 'hex') +
                    cipher.final('hex'))
                : null;

              if (codesArr[i]) {
                docs.push({
                  code,
                  product: product._id,
                  retirementType: 'automatic',
                });
              }
            }

            await global.modules.stockProducts.model.deleteMany({
              product: product._id,
              status: 'available',
              retirementType: 'automatic',
            });

            if (stockProduct && stockProduct.retirementType === 'coordinated')
              await global.modules.stockProducts.model.updateOne(
                {
                  product: product._id,
                  status: 'available',
                  retirementType: 'coordinated',
                },
                { status: 'sold' }
              );

            await global.modules.stockProducts.model.insertMany(docs);

            await global.modules.products.model
              .updateOne(
                { _id: req.params.id },
                { $set: { stock: docs.length, status: 'pending' } }
              )
              .catch((e) => {});
          }
        } else {
          stockProduct = await global.modules.stockProducts.model
            .findOne({
              product: req.params.id,
              retirementType: 'coordinated',
            })
            .catch(next);

          if (!stockProduct || stockProduct.status === 'sold') {
            await global.modules.stockProducts.model.deleteMany({
              product: product._id,
              status: 'available',
            });
          }

          if (stockProduct && stockProduct.retirementType === 'coordinated') {
            stockProduct.status = 'available';
            await stockProduct.save();
          } else {
            await global.modules.stockProducts.model.create({
              retirementType: 'coordinated',
              code: null,
              product: product._id,
              status: 'available',
            });
          }
        }

        const updatedProduct = await module.model
          .findOne({
            _id: req.params.id,
          })
          .populate('user');

        product.priority = getProductPriority(
          updatedProduct,
          updatedProduct.user
        );
        await product.save();

        res.send({ data: product });
      } catch (error) {
        console.error(error.stack);
        next(error);
      }
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
  // module.router.delete(
  //   '/:id',
  //   global.helpers.security.auth(['administrator', 'user']),
  //   (req, res, next) => {
  //     global.helpers.database
  //       .delete(req, res, module.model)
  //       .then((result) => res.send(result))
  //       .catch(next);
  //   }
  // );

  module.router.delete(
    '/:id',
    global.helpers.security.auth(['administrator', 'user']),
    async (req, res, next) => {
      await global.modules.products.model
        .updateOne({ _id: req.params.id }, { enabled: 'false' })
        .then((result) => res.send(result))
        .catch(next);
    }
  );
};
