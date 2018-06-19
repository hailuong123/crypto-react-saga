import * as React from 'react';

interface Props {
  className?: string;
  prefix?: string;
  fontSize?: number;
  decimals?: string;
}

class Icon extends React.Component<Props, {}> {
  render() {
    const { className, prefix, fontSize, decimals } = this.props;
    return (
      <i 
        className={`${prefix ? prefix : 'fe'} ${prefix ? prefix : 'fe'}-${className}`} 
        style={{fontSize: `${fontSize}${decimals}`}} 
      />
    );
  }
}

export default Icon;