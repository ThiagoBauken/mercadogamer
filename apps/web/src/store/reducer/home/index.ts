import { HOME } from '@action-types';
const INIT_STATE: {
  recommend_products: HomeProductModelType[];
  feature_products: HomeProductModelType[];
  discount_products: HomeProductModelType[];
  game_products: ProductModelType[];
  banners: {
    desktop: BannerModelType[];
    mobile: BannerModelType[];
  };
  products: ProductModelType;
} = {
  recommend_products: [],
  feature_products: [],
  discount_products: [],
  game_products: [],
  banners: {
    desktop: [],
    mobile: [],
  },
  products: {},
};

const HomeReducer = (state = INIT_STATE, action): typeof INIT_STATE => {
  switch (action.type) {
    case HOME.SET_VALUE:
      return {
        ...state,
        ...action.payload,
      };
    case HOME.SET_RECOMMEND: {
      return {
        ...state,
        recommend_products: action.payload,
      };
    }
    case HOME.SET_FEATURE: {
      return {
        ...state,
        feature_products: action.payload,
      };
    }
    case HOME.SET_DISCOUNT: {
      return {
        ...state,
        discount_products: action.payload,
      };
    }
    case HOME.SET_GAME: {
      return {
        ...state,
        game_products: action.payload,
      };
    }
    case HOME.SET_BANNERS: {
      return {
        ...state,
        banners: action.payload,
      };
    }
    case HOME.SET_CATEGORY: {
      return {
        ...state,
        products: action.payload,
      };
    }
    default:
      return { ...state };
  }
};

export default HomeReducer;
