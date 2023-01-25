import { PAYMENT_METHOD } from '@action-types';
import { endpoints, httpGetAll } from '@utils';

export const getPaymentMethods = () => async (dispatch, getState) => {
  try {
    const {
      auth: { user },
      paymentMethod: { paymentMethods },
    } = getState();
    if (!paymentMethods?.length) {
      // const result = await httpGetAll(endpoints.paymentMethodUrl, {
      //   filter: { enabled: true, user: user?.id },sort: { updatedAt: -1 },
      // });
      const result = await httpGetAll(endpoints.paymentMethodUrl, {
        filter: { enabled: true},sort: { updatedAt: -1 },
      });
      dispatch({ type: PAYMENT_METHOD.SET_VALUE, payload: result.data.data });
    }
  } catch (error) {}
};
