import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import * as S from 'ufc-schema';

import { AppState } from '@/ducks';

import { userActions } from '../../ducks/user';

import styles from './index.less';

export interface IUserMeshProps extends RouteComponentProps {
  users: S.User[];
  loadUsers: () => void;
}

export interface IUserMeshState {
  visible: boolean;
  pageSize: number;
  pageNum: number;
}

export class UserListComp extends React.PureComponent<
  IUserMeshProps,
  IUserMeshState
> {
  constructor(props: IUserMeshProps) {
    super(props);

    this.state = {
      visible: false,
      pageSize: 1,
      pageNum: 10,
    };
  }

  async componentDidMount() {
    this.props.loadUsers();
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleOk = () => {
    this.setState({ visible: false });
  };

  render() {
    const { users } = this.props;

    return <div className={styles.container}>{JSON.stringify(users)}</div>;
  }
}

export const UserList = connect(
  (state: AppState) => ({
    users: state.user.users,
  }),
  {
    loadUsers: userActions.loadUsers,
  },
)(withRouter(UserListComp));
