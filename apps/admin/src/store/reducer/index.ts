import { combineReducers } from 'redux';

import auth from './auth';
import county from './country';
import ventas from './ventas';
import loads from './loads';

export const combineReducer = combineReducers({
  auth,
  county,
  ventas,
  loads,
});

const reducers = () => combineReducer;

export default reducers;
