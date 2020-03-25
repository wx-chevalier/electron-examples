import { Progress } from 'antd';
import React, { Component } from 'react';

import { InstallableApp } from 'rte-core';

import './index.scss';

const icons = {};

interface InstallableAppViewProps {
  data: InstallableApp;
}

export class InstallableAppView extends Component<InstallableAppViewProps, {}> {
  render() {
    const product = this.props.data;
    const {
      label,
      icon,
      isInstalled,
      downloading,
      downloadProgess,
      hidden,
      order,
    } = product;
    if (hidden) {
      return null;
    }
    let button: JSX.Element;
    if (downloading) {
      button = (
        <div className="product-button button-downloading">
          <Progress
            percent={downloadProgess}
            showInfo={true}
            strokeWidth={18}
          />
        </div>
      );
    } else if (isInstalled) {
      button = (
        <div
          className="product-button button-run"
          onClick={() => product.run()}
        >
          <span>打开</span>
        </div>
      );
    } else if (!product.url) {
      button = (
        <div className="product-button button-disabled">
          <span>即将上线</span>
        </div>
      );
    } else {
      button = (
        <div
          className="product-button button-download"
          onClick={() => product.install()}
        >
          <span>安装</span>
        </div>
      );
    }
    // const iconUrl = icon
    return (
      <div className="product-container" style={{ order: order }}>
        <div
          className="product-icon"
          style={{ backgroundImage: `url(${icons[icon]})` }}
          onClick={() => isInstalled && product.run()}
        />
        <div className="product-name">{label}</div>
        {button}
      </div>
    );
  }
}
