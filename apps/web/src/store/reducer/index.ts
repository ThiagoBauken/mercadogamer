import { combineReducers } from 'redux';

import auth from './auth';
import cart from './cart';
import catalog from './catalog';
import category from './category';
import country from './country';
import game from './game';
import header from './header';
import home from './home';
import payment from './payment';
import paymentMethod from './payment-method';
import platform from './platform';
import roulette from './roulette';
import notification from './notification';
import referredby from './referredby'

export const combineReducer = combineReducers({
  auth,
  cart,
  catalog,
  category,
  country,
  game,
  header,
  home,
  platform,
  payment,
  paymentMethod,
  roulette,
  notification,
  referredby
});

const reducers = () => combineReducer;

export default reducers;
