import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './index.module.css';

import App from './components/app';
import { store } from './services/store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store = { store }>
      <App />
    </Provider>
    <div id = 'modal-container' />
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement,
);
