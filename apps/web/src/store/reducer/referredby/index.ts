import { REFERREDBY } from '@action-types';

const INIT_STATE: {
  referredby: string;
} = {
  referredby: ''
};

const ReferredbyReducer = (state = INIT_STATE, action): typeof INIT_STATE => {
  switch (action.type) {
    case REFERREDBY.SET_REFERREDBY:
      return { ...state, referredby: action.payload };

    default:
      return { ...state };
  }
};
export default ReferredbyReducer;
