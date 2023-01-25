import { withdrawalUrl } from '@utils/endpoints';
import { LOADS } from '../../types';

export type LoadsPeriod = '30-day' | 'this-year' | 'all-time';

export enum LoadsSwitcherStatus {
  ALL = 'all',
  IN_PROCESS = 'in_process',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

const INIT_STATE: {
  withdrawals: WithDrawalModelType[];
  loading: boolean;
  analyticsData: {
    totalSells: number;
    averagePrice: number;
    newBuyers: number;
  };
  status: LoadsSwitcherStatus;
  search: string;
  period: LoadsPeriod;
  page: number;
  allLoaded: boolean;
  loadedPeriod: LoadsPeriod;
} = {
  withdrawals: [],
  loading: false,
  analyticsData: {
    totalSells: 0,
    averagePrice: 0,
    newBuyers: 0,
  },
  status: LoadsSwitcherStatus.ALL,
  search: '',
  period: '30-day',
  page: -1,
  allLoaded: false,
  loadedPeriod: undefined,
};

const LoadsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOADS.SET_LOADS:
      return {
        ...state,
        orders: action.payload,
      };

    case LOADS.SET_VALUES:
      return {
        ...state,
        ...action.payload,
      };

    case LOADS.SET_STATUS:
      return {
        ...state,
        status: action.payload,
      };

    case LOADS.SET_SEARCH:
      return {
        ...state,
        search: action.payload,
      };

    case LOADS.SET_PERIOD:
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

export default LoadsReducer;
