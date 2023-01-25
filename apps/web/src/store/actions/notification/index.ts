import { NOTIFICATION } from '@action-types';
import { AppDispatch, RootState } from '@store';
import { endpoints, httpGetAll } from '@utils';

export const onReceivedNotification =
  (notification: NotificationModelType) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch({
        type: NOTIFICATION.RECEIVE_NOTIFICATION,
        payload: notification,
      });
    } catch (error) {
      console.log(error);
    }
  };

export const getNotifications =
  () =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    try {
      const {
        auth: { user },
      } = getState();
      if (user?.id) {
        const result = await httpGetAll<NotificationModelType>(endpoints.notificationUrl, {
          filter: { user: user.id },
        });
        dispatch({ type: NOTIFICATION.SET_NOTIFICATION_LIST, payload: result.data });
      }
    } catch (error) {
      console.log(error);
    }
  };
