import { PRODUCTDETAILTYPES } from '../type';

export const INIT_STATE: {
  product: ProductModelType;
  loading: boolean;
} = {
  product: {},
  loading: false,
};

export const productDetailReducer = (state, action): typeof INIT_STATE => {
  switch (action.type) {
    case PRODUCTDETAILTYPES.SET_VALUE:
      return {
        ...state,
        ...action.payload,
      };

    case PRODUCTDETAILTYPES.SET_PRODUCT:
      return {
        ...state,
        product: action.payload,
      };

    case PRODUCTDETAILTYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return {...state}
  }
};
