import { AUTH } from '@action-types';
import { setting } from '@utils';

const INIT_STATE: {
  user: UserModelType;
  loading: boolean;
  error: boolean;
  modal: 'login' | 'signup' | 'reset-password';
  redirectUrl: string;
} = {
  user: null,
  loading: false,
  error: false,
  modal: null,
  redirectUrl: '',
};

const AuthReducer = (state = INIT_STATE, action): typeof INIT_STATE => {
  switch (action.type) {
    case AUTH.LOGIN_USER:
      return { ...state, loading: false, modal: 'login', ...action.payload };

    case AUTH.LOGIN_USER_SUCCESS:
      localStorage.setItem(setting.storage.user, JSON.stringify(action.payload));
      if (action.payload) {
        action.payload.token && localStorage.setItem(setting.storage.token, action.payload.token);
        localStorage.setItem(setting.storage.phoneNumber, action.payload.phoneNumber);
      }
      return { ...state, loading: false, user: action.payload, modal: null, redirectUrl: '' };

    case AUTH.LOGIN_USER_FAILURE:
      localStorage.removeItem(setting.storage.user);
      localStorage.removeItem(setting.storage.token);
      localStorage.removeItem(setting.storage.phoneNumber);
      return { ...state, loading: false, error: true };

    case AUTH.LOGOUT_USER:
      localStorage.removeItem(setting.storage.user);
      localStorage.removeItem(setting.storage.token);
      localStorage.removeItem(setting.storage.phoneNumber);
      return { ...state, user: null, error: false };

    case AUTH.SET_USER:
      localStorage.setItem(setting.storage.user, JSON.stringify(action.payload));
      if (action.payload) {
        localStorage.setItem(setting.storage.phoneNumber, action.payload.phoneNumber);
      }
      return { ...state, user: action.payload };

    // case AUTH.SIGNUP_USER:
    //   return { ...state, loading: true };

    // case AUTH.SIGNUP_USER_SUCCESS:
    //   localStorage.setItem(setting.storage.user, JSON.stringify(action.payload));
    //   if (action.payload) {
    //     localStorage.setItem(setting.storage.token, action.payload.token);
    //     localStorage.setItem(setting.storage.phoneNumber, action.payload.phoneNumber);
    //   }
    //   return { ...state, loading: false, user: action.payload, modal: null, redirectUrl: '' };

    // case AUTH.SIGNUP_USER_FAILURE:
    //   return { ...state, loading: false };

    default:
      return { ...state };
  }
};
export default AuthReducer;
