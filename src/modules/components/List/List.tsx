import * as React from 'react';

interface Props {
  children?: any;
  Component?: any;
  className?: string;
}

interface State {}

class List extends React.Component<Props, State> {
  render() {
    const { Component, className, children } = this.props;
    return (
      <>
        {
          Component ? (
            <Component className={className}>
              {children}
            </Component>
          ) : (
            <ul className={className}>
              {children}
            </ul>
          )
        }
      </>
    );
  }
}

export default List;