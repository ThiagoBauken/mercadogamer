import { GAME } from '@action-types';

const INIT_STATE: {
  games: GameModelType[];
} = {
  games: [],
};

const GameReducer = (state = INIT_STATE, action): typeof INIT_STATE => {
  switch (action.type) {
    case GAME.SET_VALUE:
      return {
        ...state,
        ...action.payload,
      };

    case GAME.SET_GAMES:
      return {
        ...state,
        games: action.payload,
      };

    default:
      return { ...state };
  }
};
export default GameReducer;
