import * as React from 'react';
import { Icon } from '../';

interface Props {
  link?: boolean;
  disabled?: boolean;
  child?: any;
  icon?: string;
  className?: string;
  to?: string;
  color?: string;
  RootComponent: Tag;
  type?: Type;
  onClick?: Function;
}

enum Type {
  button = 'button',
  submit = 'submit',
  reset = 'reset'
}

enum Tag {
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
      disabled,
      icon,
      className,
      to,
      color,
      RootComponent,
      type
    } = this.props;

    const contentAll = (
      <>
        {
          icon ? (
            <Icon prefix="fe" className={className} />
          ) : null
        }
        {React.Children}
      </>
    );

    if (!RootComponent || RootComponent === Tag.button) {
      return (
        <button type={type} color={color} className={className} disabled={disabled} onClick={this.onClick}>
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
        <input type={type} className={className} color={color} disabled={disabled} onClick={this.onClick} />
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