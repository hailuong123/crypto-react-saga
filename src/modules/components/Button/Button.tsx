import * as React from 'react';
import { Icon } from '../';

interface Props {
  disabled?: boolean;
  children?: any;
  icon?: string;
  className?: string;
  to?: string;
  color?: string;
  RootComponent: 'button' | 'a' | 'input';
  type?: 'button' | 'submit' | 'reset';
  onClick?: Function;
  name?: string;
}

export enum Type {
  button = 'button',
  submit = 'submit',
  reset = 'reset'
}

export enum Tag {
  button = 'button',
  a = 'a',
  input = 'input'
}

interface State {}

class Button extends React.Component<Props, State> {

  onClick = (e: React.MouseEvent<any>) => {
    e.preventDefault();
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
  }

  render() {
    const {
      children,
      disabled,
      icon,
      className,
      to,
      color,
      RootComponent,
      type,
      name
    } = this.props;

    const contentAll = (
      <>
        {
          icon ? (
            <Icon prefix="fe" className={className} />
          ) : null
        }
        {children}
      </>
    );

    if (!RootComponent || RootComponent === Tag.button) {
      return (
        <button type={type} color={color} className={className} name={name} disabled={disabled} onClick={this.onClick}>
          {contentAll}
        </button>
      );
    } else if (RootComponent === Tag.a) {
      return (
        <a className={className} color={color} onClick={this.onClick} href={to}>
          {contentAll}
        </a>
      );
    } else if (RootComponent === Tag.input) {
      return (
        <input type={type} className={className} color={color} name={name} disabled={disabled} onClick={this.onClick} />
      );
    } else {
      const ComponentButton: any = RootComponent;
      return (
        <ComponentButton className={className} color={color} to={to} onClick={this.onClick}>
          {contentAll}
        </ComponentButton>
      );
    }
  }
}

export default Button;