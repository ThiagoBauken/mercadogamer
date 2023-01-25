import { PLATFORM } from '@action-types';
const INIT_STATE: {
  platforms: PlatformModelType[];
} = {
  platforms: [],
};

const CatalogReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case PLATFORM.SET_PLATFORM:
      return {
        ...state,
        platforms: action.payload as PlatformModelType[],
      };

    default:
      return { ...state };
  }
};
export default CatalogReducer;
