import {
  AppstoreOutlined,
  MessageOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import React from 'react';
import { RouteProps } from 'react-router-dom';

import { Mobile } from '../Mobile';
import { SoftwareMesh } from '../SoftwareMesh';
import { Support } from '../Support';

export interface MenuConfig {
  menuProps: {
    disabled?: boolean;
    text: string;
    icon: string;
  };
  routeProps: RouteProps;
}

export const menuConfigs: MenuConfig[] = [
  {
    menuProps: {
      disabled: false,
      text: '软件工具',
      icon: ((<AppstoreOutlined />) as unknown) as string,
    },
    routeProps: {
      path: '/',
      component: SoftwareMesh,
      exact: true,
    },
  },
  {
    menuProps: {
      disabled: false,
      text: '联系我们',
      icon: ((<MessageOutlined />) as unknown) as string,
    },
    routeProps: {
      path: '/support',
      component: Support,
    },
  },
  {
    menuProps: {
      disabled: false,
      text: '手机下载',
      icon: ((<MobileOutlined />) as unknown) as string,
    },
    routeProps: {
      path: '/mobile',
      component: Mobile,
    },
  },
];
