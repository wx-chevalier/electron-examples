import electron, { ipcRenderer } from 'electron';
import * as S from 'ueact-utils';

import { runFunc, searchLocationFunc } from '../funcs';

/** 应用定义 */
export class InstallableApp extends S.Base {
  // 是否隐藏
  hidden: boolean;

  // 全名
  name: string;

  // 默认快捷方式名
  lnk: string;

  // id
  key: string;

  // 版本
  version: string;

  // 简称
  label: string;

  // 下载链接
  url: string;

  // 图标
  icon: string;

  // exe 文件名称
  exe: string;

  // 安装包 md5，用于验证版本
  md5: string;

  order: number;

  regeditLocation: string;

  timer: NodeJS.Timer;

  // 本机路径
  location = '';

  downloadProgess = 0;

  downloading = false;

  get isInstalled() {
    return !!this.location;
  }

  setProgress = (_: any, percent: number) => {
    if (percent >= 100 || percent < 0) {
      this.downloading = false;
      this.downloadProgess = 0;
    } else {
      this.downloading = true;
      this.downloadProgess = percent;
    }
  };

  async getLocation(): Promise<void> {
    const searchLocation: searchLocationFunc = electron.remote.getGlobal(
      'searchLocation',
    );
    this.location = await searchLocation(this.regeditLocation, this.exe);
  }

  run(): void {
    if (!this.location) {
      return;
    }
    const run: runFunc = electron.remote.getGlobal('run');
    run(this.location);
  }

  install() {
    if (!this.url) {
      alert('抱歉, 产品即将上线.');
      return;
    }
    const cachePath = localStorage.getItem(`installer-${this.key}`);
    // this.downloading = true;
    ipcRenderer.on(`download-progress-${this.key}`, this.setProgress);
    ipcRenderer.once(`download-complete-${this.key}`, () => {
      ipcRenderer.removeListener(
        `download-progress-${this.key}`,
        this.setProgress,
      );
      this.downloading = false;
    });
    ipcRenderer.once(`get-location-${this.key}`, (_: any, location: string) => {
      this.location = location;
    });
    ipcRenderer.send('begin-download', this, cachePath);
  }

  constructor(data: InstallableApp) {
    super(data);

    if (!this.hidden) {
      this.getLocation();

      this.timer = setInterval(() => {
        this.getLocation();
      }, 1000 * 5);

      ipcRenderer.on(`get-installer-${this.key}`, (_: any, path: string) => {
        localStorage.setItem(`installer-${this.key}`, path);
      });
    }
  }
}
