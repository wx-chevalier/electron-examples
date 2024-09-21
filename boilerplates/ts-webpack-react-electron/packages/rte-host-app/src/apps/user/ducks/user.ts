import { createActions, handleActions } from 'redux-actions';
import { handle } from 'redux-pack-fsa';
import * as S from 'ufc-schema';

import { getUsers } from '@/apis';

export interface IState {
  users: S.User[];
}

const initialState: IState = {
  users: [],
};

export const actions = createActions({
  async loadUsers() {
    return getUsers();
  },
});

export const userActions = actions;

export default handleActions<IState, any>(
  {
    [actions.loadUsers.toString()](state: IState, action) {
      const { payload } = action;

      return handle(state, action, {
        success: (prevState: IState) => ({ ...prevState, users: payload }),
      });
    },
  },

  initialState,
);
