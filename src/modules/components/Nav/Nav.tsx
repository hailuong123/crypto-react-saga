import * as React from 'react';

interface Props {
  children?: any;
  className?: string;
}

interface State {}

class Nav extends React.Component<Props, State> {
  render() {
    const { children, className } = this.props;
    return (
      <nav>
        <ul className={className ? className : ''}>
          {children}
        </ul>
      </nav>
    );
  }
}

export default Nav;