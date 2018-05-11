import * as React from 'react';

interface Props {
  children?: React.ReactNode;
}
class Container extends React.Component<Props, {}> {
  render() {
    return (
      <div className="container">
        {this.props.children}
      </div>
    );
  }
}

export default Container;
