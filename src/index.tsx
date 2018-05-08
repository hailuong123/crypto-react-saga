import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import registerServiceWorker from './registerServiceWorker';

import history from './utility/history';

function App() {
  return (
    <Provider store={undefined}>
      <Router history={history}>
        <div>
          To do
        </div>
      </Router>
    </Provider>
  );
}

export const app = ReactDOM.render(
  <App />, document.getElementById('root') as HTMLElement
);

registerServiceWorker();
