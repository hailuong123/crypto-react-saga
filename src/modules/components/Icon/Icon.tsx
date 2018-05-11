import * as React from 'react';

interface Props {
  className?: string;
  prefix?: 'fe' | 'fa';
}

class Icon extends React.Component<Props, {}> {
  render() {
    const { className, prefix } = this.props;
    return (
      <i className={`${prefix} ${prefix}-${className}`} />
    );
  }
}

export default Icon;