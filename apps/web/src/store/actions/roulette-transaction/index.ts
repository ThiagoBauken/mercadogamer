import { ROULETTE } from '@action-types';
import { endpoints, get, httpGetAll } from '@utils';

export const getRouletteTransaction = () => async (dispatch: (any) => void) => {
  try {
    const response = await httpGetAll(endpoints.rouletteTransactionUrl, {
      sort: { updatedAt: -1 },
      populate: ['userId'],
    });
    dispatch({ type: ROULETTE.HISTORY, payload: response.data });
  } catch (error) {
    console.log(error);
  }
};

export const checkCanPlay = async (): Promise<boolean> => {
  const response = await get(`${endpoints.rouletteTransactionUrl}/check-can-play`);
  return response.data.canPlay;
};
