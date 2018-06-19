import * as React from 'react';

interface Props {
  children?: any;
  className?: string;
  hasSubNav?: boolean;
  active?: boolean;
  onClick?: Function;
  type?: Type;
}

export enum Type {
  li  = 'li',
  div = 'div'
}

interface State {}

class NavItem extends React.Component<Props, State> {
  render() {
    const {
      children,
      className,
      hasSubNav,
      active,
      type
    } = this.props;
    return (
      <>
        {
          type === 'div' ? (
            <div className={`${className ? className : ''} ${active && 'active'} ${hasSubNav && 'dropdown'}`}>
              {children}
            </div>
          ) : (
            <li>
              {children}
            </li>
          )
        }
      </>
    );
  }
}

export default NavItem;