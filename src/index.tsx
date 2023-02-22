import React from 'react';
import ReactDOM from 'react-dom';

import './index.module.css';

// eslint-disable-next-line node/no-missing-import
import App from './components/app/content';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
