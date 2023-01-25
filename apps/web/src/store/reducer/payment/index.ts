import { PAYMENT } from '@action-types';

const INIT_STATE: {
  payments: PaymentModelType[];
} = {
  payments: [
    {
      code: 'mercadoPago',
      name: 'MercadoPago',
      description: 'Tarjetas de crédito, débito, efectivo y más',
      enabled: true,
      img: '/assets/imgs/payment-logo.webp',
    },
    {
      code: 'bankTransfer',
      name: 'Transferencia bancaria',
      enabled: true,
      img: '/assets/imgs/bank.webp',
    },
    // {
    //   code: 'paypal',
    //   name: 'Paypal',
    //   description: 'Paga con tu cuenta de Paypal',
    //   enabled: true,
    // },
  ],
};

const PaymentReducer = (state = INIT_STATE, action): typeof INIT_STATE => {
  switch (action.type) {
    case PAYMENT.SET_PAYMENT:
      return {
        ...state,
        payments: action.payload || [],
      };

    default:
      return { ...state };
  }
};
export default PaymentReducer;
