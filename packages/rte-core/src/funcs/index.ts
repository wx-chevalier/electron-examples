import { InstallableApp } from '../models/InstallableApp';

export type searchLocationFunc = (
  rPath: string,
  exe: string,
) => Promise<string>;
export type runFunc = (exePath: string, uninstall?: boolean) => void;
export type downloadFunc = (product: InstallableApp) => void;
export type readCALockFunc = () => Promise<{ name: string; key: string }>;
export type sayHelloFunc = () => string;
