import * as React from 'react';

interface Props {
  children?: any;
  Component?: any;
  className?: string;
  onClick?: Function;
}

interface State {}

class ListItem extends React.Component<Props, State> {
  onClick = () => {
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
  }
  render() {
    const { Component, className, children } = this.props;
    return (
      <>
        {
          Component ? (
            <Component className={className} onClick={this.onClick}>
              {children}
            </Component>
          ) : (
            <li className={className} onClick={this.onClick}>
              {children}
            </li>
          )
        }
      </>
    );
  }
}

export default ListItem;