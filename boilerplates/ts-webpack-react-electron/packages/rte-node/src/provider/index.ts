/* eslint-disable @typescript-eslint/no-require-imports */
import * as crypto from '@ravshansbox/browser-crypto';
import * as childProcess from 'child_process';
import { BrowserWindow, app, dialog, ipcMain } from 'electron';
import log from 'electron-log';
import * as fs from 'fs';
import * as path from 'path';

import * as R from 'rte-core';

const exeDir = path.dirname(app.getPath('exe'));
const extraDir = process.env.DEV
  ? path.join(__dirname, '../../extra')
  : path.join(exeDir, './resources/extra');

export const getVersion = () => 'Hello';

export const searchLocation: R.searchLocationFunc = async (
  rPath: string,
  exe: string,
): Promise<string> => {
  return new Promise<string>((resolve, _) => {
    const vbsDir = path.join(extraDir, './regedit/vbs');
    if (process.platform !== 'win32') {
      return resolve('');
    }
    const HKEY_LOCAL_MACHINE = 'HKLM';
    const cmpletePath = path.join(HKEY_LOCAL_MACHINE, rPath);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const regedit = require('regedit');
    regedit.setExternalVBSLocation(vbsDir);
    regedit.arch.list32(cmpletePath, (err: Error, result: any) => {
      if (!err) {
        try {
          const installPath: string =
            result[cmpletePath].values.InstallPath.value;
          const exePath: string = path.join(installPath, exe);
          if (!fs.existsSync(exePath)) {
            resolve('');
          } else {
            resolve(exePath);
          }
        } catch (error) {
          resolve('');
        }
      } else {
        log.error('regedit error', err, cmpletePath);
        resolve('');
      }
    });
  });
};

function verifyFile(filePath: string, md5: string): Promise<boolean> {
  return new Promise((resolve, _) => {
    try {
      const hash = crypto.createHash('md5');
      const input = fs.createReadStream(filePath);
      const digest = () => {
        const data = input.read();
        if (data) hash.update(data);
        else {
          input.removeListener('readable', digest);
          const fileMD5 = hash.digest('hex').toLowerCase();
          resolve(md5.toLowerCase() === fileMD5);
        }
      };
      input.on('readable', digest);
    } catch (error) {
      resolve(false);
    }
  });
}

export function listenToDownload(window: BrowserWindow) {
  ipcMain.on(
    'begin-download',
    async (
      dEvent: any,
      product: R.InstallableApp,
      cachePath: string | null,
    ) => {
      const { key, url, md5 } = product;
      const endDownload = () =>
        dEvent.sender.send(`download-complete-${key}`, null);
      if (cachePath && fs.existsSync(cachePath)) {
        const isLatest = await verifyFile(cachePath, md5);
        if (isLatest) {
          run(cachePath);
          endDownload();
          return;
        } else {
          try {
            fs.unlinkSync(cachePath);
          } catch (error) {}
        }
      }

      window.webContents.session.once('will-download', (_, item, __) => {
        const totalBytes = item.getTotalBytes();
        item.on('updated', (_, state) => {
          if (state === 'interrupted') {
          } else if (state === 'progressing') {
            if (item.isPaused()) {
              console.log('Download is paused');
            } else {
              const percent = item.getReceivedBytes() / totalBytes;
              console.log(`Received bytes: ${item.getReceivedBytes()}`, key);
              dEvent.sender.send(
                `download-progress-${key}`,
                Math.floor(percent * 100),
              );
            }
          }
        });

        item.once('done', (_, state) => {
          if (state === 'completed') {
            console.log('Download successfully');

            // 记录安装包位置
            const savePath = item.getSavePath();
            dEvent.sender.send(`get-installer-${key}`, savePath);
            run(savePath);
          } else {
            console.log(`Download failed ${state}`);
            dialog.showErrorBox(
              '下载失败',
              `文件 ${item.getFilename()} 下载失败`,
            );
          }
          endDownload();
        });
      });
      window.webContents.downloadURL(url);
    },
  );
}

export const run = (exePath: string, uninstall?: boolean): void => {
  if (uninstall) {
    exePath = path.join(exePath, '..', 'uninst.exe');
  }
  if (!fs.existsSync(exePath)) {
    dialog.showErrorBox('运行失败', `执行失败：路径 ${exePath} 不存在！`);
    return;
  }
  childProcess.execFile(exePath, (err, _, __) => {
    if (err) {
      dialog.showErrorBox('运行失败', `执行失败：执行 ${exePath} 发生错误！`);
      log.error(err);
    }
  });
};

const caTool = path.join(extraDir, './ca/njcatools.exe');
const readLockResult = path.join(extraDir, './ca/result.txt');
const command = `"${caTool}" get-key-info "${readLockResult}"`;

export const readCALock: R.readCALockFunc = () => {
  return new Promise((resolve, reject) => {
    if (process.platform !== 'win32') {
      dialog.showErrorBox('无法读锁', '只能在 Windows 平台执行读锁操作');
      return reject(new Error('只能在 Windows 平台执行读锁操作'));
    }
    childProcess.exec(
      command,
      { timeout: 10000, shell: 'cmd.exe' },
      (err, stdout) => {
        if (err) {
          dialog.showErrorBox(
            '读锁程序错误',
            '请确保已有锁已插入（只能插一把锁）',
          );
          log.error('读锁程序错误', err, stdout);
          return reject(err);
        }
        try {
          const lockInfo = JSON.parse(
            fs.readFileSync(readLockResult).toString(),
          );
          fs.unlinkSync(readLockResult);
          const { KeyNum, UnitName } = lockInfo;
          if (!KeyNum || !UnitName) {
            dialog.showErrorBox(
              '读锁失败',
              '请确保已有锁已插入（只能插一把锁）',
            );
            return reject(new Error(`读锁失败：${lockInfo}`));
          } else {
            return resolve({ name: UnitName, key: KeyNum });
          }
        } catch (error) {
          log.error(error);
          return reject(error);
        }
      },
    );
  });
};
