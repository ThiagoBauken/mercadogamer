import { CATEGORY } from '@action-types';
import { endpoints, httpGetAll } from '@utils';

export const getCategories = () => async (dispatch) => {
  try {
    const result = await httpGetAll(endpoints.categoriesUrl, { filter: { enabled: true } });
    dispatch({ type: CATEGORY.SET_CATEGORY, payload: result.data.data });
  } catch (error) {}
};
