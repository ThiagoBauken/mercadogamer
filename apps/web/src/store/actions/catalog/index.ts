import { CATALOG } from '@action-types';
import { endpoints, get, getDefaultCountry, httpGetAll } from '@utils';
import { store } from '../..';

export const getProductsCounts = () => async (dispatch) => {
  try {
    const result = await get(`${endpoints.productsUrl}/getCounts`);
    dispatch({ type: CATALOG.SET_COUNTS, payload: result.data || {} });
  } catch (error) {}
};

function mapNameToId(
  name: string,
  arr: GameModelType[] | PlatformModelType[] | CategoryModelType[]
) {
  return arr.find((obj) => obj.name === name)?.id;
}

export const getProductsInCategory = () => async (dispatch) => {
  try {
    const {
      category: { categories },
      platform: { platforms },
      game: { games },
      catalog: { filter, page },
    } = store.getState();

    const defaultCountry = getDefaultCountry();
    const toUSD = defaultCountry?.toUSD || 1;

    const _filter: { [key: string]: any } = {
      $and: [
        { enabled: true },
        { status: 'approved' },
        { stock: { $gt: 0 } },
        {
          price: {
            $gte: filter.price.min * toUSD,
            $lte: filter.price.max * toUSD,
          },
        },
      ],
    };

    if (filter.platform?.length) {
      _filter.$and.push({
        platform: { $in: filter.platform.map((name) => mapNameToId(name, platforms)) },
      });
    }

    if (filter.category?.length) {
      _filter.$and.push({
        category: { $in: filter.category.map((name) => mapNameToId(name, categories)) },
      });
    }
    if (filter.types?.length) {
      _filter.$and.push({
        type: { $in: filter.types },
      });
    }

    if (filter.game) {
      _filter.$and.push({
        game: mapNameToId(filter.game, games),
      });
    }

    const filteredWords = ['de'];

    if (filter.search) {
      _filter.$and.push({
        $or: [
          { name: { $regex: filter.search, $options: 'i' } },
          ...filter.search
            .split(' ')
            .filter((word) => word.length > 0 && !filteredWords.includes(word))
            .map((s) => ({ name: { $regex: s, $options: 'i' } })),
        ],
      });
    }

    let order: { [key: string]: any } = {};
    switch (filter.order) {
      case 'relevant':
        order = { priority: -1 };
        break;
      case 'low-price':
        order = { price: 1 };
        break;
      case 'high-price':
        order = { price: -1 };
        break;
    }

    const perPage = 16;

    const queryParams = {
      filter: _filter,
      sort: order,
      populate: ['game'],
      delivery: undefined,
      page,
      perPage,
    };

    if (filter.delivery && filter.delivery.length > 0) queryParams.delivery = 'automatic';
    else delete queryParams.delivery;

    const result = await httpGetAll(endpoints.productsUrl, queryParams);

    if (result.data.data.length < perPage) {
      dispatch({ type: CATALOG.EVERYTHING_LOADED });
    }

    dispatch({ type: CATALOG.ADD_PRODUCTS, payload: result.data?.data });
  } catch (err) {
    console.error(err);
  }
};
