// @ts-nocheck - TypeScript compatibility fix
import { AUTH } from '@action-types';
import { RootState } from '@store';
import { addMessageToToast, endpoints, get, post, setting } from '@utils';
import { NextRouter } from 'next/router';

export const login =
  (data: any, router: NextRouter) =>
  async (dispatch, getState: () => RootState): Promise<void> => {
    try {
      const {
        auth: { redirectUrl },
      } = getState();
      
      const result = await post(`${endpoints.userUrl}/login`, data);
      // if (result.data.verificationSms) {
      //   localStorage.setItem(setting.storage.token, result.data.token);
      //   localStorage.setItem(setting.storage.phoneNumber, result.data.phoneNumber);
      //   // router.push('/authentication');
      // } else {
        redirectUrl && router.push(redirectUrl);
        dispatch({ type: AUTH.LOGIN_USER_SUCCESS, payload: result.data });
        addMessageToToast('¡bienvenidos! Gracias por usar Mercado Gamer.', {
          icon: 'check-circle',
          status: 'success',
        });
      // }
    } catch (error) {
      console.log(error);
      dispatch({ type: AUTH.LOGIN_USER_FAILURE });
    }
  };

export const openLoginModal = (redirectUrl?: string) => (dispatch) => {
  dispatch({ type: AUTH.LOGIN_USER, payload: { redirectUrl } });
};

export const openSignupModal = () => (dispatch) => {
  dispatch({ type: AUTH.LOGIN_USER, payload: { modal: 'signup' } });
};

export const openResetPasswordModal = () => (dispatch) => {
  dispatch({ type: AUTH.LOGIN_USER, payload: { modal: 'reset-password' } });
};

export const closeAuthModal = () => (dispatch) => {
  dispatch({ type: AUTH.LOGIN_USER, payload: { loading: false, modal: null, redirectUrl: '' } });
};

export const logout =
  () =>
  async (dispatch): Promise<void> => {
    try {
      dispatch({ type: AUTH.LOGOUT_USER });
    } catch (error) {
      console.log(error);
      dispatch({ type: AUTH.LOGIN_USER_FAILURE });
    }
  };

export const signup =
  (data: any, router: NextRouter) =>
  async (dispatch, getState: () => RootState): Promise<void> => {
    try {
      const {
        auth: { redirectUrl },
      } = getState();
      data.country = 'Argentina';
      data.verificationSms = false;
      const result = await post(`${endpoints.userUrl}`, data);
      if (result.data.verificationSms) {
        localStorage.setItem(setting.storage.token, result.data.token);
        localStorage.setItem(setting.storage.phoneNumber, result.data.phoneNumber);
        // router.push('/authentication');
      } else {
        redirectUrl && router.push(redirectUrl);
        dispatch({ type: AUTH.LOGIN_USER_SUCCESS, payload: result.data.data });
        addMessageToToast('Bienvenido! Gracias por registrarte en Mercado Gamer.', {
          icon: 'check-circle',
          status: 'success',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

export const initUser =
  () =>
  (dispatch): void => {
    try {
      const user = JSON.parse(localStorage.getItem(setting.storage.user));
      dispatch({ type: AUTH.SET_USER, payload: user });
    } catch (error) {
      console.log(error);
      dispatch({ type: AUTH.SET_USER, payload: null });
    }
  };

export const reloadUser =
  () =>
  async (dispatch, getStore): Promise<void> => {
    try {
      const {
        auth: { user },
      } = getStore();
      if (!user?.id) return; // sem id ainda — não faz nada (evita 404)
      // Backend expõe /profile/:id (que devolve user + produtos); endpoint
      // simples /:id NÃO existe. Antes usava userUrl/:id e dava 500/404,
      // o catch dropava o user (logout fantasma em /dashboard/balance e /profile).
      const response = await get(`${endpoints.userUrl}/profile/${user.id}`);
      const fresh = response.data?.data?.user || response.data?.data || response.data;
      if (fresh && (fresh.id || fresh._id || fresh.username)) {
        dispatch({ type: AUTH.SET_USER, payload: { ...user, ...fresh } });
      }
    } catch (error) {
      // NÃO esvazia user em erro — manteria deslogamento fantasma.
      // Apenas loga. Se for unauth de verdade, o axios interceptor já remove token.
      console.warn('[reloadUser] falha (não-bloqueante):', (error as any)?.message);
    }
  };

export const updateUser =
  (userInfo: UserModelType) =>
  async (dispatch, getStore): Promise<void> => {
    try {
      const {
        auth: { user },
      } = getStore();
      dispatch({ type: AUTH.SET_USER, payload: { ...user, ...userInfo } });
    } catch (error) {
      // NÃO esvazia em erro (era o que causava deslogamento fantasma em /balance e /profile)
      console.warn('[updateUser] falha (não-bloqueante):', (error as any)?.message);
    }
  };
