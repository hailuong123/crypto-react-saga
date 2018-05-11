import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import registerServiceWorker from './registerServiceWorker';

import history from './utility/history';
import { store } from './store';

import App from './modules/App';
function WebApp() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  );
}

export const app = ReactDOM.render(
  <WebApp />, document.getElementById('root') as HTMLElement
);

registerServiceWorker();
