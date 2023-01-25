import { CATEGORY } from '@action-types';
const INIT_STATE: {
  categories: CategoryModelType[];
} = {
  categories: [],
};

const CategoryReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case CATEGORY.SET_CATEGORY:
      return { ...state, categories: action.payload as CategoryModelType[] };

    default:
      return { ...state };
  }
};
export default CategoryReducer;
