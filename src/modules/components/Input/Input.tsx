import * as React from 'react';
import { Component } from 'react';
import { Icon } from '../';

interface Props {
  label?: string;
  icon?: string;
  name: string;
  value?: any;
  type?: string;
  errors?: any;
  placeHolder?: string;
  minLength?: number;
  maxLength?: number;
  onChange?: Function;
  onFocus?: Function;
  className?: string;
  required?: boolean;
  styles?: object;
  classDiv?: string;
  checked?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  valid?: boolean;
  invalid?: boolean;
}

interface State {
  value: string;
}

class Input extends Component<Props, State> {
  /**
   * Hai Luong
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.value || ''
    };
    this.onChange = this.onChange.bind(this);
  }
  
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(e);
    }
  }

  render() {
    const { 
      className,
      placeHolder, 
      name, 
      type, 
      value, 
      icon,
      checked,
      disabled,
      readOnly,
    } = this.props;
    return (
      !icon ? (
        <React.Fragment>
          { 
            type === 'checkbox' || type === 'radio' ? (
              <input 
                className={className}
                type={type}
                name={name}
                value={value}
                disabled={disabled}
                checked={checked}
                readOnly={readOnly}
                onChange={this.onChange}
              />
            ) : (
              <input 
                className={className}
                placeholder={placeHolder}
                type={type}
                name={name}
                value={value}
                disabled={disabled}
                readOnly={readOnly}
                onChange={this.onChange}
              />
            )
          }
        </React.Fragment>
      ) : (
        <div className="input-icon">
          <span className="input-icon-addon">
            <Icon className={icon} prefix="fe" />
          </span>
          <input
            name={name}
            className={className}
            type={type}
            placeholder={placeHolder}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            onChange={this.onChange}
          />
        </div>
      )
    );
  }
}

export default Input;