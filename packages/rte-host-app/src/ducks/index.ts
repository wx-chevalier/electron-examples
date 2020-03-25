import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { ReducersMapObject, combineReducers } from 'redux';

import userReducer, { IState as UserState } from '../apps/user/ducks/user';

export interface AppState {
  user: UserState;
}

export const configReducer = (partialReducers: ReducersMapObject = {}) => (
  history: History,
) =>
  combineReducers({
    user: userReducer,
    router: connectRouter(history),
    ...partialReducers,
  });
