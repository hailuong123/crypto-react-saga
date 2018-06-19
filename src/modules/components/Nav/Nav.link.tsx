import * as React from 'react';
import { Icon } from '../';
import { NavLink } from 'react-router-dom';

interface Props {
  children?: any;
  className?: string;
  active?: boolean;
  image?: string;
  icon?: string;
  to?: string;
  hasSubNav?: boolean;
  RootComponent?: any;
  exact?: boolean;
}

interface State {}

class NavHref extends React.Component<Props, State> {
  render() {
    const {
      children,
      className,
      icon,
      to,
      hasSubNav,
      RootComponent,
      exact
    } = this.props;
    const contentAll = (
      <>
        {
          icon && (
            <Icon
              className={icon}
            />
          )
        }
        {children}
      </>
    );

    return (
      <>
        {
          RootComponent ? (
            <RootComponent
              className={className && className}
              to={to}
              data-toggle={hasSubNav && 'dropdown'}
              exact={exact}
            > 
              {contentAll}
            </RootComponent>
          ) : (
            <NavLink to={`${to}`} exact={exact}>
              {contentAll} 
            </NavLink>
          )
        }
        
      </>
    );
  }
}

export default NavHref;