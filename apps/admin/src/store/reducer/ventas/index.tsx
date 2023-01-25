import { VENTAS } from '../../types';

export type VentasPeriod = '30-day' | 'this-year' | 'all-time';

export enum VentasSwitcherStatus {
  ALL = 'all',
  IN_PROCESS = 'in_process',
  FINISHED = 'finished',
  COMPLAINT = 'complaint',
  CANCELLED = 'cancelled',
}

const INIT_STATE: {
  orders: OrderModelType[];
  loading: boolean;
  analyticsData: {
    totalSells: number;
    averagePrice: number;
    newBuyers: number;
  };
  status: VentasSwitcherStatus;
  search: string;
  period: VentasPeriod;
  page: number;
  allLoaded: boolean;
  loadedPeriod: VentasPeriod;
} = {
  orders: [],
  loading: false,
  analyticsData: {
    totalSells: 0,
    averagePrice: 0,
    newBuyers: 0,
  },
  status: VentasSwitcherStatus.ALL,
  search: '',
  period: '30-day',
  page: -1,
  allLoaded: false,
  loadedPeriod: undefined,
};

const VentasReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case VENTAS.SET_ORDERS:
      return {
        ...state,
        orders: action.payload,
      };

    case VENTAS.SET_VALUES:
      return {
        ...state,
        ...action.payload,
      };

    case VENTAS.SET_STATUS:
      return {
        ...state,
        status: action.payload,
      };

    case VENTAS.SET_SEARCH:
      return {
        ...state,
        search: action.payload,
      };

    case VENTAS.SET_PERIOD:
      return {
        ...state,
        period: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
};

export default VentasReducer;
