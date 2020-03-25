/* eslint-disable @typescript-eslint/no-var-requires */

import { app } from 'electron';
import log from 'electron-log';

import * as R from 'rte-core';

import { getVersion } from './provider';
import { AppManager } from './AppManager';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('electron-debug')({ showDevTools: true });
}

process.on('uncaughtException', error => {
  // Handle the error
  log.error(error);
});

declare const global: {
  searchLocation: R.searchLocationFunc;
  run: R.runFunc;
  download: R.downloadFunc;
  getVersion: R.getVersionFunc;
};

global.getVersion = getVersion;

const url =
  process.env.ELECTRON_START_URL || `file://${__dirname}/assets/index.html`;
const appManager = new AppManager(app, url);
appManager.initApp();
