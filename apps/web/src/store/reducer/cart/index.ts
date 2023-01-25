import { CART } from '@action-types';
import { defaultPagination } from '@utils';

const INIT_STATE: {
  discountType: 'balance' | 'coupon';
  discount: number;
  hasCarts: boolean;
  carts: PaginatedResponseType<CartModelType>;
} = {
  discountType: null,
  discount: 0,
  hasCarts: false,
  carts: defaultPagination,
};

const CartReducer = (state = INIT_STATE, action): typeof INIT_STATE => {
  switch (action.type) {
    case CART.SET_VALUE:
      return {
        ...state,
        ...action.payload,
      };

    case CART.SET_DISCOUNT:
      return {
        ...state,
        discount: action.payload,
      };

    case CART.SET_CARTS:
      return {
        ...state,
        carts: action.payload,
      };

    default:
      return { ...state };
  }
};
export default CartReducer;
