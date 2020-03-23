import { App, BrowserWindow, Menu, Tray, dialog } from 'electron';
import * as path from 'path';

import { listenToDownload } from './provider';
import UpdateService from './service/UpdateService';

export class AppManager {
  mainWindow: BrowserWindow;
  tray: Tray;

  // 单实例检查
  singleInstanceCheck() {
    const isSecondInstance = !this.app.requestSingleInstanceLock();
    if (isSecondInstance) {
      const window = this.mainWindow;
      // Someone tried to run a second instance, we should focus our window.
      if (window) {
        if (window.isMinimized()) {
          window.restore();
        }
        window.show();
        window.focus();
      }
    }

    return isSecondInstance;
  }

  // 初始化窗口
  initWindow() {
    this.app.on('ready', () => {
      const window = (this.mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        frame: false,
        resizable: false,
        show: false,
      }));
      window.once('ready-to-show', () => {
        window.show();
      });
      window.loadURL(this.url);
      listenToDownload(window);
    });
  }

  // 处理退出行为
  registerQuit() {
    this.app.on('window-all-closed', () => {
      this.app.quit();
    });
  }

  // 初始化托盘
  initTray() {
    // 创建系统托盘图标
    this.app.on('ready', () => {
      const iconPath = path.join(__dirname, './assets/icon.ico');
      try {
        const tray = (this.tray = new Tray(iconPath));
        const contextMenu = Menu.buildFromTemplate([
          {
            label: '显示',
            click: () => {
              this.mainWindow.show();
            },
          },
          {
            label: '退出',
            click: () => {
              this.app.quit();
            },
          },
        ]);
        tray.on('click', () => this.mainWindow.show());
        tray.setToolTip('JustApp');
        tray.setContextMenu(contextMenu);
      } catch (e) {
        console.error(e);
      }
    });
  }

  // 检查更新
  checkUpdate() {
    this.updateService.checkUpdate(
      progress => {
        this.mainWindow.webContents.send(
          'update-download-progress',
          progress.percent.toFixed(2),
        );
      },
      () => {
        dialog.showMessageBox(this.mainWindow, {
          title: '安装更新',
          message: '新版本下载完成，请点击确定安装新版本。',
        });

        this.updateService.installUpdate();
      },
    );
  }

  initApp() {
    const shouldQuit = this.singleInstanceCheck();
    if (shouldQuit) {
      this.app.quit();
      return;
    }
    this.initWindow();
    this.initTray();
    this.registerQuit();
    this.checkUpdate();
  }

  constructor(
    public app: App,
    public url: string,
    public updateService: UpdateService = new UpdateService(),
  ) {}
}
