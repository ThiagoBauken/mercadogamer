const express = require('express');
const router = express.Router();
const { stringify } = require('csv-stringify');
const fs = require('fs/promises');
const moment = require('moment');

function getEarningsPipeline(date) {
  return [
    [
      {
        $match: {
          status: 'finished',
          paidDate: { $gte: date },
        },
      },
      {
        $group: {
          _id: '$status',
          sellerProfitTotal: { $sum: '$sellerProfit' },
          pricePaidTotal: { $sum: '$pricePaid' },
          processingFeeTotal: { $sum: '$processingFee' },
          balanceUsedTotal: { $sum: '$balanceUsed' },
          giftUsedTotal: { $sum: '$giftUsed' },
        },
      },
    ],
    [
      {
        $match: {
          status: 'finished',
          paidDate: { $gte: date },
        },
      },
      {
        $project: {
          sellerComission: { $subtract: ['$productPrice', '$sellerProfit'] },
        },
      },
      {
        $group: {
          _id: '$status',
          sellerComissionTotal: { $sum: '$sellerComission' },
        },
      },
    ],
    [
      {
        $match: {
          status: 'finished',
          paidDate: { $gte: date },
        },
      },
      {
        $project: {
          paidDate: {
            $dateToString: {
              date: '$paidDate',
              format: '%m-%d-%Y',
            },
          },
          processingFee: true,
          sellerComission: { $subtract: ['$productPrice', '$sellerProfit'] },
        },
      },
      {
        $group: {
          _id: '$paidDate',
          sellerComissionTotal: { $sum: '$sellerComission' },
          processingFeeTotal: { $sum: '$processingFee' },
        },
      },
      {
        $project: {
          _id: false,
          date: '$_id',
          sellerComissionTotal: true,
          processingFeeTotal: true,
        },
      },
    ],
  ];
}

router.get(
  '/',
  global.helpers.security.auth(['administrator']),
  async (req, res, next) => {
    const date = new Date(parseInt(req.query.date) || 0);

    const pipelines = getEarningsPipeline(date);

    const promises = pipelines.map(async (p) => {
      return await global.modules.orders.model.aggregate(p);
    });

    const [aggr1, aggr2, perDayInfo] = await Promise.all(promises);

    const data = {
      ...aggr1[0],
      ...aggr2[0],
      perDayInfo,
    };
    delete data._id;

    res.send(data);
  }
);

/*
data object has the following structure (TypeScript interface)

interface Data {
  sellerProfitTotal: number; // Profit earned by sellers
  pricePaidTotal: number; // Amount paid by users with MercadoPago
  processingFeeTotal: number; // Comission paid by buyers
  sellerComissionTotal: number; // Comission paid by sellers
}

processingFeeTotal + sellerComissionTotal is the total profit made by the webpage
*/

function getVentasOrdersPipeline(date, searchFilter, status, page, pageSize) {
  let arr = [
    {
      $match: {
        createdAt: { $gte: date },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: pageSize * page,
    },
    {
      $limit: pageSize,
    },
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'product',
      },
    },
    {
      $unwind: {
        path: '$product',
      },
    },

    {
      $lookup: {
        from: 'users',
        localField: 'buyer',
        foreignField: '_id',
        as: 'buyer',
      },
    },
    {
      $unwind: {
        path: '$buyer',
      },
    },

    {
      $lookup: {
        from: 'users',
        localField: 'seller',
        foreignField: '_id',
        as: 'seller',
      },
    },
    {
      $unwind: {
        path: '$seller',
      },
    },
  ];

  if (status) {
    if (status === 'in_process') {
      arr[0].$match.status = { $in: ['pending', 'paid'] };
    } else {
      arr[0].$match.status = status;
    }
  }

  if (searchFilter && Object.keys(searchFilter).length > 0) {
    // Rearrange for better performance
    const [
      match,
      sort,
      skip,
      limit,
      lookupProducts,
      unwindProducts,
      lookupBuyer,
      unwindBuyer,
      lookupSeller,
      unwindSeller,
      ...rest
    ] = arr;

    arr = [
      match,
      lookupProducts,
      unwindProducts,
      lookupBuyer,
      unwindBuyer,
      lookupSeller,
      unwindSeller,
      {
        $match: searchFilter,
      },
      sort,
      skip,
      limit,
      ...rest,
    ];
  }

  return arr;
}

router.get(
  '/ventas',
  global.helpers.security.auth(['administrator']),
  async (req, res, next) => {
    const date = new Date(parseInt(req.query.date) || 0);
    const search = req.query.search;
    const status = req.query.status;
    const page = Number(req.query.page) || 0;
    const pageSize = 20;

    const searchFilter = {};

    if (search) {
      const fields = [
        'product.name',
        'paymentId',
        'seller.username',
        'buyer.username',
      ];

      searchFilter.$or = fields.map((key) => ({
        [key]: { $regex: search, $options: 'i' },
      }));

      searchFilter.$or.push({
        number: parseInt(search),
      });
    }

    const pipeline = getVentasOrdersPipeline(
      date,
      searchFilter,
      status,
      page,
      pageSize
    );

    const orders = await global.modules.orders.model.aggregate(pipeline);

    const ret = {
      orders,
    };

    res.send(ret);
  }
);

function getVentasAnalyticsPipeline(date) {
  return [
    {
      $match: {
        createdAt: { $gte: date },
        status: 'finished',
      },
    },
    {
      $project: {
        totalPrice: {
          $sum: ['$pricePaid', '$balanceUsed', '$giftUsed'],
        },
      },
    },
    {
      $group: {
        _id: 0,
        totalPriceSum: {
          $sum: '$totalPrice',
        },
        totalSells: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        totalSells: '$totalSells',
        averagePrice: {
          $divide: ['$totalPriceSum', '$totalSells'],
        },
      },
    },
  ];
}

function getNewBuyersPipeline(date) {
  return [
    {
      $match: {
        createdAt: { $gte: date },
        status: 'finished',
      },
    },
    {
      $lookup: {
        from: 'orders',
        localField: 'buyer',
        foreignField: 'buyer',
        as: 'otherOrders',
      },
    },
    {
      $project: {
        _id: '$_id',
        otherOrders: {
          $size: '$otherOrders',
        },
      },
    },
    {
      $match: {
        otherOrders: 1,
      },
    },
    {
      $group: {
        _id: 0,
        newBuyers: {
          $sum: 1,
        },
      },
    },
  ];
}

router.get(
  '/ventas/analytics',
  global.helpers.security.auth(['administrator']),
  async (req, res) => {
    const date = new Date(parseInt(req.query.date) || 0);
    const pipeline = getVentasAnalyticsPipeline(date);
    const pipeline2 = getNewBuyersPipeline(date);

    const [analyticsData, newBuyersArr] = await Promise.all([
      global.modules.orders.model.aggregate(pipeline),
      global.modules.orders.model.aggregate(pipeline2),
    ]);

    const ret = {
      analyticsData: {
        ...analyticsData[0],
        ...newBuyersArr[0],
      },
    };

    if (ret.analyticsData) {
      delete ret.analyticsData._id;
    } else {
      ret.analyticsData = {
        totalSells: 0,
        averagePrice: 0,
        newBuyers: 0,
      };
    }

    res.send(ret);
  }
);

router.get(
  '/ventas/ordersCSV',
  global.helpers.security.auth(['administrator']),
  async (req, res) => {
    const date = new Date(parseInt(req.query.date) || 0);

    const orders = await global.modules.orders.model
      .find({
        createdAt: { $gte: date },
      })
      .populate('product buyer seller')
      .populate([
        {
          path: 'product',
          populate: {
            path: 'platform',
          },
        },
        {
          path: 'product',
          populate: {
            path: 'game',
          },
        },
      ]);

    // We should use an aggregation to do this
    const toCSV = orders.map((o) => ({
      _id: String(o._id),
      number: o.number,
      status: o.status,
      product: o.product ? o.product.name : '',
      productType: o.product ? o.product.type : '',
      platform:
        o.product && o.product.platform
          ? o.product.platform
              .filter((p) => p)
              .map((p) => p.name)
              .join(',')
          : '',
      game: o.product && o.product.game ? o.product.game.name : '',
      creationDate: moment(o.createdAt).format('DD/MM/YYYY'),
      creationHour: moment(o.createdAt).format('hh:mm'),
      total: (o.balanceUsed || 0) + (o.giftUsed || 0) + (o.pricePaid || 0),
      seller: o.seller ? o.seller.username : '',
      buyer: o.buyer ? o.buyer.username : '',
      paymentId: o.paymentId,
      pricePaid: o.pricePaid,
      comissionPaid: o.pricePaid * 0.077319,
      balanceUsed: o.balanceUsed,
      giftUsed: o.giftUsed,
      sellerProfit: o.sellerProfit,
      publicationType: o.publicationType,
      withdrawal: o.withdrawal || '',
    }));

    stringify(
      toCSV,
      {
        header: true,
      },
      async (err, output) => {
        if (err) {
          console.error(err);
          res.status(500).send();
          return;
        }

        const filePath = '/tmp/orders.csv';

        await fs.writeFile(filePath, output);
        res.sendFile(filePath, () => {
          fs.unlink(filePath);
        });
      }
    );
  }
);

module.exports = router;
