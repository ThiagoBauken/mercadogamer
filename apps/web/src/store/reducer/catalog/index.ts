import { CATALOG } from '@action-types';

const INIT_STATE: {
  filter: CatalogFilterType;
  counts: CatalogCountsType;
  products: ProductModelType[];
  page: number;
  allProductCount: number;
  loading: boolean;
  everythingLoaded: boolean;
  maxPrice: number;
} = {
  filter: {
    price: {
      max: undefined,
      min: 0,
    },
    platform: [],
    category: [],
    types: [],
    order: 'relevant',
    delivery: [],
    game: '',
    search: undefined,
  },
  counts: {
    platform: {},
    category: {},
    type: {},
  },
  products: [],
  page: 1,
  allProductCount: 0,
  loading: false,
  everythingLoaded: false,
  maxPrice: undefined,
};

const CatalogReducer = (state = INIT_STATE, action): typeof INIT_STATE => {
  switch (action.type) {
    case CATALOG.SET_VALUE:
      return {
        ...state,
        ...action.payload,
      };

    case CATALOG.SET_COUNTS:
      return {
        ...state,
        counts: action.payload,
      };

    case CATALOG.SET_MAX_PRICE:
      return {
        ...state,
        maxPrice: action.payload,
      };

    case CATALOG.RESET_PAGE:
      return {
        ...state,
        page: 1,
      };

    case CATALOG.INCREMENT_PAGE:
      return {
        ...state,
        page: state.page + 1,
      };

    case CATALOG.SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };

    case CATALOG.CLEAR_PRODUCTS:
      return {
        ...state,
        products: [],
        everythingLoaded: false,
      };

    case CATALOG.ADD_PRODUCTS:
      return {
        ...state,
        products: [...state.products, ...action.payload],
      };

    case CATALOG.EVERYTHING_LOADED:
      return {
        ...state,
        everythingLoaded: true,
      };

    default:
      return { ...state };
  }
};
export default CatalogReducer;
