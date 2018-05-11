import * as React from 'react';
import { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Login from '../modules/containers/Login/LoginContainer';

import '../assets/css/main.min.css';

class App extends Component {
  render() {
    return (
      <div className="wrapper">
        <Switch>
          <Route exact={true} path="/login" component={Login} />
        </Switch>
      </div>
    );
  }
}

export default App;