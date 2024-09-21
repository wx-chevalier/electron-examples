import { Base } from 'ueact-utils';

import { InstallableApp } from './InstallableApp';

export class InstallableAppSeries extends Base {
  name: string;

  key: string;

  apps: InstallableApp[];

  order: number;

  description: string;
}
