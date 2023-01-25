import { PAYMENT_METHOD } from '@action-types';

const INIT_STATE: {
  paymentMethods: PaymentMethodModelType[];
} = {
  paymentMethods: [],
};

const AuthReducer = (state = INIT_STATE, action): typeof INIT_STATE => {
  switch (action.type) {
    case PAYMENT_METHOD.SET_VALUE:
      return { paymentMethods: action.payload };

    default:
      return { ...state };
  }
};
export default AuthReducer;
