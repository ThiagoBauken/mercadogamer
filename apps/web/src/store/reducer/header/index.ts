import { HEADER } from '@action-types';

const INIT_STATE: {
  search: string;
} = {
  search: '',
};

const HeaderReducer = (state = INIT_STATE, action): typeof INIT_STATE => {
  switch (action.type) {
    case HEADER.SET_SEARCH:
      return { ...state, search: action.payload };

    default:
      return { ...state };
  }
};
export default HeaderReducer;
