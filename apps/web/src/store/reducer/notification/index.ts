import { NOTIFICATION } from '@action-types';

const INIT_STATE: {
  notifications: NotificationModelType[];
} = {
  notifications: [],
};

const NotificationReducer = (state = INIT_STATE, action): typeof INIT_STATE => {
  switch (action.type) {
    case NOTIFICATION.RECEIVE_NOTIFICATION:
      if (!Array.isArray(state.notifications)) state.notifications = [];
      state.notifications.push(action.payload);
      return { ...state };

    case NOTIFICATION.SET_NOTIFICATION_LIST:
      return { ...state, notifications: action.payload || [] };

    default:
      return { ...state };
  }
};
export default NotificationReducer;
