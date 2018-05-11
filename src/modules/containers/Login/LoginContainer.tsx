import * as React from 'react';
import { Component } from 'react';
import { Input } from '../../components';

class LoginContainer extends Component<{}, {}> {
  state = {
    value: {
      username: '',
      password: ''
    }
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      value: {
        ...this.state.value,
        [e.target.name]: e.target.value
      }
    });
  }

  render() {
    const { value } = this.state;

    return (
      <>
        <div>
          <Input 
            type="text"
            name="username"
            className="username"
            placeHolder="Username"
            onChange={this.onChange}
            icon="user"
            value={value.username}
          />
        </div>
        <div>
          <Input 
            type="password"
            name="password"
            className="password"
            placeHolder="Password"
            onChange={this.onChange}
            icon="lock"
            value={value.password}
          />
        </div>
      </>
    );
  }
}

export default LoginContainer;