/**
 * React renderer.
 */
import { remote } from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as R from 'rte-core';

// Import the styles here to process them with webpack
import './style.css';

ReactDOM.render(
  <div className="app">
    <h4>Welcome to React, Electron and Typescript</h4>
    <p
      onClick={() => {
        (remote.getGlobal('sayHello') as R.sayHelloFunc)();
      }}
    >
      Hello
    </p>
  </div>,
  document.getElementById('root'),
);
