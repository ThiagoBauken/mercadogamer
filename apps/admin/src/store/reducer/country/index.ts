import { COUNTRY } from '../../types';

const INIT_STATE: {
  countries: CountryModelType[];
} = {
  countries: [],
};

const CountryReducer = (state = INIT_STATE, action): typeof INIT_STATE => {
  switch (action.type) {
    case COUNTRY.SET_COUNTRY:
      return { ...state, countries: action.payload };

    default:
      return { ...state };
  }
};
export default CountryReducer;
