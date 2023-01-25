import { AppDispatch, RootState } from '../..';
import { addMessageToToast, put } from '../../../../../../libs/ui-shared/src/utils';
import { orderUrl } from '../../../../../../libs/ui-shared/src/utils/endpoints';
import { VENTAS } from '../../types';

export const setOrderAsReimbursed = (orderId: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      ventas: { orders },
    } = getState();

    try {
      await put(orderUrl + '/' + orderId, {
        reimbursed: true,
      });

      const order = orders.find((o) => o.id === orderId || o._id === orderId);

      if (order) {
        order.reimbursed = true;
      }

      await dispatch({
        type: VENTAS.SET_ORDERS,
        payload: orders,
      });

      addMessageToToast('Orden ' + orderId + ' marcada como reembolsada');
    } catch (e) {
      addMessageToToast('Error al marcar la order ' + orderId + ' como reembolsada', {
        status: 'error',
      });
      console.error(e);
    }
  };
};
