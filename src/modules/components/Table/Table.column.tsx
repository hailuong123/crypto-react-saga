import * as React from 'react';

interface Props {
  children?: any;
  className?: string;
  alignContent?: Algin;
}

enum Algin {
  left   = 'left',
  right  = 'right',
  center = 'center'
}

class TableColumn extends React.Component<Props, {}> {
  render() {
    const { children, className, alignContent } = this.props;
    return (
      <td className={`${className} ${alignContent ? 'text-' + alignContent : null }`}>
        {children}
      </td>
    );
  }
}

export default TableColumn;