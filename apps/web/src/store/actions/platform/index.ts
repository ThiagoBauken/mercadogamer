import { PLATFORM } from '@action-types';
import { endpoints, httpGetAll } from '@utils';

export const getPlatforms = () => async (dispatch) => {
  try {
    const result = await httpGetAll(endpoints.platformsUrl, { filter: { enabled: true } });
    dispatch({
      type: PLATFORM.SET_PLATFORM,
      payload: result.data.data,
    });
  } catch (error) {}
};
