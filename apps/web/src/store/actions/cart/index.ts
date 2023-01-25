import { CART } from '@action-types';
import { AppDispatch, RootState } from '@store';
import { addMessageToToast, del, endpoints, httpGetAll, post } from '@utils';
import router from 'next/router';

export const addCart = async (productId: string, count = 1, showToast = true): Promise<void> => {
  try {
    const cart = await post(endpoints.cartUrl, { product: productId, count }, false);
    showToast &&
      addMessageToToast('Añadido correctamente al carrito', {
        icon: 'check-circle',
        status: 'success',
        actionName: 'VER CARRITO',
        onAction: () => router.push('/cart'),
      });
    return cart.data;
  } catch (error) {
    throw error;
  }
};

export const getCarts =
  () =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    try {
      const {
        auth: { user },
      } = getState();
      if (user?.id) {
        const cart = await httpGetAll<CartModelType>(endpoints.cartUrl, {
          // populate: ['product'],
          populate: [{ path: 'product', populate: ['game', 'platform', 'category'] }],
          filter: { user },
        });

        dispatch({ type: CART.SET_CARTS, payload: cart.data });
      }
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  };

export const removeCarts = async (id: string): Promise<any> => {
  try {
    const cart = await del(`${endpoints.cartUrl}/${id}`);
    return cart.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const payCarts = async (balance: number, userInfo: any): Promise<any> => {
  try {
    const response = await post(`${endpoints.cartUrl}/payv2`, { balance, userInfo }, false);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
