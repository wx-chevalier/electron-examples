import React from 'react';

import { InstallableApp, InstallableAppSeries } from 'rte-core';

import { InstallableAppView } from '../InstallableAppView';

import './index.scss';

export interface InstallableAppSeriesView {
  name: string;
  id: string;
  children: InstallableApp[];
}

interface InstallableAppSeriesViewProps {
  data: InstallableAppSeries;
}

export const InstallableAppSeriesView = (
  props: InstallableAppSeriesViewProps,
): JSX.Element => {
  const appSeries = props.data;
  return (
    <div className="product-line-container">
      <p className="product-line-name">{appSeries.name}</p>
      <div className="product-list" id={appSeries.key}>
        {appSeries.apps.map(p => (
          <InstallableAppView data={p} key={p.key} />
        ))}
      </div>
    </div>
  );
};
