import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers, { combineReducer } from './reducer';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

// export const history = createBrowserHistory();

const middleware = [thunk];

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));

export const store = createStore(
  reducers(),
  {},
  enhancer
  // compose(applyMiddleware(...middleware))
);

export type RootState = ReturnType<typeof combineReducer>;
export type AppDispatch = typeof store.dispatch;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAppDispatch = (): any => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export * from './actions';
