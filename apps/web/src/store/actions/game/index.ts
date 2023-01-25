import { GAME } from '@action-types';
import { endpoints, get } from '@utils';

export const getGames =
  () =>
  async (dispatch): Promise<void> => {
    try {
      const reuslt = await get(endpoints.gamesUrl);
      dispatch({ type: GAME.SET_GAMES, payload: reuslt.data.data });
    } catch (error) {
      console.log(error);
    }
  };
