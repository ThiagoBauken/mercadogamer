import { AppDispatch, RootState } from '../..';
import { addMessageToToast, put } from '../../../../../../libs/ui-shared/src/utils';
import { orderUrl } from '../../../../../../libs/ui-shared/src/utils/endpoints';
import { LOADS } from '../../types';

export const setLoadsAsReimbursed = (orderId: string) => {
  console.log('>>>>>>>>>', orderId);
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      ventas: { withdrawals },
    } = getState();

    try {
      await put(orderUrl + '/' + orderId, {
        reimbursed: true,
      });

      const withdrawal = withdrawals.find((o) => o.id === orderId || o._id === orderId);

      if (withdrawal) {
        withdrawal.reimbursed = true;
      }

      await dispatch({
        type: LOADS.SET_LOADS,
        payload: withdrawals,
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
