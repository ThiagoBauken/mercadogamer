import { HOME } from '@action-types';
import { endpoints, httpGetAll } from '@utils';
import { products } from '@utils';

export const getRecommendProductsForHome = () => async (dispatch) => {
  try {
    const _filter: { [key: string]: any } = { sectionId: 'tendencia' };

    const result = await httpGetAll(`${endpoints.homeproductsUrl}`, {
      filter: _filter,
      populate: [
        {
          path: 'product',
          populate: ['game'],
        },
      ],
    });

    dispatch({ type: HOME.SET_RECOMMEND, payload: result.data?.data || [] });
  } catch (error) {
  } finally {
    dispatch({ type: HOME.SET_VALUE, payload: { loading: false } });
  }
};

export const getFeatureProductForHome = () => async (dispatch) => {
  try {
    const _filter: { [key: string]: any } = { sectionId: 'skin' };

    const result = await httpGetAll(`${endpoints.homeproductsUrl}`, {
      filter: _filter,
      populate: [
        {
          path: 'product',
          populate: ['game'],
        },
      ],
    });
    dispatch({ type: HOME.SET_FEATURE, payload: result.data?.data || [] });
  } catch (error) {
  } finally {
    dispatch({ type: HOME.SET_VALUE, payload: { loading: false } });
  }
};

export const getDiscountPerWeekForHome = () => async (dispatch) => {
  try {
    const _filter: { [key: string]: any } = { sectionId: 'juego' };

    const result = await httpGetAll(`${endpoints.homeproductsUrl}`, {
      filter: _filter,
      populate: {
        path: 'product',
        populate: ['game'],
      },
    });

    dispatch({ type: HOME.SET_DISCOUNT, payload: result.data?.data || [] });
  } catch (error) {
  } finally {
    dispatch({ type: HOME.SET_VALUE, payload: { loading: false } });
  }
};

export const getGameCategoriesForHome = () => async (dispatch) => {
  try {
    const result = await httpGetAll(`${endpoints.gamesUrl}`, {
    });

    dispatch({ type: HOME.SET_GAME, payload: result.data?.data || [] });
  } catch (error) {
  } finally {
    dispatch({ type: HOME.SET_VALUE, payload: { loading: false } });
  }
};

export const getBanners = () => async (dispatch) => {
  try {
    const result = await httpGetAll(`${endpoints.bannersUrl}`);
    const desktop = result.data?.data?.filter((item) => !item.isMobile) || [];
    const mobile = result.data?.data?.filter((item) => item.isMobile) || [];
    dispatch({
      type: HOME.SET_BANNERS,
      payload: {
        desktop,
        mobile,
      },
    });
  } catch (error) {
  } finally {
    dispatch({ type: HOME.SET_VALUE, payload: { loading: false } });
  }
};

export const getCategoryForHome = () => async (dispatch) => {
  dispatch({
    type: HOME.SET_CATEGORY,
    payload: products,
  });
};
