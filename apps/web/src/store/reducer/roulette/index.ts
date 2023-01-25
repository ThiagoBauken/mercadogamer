import { ROULETTE } from '@action-types';

const INIT_STATE: {
  canPlay: boolean;
  history: PaginatedResponseType<RouletteTransactionModelType>;
} = {
  canPlay: false,
  history: null,
};

const RouletteReducer = (state = INIT_STATE, action): typeof INIT_STATE => {
  switch (action.type) {
    case ROULETTE.SET_VALUE:
      return { ...state, ...action.payload };

    case ROULETTE.CAN_PLAY:
      return { ...state, canPlay: action.payload };

    case ROULETTE.HISTORY:
      return { ...state, history: action.payload };

    default:
      return { ...state };
  }
};
export default RouletteReducer;
