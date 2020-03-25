import { Progress } from 'antd';
import electron, { ipcRenderer } from 'electron';
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, withRouter } from 'react-router';

import { AppState } from '@/ducks';
import { history } from '@/skeleton';
import * as R from 'rte-core';

import { Menu } from '../../components/Menu';
import { Toolbar } from '../../components/Toolbar';

import './index.scss';
import { menuConfigs } from './manifest';

import * as styles from './index.less';

export interface HomeProps extends RouteComponentProps {}

export interface HomeState {
  downloadProgress?: number;
}

export class HomeComp extends React.PureComponent<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);

    this.state = {};

    ipcRenderer.on('update-download-progress', (_: any, percent: number) => {
      this.setState({
        downloadProgress: percent,
      });
    });
  }

  renderMask(): JSX.Element {
    const downloadProgress = this.state.downloadProgress;
    return (
      <div className="update-mask flex-container">
        <p className="update-tip">当前版本过低，正在下载最新版...</p>
        <Progress percent={downloadProgress} strokeWidth={12} />
      </div>
    );
  }

  render() {
    const { downloadProgress } = this.state;

    const version = (electron.remote.getGlobal(
      'getVersion',
    ) as R.getVersionFunc)();

    return (
      <div className={styles.container}>
        <div className="app-container">
          <Toolbar>
            <div />
          </Toolbar>
          <div className="side-bar">
            <div className="logo" />
            <Menu
              defaultKey={history.location.pathname}
              onSelect={path => history.push(String(path))}
            >
              {menuConfigs
                .filter(m => !m.menuProps.disabled)
                .map(m => {
                  const { icon, text } = m.menuProps;
                  const { path } = m.routeProps;

                  return (
                    <Menu.Item key={path as string}>
                      {icon}
                      <span>{text}</span>
                    </Menu.Item>
                  );
                })}
            </Menu>
            <div className="version">{`version ${version}`}</div>
          </div>
          <div className="content">
            {menuConfigs.map(m => (
              <Route {...m.routeProps} key={m.routeProps.path as string} />
            ))}
          </div>
          {downloadProgress ? this.renderMask() : null}
        </div>
      </div>
    );
  }
}

export const Home = connect(
  (_state: AppState) => ({}),
  {},
)(withRouter(HomeComp));
