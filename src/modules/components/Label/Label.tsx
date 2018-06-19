import * as React from 'react';

interface Props {
  className?: string;
  required?: boolean;
  text?: string;
}

class Label extends React.Component<Props, {}> {
  render() {
    const { text, className, required } = this.props;
    return (
      <label className={className}>
        {text}
        {
          required && <span className="required">*</span>
        }
      </label>
    );
  }
}

export default Label;