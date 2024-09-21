import { HeartOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { shell } from 'electron';
import React, { Component } from 'react';

import './index.scss';

interface SupportState {
  expandButton: boolean;
}

enum QQGroup {
  JL,
  SG,
}

export class Support extends Component<{}, SupportState> {
  state = {
    expandButton: false,
  };

  getQQ(group: QQGroup): string {
    const KEY = 'kefu_qq' + group;
    let qq = localStorage.getItem(KEY);
    if (!qq) {
      let qqList: string[] | null;
      switch (group) {
        case QQGroup.JL:
          qqList = ['3014437365'];
          break;
        case QQGroup.SG:
          qqList = ['79157865', '1007008187'];
          break;
        default:
          qqList = null;
      }
      if (!qqList || qqList.length === 0) {
        return '';
      }
      const randomIndex = Math.floor(Math.random() * qqList.length);
      qq = qqList[randomIndex];
      localStorage.setItem(KEY, qq);
    }
    return qq;
  }

  handleOpenQQ = (group: QQGroup): void => {
    const qq = this.getQQ(group);
    if (!qq) {
      alert('客服不在线');
      return;
    }
    console.log(qq);
    shell.openExternal(
      `http://wpa.qq.com/msgrd?v=3&uin=${qq}&site=qq&menu=yes`,
    );
  };

  render() {
    const { expandButton } = this.state;
    const sgc = classnames('consult-button', { 'sg-button': expandButton });
    const jlc = classnames('consult-button', { 'jl-button': expandButton });
    return (
      <div className="consult-container">
        <div className="tips">
          <ul className="tips-list">
            <li>
              <p>
                <HeartOutlined />
              </p>
            </li>
          </ul>
        </div>
        <div
          className="open-qq"
          onClick={() => this.setState({ expandButton: !expandButton })}
          style={{ opacity: expandButton ? 0.3 : 1 }}
        >
          <div className="qq-icon" />
          <span>在线咨询</span>
        </div>
        <div className={sgc} onClick={() => this.handleOpenQQ(QQGroup.SG)}>
          QQ 1
        </div>
        <div className={jlc} onClick={() => this.handleOpenQQ(QQGroup.JL)}>
          QQ 2
        </div>
      </div>
    );
  }
}
