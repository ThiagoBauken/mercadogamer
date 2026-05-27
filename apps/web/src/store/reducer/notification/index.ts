import { NOTIFICATION } from '@action-types';

interface NotificationAction {
  type: string;
  payload?: NotificationModelType | NotificationModelType[];
}

const INIT_STATE: {
  notifications: NotificationModelType[];
} = {
  notifications: [],
};

const NotificationReducer = (state = INIT_STATE, action: NotificationAction): typeof INIT_STATE => {
  switch (action.type) {
    case NOTIFICATION.RECEIVE_NOTIFICATION:
      const notifications = Array.isArray(state.notifications) ? state.notifications : [];
      return {
        ...state,
        notifications: action.payload ? [...notifications, action.payload as NotificationModelType] : notifications
      };

    case NOTIFICATION.SET_NOTIFICATION_LIST:
      return {
        ...state,
        notifications: Array.isArray(action.payload) ? action.payload as NotificationModelType[] : []
      };

    default:
      return state;
  }
};
export default NotificationReducer;
